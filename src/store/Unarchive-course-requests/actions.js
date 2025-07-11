import {
  UNARCHIVE_COURSE_REQUESTS,
  UNARCHIVE_COURSE_REQUESTS_SUCCESS,
  UNARCHIVE_COURSE_REQUESTS_FAIL,
  ADD_UNARCHIVE_COURSE_REQUEST,
  ADD_UNARCHIVE_COURSE_REQUEST_SUCCESS,
  ADD_UNARCHIVE_COURSE_REQUEST_FAIL,
  UPDATE_UNARCHIVE_COURSE_REQUEST,
  UPDATE_UNARCHIVE_COURSE_REQUEST_SUCCESS,
  UPDATE_UNARCHIVE_COURSE_REQUEST_FAIL,
  DELETE_UNARCHIVE_COURSE_REQUEST,
  DELETE_UNARCHIVE_COURSE_REQUEST_SUCCESS,
  DELETE_UNARCHIVE_COURSE_REQUEST_FAIL,
  GET_UNARCHIVE_COURSE_REQUEST_DELETED_VALUE,
  GET_UNARCHIVE_COURSE_REQUEST_DELETED_VALUE_SUCCESS,
  GET_UNARCHIVE_COURSE_REQUEST_DELETED_VALUE_FAIL,
} from "./actionTypes";

// GET
export const getUnarchiveCourseRequests = () => ({
  type: UNARCHIVE_COURSE_REQUESTS,
});

export const getUnarchiveCourseRequestsSuccess = requests => ({
  type: UNARCHIVE_COURSE_REQUESTS_SUCCESS,
  payload: requests,
});

export const getUnarchiveCourseRequestsFail = error => ({
  type: UNARCHIVE_COURSE_REQUESTS_FAIL,
  payload: error,
});

// ADD
export const addUnarchiveCourseRequest = request => ({
  type: ADD_UNARCHIVE_COURSE_REQUEST,
  payload: request,
});

export const addUnarchiveCourseRequestSuccess = request => ({
  type: ADD_UNARCHIVE_COURSE_REQUEST_SUCCESS,
  payload: request,
});

export const addUnarchiveCourseRequestFail = error => ({
  type: ADD_UNARCHIVE_COURSE_REQUEST_FAIL,
  payload: error,
});

// UPDATE
export const updateUnarchiveCourseRequest = request => ({
  type: UPDATE_UNARCHIVE_COURSE_REQUEST,
  payload: request,
});

export const updateUnarchiveCourseRequestSuccess = request => ({
  type: UPDATE_UNARCHIVE_COURSE_REQUEST_SUCCESS,
  payload: request,
});

export const updateUnarchiveCourseRequestFail = error => ({
  type: UPDATE_UNARCHIVE_COURSE_REQUEST_FAIL,
  payload: error,
});

// DELETE
export const deleteUnarchiveCourseRequest = request => ({
  type: DELETE_UNARCHIVE_COURSE_REQUEST,
  payload: request,
});

export const deleteUnarchiveCourseRequestSuccess = request => ({
  type: DELETE_UNARCHIVE_COURSE_REQUEST_SUCCESS,
  payload: request,
});

export const deleteUnarchiveCourseRequestFail = error => ({
  type: DELETE_UNARCHIVE_COURSE_REQUEST_FAIL,
  payload: error,
});

// GET DELETED VALUE
export const getUnarchiveCourseRequestDeletedValue = () => ({
  type: GET_UNARCHIVE_COURSE_REQUEST_DELETED_VALUE,
});

export const getUnarchiveCourseRequestDeletedValueSuccess = deleted => ({
  type: GET_UNARCHIVE_COURSE_REQUEST_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getUnarchiveCourseRequestDeletedValueFail = error => ({
  type: GET_UNARCHIVE_COURSE_REQUEST_DELETED_VALUE_FAIL,
  payload: error,
});
