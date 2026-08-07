# Ecolink — Climate Change Awareness App for Cameroon

A mobile app (React Native + Expo) with an Express.js REST API and Supabase
backend, helping people in Cameroon understand and prepare for climate
change: real-time weather, climate education, health risks, community flood
reporting, an interactive map, and daily climate news.

Design system: green & white only, built around the **Ecolink** brand.

All core modules are wired end to end — authentication, weather, news,
climate education, the health/disease module, community flood reporting
(with a map), notifications, and settings/dark-mode — front to back through
the Express API. Screens fall back to bundled sample data if the backend is
unreachable, so the app stays demoable offline; wire in real Supabase +
OpenWeather/NewsAPI credentials to go live with real data everywhere.

Also included: real, sourced **Climate Initiatives** (Cameroonian/African
climate NGOs and government bodies, each linking to its own official page)
on the Weather screen; a **live location** flow (with an in-app explainer
before the OS permission prompt) that resolves GPS to the nearest of
Cameroon's 10 regions and personalizes weather/news/tips automatically; a
**daily push notification** job with region-specific climate-improvement
tips (e.g. Douala vs. Far North get different advice), readable in full
from the in-app Notifications screen or the Local Climate Tips screen; and
a continuously self-refreshing, multi-agency news feed.

## Architecture

```
React Native App  ─────▶  Express REST API  ─────▶  Supabase (Postgres + Auth)
```

The app never talks to Supabase directly for business logic — everything
goes through the Express backend, which validates requests, enforces auth,
and is the only place holding the Supabase **service role** key.

## 1. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run `backend/supabase/schema.sql`. This creates
   all tables (`users`, `articles`, `bookmarks`, `weather_cache`,
   `weather_history`, `notifications`, `climate_tips`,
   `disease_information`, `educational_content`, `climate_initiatives`,
   `flood_reports`) and their Row Level Security policies.
   - **Already have a project from before?** Re-run `schema.sql` — every
     statement is `create table if not exists` / additive, so it's safe to
     re-run and will add the new `climate_initiatives` table plus the new
     `users.push_token`/`latitude`/`longitude` and
     `notifications.type`/`region` columns without touching existing data.
     Until you do, those endpoints/features automatically fall back to
     built-in sample data (see `listInitiatives`, `getUsersForDailyTips` in
     the backend) rather than breaking.
3. From **Project Settings → API**, copy:
   - `Project URL` → `SUPABASE_URL`
   - `anon public` key → `SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret —
     backend only, never ship it in the app)
4. Under **Authentication → Providers**, enable Email sign-in and configure
   the confirmation/reset email templates as desired.

### Password Reset Emails (Custom SMTP)

Supabase's built-in email sender is a shared **testing sandbox** — a few
emails per hour, project-wide — not meant for real users. To make
password-reset (and signup confirmation) emails actually arrive, connect a
real SMTP provider. Two free options that work well for a project this size:

**Resend** (recommended — [resend.com](https://resend.com)): free tier is
3,000 emails/month (100/day), simple setup, and is what Supabase's own docs
point to.
1. Sign up at resend.com.
2. You can skip domain verification to start — Resend gives you a working
   sender (`onboarding@resend.dev`) usable immediately for testing. For
   production, verify your own domain under **Resend → Domains** (adds a
   couple of DNS records) so mail doesn't land in spam and comes from your
   own address instead.
3. Grab an API key from **Resend → API Keys** — their SMTP relay uses that
   key as both the username and password:
   - Host: `smtp.resend.com`
   - Port: `465` (SSL) or `587` (TLS)
   - Username: `resend`
   - Password: *your API key*

**Brevo** ([brevo.com](https://brevo.com), formerly Sendinblue) is a solid
alternative: 300 emails/day free, no monthly cap, similarly simple setup.

**Wire it into Supabase:**
1. Supabase Dashboard → your project → **Project Settings → Authentication
   → SMTP Settings**.
2. Toggle **Enable Custom SMTP** and fill in the host/port/username/password
   from your provider.
3. Set **Sender email** (e.g. `noreply@yourdomain.com`, or Resend's test
   address while testing) and **Sender name** (e.g. "Ecolink").
4. Save.

**One more required step — allow the app's redirect URL.** Supabase
rejects reset links to URLs it doesn't recognize. Go to **Authentication →
URL Configuration → Redirect URLs** and add:
```
ecolink://reset-password
```
This is the deep link the app registers (`app.json`'s `scheme: "ecolink"`);
`NewPasswordScreen.jsx` listens for it and lets the user set a new password
once they tap the emailed link. No code changes needed beyond this
dashboard config — the backend already passes `redirectTo` on the reset
email, and the app already completes the flow end to end.

## 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# fill in SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
npm run dev
```

The API starts on `http://localhost:4000`. Health check: `GET /health`.

### Environment Variables (backend/.env)

| Variable | Description |
|---|---|
| `PORT` | Port the API listens on (default 4000) |
| `NODE_ENV` | `development` / `production` |
| `CLIENT_ORIGIN` | Allowed CORS origin for the app |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (secret) |
| `PASSWORD_RESET_REDIRECT_URL` | Deep link the reset email sends users back to (default `ecolink://reset-password`) — must also be added to Supabase's Redirect URLs allow-list |
| `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX` | API rate limiting |
| `OPENWEATHER_API_KEY`, `NEWS_API_KEY`, etc. | External APIs for later modules |

### Backend Folder Structure

```
backend/src/
  config/        env.js, supabase.js
  controllers/   authController, weatherController, newsController, educationController,
                 userController, reportsController, notificationController
  routes/        authRoutes, weatherRoutes, newsRoutes, educationRoutes, reportRoutes,
                 userRoutes, notificationRoutes
  middleware/     authMiddleware (requireAuth + attachUser), validation, errorHandler
  services/      supabaseService.js — the ONLY place Supabase queries live;
                 weatherService, newsService, notificationService
  validators/    reportValidators.js, userValidators.js
  utils/         helpers.js, logger.js, cameroonRegions.js
  server.js
```

### API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create account (Supabase Auth + `users` row) |
| POST | `/api/auth/login` | No | Sign in, returns session tokens |
| POST | `/api/auth/logout` | Yes | Invalidate current session |
| POST | `/api/auth/reset-password` | No | Send password reset email (deep-links back to `NewPasswordScreen`) |
| POST | `/api/auth/update-password` | No* | Complete a reset — takes the emailed recovery `access_token` + new password (*token itself is the auth, verified server-side) |
| GET | `/api/auth/me` | Yes | Get current user's profile |
| GET | `/api/weather/current` | Optional | Current conditions for a region (clothing + agriculture advice included) |
| GET | `/api/weather/forecast` | Optional | 7-day forecast |
| GET | `/api/weather/history` | Optional | Historical weather (Open-Meteo) |
| GET | `/api/weather/air-quality` | Optional | Air quality by coordinates or region |
| GET | `/api/weather/clothing` | Optional | Smart clothing recommendation |
| GET | `/api/weather/agriculture` | Optional | Daily farming advice |
| GET | `/api/weather/climate-tip` | No | Random climate tip |
| GET | `/api/weather/reverse-geocode` | Optional | GPS → place name + nearest Cameroon region (saves to profile if logged in) |
| GET | `/api/news` | Optional | List articles (`category`, `search`, `page`, `limit`) — self-refreshes in the background |
| GET | `/api/news/:id` | Optional | Single article (+ bookmarked flag if logged in) |
| POST/DELETE | `/api/news/:id/bookmark` | Yes | Bookmark / unbookmark |
| GET | `/api/news/bookmarks` | Yes | Current user's bookmarks |
| GET | `/api/education` | No | Educational content (`category` filter) |
| GET | `/api/education/:id` | No | Single content item |
| GET | `/api/education/tips` | No | Climate tips |
| GET | `/api/education/diseases` | No | Health module — disease list |
| GET | `/api/education/diseases/:id` | No | Single disease |
| GET | `/api/education/initiatives` | No | Real Cameroon climate organizations, each with a source URL |
| GET | `/api/education/regional-tips` | Optional | Region's full tip list + today's rotating daily tip |
| GET | `/api/reports` | Optional | Flood reports (public sees verified; `region`/`status` filters) |
| GET | `/api/reports/mine` | Yes | Current user's own reports |
| POST | `/api/reports` | Yes | Submit a flood report |
| PUT/DELETE | `/api/reports/:id` | Yes | Edit/delete own **pending** report |
| PATCH | `/api/reports/:id/status` | Yes* | Verify/reject/resolve (*admin-role check not yet added) |
| GET/PUT | `/api/users/me` | Yes | Get / update profile |
| POST | `/api/users/push-token` | Yes | Register this device's Expo push token |
| GET | `/api/notifications` | Yes | List notifications |
| PATCH | `/api/notifications/:id/read` / `/read-all` | Yes | Mark read |
| POST | `/api/notifications/daily-tips/run` | Yes* | Manually trigger the daily regional climate-tip job (*same admin caveat as report status — anyone logged in can call it today) |

## 3. Frontend Setup

```bash
cd frontend
npm install
npx expo start
```

Edit `app.json → expo.extra.API_BASE_URL` to point at your backend (use your
machine's LAN IP, not `localhost`, when testing on a physical device).

The Maps screen uses `react-native-maps`. It renders out of the box on iOS
(Apple Maps); for production Android builds add a Google Maps API key under
`app.json → expo.android.config.googleMaps.apiKey`.

### Location & Push Notifications

- **Location**: on first Home screen visit, the app shows an in-app
  explainer *before* the OS permission dialog (`HomeScreen.jsx`), then —
  if allowed — calls `expo-location` and `GET /api/weather/reverse-geocode`
  to resolve the device's region, which personalizes weather/news/tips and
  (if logged in) is saved onto the user's profile automatically.
- **Push notifications**: permission is requested and the notification
  tap-through (→ Local Climate Tips screen) is wired up already
  (`AppNavigator.jsx`, `pushNotifications.js`). To actually mint push
  tokens you need an EAS project:
  ```bash
  cd frontend
  npx eas init          # creates/links an EAS project, writes projectId into app.json
  ```
  Once `app.json → expo.extra.eas.projectId` exists, real devices will
  register a token automatically on login. Without it, permission still
  works and in-app notifications still appear — only the *remote* push
  token registration is skipped (logged, not thrown).
- **Daily climate-tip job**: runs automatically every day at 07:00
  (Africa/Douala) — see the `node-cron` schedules in `server.js`. To test
  without waiting, call `POST /api/notifications/daily-tips/run` with a
  logged-in user's token. It creates an in-app notification (and a real
  push if the device registered a token) with that day's regional tip.
- **News auto-refresh**: `server.js` also refreshes the news cache across
  all categories every 6 hours in the background, independent of any user
  request (`newsService.refreshAllCategories`); every read additionally
  triggers a background refresh for next time (stale-while-revalidate).

### Frontend Folder Structure

```
frontend/
  App.jsx
  app.json
  src/
    components/    Button, Input, Card, Widget, WeatherCard, NewsCard, ClimateCard,
                    FloodReportCard, DiseaseCard, Header, Footer, Loading
    context/        AuthContext.jsx, ThemeContext.jsx (dark/light mode, persisted),
                    LocationContext.jsx (GPS → region, permission flow)
    hooks/          useApiData.js — fetch-with-offline-fallback pattern used by every screen
    navigation/     AppNavigator.jsx — Auth stack, bottom tabs, main stack, notification
                     tap-through routing
    screens/        Auth/, Home/, Weather/, News/, Education/, Health/, FloodReports/,
                    Maps/, Profile/, Notifications/, Settings/, Tips/ (Local Climate Tips)
    services/       api.js (axios instance), pushNotifications.js, + one *Api.js per module
    styles/         colors.js, theme.js, spacing.js, typography.js, buttons.js, cards.js,
                     layout.js, globalStyles.js, + one *Styles.js per screen
    utils/          severity.js, cameroonRegions.js, mock*Data.js (offline fallback samples)
```

Coding standards followed throughout: JavaScript `.jsx` only (no
TypeScript), no styles inline in JSX, one style file per screen, screens
kept under 250 lines, Context API instead of Redux.

### Design System

Green & white only — see `frontend/src/styles/colors.js`. Severity colors
(green/yellow/orange/red) are a deliberate functional exception: they're
required for color-coded flood-report markers and stay visually distinct
from the brand green on the map.

## Database Schema

See `backend/supabase/schema.sql` for the full DDL. Summary of tables:

- **users** — profile data linked 1:1 to `auth.users`, plus live `latitude`/`longitude` and `push_token`
- **articles** / **bookmarks** — climate news and per-user bookmarks
- **weather_cache** / **weather_history** — current and historical weather per region
- **notifications** — per-user alerts, typed (`weather`/`flood`/`heat`/`disease`/`tip`/`news`/`general`) and optionally region-tagged
- **climate_tips**, **disease_information**, **educational_content**, **climate_initiatives** — public reference content
- **flood_reports** — community-submitted flood reports with severity/status workflow

RLS is enabled on every table: users can only read/write their own rows
(profile, bookmarks, notifications, their own flood reports); reference
content and verified flood reports are publicly readable; writes to
reference tables and moderation actions on flood reports go through the
backend's service-role key.

## Deployment Notes

- **Backend**: deploy to any Node host (Render, Railway, Fly.io, a VPS).
  Set all `.env` values as platform environment variables — never commit
  `.env`.
- **Frontend**: build with `eas build` (Expo Application Services) for
  Android/iOS, or `expo publish`/OTA updates for JS-only changes.
- Rotate the Supabase service-role key if it's ever exposed; it bypasses RLS.

## Known Gaps / Next Steps

1. **Photo upload** — flood report photos are picked on-device
   (`expo-image-picker`) but not yet uploaded anywhere, since that needs a
   Supabase Storage bucket + signed-upload endpoint that doesn't exist
   yet. Add a `POST /api/reports/upload` (or direct Supabase Storage
   signed URL) endpoint and wire `FloodReportFormScreen` to it.
2. **Admin role for report/notification moderation** —
   `PATCH /api/reports/:id/status` and `POST /api/notifications/daily-tips/run`
   currently just require *any* logged-in user; add an `is_admin`/role
   column on `users` and gate both properly.
3. **Real push delivery needs an EAS project** — the push pipeline
   (permission, token registration, backend storage, `expo-server-sdk`
   sending, tap-through routing) is fully wired, but minting a real Expo
   push token requires `npx eas init` to set `app.json`'s
   `expo.extra.eas.projectId` — see "Location & Push Notifications" above.
4. **Full dark-mode styling** — `ThemeContext` (toggle + persistence) is
   wired and exposed in Settings, but most screen style files still
   reference `colors.light.*` directly rather than the active theme; only
   a full pass converting each `StyleSheet.create` to a themed factory
   gets dark mode pixel-complete everywhere.
5. **Seed Supabase** — `climate_tips`, `disease_information`,
   `educational_content`, and `climate_initiatives` have rich in-code
   fallbacks (used automatically until the tables are populated); seed
   them for admin-editable content. Remember to re-run `schema.sql` (see
   Supabase Setup above) if this project predates the newer tables/columns.
6. Set real `OPENWEATHER_API_KEY` / `NEWS_API_KEY` / Supabase credentials
   in `backend/.env` to replace the built-in mock/offline data everywhere.
