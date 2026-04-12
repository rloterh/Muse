import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);

  if (!existsSync(absolutePath)) {
    throw new Error(`Missing required file: ${relativePath}`);
  }

  return readFileSync(absolutePath, "utf8");
}

function assertIncludes(content, fragment, message) {
  if (!content.includes(fragment)) {
    throw new Error(message);
  }
}

function assertRegex(content, pattern, message) {
  if (!pattern.test(content)) {
    throw new Error(message);
  }
}

const sanitySchema = read("sanity/schemas/index.ts");
const fallbackData = read("src/lib/content/fallback-data.ts");
const siteConfig = read("src/lib/site/config.ts");

[
  "caseStudySchema",
  "serviceSchema",
  "teamMemberSchema",
  "homepageSchema",
  "journalPostSchema",
].forEach((exportName) => {
  assertIncludes(
    sanitySchema,
    `export const ${exportName}`,
    `Sanity schema export is missing: ${exportName}`
  );
});

assertRegex(
  fallbackData,
  /export const fallbackCaseStudies:\s*CaseStudy\[]\s*=\s*\[\s*\{/,
  "Fallback case studies must contain at least one seeded case study."
);
assertRegex(
  fallbackData,
  /export const fallbackServices:\s*Service\[]\s*=\s*\[\s*\{/,
  "Fallback services must contain at least one seeded service."
);
assertRegex(
  fallbackData,
  /export const fallbackTeamMembers:\s*TeamMember\[]\s*=\s*\[\s*\{/,
  "Fallback team members must contain at least one seeded team member."
);
assertRegex(
  fallbackData,
  /export const fallbackJournalPosts:\s*JournalPost\[]\s*=\s*\[\s*\{/,
  "Fallback journal posts must contain at least one seeded journal post."
);
assertIncludes(
  siteConfig,
  "retainerPlans:",
  "Site settings must expose retainer plans for the commerce layer."
);
assertIncludes(
  siteConfig,
  "fallbackBillingEvents",
  "Site settings must include fallback billing events for admin revenue ops."
);

["src/app/api/billing/webhook/route.ts", "src/app/api/billing/checkout/route.ts"].forEach(
  (relativePath) => {
    if (!existsSync(path.join(root, relativePath))) {
      throw new Error(`Billing route missing: ${relativePath}`);
    }
  }
);

console.log("Content sanity checks passed.");
