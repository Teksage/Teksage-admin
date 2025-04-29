import moment from "moment";

export const dateFormat=(dateText:string, dateFormat:string)=>{
    let text;
    if (moment(dateText).format(dateFormat) !== "Invalid date") {
      text = moment(dateText).format(dateFormat);
    } else {
      text = moment(new Date()).format(dateFormat);
    }
    return text;
}