import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  LOGIN_FAILED,
  GET_USER_ID_SUCCESS,
  GET_USER_ID_FAIL,
} from "./actionTypes";

const initialState = {
  error: "",
  loading: false,
  userId: [],
};

const login = (state = initialState, action) => {
  // console.log("reducer login", state, action);

  if (action.type.includes("SUCCESS") && action.payload === undefined) {
    const error = "An Error Occurred";
    alert(error); 
    return {
      ...state,
    };
  }

  if (action.type.includes("FAIL")) {
    const errorFail = "An Error Occurred";
    alert(errorFail); 
    return {
      ...state,
    };
  }



  switch (action.type) {
    case LOGIN_USER:
      state = {
        ...state,
        loading: true,
      };
      break;
    case LOGIN_SUCCESS:
      const userId = action.payload[0].Id;
      localStorage.setItem("userId", userId);
      return {
        ...state,
        loading: false,
        userId: userId,
      };
      break;
    case LOGOUT_USER:
      localStorage.removeItem("userId");
      return {
        ...state,
        userId: null,
      };
      break;
    case LOGOUT_USER_SUCCESS:
      state = { ...state };
      break;
    case API_ERROR:
      state = { ...state, error: action.payload, loading: false };
      break;
    case LOGIN_FAILED:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case GET_USER_ID_SUCCESS:
      return {
        ...state,
        userId: action.payload[0].Id,
      };

    case GET_USER_ID_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      state = { ...state };
      break;
  }
  return state;
};

export default login;
