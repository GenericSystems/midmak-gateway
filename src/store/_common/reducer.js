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
  loading: {},
  dataUrl: {},
  mimeType: {},
  downloadstatus:
  {
    finished: null,
    error: null,
  }
};

const _Common = (state = INIT_STATE, action) => {
  switch (action.type) {
    case UPLOAD_FILE_SUCCESS:
      return { ...state, loading: true, error: null };
    case UPLOAD_FILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case FETCH_FILE_REQUEST:
      return { ...state, loading: true, error: null, downloadstatus: {finished:0, error : 0} };
    case FETCH_FILE_SUCCESS:
      console.log(`obret in FETCH_FILE_SUCCESS=`, state);
      const obret = {
        ...state,
        loading: false,
        dataUrl: action.payload.dataUrl,
        mimeType: action.payload.mimeType,
        downloadstatus: {finished:1, error : 0},
      };
      console.log(`obret in FETCH_FILE_SUCCESS=`, obret);
      return obret;
    case FETCH_FILE_FAILURE:
      return { ...state, loading: false, error: action.payload, downloadstatus: {finished:1, error : -1} };
    default:
      return state;
  }
};

export default _Common;
