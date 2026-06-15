import Ably from "ably";

// Server-side Ably client (for publishing notifications from server actions)
let ablyClient: Ably.Rest | null = null;

export function getAblyClient(): Ably.Rest {
  if (!ablyClient) {
    const key = process.env.ABLY_API_KEY;
    if (!key) {
      throw new Error("ABLY_API_KEY is not set in environment variables");
    }
    ablyClient = new Ably.Rest({ key });
  }
  return ablyClient;
}

// Generate an Ably token request for client-side subscriptions.
// Uses the promise-based API (Ably v2+), no callbacks needed.
export async function getAblyTokenRequest(userId: string) {
  const client = getAblyClient();
  return client.auth.createTokenRequest({
    capability: JSON.stringify({
      [`notifications:${userId}`]: ["subscribe"],
    }),
    clientId: userId,
  });
}
