interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Send email via Resend API.
 * Falls back to console.log in development or if Resend is not configured.
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("📧 Email (dev mode):", {
      to: options.to,
      subject: options.subject,
      replyTo: options.replyTo,
    });
    console.log("Body:", options.html.replace(/<[^>]*>/g, "").slice(0, 200));
    return true;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
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

    return res.ok;
  } catch (error) {
    console.error("Email send failed:", error);
    return false;
  }
}

/**
 * Generate contact form notification email HTML
 */
export function contactEmailHtml(data: {
  name: string;
  email: string;
  company?: string;
  services: string[];
  budget?: string;
  message: string;
}): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #E8E4DE; background: #0A0A0A; padding: 40px;">
      <h1 style="font-size: 24px; color: #C8956C; margin-bottom: 24px;">New Project Inquiry</h1>
      
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #252525; color: #8A8680; width: 120px;">Name</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #252525;">${data.name}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #252525; color: #8A8680;">Email</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #252525;">
            <a href="mailto:${data.email}" style="color: #C8956C;">${data.email}</a>
          </td>
        </tr>
        ${data.company ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #252525; color: #8A8680;">Company</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #252525;">${data.company}</td>
        </tr>` : ""}
        ${data.services.length > 0 ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #252525; color: #8A8680;">Services</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #252525;">${data.services.join(", ")}</td>
        </tr>` : ""}
        ${data.budget ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #252525; color: #8A8680;">Budget</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #252525;">${data.budget}</td>
        </tr>` : ""}
      </table>
      
      ${data.message ? `
      <div style="margin-top: 24px;">
        <p style="color: #8A8680; margin-bottom: 8px;">Message</p>
        <p style="line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
      </div>` : ""}
      
      <hr style="border: none; border-top: 1px solid #252525; margin: 32px 0;" />
      <p style="font-size: 12px; color: #4A4744;">Sent from muse.agency contact form</p>
    </div>
  `;
}
