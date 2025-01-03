import React from "react";
import { FaTrophy, FaStar } from "react-icons/fa"; // Importing icons for badges
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

  // Helper function to calculate badges for a user
  const getBadges = (user) => {
    const badges = [];
    console.log(user);
    // Badge for adding 10+ places
    if (user.placeCount >= 1) {
      badges.push({
        id: "placesBadge",
        icon: <FaTrophy />,
        title: "10+ Places Added",
      });
    }

    // Badge for receiving 50+ upvotes
    if (user.totalUpvotes >= 50) {
      badges.push({
        id: "upvoteBadge",
        icon: <FaStar />,
        title: "50+ Upvotes",
      });
    }

    return badges;
  };

  // Prepare user data and calculate derived values
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

  // Sort users in descending order by total upvotes
  const sortedUsers = usersWithStats.sort(
    (a, b) => b.totalUpvotes - a.totalUpvotes
  );

  return (
    <ul className="users-list">
      {sortedUsers.map((user) => {
        const badges = getBadges(user); // Get badges for each user
        console.log("badge", badges);
        return (
          <UserItem
            key={user.id}
            id={user.id}
            image={user.image}
            name={user.name}
            placeCount={user.placeCount}
            totalUpvotes={user.totalUpvotes}
            totalDownvotes={user.totalDownvotes}
          >
            <div className="user-badges">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="badge unlocked"
                  title={badge.title}
                >
                  <div className="badge-icon">{badge.icon}</div>
                  <span>{badge.title}</span>
                </div>
              ))}
            </div>
          </UserItem>
        );
      })}
    </ul>
  );
};

export default UsersList;
