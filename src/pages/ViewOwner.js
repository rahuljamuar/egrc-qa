import React, { useState, useEffect } from "react";
import { ControlCardViewOwner } from "../components/ControlCard/ControlViewCard";
import ViewQuestionCard from "../components/QuestionCard/ViewQuestionCard";
import { useRecoilState } from "recoil";
import { sideNavState } from "../atoms/sideNavState";

export default function ViewOwner(props) {
  const [selectedMapping, setSelectedMapping] = useState(props.userMapping[0]);
  const [isVisible, setIsVisible] = useState(0);
  const [isOpen, setIsOpen] = useRecoilState(sideNavState);


  useEffect(() => {
    if(props?.user){
    props.setMappingOnViewOwner();
    }
  }, [props?.user]);
  
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
      <div className="absolute w-1/2 lg:w-[35%] 2xl:w-3/12 bg-lightblue overflow-y-auto">
        <ControlCardViewOwner
          userMapping={props?.userMapping}
          setSelectedMapping={setSelectedMapping}
          selectedMapping={selectedMapping}
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          getMappingByOwnerFilter={props?.getMappingByOwnerFilter}
          userData={props?.userData}
          userEmail={props?.userEmail}
        />
      </div>
      <div
        className={`${
          isOpen === false
            ? "left-[59%] xl:left-[40%] 2xl:left-[30%] lg:w-[60%] 2xl:w-[70%] lg:ml-[-200px]"
            : "left-[45%] xl:left-[33%] 2xl:left-[25%] lg:w-[69%] 2xl:w-[76%] lg:ml-[-160px]"
        } w-1/2 px-14   fixed h-full overflow-y-auto ml-0 xl:ml-0`}
      >
        <ViewQuestionCard
          userMapping={props?.userMapping}
          questionSets={props?.questionSets}
          transactionData={props?.transactionData}
          selectedMapping={selectedMapping}
          setMappingOnViewOwner={props?.setMappingOnViewOwner}
          setSelectedMapping={setSelectedMapping}
          getTransectionByMappingId={props?.getTransectionByMappingId}
          setIsVisible={setIsVisible}
          fileData={props?.fileData}
          userEmail={props?.userEmail}
        />
      </div>
    </div>
  );
}
