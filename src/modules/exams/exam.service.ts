import prisma from '../../config/db.ts'
import { env } from '../../config/env.ts'
import { HttpError } from '../../lib/utils.ts'
import type { GenerateExamSchema } from './exam.model.ts'

// Alias of the newest Flash model, so a retired version can't break exams again
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent'

// shortcut: attachments are sent inline, so files beyond ~14MB (≈19MB once base64'd) are skipped, move to the Gemini Files API if topics outgrow it
const MAX_INLINE_BYTES = 14 * 1024 * 1024

const MIME_TYPES: Record<string, string> = {
    pdf: 'application/pdf',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
}

const SYSTEM_PROMPT = `Eres un profesor que prepara exámenes.
Usa SOLO el material proporcionado (el texto de los posts y sus archivos adjuntos); no añadas contenido externo.
Cubre todos los posts de forma equilibrada.
Escribe en español con ortografía correcta (tildes y ñ incluidas), en texto plano sin Markdown.
Incluye 10 preguntas numeradas: 6 de tipo test con 4 opciones (a-d) y 4 de respuesta corta o desarrollo.
Al final, añade una sección "Respuestas" con la solución de cada pregunta.`

type Part = { text: string } | { inline_data: { mime_type: string; data: string } }

// Only Cloudinary URLs are fetched: post file URLs come from the client, so anything else could make the server fetch internal addresses
const isCloudinaryUrl = (url: string) => {
    try {
        const { protocol, hostname } = new URL(url)
        return protocol === 'https:' && hostname === 'res.cloudinary.com'
    } catch {
        return false
    }
}

export const generateExam = async ({ topicId }: GenerateExamSchema) => {
    if (!env.GEMINI_KEY) {
        throw new HttpError(503, 'La generación de exámenes no está configurada')
    }

    const topic = await prisma.topic.findUnique({
        where: { id: topicId },
        select: {
            title: true,
            description: true,
            posts: {
                orderBy: { createdAt: 'desc' },
                select: { title: true, content: true, file: { select: { url: true, fileType: true } } },
            },
        },
    })

    if (!topic || topic.posts.length === 0) {
        throw new HttpError(400, 'Este tema todavía no tiene posts para generar un examen')
    }

    const parts: Part[] = [{ text: `Tema: ${topic.title}\n${topic.description ?? ''}` }]
    let budget = MAX_INLINE_BYTES
    let skippedFiles = 0

    // newest posts first, so if the budget runs out it's the oldest attachments that get left out
    for (const post of topic.posts) {
        parts.push({ text: `## ${post.title}\n${post.content ?? ''}` })

        for (const file of post.file) {
            const mimeType = MIME_TYPES[file.fileType.toLowerCase()]
            if (!mimeType || !isCloudinaryUrl(file.url)) continue

            const response = await fetch(file.url)
            const bytes = response.ok ? Buffer.from(await response.arrayBuffer()) : null
            if (!bytes || bytes.length > budget) {
                skippedFiles++
                continue
            }

            budget -= bytes.length
            parts.push({ inline_data: { mime_type: mimeType, data: bytes.toString('base64') } })
        }
    }

    parts.push({ text: 'Genera el examen a partir de este material.' })

    const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_KEY },
        body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [{ role: 'user', parts }],
        }),
    })
    const data = await response.json()
    const exam = data.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? '').join('')

    if (!response.ok || !exam) {
        throw new HttpError(502, 'No se pudo generar el examen')
    }

    const note =
        skippedFiles > 0
            ? `\n\n(Nota: ${skippedFiles} archivo(s) no se incluyeron por tamaño o error de descarga.)`
            : ''

    return { output: exam + note }
}
