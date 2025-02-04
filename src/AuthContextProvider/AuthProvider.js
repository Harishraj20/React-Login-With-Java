import React, { useEffect, useState } from "react";
import authContext from "../AuthContext/AuthContext";

function AuthProvider({ children }) {
  const [authStatus, setAuthStatus] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   const checkAuthToken = async () => {
  try {
    const response = await fetch("http://localhost:8080/userlogin/auth", {
      credentials: "include",
    });

    if (response.status === 401) {
      setAuthStatus(false);
      return
    }

    if (!response.ok) {
      return
    }

    const data = await response.json();
    console.log("User authenticated!", data);
    setAuthStatus(true);
  } catch (error) {
    setAuthStatus(false);
    console.error(error); 
  } finally {
    setLoading(false);
  }
};

    checkAuthToken();
  });

  return (
    <authContext.Provider value={{ authStatus, loading, setAuthStatus }}>
      {children}
    </authContext.Provider>
  );
}

export default AuthProvider;
