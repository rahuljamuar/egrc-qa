import { atom } from "recoil";

export const popUpState = atom({
  key: "popUpState", // unique ID (with respect to other atoms/selectors)
  default: true, // default value (aka initial value)
});
