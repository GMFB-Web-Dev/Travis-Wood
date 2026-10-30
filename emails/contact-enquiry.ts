type ContactEnquiryEmailProps = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

const LOGO_URL = "https://media.gmfb.co.nz/media/logo-lockup.png";

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character] ?? character,
  );
}

function detailRow(label: string, value: string, href?: string) {
  const content = href
    ? `<a href="${escapeHtml(href)}" style="color:#121d37;text-decoration:underline;text-underline-offset:3px;">${escapeHtml(value)}</a>`
    : escapeHtml(value);

  return `
    <tr>
      <td style="padding:0 12px 16px 0;width:112px;vertical-align:top;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#596174;">
        ${escapeHtml(label)}
      </td>
      <td style="padding:0 0 16px;vertical-align:top;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:24px;font-weight:500;color:#121d37;">
        ${content}
      </td>
    </tr>`;
}

export function renderContactEnquiryEmail({
  firstName,
  lastName,
  email,
  phone,
  service,
  message,
}: ContactEnquiryEmailProps) {
  const fullName = `${firstName} ${lastName}`;
  const phoneDisplay = phone || "Not provided";
  const phoneHref = phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : undefined;
  const messageHtml = escapeHtml(message).replace(/\r?\n/g, "<br>");

  const html = `<!doctype html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>New website enquiry from ${escapeHtml(fullName)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#e9ebef;">
    <div lang="en" dir="ltr" style="background-color:#e9ebef;padding:32px 12px;">
      <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
        New ${escapeHtml(service)} enquiry from ${escapeHtml(fullName)}.
      </div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;border-collapse:separate;border-spacing:0;border-top:4px solid #f4c752;background-color:#121d37;border-top-left-radius:64px;border-bottom-right-radius:64px;overflow:hidden;">
              <tr>
                <td style="padding:30px 36px 26px;text-align:center;background-color:#121d37;">
                  <img src="${LOGO_URL}" width="132" height="132" border="0" alt="Travis Wood Builder" style="display:block;width:132px;height:132px;margin:0 auto 18px;">
                  <h1 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:28px;line-height:36px;font-weight:500;letter-spacing:0.5px;text-transform:uppercase;color:#ffffff;">
                    New website enquiry
                  </h1>
                  <p style="margin:10px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;font-weight:400;color:#f4c752;">
                    ${escapeHtml(service)}
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:34px 36px 18px;background-color:#ffffff;">
                  <h2 style="margin:0 0 22px;font-family:Arial,Helvetica,sans-serif;font-size:18px;line-height:26px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#121d37;">
                    Contact details
                  </h2>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
                    ${detailRow("Name", fullName)}
                    ${detailRow("Email", email, `mailto:${email}`)}
                    ${detailRow("Phone", phoneDisplay, phoneHref)}
                    ${detailRow("Service", service)}
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:0 36px 36px;background-color:#ffffff;">
                  <h2 style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:18px;line-height:26px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#121d37;">
                    Project message
                  </h2>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
                    <tr>
                      <td style="padding:20px 22px;border-left:4px solid #f4c752;background-color:#f2f3f5;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:26px;font-weight:400;color:#20283a;">
                        ${messageHtml}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:24px 36px 28px;text-align:center;background-color:#121d37;">
                  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:21px;font-weight:400;color:#ffffff;">
                    Reply directly to this email to contact ${escapeHtml(firstName)}.
                  </p>
                  <p style="margin:8px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:18px;font-weight:400;letter-spacing:0.5px;text-transform:uppercase;color:#f4c752;">
                    Sent from the Travis Wood Builder website
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>`;

  const text = [
    "NEW WEBSITE ENQUIRY",
    "",
    `Name: ${fullName}`,
    `Email: ${email}`,
    `Phone: ${phoneDisplay}`,
    `Service: ${service}`,
    "",
    "PROJECT MESSAGE",
    message,
    "",
    `Reply to this email to contact ${firstName}.`,
  ].join("\n");

  return { html, text };
}
