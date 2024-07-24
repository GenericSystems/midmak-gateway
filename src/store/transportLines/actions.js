import {
  GET_TRANSPORT_LINES,
  GET_TRANSPORT_LINES_SUCCESS,
  GET_TRANSPORT_LINES_FAIL,
  ADD_NEW_TRANSPORT_LINE,
  ADD_TRANSPORT_LINE_SUCCESS,
  ADD_TRANSPORT_LINE_FAIL,
  UPDATE_TRANSPORT_LINE,
  UPDATE_TRANSPORT_LINE_SUCCESS,
  UPDATE_TRANSPORT_LINE_FAIL,
  DELETE_TRANSPORT_LINE,
  DELETE_TRANSPORT_LINE_SUCCESS,
  DELETE_TRANSPORT_LINE_FAIL,
  GET_TRANSPORT_LINE_DETAILS,
  GET_TRANSPORT_LINE_DETAILS_SUCCESS,
  GET_TRANSPORT_LINE_DETAILS_FAIL,
  ADD_NEW_TRANSPORT_LINE_DETAIL,
  ADD_TRANSPORT_LINE_DETAIL_SUCCESS,
  ADD_TRANSPORT_LINE_DETAIL_FAIL,
  UPDATE_TRANSPORT_LINE_DETAIL,
  UPDATE_TRANSPORT_LINE_DETAIL_SUCCESS,
  UPDATE_TRANSPORT_LINE_DETAIL_FAIL,
  DELETE_TRANSPORT_LINE_DETAIL,
  DELETE_TRANSPORT_LINE_DETAIL_SUCCESS,
  DELETE_TRANSPORT_LINE_DETAIL_FAIL,
  GET_TRANSPORT_LINE_DELETED_VALUE,
  GET_TRANSPORT_LINE_DELETED_VALUE_FAIL,
  GET_TRANSPORT_LINE_DELETED_VALUE_SUCCESS,
  GET_TRANSPORT_LINE_DETAILS_DELETED_VALUE,
  GET_TRANSPORT_LINE_DETAILS_DELETED_VALUE_SUCCESS,
  GET_TRANSPORT_LINE_DETAILS_DELETED_VALUE_FAIL,
  GET_STDS_TRANSPORT_LINE,
  GET_STDS_TRANSPORT_LINE_SUCCESS,
  GET_STDS_TRANSPORT_LINE_FAIL,
  ADD_NEW_STD_TRANSPORT_LINE,
  ADD_STD_TRANSPORT_LINE_SUCCESS,
  ADD_STD_TRANSPORT_LINE_FAIL,
  UPDATE_STD_TRANSPORT_LINE,
  UPDATE_STD_TRANSPORT_LINE_SUCCESS,
  UPDATE_STD_TRANSPORT_LINE_FAIL,
  DELETE_STD_TRANSPORT_LINE,
  DELETE_STD_TRANSPORT_LINE_SUCCESS,
  DELETE_STD_TRANSPORT_LINE_FAIL,
  GET_STD_TRANSPORT_LINE_DELETED_VALUE,
  GET_STD_TRANSPORT_LINE_DELETED_VALUE_SUCCESS,
  GET_STD_TRANSPORT_LINE_DELETED_VALUE_FAIL,
  GET_UNIV_STD_DATA_LIST,
  GET_UNIV_STD_DATA_LIST_SUCCESS,
  GET_UNIV_STD_DATA_LIST_FAIL
} from "./actionTypes";

export const getTransportLines = () => ({
  type: GET_TRANSPORT_LINES,
});

export const getTransportLinesSuccess = transportLines => ({
  type: GET_TRANSPORT_LINES_SUCCESS,
  payload: transportLines,
});

export const getTransportLinesFail = error => ({
  type: GET_TRANSPORT_LINES_FAIL,
  payload: error,
});

export const addNewTransportLine = transportLine => ({
  type: ADD_NEW_TRANSPORT_LINE,
  payload: transportLine,
});

export const addTransportLineSuccess = transportLine => ({
  type: ADD_TRANSPORT_LINE_SUCCESS,
  payload: transportLine,
});

export const addTransportLineFail = error => ({
  type: ADD_TRANSPORT_LINE_FAIL,
  payload: error,
});

export const updateTransportLine = transportLine => ({
  type: UPDATE_TRANSPORT_LINE,
  payload: transportLine,
});

export const updateTransportLineSuccess = transportLine => ({
  type: UPDATE_TRANSPORT_LINE_SUCCESS,
  payload: transportLine,
});

export const updateTransportLineFail = error => ({
  type: UPDATE_TRANSPORT_LINE_FAIL,
  payload: error,
});

export const deleteTransportLine = transportLine => ({
  type: DELETE_TRANSPORT_LINE,
  payload: transportLine,
});

export const deleteTransportLineSuccess = transportLine => ({
  type: DELETE_TRANSPORT_LINE_SUCCESS,
  payload: transportLine,
});

export const deleteTransportLineFail = error => ({
  type: DELETE_TRANSPORT_LINE_FAIL,
  payload: error,
});

//transportLineDetails
export const getTransportLineDetails = letterId => ({
  type: GET_TRANSPORT_LINE_DETAILS,
  payload: letterId,
});

export const getTransportLineDetailsSuccess = transportLineDetails => ({
  type: GET_TRANSPORT_LINE_DETAILS_SUCCESS,
  payload: transportLineDetails,
});

export const getTransportLineDetailsFail = error => ({
  type: GET_TRANSPORT_LINE_DETAILS_FAIL,
  payload: error,
});

export const addNewTransportLineDetail = transportLineDetail => ({
  type: ADD_NEW_TRANSPORT_LINE_DETAIL,
  payload: transportLineDetail,
});

export const addTransportLineDetailSuccess = transportLineDetail => ({
  type: ADD_TRANSPORT_LINE_DETAIL_SUCCESS,
  payload: transportLineDetail,
});

export const addTransportLineDetailFail = error => ({
  type: ADD_TRANSPORT_LINE_DETAIL_FAIL,
  payload: error,
});

export const updateTransportLineDetail = transportLineDetail => ({
  type: UPDATE_TRANSPORT_LINE_DETAIL,
  payload: transportLineDetail,
});

export const updateTransportLineDetailSuccess = transportLineDetail => ({
  type: UPDATE_TRANSPORT_LINE_DETAIL_SUCCESS,
  payload: transportLineDetail,
});

export const updateTransportLineDetailFail = error => ({
  type: UPDATE_TRANSPORT_LINE_DETAIL_FAIL,
  payload: error,
});

export const deleteTransportLineDetail = transportLineDetail => ({
  type: DELETE_TRANSPORT_LINE_DETAIL,
  payload: transportLineDetail,
});

export const deleteTransportLineDetailSuccess = transportLineDetail => ({
  type: DELETE_TRANSPORT_LINE_DETAIL_SUCCESS,
  payload: transportLineDetail,
});

export const deleteTransportLineDetailFail = error => ({
  type: DELETE_TRANSPORT_LINE_DETAIL_FAIL,
  payload: error,
});

export const getTransportLineDeletedValue = () => ({
  type: GET_TRANSPORT_LINE_DELETED_VALUE,
});

export const getTransportLineDeletedValueSuccess = deleted => ({
  type: GET_TRANSPORT_LINE_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getTransportLineDeletedValueFail = error => ({
  type: GET_TRANSPORT_LINE_DELETED_VALUE_FAIL,
  payload: error,
});

export const getTransportLineDetailsDeletedValue = () => ({
  type: GET_TRANSPORT_LINE_DETAILS_DELETED_VALUE,
});

export const getTransportLineDetailsDeletedValueSuccess = deletedDetail => ({
  type: GET_TRANSPORT_LINE_DETAILS_DELETED_VALUE_SUCCESS,
  payload: deletedDetail,
});

export const getTransportLineDetailsDeletedValueFail = error => ({
  type: GET_TRANSPORT_LINE_DETAILS_DELETED_VALUE_FAIL,
  payload: error,
});

export const getStdsTransportLine = transportLine => ({
  type: GET_STDS_TRANSPORT_LINE,
  payload: transportLine,

});

export const getStdsTransportLineSuccess = transportLines => ({
  type: GET_STDS_TRANSPORT_LINE_SUCCESS,
  payload: transportLines,
});

export const getStdsTransportLineFail = error => ({
  type: GET_STDS_TRANSPORT_LINE_FAIL,
  payload: error,
});


export const addNewStdTransportLine = transportLine => ({
  type: ADD_NEW_STD_TRANSPORT_LINE,
  payload: transportLine,
});

export const addStdTransportLineSuccess = transportLine => ({
  type: ADD_STD_TRANSPORT_LINE_SUCCESS,
  payload: transportLine,
});

export const addStdTransportLineFail = error => ({
  type: ADD_STD_TRANSPORT_LINE_FAIL,
  payload: error,
});

export const updateStdTransportLine = transportLine => ({
  type: UPDATE_STD_TRANSPORT_LINE,
  payload: transportLine,
});

export const updateStdTransportLineSuccess = transportLine => ({
  type: UPDATE_STD_TRANSPORT_LINE_SUCCESS,
  payload: transportLine,
});

export const updateStdTransportLineFail = error => ({
  type: UPDATE_STD_TRANSPORT_LINE_FAIL,
  payload: error,
});

export const deleteStdTransportLine = transportLine => ({
  type: DELETE_STD_TRANSPORT_LINE,
  payload: transportLine,
});

export const deleteStdTransportLineSuccess = transportLine => ({
  type: DELETE_STD_TRANSPORT_LINE_SUCCESS,
  payload: transportLine,
});

export const deleteStdTransportLineFail = error => ({
  type: DELETE_STD_TRANSPORT_LINE_FAIL,
  payload: error,
});

export const getStdTransportLineDeletedValue = () => ({
  type: GET_STD_TRANSPORT_LINE_DELETED_VALUE,
});

export const getStdTransportLineDeletedValueSuccess = deletedDetail => ({
  type: GET_STD_TRANSPORT_LINE_DELETED_VALUE_SUCCESS,
  payload: deletedDetail,
});

export const getStdTransportLineDeletedValueFail = error => ({
  type: GET_STD_TRANSPORT_LINE_DELETED_VALUE_FAIL,
  payload: error,
});


export const getUnivStdDataList = () => ({
  type: GET_UNIV_STD_DATA_LIST,
});

export const getUnivStdDataListSuccess = UnivStdDataList => ({
  type: GET_UNIV_STD_DATA_LIST_SUCCESS,
  payload: UnivStdDataList,
});

export const getUnivStdDataListFail = error => ({
  type: GET_UNIV_STD_DATA_LIST_FAIL,
  payload: error,
});