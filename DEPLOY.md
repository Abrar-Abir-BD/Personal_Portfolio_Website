# Deploying to abrarabir.com

Every push to `main` updates abrarabir.com by itself. GitHub Actions
(`.github/workflows/ci.yml`) type-checks, lints, builds and smoke-tests the
site. If all of that passes, it uploads `dist/` to the cPanel hosting over FTP.
Only files that changed since the last deploy are sent.

If a check fails, nothing is uploaded and the live site stays as it was.

Vercel still deploys `main` on its own as well. That is a separate copy of the
site, at abrarabir.vercel.app.

## One-time setup

### 1. Make an FTP account in cPanel

In cPanel, go to **Files → FTP Accounts** and create an account for the
deploys.

- **Directory:** `public_html` (the folder abrarabir.com serves).
- **Write down:** the full login (for example `deploy@abrarabir.com`), the
  password, and the FTP server. The server is shown under
  **Configure FTP Client**, usually `ftp.abrarabir.com` or the server's
  hostname.

### 2. Add the login to GitHub

In the repo, go to **Settings → Secrets and variables → Actions**. Under
**Secrets**, add:

| Secret | Value |
|---|---|
| `FTP_SERVER` | the FTP server, e.g. `ftp.abrarabir.com` |
| `FTP_USERNAME` | the full FTP login, e.g. `deploy@abrarabir.com` |
| `FTP_PASSWORD` | its password |

Until `FTP_SERVER` is set, the deploy job runs but uploads nothing.

### 3. Set the folder (only if the defaults don't fit)

Under **Variables** (same page, next tab), you can add any of these:

| Variable | Default | Change it when |
|---|---|---|
| `FTP_SERVER_DIR` | `public_html/` | the FTP account already opens *inside* `public_html`: set it to `./` |
| `FTP_PROTOCOL` | `ftps` (encrypted) | the upload fails with a TLS/certificate error: set it to `ftp` |
| `FTP_PORT` | `21` | the host uses a different FTP port |

If the account was created with `public_html` as its directory (step 1), it
opens inside that folder. In that case set `FTP_SERVER_DIR` to `./`.
Otherwise the files land in `public_html/public_html/`.

### 4. Run it

Push any commit to `main`, or open **Actions → CI → Run workflow**. Then open
the run and check the **deploy** job.

The first deploy uploads the whole site, about 30 MB. After that, only changes
are uploaded.

## Notes

- The action keeps a list of what it uploaded in
  `.ftp-deploy-sync-state.json` on the server. Leave that file alone. It only
  ever deletes files it uploaded itself, so other files in `public_html`
  (`.well-known`, `cgi-bin`, email settings) are left alone.
- To force a full re-upload, delete `.ftp-deploy-sync-state.json` from the
  server, then run the workflow again.
