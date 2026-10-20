# API Integration - Compute 50 Frontend

## Overview [from code]
This repository does not implement backend route handlers. It consumes an external REST API configured via `VITE_API_BASE_URL` (default `http://localhost:5000/api`).

Team create/join currently runs as a frontend prototype backed by browser local storage (`compute50_teams`). This allows multiple accounts in the same browser profile to join by team ID. It does not synchronize across browsers or devices. Cross-device team registration requires persistent backend create-team, join-team, and team-lookup endpoints.

## HTTP Client & Authentication Interceptor [from code]
- Client instance configured in [`src/services/api.ts`](file:///d:/Workspace/Projects/Compute_50_Frontend_Backup/src/services/api.ts) using Axios.
- Request Interceptor: Automatically reads `compute50_auth_token` from `localStorage` and appends `Authorization: Bearer <token>` header to all requests.
- Response Interceptor: Clears `compute50_auth_token` from `localStorage` if response status is `401 Unauthorized`.

## Conventions
Success: `{ "data": {}, "error": null }`
Error: `{ "data": null, "error": { "code": "INVALID_REQUEST", "message": "..." } }`
Status codes: 400 validation, 401 unauthenticated, 403 forbidden, 404 not found, 429 rate limit, 500 server.
## Endpoints
### POST /api/hackathon/register
Auth: Bearer JWT Token | Request: `RegisterData` (with `teamMembers: Array<TeamMember>`) | Validation: 2-4 members, required rollNumber, phone, valid email | Response: `{ "user": User, "token": string }`

