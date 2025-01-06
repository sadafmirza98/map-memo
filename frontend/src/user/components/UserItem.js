import React from "react";
import { Link } from "react-router-dom";

import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";
import upvoteIcon from "../../shared/assets/upvote-icon.svg";
import downvoteIcon from "../../shared/assets/downvote-icon.svg";
import "./UserItem.css";

const UserItem = (props) => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <div className="user-item__badges">
          {props.badges.map((badge) => (
            <div
              key={badge.id}
              className={`user-badge ${
                badge.unlocked ? "user-badge--unlocked" : ""
              }`}
              title={badge.title}
            >
              <div className="user-badge__icon">{badge.icon}</div>
            </div>
          ))}
        </div>
        <Link to={`/${props.id}/places`}>
          <div className="user-item__image">
            <Avatar image={`${props.image}`} alt={props.name} />
          </div>
          <div className="user-item__info">
            <h2>{props.name}</h2>
            <h3>
              {props.placeCount} {props.placeCount === 1 ? "Place" : "Places"}
            </h3>
            <div className="user-item__votes">
              <img src={upvoteIcon} alt="Upvotes" />
              <span>{props.totalUpvotes}</span>
              <img src={downvoteIcon} alt="Downvotes" />
              <span>{props.totalDownvotes}</span>
            </div>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
