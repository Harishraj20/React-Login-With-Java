import "./App.css";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Details from "./Components/Details";
import PrivateRoutes from "./PrivateRoutes";
import Logout from "./Components/Logout";


function App() {
  return (
    

    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/users/home" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/details" element={<Details />} />
          <Route path="/users/logout" element={<Logout />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
