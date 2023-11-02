import React, { useState, useEffect } from "react";
import { ControlCardReviewer } from "../components/ControlCard/ControlReviewCard";
import ReviewQuestionCard from "../components/QuestionCard/ReviewQuestionCard";
import { baseUrl } from "../Shared/common";
import { useRecoilState } from "recoil";
import { sideNavState } from "../atoms/sideNavState";

export default function Reviewer(props) {
  const [selectedMapping, setSelectedMapping] = useState();
  const [control,setControl]=useState([]);
  const [country,setCountry]=useState([]);
  const [status,setStatus]=useState([]);
  const [isOpen, setIsOpen] = useRecoilState(sideNavState);
  const [selectedFilters,setSelectedFilters]=useState();

  useEffect(() => {
    if(props?.reviewerId){
      props.setMappingOnReiewOwner("In Approval");
      setDropdownForReviewer();
    }
    }, [props?.reviewerId]);

    useEffect(() => {
      document.body.style.zoom = "85%";
    }, []);

  useEffect(() => {
    if (selectedMapping) {
      props?.changeQuestionSet(selectedMapping?.set_no);
      props?.getTransectionByMappingId(selectedMapping);
    }
  }, [selectedMapping]);

  const setDropdownForReviewer=()=>{
    fetch(
      `${baseUrl.local}/utility/reviewer_dropdown/?mgr_id=${props?.reviewerId}`,{
        method: 'GET',
        headers: {
          email: props?.userEmail,
          token: 'test',
        }}
    )
      .then((data) => data.json())
      .then((data) => {
        setCountry(data.country);
        setControl(data.control);
        setStatus(data.status);
      }).catch(e=>console.log(e));
  }
 const getSelectedFilterValues=(selectedCountry,selectedControl,selectedStatus)=>{
  setSelectedFilters({country:selectedCountry,control:selectedControl,status:selectedStatus})
 }
  return (
    <div className="flex">
      <div className="absolute w-1/2 lg:w-[35%] 2xl:w-3/12 bg-lightblue overflow-y-auto">
        <ControlCardReviewer
          userMapping={props?.userMapping}
          getMappingByReviewerFilter={props?.getMappingByReviewerFilter}
          setSelectedMapping={setSelectedMapping}
          selectedMapping={selectedMapping}
          controlDropdown={control}
          countryDropdown={country}
          statusDropdown={status}
          reviewerData={props?.reviewerData}
          getSelectedFilterValues={getSelectedFilterValues}
        />
      </div>
      <div
        className={`${
          isOpen === false
            ? "left-[59%] xl:left-[40%] 2xl:left-[30%] lg:w-[60%] 2xl:w-[70%] lg:ml-[-240px]"
            : "left-[45%] xl:left-[33%] 2xl:left-[25%] lg:w-[69%] 2xl:w-[76%] lg:ml-[-160px]"
        } w-1/2 px-14  fixed h-full overflow-y-auto ml-0 xl:ml-0`}
      >
        <ReviewQuestionCard
          userMapping={props?.userMapping}
          questionSets={props?.questionSets}
          transactionData={props?.transactionData}
          getMappingByReviewerFilter={props?.getMappingByReviewerFilter}
          selectedMapping={selectedMapping}
          setMappingOnReiewOwner={props?.setMappingOnReiewOwner}
          fileData={props?.fileData}
          setDropdownForReviewer={setDropdownForReviewer}
          userEmail={props?.userEmail}
          selectedFilters={selectedFilters}
        />
      </div>
    </div>
  );
}
