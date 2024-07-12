import React, { createContext, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/navbar.component'
import UserAuthForm from './pages/userAuthForm.page'
import { lookInSession } from './common/session';
import { useState } from 'react';


//context is global state you can access from anywhere
export const UserContext = createContext({});

const App = () => {

  const [userAuth, setUserAuth] = useState({});

  useEffect(() => {
    console.log('Running useEffect');
    let userInSession = lookInSession('user');
    console.log('User in session:', userInSession);
    userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token: null });
    console.log('UserAuth:', userAuth);
  }, []);

  return (
     <UserContext.Provider value={{userAuth, setUserAuth}}>
       <Routes>
         <Route path='/' element={<Navbar />}>
           <Route path='/signin' element={<UserAuthForm type="sign-in" />}/>
           <Route path='/signup' element={<UserAuthForm type="sign-up" />}/>
        </Route>
       </Routes>
     </UserContext.Provider>

  )
}

export default App
