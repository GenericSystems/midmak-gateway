import {
  UPLOAD_FILE_SUCCESS,
  UPLOAD_FILE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  _commonObjects: [],
  deleted: {},
  error: {},
};

const _Common = (state = INIT_STATE, action) => {
  
  switch (action.type) {
    case UPLOAD_FILE_SUCCESS:
      return {
        ...state,
        tempTrainees: action.payload,
      };

    case UPLOAD_FILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    
    default:
      return state;
  }
};

export default _Common;
