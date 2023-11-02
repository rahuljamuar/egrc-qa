import React, { useState, useEffect, useCallback } from "react";
import { baseUrl } from "../../Shared/common";
import { toast } from "react-toastify";
import { FileUploader } from "react-drag-drop-files";
import "./styles.css";

export default function QuestionCard(props) {
  const [commentsResponse, setCommentsResponse] = useState([]);
  const [switchesResponse, setSwitchsResponse] = useState([]);
  const [commentsInitialResponse, setInitialCommentsResponse] = useState([]);
  const [switchesInitialResponse, setSwitchsInitialResponse] = useState([]);
  const [homogeneousControls, setHomogeneousControls] = useState([]);
  const [fileChoose, setFileChosed] = useState([]);
  const [focus, setFocus] = useState();
  const [markAllAsYes, setMarkAllAsYes] = useState(false);
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(0);
  const [submitAsHomogeneous, setSubmitAsHomogeneous] = useState(false);
  const [notifyLargeFile, setNotifyLargeFile] = useState(true);
  //Initially progress = 100%

  const handleClose = () => {
    setShow(!show);
  };
  const handleNotifyClose = () => {
    setNotifyLargeFile(!notifyLargeFile);
  };

  useEffect(() => {
    let comments = [];
    let switchRes = [];
    for (let i = 0; i < props?.questionSets?.length; i++) {
      comments.push("");
      switchRes.push("");
    }
    setCommentsResponse(comments);
    setSwitchsResponse(switchRes);
    setInitialCommentsResponse(comments);
    setSwitchsInitialResponse(switchRes);
    if (props?.selectedMapping?.Indentify_Homo) {
      let homogeneous = props?.userMapping?.filter(
        (mapping) =>
          mapping.Indentify_Homo === props?.selectedMapping?.Indentify_Homo
      );
      console.log(homogeneousControls);
      setHomogeneousControls(homogeneous);
    }
    setMarkAllAsYes(false);
  }, [props]);

  useEffect(() => {
    let noOfResponses = 0;
    for (let i = 0; i < switchesResponse.length; i++) {
      if (switchesResponse?.length >= progress && switchesResponse[i] !== "") {
        noOfResponses++;
      }
    }
    setProgress(noOfResponses);
  }, [switchesResponse]);

  useEffect(() => {
    setFileChosed([]);
  }, [props?.selectedMapping]);

  const handleCommentChange = (id, value) => {
    let commentValue = [...commentsResponse];
    commentValue[id] = value;
    setCommentsResponse(commentValue);
    setFocus(id);
  };

  const handleSwitchChange = (e, id, value) => {
    let noOfResponses = 0;
    setMarkAllAsYes(false);
    let switchesValue = [...switchesResponse];
    switchesValue[id] = value;
    setSwitchsResponse(switchesValue);

    //setCommentsResponse(commentsResponse)
  };
  const disableSubmit = () => {
    let noOfYesResponse = 0;
    let noOfCommentsResponse = 0;
    for (let i = 0; i < switchesResponse.length; i++) {
      if (switchesResponse[i] == "Yes") {
        noOfYesResponse++;
      }
    }
    for (let i = 0; i < commentsResponse.length; i++) {
      if (commentsResponse[i] && commentsResponse[i].comments !== "") {
        noOfCommentsResponse++;
      }
    }
    if (fileChoose.length > 0 && noOfYesResponse === switchesResponse?.length) {
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
    props?.changeMappingAfterSubmit(newMapping);
    toast.success("Questions submitted successfully", {
      theme: "colored",
    });
    props?.fetchMappingData();
  };

  const submitQuestions = (mappingData) => {
    let payloadChunk = {};
    let payload = [];
    let today = new Date();
    let newMapping = props?.userMapping;
    for (let i = 0; i < props.questionSets.length; i++) {
      payloadChunk = {
        identify_homo:mappingData?.Indentify_Homo??"",
        mapping_id: mappingData?.mapping_id ? mappingData?.mapping_id : "",
        country_id: mappingData?.country_id ? mappingData?.country_id : "",
        user_id: mappingData?.user_id ? mappingData?.user_id : "",
        control_id: mappingData?.control_id ? mappingData?.control_id : "",
        task_no: props?.questionSets[i]?.taskno
          ? props?.questionSets[i]?.taskno
          : "",
        response_no:
          mappingData?.country_id && mappingData?.control_id
            ? mappingData?.country_id +
              mappingData?.control_id +
              props?.questionSets[i]?.taskno
            : "",
        response_description: switchesResponse[i],
        control_owner_response_comment:
          switchesResponse[i] === "Yes" ? "" : commentsResponse[i],
        mgr_id: mappingData?.mgr_id,
        response_date: today.toISOString(),
        executing_month: mappingData?.executing_month
          ? mappingData?.executing_month
          : "",
        executing_year: mappingData?.executing_year
          ? mappingData?.executing_year
          : "",
        last_updated_by: mappingData?.user_id ? mappingData?.user_id : "",
        last_updated_date: today.toISOString(),
        submitted_homo: submitAsHomogeneous ? 1 : 0,
      };
      payload.push(payloadChunk);
    }
    fetch(`${baseUrl.local}/transaction/`, {
      method: "POST",
      headers: {
        email: props?.userEmail,
        token: "test",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        res.json().then((data) => {
          if (res.status === 200) {
            if (fileChoose.length > 0) {
              uploadFile(mappingData?.mapping_id);
            }
            if (!submitAsHomogeneous) {
              toast.success("Questions submitted successfully", {
                theme: "colored",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
              });
            }
            setTimeout(()=>props.setMappingByDate({
              month: data[0]?.executing_month,
              year: data[0]?.executing_year,
            }),[2000]);
            clearAllResponses();
          } else {
            toast.error("Submition unsuccessfully", {
              theme: "colored",
              autoClose: 5000,
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

  const uploadFile = (mappingId) => {
    let mappingData = props?.selectedMapping
      ? props?.selectedMapping
      : props?.mappingData[0];
    let today = new Date();
    let files = fileChoose;
    let formdata = new FormData();
    for (let i = 0; i < files.length; i++) {
      formdata.append("file_name", files[i], files[i].name);
    }
    formdata.append(
      "file_path",
      `eGOV/${mappingData?.cluster}/${mappingData.mco}/${mappingData.bu}/${mappingData.country_name}/${mappingData.executing_month}/${mappingData.executing_year}/${mappingData.process}/${mappingData.control}/${mappingData.Performance_locations}/`
    );
    formdata.append("mapping_id", mappingId);
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
        res.json().then((data) => {
          if (res.status === 200) {
            let newMapping = props?.userMapping;
            newMapping = newMapping.filter(
              (item) => item.mapping_id !== mappingData.mapping_id
            );
            props?.changeMappingAfterSubmit(newMapping);
            setFileChosed([]);
          } else {
            toast.error("Files upload unsuccessfull ", {
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
  };

  const clearAllResponses = () => {
    let tempSwitch = [];
    let tempComment = [];
    for (let i = 0; i < switchesResponse.length; i++) {
      tempSwitch.push("");
      tempComment.push("");
    }
    setCommentsResponse(tempComment);
    setSwitchsResponse(tempSwitch);
    setFileChosed([]);
    setProgress(0);
    setMarkAllAsYes(false);
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

  const handleUploadChange = (file) => {
    const files = file;
    let uploads = [...fileChoose];
    for (let i = 0; i < files.length; i++) {
      if (files[i].size <= 20971520) {
        uploads.push(files[i]);
      } else {
        setNotifyLargeFile(!notifyLargeFile);
      }
    }
    setFileChosed(uploads);
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
  };

  const deleteFileAll = () => {
    setFileChosed([]);
  };

  const markAllYes = (value) => {
    let tempSwitch = [];
    if (value) {
      setMarkAllAsYes(true);
      for (let i = 0; i < switchesResponse.length; i++) {
        tempSwitch.push("Yes");
      }
      // If all yes, then progress is 100%
    } else {
      setMarkAllAsYes(false);
      for (let i = 0; i < switchesResponse.length; i++) {
        tempSwitch.push("");
      }
      // 0 otherwise
      //setProgress(0);
    }
    setSwitchsResponse(tempSwitch);
  };
  const calculatePercentage = useCallback(() => {
    let c = 0;
    for (let i = 0; i < switchesResponse.length; i++) {
      if (switchesResponse[i] !== "") {
        c++;
      }
    }
    return (c / props?.questionSets?.length) * 100;
  }, [switchesResponse]);

  return (
    <div className="mb-10">
      {(() => {
        if (props?.userMapping?.length === 0) {
          return (
            <div className="mt-44 text-center">
              <div className="flex items-center justify-center mr-4">
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
              <div
                className="w-4/6 fixed bg-progress"
                style={{ width: "85vw" }}
              >
                <div className="my-8 mr-2 xl:mr-40 2xl:mr-5 md:mr-28 bg-lightblue3 border border-buttonblue rounded top-8">
                  <div
                    className={
                      progress === 0
                        ? "bg-darkblue1 text-xs font-medium text-darkblue1  text-center p-1 rounded"
                        : "text-white bg-darkblue1 text-xs font-medium  text-center p-1 rounded"
                    }
                    style={{ width: `${calculatePercentage()}%` }}
                  >
                    <p className="text-center text-s pl-2">
                      0{progress}/0{props?.questionSets?.length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="py-9">
                {/*added condition rendering for homogeneous card */}
                {props?.selectedMapping?.Indentify_Homo &&
                  homogeneousControls?.length > 1 && (
                    <div className="mt-16 flex h-full items-center border-2 border-darkgold bg-lightgold p-4 rounded-lg homogeneous">
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
                          className="xl:text-base xl:pt-4 2xl:text-lg text-slate font-bold"
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
                <p className="pb-4 mt-8 text-2xl font-bold">Questions</p>
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

                      <div className="flex items-center justify-between pl-6 py-3">
                        <div className="text-xl flex justify-center">
                          <div className="form-check form-check-inline mr-10">
                            <input
                              className="form-check-input form-check-input appearance-none rounded-full h-5 w-5 border border-yesgreendefault bg-yesgreendefault checked:bg-white checked:border-[5px] checked:border-yesgreen focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                              type="radio"
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
                              style={
                                commentsResponse[q.question_id - 1] !== ""
                                  ? { border: "1px solid #E5E5E5" }
                                  : {}
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
                  ))}
              </div>
              <div className="pl-6">
                <input
                  className="form-check-input h-5 w-5 border border-slate rounded-sm bg-white checked:bg-darkblue1 checked:border-darkblue1 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                  type="checkbox"
                  id="flexCheckDefault"
                  onChange={(e) => markAllYes(e.target.checked)}
                  checked={markAllAsYes}
                />
                <label className="text-xl" for="checkbox">
                  Mark all as Yes
                </label>
              </div>
              <div className="pt-4">
                <div id="FileUpload" className="w-full">
                <label className="flex relative shadow-lg justify-center w-full h-28 px-4 transition bg-white border-2 border-buttonblue border-dashed rounded-md appearance-none hover:border-gray-400 focus:outline-none">
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

                  {fileChoose &&
                    fileChoose.map((file) => (
                      <div className="flex my-4 p-4 w-full bg-lightblue3 text-black rounded-lg shadow-xl justify-between">
                        <div className="flex items-center">
                          <div className="flex flex-col">
                            <p className="font-bold flex items-center">
                              <i className="px-4 bx bx-file-blank text-2xl"></i>
                              {file?.name}
                            </p>
                            <p className="ml-14">
                              {Math.round(file?.size / 1024)} kb
                            </p>
                          </div>
                        </div>
                        <div className="flex text-white">
                          <div className="mr-4">
                            <i
                              className="mt-4 hover:cursor-pointer text-black  hover:text-yesgreen"
                              onClick={() => window.open(file, "")}
                            ></i>
                          </div>

                          <div
                            className="mr-2 hover:cursor-pointer text-black  hover:text-nored"
                            onClick={() => deleteFile(file)}
                          >
                            <i className="mt-4 bx bxs-trash"></i>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                {fileChoose && fileChoose.length > 0 && (
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
                            Your response will be shared with the reviewer
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
            </div>
          );
        }
      })()}
    </div>
  );
}
