import {
  GET_WORK_CLASSIFICATION_DELETED_VALUE,
  GET_WORK_CLASSIFICATION_DELETED_VALUE_FAIL,
  GET_WORK_CLASSIFICATION_DELETED_VALUE_SUCCESS,
  GET_WORK_CLASSIFICATIONS,
  GET_WORK_CLASSIFICATIONS_FAIL,
  GET_WORK_CLASSIFICATIONS_SUCCESS,
  ADD_NEW_WORK_CLASSIFICATION,
  ADD_WORK_CLASSIFICATION_SUCCESS,
  ADD_WORK_CLASSIFICATION_FAIL,
  UPDATE_WORK_CLASSIFICATION,
  UPDATE_WORK_CLASSIFICATION_SUCCESS,
  UPDATE_WORK_CLASSIFICATION_FAIL,
  DELETE_WORK_CLASSIFICATION,
  DELETE_WORK_CLASSIFICATION_SUCCESS,
  DELETE_WORK_CLASSIFICATION_FAIL,
} from "./actionTypes";

export const getWorkClassifications = () => ({
  type: GET_WORK_CLASSIFICATIONS,
});

export const getWorkClassificationsSuccess = workClassifications => ({
  type: GET_WORK_CLASSIFICATIONS_SUCCESS,
  payload: workClassifications,
});

export const getWorkClassificationsFail = error => ({
  type: GET_WORK_CLASSIFICATIONS_FAIL,
  payload: error,
});

export const getWorkClassificationDeletedValue = () => ({
  type: GET_WORK_CLASSIFICATION_DELETED_VALUE,
});

export const getWorkClassificationDeletedValueSuccess = workClassification => ({
  type: GET_WORK_CLASSIFICATION_DELETED_VALUE_SUCCESS,
  payload: workClassification,
});

export const getWorkClassificationDeletedValueFail = error => ({
  type: GET_WORK_CLASSIFICATION_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewWorkClassification = workClassification => ({
  type: ADD_NEW_WORK_CLASSIFICATION,
  payload: workClassification,
});

export const addWorkClassificationSuccess = workClassification => ({
  type: ADD_WORK_CLASSIFICATION_SUCCESS,
  payload: workClassification,
});

export const addWorkClassificationFail = error => ({
  type: ADD_WORK_CLASSIFICATION_FAIL,
  payload: error,
});

export const updateWorkClassification = workClassification => {
  return {
    type: UPDATE_WORK_CLASSIFICATION,
    payload: workClassification,
  };
};

export const updateWorkClassificationSuccess = workClassification => ({
  type: UPDATE_WORK_CLASSIFICATION_SUCCESS,
  payload: workClassification,
});

export const updateWorkClassificationFail = error => ({
  type: UPDATE_WORK_CLASSIFICATION_FAIL,
  payload: error,
});

export const deleteWorkClassification = workClassification => ({
  type: DELETE_WORK_CLASSIFICATION,
  payload: workClassification,
});

export const deleteWorkClassificationSuccess = workClassification => ({
  type: DELETE_WORK_CLASSIFICATION_SUCCESS,
  payload: workClassification,
});

export const deleteWorkClassificationFail = error => ({
  type: DELETE_WORK_CLASSIFICATION_FAIL,
  payload: error,
});
