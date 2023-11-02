import { atom } from "recoil";

export const sideNavState = atom({
  key: "sideNavState", // unique ID (with respect to other atoms/selectors)
  default: true, // default value (aka initial value)
});
