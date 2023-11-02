export const formatDate=(date) =>{
    var d = new Date(date),
      month = "" + d.getMonth(),
      year = d.getFullYear();
      if(month==="0"){
        month="12";
        year=year-1;
      }
    if (month.length < 2) month = "0" + month;
    return [year, month].join("-");
  }
  export const formatDateView=(date)=> {
    var d = new Date(date),
      month = "" + d.getMonth(),
      year = d.getFullYear();
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

    return [monthNames[month], year].join(", ");
  }