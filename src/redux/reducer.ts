import { Reducer } from "redux";

interface NotificationState {
  message: string;
  type: string;
  show: boolean;
}

interface AppState {
  userInfo: Record<string, any>;
  users: any[];
  notification: NotificationState;
  isLoading: boolean;
}

const initialState: AppState = {
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
  | { type: "login"; payload: Record<string, any> }
  | { type: "setusers"; payload: any[] }
  | { type: "setnotification"; payload: NotificationState }
  | { type: "setloading"; payload: boolean };

export const reducer: Reducer<AppState, Action> = (state = initialState, action) => {
  switch (action.type) {
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