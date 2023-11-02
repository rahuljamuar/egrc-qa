import React, { useState, useEffect } from "react";
import { ControlCardAdmin } from "../components/ControlCard/ControlAdminCard";
import AdminQuestionCard from "../components/QuestionCard/AdminQuestionCard";
import { baseUrl } from "../Shared/common";
import { useRecoilState } from "recoil";
import { sideNavState } from "../atoms/sideNavState";
import "./style.css";

export default function Admin(props) {
  const [selectedMapping, setSelectedMapping] = useState();
  const [control, setControl] = useState([]);
  const [country, setCountry] = useState([]);
  const [status, setStatus] = useState([]);
  const [process, setProcess] = useState([]);
  const [isOpen, setIsOpen] = useRecoilState(sideNavState);

  useEffect(() => {
    fetch(`${baseUrl.local}/utility/admin_dropdown/`, {
      method: "GET",
      headers: {
        email: props?.userEmail,
        token: "test",
      },
    })
      .then((data) => data.json())
      .then((data) => {
        setCountry(data.country);
        setControl(data.control);
        setStatus(data.status);
        setProcess(data.process);
        props?.dispatch({ type: "currentPage", payload: "Admin" });
      })
      .catch((e) => console.log(e));
  }, []);

  useEffect(()=>{
    setSelectedMapping(props.userMapping[0]);
  },[props?.userMapping])

  useEffect(() => {
    document.body.style.zoom = "85%";
  }, []);

  useEffect(() => {
    props?.changeQuestionSet(selectedMapping?.set_no);
    if (selectedMapping) {
      props?.getTransectionByMappingId(selectedMapping);
    }
  }, [selectedMapping]);

  return (
    <div className="flex">
      <div className="absolute w-1/2 lg:w-[35%] 2xl:w-[24%] bg-lightblue overflow-y-auto">
        <ControlCardAdmin
          userMapping={props?.userMapping}
          setSelectedMapping={setSelectedMapping}
          selectedMapping={selectedMapping}
          controlDropdown={control}
          countryDropdown={country}
          statusDropdown={status}
          processDropdown={process}
          adminData={props?.adminData}
          userEmail={props?.userEmail}
          getMappingByAdminFilter={props?.getMappingByAdminFilter}
        />
      </div>
      <div
        className={`${
          isOpen === false
            ? "left-[59%] xl:left-[40%] 2xl:left-[29%] lg:w-[60%] 2xl:w-[70%] lg:ml-[-240px]"
            : "left-[45%] xl:left-[33%] 2xl:left-[24%] lg:w-[69%] 2xl:w-[77%] lg:ml-[-160px]"
        } w-1/2 px-14   fixed h-full overflow-y-auto ml-0 xl:ml-0`}
      >
        <AdminQuestionCard
          userMapping={props?.userMapping}
          questionSets={props?.questionSets}
          transactionData={props?.transactionData}
          selectedMapping={selectedMapping}
          getMappingByAdminFilter={props?.getMappingByAdminFilter}
          setMappingOnAdmin={props?.setMappingOnAdmin}
          userEmail={props?.userEmail}
          fileData={props?.fileData}
          adminData={props?.adminData}
        />
      </div>
    </div>
  );
}