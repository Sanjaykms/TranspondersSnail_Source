import { useNavigate } from "react-router-dom";
import { useAuthCxt } from "./authContext";
import { useRef } from "react";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

import { getDatabase, ref, push, set } from "firebase/database";

export default function Login(){
    const authCxt = useAuthCxt();
    const navigate = useNavigate();
    const Userid = useRef<any>("");
    const Password = useRef<any>("");

     

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const userid = Userid.current.value;
        const password = Password.current.value;

       if (!(userid && password)) {
        alert("Check the values entered...")
        return;
        } 
        else{
            try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                userid,
                password
            );

            const user = userCredential.user;
            console.log("Logged in user:", user);
            
            authCxt.loginHandler(user.uid,"user");
            } catch (error:any) {
            alert(`${error.code}  ${error.message}`);
            }
        }

        
        navigate("/chat")
    }



    const db = getDatabase();

  const request = async (e:any) => {
    e.preventDefault();

    if (Userid.current.value.length > 10) {
      try {
        const requestRef = push(ref(db, "Requests"));

        await set(requestRef, {
          e_mail: Userid.current.value,
        });

        alert("Inserted");
        Userid.current.value = "";
      } catch (error:any) {
        alert(error.message);
      }
    } else {
      alert("Enter valid email");
    }
  };

    

    return <>
     
        <div className="loginarea">
          <form className="signin" onSubmit={handleSubmit}>
              <label>
                <input type="text" id="signName" required ref={Userid} />
                <span className="words">Email-id</span>
                <span className="bord"></span>
              </label>  
              <label>
                <input type="password" id="signPass" required ref={Password} />
                <span className="words">Password</span>
                <span className="bord"></span>
              </label>
              <button type="submit">Sign in</button>
              <h3><span style={{fontStyle:"italic",color:"red"}}>Don't have an Account :</span>  Get sign in authority at <input type="button" value="Request" onClick={request} /></h3>
              <p>Note : Above Request option needs Email id. So make sure to enter a valid email in above Email area [ no need for any other details only email ] .</p>
            </form>
      </div> 
    </>
}