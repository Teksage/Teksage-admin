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
};

type Action =
  { type: "setAuth"; payload: boolean }
  | { type: "login"; payload: Record<string, any> }
  | { type: "setusers"; payload: any[] }
  | { type: "setnotification"; payload: NotificationState }
  | { type: "setloading"; payload: boolean };

export const reducer: Reducer<AppState, Action> = (state = initialState, action) => {
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

    default:
      return state;
  }
}