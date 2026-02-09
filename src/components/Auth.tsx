import {Route, Routes, Navigate, BrowserRouter} from 'react-router-dom';
import Logo from "../assets/TranspondersSnail.jpg";
import Login from './Login';
import MessageArea from './MessageArea';
import RequireAuth from './requireAuth';
import { useAuthCxt } from './authContext';
import Signup from './SignUp';

export default function Auth(){
    
  const { userInfo, isLogged } = useAuthCxt();
    return <>
    <BrowserRouter>
    <div className="mainarea">
        <h1 className="snail"><img src={Logo} />TRANSPONDERS SNAIL</h1>
        <Routes>
            <Route path="/" element={<Login />}>  </Route>  
            <Route path="/signup" element={<Signup />}>  </Route>  
            <Route element={<RequireAuth role={userInfo.userType} isLogged={isLogged} />}>
                <Route path='/chat' element={<MessageArea/>}>
            </Route>
        </Route>
            
        </Routes>
    </div>
    </BrowserRouter>
    
    </>
}