
import { Link } from "react-router-dom";

export default function LogoutPage(props) {
  
    return (
      <div className="logo">
      <header>
            <div className="image-text text-center">
              <span className="image" style={{ width: "100%" }}>
                <img src="logo.png" alt="" />
              </span>
            </div>
          </header>
      <div className="main_logout">
      <h3>You have been logged out of the application.Please <a href="/" style={{color:"blue",cursor:"pointer"}}>click here</a> to log in again. </h3>
      </div>
      </div>
    );
  }