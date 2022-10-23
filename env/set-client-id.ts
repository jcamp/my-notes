import fs from "fs";

(() => {
  const manifestPath = process.argv.slice(2)[0];
  if (!manifestPath) {
    return;
  }

  const clientId = process.env.MY_NOTES_CLIENT_ID;
  if (!clientId) {
    return;
  }

  const manifestContent = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  manifestContent.oauth2.client_id = clientId;
  fs.writeFileSync(manifestPath, JSON.stringify(manifestContent, null, 2));
})();
