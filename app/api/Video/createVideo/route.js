import fs from "fs";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { google } from "googleapis";
import { PrismaClient } from "@prisma/client";
import path from "path";
import os from "os";
import { Dropbox } from "dropbox";
import { Readable } from "stream";
import fetch from "node-fetch";
import { error } from "console";
const prisma = new PrismaClient();
const API_URL = "https://googleads.googleapis.com/v18/customers";
const DEVELOPER_TOKEN = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
const GOOGLE_ADS_ACCOUNT_ID = process.env.GOOGLE_ADS_ACCOUNT_ID;

// Google Auth for service account

async function getRefreshTokenFromDatabase() {
  const token = process.env.GOOGLE_REFRESH_TOKEN;

  return getAccessTokenUsingRefreshToken(token);
}

async function getAccessTokenUsingRefreshToken(refreshToken) {
  if (!refreshToken) {
    throw new Error("Refresh token is required.");
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_SECRET_KEY,
    "http://localhost:3000/api/auth/callback/google"
  );
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  const { token } = await oauth2Client.getAccessToken();
  return token;
}

async function uploadVideoToYouTube(videoFile, description, accessToken) {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const videoStream = Readable.from(Buffer.from(await videoFile.arrayBuffer()));

  try {
    const response = await google.youtube("v3").videos.insert({
      auth: oauth2Client,
      part: "snippet,status",
      requestBody: {
        snippet: {
          title: "Your Video Title",
          description: description,
          tags: ["tag1", "tag2"],
          categoryId: "22", // Adjust category ID as needed
        },
        status: {
          privacyStatus: "public", // Can be "public", "unlisted", or "private"
        },
      },
      media: {
        body: videoStream,
      },
    });

    console.log("Video uploaded to YouTube successfully:", response.data);
    return response.data.id;
  } catch (error) {
    console.error("Error uploading video to YouTube:", error);
    throw new Error("Failed to upload video to YouTube.");
  }
}

async function uploadVideoToGoogleAds(videoId, accessToken) {
  const url = `${API_URL}/${process.env.GOOGLE_ADS_ACCOUNT_ID}/assets:mutate`;
  const payload = {
    operations: [
      {
        create: {
          youtubeVideoAsset: {
            youtubeVideoId: videoId,
          },
        },
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorDetail = await response.json();
      console.error("Google Ads API upload error details:", errorDetail);
      throw new Error(errorDetail.error.message || "Unknown error");
    }

    const responseData = await response.json();
    console.log("the video uploded sussfuly: ", responseData);
    return responseData.results[0].resourceName;
  } catch (error) {
    console.error("Network error during video upload to Google Ads:", error);
    throw new Error("Failed to upload video to Google Ads.");
  }
}

function parseSelectedPlatforms(rawValue) {
  if (!rawValue) return [];

  if (Array.isArray(rawValue)) return rawValue;

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function calculateBudgetPerPlatform(totalBudget, selectedPlatforms) {
  const platformCount = selectedPlatforms.length || 1;
  return Math.round((totalBudget / platformCount) * 100) / 100;
}

async function createGoogleAdsCampaign(
  videoId,
  targetZip,
  budget,
  description,
  duration,
  accessToken,
  restorantId,
  dish,
  saavedVideoId,
  price
) {
  console.log("the accses token is here:", accessToken);
  try {
    // Step 1: Create Campaign Budget
    const budgetResponse = await fetch(
      `${API_URL}/${process.env.GOOGLE_ADS_ACCOUNT_ID}/campaignBudgets:mutate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
        },
        body: JSON.stringify({
          operations: [
            {
              create: {
                name: `Video Campaign Budget${uuidv4()}`,
                amount_micros: budget * 1000000,
                delivery_method: "STANDARD",
                explicitlyShared: false,
              },
            },
          ],
        }),
      }
    );

    if (!budgetResponse.ok) {
      // Capture additional error details
      const errorDetails = await budgetResponse.text(); // Get full error response body
      console.error("Failed to create campaign budget.");
      console.error("Status Code:", budgetResponse.status);
      console.error("Status Text:", budgetResponse.statusText);
      console.error("Response Body:", errorDetails);

      throw new Error(
        `Failed to create campaign budget. 
        Status Code: ${budgetResponse.status}, 
        Status Text: ${budgetResponse.statusText}, 
        Response Body: ${errorDetails}`
      );
    }

    const budgetData = await budgetResponse.json();
    console.log("buget created sussfully : ", budgetData);
    const budgetId = budgetData.results[0].resourceName.split("/").pop();
    const campaignResponse = await fetch(
      `${API_URL}/${process.env.GOOGLE_ADS_ACCOUNT_ID}/campaigns:mutate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
        },
        body: JSON.stringify({
          operations: [
            {
              create: {
                name: `Video Campaign ${uuidv4()}`,
                advertisingChannelType: "DEMAND_GEN",
                status: "ENABLED",
                campaign_budget: `customers/${process.env.GOOGLE_ADS_ACCOUNT_ID}/campaignBudgets/${budgetId}`,
                maximizeConversions: {},
              },
            },
          ],
        }),
      }
    );

    if (!campaignResponse.ok) {
      console.error(
        `Error: ${campaignResponse.status} - ${campaignResponse.statusText}`
      );
      throw new Error("Failed to create campaign.");
    }
    const campaignData = await campaignResponse.json();
    console.log(
      "Campaign created successfully:",
      JSON.stringify(campaignData, null, 2)
    );
    const campaignId = campaignData.results[0].resourceName.split("/").pop();
    const adGroupResponse = await fetch(
      `${API_URL}/${process.env.GOOGLE_ADS_ACCOUNT_ID}/adGroups:mutate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
        },
        body: JSON.stringify({
          operations: [
            {
              create: {
                name: `Ad Group ${uuidv4()}`,
                campaign: `customers/${process.env.GOOGLE_ADS_ACCOUNT_ID}/campaigns/${campaignId}`,
                status: "ENABLED",
                cpcBidMicros: 1000000,
              },
            },
          ],
        }),
      }
    );

    if (!adGroupResponse.ok) {
      console.error(
        `Error: ${adGroupResponse.status} - ${adGroupResponse.statusText}`
      );
      throw new Error("Failed to create ad group.");
    }

    const adGroupData = await adGroupResponse.json();
    const adGroupId = adGroupData.results[0].resourceName.split("/").pop();
    console.log("Ad Group created successfully:", adGroupData);

    const assetResource = await uploadVideoToGoogleAds(videoId, accessToken);
    const assetId = assetResource.split("/").pop(); // Extracts the last part
    console.log(assetId); // Outputs: 191518173756
    console.log("assetResourse: ", assetResource);
    const adGroupAdResponse = await fetch(
      `${API_URL}/${process.env.GOOGLE_ADS_ACCOUNT_ID}/adGroupAds:mutate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
        },
        body: JSON.stringify({
          operations: [
            {
              create: {
                ad: {
                  demandGenVideoResponsiveAd: {
                    businessName: {
                      text: "Dinner Bell",
                    },
                    descriptions: [
                      {
                        text: `${description}`,
                      },
                    ],
                    headlines: [
                      {
                        text: `${price}`,
                      },
                    ],
                    longHeadlines: [
                      {
                        text: `${restorantId}`,
                      },
                    ],
                    logoImages: [
                      {
                        asset: "customers/5135893348/assets/191261938048",
                      },
                    ],
                    videos: [
                      {
                        asset: `customers/5135893348/assets/${assetId}`,
                      },
                    ],
                  },
                  finalUrls: [
                    `https://dinner-bell-ads.com/pages/lendingPage/${saavedVideoId}`,
                  ],
                  name: `${dish}`,
                },
                adGroup: `customers/5135893348/adGroups/${adGroupId}`,
              },
            },
          ],
        }),
      }
    );

    if (!adGroupAdResponse.ok) {
      // Extracting detailed error information
      try {
        const errorDetail = await adGroupAdResponse.json();
        console.error("Google Ads API Ad Group Ad Error Details:");
        console.error("Status Code:", adGroupAdResponse.status);
        console.error("Status Text:", adGroupAdResponse.statusText);
        console.error(
          "Headers:",
          JSON.stringify([...adGroupAdResponse.headers])
        );
        console.error("Error Body:", JSON.stringify(errorDetail, null, 2));

        throw new Error(
          errorDetail.error.message ||
            "Unknown error occurred while creating Ad Group Ad."
        );
      } catch (error) {
        console.error("Failed to parse error details from response.");
        console.error("Status Code:", adGroupAdResponse.status);
        console.error("Status Text:", adGroupAdResponse.statusText);
        console.error("Raw Response Body:", await adGroupAdResponse.text());
        throw new Error(
          "Unknown error occurred and response could not be parsed."
        );
      }
    }

    // Parse the successful response
    const responseData = await adGroupAdResponse.json();
    console.log(
      "Ad Group Ad created successfully:",
      JSON.stringify(responseData, null, 2)
    );

    return {
      campaignId,
      adGroupId: adGroupData.results[0].resourceName.split("/").pop(),
      assetResource,
    };
  } catch (error) {
    console.error("Error creating Google Ads campaign:", error);
    throw new Error("Failed to create Google Ads campaign.");
  }
}
export const runtime = "nodejs";
export async function POST(req) {
  const formData = await req.formData();
  const targetZip = formData.get("targetZip");
  const budget = parseFloat(formData.get("budget"));
  const duration = parseInt(formData.get("duration"), 10);
  const videoFile = formData.get("video");
  const price = parseFloat(formData.get("price"));
  const restorantId = formData.get("restorantId");
  const description = formData.get("description");
  const userId = formData.get("userId");
  const dish = formData.get("dish");
  const selectedPlatforms = parseSelectedPlatforms(formData.get("selectedPlatforms"));
  const budgetPerPlatform = calculateBudgetPerPlatform(
    budget,
    selectedPlatforms.length > 0 ? selectedPlatforms : ["google_ads"]
  );

  if (
    !targetZip ||
    isNaN(budget) ||
    isNaN(duration) ||
    !videoFile ||
    isNaN(price) ||
    !description ||
    !userId ||
    !restorantId ||
    !dish
  ) {
    return NextResponse.json(
      { error: "Invalid input fields." },
      { status: 400 }
    );
  }

  try {
    const accessToken = await getRefreshTokenFromDatabase();

    const videoId = await uploadVideoToYouTube(videoFile,description,accessToken)
    const savedVideo = await saveToDatabase(
      videoId,
      price,
      description,
      userId,
      restorantId,
      dish
    );
    const saavedVideoId = savedVideo.id;
    console.log("the video saved sussfully:", savedVideo.id);
    const publishResults = [];

    if (selectedPlatforms.includes("google_ads")) {
      const campaignData = await createGoogleAdsCampaign(
        videoId,
        targetZip,
        budgetPerPlatform,
        description,
        duration,
        accessToken,
        restorantId,
        dish,
        saavedVideoId,
        price
      );

      publishResults.push({
        platform: "google_ads",
        status: "published",
        campaignId: campaignData.campaignId,
        budget: budgetPerPlatform,
      });
    }

    if (selectedPlatforms.includes("tiktok")) {
      publishResults.push({
        platform: "tiktok",
        status: "queued",
        budget: budgetPerPlatform,
      });
    }

    if (selectedPlatforms.includes("snapshot")) {
      publishResults.push({
        platform: "snapshot",
        status: "queued",
        budget: budgetPerPlatform,
      });
    }

    if (selectedPlatforms.includes("x")) {
      publishResults.push({
        platform: "x",
        status: "queued",
        budget: budgetPerPlatform,
      });
    }

    if (selectedPlatforms.includes("linkedin")) {
      publishResults.push({
        platform: "linkedin",
        status: "queued",
        budget: budgetPerPlatform,
      });
    }

    return NextResponse.json(
      {
        success: true,
        selectedPlatforms,
        budgetPerPlatform,
        publishResults,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process request." },
      { status: 500 }
    );
  }
}

async function saveToDatabase(
  videoId,
  price,
  description,
  userId,
  restorantId,
  dish
) {
  try {
    return await prisma.menu.create({
      data: {
        videoUrl: videoId,
        description: description,
        price: price,
        user: { connect: { id: userId } },
        restorant: { connect: { id: restorantId } },
        dish: dish,
      },
    });
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to save data to the database.");
  }
}
