const stripePriceEnvMap = {
  "discovery-sprint": "STRIPE_DISCOVERY_SPRINT_PRICE_ID",
  "launch-program": "STRIPE_LAUNCH_PROGRAM_PRICE_ID",
  "embedded-partnership": "STRIPE_EMBEDDED_PARTNERSHIP_PRICE_ID",
} as const;

export type StripePlanId = keyof typeof stripePriceEnvMap;

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripeSecretKey() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is missing. Add it to the server environment to enable billing checkout and portal flows."
    );
  }

  return secretKey;
}

export function getStripeWebhookSecret() {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    throw new Error(
      "STRIPE_WEBHOOK_SECRET is missing. Add it to the server environment to verify billing webhooks."
    );
  }

  return secret;
}

export function getStripeCustomerPortalConfigurationId() {
  return process.env.STRIPE_BILLING_PORTAL_CONFIGURATION_ID || null;
}

export function getStripePriceId(planId: StripePlanId) {
  const envKey = stripePriceEnvMap[planId];
  const priceId = process.env[envKey];

  if (!priceId) {
    throw new Error(
      `${envKey} is missing. Add it to the server environment before enabling ${planId} checkout.`
    );
  }

  return priceId;
}

export function hasStripePrice(planId: StripePlanId) {
  return Boolean(process.env[stripePriceEnvMap[planId]]);
}
