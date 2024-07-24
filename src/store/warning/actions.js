import {
GET_WARNINGS,
GET_WARNINGS_FAIL,
GET_WARNINGS_SUCCESS,
ADD_NEW_WARNING,
ADD_WARNING_FAIL,
ADD_WARNING_SUCCESS,
UPDATE_WARNING,
UPDATE_WARNING_FAIL,
UPDATE_WARNING_SUCCESS,
DELETE_WARNING,
DELETE_WARNING_SUCCESS,
DELETE_WARNING_FAIL,
GET_WARNING_DELETED_VALUE,
GET_WARNING_DELETED_VALUE_FAIL,
GET_WARNING_DELETED_VALUE_SUCCESS,
  } from "./actionTypes";
  
  export const getWarnings = () => ({
    type: GET_WARNINGS,
  });
  
  export const getWarningsSuccess = warnings => ({
    type: GET_WARNINGS_SUCCESS,
    payload: warnings,
  });
  
  export const getWarningsFail = error => ({
    type: GET_WARNINGS_FAIL,
    payload: error,
  });
  
  
  export const addNewWarning = warning => ({
    type: ADD_NEW_WARNING,
    payload: warning,
  });
  
  export const addWarningSuccess = warning => ({
    type: ADD_WARNING_SUCCESS,
    payload: warning,
  });
  
  export const addWarningFail = error => ({
    type: ADD_WARNING_FAIL,
    payload: error,
  });
  
  export const updateWarning = warning => {
    return {
      type: UPDATE_WARNING,
      payload: warning,
    };
  };
  
  export const updateWarningSuccess = warning => ({
    type: UPDATE_WARNING_SUCCESS,
    payload: warning,
  });
  
  export const updateWarningFail = error => ({
    type: UPDATE_WARNING_FAIL,
    payload: error,
  });
  
  export const deleteWarning = warning => ({
    type: DELETE_WARNING,
    payload: warning,
  });
  
  export const deleteWarningSuccess = warning => ({
    type: DELETE_WARNING_SUCCESS,
    payload: warning,
  });
  
  export const deleteWarningFail = error => ({
    type: DELETE_WARNING_FAIL,
    payload: error,
  });
  
  
export const getWarningDeletedValue = () => ({
  type: GET_WARNING_DELETED_VALUE,
});

export const getWarningDeletedValueSuccess = deleted => ({
  type: GET_WARNING_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getWarningDeletedValueFail = error => ({
  type: GET_WARNING_DELETED_VALUE_FAIL,
  payload: error,
});