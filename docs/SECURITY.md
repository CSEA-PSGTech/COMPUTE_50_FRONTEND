# Security Guidelines - Compute 50 Frontend

## Frontend Security Rules [from code]
- **Secrets & Credentials**: Never commit `.env` or sensitive API keys. Use `import.meta.env.VITE_*` for public environment variables only.
- **Tokens**: JWT tokens stored in `localStorage` (`compute50_auth_token`) are attached via Axios interceptors in [`api.ts`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/services/api.ts).
- **Client Route Guards**: Protected routes (`/profile`) use [`ProtectedRoute.tsx`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/routes/ProtectedRoute.tsx) to redirect unauthenticated users to `/login`.
- **Tunnel Safety**: Development proxy/tunnel hosts must be explicitly allowed in [`vite.config.ts`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/vite.config.ts).

Auth method: | Roles and permissions: (enforced server-side)
Secrets: env vars only, never committed; `.env.example` lists names
Input validation: | Rate limiting: | CORS: | File uploads (types, size):
Never log: passwords, tokens, keys, personal data
Checklist: [ ] auth [ ] authz [ ] validation [ ] secrets [ ] rate limit [ ] error messages leak nothing [ ] dependencies reviewed
