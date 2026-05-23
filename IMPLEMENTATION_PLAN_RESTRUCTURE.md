# IMPLEMENTATION_PLAN_RESTRUCTURE.md — todo-list-web-dashboard (Reformation)

## Goal
Re-structure the existing Angular frontend so it matches the required architecture categories:
- models
- services
- from/controller (form controllers + submit handlers)
- tokens
- ui-kit (ui specifications: colors, popups, status code/error popup, alerts, invalid states, header/footer, templates, fonts, style, layouts,)
- rest apis
- api payload
- ui screens
- html/templates + ts/controllers + css (using ui-kit CSS/variables)

This plan **does not restart the project**; it reorganizes existing code into clear folders while keeping functionality.

---

## 1) Information Gathered (current structure)
From the repo at `Todo-List-web-dashboard/`:
- Screens exist as standalone components under:
  - `src/app/components/auth/*`
  - `src/app/components/dashboard/*`
  - `src/app/features/todos/*`
- API wrapper exists (HTTP client) under:
  - `src/app/core/http/api.service.ts`
- Domain services exist under:
  - `src/app/services/auth.service.ts`
  - `src/app/services/todo.service.ts`
- CSRF/interceptors are under:
  - `src/app/interceptors/*`
- Shared UI exists under:
  - `src/app/shared/components/*` (modal, pagination, toast, loading spinner)
- Models exist under:
  - `src/app/models/*`
- Tailwind styling exists (mostly utility classes) plus `src/styles.css`

---

## 2) Restructure Targets (required architecture mapping)
### 2.1 models
**Keep:** `src/app/models/*`

### 2.2 api payload (separate logical folder)
Option A (minimal changes): keep in `src/app/models/*` but rename groups in comments.
Option B (preferred): create `src/app/api-payload/*` and move:
- `auth-request.interface.ts`
- `auth-response.interface.ts`
- `todo-request.interface.ts`
- `section-request.interface.ts`
- `api-response.interface.ts`
- `page-response.interface.ts`

### 2.3 rest apis (REST services layer)
Create `src/app/skills/api/*` (or `src/app/skills/api/clients/*`) and move/organize:
- current `core/http/api.service.ts`
- future: `auth.client.ts`, `todo.client.ts`, `sections.client.ts`

### 2.4 services (domain services)
Create `src/app/services/*` or `src/app/skills/*` separation:
- `auth.service.ts`
- `todo.service.ts`
- `todo-facade.service.ts`

### 2.5 from/controllers (form controllers + submit handlers)
Current code mixes form logic inside components. Create:
- `src/app/formControllers/auth/login.controller.ts`
- `src/app/formControllers/auth/register.controller.ts`
- `src/app/formControllers/todo/todo-form.controller.ts`
- (optional) `src/app/formControllers/sections/section-form.controller.ts`

Components will be thin shells: build form -> call controller -> handle UI state.

### 2.6 tokens
Create `src/app/tokens/` for:
- `ui-tokens.ts` (status colors mapping)
- `http-tokens.ts` (header names)
- `csrf.constants.ts`

### 2.7 ui-kit (UI specification, reusable UI)
Create `src/app/ui-kit/` and migrate shared components + add styling tokens:
- `ui-kit/components/` (Button, Input, Modal, Toast, Pagination, Badge, Header/Footer)
- `ui-kit/styles/` (CSS variables for colors, spacing, typography)
- Replace direct prompt/confirm in dashboard with UI kit modal.

### 2.8 ui screens (html/templates + ts + css)
Keep screens as standalone components but ensure:
- `components/*` are categorized as `views/*` (screens)
- `features/*` become `views/dashboard/*` and `views/todos/*` (if you want strictness)

---

## 3) Concrete Implementation Steps (ordered)
### Phase A — Create folder structure (no logic change)
1. Create folders:
   - `src/app/skills/api/`
   - `src/app/skills/auth/`
   - `src/app/skills/csrf/`
   - `src/app/ui-kit/components/`
   - `src/app/ui-kit/styles/`
   - `src/app/formControllers/`
   - `src/app/tokens/`
2. Update existing imports as needed.

### Phase B — Move existing code into the target folders
3. Move/mirror:
   - models stay: `src/app/models/*`
   - interceptors stay or move to `src/app/skills/csrf/*` (optional)
   - `core/http/api.service.ts` -> `skills/api/http-client.ts`
   - `services/*` -> keep but ensure they depend on `skills/api/*`
   - `shared/components/*` -> `ui-kit/components/*`

### Phase C — Tokenize UI (colors + status/popup templates)
4. Add UI color variables in a single CSS entry (or Tailwind theme extension if required):
   - `--color-status-pending`
   - `--color-status-in-progress`
   - `--color-status-completed`
   - `--color-priority-low/medium/high`
5. Implement UI kit components:
   - Error popup (status code -> message mapping)
   - Invalid state styling for form fields
   - Header/footer templates for the dashboard

### Phase D — Form controllers
6. Extract form submit logic from:
   - `components/auth/login/login.ts`
   - `components/auth/registration/registration.ts`
   - `features/todos/components/todo-form/todo-form.component.ts` (or dashboard modal logic)
7. Controllers handle:
   - form validation checks
   - calling service methods
   - mapping `ApiResponse` errors into UI error state

### Phase E — Replace prompt/confirm with UI kit popups
8. Replace:
   - `prompt('Enter new section name')`
   - `confirm('Are you sure?')`
   with UI kit modal components.

### Phase F — Final verification
9. Run build and manual flows:
   - Login
   - Register
   - Create todo
   - Update todo
   - Delete todo
   - Add/rename/delete sections (if backend wired)
   - 401 redirect behavior
   - CSRF header behavior

---

## 4) Deliverables checklist
- [ ] Folder structure created
- [ ] API wrapper reorganized under skills/api
- [ ] Domain services depend on skills/api
- [ ] Form controllers extracted
- [ ] ui-kit components and CSS variables created
- [ ] Screens use ui-kit components
- [ ] No broken imports; project builds


