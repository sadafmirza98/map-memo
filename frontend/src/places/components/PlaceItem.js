import React, { useState, useContext } from "react";
import { BiUpvote, BiDownvote } from "react-icons/bi";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import axios from "axios";
import "./PlaceItem.css";

const PlaceItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [upvotes, setUpvotes] = useState(props.upvotes || 0);
  const [downvotes, setDownvotes] = useState(props.downvotes || 0);
  const [userVote, setUserVote] = useState(props.userVote || null);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = async () => {
    setShowConfirmModal(false);
  };
  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);

    // Construct the GitHub file URL and retrieve SHA
    const githubFileUrl = `https://api.github.com/repos/${process.env.REACT_APP_GITHUB_REPO}/contents/${props.image}`;
    try {
      // Step 1: Get the SHA of the file to delete
      const { data } = await axios.get(githubFileUrl, {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`,
        },
      });
      const sha = data.sha;

      // Step 2: Delete the image from GitHub
      await axios.delete(githubFileUrl, {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`,
        },
        data: {
          message: `Delete image ${props.image}`,
          sha: sha,
          branch: process.env.REACT_APP_GITHUB_BRANCH,
        },
      });

      console.log("Image deleted from GitHub:", props.image);

      // Step 3: Delete the place from the database
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/${auth.userId}/places/${props.id}.json`,
        "DELETE",
        null
      );

      props.onDelete(props.id);
    } catch (err) {
      console.error(
        "Error deleting image or place:",
        err.response?.data || err.message
      );
    }
  };

  const handleUpvote = async () => {
    if (!auth.isLoggedIn || userVote === "upvote") return;

    const updatedUpvotes = upvotes + 1;
    const updatedDownvotes =
      userVote === "downvote" ? downvotes - 1 : downvotes;

    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/${auth.userId}/places/${props.id}.json`,
        "PATCH",
        JSON.stringify({
          upvotes: updatedUpvotes,
          downvotes: updatedDownvotes,
          [`votedUsers/${auth.userId}`]: "upvote",
        })
      );

      setUpvotes(updatedUpvotes);
      setDownvotes(updatedDownvotes);
      setUserVote("upvote");
    } catch (err) {}
  };

  const handleDownvote = async () => {
    if (!auth.isLoggedIn || userVote === "downvote") return;

    const updatedDownvotes = downvotes + 1;
    const updatedUpvotes = userVote === "upvote" ? upvotes - 1 : upvotes;

    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/${auth.userId}/places/${props.id}.json`,
        "PATCH",
        JSON.stringify({
          upvotes: updatedUpvotes,
          downvotes: updatedDownvotes,
          [`votedUsers/${auth.userId}`]: "downvote",
        })
      );

      setDownvotes(updatedDownvotes);
      setUpvotes(updatedUpvotes);
      setUserVote("downvote");
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img src={`${props.image}`} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button
              inverse
              onClick={() => {
                const location = props.address;
                window.open(
                  `https://www.google.com/maps/search/?q=${encodeURIComponent(
                    location
                  )}`,
                  "_blank"
                );
              }}
            >
              VIEW ON MAP
            </Button>

            {auth.userId === props.creatorId && (
              <Button to={`/users/${auth.userId}/places/${props.id}`}>
                EDIT
              </Button>
            )}
            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
            {auth.isLoggedIn && (
              <div className="vote-controls">
                <div
                  className={`vote-badge ${
                    userVote === "upvote" ? "active-upvote" : ""
                  }`}
                  onClick={handleUpvote}
                >
                  <BiUpvote />
                </div>
                <span>{upvotes}</span>
                <div
                  className={`vote-badge ${
                    userVote === "downvote" ? "active-downvote" : ""
                  }`}
                  onClick={handleDownvote}
                >
                  <BiDownvote />
                </div>
                <span>{downvotes}</span>
              </div>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
