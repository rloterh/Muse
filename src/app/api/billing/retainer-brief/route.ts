import { NextRequest, NextResponse } from "next/server";
import { siteSettings } from "@/lib/site/config";

function resolvePlan(planId: string | null) {
  return (
    siteSettings.retainerPlans.find((plan) => plan.id === planId) ??
    siteSettings.retainerPlans.find((plan) => plan.id === "embedded-partnership")
  );
}

export async function GET(request: NextRequest) {
  const planId = request.nextUrl.searchParams.get("plan");
  const plan = resolvePlan(planId);

  if (!plan) {
    return NextResponse.json({ error: "Retainer plan not found." }, { status: 404 });
  }

  const lines = [
    `${siteSettings.brandName} ${plan.name} Brief`,
    `${siteSettings.brandTagline}`,
    "",
    "Commercial summary",
    `- Plan: ${plan.name}`,
    `- Cadence: ${plan.cadence}`,
    `- Price from: ${plan.priceFrom}`,
    `- Best for: ${plan.bestFor}`,
    "",
    "What is included",
    ...plan.highlights.map((highlight) => `- ${highlight}`),
    "",
    "Engagement context",
    plan.summary,
    "",
    "Next steps",
    `- Book discovery: ${siteSettings.discoveryCallHref}`,
    `- Contact: ${siteSettings.contactEmail}`,
    `- Offices: ${siteSettings.offices.join(" / ")}`,
  ].join("\n");

  return new NextResponse(lines, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${plan.id}-brief.md"`,
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
