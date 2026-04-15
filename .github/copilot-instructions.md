# PrimeraDental Copilot Instructions

## Global Instructions & AI Directives

- **Plan Before Execution**: Never write or output code immediately. Always propose a high-level
  architectural plan first. Offer 2-3 structured approaches or solutions, highlighting the
  trade-offs of each. Wait for explicit selection before writing any code.
- **Zero Assumptions**: If a request is ambiguous, lacks scope, or you do not have sufficient
  context from the open files, stop. Do not hallucinate or guess. Ask specific, clarifying questions
  to get the required information.
- **Match Existing Patterns**: Analyze the surrounding codebase. Strictly adapt to and replicate the
  existing coding style, naming conventions, and structural patterns.
- **Long-Term Maintainability**: Prioritize the long run. Adhere to strict best practices to avoid
  technical debt. Code must be clean, modular, and scalable.
- **Complete Output**: Once a plan is approved, provide the full code for the solution. Do not use
  placeholders, and do not omit sections for brevity. Provide only the code, with no unnecessary
  elaboration unless explicitly asked to explain it.
- **Database Context & Updates**: Rely on `FINAL-COMPLETE-SCHEMA.sql` as the ultimate source of
  truth for database schema design. For any database schema updates or additions, you must provide
  the SQL migration script to execute, and state that `FINAL-COMPLETE-SCHEMA.sql` needs to be
  updated with those changes.
- **Uncodixfy UI Skills**: If instructed to use Uncodixfy skills or guidelines, STRICTLY adhere to
  the UI rules defined in `Uncodixfy/Uncodixfy.md`. Avoid default AI aesthetic patterns (e.g.,
  oversized rounded corners, floating panels, soft gradients, eyebrow labels). Stick to "normal" UI
  components that feel human-designed, functional, and honest (e.g., Linear, Raycast, Stripe,
  GitHub). Do not invent new layouts; replicate clean, standard components without unnecessary
  decoration.

## Architecture Overview

- **Monorepo setup**: Built using Turborepo (`pnpm turbo`).
- **Services**:
    - `apps/api`: Backend service (runs on `http://localhost:5000`)
    - `apps/user`: Patient facing app (`http://localhost:5173`)
    - `apps/admin`: Administrator portal (`http://localhost:5174`)
    - `apps/secretary`: Reception/Booking management (`http://localhost:5175`)
    - `apps/doctor`: Clinician interface (`http://localhost:5176`)

## Development Workflows

- **Package Manager**: Always use `pnpm` (version `10.29.3` specified).
- **Start the environments**: Use `pnpm run dev` from the root, which runs `turbo dev` and spits out
  local links.
- **Build**: Use `pnpm run build` from root.

## Conventions

- Changes spanning frontend and backend should be properly grouped by feature in `apps/`.
- Ensure appropriate usage of turbo when resolving build tasks.
