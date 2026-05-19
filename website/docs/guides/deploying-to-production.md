---
title: Deploying to production
sidebar_position: 6
---

# Deploying to production

LearnByPlay is designed to deploy on a single Linux box. No external database, no managed services required. This guide covers the most common deployment shapes.

## Deployment matrix

| Target | Best fit | Notes |
|--------|----------|-------|
| **A school's Linux server** | Single building | Run behind nginx, persist the SQLite file on a backed-up volume. |
| **A Raspberry Pi 4 / 5** | Classroom-local instance | 4 GB RAM is plenty. Use a USB SSD, not the SD card, for the DB. |
| **A VPS (Hetzner, DigitalOcean, Linode)** | Small district | $5–$10/mo node handles thousands of daily requests. |
| **A managed Node host (Render, Fly.io, Railway)** | No-ops install | Mount a persistent volume for `data/`. Many hosts treat the FS as ephemeral by default. |
| **Vercel / Netlify** | ❌ Not recommended | Serverless function FS is ephemeral; SQLite writes will not persist between invocations. |

## Production build

```bash
git clone https://github.com/TabletopFoundry/learnbyplay.git
cd learnbyplay
npm ci
npm run build
```

`npm ci` is preferred over `npm install` in CI/CD — it respects `package-lock.json` exactly and fails on drift.

## Required environment

```bash
# .env (production)
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://learnbyplay.your-school.org
LEARNBYPLAY_DB_PATH=/var/lib/learnbyplay/learnbyplay.db
```

Optional, to seed demo data on a production install:

```bash
LEARNBYPLAY_ENABLE_SEEDING=true
```

Most production deployments keep seeding **off** and import their own curated dataset.

## Starting the server

```bash
PORT=3000 npm run start
```

Run behind a process manager (`systemd`, `pm2`, or `docker`). Example systemd unit:

```ini
# /etc/systemd/system/learnbyplay.service
[Unit]
Description=LearnByPlay
After=network.target

[Service]
Type=simple
User=learnbyplay
WorkingDirectory=/opt/learnbyplay
EnvironmentFile=/opt/learnbyplay/.env
ExecStart=/usr/bin/npm run start
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable --now learnbyplay
sudo journalctl -u learnbyplay -f
```

## Reverse proxy (nginx)

```nginx
server {
    listen 80;
    server_name learnbyplay.your-school.org;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name learnbyplay.your-school.org;

    ssl_certificate     /etc/letsencrypt/live/learnbyplay.your-school.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/learnbyplay.your-school.org/privkey.pem;

    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }

    # Cache the static PDF responses for 5 minutes
    location ~ ^/api/lessons/.+/pdf$ {
        proxy_pass         http://127.0.0.1:3000;
        proxy_cache_valid  200 5m;
    }
}
```

## Persisting the database

The SQLite file at `LEARNBYPLAY_DB_PATH` is the only stateful asset. Treat it like a database:

- **Back it up.** A nightly `sqlite3 db.sqlite ".backup '/backups/db-$(date +%F).sqlite'"` is enough.
- **Mount it on a real disk**, not a container's ephemeral overlay.
- **Restore is `cp`.** Stop the app, copy the backup over the live file, start the app.

## Health checks

The app exposes a JSON health endpoint:

```bash
curl https://learnbyplay.your-school.org/api/health
# {"status":"healthy","timestamp":"..."}
```

Wire this into your monitoring of choice (Uptime Kuma, Healthchecks.io, Datadog).

## Upgrade procedure

```bash
cd /opt/learnbyplay
git pull
npm ci
npm run build
sudo systemctl restart learnbyplay
```

Schema migrations and any new seed data run on the first request after restart. Sessions and dashboards persist across upgrades.

## Hardening checklist

- [ ] Run the Node process as a non-root user.
- [ ] Mount the database directory with restrictive permissions (`chmod 700`).
- [ ] Put the app behind TLS — no exceptions, even on a school LAN.
- [ ] Set `NEXT_PUBLIC_BASE_URL` to your real URL so sitemaps and OpenGraph metadata don't leak `localhost`.
- [ ] Disable demo seeding in production unless you specifically want it.
- [ ] Schedule daily backups and **test the restore quarterly**.

## Multi-teacher mode

The demo schema uses a single `teacher_name` for favorites. For multi-teacher deployments:

1. Add an `auth_users` table.
2. Replace `DEFAULT_FAVORITE_TEACHER` with the authenticated user's id.
3. Front the app with an auth layer (Auth.js, Clerk, your school's SSO).

This is intentionally left to the deployer because every district has a different identity story.
