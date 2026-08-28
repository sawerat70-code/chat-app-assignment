import React, { useState } from "react";

const UserList = ({ me, users, activeUser, unread, onlineCount, onSelect, onLogout }) => {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="side">
      <div className="side-head">
        <div className="me">
          <div className="avatar">
            {me?.name ? me.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <div className="name">{me?.name}</div>
            <div className="small muted">Online</div>
          </div>
        </div>
        <button onClick={onLogout} className="link-btn">Logout</button>
      </div>

      <div className="search">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="list">
        {filteredUsers.map((u) => {
          const isSelected = activeUser?._id === u._id;
          const count = unread?.[u._id] || 0;

          return (
            <div
              key={u._id}
              className={`row ${isSelected ? "active" : ""}`}
              onClick={() => onSelect(u)}
            >
              <div className="avatar">
                {u.name.charAt(0).toUpperCase()}
              </div>
              <div className="info">
                <div className="name">{u.name}</div>
              </div>
              {count > 0 && <span className="badge">{count}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserList;