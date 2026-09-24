# Suggestions: from the site to a private review queue

Each person's panel on the site can show a **Suggest a correction or addition**
button. The form posts to this Cloudflare Worker, which:

1. checks the Cloudflare Turnstile spam test and a hidden honeypot field,
2. checks the fields and attachments (up to 3 files, 8 MB each; JPEG, PNG,
   WebP, GIF or PDF),
3. stores any attachments in the **private** repo
   `brendanmadams/Genealogy-submissions` under `uploads/<reference>/`, and
4. opens an issue there labelled `pending` plus the kind of suggestion.

Nothing reaches the public site until a reviewed change is committed to the
Genealogy repo. Names and emails of the people who send suggestions stay in the
private repo.

## One-time setup

All of it is free. Keep the two secrets (the GitHub token and the Turnstile
secret key) to yourself: they go straight into Cloudflare and nowhere else.

1. **Private repo.** On GitHub choose *New repository*, name it
   `Genealogy-submissions`, select **Private**, and tick *Add a README file*
   (the Worker needs the `main` branch to exist).
2. **GitHub token.** Go to *Settings → Developer settings → Personal access
   tokens → Fine-grained tokens → Generate new token*.
   - Repository access: *Only select repositories* → `Genealogy-submissions`
   - Permissions: **Contents: Read and write**, **Issues: Read and write**
   - Expiration: up to a year. Put a reminder in your calendar to renew it
     (step 4's `secret put GITHUB_TOKEN` again).
3. **Turnstile.** Create a free Cloudflare account. In the dashboard open
   *Turnstile → Add widget*, add the hostnames `brendanmadams.github.io` and
   `localhost`, and choose *Managed* mode. Note the **site key** (public) and
   the **secret key**.
4. **Deploy the Worker.** In a terminal, in this `worker` folder:

   ```bash
   npx wrangler login
   ```

   ```bash
   npx wrangler deploy
   ```

   ```bash
   npx wrangler secret put GITHUB_TOKEN
   ```

   ```bash
   npx wrangler secret put TURNSTILE_SECRET
   ```

   `wrangler login` opens a browser to sign in to Cloudflare. Each
   `secret put` asks you to paste the value. `deploy` prints the Worker's
   address, e.g. `https://genealogy-submissions.<name>.workers.dev`.
5. **Switch the button on.** Put the Worker address and the Turnstile *site*
   key in `js/config.js`, run `node scripts/build.js`, then commit and push.
   Until both are set, the button stays hidden.

## Reviewing

New suggestions arrive as issues in `Genealogy-submissions`, labelled
`pending` (GitHub can email you about each one; see *Watch → All activity*).
Change the label to `approved`, `rejected` or `needs-source`, and ask Claude
to apply the approved ones. Each approved batch becomes a dated fix script and
commit in this repo, following the usual rules: sourced changes only, UNPROVEN
where not proved, and names and relationships only for living people. Close
the issue once the change is live.

Photos and documents: publish one only when the sender took it or has the
right to share it (they tick a box when attaching). Newspaper clippings after
1929 are still under the newspaper's copyright.

## Settings

`wrangler.toml` holds the repo name, the site address and the origins allowed
to post (`https://brendanmadams.github.io` and `http://localhost:5580` for
local testing). The free Workers plan allows 100,000 requests a day.
