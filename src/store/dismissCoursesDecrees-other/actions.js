import {
  GET_ORAL_WARNING_DECREE_DELETED_VALUE,
  GET_ORAL_WARNING_DECREE_DELETED_VALUE_FAIL,
  GET_ORAL_WARNING_DECREE_DELETED_VALUE_SUCCESS,
  GET_ORAL_WARNING_DECREES,
  GET_ORAL_WARNING_DECREES_FAIL,
  GET_ORAL_WARNING_DECREES_SUCCESS,
  ADD_NEW_ORAL_WARNING_DECREE,
  ADD_ORAL_WARNING_DECREE_SUCCESS,
  ADD_ORAL_WARNING_DECREE_FAIL,
  UPDATE_ORAL_WARNING_DECREE,
  UPDATE_ORAL_WARNING_DECREE_SUCCESS,
  UPDATE_ORAL_WARNING_DECREE_FAIL,
  DELETE_ORAL_WARNING_DECREE,
  DELETE_ORAL_WARNING_DECREE_SUCCESS,
  DELETE_ORAL_WARNING_DECREE_FAIL,
} from "./actionTypes";

export const getOralWarningDecrees = () => ({
  type: GET_ORAL_WARNING_DECREES,
});

export const getOralWarningDecreesSuccess = oralWarningDecrees => ({
  type: GET_ORAL_WARNING_DECREES_SUCCESS,
  payload: oralWarningDecrees,
});

export const getOralWarningDecreesFail = error => ({
  type: GET_ORAL_WARNING_DECREES_FAIL,
  payload: error,
});

export const getOralWarningDecreeDeletedValue = () => ({
  type: GET_ORAL_WARNING_DECREE_DELETED_VALUE,
});

export const getOralWarningDecreeDeletedValueSuccess = oralWarningDecree => ({
  type: GET_ORAL_WARNING_DECREE_DELETED_VALUE_SUCCESS,
  payload: oralWarningDecree,
});

export const getOralWarningDecreeDeletedValueFail = error => ({
  type: GET_ORAL_WARNING_DECREE_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewOralWarningDecree = oralWarningDecree => ({
  type: ADD_NEW_ORAL_WARNING_DECREE,
  payload: oralWarningDecree,
});

export const addOralWarningDecreeSuccess = oralWarningDecree => ({
  type: ADD_ORAL_WARNING_DECREE_SUCCESS,
  payload: oralWarningDecree,
});

export const addOralWarningDecreeFail = error => ({
  type: ADD_ORAL_WARNING_DECREE_FAIL,
  payload: error,
});

export const updateOralWarningDecree = oralWarningDecree => ({
  type: UPDATE_ORAL_WARNING_DECREE,
  payload: oralWarningDecree,
});

export const updateOralWarningDecreeSuccess = oralWarningDecree => ({
  type: UPDATE_ORAL_WARNING_DECREE_SUCCESS,
  payload: oralWarningDecree,
});

export const updateOralWarningDecreeFail = error => ({
  type: UPDATE_ORAL_WARNING_DECREE_FAIL,
  payload: error,
});

export const deleteOralWarningDecree = oralWarningDecree => ({
  type: DELETE_ORAL_WARNING_DECREE,
  payload: oralWarningDecree,
});

export const deleteOralWarningDecreeSuccess = oralWarningDecree => ({
  type: DELETE_ORAL_WARNING_DECREE_SUCCESS,
  payload: oralWarningDecree,
});

export const deleteOralWarningDecreeFail = error => ({
  type: DELETE_ORAL_WARNING_DECREE_FAIL,
  payload: error,
});
