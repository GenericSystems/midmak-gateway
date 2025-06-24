import {
  GET_WARNING_TYPE_DELETED_VALUE,
  GET_WARNING_TYPE_DELETED_VALUE_FAIL,
  GET_WARNING_TYPE_DELETED_VALUE_SUCCESS,
  GET_WARNINGS_TYPES,
  GET_WARNINGS_TYPES_FAIL,
  GET_WARNINGS_TYPES_SUCCESS,
  ADD_NEW_WARNING_TYPE,
  ADD_WARNING_TYPE_SUCCESS,
  ADD_WARNING_TYPE_FAIL,
  UPDATE_WARNING_TYPE,
  UPDATE_WARNING_TYPE_SUCCESS,
  UPDATE_WARNING_TYPE_FAIL,
  DELETE_WARNING_TYPE,
  DELETE_WARNING_TYPE_SUCCESS,
  DELETE_WARNING_TYPE_FAIL,
} from "./actionTypes";

export const getWarningsTypes = () => ({
  type: GET_WARNINGS_TYPES,
});

export const getWarningsTypesSuccess = warningsTypes => ({
  type: GET_WARNINGS_TYPES_SUCCESS,
  payload: warningsTypes,
});

export const getWarningsTypesFail = error => ({
  type: GET_WARNINGS_TYPES_FAIL,
  payload: error,
});

export const getWarningTypeDeletedValue = () => ({
  type: GET_WARNING_TYPE_DELETED_VALUE,
});

export const getWarningTypeDeletedValueSuccess = warningType => ({
  type: GET_WARNING_TYPE_DELETED_VALUE_SUCCESS,
  payload: warningType,
});

export const getWarningTypeDeletedValueFail = error => ({
  type: GET_WARNING_TYPE_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewWarningType = warningType => ({
  type: ADD_NEW_WARNING_TYPE,
  payload: warningType,
});

export const addWarningTypeSuccess = warningType => ({
  type: ADD_WARNING_TYPE_SUCCESS,
  payload: warningType,
});

export const addWarningTypeFail = error => ({
  type: ADD_WARNING_TYPE_FAIL,
  payload: error,
});

export const updateWarningType = warningType => {
  return {
    type: UPDATE_WARNING_TYPE,
    payload: warningType,
  };
};

export const updateWarningTypeSuccess = warningType => ({
  type: UPDATE_WARNING_TYPE_SUCCESS,
  payload: warningType,
});

export const updateWarningTypeFail = error => ({
  type: UPDATE_WARNING_TYPE_FAIL,
  payload: error,
});

export const deleteWarningType = warningType => ({
  type: DELETE_WARNING_TYPE,
  payload: warningType,
});

export const deleteWarningTypeSuccess = warningType => ({
  type: DELETE_WARNING_TYPE_SUCCESS,
  payload: warningType,
});

export const deleteWarningTypeFail = error => ({
  type: DELETE_WARNING_TYPE_FAIL,
  payload: error,
});
