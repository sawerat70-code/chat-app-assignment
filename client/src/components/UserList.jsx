import { useState } from "react";
import React from "react";
const userList=({users,selectedUser,onSelectUser,onlineList=[],unreadCounts={}})=>{
  return(
    <div className="user-list">
      {users.map((u)=>{
        const isOnline=onlineList.includes(u._id);
        const unread=unreadCounts[u._id]||0;
        const isSelected=selectedUser?._id ===u._id;
        return(
          <div
          key={u._id}
          className={`user-item${isSelected ? "active": ""}`}
          onClick={()=>onSelectUser(u)}
          >
            <div className="avatar" style={{position:"relative"}}>
              {u.name.charAt(0).toUpperCase()}
            </div>
            {isOnline && <div className="online-dot"/>}
            <div className="user-item-inf0">
              <div className="user-item-name">
                <span>{u.name}</span>
              </div>
              <div className="user-item-status">{isOnline? "Online" : "Offline"}</div>
        
            </div>
            {unread >0 && <div className="unread-badge">{unread}</div>}
</div>
        );
      })}
    </div>
  );
};

export default UserList;