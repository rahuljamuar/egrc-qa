import React, { useState, useReducer, useEffect } from "react";
import SideNav from "./components/SideNav/SideNav";
import NewOwner from "./pages/NewOwner";
import ViewOwner from "./pages/ViewOwner";
import Reviewer from "./pages/Reviewer";
import Admin from "./pages/Admin";
import OwnerDashboard from "./dashboards/ownerDashboard";
import ReviewerDashboard from "./dashboards/reviewerDashboard";
import AdminDashboard from "./dashboards/adminDashboard";
import RoleSwitch from "./pages/Role";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { sideNavState } from "./atoms/sideNavState";
import { useRecoilState } from "recoil";
import { baseUrl, env } from "./Shared/common";
import { ToastContainer } from "react-toastify";
import NoAccess from "./pages/NoAccess";
import LogoutPage from "./pages/Logout";
import "react-toastify/dist/ReactToastify.css";
import { Loading } from "./components/Loading";
import Data from "./DataTable/Data"

const reducer = (state, action) => {
  switch (action.type) {
    case "setUserMapping":
      return { ...state, userMapping: action.payload };
    case "setQuestionSet":
      return { ...state, questionSets: action.payload };
    case "currentPage":
      return { ...state, currentPage: action.payload };
  }
};
//const user = "U_4";

function App() {
  const initialState = {
    userMapping: [],
    questionSets: [],
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const [questinSetNo, setQuestionSetNo] = useState("");
  const [transactionData, setTransactionData] = useState([]);
  const [isOpen] = useRecoilState(sideNavState);
  const [switchRole, setSwitchRole] = useState();
  const [isUserOwner, setIsUserOwner] = useState(false);
  const [isUserReviewer, setIsUserReviewer] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [userData, setUserData] = useState();
  const [reviewerData, setReviewerData] = useState();
  const [adminData, setAdminData] = useState();
  const [fileData, setFileData] = useState();
  const [showRoleDialog, setShowRoleDialog] = useState(true);
  const [loggedOut, setLoggedOut] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState();
  const [user, setUser] = useState();
  const [reviewerId, setReviewerId] = useState();
  
  useEffect(() => {
    if (userEmail && env.environment !== "local") {
      getRole();
    }
  }, [userEmail]);

  useEffect(() => {
    if (env.environment === "local") {
      getRole();
    } else {
      fetch(`/.auth/me`, {
        method: "GET",
        header: { "Content-Type": "application/json" },
      })
        .then((res) => {
          res.json().then((data) => {
            console.log(
              data[0].user_claims.filter(
                (data) => data.typ === "preferred_username"
              )[0].val
            );
            const microsoftEmail = data[0].user_claims.filter(
              (data) => data.typ === "preferred_username"
            )[0].val;
            if (data[0]) {
              setUserEmail(microsoftEmail);
              window.localStorage.setItem("logout", false);
              setLoggedOut(false);
            }
          });
        })
        .catch((e) => console.log(e));
    }
  }, []);

  useEffect(()=>{
    if(switchRole?.length===1){
      dispatch({ type: "currentPage", payload: `/${switchRole[0]}` });
      if(switchRole[0]==='Owner'){
        window.history.pushState({urlPath:`newowner`},"",`/newowner`)
      }else
      window.history.pushState({urlPath:`/${switchRole[0]}`},"",`/${switchRole[0]}`)
    }
  },[switchRole])

  const reLogin = () => {
    if (window.localStorage.getItem("logout")) {
      fetch(`/.auth/me`, {
        method: "GET",
        header: { "Content-Type": "application/json" },
      })
        .then((res) => {
          res.json().then((data) => {
            const microsoftEmail = data[0].user_claims.filter(
              (data) => data.typ === "preferred_username"
            )[0].val;
            if (data[0]) {
              setUserEmail(microsoftEmail);
              window.localStorage.setItem("logout", false);
              setLoggedOut(false);
            }
          });
        })
        .catch((e) => console.log(e));
    }
  };

  const logout = () => {
    fetch(`/.auth/logout`, {
      method: "POST",
      header: { "Content-Type": "application/json" },
    })
      .then((res) => {
        res.json().then((data) => {});
      })
      .finally(() => {
        setLoggedOut(true);
        setIsUserAdmin(false);
        setIsUserOwner(false);
        setIsUserReviewer(false);
        window.localStorage.setItem("logout", true);
      });
  };

  const getRole = () => {
    fetch(`${baseUrl.local}/role`, {
      method: "GET",
      headers: {
        email: userEmail,
        token: "test",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        let switchRoleOwnerData = data.filter((d) => d === "Owner");
        let switchRoleReviewerData = data.filter((d) => d === "Reviewer");
        let switchRoleAdminData = data.filter((d) => d === "Admin");
        setLoading(false);
        setSwitchRole(data);
        if (switchRoleOwnerData?.length>0) {
          getUserDetail();
          setIsUserOwner(true);
          dispatch({ type: "currentPage", payload: "Owner" });
        }
        if (switchRoleReviewerData?.length>0) {
          getReviewerDetail();
          setIsUserReviewer(true);
        }
        if (switchRoleAdminData?.length>0) {
          getAdminDetail();
          setIsUserAdmin(true);
        }
      });
  };

  const changeQuestionSet = (setNo) => {
    setQuestionSetNo(setNo);
  };

  const getUserDetail = () => {
    fetch(`${baseUrl.local}/user/user_details/?email=${userEmail}`, {
      method: "GET",
      headers: {
        email: userEmail,
        token: "test",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
        setUser(data.user_id);
      });
  };

  const getReviewerDetail = () => {
    fetch(`${baseUrl.local}/reviewer/reviewer_details/?email=${userEmail}`, {
      method: "GET",
      headers: {
        email: userEmail,
        token: "test",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setReviewerData(data);
        setReviewerId(data?.mgr_id);
      });
  };

  const getAdminDetail = () => {
    fetch(`${baseUrl.local}/admin/admin_details/?email=${userEmail}`, {
      method: "GET",
      headers: {
        email: userEmail,
        token: "test",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAdminData(data);
      });
  };

  const getMappingByOwnerFilter = (data) => {
    fetch(
      `${baseUrl.local}/mapping/owner_filter/?user_id=${user}&month=${data.month}&year=${data.year}&country_id=${data.selectedCountry}&control=&status=${data.selectedStatus}`,
      {
        method: "GET",
        headers: {
          email: userEmail,
          token: "test",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: "setUserMapping", payload: data });
        if (data?.length) {
          setQuestionSetNo(data[0]?.set_no);
          getTransectionByMappingId(data[0]);
        } else {
          setQuestionSetNo("");
        }
      });
  };

  const getMappingByReviewerFilter = (data) => {
    if (isUserReviewer) {
      fetch(
        `${baseUrl.local}/mapping/reviewer_filter/?mgr_id=${reviewerId}&month=${data.month}&year=${data.year}&country_id=${data.selectedCountry}&control=${data.selectedControl}&status=${data.selectedStatus}`,
        {
          method: "GET",
          headers: {
            email: userEmail,
            token: "test",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          dispatch({ type: "setUserMapping", payload: data });
          if (data?.length) {
            setQuestionSetNo(data[0]?.set_no);
            getTransectionByMappingId(data[0]);
          } else {
            setQuestionSetNo("");
          }
        });
    }
  };

  const getMappingByAdminFilter = (data) => {
    fetch(
      `${baseUrl.local}/mapping/admin_filter/?month=${data.month}&year=${data.year}&country_id=${data.selectedCountry}&control=${data.selectedControl}&process=${data.selectedProcess}&status=${data.selectedStatus}`,
      {
        method: "GET",
        headers: {
          email: userEmail,
          token: "test",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: "setUserMapping", payload: data });
        dispatch({ type: "currentPage", payload: "Admin" });
        if (data?.length) {
          setQuestionSetNo(data[0]?.set_no);
          getTransectionByMappingId(data[0]);
        } else {
          setQuestionSetNo("");
        }
      });
  };

  const getTransectionByMappingId = (data) => {
    fetch(
      `${baseUrl.local}/transaction/mapping_id/?mapping_id=${data.mapping_id}`,
      {
        method: "GET",
        headers: {
          email: userEmail,
          token: "test",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setTransactionData(data);
        if (data?.length > 0) {
          getFileByMappingId(data);
        } else {
          setFileData([]);
        }
      });
  };

  const getFileByMappingId = (data) => {
    fetch(`${baseUrl.local}/file/mapping/?mapping_id=${data[0].mapping_id}`, {
      method: "GET",
      headers: {
        email: userEmail,
        token: "test",
      },
      redirect: "follow",
    })
      .then((res) => res.json())
      .then((data) => {
        setFileData(data);
      });
  };

  const setMappingOnViewOwner = () => {
    fetch(`${baseUrl.local}/mapping/owner_view/?user_id=${user}`, {
      method: "GET",
      headers: {
        email: userEmail,
        token: "test",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: "setUserMapping", payload: data });
        if (data?.length) {
          setQuestionSetNo(data[0]?.set_no);
          getTransectionByMappingId(data[0]);
        } else {
          setQuestionSetNo("");
        }
      });
  };

  const setMappingOnReiewOwner = (type) => {
    fetch(`${baseUrl.local}/mapping/reviewer_view/?mgr_id=${reviewerId}`, {
      method: "GET",
      headers: {
        email: userEmail,
        token: "test",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "setUserMapping",
          payload: data.filter((d) => d.status === type),
        });
        dispatch({ type: "currentPage", payload: "Reviewer" });
        if (data.filter((d) => d.status === type)?.length) {
          setQuestionSetNo(data.filter((d) => d.status === type)[0]?.set_no);
          getTransectionByMappingId(data.filter((d) => d.status === type)[0]);
        } else {
          setQuestionSetNo("");
        }
      });
  };

  const setMappingOnAdmin = () => {
    fetch(
      `${baseUrl.local}/mapping/admin_filter/?month=&year=&country_id=&control=&process&status=`,
      {
        method: "GET",
        headers: {
          email: userEmail,
          token: "test",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: "setUserMapping", payload: data });
        dispatch({ type: "currentPage", payload: "Admin" });
        if (data?.length) {
          setQuestionSetNo(data[0]?.set_no);
          getTransectionByMappingId(data[0]);
        } else {
          setQuestionSetNo("");
        }
      });
  };

  const setMappingByDate = (data) => {
    if (isUserOwner) {
      fetch(
        `${baseUrl.local}/mapping/given/?user_id=${user}&month=${data.month}&year=${data.year}`,
        {
          method: "GET",
          headers: {
            email: userEmail,
            token: "test",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          dispatch({ type: "setUserMapping", payload: data });
          if (data?.length) {
            setQuestionSetNo(data[0]?.set_no);
          } else {
            setQuestionSetNo("");
          }
        });
    }
  };

  const setMappingOnNewOwner = () => {
    if (isUserOwner) {
      fetch(`${baseUrl.local}/mapping/current/?user_id=${user}`, {
        method: "GET",
        headers: {
          email: userEmail,
          token: "test",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          dispatch({ type: "setUserMapping", payload: data });
          dispatch({ type: "currentPage", payload: "Owner" });
          setQuestionSetNo(data[0]?.set_no);
        });
    }
  };

  const changeMappingAfterSubmit = (data) => {
    dispatch({ type: "setUserMapping", payload: data });
    setQuestionSetNo(data[0]?.set_no);
  };
  useEffect(() => {
    if (questinSetNo) {
      fetch(`${baseUrl.local}/question/setno/?set_no=${questinSetNo}`, {
        method: "GET",
        headers: {
          email: userEmail,
          token: "test",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          dispatch({ type: "setQuestionSet", payload: data });
        });
    } else {
      dispatch({ type: "setQuestionSet", payload: [] });
    }
  }, [questinSetNo]);

  const nullifyMapping = () => {
    dispatch({ type: "setUserMapping", payload: [] });
    dispatch({ type: "currentPage", payload: "Admin" });
  };

  const roleSelectedAfterLogin = (roleSelected) => {
    setShowRoleDialog(false);
    dispatch({ type: "currentPage", payload: roleSelected });
  };
  if (loading) {
    return <Loading />;
  }
  if (isUserOwner || isUserReviewer || isUserAdmin) {
    return (
      <div className="App">
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <section
          className="home flex"
          style={{ left: isOpen ? "88px" : "200px" }}
        >
          <Router>
            {!sessionStorage.getItem("selectedRole") && switchRole?.length>1 && (
              <RoleSwitch
                isUserOwner={isUserOwner}
                isUserReviewer={isUserReviewer}
                isUserAdmin={isUserAdmin}
                showRoleDialog={showRoleDialog}
                roleSelectedAfterLogin={roleSelectedAfterLogin}
              />
            )}
            <div className="flex w-screen">
              <div className="1/12">
                <SideNav
                  switchRole={switchRole}
                  currentPage={state.currentPage}
                  logout={logout}
                />
              </div>
              <div className="11/12">
                <Routes>
                  <Route
                    exact
                    path="/"
                    element={
                      state.currentPage === "Admin" && isUserAdmin &&
                        <AdminDashboard />
                    }
                  ></Route>
                  <Route
                    exact
                    path="/newowner"
                    element={
                      <NewOwner
                        userMapping={state.userMapping}
                        questionSets={state.questionSets}
                        changeQuestionSet={changeQuestionSet}
                        setMappingByDate={setMappingByDate}
                        setMappingOnNewOwner={setMappingOnNewOwner}
                        userData={userData}
                        changeMappingAfterSubmit={changeMappingAfterSubmit}
                        isUserOwner={isUserOwner}
                        userEmail={userEmail}
                        user={user}
                      />
                    }
                  ></Route>
                  <Route
                    exact
                    path="/viewowner"
                    element={
                      <ViewOwner
                        userMapping={state.userMapping}
                        setMappingOnViewOwner={setMappingOnViewOwner}
                        questionSets={state.questionSets}
                        changeQuestionSet={changeQuestionSet}
                        getTransectionByMappingId={getTransectionByMappingId}
                        transactionData={transactionData}
                        getMappingByOwnerFilter={getMappingByOwnerFilter}
                        userData={userData}
                        fileData={fileData}
                        isUserOwner={isUserOwner}
                        userEmail={userEmail}
                        user={user}
                      />
                    }
                  />
                  <Route
                    exact
                    path="/reviewer"
                    element={
                      <Reviewer
                        userMapping={state.userMapping}
                        setMappingOnReiewOwner={setMappingOnReiewOwner}
                        questionSets={state.questionSets}
                        changeQuestionSet={changeQuestionSet}
                        getTransectionByMappingId={getTransectionByMappingId}
                        transactionData={transactionData}
                        getMappingByReviewerFilter={getMappingByReviewerFilter}
                        reviewerData={reviewerData}
                        fileData={fileData}
                        isUserReviewer={isUserReviewer}
                        reviewerId={reviewerId}
                        userEmail={userEmail}
                      />
                    }
                  />
                  <Route
                    exact
                    path="/Admin"
                    element={
                      <Admin
                        userMapping={state.userMapping}
                        setMappingOnAdmin={setMappingOnAdmin}
                        questionSets={state.questionSets}
                        changeQuestionSet={changeQuestionSet}
                        getTransectionByMappingId={getTransectionByMappingId}
                        transactionData={transactionData}
                        getMappingByAdminFilter={getMappingByAdminFilter}
                        adminData={adminData}
                        userEmail={userEmail}
                        fileData={fileData}
                        nullifyMapping={nullifyMapping}
                      />
                    }
                  />
                  <Route
                    exact
                    path="/data"
                    element={
            <Data 
            userEmail={userEmail}
            adminData={adminData}
            userId={userData?.user_id}
            />
                    }
                  />
                </Routes>
              </div>
            </div>
          </Router>
        </section>
      </div>
    );
  } else if (window.localStorage.getItem("logout") && loggedOut) {
    return <LogoutPage reLogin={reLogin} />;
  } else {
    return <NoAccess />;
  }
}

export default App;
