# enContacto

App de chat en tiempo real. Los usuarios pueden iniciar/cerrar sesión  y participar en múltiples salas de chat simultáneamente. Los administradores pueden gestionar salas (crear/eliminar) y usuarios (listar/eliminar) desde un panel exclusivo.

## Funcionalidades

- **Login / Logout** — autenticación con token JWT almacenado en localStorage
- **Registro de usuarios** — un nuevo usuario puede crearse y luego ingresar
- **Salas de chat** — listado de salas disponibles, cada una con su propio historial de mensajes
- **Mensajería en tiempo real** — enviar y recibir mensajes dentro de cada sala
- **Panel de administración** — crear y eliminar salas, crear y eliminar usuarios

## Tecnologías

| Capa          | Tecnologías |
|---------------|-------------|
| Frontend      | React 19, TypeScript, Vite, React Router 7 |
| UI/Styles     | CSS modules (tokens, reset, utilities) |
| HTTP          | Axios |
| Testing       | Vitest + React Testing Library (unitarios), Playwright (E2E) |
| API Backend   | https://en-contacto-api.vercel.app/api |
| Deploy        | Vercel |

## Scripts

```bash
pnpm dev        # desarrollo
pnpm build      # build
pnpm lint       # ESLint
pnpm typecheck  # TypeScript
pnpm test:run   # tests unitarios (Vitest)
pnpm test:e2e   # tests E2E (Playwright)
```

## Tests

- **Unitarios:** (servicios) + (componentes) + (contextos)
- **E2E:** Playwright sobre flujos completos de navegación

**Deploy:** https://en-contacto-complete.vercel.app/
