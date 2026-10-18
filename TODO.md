# TODO — Learn Loop (backend)

- [ ] **README.md documents the pre-REST routes** (2026-10-18) — every endpoint section is stale since the RESTful refactor.
- [ ] **Exam generation has no rate limit** (2026-10-18) — `POST /topics/:topicId/exam` calls Gemini on every request (~15-25s, billed per call), only the topic owner can trigger it but nothing stops repeated calls; add a per-user limit or cache the last exam per topic if usage/cost grows.
