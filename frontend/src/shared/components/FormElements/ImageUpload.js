import React, { useRef, useState, useEffect } from "react";

import Button from "./Button";
import "./ImageUpload.css";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

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
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Image = reader.result.split(",")[1];
        await fetch("/.netlify/functions/saveImage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: pickedFile.name,
            fileContent: base64Image,
          }),
        });
      };
      reader.readAsDataURL(pickedFile);
    }
  };

  /* const pickedHandler = (event) => {
  let pickedFile;
  let fileIsValid = isValid;
  if (event.target.files && event.target.files.length === 1) {
    pickedFile = event.target.files[0];
    setFile(pickedFile);
    setIsValid(true);
    fileIsValid = true;
  } else {
    setIsValid(false);
    fileIsValid = false;
  }
  props.onInput?.(props.id, pickedFile, fileIsValid);
}; */

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  const clearImageHandler = () => {
    setFile(null);
    setPreviewUrl(null);
    setIsValid(false);
    localStorage.removeItem("uploadedImage");
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
    </div>
  );
};

export default ImageUpload;
