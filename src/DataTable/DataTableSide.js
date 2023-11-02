import { useState, useEffect } from "react";
import {updateFieldsArray} from "../Shared/common"

export default function DataTable(props) {
  const [isVisible, setIsVisible] = useState(0);
  const Visibilitytoggle = (index) => {
    setIsVisible(index);
    props?.setSelectedField(index);
  };

  return (
    <div className="pb-10 w-100" style={{ minHeight: "185vh", height: "auto" }}>
      <div className="">
        <div className="pt-8 pl-8 text-left">
          <p className="text-3xl font-bold">
          Hi,{" "}
          {props?.adminData?.master_name &&
            props?.adminData?.master_name.split(" ")[0]}
          </p>
          <p className="pt-7 text-md font-normal text-slate"></p>
        </div>

        {updateFieldsArray?.map((updateField,index)=><div
          className={
            isVisible === index
              ? "pt-4 mb-4 pb-2 pl-8 bg-darkblue1 text-white shadow-lg"
              : "pt-4 mb-4 pb-2 pl-8 bg-lightblue2 hover:bg-darkblue1 hover:text-white shadow-lg"
          }
          onClick={()=>Visibilitytoggle(index)}
        >
          <div className="text-xl justify-between w-full">
            <p className="flex font-bold w-1/2">{updateField?.name}</p>
          </div>
          <div className="pt-2 flex md:flex-row xl:flex-row flex-col">
            <p className="font-semibold text-darkgray -ml-7 md:ml-0 xl:ml-0 md:flex-row xl:flex-row flex-col">
              Fields which may be updated
            </p>
          </div>
          {updateField?.fields?.map(field=>
            <div className="w-full pt-2 flex font-bold md:flex-row xl:flex-row flex-col ">
            <p className="w-1/2 font-bold">{field}</p>
          </div>)}
        </div>)}
      </div>
    </div>
  );
}
