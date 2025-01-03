import React from "react";

import UserItem from "./UserItem";
import Card from "../../shared/components/UIElements/Card";
import "./UsersList.css";

const UsersList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No users found.</h2>
        </Card>
      </div>
    );
  }

  // Calculate upvotes and downvotes for each user and sort by upvotes in ascending order
  const sortedUsers = props.items
    .map((user) => {
      const totalUpvotes = user.places
        ? Object.values(user.places).reduce(
            (sum, place) => sum + (place.upvotes || 0),
            0
          )
        : 0;

      const totalDownvotes = user.places
        ? Object.values(user.places).reduce(
            (sum, place) => sum + (place.downvotes || 0),
            0
          )
        : 0;

      return { ...user, totalUpvotes, totalDownvotes };
    })
    .sort((a, b) => a.totalUpvotes - b.totalUpvotes);

  return (
    <ul className="users-list">
      {sortedUsers.map((user) => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.places ? Object.keys(user.places).length : 0}
          totalUpvotes={user.totalUpvotes}
          totalDownvotes={user.totalDownvotes}
        />
      ))}
    </ul>
  );
};

export default UsersList;
