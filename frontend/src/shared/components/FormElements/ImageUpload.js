import React, { useRef, useState, useEffect } from "react";

import Button from "./Button";
import "./ImageUpload.css";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);
  const [uploadError, setUploadError] = useState(null); // Added for debugging upload issues
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
      // Save the file preview to localStorage
      localStorage.setItem("uploadedImage", fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = async (event) => {
    if (event.target.files && event.target.files.length === 1) {
      const pickedFile = event.target.files[0];

      // Validate file type and size
      if (!["image/jpeg", "image/png", "image/jpg"].includes(pickedFile.type)) {
        setUploadError(
          "Invalid file type. Only JPEG, PNG, and JPG are allowed."
        );
        return;
      }
      if (pickedFile.size > MAX_FILE_SIZE) {
        setUploadError("File size is too large!");
        return;
      }

      setFile(pickedFile);
      setIsValid(true);

      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Image = reader.result.split(",")[1];
          const uploadUrl =
            process.env.NODE_ENV === "development"
              ? "http://localhost:8888/.netlify/functions/saveImage"
              : "/.netlify/functions/saveImage";

          const response = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileName: pickedFile.name,
              fileContent: base64Image,
            }),
          });

          if (!response.ok) {
            throw new Error("Image upload failed!");
          }

          const data = await response.json();
          console.log("Upload success:", data);
        } catch (error) {
          console.error("Upload error:", error.message);
          setUploadError(error.message);
        }
      };
      reader.readAsDataURL(pickedFile);
    } else {
      setIsValid(false);
    }
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  const clearImageHandler = () => {
    setFile(null);
    setPreviewUrl(null);
    setIsValid(false);
    localStorage.removeItem("uploadedImage");
    setUploadError(null); // Clear error messages
  };

  useEffect(() => {
    // Load image from localStorage if available
    const storedImage = localStorage.getItem("uploadedImage");
    if (storedImage) {
      setPreviewUrl(storedImage);
    }
  }, []);

  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
        {previewUrl && (
          <Button type="button" onClick={clearImageHandler}>
            CLEAR IMAGE
          </Button>
        )}
      </div>
      {!isValid && <p>{props.errorText}</p>}
      {uploadError && <p className="error-text">{uploadError}</p>}
    </div>
  );
};

export default ImageUpload;
