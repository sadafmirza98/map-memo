import React, { useRef, useState, useEffect } from "react";
import Button from "./Button";
import "./ImageUpload.css";
import uploadImageToGitHub from "../../../uploadImageToGitHub"; // Import the function

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
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
    setUploadError(null); // Reset previous upload errors
    setUploadSuccess(null); // Reset previous success message
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
      props.onInput(props.id, pickedFile, true); // Pass the file and isValid=true
      try {
        const fileUrl = await uploadImageToGitHub(
          pickedFile,
          pickedFile.name,
          props.userId
        );

        if (fileUrl) {
          setUploadSuccess("Image uploaded successfully!");
          console.log("Uploaded File URL:", fileUrl);
        }
      } catch (error) {
        setUploadError("Failed to upload image");
        console.error("Upload error:", error.message);
      }
    } else {
      setIsValid(false);
      props.onInput(props.id, null, false); // Handle invalid input
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
    setUploadError(null);
    setUploadSuccess(null);
  };

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
      {uploadSuccess && <p className="success-text">{uploadSuccess}</p>}
    </div>
  );
};

export default ImageUpload;
