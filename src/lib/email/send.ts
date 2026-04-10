import type { InquiryRouting } from "@/types";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("Email (dev mode):", {
      to: options.to,
      subject: options.subject,
      replyTo: options.replyTo,
    });
    console.log("Body:", options.html.replace(/<[^>]*>/g, "").slice(0, 200));
    return true;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Muse <noreply@muse.agency>",
        to: options.to,
        subject: options.subject,
        html: options.html,
        reply_to: options.replyTo,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Email send failed:", error);
    return false;
  }
}

export function contactEmailHtml(data: {
  name: string;
  email: string;
  company?: string;
  website?: string;
  services: string[];
  budget?: string;
  timeline?: string;
  projectFocus?: string;
  referralSource?: string;
  region?: string;
  goals?: string;
  message: string;
  consent?: boolean;
  routing: InquiryRouting;
}): string {
  const name = escapeHtml(data.name);
  const email = escapeHtml(data.email);
  const company = data.company ? escapeHtml(data.company) : "";
  const website = data.website ? escapeHtml(data.website) : "";
  const services = data.services.map(escapeHtml);
  const budget = data.budget ? escapeHtml(data.budget) : "";
  const timeline = data.timeline ? escapeHtml(data.timeline) : "";
  const projectFocus = data.projectFocus ? escapeHtml(data.projectFocus) : "";
  const referralSource = data.referralSource ? escapeHtml(data.referralSource) : "";
  const region = data.region ? escapeHtml(data.region) : "";
  const goals = data.goals ? escapeHtml(data.goals) : "";
  const message = data.message ? escapeHtml(data.message) : "";
  const routing = {
    team: escapeHtml(data.routing.team),
    owner: escapeHtml(data.routing.owner),
    fit: escapeHtml(data.routing.fit),
    nextStep: escapeHtml(data.routing.nextStep),
    priority: escapeHtml(data.routing.priority),
  };

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #E8E4DE; background: #0A0A0A; padding: 40px;">
      <h1 style="font-size: 24px; color: #C8956C; margin-bottom: 24px;">New Project Inquiry</h1>

      <div style="margin-bottom: 28px; border: 1px solid #252525; background: #141414; padding: 20px;">
        <p style="margin: 0; color: #8A8680; font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em;">Routing summary</p>
        <p style="margin: 12px 0 0; font-size: 20px; color: #E8E4DE;">${routing.team}</p>
        <p style="margin: 8px 0 0; color: #8A8680; font-size: 14px;">Owner: ${routing.owner} | Fit: ${routing.fit} | Priority: ${routing.priority}</p>
        <p style="margin: 12px 0 0; line-height: 1.6; color: #E8E4DE;">${routing.nextStep}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #252525; color: #8A8680; width: 120px;">Name</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #252525;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #252525; color: #8A8680;">Email</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #252525;">
            <a href="mailto:${email}" style="color: #C8956C;">${email}</a>
          </td>
        </tr>
        ${
          company
            ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #252525; color: #8A8680;">Company</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #252525;">${company}</td>
        </tr>`
            : ""
        }
        ${
          website
            ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #252525; color: #8A8680;">Website</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #252525;">${website}</td>
        </tr>`
            : ""
        }
        ${
          services.length > 0
            ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #252525; color: #8A8680;">Services</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #252525;">${services.join(", ")}</td>
        </tr>`
            : ""
        }
        ${
          timeline
            ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #252525; color: #8A8680;">Timeline</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #252525;">${timeline}</td>
        </tr>`
            : ""
        }
        ${
          projectFocus
            ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #252525; color: #8A8680;">Project focus</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #252525;">${projectFocus}</td>
        </tr>`
            : ""
        }
        ${
          referralSource
            ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #252525; color: #8A8680;">Source</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #252525;">${referralSource}</td>
        </tr>`
            : ""
        }
        ${
          region
            ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #252525; color: #8A8680;">Region</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #252525;">${region}</td>
        </tr>`
            : ""
        }
        ${
          budget
            ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #252525; color: #8A8680;">Budget</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #252525;">${budget}</td>
        </tr>`
            : ""
        }
      </table>

      ${
        goals
          ? `
      <div style="margin-top: 24px;">
        <p style="color: #8A8680; margin-bottom: 8px;">Success looks like</p>
        <p style="line-height: 1.6; white-space: pre-wrap;">${goals}</p>
      </div>`
          : ""
      }

      ${
        message
          ? `
      <div style="margin-top: 24px;">
        <p style="color: #8A8680; margin-bottom: 8px;">Message</p>
        <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
      </div>`
          : ""
      }

      <hr style="border: none; border-top: 1px solid #252525; margin: 32px 0;" />
      <p style="font-size: 12px; color: #4A4744;">Consent captured: ${data.consent ? "yes" : "no"} | Sent from muse.agency contact form</p>
    </div>
  `;
}
