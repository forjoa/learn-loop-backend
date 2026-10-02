# TODO — Learn Loop (backend)

- [ ] **Confirm Render auto-deployed** the recent pushes (chat lookup endpoint, topic preview/chatId, enrollment status/pending/dedupe) if auto-deploy is enabled on the dashboard — `render.yaml` alone doesn't deploy anything until the Blueprint is linked (see `CLAUDE.md`).
- [ ] **`DELETE /topics/delete` fails once a topic has any enrollment row** (2026-10-02) — `prisma.topic.delete()` throws a foreign key constraint violation on `enrollment_topic_id_fkey`. The Prisma schema's `enrollment` → `topic` relation needs `onDelete: Cascade` (or the delete service needs to explicitly delete dependent enrollments/chats first). Found while cleaning up test data manually; not yet reachable from any UI, but will block it once a "delete topic" button exists.
