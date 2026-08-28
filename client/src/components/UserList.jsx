import React, { useState } from "react";

const UserList = ({ me, users, activeUser, unread, onlineCount, onSelect, onLogout }) => {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="user-profile">
          <div className="avatar me-avatar">
            {me?.name ? me.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <div className="user-name">{me?.name}</div>
            <div className="user-status">Online</div>
          </div>
        </div>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="users-scroll">
        {filteredUsers.map((u) => {
          const isSelected = activeUser?._id === u._id;
          const count = unread?.[u._id] || 0;

          return (
            <div
              key={u._id}
              className={`user-item ${isSelected ? "active" : ""}`}
              onClick={() => onSelect(u)}
            >
              <div className="avatar">
                {u.name.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <div className="user-item-name">{u.name}</div>
              </div>
              {count > 0 && <span className="unread-badge">{count}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserList;