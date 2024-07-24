import {
  GET_ESTIMATE_DELETED_VALUE,
  GET_ESTIMATE_DELETED_VALUE_FAIL,
  GET_ESTIMATE_DELETED_VALUE_SUCCESS,
  GET_ESTIMATES,
  GET_ESTIMATES_FAIL,
  GET_ESTIMATES_SUCCESS,
  ADD_NEW_ESTIMATE,
  ADD_ESTIMATE_SUCCESS,
  ADD_ESTIMATE_FAIL,
  UPDATE_ESTIMATE,
  UPDATE_ESTIMATE_SUCCESS,
  UPDATE_ESTIMATE_FAIL,
  DELETE_ESTIMATE,
  DELETE_ESTIMATE_SUCCESS,
  DELETE_ESTIMATE_FAIL,
} from "./actionTypes";

export const getEstimates = () => ({
  type: GET_ESTIMATES,
});

export const getEstimatesSuccess = estimates => ({
  type: GET_ESTIMATES_SUCCESS,
  payload: estimates,
});

export const getEstimatesFail = error => ({
  type: GET_ESTIMATES_FAIL,
  payload: error,
});

export const getEstimateDeletedValue = () => ({
  type: GET_ESTIMATE_DELETED_VALUE,
});

export const getEstimateDeletedValueSuccess = estimateProfile => ({
  type: GET_ESTIMATE_DELETED_VALUE_SUCCESS,
  payload: estimateProfile,
});

export const getEstimateDeletedValueFail = error => ({
  type: GET_ESTIMATE_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewEstimate = estimate => ({
  type: ADD_NEW_ESTIMATE,
  payload: estimate,
});

export const addEstimateSuccess = estimate => ({
  type: ADD_ESTIMATE_SUCCESS,
  payload: estimate,
});

export const addEstimateFail = error => ({
  type: ADD_ESTIMATE_FAIL,
  payload: error,
});

export const updateEstimate = estimate => {
  return {
    type: UPDATE_ESTIMATE,
    payload: estimate,
  };
};

export const updateEstimateSuccess = estimate => ({
  type: UPDATE_ESTIMATE_SUCCESS,
  payload: estimate,
});

export const updateEstimateFail = error => ({
  type: UPDATE_ESTIMATE_FAIL,
  payload: error,
});

export const deleteEstimate = estimate => ({
  type: DELETE_ESTIMATE,
  payload: estimate,
});

export const deleteEstimateSuccess = estimate => ({
  type: DELETE_ESTIMATE_SUCCESS,
  payload: estimate,
});

export const deleteEstimateFail = error => ({
  type: DELETE_ESTIMATE_FAIL,
  payload: error,
});
