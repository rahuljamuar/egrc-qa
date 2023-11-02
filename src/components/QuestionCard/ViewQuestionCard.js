import React, { useState, useEffect, useCallback } from "react";
import { baseUrl } from "../../Shared/common";
import { toast } from "react-toastify";
import { FileUploader } from "react-drag-drop-files";

export default function ViewQuestionCard(props) {
  const [commentsResponse, setCommentsResponse] = useState([]);
  const [switchesResponse, setSwitchsResponse] = useState([]);
  const [commentsInitialResponse, setInitialCommentsResponse] = useState([]);
  const [switchesInitialResponse, setSwitchsInitialResponse] = useState([]);

  const [disableValue, setDisableValue] = useState(true);
  const [fileChoose, setFileChosed] = useState([]);
  const [disableFocus, setDisableFocus] = useState(false);
  const [focus, setFocus] = useState();
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(0);
  const [markAllAsYes, setMarkAllAsYes] = useState(false);
  const [ifConrolNotCompleted, setIfControlNotCompleted] = useState(true);

  const [notifyLargeFile, setNotifyLargeFile] = useState(true);

  useEffect(() => {
    if (props?.selectedMapping && props?.selectedMapping?.status_id === 4) {
      setIfControlNotCompleted(false);
    } else {
      setIfControlNotCompleted(true);
    }
  }, [props?.selectedMapping]);

  const handleClose = () => {
    setShow(!show);
  };

  useEffect(() => {
    let comments = [];
    let switchRes = [];
    for (let i = 0; i < props?.questionSets?.length; i++) {
      comments.push(props?.transactionData[i]?.control_owner_response_comment);
      switchRes.push(props?.transactionData[i]?.response_description);
    }
    setCommentsResponse(comments);
    setSwitchsResponse(switchRes);
    setInitialCommentsResponse(comments);
    setSwitchsInitialResponse(switchRes);
    setFileChosed(props?.fileData);
  }, [props]);

  const handleCommentChange = (id, value) => {
    setDisableFocus(true);
    let commentValue = [...commentsResponse];
    commentValue[id] = value;
    setCommentsResponse(commentValue);
    setFocus(id);
  };
  const handleNotifyClose = () => {
    setNotifyLargeFile(!notifyLargeFile);
  };

  const handleUploadChange = (file) => {
    const files = file;
    let uploads = [...fileChoose];
    console.log(notifyLargeFile);
    for (let i = 0; i < files.length; i++) {
      if (files[i].size <= 20971520) {
        uploads.push(files[i]);
      } else {
        setNotifyLargeFile(!notifyLargeFile);
      }
    }
    setFileChosed(uploads);
  };

  const handleSwitchChange = (e, id, value) => {
    setDisableFocus(false);
    let switchesValue = [...switchesResponse];
    switchesValue[id] = value;
    setSwitchsResponse(switchesValue);
  };

  const disableSubmit = useCallback(() => {
    let c = 0;
    for (let i = 0; i < switchesResponse?.length; i++) {
      if (switchesResponse[i] === "No" && commentsResponse[i] === "") {
        return true;
      }
      if (
        switchesResponse[i] !== switchesInitialResponse[i] &&
        !switchesResponse[i] === "Yes" &&
        commentsResponse[i] !== ""
      ) {
        return false;
      }
      if (commentsResponse[i] !== commentsInitialResponse[i]) {
        return false;
      }
      if (switchesResponse[i] === "Yes") {
        c++;
      }
    }
    if (fileChoose?.length === 0) {
      return true;
    }

    if (c === switchesResponse.length) {
      return false;
    }

    if (fileChoose?.length !== props?.fileData?.length) {
      return false;
    }
    return true;
  }, [switchesResponse, commentsResponse, fileChoose]);

  const submitQuestions = () => {
    let payloadChunk = {};
    let payload = [];
    let today = new Date();
    let mappingData = props?.selectedMapping
      ? props?.selectedMapping
      : props?.userMapping[0];
    for (let i = 0; i < props.questionSets.length; i++) {
      payloadChunk = {
        identify_homo:mappingData?.Indentify_Homo??"",
        transaction_id: props?.transactionData[i]?.transaction_id,
        mapping_id: mappingData?.mapping_id ? mappingData?.mapping_id : "",
        response_description: switchesResponse[i],
        control_owner_response_comment:
        switchesResponse[i] === "Yes" ? "" : commentsResponse[i],
        last_updated_by: mappingData?.user_id ? mappingData?.user_id : "",
        last_updated_date: today.toISOString() ?? "",
      };
      payload.push(payloadChunk);
    }
    fetch(`${baseUrl.local}/transaction/owner/`, {
      method: "PUT",
      headers: {
        email: props?.userEmail,
        token: "test",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        res.text();
        toast.success("Questions submitted successfully", {
          theme: "colored",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
        props?.setMappingOnViewOwner();
        let files = fileChoose.filter((file) => file?.name !== undefined);
        if (files.length > 0) {
          uploadFile(mappingData);
        }
        handleClose();
      })
      .catch((e) => console.log(e));
  };

  const clearAllResponses = () => {
    setCommentsResponse(commentsInitialResponse);
    setSwitchsResponse(switchesInitialResponse);
    if (props?.fileData) {
      setFileChosed(props?.fileData);
    } else {
      setFileChosed([]);
    }
  };

  const readFile = (e) => {
    e.preventDefault();
    const files = e.target.files;
    let uploads = [...fileChoose];
    for (let i = 0; i < files.length; i++) {
      if (files[i].size <= 20971520) {
        uploads.push(files[i]);
      } else {
        setNotifyLargeFile(!notifyLargeFile);
      }
    }
    setFileChosed(uploads);
    e.target.value = "";
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

  const uploadFile = (mappingData) => {
    let today = new Date();
    let files = fileChoose.filter((file) => file?.name !== undefined);
    let formdata = new FormData();
    for (let i = 0; i < files.length; i++) {
      formdata.append("file_name", files[i], files[i].name);
    }
    formdata.append(
      "file_path",
      `eGOV/${mappingData?.cluster}/${mappingData.mco}/${mappingData.bu}/${mappingData.country_name}/${mappingData.executing_month}/${mappingData.executing_year}/${mappingData.process}/${mappingData.control}/${mappingData.Performance_locations}/`
    );
    formdata.append(
      "mapping_id",
      mappingData?.mapping_id ? mappingData?.mapping_id : ""
    );
    formdata.append("uploaded_on", today.toISOString());
    formdata.append(
      "uploaded_by",
      mappingData?.user_id ? mappingData?.user_id : ""
    );

    fetch(`${baseUrl.local}/file/upload/`, {
      method: "POST",
      headers: {
        email: props?.userEmail,
        token: "test",
      },
      body: formdata,
      redirect: "follow",
    })
      .then((res) => {
        setFileChosed([]);
        //  props.setMappingOnViewOwner();
      })
      .catch((e) => console.log(e));
  };

  const deleteFile = (deleteFile) => {
    //e.preventDefault();
    let uploads = [...fileChoose];
    for (let i = 0; i < uploads.length; i++) {
      if (deleteFile === uploads[i]) {
        uploads.splice(i, 1);
      }
    }
    setFileChosed(uploads);
    if (deleteFile?.link_id) {
      fetch(`${baseUrl.local}/file/delete/?link_id=${deleteFile?.link_id}`, {
        method: "DELETE",
        headers: {
          email: props?.userEmail,
          token: "test",
        },
      })
        .then((res) => {
          console.log(res);
        })
        .catch((e) => console.log(e));
    }
  };

  const deleteFileAll = () => {
    setFileChosed(props?.fileData);
  };

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

  return (
    <div className="mb-10">
      {(() => {
        if (props?.userMapping.length === 0) {
          return (
            <div className="mt-44 text-center">
              <div className="relative left-1/2 -ml-10">
                <img src="doc-success.png" alt="img" />
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
            <div className="">
              <div className="pt-4 pb-4"></div>
              <div className="flex items-center">
                <p className="pb-4 text-2xl font-bold">Questions</p>
                <span className="pb-4 px-5 text-sm font-semibold text-slate">
                  Last update on{" "}
                  {getFormatedDate(
                    props?.transactionData[0]?.control_owner_comment_date
                  )}
                </span>
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
                      <div className="flex w-full justify-between ">
                        <div className="w-1/2 bg-reviewercommentbackdrop mx-4 mr-4 rounded-md border-4 border-reviewercommentborder ">
                          <div className="items-center justify-between leading-tight p-2 md:p-4">
                            <div className="flex ">
                              <p className="text-sm font-semibold text-black mr-12">
                                Reviewer's response
                              </p>
                              <p className="text-sm font-semibold text-black mr-12">
                                Reviewer's comment
                              </p>
                              <p className="text-sm font-semibold text-slate">
                                {props?.transactionData[q.question_id - 1]
                                  ?.control_reviewer_comment_date &&
                                  getFormatedDate(
                                    props?.transactionData[q.question_id - 1]
                                      ?.control_reviewer_comment_date
                                  )}{" "}
                              </p>
                            </div>
                            <div className="flex mt-2">
                              <p className="text-xs font-semibold text-black">
                                {props?.transactionData &&
                                props?.transactionData[q.question_id - 1]
                                  ?.control_review_approval ? (
                                  <div className="flex">
                                    {props?.transactionData[q.question_id - 1]
                                      ?.control_review_approval ===
                                    "Approve" ? (
                                      <i className="mr-1 text-yesgreendefault text-lg bx bxs-check-circle"></i>
                                    ) : (
                                      <i className="mr-1 text-nored text-lg bx bxs-x-circle"></i>
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
                                  <p className="mt-2 mr-44">---</p>
                                )}
                              </p>
                              <p className="text-xs font-normal text-black">
                                {props?.transactionData && (
                                  <p className="mt-1.5 xl:-ml-10 2xl:ml-1">
                                    {props?.transactionData[q.question_id - 1]
                                      ?.control_reviewer_response_comment
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
                                  ?.master_comment_date &&
                                  getFormatedDate(
                                    props?.transactionData[q.question_id - 1]
                                      ?.master_comment_date
                                  )}{" "}
                              </p>
                            </div>
                            <div className="flex mt-2">
                              <p className="text-xs font-semibold text-black">
                                {props?.transactionData &&
                                props?.transactionData[q.question_id - 1]
                                  ?.master_approval ? (
                                  <div className="flex">
                                    {props?.transactionData[q.question_id - 1]
                                      ?.master_approval === "Approve" ? (
                                      <i className="mr-1 text-yesgreendefault text-lg bx bxs-check-circle"></i>
                                    ) : (
                                      <i className="mr-1 text-nored text-lg bx bxs-x-circle"></i>
                                    )}
                                    <p className="mt-1.5 mr-28">
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
                              <p className="text-xs font-normal text-black">
                                {props?.transactionData && (
                                  <p className="mt-1.5 xl:-ml-11 2xl:-ml-3">
                                    {props?.transactionData[q.question_id - 1]
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

                      <div className="flex items-center justify-between pl-6 py-3">
                        <div className="text-xl flex justify-center">
                          <div className="form-check form-check-inline mr-10">
                            <input
                              className="form-check-input form-check-input appearance-none rounded-full h-5 w-5 border border-yesgreendefault bg-yesgreendefault checked:bg-white checked:border-[5px] checked:border-yesgreen focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                              type="radio"
                              disabled={!ifConrolNotCompleted}
                              name={q?.question_id}
                              checked={
                                switchesResponse[q?.question_id - 1] === "Yes"
                              }
                              onChange={(e) =>
                                handleSwitchChange(e, q.question_id - 1, "Yes")
                              }
                            />
                            <label
                              className="form-check-label inline-block text-gray-800"
                              for="inlineRadio10"
                            >
                              Yes
                            </label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input form-check-input appearance-none rounded-full h-5 w-5 border border-noreddefault bg-noreddefault checked:bg-white checked:border-[5px] checked:border-nored focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                              type="radio"
                              disabled={!ifConrolNotCompleted}
                              name={q?.question_id}
                              checked={
                                switchesResponse[q?.question_id - 1] === "No"
                              }
                              onChange={(e) =>
                                handleSwitchChange(e, q.question_id - 1, "No")
                              }
                            />
                            <label
                              className="form-check-label inline-block text-gray-800"
                              for="inlineRadio20"
                            >
                              No
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="mx-4 mb-4">
                        {switchesResponse &&
                          switchesResponse[q.question_id - 1] === "No" && (
                            <input
                              className="appearance-none block w-full h-12 bg-gray-200 text-gray-700 border border-nored rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                              id="grid-last-name"
                              type="text"
                              placeholder="Enter Comment here"
                              autoFocus={q.question_id - 1 === focus}
                              variant="outlined"
                              value={commentsResponse[q.question_id - 1] ?? ""}
                              disabled={!ifConrolNotCompleted}
                              onChange={(e) =>
                                handleCommentChange(
                                  q.question_id - 1,
                                  e.target.value
                                )
                              }
                              style={
                                commentsResponse[q.question_id - 1] !== ""
                                  ? { border: "1px solid #E5E5E5" }
                                  : {}
                              }
                            />
                          )}
                      </div>
                    </div>
                  ))}
              </div>

              <div className="pt-4">
                <div className="w-full ">
                  {ifConrolNotCompleted && (
                    <label className="flex relative  shadow-lg justify-center w-full h-28 px-4 transition bg-white border-2 border-buttonblue border-dashed rounded-md appearance-none hover:border-gray-400 focus:outline-none">
                      {/* <FileUploader
                    multiple={true}
                    handleChange={handleUploadChange}  
                    name="file"
                    children={
                      
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
                          
                            Click to upload
                            <span className="text-black">
                              {" "}
                              or drag and drop
                            </span>
                          
                        </span>
                      
                    }
                  /> */}
                      <input
                        type="file"
                        id="upload"
                        onChange={readFile}
                        multiple
                        className="font-medium text-buttonblue cursor-pointer w-full"
                      />
                      <span className="flex items-center space-x-2 absolute top-10">
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
                        <span className="text-darkblue1 font-bold">
                          Click to upload
                          <span className="text-black"> or drag and drop</span>
                        </span>
                      </span>
                    </label>
                  )}
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

                          {ifConrolNotCompleted && (
                            <div
                              className="mr-2 hover:cursor-pointer text-black  hover:text-nored"
                              onClick={() => deleteFile(file)}
                            >
                              <i className="mt-4 bx bxs-trash"></i>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
                {ifConrolNotCompleted && fileChoose && fileChoose.length > 0 && (
                  <div
                    className="flex float-right font-bold hover:cursor-pointer"
                    onClick={deleteFileAll}
                  >
                    <i className="text-md mt-4 bx bxs-trash text-nored"></i>
                    <p className="text-md mt-3 ml-4 text-nored">
                      Remove all attachments
                    </p>
                  </div>
                )}
              </div>
              {ifConrolNotCompleted && (
                <div className="pt-4 w-full flex justify-between">
                  <div>
                    <button
                      onClick={clearAllResponses}
                      className="bg-white border-2 border-buttonblue hover:bg-darkblue1 hover:text-white text-buttonblue py-2 px-6 rounded-lg active:bg-darkblue2 active:shadow-lg transition duration-150 ease-in-out"
                    >
                      Reset
                    </button>
                  </div>
                  <div>
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
                              Are you sure you want to submit?
                            </h3>
                            <p className="mb-5 text-sm">
                              Your response will share with the reviewer
                            </p>

                            <button
                              data-modal-toggle="popup-modal"
                              type="button"
                              className="text-gray-500 bg-white focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                              onClick={handleClose}
                            >
                              Go Back
                            </button>
                            <button
                              data-modal-toggle="popup-modal"
                              type="button"
                              className="ml-10 text-white bg-buttonblue hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                              onClick={submitQuestions}
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
                        notifyLargeFile === true ? "hidden" : ""
                      } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 md:inset-0 h-modal md:h-full`}
                    >
                      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                          <div className="flex justify-end p-2">
                            <button
                              type="button"
                              className="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                              data-modal-toggle="popup-modal"
                              onClick={handleNotifyClose}
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
                              File size more than 20 MB cannot be uploaded.
                            </h3>
                            <p className="mb-5 text-sm">{"  "}</p>
                            <button
                              data-modal-toggle="popup-modal"
                              type="button"
                              className="text-gray-500 bg-white focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                              onClick={handleNotifyClose}
                            >
                              Go Back
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        }
      })()}
    </div>
  );
}
