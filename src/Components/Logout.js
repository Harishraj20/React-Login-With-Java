import React,{useContext} from "react";
import { useNavigate } from "react-router-dom";
import authContext from "../AuthContext/AuthContext";

function Logout() {
  const navigate = useNavigate();
  console.log(typeof navigate)
  const {setAuthStatus}  = useContext(authContext);
  const handleLogout = async () => {
    const response = await fetch("http://localhost:8080/userlogin/logout",{
        method:"GET",
        credentials:"include"
    });

    if (!response.ok) {
        console.log("errored occured!........")
    }
    setAuthStatus(false)
    navigate("/Login");
  };

  return (
    <>
      <button onClick={handleLogout}>Log out</button>
    </>
  );
}

export default Logout;
