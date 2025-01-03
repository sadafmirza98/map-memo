const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  const { fileName, fileContent } = JSON.parse(event.body);

  // Save image locally (use only for debugging purposes)
  const filePath = path.join("/tmp", fileName); // `/tmp` is writable on Netlify
  fs.writeFileSync(filePath, Buffer.from(fileContent, "base64"));

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Image saved successfully!" }),
  };
};
