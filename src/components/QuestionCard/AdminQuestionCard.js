import React, { useState, useEffect } from "react";
import { baseUrl } from "../../Shared/common";
import "./styles.css";
import { toast } from "react-toastify";


export default function AdminQuestionCard(props) {
  const [commentsResponse, setCommentsResponse] = useState([]);
  const [switchesResponse, setSwitchsResponse] = useState([]);
  const [compliantResponse, setCompliantsResponse] = useState([]);
  const [compliantCommentsResponse,setCompliantCommentResponse]=useState([]);
  const [commentsInitialResponse, setInitialCommentsResponse] = useState([]);
  const [compliantInitialResponse, setInitialCompliantResponse] = useState([]);
  const [compliantInitialComment, setInitialCompliantComment] = useState([]);
  const [switchesInitialResponse, setSwitchsInitialResponse] = useState([]);
  const [disableValue, setDisableValue] = useState(true);
  const [fileChoose, setFileChosed] = useState([]);
  const [disableFocus, setDisableFocus] = useState(false);
  const [focus, setFocus] = useState();
  const [show, setShow] = useState(true);
  const [startDate, setStartDate] = useState(formatDate(new Date()));

  const handleClose = () => {
    setShow(!show);
  };
  useEffect(()=>{
    if(startDate){
    filterDataList();
    }
  },[startDate])

  useEffect(() => {
    let comments = [];
    let switchRes = [];
    let complaintStatusArr=[];
    let compliantComments=[];
    for (let i = 0; i < props?.questionSets?.length; i++) {
      comments.push(
        props?.transactionData[i]?.master_response_comment ?? ""
      );
      switchRes.push(
        props?.transactionData[i]?.master_approval ?? "Approve"
      );
      complaintStatusArr.push(props.transactionData[i]?.compliant_status??"Compliant")
      compliantComments.push(props.transactionData[i]?.admin_compliance_comment??"")
    }
    setCommentsResponse(comments);
    setSwitchsResponse(switchRes);
    setCompliantsResponse(complaintStatusArr);
    setInitialCompliantResponse(complaintStatusArr)
    setInitialCommentsResponse(comments);
    setSwitchsInitialResponse(switchRes);
    setCompliantCommentResponse(compliantComments);
    setInitialCompliantComment(compliantComments)
    setFileChosed(props?.fileData);
  }, [props]);

  const showResponseButton=React.useMemo(()=>{
   if(props?.selectedMapping?.status_id===4 || props?.selectedMapping?.status_id===3){
    return true;
   }else{
    return false;
   }
  },[props?.selectedMapping])

  const handleCommentChange = (id, value) => {
    if(showResponseButton){
    setDisableFocus(true);
    let commentValue = [...commentsResponse];
    commentValue[id] = value;
    setCommentsResponse(commentValue);
    setFocus(id);
    }
  };

  const handleCompliantCommentChange= (id, value) => {
    if(showResponseButton){
    setDisableFocus(true);
    let commentValue = [...compliantCommentsResponse];
    commentValue[id] = value;
    setCompliantCommentResponse(commentValue);
    setFocus(id);
    }
  };

  const handleSwitchChange = (e, id, value) => {
    if(showResponseButton){
      setDisableFocus(false);
    let switchesValue = [...switchesResponse];
    switchesValue[id] = value;
    setSwitchsResponse(switchesValue);
    if(value==="Rejected"){
      handleCompliantChange(e,id,"Rectifiable");
    }else{
      handleCompliantChange(e,id,"Compliant")
    }
    }
  };

  const handleCompliantChange = (e, id, value) => {
    if(showResponseButton){
      setDisableFocus(false);
    let switchesValue = [...compliantResponse];
    switchesValue[id] = value;
    setCompliantsResponse(switchesValue);
    }
  };

  const disableSubmit = () => {
    let noOfYesResponse = 0;
    let noOfCommentsResponse = 0;
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

  const submitResponses = () => {
    let payloadChunk = {};
    let payload = [];
    let today = new Date();
    let mappingData = props?.selectedMapping
      ? props?.selectedMapping
      : props?.userMapping[0];
    for (let i = 0; i < props.questionSets.length; i++) {
      payloadChunk = {
        transaction_id: props?.transactionData[i]?.transaction_id,
        mapping_id: mappingData?.mapping_id ? mappingData?.mapping_id : "",
        admin_approval: switchesResponse[i],
        compliant_status: compliantResponse[i],
        admin_comment: commentsResponse[i] ?? "",
        admin_compliance_comment:compliantCommentsResponse[i] ?? "",
        last_updated_by: props?.adminData?.master_id,
        last_updated_date: today.toISOString() ?? "",
      };
      payload.push(payloadChunk);
    }
    fetch(`${baseUrl.local}/transaction/admin/`, {
      method: "PUT",
      headers: {
        email: props?.userEmail,
        token: "test",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        res.json().then(data=>{
          if(res.status===200){
          toast.success("Responses submitted successfully", {
            theme: "colored",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          });
          props.getMappingByAdminFilter({
            month: data[0]?.executing_month,
            year: data[0]?.executing_year,
            selectedCountry: "",
            selectedControl: "",
            selectedStatus: "",
          });
        }else{
          toast.error("Responses not submitted", {
            theme:"colored",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          });
        }
        })
      })
      .catch((e) => console.log(e));
    handleClose();
  };

  const clearAllResponses = () => {
    setCommentsResponse(commentsInitialResponse);
    setSwitchsResponse(switchesInitialResponse);
    setCompliantCommentResponse(compliantInitialComment);
    setCompliantsResponse(compliantInitialResponse);
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
    return date + " " + month + " " + year + ", " + time;
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
      selectedCountry:  "",
      selectedControl: "",
      selectedStatus:  "",
    });
  };

  function formatDate(date) {
    var d = new Date(date),
      month = "" + d.getMonth(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;

    return [year, month].join("-");
  }

  return (
    <div className="mb-10">
      {(() => {
        if (props?.userMapping?.length == 0) {
          return (
            <div className="mt-44 text-center">
              <div className="relative left-1/2 -ml-12">
              <img  src="doc-success.png" alt="img" />
              </div>
              <p className="mt-2 text-2xl font-bold">
                There are no controls to perform.
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
              <div className="flex items-center">
                <p className="pb-4 text-2xl font-bold">Questions</p>
               {props?.transactionData[0]?.response_date &&
                <span className="pb-4 px-5 text-sm font-semibold text-slate">
                  Last update on{" "}
                  {getFormatedDate(props?.transactionData[0]?.response_date)}
                </span>}
              </div>
              <div className="">
                {props.questionSets &&
                  props.questionSets.map((q, index) => (
                    <div className="mb-4 overflow-hidden w-full h-auto bg-white rounded-lg shadow-xl">
                      <div className="flex items-center justify-between leading-tight p-2 md:p-4">
                        <p className="font-semibold text-black">
                          {`Q${q.question_id}. ${q.question_description}`}
                        </p>
                      </div>

                      <div className="flex items-center justify-between ml-4 py-1">
                        <div className="xl:w-1/2 2xl:w-4/12 text-md flex">
                          <div
                            className={`${
                              switchesResponse[q?.question_id - 1] === "Approve"
                                ? "bg-approve border-approve mb-4 shadow-lg"
                                : "bg-white border-reject shadow-lg"
                            } rounded-l-full border-2 p-2 flex form-check form-check-inline pl-2 h-10 shadow-lg`}
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
                            <i className="px-1.5 -mt-1.5 font-bold text-2xl bx bx-check"/>
                            <label
                              className={`${
                                switchesResponse[q?.question_id - 1] ===
                                
                                "Approve"
                                
                                  ? "text-white"
                                  : "text-black"
                              } -mt-0.5 -ml-1 font-Work Sans form-check-label inline-block font-normal cursor-pointer`}
                              for="inlineRadio10"
                            >
                              Approve
                            </label>
                          </div>
                          <div
                            className={`${
                              switchesResponse[q?.question_id - 1] ===
                              "Rejected"
                                ? "bg-reject border-reject shadow-lg"
                                : "bg-white border-approve shadow-lg"
                            } rounded-r-full border-2 p-2 flex form-check form-check-inline pr-4 pl-0 h-10 shadow-lg`}
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

                        <div className="xl:w-1/2 2xl:w-8/12 mx-4">
                          {switchesResponse &&
                            switchesResponse[q.question_id - 1] ===
                              "Rejected" && (
                              <input
                                className="appearance-none shadow-lg block w-full h-10 bg-gray-200 text-gray-700 border border-nored rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="grid-last-name"
                                type="text"
                                placeholder="Write Here"
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
                     {switchesResponse &&
                            switchesResponse[q.question_id - 1] ===
                              "Rejected" &&  <div className="flex items-center text-center 2xl:ml-1 xl:ml-1 justify-between py-3">
                        <div className="xl:w-1/2 2xl:w-4/12 text-sm flex ml-4">
                          <div
                            className={`${
                              compliantResponse[q?.question_id - 1] === "Rectifiable"
                                ? "bg-reject shadow-lg"
                                : "bg-white shadow-lg"
                            } border-reject rounded-l-full border-2 p-2 flex form-check form-check-inline -ml-1 pl-4 shadow-lg`}
                            onClick={(e) =>
                              handleCompliantChange(
                                e,
                                q.question_id - 1,
                                "Rectifiable"
                              )
                            }
                          >
                            <label
                              className={`${
                                compliantResponse[q?.question_id - 1] ===
                                "Rectifiable"
                                  ? "text-white"
                                  : "text-black"
                              } font-Work Sans form-check-label inline-block font-normal cursor-pointer`}
                              for="inlineRadio10"
                            >
                             Rectifiable
                            </label>
                          </div>
                          
                          <div
                            className={`${
                              compliantResponse[q?.question_id - 1]
                                ? compliantResponse[q?.question_id - 1] ===
                                  "Rectifiable"
                                  ? "bg-white border-reject shadow-lg"
                                  : compliantResponse[q?.question_id - 1] ===
                                    "Non-Rectifiable"
                                  ? "bg-reject border-reject shadow-lg"
                                  : "bg-white border-approve shadow-lg"
                                : "bg-white border-reject shadow-lg"
                            } rounded-r-full border-2 p-2  flex form-check form-check-inline -ml-1 pr-4`}
                            onClick={(e) =>
                              handleCompliantChange(
                                e,
                                q.question_id - 1,
                                "Non-Rectifiable"
                              )
                            }
                          >

                            <label
                              className={`${
                                compliantResponse[q?.question_id - 1] ===
                                "Non-Rectifiable"
                                  ? "text-white"
                                  : "text-black"
                              } font-Work Sans form-check-label inline-block font-normal cursor-pointer homogenous`}
                              for="inlineRadio20"
                            >
                              Non-Rectifiable
                            </label>
                          </div>
                        </div>

                        <div className="xl:w-1/2 2xl:w-8/12 mx-4">
                          {compliantResponse &&
                            compliantResponse[q.question_id - 1] !==
                              "Compliant" && (
                              <input
                                className="appearance-none shadow-lg block w-full h-10 bg-gray-200 text-gray-700 border border-nored rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="grid-last-name"
                                type="text"
                                placeholder="Write Here"
                                autoFocus={q.question_id - 1 === focus}
                                variant="outlined"
                                value={
                                  compliantCommentsResponse[q.question_id - 1] ?? ""
                                }
                                onChange={(e) =>
                                  handleCompliantCommentChange(
                                    q.question_id - 1,
                                    e.target.value
                                  )
                                }
                              />
                            )}
                        </div>
                      </div>}
                      <div className="flex mb-4">
                        <div className="bg-reviewercommentbackdrop mx-3 rounded-md border-4 border-reviewercommentborder w-1/2">
                          <div className="items-center justify-between leading-tight p-4">
                            <div className="flex">
                              <p className="text-sm font-semibold text-black mr-12">
                                Owner's response
                              </p>
                              <p className="text-sm font-semibold text-black mr-12">
                                Owner's comment
                              </p>
                              <p className="text-xs pt-1 font-semibold text-slate">
                                {props?.transactionData[q.question_id - 1]
                                  ?.control_owner_comment_date &&
                                  getFormatedDate(
                                    props?.transactionData[q.question_id - 1]
                                      ?.control_owner_comment_date
                                  )}
                              </p>
                            </div>
                            <div className="flex mt-2">
                              <p className="text-xs font-semibold text-black">
                                {props?.transactionData &&
                                props?.transactionData[q.question_id - 1]
                                  ?.response_description ? (
                                  <div className="flex">
                                    {props?.transactionData[q.question_id - 1]
                                      ?.response_description === "Yes" ? (
                                      <i className="mr-1 text-yesgreendefault text-lg bx bxs-check-circle"></i>
                                    ) : (
                                      <i className="mr-1 text-nored text-lg bx bxs-x-circle"></i>
                                    )}
                                    <p className="mt-1.5 mr-28">
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
                                  <p className="mt-1.5 xl:-ml-2 2xl:ml-4">
                                    {props?.transactionData[q.question_id - 1]
                                      ?.control_owner_response_comment !== ""
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
                        <div className="bg-reviewercommentbackdrop mx-3 rounded-md border-4 border-reviewercommentborder w-1/2">
                          <div className="items-center justify-between leading-tight p-2 md:p-4">
                            <div className="flex">
                              <p className="text-sm font-semibold text-black mr-12">
                                Reviewer's response
                              </p>
                              <p className="text-sm font-semibold text-black mr-12">
                                Reviewer's comment
                              </p>
                              <p className="text-xs pt-1 font-semibold text-slate">
                                {props?.transactionData[q.question_id - 1]
                                  ?.control_owner_comment_date &&
                                  getFormatedDate(
                                    props?.transactionData[q.question_id - 1]
                                      ?.control_owner_comment_date
                                  )}
                              </p>
                            </div>
                            <div className="flex mt-2">
                              <p className="text-xs font-semibold text-black">
                                {props?.transactionData &&
                                props?.transactionData[q.question_id - 1]
                                  ?.control_review_approval ? (
                                  <div className="flex">
                                    {props?.transactionData[q.question_id - 1]
                                      ?.control_review_approval === "Approve" ? (
                                      <i className="mr-1 text-yesgreendefault text-xl bx bxs-check-circle"></i>
                                    ) : (
                                      <i className="mr-1 text-nored text-xl bx bxs-x-circle"></i>
                                    )}
                                    <p className="mt-1.5 mr-28">
                                      {
                                        props?.transactionData[
                                          q.question_id - 1
                                        ]?.control_review_approval
                                      }
                                    </p>
                                  </div>
                                ) : (
                                  <p className="mt-1 mr-44">---</p>
                                )}
                              </p>
                              <p className="text-xs font-bold font-Work Sans text-black">
                                {props?.transactionData && (
                                 <p className="mt-1.5 xl:-ml-9 2xl:ml-1">
                                    {props?.transactionData[q.question_id - 1]
                                      ?.control_reviewer_response_comment !== ""
                                      ? props?.transactionData[
                                          q.question_id - 1
                                        ]?.control_reviewer_response_comment
                                      : "---"}
                                  </p>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="pt-1">
                <div className="w-full">
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
        
              </div>
            { showResponseButton && <div className="pt-4 w-full flex justify-between">
                <div>
                  <button
                    onClick={clearAllResponses}
                    className="bg-white border-2 border-buttonblue hover:bg-darkblue1 hover:text-white text-buttonblue py-2 px-6 rounded-lg"
                  >
                    Reset
                  </button>
                </div>
                <div>
                  <button
                    className={
                      disableSubmit()
                        ? "bg-slate  text-white py-2.5 px-6 rounded-lg"
                        : "bg-buttonblue hover:bg-darkblue1 text-white py-2.5 px-6 rounded-lg"
                    }
                    type="button"
                    data-modal-toggle="popup-modal"
                    onClick={handleClose}
                    disabled={disableSubmit()}
                  >
                    Submit
                  </button>

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
                          <h3 className="mb-1 text-xl font-semibold text-gray-500 dark:text-gray-400">
                            Are you sure, you want to submit response?
                          </h3>

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
                            onClick={submitResponses}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                  </div>
                </div>
              </div>}
            </>
          );
        }
      })()}
    </div>
  );
}
