import { toast } from "react-toastify";

export const baseUrl = {
  local: "https://uat-server-egrc-turkey.azurewebsites.net/api",
};

export const env = {
  environment: "uat",
};

export const adminDashboard = `https://app.powerbi.com/view?r=eyJrIjoiNzcxNTdlY2ItYjFhYS00YjkyLThkMmEtMTQwYjVlYzExNjA0IiwidCI6ImQyYWY4YjViLTlhN2UtNGM4NS1hM2ZkLWI2OWE2Njk4YjdkNiJ9`;

export const updateFieldsArray = [
  {
    name: "Control Owner",
    fields: ["Functions", "Positions", "Team", "Control Owner"],
  },
  { name: "Control Reviewer", fields: ["Control Manager"] },
  {
    name: "Controls",
    fields: [
      "Control id",
      "Control Name",
      "Control Description",
      "Control Type",
      "Control Automation Level",
      "Control Frequency",
      "Key Non Key",
      "Control Operator",
      "Accountability",
      "Control Evidence Location",
      "Applicable Exmption",
      "Alternate Control",
      "Source",
      "Process",
      "Sub Process",
      "Is Active",
      "Control Tip",
    ],
  },
  {
    name: "Questions",
    fields: [
      "Task No",
      "Set No",
      "Question Id",
      "Question Description",
      "Theme",
    ],
  },
  { name: "Country", fields: ["BU", "Cluster", "User Id", "Active"] },
];

export const getToster=(type,message)=>{
  switch(type){
    case 'success':
      return toast.success(message, {
      theme: "colored",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });
    case 'error':
      return toast.error(message, {
        theme: "colored",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
  }
}