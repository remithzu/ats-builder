# 🚀 ATS Builder

## Overview
ATS Builder is a React + Vite based project with automated CI/CD pipelines supporting GitHub Pages deployment, Docker publishing, automatic version tagging, and optimized production builds with NGINX + Brotli compression.

## 📁 Project Structure
```
.
├── components/
├── services/
├── App.tsx
├── index.tsx
├── index.css
├── vite.config.ts
├── package.json
├── nginx.conf
├── Dockerfile
└── docker-compose.yml
```

## ✨ Features
🟦 Frontend

* ⚡ Powered by Vite (ultra-fast dev/build)
* 🎨 Styled with TailwindCSS
* 🧩 Modular React + TypeScript components
* 🔍 Clean folder structure with `components/` and `services/`

## 🐳 Docker Production Ready
* Two-stage build (Node → NGINX)
* Auto-optimized static hosting
* Minimal, lightweight image
* Brotli + Gzip enabled
* Long-term browser caching


## ⚙️ Installation
Install dependencies
```
npm install
```

Run development mode
```
npm run dev
```

Build for production
```
npm run build
```
Preview production build
```
npm run preview
```

Install from github container registry
```
docker pull ghcr.io/remithzu/ats-builder:latest
```

## 🐳 Running With Docker

Build image
```
docker build -t ats-builder .
```

Run container
```
docker run -d -p 3000:80 ats-builder
```

Access at:

👉 http://localhost:3000

Using Docker Compose
```
docker compose up --build
```

## 📜 License

MIT License — free to use and modify.