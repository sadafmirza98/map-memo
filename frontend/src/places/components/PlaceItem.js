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
import "./PlaceItem.css";

const PlaceItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  const [upvotes, setUpvotes] = useState(props.upvotes || 0);
  const [downvotes, setDownvotes] = useState(props.downvotes || 0);
  const [userVote, setUserVote] = useState(props.userVote || null);

  const handleUpvote = async () => {
    if (!auth.isLoggedIn || userVote === "upvote") return;

    const updatedUpvotes = upvotes + 1;
    const updatedDownvotes =
      userVote === "downvote" ? downvotes - 1 : downvotes;

    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}.json`,
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
        `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}.json`,
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
        show={false}
        onCancel={() => {}}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={() => {}}>CLOSE</Button>}
      >
        <div className="map-container"></div>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img
              src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
              alt={props.title}
            />
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
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}
            {auth.userId === props.creatorId && (
              <Button danger onClick={() => {}}>
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
