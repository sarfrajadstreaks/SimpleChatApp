import React from "react";

import onlineIcon from "../../icons/onlineIcon.png";

import "./TextContainer.css";

const TextContainer = ({ users }) => (
  <div className="textContainer">
    {users ? (
      <div className="memberContainer">
        <h2>Members</h2>
        <div className="activeContainer">
          {users.map(({ name }) => (
            <span key={name}>
              {name}
              <img alt="Online Icon" src={onlineIcon} /> &nbsp;
            </span>
          ))}
        </div>
      </div>
    ) : null}
  </div>
);

export default TextContainer;
