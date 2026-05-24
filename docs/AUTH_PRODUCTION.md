# Supabase Auth — production redirect URLs for app.bharatgig.live

Configure in **Supabase Dashboard → Authentication → URL Configuration** for project `jsdmmskzwnqhmxboergf`.

## Site URL

```
https://app.bharatgig.live
```

## Redirect URLs (add all)

```
https://app.bharatgig.live/auth/callback
https://app.bharatgig.live/oauth/callback
https://app.bharatgig.live/dashboard
https://app.bharatgig.live/**
http://localhost:8080/auth/callback
http://localhost:8080/**
```

## Google OAuth provider

**Authentication → Providers → Google** — enabled with Client ID + Secret from Google Cloud Console.

**Authorized redirect URI in Google Cloud Console** (Supabase handles Google callback):

```
https://jsdmmskzwnqhmxboergf.supabase.co/auth/v1/callback
```

## Production auth flow

1. User opens https://app.bharatgig.live/auth
2. **Continue with Google** → Supabase OAuth (PKCE)
3. Google → Supabase → https://app.bharatgig.live/auth/callback?code=…
4. App exchanges code → session → `/dashboard` (or `/onboarding` if new worker)

## Legacy Lovable paths (handled in SPA)

| Path | Handler |
|------|---------|
| `/~oauth/initiate` | Restarts Supabase Google OAuth |
| `/oauth/initiate` | Redirects to `/~oauth/initiate` |
| `/oauth/callback` | Same as `/auth/callback` |

## Vercel SPA

All routes rewrite to `index.html` via `vercel.json` and prebuilt `config.json` catch-all.
