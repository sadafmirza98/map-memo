import React from "react";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import UserItem from "./UserItem";
import Card from "../../shared/components/UIElements/Card";
import "./UsersList.css";

const GITHUB_REPO = process.env.REACT_APP_GITHUB_REPO;

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

  const getBadges = (user) => {
    const badges = [];
    if (user.placeCount >= 5) {
      badges.push({
        id: "placesBadge",
        icon: <FaMapMarkerAlt />,
        title: "5+ Places Added",
      });
    }
    if (user.totalUpvotes >= 10) {
      badges.push({
        id: "upvoteBadge",
        icon: <FaStar />,
        title: "10+ Upvotes",
      });
    }
    return badges;
  };

  const usersWithStats = props.items.map((user) => {
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

    const placeCount = user.places ? Object.keys(user.places).length : 0;

    return {
      ...user,
      totalUpvotes,
      totalDownvotes,
      placeCount,
    };
  });

  const sortedUsers = usersWithStats.sort(
    (a, b) => b.totalUpvotes - a.totalUpvotes
  );

  const imageBaseUrl = `https://github.com/${GITHUB_REPO}/raw/main/uploads/profile`;

  return (
    <ul className="users-list">
      {sortedUsers.map((user) => {
        const badges = getBadges(user);
        const imageUrl = `${imageBaseUrl}/${user.image}`;
        return (
          <UserItem
            key={user.id}
            id={user.id}
            image={imageUrl}
            name={user.name}
            placeCount={user.placeCount}
            totalUpvotes={user.totalUpvotes}
            totalDownvotes={user.totalDownvotes}
            badges={badges} // Pass the badges prop
          />
        );
      })}
    </ul>
  );
};

export default UsersList;
