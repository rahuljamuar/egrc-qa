import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { sideNavState } from "../../atoms/sideNavState";
import { useDetectOutsideClick } from "../../utils/useDetectOutsideClick";
import "./SideNav.css";

function SideNav(props) {
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useRecoilState(sideNavState);
  const [toggleDark, setToggleDark] = useState(true);
  const [toggleContorl, setToggleContorl] = useDetectOutsideClick(
    dropdownRef,
    false
  );
  const [toggleMenu, setToggleMenu] = useDetectOutsideClick(dropdownRef, false);
  const [controltoggleMenu, setControlToggleMenu] = useDetectOutsideClick(
    dropdownRef,
    false
  );

  const sideNavtoggle = () => {
    setIsOpen(!isOpen);
    if (toggleMenu === true) {
      setToggleMenu(!toggleMenu);
    }
    if (controltoggleMenu === true) {
      setControlToggleMenu(!controltoggleMenu);
    }
  };

  const switchDark = () => {
    setToggleDark(!toggleDark);
  };

  const switchControl = () => {
    setToggleContorl(!toggleContorl);
  };

  const menuControl = () => {
    setToggleMenu(!toggleMenu);
    if (controltoggleMenu === true) {
      setControlToggleMenu(!controltoggleMenu);
    }
  };

  const switchControlMenu = () => {
    setControlToggleMenu(!controltoggleMenu);
    if (toggleMenu === true) {
      setToggleMenu(!toggleMenu);
    }
  };

  return (
    <div>
      <body className={toggleDark === true ? "" : "dark"}>
        <nav className={isOpen === true ? "sidebar close" : "sidebar"}>
          <header>
            <div className="image-text text-center">
              <span className="image" style={{ width: "100%" }}>
                <img src="logo.png" alt="" />
              </span>
            </div>
            <div onClick={sideNavtoggle}>
              <i className="bx bx-chevron-right toggle"></i>
            </div>
          </header>

          <div className="menu-bar">
            <div className="menu">
              <ul className="menu-links">
                <li className="nav-link">
                  {( window.location.pathname==='/Admin'|| window.location.pathname==='/')&&<Link to="/" title="Home">
                    <i
                      className="bx bx-home-alt icon bx-sm"
                      data-height="40"
                    ></i>
                    <span className="text mt-16 py-1.5 nav-text">Home</span>
                  </Link>}
                </li>

                <li
                  ref={dropdownRef}
                  className="nav-link"
                  onClick={switchControl && switchControlMenu}
                >
                 {props?.currentPage && <Link to={props?.currentPage!=="Owner"?props?.currentPage:"#"}  title="Controls">
                    <img src="control.png" className="ml-4" alt="control" />
                    <span className="ml-5 mt-16 py-1.5 text nav-text">Controls</span>
                  </Link>}
                </li>

               {( window.location.pathname==='/Admin'|| window.location.pathname==='/')  &&<li className="nav-link" title="Data Handler">
                  <Link to="/data">
                    <i
                      className="bx bx-data icon bx-sm pr-2"
                      data-height="40"
                    ></i>
                    <span className="text mt-16 py-1.5 nav-text">Data Export</span>
                  </Link>
                </li>}

              </ul>
            </div>

            <div
              className={`${
                controltoggleMenu === false ? "hidden" : ""
              } absolute w-4 top-48 overflow-hidden inline-block ${
                isOpen === true ? "left-24" : "left-64"
              }`}
            >
              {props?.currentPage==="Owner" && (
              <div className=" h-16  bg-white -rotate-45 transform origin-top-right"></div>)}
            </div>
            { props?.currentPage==="Owner" && (
            <div
              className={`${
                controltoggleMenu === false ? "hidden" : ""
              } bg-white absolute py-4 w-32 top-44 rounded-lg shadow-2xl ${
                isOpen === true ? "left-28" : "ml-4 left-64"
              }`}
            > 
                <div className="text-left font-bold">
                  <p className="py-2 text-center hover:bg-lightblue2">
                    <Link to="/newowner" onClick={switchControlMenu}>
                      <div className="flex items-center justify-center">
                        {window.location.pathname === "/newowner" ? (
                          <i className="bx bxs-circle text-buttonblue bx-xs"></i>
                        ) : (
                          <i className="invisible bx bxs-circle text-buttonblue bx-xs"></i>
                        )}
                        <span className="px-5">New</span>
                      </div>
                    </Link>
                  </p>
                  <p className="py-2 text-center hover:bg-lightblue2">
                    <Link to="/viewowner" onClick={switchControlMenu}>
                      <div className="flex items-center justify-center">
                        {window.location.pathname === "/viewowner" ? (
                          <i className="bx bxs-circle text-buttonblue bx-xs"></i>
                        ) : (
                          <i className="invisible bx bxs-circle text-buttonblue bx-xs"></i>
                        )}
                        <span className="px-5">Edit</span>
                      </div>
                    </Link>
                  </p>
                </div>
              
            </div>)}

            <div className="bottom-content">
              <div
                className="flex-column text-center content-center"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <li className="mb-2">
                  <Link to="#">
                    <i className="bx bx-help-circle icon bx-sm"></i>
                    <span className="mr-32 text mt-16 py-1 nav-text">Help</span>
                  </Link>
                </li>
                <li className="mb-8" onClick={props?.logout}>
                  <Link to="#">
                    <i className="bx bx-log-out icon bx-sm"></i>
                    <span className="mr-28 text mt-16 py-1 nav-text">Logout</span>
                  </Link>
                </li>

                <img
                  className={`w-14 h-14 rounded-full ${
                    isOpen === true ? "" : "ml-20"
                  }`}
                  src="UserCircle.png"
                  alt=""
                />
                <div
                  className={
                    isOpen === true
                      ? "flex items-center justify-center mb-20 hover:cursor-pointer"
                      : "flex items-center justify-center mb-20 hover:cursor-pointer"
                  }
                  ref={dropdownRef}
                  onClick={menuControl}
                >
                  <span className="px-0 pt-1.5 pl-2.5 text-xs font-semibold  text-white nav-text">
                    Switch
                  </span>
                  <i className="pt-2 text-sm bx bx-chevron-right text-lightblue bx-sm"></i>
                </div>
              </div>

              <div
                className={`${
                  toggleMenu === false ? "hidden" : ""
                } bg-white absolute w-48 top-3/4 rounded-lg shadow-2xl ${
                  isOpen === true ? "left-24" : "left-64"
                }`}
              >
                <div className="text-center font-bold">
                  <p className="mt-4 mb-4 text-slate">Switch to</p>
                  {props?.switchRole?.map((data) => (
                           <Link
                           to={data === "Owner" ? "newowner" : data}
                           onClick={menuControl}
                         >
                    <p className="py-2 text-center hover:bg-lightblue2"
                    >
               
                        <span className="">{data}</span>
                    
                    </p>
                    </Link>
                  ))}

                  {/* <p className="py-2 text-center hover:bg-lightblue2">
                    <Link to="/viewowner" onClick={menuControl}>
                      <span className="">OWNER</span>
                    </Link>
                  </p> */}
                </div>
              </div>

                {/*<li className="mode">
                <div className="sun-moon">
                  <i className="bx bx-moon icon moon bx-sm px-28"></i>
                  <i className="bx bx-sun icon sun bx-sm px-28"></i>
                </div>
                <span className="mode-text text pt-9">
                  {toggleDark === false ? "Light Mode" : "Dark Mode"}
                </span>

                <div className="toggle-switch" onClick={switchDark}>
                  <span className="switch"></span>
                </div>
              </li>*/}
            </div>
          </div>
        </nav>
      </body>
    </div>
  );
}

export default SideNav;
