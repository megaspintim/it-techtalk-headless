// Talks to Wix's REST API directly instead of using @wix/sdk + @wix/data,
// which have a reproducible internal crash in this Next.js App Router (RSC)
// environment (confirmed via full stack trace -- a duplicate/mismatched
// @wix/sdk-runtime dependency inside the SDK package itself, not fixable
// from our side). Same fetch-based approach already working fine for
// RSS.app, see lib/rss.js.

const CLIENT_ID = process.env.NEXT_PUBLIC_WIX_CLIENT_ID;

if (!CLIENT_ID) {
  throw new Error(
    'NEXT_PUBLIC_WIX_CLIENT_ID is missing. Check .env.local exists and ' +
    'you restarted npm run dev after creating/editing it.'
  );
}

let cachedToken = null;
let tokenExpiresAt = 0;

async function getVisitorToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt) return cachedToken;

  const res = await fetch('https://www.wixapis.com/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clientId: CLIENT_ID,
      grantType: 'anonymous'
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error('Wix token request failed (' + res.status + '): ' + text);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiresAt = now + (data.expires_in - 300) * 1000;
  return cachedToken;
}

export async function queryWixCollection(collectionId, query = {}) {
  const token = await getVisitorToken();

  const res = await fetch('https://www.wixapis.com/wix-data/v2/items/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    },
    body: JSON.stringify({
      dataCollectionId: collectionId,
      query: query
    }),
    cache: 'no-store'
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error('Wix data query failed for "' + collectionId + '" (' + res.status + '): ' + text);
  }

  const data = await res.json();
  return data.dataItems || [];
}

export function getFieldValue(item, fieldKey) {
  if (item && item.data && item.data[fieldKey] !== undefined) {
    return item.data[fieldKey];
  }
  return item ? item[fieldKey] : undefined;
}

export function getItemId(item) {
  if (!item) return undefined;
  return item.id !== undefined ? item.id : item._id;
}

export function getItemCreatedDate(item) {
  if (item && item.data && item.data._createdDate !== undefined) {
    return item.data._createdDate;
  }
  return item ? item._createdDate : undefined;
}

// Wix Tags fields have been observed coming back from this REST endpoint as
// a single string rather than an array (unlike the SDK, which normalizes
// this). This coerces either shape into a consistent array of strings, so
// downstream code (resourceType[0], .some(), .map(), etc.) always works
// regardless of which shape a given field actually arrives in.
export function normalizeToArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    // Handles a single tag ("eBook") and comma-separated multi-tags
    // ("Artificial Intelligence, Enterprise data and governance") the same
    // way the original CSV cleanup formatted them.
    return value.split(',').map((v) => v.trim()).filter(Boolean);
  }
  return [];
}
