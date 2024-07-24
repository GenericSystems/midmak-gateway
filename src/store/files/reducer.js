import {
    GET_FILE_SUCCESS,
    GET_FILE_FAIL,
  } from "./actionTypes";
  
  const INIT_STATE = {
    file: [],
    deleted: {},
    error: {},
  };
  
  const file = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_FILE_SUCCESS:
        return {
          ...state,
          file: action.payload,
        };
  
      case GET_FILE_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
  
      default:
        return state;
    }
  };
  
  export default file;
  