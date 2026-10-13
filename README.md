# Joino — AI Event Registration & Onboarding Platform

** Sandeep Patra** · React · Tailwind CSS · Node.js · Express · MongoDB · QRCode · optional Voiceflow

Joino is a responsive event-registration demo focused on a clear selection-to-ticket flow. It presents sample technology events, validates registrant details, stores submissions in MongoDB, creates a unique QR ticket, and can send an email/PDF confirmation when SMTP-style credentials are configured. A built-in FAQ helper works without third-party credentials; an optional Voiceflow web chat can be loaded with a project ID.

> The included event listings are illustrative demo data, not real event announcements. Replace them with verified event details before a public launch.

## Features

- Mobile-first interface with event cards and an explicit selected-event summary.
- Client and server validation for required fields, email shape, and 10-digit phone number.
- MongoDB persistence with unique registration IDs and generated QR ticket data.
- Optional email confirmation with a PDF attachment. Registration saving does not fail solely because email is unavailable.
- Safer server-side HTML escaping for generated confirmation documents, a request-size limit, configurable CORS, and `/health` endpoint.
- Optional Voiceflow widget configured by `VITE_VOICEFLOW_PROJECT_ID`; without it, a local FAQ decision tree answers common registration questions.
- Node built-in tests for registration validation.

## Requirements

- Node.js 18+ and npm.
- MongoDB 6+ running locally or a MongoDB connection string.
- Optional email provider credentials if you want confirmations.
- Optional Voiceflow project if you want to replace the local FAQ assistant.

## Run locally

1. Configure the backend:
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your own MongoDB URI and optional email app password.
   npm install
   npm start
   ```
   Windows users can copy `.env.example` to `.env` in Explorer or PowerShell. Do not commit `.env`.
2. In a second terminal, configure and start the frontend:
   ```bash
   cd client
   cp .env.example .env.local
   npm install
   npm run dev
   ```
3. Open the local URL printed by Vite (usually `http://localhost:5173`).

## Environment

`server/.env`:

- `MONGODB_URI`: local or hosted MongoDB connection string.
- `PORT`: optional API port (defaults to `5000`).
- `CLIENT_ORIGIN`: comma-separated allowed frontend origins (defaults to local Vite).
- `EMAIL_USER` and `EMAIL_PASS`: optional sender credentials. Use a provider app password, not your everyday account password.

`client/.env.local`:

- `VITE_API_BASE_URL`: backend base URL.
- `VITE_VOICEFLOW_PROJECT_ID`: optional public Voiceflow project ID.
- `VITE_VOICEFLOW_VERSION_ID`: optional web-chat version (defaults to `production`).

Do not add database passwords or mail credentials to frontend variables. Client-side variables are bundled into public browser code.

## API

- `GET /health`: confirms API availability and reports connection state.
- `POST /submit`: validates and stores a registration, then returns `{ success, ticket }` including `formId` and a QR data URL.

Example request:

```json
{
  "name": "Example Attendee",
  "email": "attendee@example.com",
  "phone": "9876543210",
  "eventName": "AI & Full-Stack Build Night",
  "eventVenue": "Startup Odisha Hub, Bhubaneswar",
  "eventTime": "10:00 AM – 1:00 PM",
  "eventDate": "07 Nov 2026"
}
```

## Tests

```bash
cd server
npm test
```

The tests cover input validation. They do not require a live MongoDB connection or test email delivery.

## About the developer

Sandeep Patra has a B.Tech background in Electronics and Telecommunication Engineering from Parala Maharaja Engineering College, interested in full-stack development and AI-powered applications.

Because those credentials were present in an uploaded/tracked file, rotate/revoke the MongoDB credential and email app password immediately if they are still active. The shipped project no longer includes their values or uses the old hosted endpoints/banner.

The supplied archive did not include a project-level `LICENSE` file. Check the upstream repository's current license/permission before publishing a derivative repository, and keep all required notices. The visual rework, validations, QR ticket response, optional support widget and configuration changes in this customized copy are separate modifications—not a claim that all upstream code was written from scratch.
