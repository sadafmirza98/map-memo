import React, { useContext, useState, useEffect } from "react";
import {
  FaThumbsUp,
  FaMapMarkerAlt,
  FaGlobe,
  FaStar,
  FaRocket,
  FaMedal,
} from "react-icons/fa";
import "./Achievements.css";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Achievements = () => {
  const { sendRequest } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users.json"
        );

        const usersArray = responseData
          ? Object.keys(responseData).map((key) => ({
              id: key,
              ...responseData[key],
            }))
          : [];
        setLoadedUsers(usersArray);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, [sendRequest]);

  const calculateBadges = () => {
    let badges = [];

    loadedUsers.forEach((user) => {
      const places = user?.places || {}; // Default to an empty object if places are undefined

      // Calculate total upvotes
      const totalUpvotes = Object.values(places).reduce(
        (sum, place) => sum + (place.upvotes || 0),
        0
      );

      // Unique regions
      const uniqueRegions = new Set(
        Object.values(places).map((place) => place.region || "")
      );

      // Achievements
      if (Object.keys(places).length >= 10) badges.push("placesBadge");
      if (totalUpvotes >= 50) badges.push("upvoteBadge");
      if (uniqueRegions.size >= 3) badges.push("explorerBadge");
      if (totalUpvotes >= 100) badges.push("superUpvoteBadge");
      if (Object.keys(places).length >= 20) badges.push("masterPlacesBadge");
      if (uniqueRegions.size >= 5) badges.push("globalExplorerBadge");
    });

    return badges;
  };

  const badges = calculateBadges();

  const badgeData = [
    {
      id: "placesBadge",
      icon: <FaMapMarkerAlt />,
      title: "10+ Places Added",
      description: "Add 10 or more places to unlock.",
    },
    {
      id: "upvoteBadge",
      icon: <FaThumbsUp />,
      title: "50+ Upvotes",
      description: "Get 50 or more upvotes to unlock.",
    },
    {
      id: "explorerBadge",
      icon: <FaGlobe />,
      title: "Explorer",
      description: "Explore places from 3+ regions to unlock.",
    },
    {
      id: "superUpvoteBadge",
      icon: <FaStar />,
      title: "100+ Upvotes",
      description: "Get 100 or more upvotes to unlock.",
    },
    {
      id: "masterPlacesBadge",
      icon: <FaMedal />,
      title: "20+ Places Added",
      description: "Add 20 or more places to unlock.",
    },
    {
      id: "globalExplorerBadge",
      icon: <FaRocket />,
      title: "Global Explorer",
      description: "Explore places from 5+ regions to unlock.",
    },
  ];

  return (
    <div className="achievements text-backdrop">
      <h2>Achievements</h2>

      <div className="badge-section">
        {badgeData.map((badge) => (
          <div
            key={badge.id}
            className={`badge ${
              badges.includes(badge.id) ? "unlocked" : "locked"
            }`}
          >
            <div className="badge-icon">{badge.icon}</div>
            <span>{badge.title}</span>
            <p className="description">
              {badges.includes(badge.id) ? "Unlocked!" : badge.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
