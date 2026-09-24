// Settings for the "Suggest a correction" form. Both values are public.
// Until `endpoint` is set, the form's button is hidden.
export const SUGGEST = {
  // URL of the deployed Cloudflare Worker (worker/), e.g.
  // "https://genealogy-submissions.<your-subdomain>.workers.dev"
  endpoint: 'https://genealogy-submissions.brendanmadams.workers.dev',
  // Cloudflare Turnstile site key (the public half; the secret lives in the Worker)
  turnstileSiteKey: '0x4AAAAAAFCoWvk-MZZd0Ifi',
};
