import React, { useState, useEffect } from "react";
import { baseUrl } from "../../Shared/common";
import "./styles.css";
import {ReadMore} from "../../utils/readMore" 
import {formatDate,formatDateView} from "../../Shared/utils";


export function ControlCardViewOwner(props) {
  const [isVisible, setIsVisible] = useState(null);
  const [isDrop, setIsDrop] = useState(false);
  const [statusList, setStatusList] = useState();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [startDate, setStartDate] = useState(formatDate(new Date()));
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(!show);
  };

  useEffect(() => {
    if (props?.userMapping[0]) {
      fetch(
        `${baseUrl.local}/utility/owner_dropdown/?user_id=${
          props.userMapping[0] ? props.userMapping[0].user_id : ""
        }`,
        {
          method: "GET",
          headers: {
            email: props?.userEmail,
            token: "test",
          },
        }
      )
        .then((data) => data.json())
        .then((data) => {
          setStatusList(data.status);
        })
        .catch((e) => console.log(e));
    }
  }, [props?.userMapping]);

  const Visibilitytoggle = (value, mapData) => {
    props?.setIsVisible(value);
    props?.setSelectedMapping(mapData);
  };

  const Dropdowntoggle = () => {
    setIsDrop(!isDrop);
    console.log(isDrop);
  };

  const selectDropDown = (data) => {
    if (data === "All") {
      setSelectedStatus("");
    } else {
      setSelectedStatus(data);
    }
    Dropdowntoggle();
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
    props.getMappingByOwnerFilter({
      month: monthNames[parseInt(startDate.split("-")[1]) - 1],
      year: startDate.split("-")[0],
      selectedCountry: "",
      selectedStatus: selectedStatus ?? "",
    });
  };

  //view-owner starts here....
  return (
    <div className="pb-10" style={{ minHeight: "185vh", height: "auto" }}>
      <div className="pt-8 pl-6 text-left">
        <p className="text-3xl font-bold">
          Hi,{" "}
          {props?.userData?.control_owner &&
            props?.userData?.control_owner.split(" ")[0]}
        </p>
        <p className="pt-1 text-md font-normal text-slate">(Owner)</p>
      </div>

      <p className="text-sm pt-5 pb-2 pl-6 font-bold">
        Check reviewer response and edit your response
      </p>
      <div className="">
        <div className="bg-lightblue2 shadow-lg">
          <div className="pt-2 pb-6 pl-6">
            <div className="flex xl:flex-row flex-col">
              <div className="relative xl:w-[150px] 2xl:w-[170px]">
                <p className="text-sm pb-2 text-slate font-bold">MM/YYYY</p>

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
                    // className="w-full bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    className="w-full bg-gray border border-white shadow-lg py-2.5 text-gray-900 font-bold xl:text-base 2xl:text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-10 p-2.5"
                  />
                </label>
              </div>

              <div className="relative xl:mx-4 ">
                <div className="dropdown inline-block relative rounded-lg">
                  <div>
                    {/* <button
                    className="bg-white text-gray-700 font-normal py-2 px-4 rounded inline-flex items-center"
                    onClick={Dropdowntoggle}
                  >
                    <span className="mr-1">
                      {selectedStatus?.control_owner_desc ?? "Status"}
                    </span>
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />{" "}
                    </svg>
                  </button> */}
                    <div className="flex items-center justify-center">
                      <div className="relative xl:w-[152px] 2xl:w-[160px] ">
                        <p className="text-sm text-slate pb-2 font-bold">
                          Select Status
                        </p>
                        <select
                          className="w-full bg-gray border border-white shadow-lg text-gray-900 font-bold xl:text-sm 2xl:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"
                          onChange={(e) => selectDropDown(e.target.value)}
                        >
                          <option className="hover:bg-lightblue2" value="All">
                            All
                          </option>
                          {statusList &&
                            statusList?.map((data, index) => (
                              <option
                                className="hover:bg-lightblue2"
                                key={index}
                                value={data?.status_id}
                              >
                                {data?.control_owner_desc}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  {/* <ul
                    onclick={() => selectDropDown("hero")}
                    className={`${
                      isDrop == true ? "hidden" : ""
                    } bg-white dropdown-menu absolute text-gray-700 pt-1 w-full`}
                  >
                    {statusList &&
                      statusList?.map((data, index) => (
                        <li className="hover:bg-lightblue2" key={index}>
                          <a className="rounded-t bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap">
                            {data?.control_owner_desc}
                          </a>
                        </li>
                      ))}
                  </ul> */}
                </div>
              </div>
            </div>
            <button
              className="mt-4 2xl:ml-72 xl:ml-64 md:mr-auto shadow-lg bg-buttonblue active:bg-darkblue2 hover:shadow-lg transition duration-150 ease-in-out text-white py-2 px-2 rounded-lg"
              onClick={() => filterDataList()}
            >
              Apply
            </button>
          </div>
        </div>
        <div className="pt-8 pl-6 flex md:flex-col xl:flex-row flex-col">
          <p className="mr-10 pb-2 text-xl font-bold">List of controls</p>
          <p
            className="text-xl font-semibold text-buttonblue cursor-pointer"
            onClick={handleClose}
          >
            Rules <i className="bx bx-info-circle"></i>
          </p>
        </div>
        {props?.userMapping &&
          props?.userMapping?.map((mapData, index) => (
            <div
              key={index}
              className={
                props?.isVisible === index
                  ? "pt-4 mb-2 pb-2 pl-6 bg-darkblue1 text-white shadow-lg"
                  : "pt-4 mb-2 pb-2 pl-6 bg-lightblue2 hover:bg-darkblue1 hover:text-white shadow-lg"
              }
              onClick={() => Visibilitytoggle(index, mapData)}
            >
              {mapData?.Submitted_Homo_control && (
                <div className="flex w-5 h-5">
                  <img src="homo.png" alt="img" />{" "}
                </div>
              )}
              <div className="pt-2 flex justify-between md:flex-col xl:flex-row flex-col">
                <div className="flex md:flex-row xl:flex-row flex-col">
                  <p className="">Control</p>
                  <p className="pl-7 font-bold -ml-7 md:ml-0 xl:ml-0 md:flex-row xl:flex-row flex-col">
                    {mapData.control}
                  </p>
                </div>
                <p
                  className={`uppercase px-10 mr-70 -ml-10 font-bold md:ml-0 xl:ml-4 nm:flex-col md:flex-col xl:flex-row  2xl:text-sm first-letter: flex-col ${
                    props?.isVisible === index && mapData.status !== "Rejected"
                      ? "text-white"
                      : mapData.status !== "Rejected"
                      ? "text-black"
                      : "text-reject"
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
              <div className={props?.isVisible === index ? "" : "hidden"}>
                <div className="">
                  <p className="pt-2 font-semibold md:flex-row xl:flex-row flex-col">
                    Control Description
                  </p>
                  <p className="pt-2 text-xs pr-6 md:flex-row xl:flex-row flex-col">
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
                    If the user submit all answers as "Yes", then the attachment
                    is mandatory for the user to submit.
                    <br />
                    Unless the user submit the attachment, the submit button
                    will not be enable
                  </p>
                </li>
                <li className="mb-1">
                  <p className="mb-5 text-sm font-bold">
                    If the user submit any one of the question response as "No"
                    then comment is mandatory
                  </p>
                </li>
                <li className="mb-1">
                  <p className="mb-5 text-sm font-bold">
                    Total attachment file size should not exceed 20MB
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
