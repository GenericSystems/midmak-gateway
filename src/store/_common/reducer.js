import {
  UPLOAD_FILE_SUCCESS,
  UPLOAD_FILE_FAIL,
  FETCH_FILE_REQUEST,
  FETCH_FILE_SUCCESS,
  FETCH_FILE_FAILURE,
} from "./actionTypes";

const INIT_STATE = {
  _commonObjects: [],
  deleted: {},
  error: {},
  loading: false,
  dataUrl: null,
  mimeType: null,
  error: null,
};

const _Common = (state = INIT_STATE, action) => {
  console.log("Reducer _Common action",state, action);
  switch (action.type) {
    case UPLOAD_FILE_SUCCESS:
      return { ...state, loading: true, error: null };
    case UPLOAD_FILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case FETCH_FILE_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_FILE_SUCCESS:
      return {
        ...state,
        loading: false,
        dataUrl: action.payload.dataUrl,
        mimeType: action.payload.mimeType,
      };
    case FETCH_FILE_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default _Common;
