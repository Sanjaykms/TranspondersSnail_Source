import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useAuthCxt } from "./authContext";
import { useEffect, useRef, useState } from "react";
import { getDatabase, ref, get, child, onChildRemoved, remove } from "firebase/database";
import { push, set } from "firebase/database";
import ChatMessages from "./Messages";

export default function MessageArea(){

    const authCxt = useAuthCxt();
    const db = getDatabase();
    const userId = authCxt.userInfo.userId;
    const [signNick, setSignNick] = useState(userId);
    const [mess, setMess] = useState("");

    

    const logout = async () => {
    const confirmLogout = window.confirm("Do you want to Log Out?");

    if (!confirmLogout) return;

    try {
      await signOut(auth);
      console.log("User signed out");
      authCxt.logoutHandler();
      // optional: navigate("/login");
    } catch (error:any) {
      alert(error.message);
    }
  };


  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const db = getDatabase();
        const snapshot = await get(
          child(ref(db), `profile/${userId}`)
        );

        if (snapshot.exists()) {
          setSignNick(snapshot.val());
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, [userId]);



 const Insert = async (e:any) => {
    e.preventDefault();

    if (signNick.length === 0) {
      alert("Enter a Transponder Name to Continue");
      return;
    }

    if (mess.length === 0) return;

    try {
      const db = getDatabase();
      const chatRef = push(ref(db, "Chats"));

      const now = new Date();

      await set(chatRef, {
        userId: userId,
        date: now.getDate(),
        month: now.getMonth(),
        year: now.getFullYear(),
        hours: now.getHours(),
        mins: now.getMinutes(),
        message: mess,
        nick: signNick,
      });

      setMess(""); // clear message input
    } catch (error:any) {
      console.error(error);
      alert(error.message);
    }
  };



   // delete message
  const deleted = async (messId:any) => {
    try {
      await remove(ref(db, `Chats/${messId}`));
    } catch (error) {
      console.error(error);
    }
  };

 




    return <>
    <div className="messagingarea">
        <label style={{pointerEvents: "none"}}>
          <input type="text" id="signNick" required value={signNick} onChange={(e:any)=>setSignNick(e.target.value)} />
          <span className="words">Transponder Name</span>
          <span className="bord"></span>
        </label>
        <div className="messages">
          <div className="part">
            <p>Enter some message here.</p>
          </div>
          {/* <div className="messings">
          </div> */}
          <ChatMessages userId={userId} onDelete={deleted} />
          <span id="track"></span>
          <div className="messslide"><a href="#track">➠</a></div>
        </div>
        <form className="typingarea" onSubmit={Insert}>
            <input type="text" placeholder="Type a message" id="mess" value={mess} onChange={(e)=>setMess(e.target.value)} />
            <button type="submit" >🐌</button>
          <button type="button" onClick={logout}>Log out</button>
        </form>
      </div>
    </>
}