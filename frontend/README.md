# PushAndPray Frontend (Download & Run)

This folder is fully self-contained. You can download just `frontend/` and run it locally.

## 1) Downloadable package

From the repository root:

```bash
cd frontend
bash make-download.sh
```

This creates:

- `dist-download/pushandpray-frontend.zip`

Share or download that zip, unzip it anywhere, then run the app.

## 2) Run locally

```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown by Vite (usually `http://localhost:5173`).

## 3) Build for production

```bash
cd frontend
npm install
npm run build
npm run preview
```

## Stack

- React + TypeScript + Tailwind CSS + Recharts
- API base URL: `https://push-and-pray-production.up.railway.app`

## Auth/API behavior

- Register: `POST /auth/register` with JSON `{ username, email, password }`
- Login: `POST /auth/login` with form data `username`, `password`
- JWT stored in `localStorage` and sent as `Authorization: Bearer <token>` to protected endpoints
