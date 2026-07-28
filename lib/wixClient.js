// DEPRECATED — NOT USED. Left only for reference.
// This was the original @wix/sdk + @wix/data approach. It has a
// reproducible internal crash in Next.js App Router (RSC) — confirmed via
// full stack trace, a duplicate/mismatched @wix/sdk-runtime dependency
// bundled inside @wix/sdk itself. See lib/wixRest.js for the working
// replacement (plain REST API calls, same pattern as lib/rss.js).
// @wix/sdk and @wix/data have been removed from package.json.

import { createClient, OAuthStrategy } from '@wix/sdk';
import { items } from '@wix/data';

const clientId = process.env.NEXT_PUBLIC_WIX_CLIENT_ID;

if (!clientId) {
  throw new Error(
    'NEXT_PUBLIC_WIX_CLIENT_ID is missing. Check that .env.local exists in the ' +
    'project root (not just .env.local.example), that it contains a real value ' +
    'on the NEXT_PUBLIC_WIX_CLIENT_ID= line, and that you restarted `npm run dev` ' +
    'AFTER creating/editing it — env vars only load at server startup.'
  );
}

// OAuth for Wix Headless only needs a Client ID — confirmed directly from
// Wix's docs, no client secret or redirect URI required for this
// read-only, anonymous-visitor use case.
export const wixClient = createClient({
  modules: { items },
  auth: OAuthStrategy({ clientId })
});
