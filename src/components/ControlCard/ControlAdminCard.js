import React, { useState, useEffect } from "react";
import { baseUrl } from "../../Shared/common";
import "./styles.css";
import { toast } from "react-toastify";
import { Switch } from "@material-ui/core";
import { ReadMore } from "../../utils/readMore";
import {formatDate,formatDateView} from "../../Shared/utils";


export function ControlCardAdmin(props) {
  const [isVisible, setIsVisible] = useState(0);
  const [isDrop, setIsDrop] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedStatus, setSelectedStatus] = useState();
  const [selectedControl, setSelectedControl] = useState();
  const [selectedProcess,setSelectedProcess]=useState();
  const [startDate, setStartDate] = useState(formatDate(new Date()));
  const [show, setShow] = useState(true);
  const [fliterShow, setFliterShow] = useState(false);
  const [unFreeze, setUnFreeze] = useState(true);
  const [showFreezeDialog, setShowFreezeDialog] = useState(true);
  const [showSingleFreezeDialog, setShowSingleFreezeDialog] = useState(true);
  const [mappingList, setMappingList] = useState([]);
  const [freezeControlValues, setFreezeControlValues] = useState([]);
  const [activeFreezeControl, setActiveFreezeControl] = useState();

  useEffect(() => {
    if (props?.userMapping) {
      let tempMappingIds = [];
      let tempFreezeControlValues = [];
      for (let i = 0; i < props?.userMapping?.length; i++) {
        tempMappingIds.push(props?.userMapping[i]?.mapping_id);
        tempFreezeControlValues.push(props?.userMapping[i]?.freezed === "N");
      }
      setMappingList(tempMappingIds);
      setFreezeControlValues(tempFreezeControlValues);
    }
  }, [props?.userMapping]);

  const handleClose = () => {
    setShow(!show);
  };
  const handleCloseFreezeAllDialog = () => {
    setShowFreezeDialog(!showFreezeDialog);
    setUnFreeze(!unFreeze);
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
    props.getMappingByAdminFilter({
      month: monthNames[parseInt(startDate.split("-")[1]) - 1],
      year: startDate.split("-")[0],
      selectedCountry: selectedCountry ?? "",
      selectedControl:selectedControl?? "",
      selectedStatus: selectedStatus ?? "",
      selectedProcess:selectedProcess??""
    });
  };

  const Visibilitytoggle = (value, mapData) => {
    setIsVisible(value);
    props?.setSelectedMapping(mapData);
  };

  const handleSingleFreeze = (id, value) => {
    let activeControl = {
      index: id,
      input: value,
    };
    let switchesValue = [...freezeControlValues];
    switchesValue[id] = value;
    setFreezeControlValues(switchesValue);
    setActiveFreezeControl(activeControl);
  };

  const freezeUnfreezeAll = () => {
    let payload = { mapping_list: mappingList };
    fetch(
      `${baseUrl.local}/mapping/multiple_freeze/?freeze=${
        unFreeze ? "N" : "Y"
      }`,
      {
        method: "PUT",
        headers: {
          email: props?.userEmail,
          token: "test",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )
      .then((res) => {
        res.json().then((data) => {
          if (res.status === 200) {
            toast.success(
              !unFreeze
                ? "All controls freezed successfully"
                : "All controls unfreezed successfully",
              {
                theme: "colored",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
              }
            );
            let tempFreezeControlValues = [];
            for (let i = 0; i < props?.userMapping?.length; i++) {
              tempFreezeControlValues.push(unFreeze);
            }
            setFreezeControlValues(tempFreezeControlValues);
          }
        });
      })
      .catch((e) => console.log(e));
    setShowFreezeDialog(!showFreezeDialog);
  };

  const freezeUnfreezeOne = () => {
    let mapData = props?.userMapping[activeFreezeControl?.index];
    fetch(
      `${baseUrl.local}/mapping/freeze/?mapping_id=${
        mapData?.mapping_id
      }&freeze=${activeFreezeControl?.input ? "N" : "Y"}`,
      {
        method: "PUT",
        headers: {
          email: props?.userEmail,
          token: "test",
          "Content-Type": "application/json",
        },
        //body:JSON.stringify(payload),
      }
    )
      .then((res) => {
        res.json().then((data) => {
          if (res.status === 200) {
            toast.success(
              !activeFreezeControl?.input
                ? `Control ${
                    props?.userMapping[activeFreezeControl?.index]?.control
                  } freezed successfully`
                : `Control ${
                    props?.userMapping[activeFreezeControl?.index]?.control
                  } unfreezed successfully`,
              {
                theme: "colored",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
              }
            );
          }
        });
      })
      .catch((e) => console.log(e));
    setShowSingleFreezeDialog(!showSingleFreezeDialog);
  };

  //reviewer starts here....
  return (
    <div
      className="pb-10 w-full"
      style={{ minHeight: "200vh", height: "auto" }}
    >
      <div className="pt-8 pl-6 text-left">
        <p className="text-3xl font-bold">
          Hi,{" "}
          {props?.adminData?.master_name &&
            props?.adminData?.master_name.split(" ")[0]}
        </p>
        <p className="pt-1 text-md font-normal text-slate">(Admin)</p>
      </div>

      <div className="mt-4 mr-4 pl-6 w-full pr-1">
        <p className="pt-1 text-md font-bold">
          Please submit the following controls
        </p>
        <div className="mt-4 flex flex-col lg:flex-row justify-between ">
          <div className="w-full md:w-full shadow-lg lg:w-1/4 pb-1/2 text-center lg:text-left pl-2 sm:mb-2 mb-0 3xl:flex-row md:flex-row xl:flex-col flex-col rounded-md bg-reviewercontrolbox1 border-2 border-reviewercontrolbox1border mr-2 lg:mr-1">
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
          <div className="pl-6 pt-4 flex justify-between mr-8">
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
            } pt-5 pb-6 pl-6 w-11/12`}
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
                                          onChange={(e) => setSelectedControl(e.target.value)}>
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
                      className="w-full bg-gray border border-white shadow-lg text-gray-900 font-bold xl:text-sm 2xl:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="">Select status</option>
                      {props?.statusDropdown?.map((data) => (
                        <option value={data?.status_id}>
                          {data?.master_desc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex  md:flex-row 2xl:flex-row xl:flex-row flex-col w-full">
              <div className="mt-4 mr-4 w-1/2 pr-2">
                <p className="xl:text-sm 2xl:text-sm pb-2 text-slate font-semibold">
                  Select Process
                </p>
                <div className="flex md:flex-row xl:flex-row flex-col">
                  <div className="relative w-full md:flex-row xl:flex-row flex-col">
                    <select className="w-full bg-gray border border-white shadow-lg text-gray-900 font-bold xl:text-sm 2xl:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"
                    onChange={(e)=>setSelectedProcess(e.target.value)}>
                      <option value="">Select Process</option>
                      {props?.processDropdown?.map((data) => (
                        <option value={data}>{data}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-8 w-1/2">
                <button
                  type="button"
                  id="bt"
                  onClick={() => filterDataList()}
                  className="block mr-auto md:mr-auto shadow-lg 2xl:mt-3 xl:mt-3 bg-buttonblue xl:mr-auto text-white py-2.5 px-5 rounded-lg active:bg-darkblue2 hover:shadow-lg transition duration-150 ease-in-out"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-10 pl-6 flex md:flex-col xl:flex-col flex-col justify-between w-full">
          <p className="-mb-14 text-xs xl:text-xl 2xl:text-base font-bold w-1/2">
            List of controls
          </p>
          <div className="pt-8 2xl:ml-32 xl:ml-44 items-center justify-center"><p
            className="text-base font-bold md:flex-row  xl:flex-row flex-col text-buttonblue cursor-pointer"
            onClick={handleClose}
          >
            Rules<i className="bx bx-info-circle"></i>
          </p></div>
          
          <div class="flex items-center justify-end ml-auto xl:pl-50 2xl:pl-56 w-1/2 -mb-0">
            <label for="toogleA" className="flex items-center  cursor-pointer">
              <Switch
                className="relative 2xl:mr-0 xl:mr-2 -mt-8 px-2"
                checked={unFreeze}
                onChange={(e) => {
                  setUnFreeze(!unFreeze);
                  setShowFreezeDialog(!showFreezeDialog);
                }}
              />

              <div className="2xl:ml-2 xl:mr-5 -mt-7 text-gray-700 font-bold">
                {unFreeze ? "Unfreezed" : "Freezed"}
              </div>
            </label>
          </div>
        </div>
        {props?.userMapping &&
          props?.userMapping?.map((mapData, index) => (
            <div
              key={index}
              className={
                isVisible === index
                  ? "pt-4 mb-2 pb-2 pl-6 bg-darkblue1 text-white shadow-lg"
                  : "pt-4 mb-2 pb-2 pl-6 bg-lightblue2 hover:bg-darkblue1 hover:text-white shadow-lg"
              }
              onClick={() => Visibilitytoggle(index, mapData)}
            >
              <div className="text-xl flex justify-between w-full">
                <p className="pt-1.5 flex font-bold w-1/2">
                  {mapData.control}
                  {props?.adminData?.master_id === mapData?.last_updated_by && (
                    <i className="-pt-2 text-2xl pl-4 text-yesgreendefault bx bxs-check-circle"></i>
                  )}
                </p>
                <div class="flex xl:text-base justify-end mr-5 font-bold w-1/2">
                  <label
                    className="flex items-center cursor-pointer"
                    for="toggleB"
                  >
                    {freezeControlValues?.length ===
                      props?.userMapping?.length && (
                      <Switch
                        color="default"
                        checked={freezeControlValues[index]}
                        onChange={(e) => {
                          handleSingleFreeze(
                            index,
                            !freezeControlValues[index]
                          );
                          setShowSingleFreezeDialog(!showSingleFreezeDialog);
                        }}
                      />
                    )}
                    <div
                      className={
                        isVisible === index
                          ? "ml-3 2xl:mt-0  text-white font-medium"
                          : "ml-3 2xl:mt-0  text-black font-small"
                      }
                    >
                      {freezeControlValues[index] ? "Unfreezed" : "Freezed"}
                    </div>
                  </label>
                </div>
              </div>

              {(mapData?.Submitted_Homo_control || mapData?.Indentify_Homo) && (
                <div className="flex w-5 h-5">
                  <img src="homo.png" alt="img" />{" "}
                </div>
              )}

              <div className="2xl:pt-2 xl:pt-4 flex justify-between md:flex-col 2xl:flex-row xl:flex-row flex-col w-full">
                <div className="flex md:flex-row 2xl:flex-row xl:flex-row flex-col w-4/12">
                  <p className="">Control Owner</p>
                </div>
                <p className="font-bold w-3/12 md:ml-0 xl:ml-1 md:flex-row xl:flex-row flex-col">
                  {mapData.control_owner}
                </p>
                <p
                  className={`uppercase px-10 w-4/12 xl:px-5 2xl:pl-8 -ml-10 flex justify-end font-bold 2xl:text-sm xl:text-sm md:ml-0 nm:flex-col md:flex-col xl:flex-row flex-col${
                    props?.isVisible === index ? "text-white" : "text-black"
                  }`}
                >
                  {mapData.status}
                </p>
              </div>

              <div className="pt-2 flex md:flex-row xl:flex-row flex-col w-full">
                <p className="w-4/12">Reviewer</p>
                <p className="w-8/12 pl-5 font-bold md:ml-0 xl:ml-0 md:flex-row xl:flex-row flex-col">
                  {mapData.control_manager}
                </p>
              </div>
              <div className="pt-2 flex md:flex-row xl:flex-row flex-col w-full">
                <p className="w-4/12">Country</p>
                <p className="w-8/12 pl-7 font-bold md:ml-0 xl:-ml-2 md:flex-row xl:flex-row flex-col">
                  {mapData?.country_name}
                </p>
              </div>
              <div className="pt-2 flex md:flex-row xl:flex-row flex-col w-full">
                <p className="w-4/12">Location</p>
                <p className="w-8/12 pl-5 font-bold md:ml-0 md:flex-row xl:flex-row flex-col">
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
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
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
              <h3 className="mb-1 text-xl font-bold text-gray-500 dark:text-gray-400">
                Rules
              </h3>
              <ul className="mt-4 ml-6 list-disc mr-8">
                <li className="mb-1">
                  <p className="mb-5 font-bold text-sm">
                  All the completed and In-Approval controls are by default in compliant status
                  </p>
                </li>
                <li className="mb-1">
                  <p className="mb-5 font-bold text-sm">
                  The comment is mandatory for all the controls which are rejected
                  </p>
                </li>
                <li className="mb-1">
                  <p className="mb-5 font-bold text-sm">
                  There is no action for Not Started Controls
                  </p>
                </li>
                <li className="mb-1">
                  <p className="mb-5 font-bold text-sm">
                  If Master reject the control with comment and require some action from Control
                  <br/> Owner then change the status as rectifiable.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </div>
      <div
        id="popup-modal"
        tabindex="-1"
        className={`${
          showFreezeDialog ? "hidden" : ""
        } overflow-y-auto overflow-x-hidden absolute top-0 right-0 left-0 z-1 md:inset-0 h-modal md:h-full`}
      >
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex justify-end p-2">
              <button
                type="button"
                className="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                data-modal-toggle="popup-modal"
                onClick={handleCloseFreezeAllDialog}
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

            <div className="p-6 pt-0 text-center z-auto">
              <h3 className="mb-1 text-xl font-semibold text-gray-500 dark:text-gray-400">
                {!unFreeze
                  ? "Are you sure you want to freeze  all listed Controls?"
                  : "Are you sure you want to unfreeze all listed Controls?"}
              </h3>
              <p className="mb-5 text-sm">Your response will saved</p>
              <button
                data-modal-toggle="popup-modal"
                type="button"
                className="text-gray-500 bg-white focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                onClick={handleCloseFreezeAllDialog}
              >
                Go Back
              </button>
              <button
                data-modal-toggle="popup-modal"
                type="button"
                className="ml-10 text-white bg-buttonblue hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                onClick={freezeUnfreezeAll}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </div>
      <div
        id="popup-modal"
        tabindex="-1"
        className={`${
          showSingleFreezeDialog ? "hidden" : ""
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 md:inset-0 h-modal md:h-full`}
      >
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex justify-end p-2">
              <button
                type="button"
                className="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                data-modal-toggle="popup-modal"
                onClick={() => {
                  setShowSingleFreezeDialog(!showSingleFreezeDialog);
                  handleSingleFreeze(
                    activeFreezeControl?.index,
                    !activeFreezeControl?.input
                  );
                }}
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

            <div className="p-6 pt-0 text-center">
              <h3 className="mb-1 text-xl font-semibold text-gray-500 dark:text-gray-400">
                {!activeFreezeControl?.input
                  ? `Are you sure you want to freeze ${
                      props?.userMapping[activeFreezeControl?.index]?.control
                    } Control?`
                  : `Are you sure you want to unfreeze ${
                      props?.userMapping[activeFreezeControl?.index]?.control
                    } Control?`}
              </h3>
              <p className="mb-5 text-sm">Your response will saved</p>
              <button
                data-modal-toggle="popup-modal"
                type="button"
                className="text-gray-500 bg-white focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                onClick={() => {
                  setShowSingleFreezeDialog(!showSingleFreezeDialog);
                  handleSingleFreeze(
                    activeFreezeControl?.index,
                    !activeFreezeControl?.input
                  );
                }}
              >
                Go Back
              </button>
              <button
                data-modal-toggle="popup-modal"
                type="button"
                className="ml-10 text-white bg-buttonblue hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                onClick={freezeUnfreezeOne}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </div>
    </div>
  );
}
