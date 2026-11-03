// CRM extension point. Implement a provider (e.g. HubSpot) and call syncConversation
// after each chat turn. Not connected to any account in v0.
import type { Conversation } from "./store";
export interface CrmProvider { upsertContact(c: Conversation): Promise<string | undefined>; logSignals(c: Conversation): Promise<void>; }
let provider: CrmProvider | null = null; // TODO: e.g. new HubSpotProvider(process.env.HUBSPOT_TOKEN)
export async function syncConversation(c: Conversation) {
  if (!provider || !c.visitorEmail) return;
  await provider.upsertContact(c); await provider.logSignals(c);
}
