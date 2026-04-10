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
  services: string[];
  budget?: string;
  message: string;
}): string {
  const name = escapeHtml(data.name);
  const email = escapeHtml(data.email);
  const company = data.company ? escapeHtml(data.company) : "";
  const services = data.services.map(escapeHtml);
  const budget = data.budget ? escapeHtml(data.budget) : "";
  const message = data.message ? escapeHtml(data.message) : "";

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #E8E4DE; background: #0A0A0A; padding: 40px;">
      <h1 style="font-size: 24px; color: #C8956C; margin-bottom: 24px;">New Project Inquiry</h1>

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
          services.length > 0
            ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #252525; color: #8A8680;">Services</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #252525;">${services.join(", ")}</td>
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
        message
          ? `
      <div style="margin-top: 24px;">
        <p style="color: #8A8680; margin-bottom: 8px;">Message</p>
        <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
      </div>`
          : ""
      }

      <hr style="border: none; border-top: 1px solid #252525; margin: 32px 0;" />
      <p style="font-size: 12px; color: #4A4744;">Sent from muse.agency contact form</p>
    </div>
  `;
}
