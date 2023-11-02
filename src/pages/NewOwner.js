import React, { useState, useEffect } from "react";
import ControlCard from "../components/ControlCard/ControlCard";
import QuestionCard from "../components/QuestionCard/QuestionCard";
import { useRecoilState } from "recoil";
import { sideNavState } from "../atoms/sideNavState";

export default function NewOwner(props) {
  const [selectedMapping, setSelectedMapping] = useState(props.userMapping[0]);
  const [isOpen, setIsOpen] = useRecoilState(sideNavState);

  useEffect(() => {
    if(props?.user)
    props.setMappingOnNewOwner();
  }, [props?.user]);

  useEffect(() => {
    document.body.style.zoom = "85%";
  }, []);

  useEffect(() => {
    setSelectedMapping(props?.userMapping[0]);
  }, [props?.userMapping]);

  useEffect(() => {
    props?.changeQuestionSet(selectedMapping?.set_no);
  }, [selectedMapping]);

  return (
    <div className="flex">
       <div className="absolute w-1/2 lg:w-[35%] 2xl:w-[24%] bg-lightblue overflow-y-auto">
        <ControlCard
          selectedMapping={selectedMapping}
          userMapping={props?.userMapping}
          setMappingByDate={props?.setMappingByDate}
          setSelectedMapping={setSelectedMapping}
          userData={props?.userData}
        />
      </div>
      <div
        className={`${
          isOpen === false
            ? "left-[59%] xl:left-[40%] 2xl:left-[29%] lg:w-[60%] 2xl:w-[70%] lg:ml-[-200px]"
            : "left-[45%] xl:left-[33%] 2xl:left-[24%] lg:w-[69%] 2xl:w-[76%] lg:ml-[-160px]"
        } w-1/2 px-14  fixed h-full overflow-y-auto ml-0 xl:ml-0`}
      >
        <QuestionCard
          questionSets={props.questionSets}
          selectedMapping={selectedMapping}
          fetchMappingData={props.setMappingOnNewOwner}
          userMapping={props?.userMapping}
          changeMappingAfterSubmit={props?.changeMappingAfterSubmit}
          userEmail={props?.userEmail} 
          setMappingByDate={props?.setMappingByDate}
        />
      </div>
    </div>
  );
}