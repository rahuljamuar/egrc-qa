import React, { useState, useEffect } from "react";
import { baseUrl, getToster,updateFieldsArray } from "../Shared/common";

export default function DataChart(props) {
  const [fileChoose, setFileChosed] = useState([]);
  const [notifyLargeFile, setNotifyLargeFile] = useState(true);
  const [tabindex, setTabindex] = useState(0);
  const [file, setFile] = useState(false);
  const [dropDowns, setDropDowns] = useState();
  const [dropDownKeys, setDropDownKeys] = useState();
  const [selectedValues, setSelectedValues] = useState({});
  const [dataDownload, setDataDownload] = useState({
    dataDownloadFile: "",
    dataDownloadfilename: "",
  });
  const [urlForUpdate, setUrlForUpdate] = useState("");
  const [urlForCreate, setUrlForCreate] = useState("");
  const [page,setPage]=useState("Control Owner");

  const dropDownApiCall = (url) => {
    fetch(`${baseUrl.local}/${url}`, {
      method: "GET",
      headers: {
        email: props?.userEmail,
        token: "test",
      },
    }).then((res) => {
      res.json().then((data) => {
        setDropDownKeys(Object.keys(data));
        getDropdowns(data, Object.keys(data));
      });
    });
  };

  const getDownloadLink = (prepareUrl) => {
    fetch(`${baseUrl.local}/${prepareUrl}`, {
      method: "GET",
      headers: {
        email: props?.userEmail,
        token: "test",
      },
    }).then((res) => {
      res.json().then((data) => {
        console.log(data);
        setDataDownload({
          dataDownloadFile: data?.content,
          dataDownloadfilename: data?.file_name,
        });
      });
    });
  };

  const updateFields = () => {
    let files = fileChoose;
    let formdata = new FormData();
    formdata.append("file_name", files[0], files[0].name);
    fetch(`${baseUrl.local}${urlForUpdate}`, {
      method: "PUT",
      headers: {
        email: props?.userEmail,
        token: "test",
      },
      body: formdata,
      redirect: "follow",
    }).then((res) => {
      res.json().then((data) => {
        console.log(data);
        if (data === "Success") {
          setFileChosed([]);
          getToster("success", "Fields updated successfully");
        } else {
          getToster("error", "Fields did not update");
        }
      });
    });
  };
  const createFields = () => {
    let files = fileChoose;
    let formdata = new FormData();
    formdata.append("file_name", files[0], files[0].name);
    fetch(`${baseUrl.local}${urlForCreate}`, {
      method: "POST",
      headers: {
        email: props?.userEmail,
        token: "test",
      },
      body: formdata,
      redirect: "follow",
    }).then((res) => {
      res.json().then((data) => {
        if (data === "Success") {
          setFileChosed([]);
          getToster("success", "Fields created successfully");
        } else {
          getToster("error", "Fields were not created");
        }
      });
    });
  };

  const getDropdowns = (data, keys) => {
    let dropdownValues = [];
    for (let i = 0; i < keys.length; i++) {
      dropdownValues.push(data[keys[i]]);
    }
    setDropDowns(dropdownValues);
  };

  const getOptionsSelected = (value, key) => {
    const selection = { ...selectedValues };
    selection[key] = value;
    setSelectedValues(selection);
  };

  React.useEffect(() => {
    setSelectedValues({});
    setDataDownload({ dataDownloadFile: "", dataDownloadfilename: "" });
    setPage(updateFieldsArray[props?.selectedField]?.name);
    switch (props?.selectedField) {
      case 0: {
        setUrlForCreate("/owner/owner_details/");
        setUrlForUpdate("/owner/owner_details/");
        return dropDownApiCall(`/utility/owner_update_dropdown/`);
      }
      case 1: {
        setUrlForCreate("/reviewer/reviewer_details/");
        setUrlForUpdate("/reviewer/reviewer_details/");
        return dropDownApiCall("/utility/reviewer_update_dropdown/");
      }
      case 2: {
        setUrlForCreate("/control/control_details/");
        setUrlForUpdate("/control/control_details/");
        return dropDownApiCall("/utility/control_dropdown/");
      }
      case 3: {
        setUrlForCreate("/question/question_details/");
        setUrlForUpdate("/question/question_details/");
        return dropDownApiCall("/utility/question_dropdown/");
      }
      case 4: {
        setUrlForCreate("/country/country_details/");
        setUrlForUpdate("/country/country_details/");
        return dropDownApiCall("/utility/country_dropdown/");
      }
      default: {
        setUrlForCreate("/owner/owner_details/");
        setUrlForUpdate("/owner/owner_details/");
        return dropDownApiCall("/utility/owner_update_dropdown/");
      }
    }
  }, [props?.selectedField]);

  const prepareUrl = React.useMemo(() => {
    switch (props?.selectedField) {
      case 0: {
        return `/owner/owner_details/admin/?functions=${selectedValues.functions}&team=${selectedValues?.team}`;
      }
      case 1: {
        return `/reviewer/reviewer_details/admin/?status=${selectedValues.status}`;
      }
      case 2: {
        return `/control/control_details/?control=${selectedValues?.control}&performance_location={selectedValues?.performance_location}`;
      }
      case 3: {
        return `/question/question_details/?set=${selectedValues?.set}&theme=${selectedValues?.theme}`;
      }
      case 4: {
        return `/country/country_details/?country=${selectedValues?.country}&mco=${selectedValues?.mco}`;
      }
      default: {
        return `/owner/owner_details/admin/?functions=${selectedValues.functions}&team=${selectedValues?.team}`;
      }
    }
  }, [props?.selectedField, selectedValues]);

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

  function dataURLtoFile() {
    const linkSource = dataDownload.dataDownloadFile;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = dataDownload.dataDownloadfilename;
    downloadLink.click();
  }
  
  return (
    <div>
      <ul className="mt-7 flex">
        <li className="-mb-px mr-4" onClick={() => setTabindex(0)}>
          <p
            className={`${
              tabindex === 0
                ? "text-darkblue1 underline underline-offset-8 decoration-2"
                : "text-black no-underline"
            } inline-block py-2 px-0.5 font-bold text-xl hover:cursor-pointer`}
          >
            Update
          </p>
        </li>
        <li className="mr-0" onClick={() => setTabindex(1)}>
          <p
            className={`${
              tabindex === 1
                ? "text-darkblue1 underline underline-offset-8 decoration-2"
                : "text-black no-underline"
            } inline-block py-2 px-0.5 font-bold text-xl hover:cursor-pointer`}
          >
            Create
          </p>
        </li>
      </ul>
      <>{page}</>
      {tabindex === 0 ? (
        <>
          <div>
            <div className="pt-7">
              <div id="FileUpload" className="w-full">
                <label className="shadow-lg flex relative justify-center w-full h-28 px-4 transition bg-white border-2 border-buttonblue border-dashed rounded-md appearance-none hover:border-gray-400 focus:outline-none">
                  <input
                    type="file"
                    id="upload"
                    onChange={readFile}
                    multiple
                    accept=".xslv,.xlsx,.csv"
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
                    <div className="flex my-4 p-4 w-full bg-gray border border-white text-black rounded-lg shadow-lg justify-between">
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
                <div className="flex justify-end">
                    <button
                      className="flex w-40 mt-4 justify-center bg-darkblue1 hover:bg-darkblue1 text-white font-bold py-2 px-4 border-b-4 border-darkblue2 hover:border-darkblue2 rounded-lg active:bg-darkblue2 hover:shadow-lg transition duration-150 ease-in-out"
                      onClick={() => updateFields()}
                    >
                      Update
                    </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 w-full flex justify-between">
            <label className="flex shadow-lg relative justify-center w-full h-32 px-4 transition bg-white border-2 border-buttonblue border-dashed rounded-md appearance-none hover:border-gray-400 focus:outline-none">
              <div className="w-2/3 flex space-x-6">
                <div className="relative inline-block text-left">
                  <div className="">
                    <div>
                      <p className="text-2xl font-bold -mt-4 bg-white w-16 text-decoration-line: none">
                        Filter
                      </p>
                    </div>
                    <div className="flex justify-centre items-center">
                      {dropDownKeys &&
                        dropDownKeys?.map((key, index) => (
                          <select
                            className="w-100 bg-gray border border-white shadow-lg text-gray-900 font-bold xl:text-sm 2xl:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 ml-5"
                            onChange={(e) =>
                              getOptionsSelected(e.target.value, key)
                            }
                          >
                            <option value="">
                              Select {dropDownKeys[index]}
                            </option>
                            {dropDowns &&
                              dropDowns[index]?.map((data) => (
                                <option
                                  value={
                                    data?.status_code ||
                                    data?.country_id ||
                                    data
                                  }
                                >
                                  {data?.country_name ||
                                    data?.status_value ||
                                    data}
                                </option>
                              ))}
                          </select>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-2/3 mt-4">
                <button
                  type="button"
                  id="bt"
                  className="w-40 block xl:ml-36 2xl:ml-16 mr-auto md:mr-auto shadow-lg border border-white mt-4 xl:mt-0 bg-buttonblue xl:mr-auto text-white py-2 px-3 rounded-lg active:bg-darkblue2 hover:shadow-lg transition duration-150 ease-in-out"
                  onClick={() => getDownloadLink(prepareUrl)}
                >
                  Apply
                </button>
              </div>
            </label>
          </div>

          <div className="mt-8 w-full justify-center flex">
            <div className="w-96">
              <button
                disabled={dataDownload?.dataDownloadFile === ""}
                onClick={() => dataURLtoFile()}
                className={`${
                  dataDownload?.dataDownloadFile === ""
                    ? "bg-gray"
                    : "bg-yesgreen"
                } w-full justify-center border border-white shadow-lg hover:bg-gray-400 text-white font-bold py-2 px-2 rounded-lg inline-flex items-center`}
              >
                <svg
                  className="fill-white w-4 h-4 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" class />
                </svg>
                <span> Click Here To Download File </span>
              </button>
            </div>
          </div>

          <div className="mt-20 w-full flex">
            <div className="2xl:max-w-xl pt-16 -mt-14 xl:max-w-sm rounded overflow-hidden shadow-lg ">
              <img
                className="w-full"
                src="girl.png"
                alt="Sunset in the mountains"
              />
            </div>
            <div className="2xl:max-w-full border border-white ml-4 -mt-14 xl:max-w-xl rounded overflow-hidden shadow-lg">
              <div className="px-6 py-2">
                <div className="font-bold text-3xl mb-4">Instructions :</div>
                <p className="text-darkgray text-base font-bold  list-disc">
                  1. Please apply the appropriate filter value and select
                  download button to extract the data and take the right action
                  (update/delete). <br /> <br />
                  2. The Yellow highlighted column will be auto populated.{" "}
                  <br /> <br />
                  3. The Green highlighted column needs to modify by the user .
                  <br /> <br />
                  4. Post the required action (update/delete), please upload the
                  file and click on the Upload button.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : tabindex === 1 ? (
        <>
          <div>
            <div className="pt-7">
              <div id="FileUpload" className="w-full">
                <label className="shadow-lg flex relative justify-center w-full h-28 px-4 transition bg-white border-2 border-buttonblue border-dashed rounded-md appearance-none hover:border-gray-400 focus:outline-none">
                  <input
                    type="file"
                    id="upload"
                    onChange={readFile}
                    multiple
                    accept=".xslv,.xlsx,.csv"
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
                    <div className="flex my-4 p-4 w-full bg-gray border border-white text-black rounded-lg shadow-lg justify-between">
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
                <div className="flex justify-end">
                  <button className="flex w-40 mt-4 justify-center bg-darkblue1 hover:bg-darkblue1 text-white font-bold py-2 px-4 border-b-4 border-darkblue2 hover:border-darkblue2 rounded-lg"
                  onClick={()=>createFields()}>
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 w-full justify-center flex">
            <div className="w-96">
              <button className="bg-yesgreen w-full justify-center border border-white shadow-lg hover:bg-gray-400 text-white font-bold py-2 px-2 rounded-lg inline-flex items-center">
                <svg
                  className="fill-white w-4 h-4 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" class />
                </svg>
                <span> Click Here To Download File </span>
              </button>
            </div>
          </div>

          <div className="mt-20 w-full flex">
            <div className="2xl:max-w-xl pt-16 -mt-14 xl:max-w-sm rounded overflow-hidden shadow-lg ">
              <img
                className="w-full"
                src="girl.png"
                alt="Sunset in the mountains"
              />
            </div>
            <div className="2xl:max-w-full border border-white ml-4 -mt-14 xl:max-w-xl rounded overflow-hidden shadow-lg">
              <div className="px-6 py-2">
                <div className="font-bold text-3xl mb-4">Instructions :</div>
                <p className="text-darkgray text-base font-bold  list-disc">
                  1. Please apply the appropriate filter value and select
                  download button to extract the data and take the right action
                  (update/delete). <br /> <br />
                  2. The Yellow highlighted column will be auto populated.{" "}
                  <br /> <br />
                  3. The Green highlighted column needs to modify by the user .
                  <br /> <br />
                  4. Post the required action (update/delete), please upload the
                  file and click on the Upload button.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
