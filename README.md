# Ky Thai & Liam - COMP 1350 Term Project

## Overview

This is our COMP 1350 Web Administration term project. The goal is to take a small web app from just running on a laptop to something deployed like a real production service, building it up milestone by milestone through the term.

Milestone A covers a working Express app, managed by PM2, deployed on an Azure VM behind an Nginx reverse proxy with Let's Encrypt TLS, and HTTP requests get redirected to HTTPS automatically.

## Live URL

https://kyliam.canadacentral.cloudapp.azure.com

## GitHub Repo

https://github.com/tuocky2000-dev/Ky-Liam-comp1350-project

## Architecture

Nginx is the only thing exposed to the public (via ports 80 and 443). The Express app only listens on `127.0.0.1:3000`, so it cannot be accessed directly from outside the VM; it can only be reached through Nginx as a reverse proxy.

## Milestone A Write-up

### What we built

- A Node.js/Express backend (`server.js`) that serves our portfolio page and routes.
- The app runs under PM2 (`pm2 start server.js --name milestone-a`) instead of just running in a terminal window, ensuring persistence and automatic restarts on failure.
- Express is configured to listen exclusively on `127.0.0.1` (`app.listen(PORT, '127.0.0.1', ...)`), preventing direct external access.
- Nginx sits in front of the application as a reverse proxy, acting as the sole public-facing service.
- TLS is enabled at the Nginx layer using a trusted **Let's Encrypt** SSL certificate via Certbot, providing a secure connection without browser security warnings.
- HTTP requests on port 80 are automatically redirected to HTTPS (port 443) using a permanent redirect configured by Certbot.

### Troubleshooting

- **Azure DNS & Domain Configuration**: Initially, accessing the VM via raw IP (`4.172.209.136`) only allowed self-signed certificates with browser security warnings. We resolved this by configuring an Azure DNS Name Label (`kyliam.canadacentral.cloudapp.azure.com`) on the Azure Public IP resource to obtain a valid public domain name.
- **Let's Encrypt SSL Integration**: When running `certbot --nginx`, we initially had conflicting server block configurations in Nginx. Cleaning up the Nginx configuration to handle port 80 cleanly and letting Certbot automatically manage the 443 SSL blocks resolved configuration syntax and redirection loop issues.
- **Network Security Group (NSG) Rules**: Ensured Azure firewall (NSG) rules allowed inbound traffic on ports 80 (HTTP) and 443 (HTTPS) so that Let's Encrypt ACME challenge validation and public client traffic could reach Nginx successfully.

## Milestone B Write-up

### What we built

- Implemented **"Sign in with Google"** authentication using **Clerk**, allowing users to securely log into the portfolio application.
- Added a server-side protected route (`/api/auth/protected`) behind authentication to fulfill project route-gating requirements.
- Modularized the application architecture by separating client-side authentication logic (`public/auth.js`) and backend routes (`routes/auth.js`) from the main server entry point (`server.js`).

### OAuth Setup & Configuration

- **Authentication Provider & Flow**: Authenticated via Clerk, which securely abstracts and manages the underlying Google Cloud OAuth 2.0 flow.
- **Redirect URIs & Consent Screen**: Authorized redirect URIs and the OAuth consent screen are configured directly via the Clerk Dashboard integrated with the Google Cloud Console.
- **Secrets Management**: All sensitive credentials (such as `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`) are strictly stored as environment variables in a local `.env` file, which is safely ignored via `.gitignore` to prevent any hardcoded leaks into the GitHub repository. Production secrets are injected securely into the deployment environment.

## Milestone C Write-up

### What we built

- **Load Balancing**: Configured an HAProxy load balancer (listening on port 8080) distributing incoming traffic via round-robin to two backend Node.js/Express instances managed by PM2 (running on ports 3001 and 3002).
- **Redundancy & SPOF Analysis**: Analyzed the single point of failure (SPOF) in our architecture—specifically the single HAProxy load balancer instance—and documented a high-availability (HA) mitigation design utilizing Keepalived and VRRP.
- **CDN Integration**: Served static assets (such as `style.css`) via **jsDelivr** linked directly to our public GitHub repository.
- **Centralized Logging**: Implemented custom file-stream log redirection in `server.js` and centralized log management through PM2 (`./logs/` directory for app and error logs), preventing logs from scattering across servers.
- **Analytics**: Installed the Google Analytics 4 (GA4) tracking tag (`gtag.js`) via dynamic environment variable injection in `server.js` and confirmed real-time data collection.

### Testing & Verification

- **Load Balancing Test**: Send multiple HTTP requests to the load balancer endpoint (or access via the live URL routed through Nginx and HAProxy) and inspect the backend console logs or `/health` endpoint to verify that traffic successfully alternates between ports 3001 and 3002.
- **CDN Verification**: Open browser Developer Tools (F12) -> Network tab, reload the page, and check that `style.css` is being fetched correctly from the `cdn.jsdelivr.net` domain.
- **Analytics Real-time Check**: Access the live site (`https://kyliam.canadacentral.cloudapp.azure.com`) and verify in the Google Analytics (GA4) **Realtime** report that active pageviews and users are being actively tracked.
- **Centralized Logging Verification**: Check the `./logs/` directory or run `pm2 logs` to ensure that application outputs and errors from multiple instances are properly written and stored in the designated log files.

## SPOF (Single Point of Failure) Analysis & Documentation

### 1. Identified SPOF

- **Component**: HAProxy Load Balancer
- **Risk**: All public HTTPS traffic passing through Nginx is routed into a single HAProxy instance. If this instance fails, the entire application becomes unreachable even though the underlying PM2-managed backend instances are fully operational.

### 2. Mitigation Strategy & Architecture Design

To eliminate this single point of failure in a production environment:

- **Secondary Load Balancer**: Deploy an additional independent server running HAProxy.
- **Virtual IP (VIP) & Keepalived**: Configure Keepalived using VRRP (Virtual Router Redundancy Protocol) to share a floating Virtual IP between the primary and secondary load balancers.
- **Automatic Failover**: The primary node broadcasts heartbeat signals; if it fails, the secondary node automatically assumes the VIP and takes over traffic distribution with zero manual intervention.
