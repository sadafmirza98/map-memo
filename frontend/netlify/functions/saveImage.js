const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*", // Allow requests from any origin
    "Access-Control-Allow-Methods": "POST", // Allow POST requests
    "Access-Control-Allow-Headers": "Content-Type", // Allow Content-Type header
  };

  // Handle preflight CORS request (this happens before the actual POST request)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({}),
    };
  }

  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }

    const { fileName, fileContent } = JSON.parse(event.body);

    if (!fileName || !fileContent) {
      throw new Error("Invalid input: fileName and fileContent are required.");
    }

    const fileBuffer = Buffer.from(fileContent, "base64");
    const tempFilePath = path.join("/tmp", fileName);
    fs.writeFileSync(tempFilePath, fileBuffer);

    console.log(`File successfully saved at: ${tempFilePath}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "File uploaded successfully!",
        filePath: tempFilePath,
      }),
    };
  } catch (error) {
    console.error("Error handling upload:", error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
