# Ky Thai & Liam - COMP 1350 Term Project

## Overview

This is our COMP 1350 Web Administration term project. The goal is to take a small web app from just running on a laptop to something deployed like a real production service, building it up milestone by milestone through the term.

Milestone A covers a working Express app, managed by PM2, deployed behind an Nginx reverse proxy with TLS, and HTTP requests get redirected to HTTPS automatically.

## Live URL

https://wsalab5.info

(It uses a self signed certificate, so your browser will show a security warning first. Just click Advanced then Proceed to see the site.)

## GitHub Repo

https://github.com/tuocky2000-dev/KyThai-comp1350-project

## Architecture


Nginx is the only thing exposed to the public. The Express app only listens on 127.0.0.1, so it cannot be accessed directly from outside the VM, it can only be reached through Nginx.

## Milestone A Write-up

### What we built

- A Node.js/Express backend (`server.js`) that serves our portfolio page and a `/health` route.
- The app runs under PM2 (`pm2 start server.js --name milestone-a`) instead of just running in a terminal window, so it keeps running and restarts by itself if it crashes.
- Express is set to only listen on `127.0.0.1` (`app.listen(PORT, '127.0.0.1', ...)`), so it is not reachable from outside the VM directly.
- Nginx is in front of it as a reverse proxy, and it is the only service that is publicly facing.
- TLS is handled at the Nginx layer using a self signed certificate, which the lab said is fine for VM demos.
- Any request on port 80 gets redirected to port 443 using a 301.

### Nginx config (with comments)

```nginx
server {
    listen 443 ssl;
    server_name wsalab5.info;

    # self signed cert made using openssl, 4096 bit RSA key
    ssl_certificate /etc/nginx/ssl_key/server.crt;
    ssl_certificate_key /etc/nginx/ssl_key/server.key;

    location / {
        # forward everything to our Express app running on port 3000 locally
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    # plain HTTP requests get sent to HTTPS instead
    listen 80;
    server_name wsalab5.info;
    return 301 https://$host$request_uri;
}
```

### Troubleshooting

- After making the VM with a private network adapter (`192.168.56.15`), the adapter came up without an IP at all (`ip addr show` showed it as `DOWN` with no `inet` line). We fixed it by manually bringing the interface up and giving it the IP using `ip link set enp0s8 up` and `ip addr add 192.168.56.15/24 dev enp0s8`.
- Windows could ping the VM fine, but could not connect on port 443 at first. We thought it was a firewall problem, but it turned out to be the same root cause as above, the interface just had no IP yet. We confirmed this with `Test-NetConnection -Port 443` after fixing the IP.
- When writing the server startup log line inside a nested heredoc in bash, the escaped backticks got written into the file literally instead of making a template literal, causing a `SyntaxError: Invalid or unexpected token`. We fixed it by using normal string concatenation instead (`'Listening on 127.0.0.1:' + PORT`).
