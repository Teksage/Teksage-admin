import { Reducer } from "redux";

interface NotificationState {
  message: string;
  type: string;
  show: boolean;
}

interface AppState {
  isAuthenticated: boolean;
  userInfo: Record<string, any>;
  users: any[];
  notification: NotificationState;
  isLoading: boolean;
  countriesList: [];
}

const initialState: AppState = {
  isAuthenticated: false,
  userInfo: {},
  users: [],
  notification: {
    message: "",
    type: "",
    show: false,
  },
  isLoading: false,
  countriesList: [], // Initialize as an empty array
};

type Action =
  | { type: "setAuth"; payload: boolean }
  | { type: "login"; payload: Record<string, any> }
  | { type: "setusers"; payload: any[] }
  | { type: "setnotification"; payload: NotificationState }
  | { type: "setloading"; payload: boolean }
  | { type: "setCountriesList"; payload: [] };

export const reducer: Reducer<AppState, Action> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "setAuth":
      return { ...state, isAuthenticated: action.payload };

    case "login":
      return { ...state, userInfo: action.payload };

    case "setusers":
      return { ...state, users: action.payload };

    case "setnotification":
      return { ...state, notification: action.payload };

    case "setloading":
      return { ...state, isLoading: action.payload };

    case "setCountriesList": // Handle the new action
      return { ...state, countriesList: action.payload };

    default:
      return state;
  }
};

// Action creator for setting countriesList
export const setCountriesList:any = (countries: []): Action => ({
  type: "setCountriesList",
  payload: countries,
});