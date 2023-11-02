import React, { useState, useEffect } from "react";
import { baseUrl } from "../../Shared/common";
import "./styles.css";
import {ReadMore} from "../../utils/readMore" 
import {formatDate,formatDateView} from "../../Shared/utils";


export function ControlCardReviewer(props) {
  const [isVisible, setIsVisible] = useState();
  const [filterApplied, setFilterApplied] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [startDate, setStartDate] = useState(formatDate(new Date()));
  const [show, setShow] = useState(true);
  const [fliterShow, setFliterShow] = useState(false);
  const [selectedControl,setSelectedControl]=useState("")

  useEffect(() => {
    if (filterApplied) {
      props?.setSelectedMapping(props?.userMapping[0]);
    }
  }, [props?.userMapping, filterApplied]);

  useEffect(()=>{
    props?.getSelectedFilterValues(selectedCountry,selectedControl,selectedStatus);
  },[selectedCountry,selectedControl,selectedStatus])

  const handleClose = () => {
    setShow(!show);
  };

  const fliterToggle = () => {
    setFliterShow(!fliterShow);
  };

  const filterDataList = () => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    props.getMappingByReviewerFilter({
      month: monthNames[parseInt(startDate.split("-")[1]) - 1],
      year: startDate.split("-")[0],
      selectedCountry: selectedCountry ?? "",
      selectedControl: selectedControl??"",
      selectedStatus: selectedStatus ?? "",
    });
    setFilterApplied(true);
  };

  const Visibilitytoggle = (value, mapData) => {
    setIsVisible(value);
    props?.setSelectedMapping(mapData);
  };
  useEffect(()=>{
    if(!props?.selctedMapping){
      setIsVisible(0);
    }
  },[props?.userMapping]);

  //reviewer starts here....
  return (
    <div className="pb-10" style={{ minHeight: "200vh", height: "auto" }}>
      <div className="pt-8 pl-8 text-left">
        <p className="text-3xl font-bold">
          Hi, {props?.reviewerData?.control_manager}
        </p>
        <p className="pt-1 text-md font-normal text-slate">(Reviewer)</p>
      </div>

      <div className="mt-4 mr-4 pl-8">
        <p className="pt-1 text-md font-bold">
          Please submit the following controls
        </p>
        <div className="mt-4 flex flex-col lg:flex-row justify-between">
          <div className="w-full shadow-lg md:w-full lg:w-1/4 pb-1/2 text-center lg:text-left pl-2 sm:mb-2 mb-0 3xl:flex-row md:flex-row xl:flex-col flex-col rounded-md bg-reviewercontrolbox1 border-2 border-reviewercontrolbox1border mr-2 lg:mr-1">
            <p className="pt-4 lg:pt-2 pb-1 text-3xl text-center lg:text-left md:text-2xl font-bold text-reviewercontrolbox1text">
              16
            </p>
            <i className="text-xl bx bx-equalizer" />
            <p className="text-xs lg:text-[9px] 2xl:text-xs font-bold pb-4 md:pb-2 lg:pb-4 mr-0">
              Total
            </p>
          </div>
          <div className="w-full shadow-lg md:w-full lg:w-1/4 pb-1/2 text-center lg:text-left pl-2 sm:mb-2 mb-0 3xl:flex-row md:flex-row xl:flex-col flex-col rounded-md bg-reviewercontrolbox2 border-2 border-reviewercontrolbox2border mr-2 lg:mr-1">
            <p className="pt-4 lg:pt-2 pb-1 text-3xl text-center lg:text-left md:text-2xl font-bold text-reviewercontrolbox2text ">
              08
            </p>
            <i className="text-xl bx bx-download" />
            <p className="text-xs lg:text-[9px] 2xl:text-xs font-bold pb-4  md:pb-2 lg:pb-4 mr-0 lg:mr-1">
              Submitted
            </p>
          </div>
          <div className="w-full shadow-lg md:w-full lg:w-1/4 pb-1/2 text-center lg:text-left pl-2 sm:mb-2 mb-0 3xl:flex-row md:flex-row xl:flex-row flex-col rounded-md bg-reviewercontrolbox3 border-2 border-reviewercontrolbox3border mr-2 lg:mr-1">
            <p className="pt-4 lg:pt-2 pb-1 text-3xl text-center lg:text-left md:text-2xl font-bold text-reviewercontrolbox3text">
              28
            </p>
            <i className="text-xl bx bx-trending-up" />
            <p className="text-xs lg:text-[9px] 2xl:text-xs font-bold 3xl: md:pb-2flex-row md:flex-row xl:flex-row flex-col pb-4 lg:pb-4 mr-0  lg:mr-1">
              Escalation
            </p>
          </div>
          <div className="w-full shadow-lg md:w-full lg:w-1/4 pb-1/2 text-center lg:text-left pl-2 sm:mb-2 mb-0 rounded-md 3xl:flex-row md:flex-row xl:flex-col flex-col bg-reviewercontrolbox4 border-2 border-reviewercontrolbox4border mr-2 lg:mr-1">
            <p className="pt-4 lg:pt-2 pb-1 text-3xl text-center lg:text-left md:text-2xl font-bold text-reviewercontrolbox4text">
              29
            </p>
            <i className="text-xl bx bx-exit" />
            <p className="text-xs lg:text-[9px] 2xl:text-xs font-bold pb-4  md:pb-2 lg:pb-4 mr-0 lg:mr-1">
              Upcoming Es
            </p>
          </div>
        </div>
      </div>

      <div className="my-4">
        <div className="bg-lightblue2 shadow-lg">
          <div className="pl-8 pt-4 flex justify-between mr-8">
            <div>
              <p className="text-xl font-bold mb-2">Filter</p>
            </div>
            <div>
              <i
                className={`${
                  fliterShow === true
                    ? "bx bx-chevron-down cursor-pointer"
                    : "bx bx-chevron-up cursor-pointer"
                } text-xl font-bold hover:cursor`}
                onClick={fliterToggle}
              ></i>
            </div>
          </div>
          <div
            className={`${
              fliterShow === true ? "hidden" : ""
            } pt-5 pb-6 pl-8 w-11/12`}
          >
            <div className="flex 2xl:flex-row xl:flex-row flex-col w-full">
              <div className="mr-4 w-1/2 pr-2">
                <p className="xl:text-sm 2xl:text-sm pb-2 text-slate font-bold">
                  MM/YYYY
                </p>
                <div className="flex">
                  <div className="relative w-full">
                    <label class="relative text-gray-400 focus-within:text-gray-600 block">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="pointer-events-none w-6 h-6 absolute top-2 transform-translate-y-1/2 left-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <input
                        type="month"
                        placeholder={formatDateView(startDate) || `MM/YYYY`}
                        max={formatDate(new Date())}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-gray border border-white shadow-lg py-2.5 text-gray-900 font-bold xl:text-sm 2xl:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-12 p-2 -mr-8"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="w-1/2">
                <p className="xl:text-sm 2xl:text-sm mx-1 pb-2 text-slate font-semibold">
                  Select country
                </p>
                <div className="flex">
                  <div className="relative mx-1 w-full">
                    <select
                      className="w-full bg-gray border border-white shadow-lg text-gray-900 font-bold xl:text-sm 2xl:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"
                      onChange={(e) => setSelectedCountry(e.target.value)}
                    >
                      <option value="">Select country</option>
                      {props?.countryDropdown?.map((data) => (
                        <option value={data?.country_id}>
                          {data?.country_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex md:flex-row 2xl:flex-row xl:flex-row flex-col w-full">
              <div className="mt-4 w-1/2">
                <p className="xl:text-sm 2xl:text-sm pb-2 text-slate font-semibold">
                  Select control
                </p>
                <div className="flex md:flex-row xl:flex-row flex-col">
                  <div className="relative w-full md:flex-row xl:flex-row flex-col">
                    <select className="w-full bg-gray border border-white shadow-lg text-gray-900 font-bold xl:text-sm 2xl:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"
                    onChange={(e)=>setSelectedControl(e.target.value)}>
                      <option value="">Select control</option>
                      {props?.controlDropdown?.map((data) => (
                        <option value={data}>{data}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-4 3xl:flex-col mx-1 md:flex-col xl:flex-row flex-col ml-8 w-1/2">
                <p className="xl:text-sm 2xl:text-sm pb-2 text-slate font-semibold">
                  Select status
                </p>
                <div className="flex 3xl:flex-col md:flex-col xl:flex-row flex-col">
                  <div className="relative w-full md:flex-row xl:flex-row flex-col">
                    <select
                      className="w-full bg-gray border border-white shadow-lg  text-gray-900 font-bold xl:text-sm 2xl:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="">Select status</option>
                      {props?.statusDropdown?.map((data) => (
                        <option value={data?.status_id}>
                          {data?.control_reviewer_desc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <div></div>
              <div className="mt-8">
                <button
                  type="button"
                  id="bt"
                  onClick={() => filterDataList()}
                  className="block bg-buttonblue shadow-lg text-white py-2 px-4 rounded-lg active:bg-darkblue2 hover:shadow-lg transition duration-150 ease-in-out"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-8 pl-8 flex md:flex-col xl:flex-row flex-col">
          <p className="mr-10 pb-2 text-xl font-bold">List of controls</p>
          <p
            className="text-xl font-semibold text-buttonblue cursor-pointer"
            onClick={handleClose}
          >
            Rules{" "}
            <i
              className="bx bx-info-circle hover:cursor-pointer"
              onClick={handleClose}
            ></i>
          </p>
        </div>
        {props?.userMapping &&
          props?.userMapping?.map((mapData, index) => (
            <div
              key={index}
              className={
                isVisible === index
                  ? "pt-4 mb-2 pb-2 pl-8 bg-darkblue1 text-white shadow-lg"
                  : "pt-4 mb-2 pb-2 pl-8 bg-lightblue2 hover:bg-darkblue1 hover:text-white shadow-lg"
              }
              onClick={() => Visibilitytoggle(index, mapData)}
            >
              {mapData?.Submitted_Homo_control && (
                <div className="flex w-5 h-5">
                  <img src="homo.png" alt="img" />{" "}
                </div>
              )}
              <div className="pt-2 flex justify-between md:flex-col xl:flex-row flex-col">
                <div className="flex  md:flex-row xl:flex-row flex-col">
                  <p className="">Control</p>
                  <p className="pl-7 font-bold -ml-7 md:ml-0 xl:ml-0 md:flex-row xl:flex-row flex-col">
                    {mapData.control}
                  </p>
                </div>
                <p
                  className={`uppercase px-10 mr-70 -ml-10 font-bold md:ml-0 xl:ml-0 nm:flex-col md:flex-col xl:flex-row flex-col${
                    props?.isVisible === index ? "text-white" : "text-black"
                  }`}
                >
                  {mapData.status}
                </p>
              </div>
              <div className="pt-2 flex md:flex-row xl:flex-row flex-col">
                <p className="">Country</p>
                <p className="pl-6 font-bold -ml-6 md:ml-0 xl:ml-0 md:flex-row xl:flex-row flex-col">
                  {mapData?.country_name}
                </p>
              </div>
              <div className="pt-2 flex md:flex-row xl:flex-row flex-col">
                <p className="">Location</p>
                <p className="pl-5 font-bold -ml-5 md:ml-0 xl:ml-0 md:flex-row xl:flex-row flex-col">
                  {mapData?.Performance_locations}
                </p>
              </div>
              <div className={isVisible === index ? "" : "hidden"}>
                <div className="">
                  <p className="pt-2 font-semibold">Control Description</p>
                  <p className="pt-2 text-xs pr-6">
                    {mapData?.control_description}
                  </p>
                </div>
                <div className="">
                  <p className="pt-2 font-semibold">
                    Additional Control Guidance
                  </p>
                  <p className="pt-2 text-xs pr-6">
                    {" "}
                    <ReadMore>{mapData?.control_tip}</ReadMore>
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div
        id="popup-modal"
        tabindex="-1"
        className={`${
          show === true ? "hidden" : ""
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 md:inset-0 h-modal md:h-full`}
      >
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="bg-white rounded-lg shadow dark:bg-gray-700 md:w-auto w-2/3">
            <div className="flex justify-end p-2">
              <button
                type="button"
                className="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                data-modal-toggle="popup-modal"
                onClick={handleClose}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="p-6 pt-0 text-left">
              <h3 className="mb-1 text-xl font-semibold text-gray-500 dark:text-gray-400">
                Rules
              </h3>
              <ul className="mt-4 ml-6 list-disc mr-8">
                <li className="mb-1">
                  <p className="mb-5 text-sm font-bold">
                    If user submits all responses as Approve, then user needs to
                    confirm it post clicking on submit button
                  </p>
                </li>
                <li className="mb-1">
                  <p className="mb-5 text-sm font-bold">
                    If user rejects any question of the control, then comment is
                    mandatory. Unless comment is provided
                    <br /> submit button will not enable.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </div>
    </div>
  );
}
