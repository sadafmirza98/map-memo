import axios from "axios";

const GITHUB_REPO = process.env.REACT_APP_GITHUB_REPO; // Replace with your repo
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;
const BRANCH = process.env.REACT_APP_GITHUB_BRANCH;

const uploadImageToGitHub = async (file, fileName) => {
  const base64File = await toBase64(file);
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${fileName}`;
  let sha = null;

  try {
    // Step 1: Check if the file exists
    try {
      const existingFileResponse = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
      });
      sha = existingFileResponse.data.sha; // Retrieve the `sha` of the existing file
      console.log("File exists. Retrieved sha:", sha);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log("File does not exist. Proceeding with new upload.");
      } else {
        throw error;
      }
    }

    // Step 2: Upload or update the file
    const requestData = {
      message: `Add/Update ${fileName}`,
      content: base64File,
      branch: BRANCH,
    };

    // Include `sha` for updates
    if (sha) {
      requestData.sha = sha;
    }

    const response = await axios.put(url, requestData, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    });

    const fileUrl = response.data.content.download_url;
    console.log("Uploaded File URL:", fileUrl);
    return fileUrl;
  } catch (error) {
    console.error(
      "GitHub upload error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (error) => reject(error);
  });

export default uploadImageToGitHub;
