# Assignment Notifier

Chrome/Brave MV3 extension that fetches new Canvas assignments and emails them via a Dockerized Node relay on computer

## Layout

- `extension/` — MV3 extension (TypeScript)
- `relay/` — Express + nodemailer service, Dockerized, behind Nginx

## Extension

```bash
cd extension
npm install
npm run build
```

Load `extension/dist` as an unpacked extension in Chrome/Brave. Open its options page and fill in:

- Destination email
- Relay URL (e.g. `https://relay.yourvps.com`)
- API key (matches relay `API_KEY`)
- Canvas host (e.g. `canvas.myschool.edu`)
- Check interval

You need to be logged into Canvas in the browser for fetches to authenticate.

## Relay

```bash
cd relay
cp .env.example .env   # fill in secrets
docker compose up -d --build
```

Point Nginx at `127.0.0.1:3000` (see `nginx.conf.example`).
