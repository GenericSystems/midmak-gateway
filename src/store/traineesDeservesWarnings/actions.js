import { nationalities } from "common/data";
import {
  GET_TRAINEES_DESERVES_WARNINGS,
  GET_TRAINEES_DESERVES_WARNINGS_FAIL,
  GET_TRAINEES_DESERVES_WARNINGS_SUCCESS,
  ADD_NEW_TRAINEE_DESERVE_WARNING,
  ADD_TRAINEE_DESERVE_WARNING_SUCCESS,
  ADD_TRAINEE_DESERVE_WARNING_FAIL,
  UPDATE_TRAINEE_DESERVE_WARNING,
  UPDATE_TRAINEE_DESERVE_WARNING_SUCCESS,
  UPDATE_TRAINEE_DESERVE_WARNING_FAIL,
  GET_TRAINEE_DESERVE_WARNING_DELETED_VALUE,
  GET_TRAINEE_DESERVE_WARNING_DELETED_VALUE_SUCCESS,
  GET_TRAINEE_DESERVE_WARNING_DELETED_VALUE_FAIL,
  DELETE_TRAINEE_DESERVE_WARNING,
  DELETE_TRAINEE_DESERVE_WARNING_SUCCESS,
  DELETE_TRAINEE_DESERVE_WARNING_FAIL,
} from "./actionTypes";

export const getTraineesDeservesWarnings = () => ({
  type: GET_TRAINEES_DESERVES_WARNINGS,
});

export const getTraineesDeservesWarningsSuccess = traineeWarnings => ({
  type: GET_TRAINEES_DESERVES_WARNINGS_SUCCESS,
  payload: traineeWarnings,
});

export const getTraineesDeservesWarningsFail = error => ({
  type: GET_TRAINEES_DESERVES_WARNINGS_FAIL,
  payload: error,
});

export const getTraineeDeserveWarningDeletedValue = () => ({
  type: GET_TRAINEE_DESERVE_WARNING_DELETED_VALUE,
});

export const getTraineeDeserveWarningDeletedValueSuccess = contract => ({
  type: GET_TRAINEE_DESERVE_WARNING_DELETED_VALUE_SUCCESS,
  payload: contract,
});

export const getTraineeDeserveWarningDeletedValueFail = error => ({
  type: GET_TRAINEE_DESERVE_WARNING_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewTraineeDeserveWarning = contract => ({
  type: ADD_NEW_TRAINEE_DESERVE_WARNING,
  payload: contract,
});

export const addTraineeDeserveWarningSuccess = contract => ({
  type: ADD_TRAINEE_DESERVE_WARNING_SUCCESS,
  payload: contract,
});

export const addTraineeDeserveWarningFail = error => ({
  type: ADD_TRAINEE_DESERVE_WARNING_FAIL,
  payload: error,
});

export const updateTraineeDeserveWarning = contract => {
  return {
    type: UPDATE_TRAINEE_DESERVE_WARNING,
    payload: contract,
  };
};

export const updateTraineeDeserveWarningSuccess = contract => ({
  type: UPDATE_TRAINEE_DESERVE_WARNING_SUCCESS,
  payload: contract,
});

export const updateTraineeDeserveWarningFail = error => ({
  type: UPDATE_TRAINEE_DESERVE_WARNING_FAIL,
  payload: error,
});

export const deleteTraineeDeserveWarning = contract => ({
  type: DELETE_TRAINEE_DESERVE_WARNING,
  payload: contract,
});

export const deleteTraineeDeserveWarningSuccess = contract => ({
  type: DELETE_TRAINEE_DESERVE_WARNING_SUCCESS,
  payload: contract,
});

export const deleteTraineeDeserveWarningFail = error => ({
  type: DELETE_TRAINEE_DESERVE_WARNING_FAIL,
  payload: error,
});
