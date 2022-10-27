import { t } from "i18next";

export const verifyEmail = (name: string, token: string) => {
  return `
  <!doctype html>
  <html lang="en-US">
  
  <head>
      <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
      <title>${t("EMAIL.VERIFY_EMAIL.TITLE")}</title>
      <meta name="description" content="${t("EMAIL.VERIFY_EMAIL.TITLE")}">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Pacifico&family=Rubik&display=swap" rel="stylesheet">
      <style type="text/css">
        a:hover { text-decoration: underline !important; }
        .green600 { color: #22C55E; }
      </style>
    </head>
    <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px;" leftmargin="0">
      <table cellspacing="0" border="0" cellpadding="0" width="100%">
            <tr>
          <td>
            <table style="max-width:670px;  margin:0 auto;" width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
              <tr>
                <td style="height:80px;">&nbsp;</td>
              </tr>
              <tr>
                <td style="height:20px;">&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06); border-top:30px solid #22C55E">
                    <tr>
                      <td style="height:40px;">&nbsp;</td>
                    </tr>
                    <tr>
                      <td style="padding:0 35px;">
                      <div class="green600" style="font-size:32px; font-family: 'Pacifico', cursive;"> Healthier </div>
                        <img src="cid:imagem" alt="Account created representation picture"/>
                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">${t("EMAIL.INTRO", {name: name})} ${t("EMAIL.VERIFY_EMAIL.TITLE")}</h1>
                        <p style="color:#455056; font-size:15px;line-height:24px; margin-top:2rem;">
                          ${t("EMAIL.VERIFY_EMAIL.SUBJECT")}
                        </p>
                          <a href="${token}" style="background:#22C55E; text-decoration:none !important; font-weight:500; margin-top:35px; padding: 15px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:5px;">${t("EMAIL.VERIFY_EMAIL.BUTTON")}</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="height:40px;">&nbsp;</td>
                    </tr>
                  </table>
                </td>
              <tr>
                <td style="height:20px;">&nbsp;</td>
              </tr>
              <tr>
                <td style="height:80px;">&nbsp;</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}