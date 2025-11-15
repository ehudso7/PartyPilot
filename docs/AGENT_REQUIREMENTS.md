# AGENT_REQUIREMENTS – PartyPilot

1. Never invent external APIs.
2. Wrap all external services behind internal provider modules.
3. All TS code must compile with `strict: true`.
4. No TODO placeholders in core flows without explanation.
5. Use environment variables for all external keys.
6. Run migrations and basic tests before declaring a feature "done".
7. Follow PRD, DB_SCHEMA, API_SPEC, ARCHITECTURE strictly unless explicitly updated.