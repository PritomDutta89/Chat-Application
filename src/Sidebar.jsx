import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "./css/sidebar.css";
import SidebarChat from "./SidebarChat";
import db from "./firebase.js";
import { useStateValue } from "./StateProvider";
import firebase from "firebase";

const Sidebar = () => {
  const [rooms, setRooms] = useState([]);

  const [{user}, dispatch] = useStateValue();

  // when the app render, so it gives data from database
  useEffect(() => {
    //when a data goes in DB, then onSnapshot take a snap of the data and return it

    //firebase version 8

    db.collection("rooms").onSnapshot((snapshot) => {
      setRooms(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
  }, []);

  return (
    <>
      {/* header part in sidebar */}

      <div className="sidebar">
        <div className="sidebar__header">
          <Avatar src={user.photoURL} onClick={e=>firebase.auth().signOut()} title="Sign Out" style={{cursor: 'pointer'}}/>

        </div>

        {/* searchbar after header part */}

        <div className="sidebar__search">
          <div className="sidebar__searchContainer">
            <SearchIcon />
            <input type=" text" placeholder="Search or Start a new chat" />
          </div>
        </div>

        {/* chat section after search bar */}

        <div className="sidebar__Chats">
          {/* here have multiple chats, so use a component, bcz this is reusable */}
          <SidebarChat addnewchat />
          {

            rooms.map((room) => {
            return (
              <SidebarChat key={room.id} id={room.id} name={room.data.name} />
            );
            })
          
          }
        </div>
      </div>
    </>
  );
};

export default Sidebar;
