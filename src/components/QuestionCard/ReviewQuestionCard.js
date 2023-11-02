import React, { useState, useEffect } from "react";
import { baseUrl } from "../../Shared/common";
import "./styles.css";
import { toast } from "react-toastify";

export default function ReviewQuestionCard(props) {
  const [commentsResponse, setCommentsResponse] = useState([]);
  const [switchesResponse, setSwitchsResponse] = useState([]);
  const [commentsInitialResponse, setInitialCommentsResponse] = useState([]);
  const [switchesInitialResponse, setSwitchsInitialResponse] = useState([]);
  const [disableValue, setDisableValue] = useState(true);
  const [fileChoose, setFileChosed] = useState([]);
  const [disableFocus, setDisableFocus] = useState(false);
  const [focus, setFocus] = useState();
  const [show, setShow] = useState(true);
  const [approveAll, setApproveAll] = useState(true);
  const [ifConrolIsInApproval, setIfConrolIsInApproval] = useState(true);
  const [submitAsHomogeneous, setSubmitAsHomogeneous] = useState(false);
  const [homogeneousControls, setHomogeneousControls] = useState([]);

  const handleClose = () => {
    setShow(!show);
  };
  useEffect(() => {
    if (props?.selectedMapping && props?.selectedMapping?.status_id === 3) {
      setIfConrolIsInApproval(true);
    } else {
      setIfConrolIsInApproval(false);
    }
  }, [props?.selectedMapping]);

  useEffect(() => {
    let comments = [];
    let switchRes = [];
    for (let i = 0; i < props?.questionSets?.length; i++) {
      comments.push(
        props?.transactionData[i]?.control_reviewer_response_comment ?? ""
      );
      switchRes.push(
        props?.transactionData[i]?.control_review_approval ?? "Approve"
      );
    }
    setCommentsResponse(comments);
    setSwitchsResponse(switchRes);
    setInitialCommentsResponse(comments);
    setSwitchsInitialResponse(switchRes);
    setFileChosed(props?.fileData);
    if (props?.selectedMapping?.Submitted_Homo_control) {
      let homogeneous = props?.userMapping?.filter(
        (mapping) =>
          mapping.Indentify_Homo === props?.selectedMapping?.Indentify_Homo
      );
      setHomogeneousControls(homogeneous);
    }
  }, [props?.transactionData, props?.questionSets, props?.fileData]);

  useEffect(() => {
    for (let i = 0; i < switchesResponse.length; i++) {
      if (switchesResponse[i] !== "Approve") {
        setApproveAll(false);
        return;
      }
    }
    setApproveAll(true);
  }, [switchesResponse]);

  const handleCommentChange = (id, value) => {
    setDisableFocus(true);
    let commentValue = [...commentsResponse];
    commentValue[id] = value;
    setCommentsResponse(commentValue);
    setFocus(id);
  };

  const handleSwitchChange = (e, id, value) => {
    // setApprove(true);
    if (ifConrolIsInApproval) {
      setDisableFocus(false);
      let switchesValue = [...switchesResponse];
      switchesValue[id] = value;
      setSwitchsResponse(switchesValue);
      console.log(switchesValue);
    }
  };

  const disableSubmit = () => {
    let noOfYesResponse = 0;
    let noOfCommentsResponse = 0;
    if (props?.selectedMapping?.status_id === 4) {
      return true;
    }
    for (let i = 0; i < switchesResponse.length; i++) {
      if (switchesResponse[i] === "Approve") {
        noOfYesResponse++;
      }
    }
    for (let i = 0; i < commentsResponse.length; i++) {
      if (commentsResponse[i] && commentsResponse[i].comments !== "") {
        noOfCommentsResponse++;
      }
    }
    if (noOfYesResponse === switchesResponse?.length) {
      return false;
    } else if (
      noOfCommentsResponse > 0 &&
      noOfYesResponse + noOfCommentsResponse === switchesResponse?.length
    ) {
      return false;
    } else {
      return true;
    }
  };

  const submitAsHomogeneousQuestions = () => {
    let newMapping = props?.userMapping;
    for (let i = 0; i < homogeneousControls?.length; i++) {
      submitQuestions(homogeneousControls[i]);
      newMapping = newMapping.filter(
        (item) => item.mapping_id !== homogeneousControls[i].mapping_id
      );
    }
    // props?.changeMappingAfterSubmit(newMapping);
    toast.success("Questions submitted successfully", {
      theme: "colored",
    });
  };

  const submitQuestions = (mappingData) => {
    let payloadChunk = {};
    let payload = [];
    let today = new Date();
    // let mappingData = props?.selectedMapping
    //   ? props?.selectedMapping
    //   : props?.userMapping[0];
    for (let i = 0; i < props.questionSets.length; i++) {
      payloadChunk = {
        transaction_id: props?.transactionData[i]?.transaction_id,
        mapping_id: mappingData?.mapping_id ? mappingData?.mapping_id : "",
        reviewer_approval: switchesResponse[i],
        reviewer_comment:
          switchesResponse[i] === "Approve" ? "" : commentsResponse[i],
        last_updated_by: "M_3",
        last_updated_date: today.toISOString() ?? "",
      };
      payload.push(payloadChunk);
    }
    fetch(`${baseUrl.local}/transaction/reviewer`, {
      method: "PUT",
      headers: {
        email: props?.userEmail,
        token: "test",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        res.json().then((data) => {
          props?.setDropdownForReviewer();
          props.getMappingByReviewerFilter({
            month: data[0]?.executing_month,
            year: data[0]?.executing_year,
            selectedCountry: props?.selectedFilters?.selectedCountry??"",
            selectedControl: props?.selectedFilters?.selectedControl??"",
            selectedStatus: props?.selectedFilters?.selectedStatus??"",
          });
          let comments = [];
          let switchRes = [];
          for (let i = 0; i < data?.length; i++) {
            comments.push(data[i]?.control_reviewer_response_comment ?? "");
            switchRes.push(data[i]?.control_review_approval ?? "Approve");
          }
          setCommentsResponse(comments);
          setSwitchsResponse(switchRes);
          if (homogeneousControls?.length === 0 || !submitAsHomogeneous) {
            toast.success("Review submitted successfully", {
              theme: "colored",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
            });
          }
        });
      })
      .catch((e) => console.log(e));
    handleClose();
  };

  const clearAllResponses = () => {
    setCommentsResponse(commentsInitialResponse);
    setSwitchsResponse(switchesInitialResponse);
  };

  const downloadFile = (file) => {
    if (file?.link_id) {
      fetch(`${baseUrl.local}/file/download/?link_id=${file?.link_id}`, {
        method: "GET",
        headers: {
          email: props?.userEmail,
          token: "test",
        },
      })
        .then((response) => response.text())
        .then((result) => {
          console.log(JSON.parse(result).content);
          dataURLtoFile(
            JSON.parse(result).content,
            JSON.parse(result).file_name
          );
        })
        .catch((error) => console.log("error", error));
    }
  };

  function dataURLtoFile(data, filename) {
    console.log(data, filename);
    const linkSource = data;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = filename;
    downloadLink.click();
  }

  const getFormatedDate = (d) => {
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
    let time = d?.slice(11, 19);
    let date = d?.split("T")[0].split("-")[2];
    let month = monthNames[parseInt(d?.split("T")[0]?.split("-")[1]) - 1];
    let year = d?.split("T")[0].split("-")[0];
    return d ? date + " " + month + " " + year + ", " + time : "";
  };

  return (
    <div className="mb-10">
      {(() => {
        if (props?.userMapping?.length === 0 || !props?.selectedMapping) {
          return (
            <div className="mt-44 text-center">
              <div className="relative left-1/2 -ml-12">
                <img src="doc-success.png" alt="img" />
              </div>
              <p className="mt-2 text-2xl font-bold">
                {props?.userMapping?.length !== 0
                  ? "Select any control to see the questions"
                  : "There are no controls to review"}
              </p>
              <div className="mt-20">
                <img className="w-full" src="Group 218.png" alt="loading.." />
              </div>
            </div>
          );
        } else {
          return (
            <>
              <div className="pt-4 pb-4"></div>
              <div>
                {/*added condition rendering for homogeneous card */}
                {props?.selectedMapping?.Submitted_Homo_control &&
                  ifConrolIsInApproval &&
                  homogeneousControls?.length > 1 && (
                    <div className="mb-4 flex h-full items-center border-2 border-darkgold bg-lightgold p-4 rounded-lg homogeneous">
                      <div className="text-left 2xl:mt-0 xl:-mt-2 mr-10">
                        <input
                          className="form-check-input px-8 h-5 w-5 border border-slate rounded-sm bg-white checked:bg-darkblue1 checked:border-darkblue1 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                          type="checkbox"
                          id="flexCheckDefault"
                          onChange={(e) =>
                            setSubmitAsHomogeneous(!submitAsHomogeneous)
                          }
                          checked={submitAsHomogeneous}
                        />

                        <label
                          className="xl:text-lg 2xl:text-lg text-slate font-bold"
                          for="checkbox"
                        >
                          Submit Same
                        </label>
                      </div>
                      <div className="">
                        <h3 className="pb-6 font-bold">
                          {homogeneousControls[0].control} is a homogeneous
                          Control. Do you want to submit the same response for
                          the following Control?
                        </h3>
                        <table className="2xl:w-1/3 xl:w-5/12 text-left">
                          <thead>
                            <tr className="text-slate text-lg">
                              <th>Country</th>
                              <th>Location</th>
                            </tr>
                          </thead>
                          <tbody>
                            {homogeneousControls &&
                              homogeneousControls?.map((control) => (
                                <tr className="text-black text-base font-bold">
                                  <td className="pr-8">
                                    {control?.country_name}
                                  </td>
                                  <td>{control?.Performance_locations}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
              </div>

              <div className="flex items-center">
                <p className="pb-4 text-2xl font-bold">Questions</p>
                {props?.transactionData[0]?.control_reviewer_comment_date && (
                  <span className="pb-4 px-5 text-sm font-semibold text-slate">
                    Last update on{" "}
                    {getFormatedDate(
                      props?.transactionData[0]?.control_reviewer_comment_date
                    )}
                  </span>
                )}
              </div>
              <div className="">
                {props.questionSets &&
                  props?.selectedMapping &&
                  props.questionSets.map((q, index) => (
                    <div className="mb-4 overflow-hidden w-full h-auto bg-white rounded-lg shadow-xl">
                      <div className="flex items-center justify-between leading-tight p-2 md:p-4">
                        <p className="font-semibold text-black">
                          {`Q${q.question_id}. ${q.question_description}`}
                        </p>
                      </div>
                      <div className="flex w-full justify-between">
                        <div className="w-1/2 bg-reviewercommentbackdrop mx-4 mr-4 rounded-md border-4 border-reviewercommentborder">
                          <div className="items-center justify-between leading-tight p-2 md:p-4">
                            <div className="flex">
                              <p className="text-sm font-semibold text-black mr-12">
                                Owner's response
                              </p>
                              <p className="text-sm font-semibold text-black mr-12">
                                Owner's comment
                              </p>
                              <p className="text-sm font-semibold text-slate">
                                {props?.transactionData[q.question_id - 1]
                                  ?.control_owner_comment_date &&
                                  getFormatedDate(
                                    props?.transactionData[q.question_id - 1]
                                      ?.control_owner_comment_date
                                  )}
                              </p>
                            </div>
                            <div className="flex mt-2">
                              <p className="text-sm font-semibold text-black">
                                {props?.transactionData &&
                                props?.transactionData[q.question_id - 1]
                                  ?.response_description ? (
                                  <div className="flex">
                                    {props?.transactionData[q.question_id - 1]
                                      ?.response_description === "Yes" ? (
                                      <i className="mr-1 text-yesgreendefault text-xl bx bxs-check-circle"></i>
                                    ) : (
                                      <i className="mr-1 text-nored text-xl bx bxs-x-circle"></i>
                                    )}
                                    <p className="mt-1 mr-28">
                                      {
                                        props?.transactionData[
                                          q.question_id - 1
                                        ]?.response_description
                                      }
                                    </p>
                                  </div>
                                ) : (
                                  <p className="mt-2 mr-44">---</p>
                                )}
                              </p>
                              <p className="text-xs font-bold font-Work Sans text-black">
                                {props?.transactionData && (
                                  <p className="mt-1.5 xl:-ml-7 2xl:-ml-7">
                                    {!!props?.transactionData[q.question_id - 1]
                                      ?.control_owner_response_comment
                                      ? props?.transactionData[
                                          q.question_id - 1
                                        ]?.control_owner_response_comment
                                      : "---"}
                                  </p>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="w-1/2 bg-reviewercommentbackdrop mx-4 mr-4 rounded-md border-4 border-reviewercommentborder">
                          <div className="items-center justify-between leading-tight p-2 md:p-4">
                            <div className="flex">
                              <p className="text-sm font-semibold text-black mr-12">
                                Admin's response
                              </p>
                              <p className="text-sm font-semibold text-black mr-12">
                                Admin's comment
                              </p>
                              <p className="text-sm font-semibold text-slate">
                                {props?.transactionData[q.question_id - 1]
                                  ?.control_owner_comment_date &&
                                  getFormatedDate(
                                    props?.transactionData[q.question_id - 1]
                                      ?.master_comment_date
                                  )}
                              </p>
                            </div>
                            <div className="flex mt-2">
                              <p className="text-sm font-semibold text-black">
                                {props?.transactionData &&
                                props?.transactionData[q.question_id - 1]
                                  ?.master_approval ? (
                                  <div className="flex">
                                    {props?.transactionData[q.question_id - 1]
                                      ?.master_approval === "Approve" ? (
                                      <i className="mr-1 text-yesgreendefault text-xl bx bxs-check-circle"></i>
                                    ) : (
                                      <i className="mr-1 text-nored text-xl bx bxs-x-circle"></i>
                                    )}
                                    <p className="mt-1 mr-28">
                                      {
                                        props?.transactionData[
                                          q.question_id - 1
                                        ]?.master_approval
                                      }
                                    </p>
                                  </div>
                                ) : (
                                  <p className="mt-2 mr-44">---</p>
                                )}
                              </p>
                              <p className="text-xs font-bold font-Work Sans text-black">
                                {props?.transactionData && (
                                  <p className="mt-1.5 xl:-ml-7 2xl:-ml-7">
                                    {!!props?.transactionData[q.question_id - 1]
                                      ?.master_response_comment
                                      ? props?.transactionData[
                                          q.question_id - 1
                                        ]?.master_response_comment
                                      : "---"}
                                  </p>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between ml-4 mb-2 py-4">
                        <div className="w-1/4 text-md flex">
                          <div
                            className={`${
                              switchesResponse[q?.question_id - 1] === "Approve"
                                ? "bg-approve border-approve"
                                : "bg-white border-reject"
                            } rounded-l-full border-2 p-2 flex form-check form-check-inline pl-1 h-10`}
                            onClick={(e) =>
                              handleSwitchChange(
                                e,
                                q.question_id - 1,
                                "Approve"
                              )
                            }
                          >
                            <input
                              className="form-check-input review-question appearance-none rounded-full h-5 w-5 border border-yesgreendefault bg-yesgreendefault checked:bg-white checked:border-[5px] checked:border-yesgreen focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                              type="radio"
                              disabled={!ifConrolIsInApproval}
                              name={q?.question_id}
                              checked={
                                switchesResponse[q?.question_id - 1] ===
                                "Approve"
                              }
                              onChange={(e) =>
                                handleSwitchChange(
                                  e,
                                  q.question_id - 1,
                                  "Approve"
                                )
                              }
                            />
                            <i className="px-1.5 -mt-1.5 font-bold text-2xl bx bx-check" />
                            <label
                              className={`${
                                switchesResponse[q?.question_id - 1] ===
                                "Approve"
                                  ? "text-white"
                                  : "text-black"
                              } -mt-0.5  -ml-1 font-Work Sans form-check-label inline-block font-normal cursor-pointer`}
                              for="inlineRadio10"
                            >
                              Approve
                            </label>
                          </div>
                          <div
                            className={`${
                              switchesResponse[q?.question_id - 1] ===
                              "Rejected"
                                ? "bg-reject border-reject"
                                : "bg-white border-approve"
                            } rounded-r-full border-2 p-2 flex form-check form-check-inline pr-4 pl-0 h-10`}
                            onClick={(e) =>
                              handleSwitchChange(
                                e,
                                q.question_id - 1,
                                "Rejected"
                              )
                            }
                          >
                            <input
                              className="form-check-input review-question appearance-none rounded-full h-5 w-5 border border-noreddefault bg-noreddefault checked:bg-white checked:border-[5px] checked:border-nored focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                              type="radio"
                              name={q?.question_id}
                              disabled={!ifConrolIsInApproval}
                              checked={
                                switchesResponse[q?.question_id - 1] ===
                                "Rejected"
                              }
                              onChange={(e) =>
                                handleSwitchChange(
                                  e,
                                  q.question_id - 1,
                                  "Rejected"
                                )
                              }
                            />
                            <i className="px-1.5 -mt-1.5 font-bold text-2xl bx bx-x" />
                            <label
                              className={`${
                                switchesResponse[q?.question_id - 1] ===
                                "Rejected"
                                  ? "text-white"
                                  : "text-black"
                              } -mt-0.5 -ml-1 font-Work Sans form-check-label inline-block font-normal cursor-pointer`}
                              for="inlineRadio20"
                            >
                              Reject
                            </label>
                          </div>
                        </div>

                        <div className="xl:w-3/5 2xl:w-3/4 mx-4 ml-10 2xl:ml-0 md:flex-row xl:flex-row flex-col">
                          {switchesResponse &&
                            switchesResponse[q.question_id - 1] ===
                              "Rejected" && (
                              <input
                                className="appearance-none block w-full h-10 bg-gray-200 text-gray-700 border border-nored rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="grid-last-name"
                                type="text"
                                placeholder="Write Here"
                                disabled={!ifConrolIsInApproval}
                                autoFocus={q.question_id - 1 === focus}
                                variant="outlined"
                                value={
                                  commentsResponse[q.question_id - 1] ?? ""
                                }
                                onChange={(e) =>
                                  handleCommentChange(
                                    q.question_id - 1,
                                    e.target.value
                                  )
                                }
                              />
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="pt-4">
                <div className="w-full">
                  {/*
                  <label className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-buttonblue border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                    <span className="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 text-slate"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <span className="font-medium text-buttonblue">
                        Click to upload
                        <span className="text-black"> or drag and drop</span>
                      </span>
                    </span>
                    <input
                      id="file-upload"
                      className="hidden"
                      type="file"
                      onChange={(e) => readFile(e)}
                      multiple={true}
                      name="file_upload"
                    />
                              </label>*/}
                  {fileChoose &&
                    fileChoose.map((file) => (
                      <div className="flex my-4 py-2.5 px-4 w-full h-16 bg-lightblue3 text-black rounded-lg shadow-xl justify-between">
                        <div className="flex items-center">
                          <div className="flex flex-col">
                            <p className="font-bold flex items-center">
                              <i className="px-4 bx bx-file-blank text-2xl"></i>
                              {file?.name ?? file?.file_name}
                            </p>
                            <p className="ml-14">
                              {file?.size
                                ? Math.round(file?.size / 1024) + "kb"
                                : file?.file_size}
                            </p>
                          </div>
                        </div>
                        <div className="flex text-white">
                          <div className="mr-4">
                            {file?.file_name && (
                              <i
                                className="mt-4 bx bx-download font-bold hover:cursor-pointer text-black hover:text-yesgreen"
                                onClick={() => downloadFile(file)}
                              ></i>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                {/*{fileChoose && fileChoose.length > 0 && (
                  <div className="flex float-right font-bold hover:cursor-pointer">
                    <i className="text-md mt-4 bx bxs-camera text-buttonblue"></i>
                    <p className="text-md mt-3 ml-4 text-buttonblue">
                      Downloads Zip
                    </p>
                  </div>
                )} */}
              </div>
              <div className="pt-4 w-full flex justify-between">
                <div>
                  {ifConrolIsInApproval && (
                    <button
                      onClick={clearAllResponses}
                      className="bg-white border-2 border-buttonblue hover:bg-darkblue1 hover:text-white text-buttonblue py-2 px-6 rounded-lg active:bg-darkblue2 active:shadow-lg transition duration-150 ease-in-out"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div>
                  {ifConrolIsInApproval && (
                    <button
                      className={
                        disableSubmit()
                          ? "bg-slate  text-white py-2.5 px-6 rounded-lg"
                          : "bg-buttonblue hover:bg-darkblue1 text-white py-2.5 px-6 rounded-lg active:bg-darkblue2 active:shadow-lg transition duration-150 ease-in-out"
                      }
                      type="button"
                      data-modal-toggle="popup-modal"
                      onClick={handleClose}
                      disabled={disableSubmit()}
                    >
                      Submit
                    </button>
                  )}

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

                        <div className="p-6 pt-0 text-center">
                          {approveAll ? (
                            <div>
                              <h3 className="mb-1 text-xl font-semibold text-gray-500 dark:text-gray-400">
                                Are you sure, you want to approve all responses?
                              </h3>
                              <input
                                type="text"
                                className="mt-2 appearance-none block w-full h-12 bg-gray-200 text-gray-700 border border-nored rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="grid-last-name"
                                placeholder="Write Your Comment here"
                                variant="outlined"
                              />
                            </div>
                          ) : (
                            <h3 className="mb-1 text-xl font-semibold text-gray-500 dark:text-gray-400">
                              Are you sure, you want to submit your review?
                            </h3>
                          )}

                          <button
                            data-modal-toggle="popup-modal"
                            type="button"
                            className="mt-6 text-gray-500 bg-white focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                            onClick={handleClose}
                          >
                            Go Back
                          </button>
                          <button
                            data-modal-toggle="popup-modal"
                            type="button"
                            className="ml-6 text-white bg-buttonblue hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                            onClick={() =>
                              submitAsHomogeneous
                                ? submitAsHomogeneousQuestions()
                                : submitQuestions(
                                    props?.selectedMapping
                                      ? props?.selectedMapping
                                      : props?.mappingData[0]
                                  )
                            }
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                  </div>
                </div>
              </div>
            </>
          );
        }
      })()}
    </div>
  );
}
