import { NextResponse } from "next/server";
import { fallbackServices } from "@/lib/content/fallback-data";
import { resolveServices } from "@/lib/content/resolvers";
import { siteSettings } from "@/lib/site/config";

export async function GET() {
  const services = await resolveServices().catch(() => fallbackServices);

  const lines = [
    `${siteSettings.brandName} Capability Deck`,
    `${siteSettings.brandTagline}`,
    "",
    "Overview",
    "Muse combines strategy, design, engineering, and motion to help ambitious brands launch clearer stories and better digital experiences.",
    "",
    "Trust signals",
    ...siteSettings.trustSignals.flatMap((signal) => [
      `- ${signal.label}: ${signal.value}`,
      `  ${signal.description}`,
    ]),
    "",
    "Engagement models",
    ...siteSettings.engagementModels.flatMap((model) => [
      `- ${model.name} (${model.timeline})`,
      `  ${model.summary}`,
      `  Best for: ${model.bestFor}`,
    ]),
    "",
    "Capabilities",
    ...services.flatMap((service) => [
      `- ${service.title}`,
      `  ${service.description ?? ""}`,
      ...(service.features?.length ? [`  Features: ${service.features.join(", ")}`] : []),
      ...(service.deliveryModel ? [`  Delivery model: ${service.deliveryModel}`] : []),
    ]),
    "",
    "Contact",
    `${siteSettings.contactEmail}`,
    `${siteSettings.contactPhone}`,
    ...siteSettings.offices,
  ].join("\n");

  return new NextResponse(lines, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${siteSettings.brandName.toLowerCase()}-capability-deck.md"`,
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
