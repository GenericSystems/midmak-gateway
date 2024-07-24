import {
    GET_STD_WARNING_TEST,
    GET_STD_WARNING_TEST_FAIL,
    GET_STD_WARNING_TEST_SUCCESS,
    ADD_NEW_STD_WARNING_TEST,
    ADD_STD_WARNING_TEST_FAIL,
    ADD_STD_WARNING_TEST_SUCCESS,
    UPDATE_STD_WARNING_TEST,
    UPDATE_STD_WARNING_TEST_FAIL,
    UPDATE_STD_WARNING_TEST_SUCCESS,
    DELETE_STD_WARNING_TEST,
    DELETE_STD_WARNING_TEST_SUCCESS,
    DELETE_STD_WARNING_TEST_FAIL,
    GET_STD_WARNING_TEST_DELETED_VALUE,
    GET_STD_WARNING_TEST_DELETED_VALUE_FAIL,
    GET_STD_WARNING_TEST_DELETED_VALUE_SUCCESS,

      } from "./actionTypes";
      
      export const getStdWarningTest = () => ({
        type: GET_STD_WARNING_TEST,
      });
      
      export const getStdWarningTestSuccess = warnings => ({
        type: GET_STD_WARNING_TEST_SUCCESS,
        payload: warnings,
      });
      
      export const getStdWarningTestFail = error => ({
        type: GET_STD_WARNING_TEST_FAIL,
        payload: error,
      });

      
      
      export const addNewStdWarningTest = warning => ({
        type: ADD_NEW_STD_WARNING_TEST,
        payload: warning,
      });
      
      export const addStdWarningTestSuccess = warning => ({
        type: ADD_STD_WARNING_TEST_SUCCESS,
        payload: warning,
      });
      
      export const addStdWarningTestFail = error => ({
        type: ADD_STD_WARNING_TEST_FAIL,
        payload: error,
      });
      
      export const updateStdWarningTest = warning => {
        return {
          type: UPDATE_STD_WARNING_TEST,
          payload: warning,
        };
      };
      
      export const updateStdWarningTestSuccess = warning => ({
        type: UPDATE_STD_WARNING_TEST_SUCCESS,
        payload: warning,
      });
      
      export const updateStdWarningTestFail = error => ({
        type: UPDATE_STD_WARNING_TEST_FAIL,
        payload: error,
      });
      
      export const deleteStdWarningTest = warning => ({
        type: DELETE_STD_WARNING_TEST,
        payload: warning,
      });
      
      export const deleteStdWarningTestSuccess = warning => ({
        type: DELETE_STD_WARNING_TEST_SUCCESS,
        payload: warning,
      });
      
      export const deleteStdWarningTestFail = error => ({
        type: DELETE_STD_WARNING_TEST_FAIL,
        payload: error,
      });
      
      
    export const getStdWarningTestDeletedValue = () => ({
      type: GET_STD_WARNING_TEST_DELETED_VALUE,
    });
    
    export const getStdWarningTestDeletedValueSuccess = deleted => ({
      type: GET_STD_WARNING_TEST_DELETED_VALUE_SUCCESS,
      payload: deleted,
    });
    
    export const getStdWarningTestDeletedValueFail = error => ({
      type: GET_STD_WARNING_TEST_DELETED_VALUE_FAIL,
      payload: error,
    });
