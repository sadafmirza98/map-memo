const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method not allowed" }),
    };
  }

  const { fileName, fileContent } = JSON.parse(event.body);

  if (!fileName || !fileContent) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid data" }),
    };
  }

  const filePath = path.join("/tmp", fileName);
  fs.writeFileSync(filePath, Buffer.from(fileContent, "base64"));

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "File saved successfully!" }),
  };
};
