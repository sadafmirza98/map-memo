import React, { useState, useContext } from "react";
import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import uploadImageToGitHub from "../../uploadImageToGitHub"; // Import the function for image upload
import "./Auth.css";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [imageUrl, setImageUrl] = useState(null); // Store the image URL here

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        // Fetch all users from the database
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users.json", // GET request to fetch all users
          "GET"
        );

        const users = [];
        for (const key in responseData) {
          users.push({
            id: key,
            ...responseData[key],
          });
        }

        // Find user with the matching email
        const user = users.find(
          (u) => u.email === formState.inputs.email.value
        );

        if (!user) {
          throw new Error("No account found with this email.");
        }

        // Validate the password
        if (user.password !== formState.inputs.password.value) {
          throw new Error("Invalid credentials. Please try again.");
        }

        // Successful login
        auth.login(user.id, "dummyToken"); // Replace "dummyToken" with actual token if needed
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        // Handle signup logic as before
        const formData = {
          email: formState.inputs.email.value,
          name: formState.inputs.name.value,
          password: formState.inputs.password.value,
          image: imageUrl, // Save the uploaded image URL
        };

        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users.json", // POST to create new user
          "POST",
          JSON.stringify(formData),
          {
            "Content-Type": "application/json",
          }
        );

        // Successful signup
        auth.login(responseData.name, "dummyToken"); // Replace "dummyToken" with actual token if needed
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleImageUpload = async (file) => {
    try {
      const fileName = file.name; // Use the picked file's name
      const fileUrl = await uploadImageToGitHub(file, fileName);
      if (fileUrl) {
        setImageUrl(fileUrl); // Store the uploaded image URL
      }
    } catch (error) {
      console.error("Upload error:", error.message);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && (
            <ImageUpload
              center
              id="image"
              onInput={handleImageUpload} // Pass the handleImageUpload function
              errorText="Please provide an image."
            />
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password, at least 6 characters."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
