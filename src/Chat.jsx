import { Avatar } from '@mui/material';
import React, {useEffect, useState} from 'react';
import "./css/chat.css";
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import db from "./firebase.js";
import firebase from 'firebase';
import { useStateValue } from './StateProvider';


const Chat = () => {

  //for taking room id dynamically we use useparams
  const {roomId} = useParams();
  const [roomName, setRoomName] = useState("");
  const [message, setMessage] = useState([]);
 
  const [input, setInput] = useState("");

  const [{user}, dispatch] = useStateValue();

  const [seed, setSeed] = useState("");

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  useEffect(()=>{
     if(roomId){
       //here we fetch the room names
        db.collection("rooms").doc(roomId).onSnapshot(snapshot=>{
          setRoomName(snapshot.data().name);
        })

        //now fetch the messages 
        db.collection("rooms").doc(roomId).collection("message").orderBy("timestamp","asc").onSnapshot(snapshot=>{
          setMessage(snapshot.docs.map(doc=>doc.data())); 
        })


     }
  }, [roomId]);


  const sendMessage = (e)=>{
    //its stop refreshing the page after submit a text
      e.preventDefault();
      if(input==="")
      {
        return alert("Please enter your message");
      }
      
      //roomId taken from useParams
      db.collection("rooms").doc(roomId).collection("message").add({
        name: user.displayName,
        //which you write in input field this will be message
        message: input,
        //by the time we get which is latest or old message. Time taken from server bcz different country have different time
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
       //bcz after send the msg input field be empty
     setInput("");

  }


  return (
    <>
      <div className="chat">
        <div className="chat__header">
          <Avatar  src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
          <div className='chat__headerInfo'>
             <h3>{roomName}</h3>
             <p>
               {
                   new Date(message[message.length-1]?.timestamp?.seconds*1000).toLocaleTimeString()
               }
             </p>
          </div>
     
        </div>
        
        <div className="chat__body">
          {
            message.map(message=>(
            <p className={`chat__message ${user.displayName==message.name && "chat__reciever"}`}>
              <span className='chat__name'>{message.name}</span>
                {message.message}
              <span className='chat__time'>
                 {
                   new Date(message.timestamp?.seconds*1000).toLocaleTimeString()
                 }
              </span>
            </p>
            ))
          } 
        </div>
          
        <div className="chat__footer">
           <form onSubmit={sendMessage}>
             <input type="text" value={input} placeholder='New message' onChange={e=>setInput(e.target.value)}/>
             <input type="button" value="Send" onClick={sendMessage} style={{cursor: 'pointer'}}/>
           </form>
           
        </div>

      </div>
    </>
  )
}

export default Chat;