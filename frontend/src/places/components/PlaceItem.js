/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import upvoteIcon from "../../shared/assets/upvote-icon.svg";
import downvoteIcon from "../../shared/assets/downvote-icon.svg";
import axios from "axios";
//import Map from '../../shared/components/UIElements/Map';
import "./PlaceItem.css";

const PlaceItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);

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
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          {/*  <Map center={props.coordinates} zoom={16} /> */}
        </div>
      </Modal>
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
            <Button inverse onClick={() => {}}>
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
                <img
                  src={upvoteIcon}
                  alt="Upvote"
                  className={`vote-icon ${
                    userVote === "upvote" ? "active" : ""
                  }`}
                  onClick={handleUpvote}
                />
                <span>{upvotes}</span>
                <img
                  src={downvoteIcon}
                  alt="Downvote"
                  className={`vote-icon ${
                    userVote === "downvote" ? "active" : ""
                  }`}
                  onClick={handleDownvote}
                />
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
