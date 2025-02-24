export const generateEmailTemplate = ({ 
  username, 
  subject,
  preheaderText,
  mainContent,
  button = null,
  companyInfo = {
    name: 'SydneyKart',
    logo: 'https://portfoliosai.link/sydneykart/images/logo.png',
    website: 'https://portfoliosai.link/sydneykart/',
    address: '1234 Street Rd.',
    suite: 'Suite 1234'
  }
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title>${subject}</title>
  <style type="text/css" rel="stylesheet" media="all">
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap");

    body {
      width: 100% !important;
      height: 100%;
      margin: 0;
      -webkit-text-size-adjust: none;
      font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #ffffff;
      color: #333333;
    }

    .email-wrapper {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }

    .email-content {
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .email-masthead {
      padding: 25px 0;
      text-align: center;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-radius: 8px 8px 0 0;
    }

    .logo-image {
      width: 200px;
      height: auto;
      border-radius: 8px;
    }

    .email-body {
      padding: 30px;
    }

    h1 {
      margin-top: 0;
      font-size: 24px;
      font-weight: 600;
      color: #1a1a1a;
    }

    p {
      margin: 1em 0;
      font-size: 16px;
      line-height: 1.6;
      color: #4a4a4a;
    }

    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #22bc66;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 600;
      color: #ffffff;
      text-decoration: none;
      text-align: center;
      transition: background-color 0.2s;
    }

    .button:hover {
      background-color: #1da557;
    }

    .button--blue {
      background-color: #3869d4;
    }

    .button--red {
      background-color: #ff6136;
    }

    .email-footer {
      padding: 25px;
      text-align: center;
      border-top: 1px solid #e9ecef;
    }

    .footer-text {
      margin: 0;
      font-size: 14px;
      color: #6c757d;
    }

    @media only screen and (max-width: 600px) {
      .email-wrapper {
        padding: 10px;
      }
      
      .email-body {
        padding: 20px;
      }
      
      .button {
        display: block;
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-content">
      <div class="email-masthead">
        <a href="${companyInfo.website}" target="_blank">
          <img src="${companyInfo.logo}" alt="${companyInfo.name}" class="logo-image">
        </a>
      </div>

      <div class="email-body">
        ${mainContent}

        ${button ? `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${button.url}" class="button button--${button.style || 'green'}" 
             target="_blank" ${button.color ? `style="background-color: ${button.color};"` : ''}>
            ${button.text}
          </a>
        </div>

        <p style="font-size: 14px; color: #6c757d; text-align: center;">
          If you're having trouble with the button above, copy and paste this URL into your browser:<br>
          <a href="${button.url}" style="color: #3869d4;">${button.url}</a>
        </p>
        ` : ''}

        <p style="margin-top: 30px;">
          Thanks,<br>
          The ${companyInfo.name} Team
        </p>
      </div>

      <div class="email-footer">
        <p class="footer-text">
          ${companyInfo.name}<br>
          ${companyInfo.address}<br>
          ${companyInfo.suite}
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;