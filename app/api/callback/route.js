import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { code } = req.query; // Authorization code from query params

    if (!code) {
      return res.status(400).json({ error: "Authorization code missing" });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );

    try {
      // Exchange authorization code for access token
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      // Save tokens for further API requests
      // Example: Save tokens in session, database, etc.
      console.log("Access Tokens:", tokens);

      res.status(200).json({ message: "Authentication successful", tokens });
    } catch (error) {
      console.error("Error exchanging code for tokens:", error);
      res.status(500).json({ error: "Failed to get access token" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
