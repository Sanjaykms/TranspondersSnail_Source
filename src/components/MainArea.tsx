import Login from "./Login";
import Logo from "../assets/TranspondersSnail.jpg";
import MessageArea from "./MessageArea";

export default function MainArea(){
    return <>
    <div className="mainarea">
        <h1 className="snail"><img src={Logo} />TRANSPONDERS SNAIL</h1>
        <Login />
        {/* <MessageArea /> */}
    </div>
    </>
}