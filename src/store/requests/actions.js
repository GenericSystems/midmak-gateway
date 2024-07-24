import {
    GET_REQUEST_DELETED_VALUE,
    GET_REQUEST_DELETED_VALUE_FAIL,
    GET_REQUEST_DELETED_VALUE_SUCCESS,
    GET_REQUESTS,
    GET_REQUESTS_FAIL,
    GET_REQUESTS_SUCCESS,
    ADD_NEW_REQUEST,
    ADD_REQUEST_SUCCESS,
    ADD_REQUEST_FAIL,
    UPDATE_REQUEST,
    UPDATE_REQUEST_SUCCESS,
    UPDATE_REQUEST_FAIL,
    DELETE_REQUEST,
    DELETE_REQUEST_SUCCESS,
    DELETE_REQUEST_FAIL,
  } from "./actionTypes";
  
  export const getRequests = () => ({
    type: GET_REQUESTS,
  });
  
  export const getRequestsSuccess = requests => ({
    type: GET_REQUESTS_SUCCESS,
    payload: requests,
  });
  
  export const getRequestsFail = error => ({
    type: GET_REQUESTS_FAIL,
    payload: error,
  });
  
  export const getRequestDeletedValue = () => ({
    type: GET_REQUEST_DELETED_VALUE,
  });
  
  export const getRequestDeletedValueSuccess = deleted => ({
    type: GET_REQUEST_DELETED_VALUE_SUCCESS,
    payload: deleted,
  });
  
  export const getRequestDeletedValueFail = error => ({
    type: GET_REQUEST_DELETED_VALUE_FAIL,
    payload: error,
  });
  
  export const addNewRequest = request => ({
    type: ADD_NEW_REQUEST,
    payload: request,
  });
  
  export const addRequestSuccess = request => ({
    type: ADD_REQUEST_SUCCESS,
    payload: request,
  });
  
  export const addRequestFail = error => ({
    type: ADD_REQUEST_FAIL,
    payload: error,
  });
  
  export const updateRequest = request => {
    return {
      type: UPDATE_REQUEST,
      payload: request,
    };
  };
  
  export const updateRequestSuccess = request => ({
    type: UPDATE_REQUEST_SUCCESS,
    payload: request,
  });
  
  export const updateRequestFail = error => ({
    type: UPDATE_REQUEST_FAIL,
    payload: error,
  });
  
  export const deleteRequest = request => ({
    type: DELETE_REQUEST,
    payload: request,
  });
  
  export const deleteRequestSuccess = request => ({
    type: DELETE_REQUEST_SUCCESS,
    payload: request,
  });
  
  export const deleteRequestFail = error => ({
    type: DELETE_REQUEST_FAIL,
    payload: error,
  });
  