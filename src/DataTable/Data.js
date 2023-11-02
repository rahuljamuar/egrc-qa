import React, {useEffect, useState } from "react";
import DataTable from "./DataTableSide";
import DataChart from "./DataChart";
import { useRecoilState } from "recoil";
import { sideNavState } from "../atoms/sideNavState";

export default function Data(props) {
  const [isOpen, setIsOpen] = useRecoilState(sideNavState);
  const [selectedField,setSelectedField]=useState(0);

  useEffect(() => {
    document.body.style.zoom = "85%";
  }, []);

  return (
    <div className="flex">
      <div className="absolute w-1/2 lg:w-[30%] 2xl:w-[24%] bg-lightblue overflow-y-auto">
        <DataTable userEmail={props?.userEmail}                        
         adminData={props?.adminData}
         setSelectedField={setSelectedField}
        />
      </div>
      <div
        className={`${
          isOpen === false
            ? "left-[59%] xl:left-[35%] 2xl:left-[29%] lg:w-[68%] 2xl:w-[70%] lg:ml-[-300px]"
            : "left-[45%] xl:left-[28%] 2xl:left-[24%] lg:w-[72%] 2xl:w-[76%] lg:ml-[-230px]"
        } w-1/2 px-14  fixed h-full overflow-y-auto ml-0 xl:ml-0`}
      >
        <DataChart 
        userEmail={props?.userEmail}
        selectedField={selectedField}/>
      </div>
    </div>
  );
}
