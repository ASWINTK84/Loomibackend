import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

// Create the context 
const authContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setauth] = useState({
        user: "",
        token: "",
    });

    //default axios 

    axios.defaults.headers.common["Authorization"] = auth?.token ;

    useEffect(() => {
      const data = localStorage.getItem('auth');
      if(data){
       const parseData = JSON.parse(data)
        setauth({
            ...auth ,
            user: parseData.user ,
            token: parseData.token ,

        })
      }
      //eslint disable next line

    }, [])
    

    return (
        <authContext.Provider value={{ auth, setauth }}>
            {children} {/* This is where your app will be rendered */}
        </authContext.Provider>
    );
};

// Hook to access the auth context
const useAuth = () => useContext(authContext);

export { useAuth, AuthProvider };
