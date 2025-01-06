import React, { useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem";
import Button from "../../shared/components/FormElements/Button";
import "./PlaceList.css";
import { AuthContext } from "../../shared/context/auth-context";
const GITHUB_REPO = process.env.REACT_APP_GITHUB_REPO;

const PlaceList = (props) => {
  const auth = useContext(AuthContext);
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No places found. Maybe create one?</h2>
          <Button to="/places/new">Add Place</Button>
        </Card>
      </div>
    );
  }

  const imageBaseUrl = `https://github.com/${GITHUB_REPO}/raw/main/uploads/${auth.userId}`;

  return (
    <ul className="place-list">
      {props.items.map((place) => {
        const imageUrl = `${imageBaseUrl}/${place.image}`; // Construct the image URL for each place
        return (
          <PlaceItem
            key={place.id}
            id={place.id}
            image={imageUrl}
            title={place.title}
            description={place.description}
            address={place.address}
            creatorId={place.creatorId}
            coordinates={place.location}
            upvotes={place.upvotes}
            downvotes={place.downvotes}
            votedUsers={place.votedUsers}
            currentUserId={props.currentUserId}
            onDelete={props.onDeletePlace}
          />
        );
      })}
    </ul>
  );
};

export default PlaceList;
