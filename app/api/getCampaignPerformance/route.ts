import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const API_URL = "https://googleads.googleapis.com/v18/customers";
const DEVELOPER_TOKEN = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;

export default async function handler(req: any, res: any) {
  const { campaignId, accessToken } = req.body;

  if (!campaignId || !accessToken) {
    return res
      .status(400)
      .json({ error: "Campaign ID and access token required" });
  }

  if (!DEVELOPER_TOKEN) {
    return res.status(500).json({ error: "Developer token is missing" });
  }

  try {
    const response = await fetch(
      `${API_URL}/${process.env.GOOGLE_ADS_ACCOUNT_ID}/campaigns/${campaignId}/metrics`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "developer-token": DEVELOPER_TOKEN,
        },
      }
    );

    if (!response.ok) {
      const errorDetail = await response.json();
      console.error("Google Ads API error details:", errorDetail);
      return res
        .status(response.status)
        .json({ error: errorDetail.error.message });
    }

    const campaignMetrics = await response.json();
    const { impressions, clicks, cost_micros, conversions } = campaignMetrics;
    await prisma.campaignMetrics.create({
      data: {
        campaignId,
        impressions,
        clicks,
        cost: cost_micros / 1_000_000,
        conversions,
      },
    });

    res.status(200).json({
      impressions,
      clicks,
      cost: cost_micros / 1_000_000,
      conversions,
    });
  } catch (error) {
    console.error("Error fetching campaign metrics:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch campaign performance data." });
  }
}
