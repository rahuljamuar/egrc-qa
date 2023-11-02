import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const RoleSwitch = (props) => {
    const handleClick=(selectedRole)=>{
        props.roleSelectedAfterLogin(selectedRole);
        sessionStorage.setItem("selectedRole", selectedRole);
    }

  return (
    <div
    id="popup-modal-role"
    tabindex="-1"
    className={`${
      props?.showRoleDialog ? "" : "hidden"
    } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 md:inset-0 h-modal md:h-full`}
  >
    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
      <div className="relative bg-darkblue2 rounded-lg shadow dark:bg-gray-700">
        <div className="flex justify-end p-2">
        </div>

        <div className="p-6 pt-0 text-center">
        <span className="image justify-center flex" style={{ width: "100%" }}>
                <img src="logo.png" alt="" />
              </span>
         <h3 className="mb-1 text-xl font-semibold text-gray-500 dark:text-gray-400 pb-5">
            Do you want to log-in as an :
          </h3> 
         { props?.isUserOwner &&
         <Link to="/newowner">
             <button
            data-modal-toggle="popup-modal"
            type="button"
            value={"Owner"}
            onClick={(e)=>handleClick(e.target.value)}
            className="ml-6 text-black bg-white hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
          >
            Owner
          </button>
         </Link>}
         
         {props?.isUserReviewer  && 
          <Link to="/Reviewer">
              <button
            data-modal-toggle="popup-modal"
            type="button"
            value={"Reviewer"}
            onClick={(e)=>handleClick(e.target.value)}
            className="ml-6 text-black bg-white hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
          >
            Reviewer
          </button>
          </Link>}
          
         {props?.isUserAdmin &&
                   <Link to="/Admin">
                   <button
            data-modal-toggle="popup-modal"
            type="button"
            value={"Admin"}
            onClick={(e)=>handleClick(e.target.value)}
            className="ml-6 text-black bg-white hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
          >
            Admin
          </button>
          </Link>}
        </div>
      </div>
    </div>
    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
  </div>
  );
};

export default RoleSwitch;
