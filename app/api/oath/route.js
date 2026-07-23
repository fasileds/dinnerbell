import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { code } = req.body;

    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      // Use YouTube or Ads API here with oauth2Client
      res.status(200).json({ tokens });
    } catch (error) {
      console.error("Error during Google auth", error);
      res.status(500).json({ error: "Authentication failed" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
