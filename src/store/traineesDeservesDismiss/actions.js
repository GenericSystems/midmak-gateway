import { nationalities } from "common/data";
import {
  GET_TRAINEES_DESERVES_DISMISS,
  GET_TRAINEES_DESERVES_DISMISS_FAIL,
  GET_TRAINEES_DESERVES_DISMISS_SUCCESS,
  ADD_NEW_TRAINEE_DESERVE_DISMISS,
  ADD_TRAINEE_DESERVE_DISMISS_SUCCESS,
  ADD_TRAINEE_DESERVE_DISMISS_FAIL,
  UPDATE_TRAINEE_DESERVE_DISMISS,
  UPDATE_TRAINEE_DESERVE_DISMISS_SUCCESS,
  UPDATE_TRAINEE_DESERVE_DISMISS_FAIL,
  GET_TRAINEE_DESERVE_DISMISS_DELETED_VALUE,
  GET_TRAINEE_DESERVE_DISMISS_DELETED_VALUE_SUCCESS,
  GET_TRAINEE_DESERVE_DISMISS_DELETED_VALUE_FAIL,
  DELETE_TRAINEE_DESERVE_DISMISS,
  DELETE_TRAINEE_DESERVE_DISMISS_SUCCESS,
  DELETE_TRAINEE_DESERVE_DISMISS_FAIL,
} from "./actionTypes";

export const getTraineesDeservesDismiss = () => ({
  type: GET_TRAINEES_DESERVES_DISMISS,
});

export const getTraineesDeservesDismissSuccess = traineeDismiss => ({
  type: GET_TRAINEES_DESERVES_DISMISS_SUCCESS,
  payload: traineeDismiss,
});

export const getTraineesDeservesDismissFail = error => ({
  type: GET_TRAINEES_DESERVES_DISMISS_FAIL,
  payload: error,
});

export const getTraineeDeserveDismissDeletedValue = () => ({
  type: GET_TRAINEE_DESERVE_DISMISS_DELETED_VALUE,
});

export const getTraineeDeserveDismissDeletedValueSuccess = traineeDismiss => ({
  type: GET_TRAINEE_DESERVE_DISMISS_DELETED_VALUE_SUCCESS,
  payload: traineeDismiss,
});

export const getTraineeDeserveDismissDeletedValueFail = error => ({
  type: GET_TRAINEE_DESERVE_DISMISS_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewTraineeDeserveDismiss = traineeDismiss => ({
  type: ADD_NEW_TRAINEE_DESERVE_DISMISS,
  payload: traineeDismiss,
});

export const addTraineeDeserveDismissSuccess = traineeDismiss => ({
  type: ADD_TRAINEE_DESERVE_DISMISS_SUCCESS,
  payload: traineeDismiss,
});

export const addTraineeDeserveDismissFail = error => ({
  type: ADD_TRAINEE_DESERVE_DISMISS_FAIL,
  payload: error,
});

export const updateTraineeDeserveDismiss = traineeDismiss => {
  return {
    type: UPDATE_TRAINEE_DESERVE_DISMISS,
    payload: traineeDismiss,
  };
};

export const updateTraineeDeserveDismissSuccess = traineeDismiss => ({
  type: UPDATE_TRAINEE_DESERVE_DISMISS_SUCCESS,
  payload: traineeDismiss,
});

export const updateTraineeDeserveDismissFail = error => ({
  type: UPDATE_TRAINEE_DESERVE_DISMISS_FAIL,
  payload: error,
});

export const deleteTraineeDeserveDismiss = traineeDismiss => ({
  type: DELETE_TRAINEE_DESERVE_DISMISS,
  payload: traineeDismiss,
});

export const deleteTraineeDeserveDismissSuccess = traineeDismiss => ({
  type: DELETE_TRAINEE_DESERVE_DISMISS_SUCCESS,
  payload: traineeDismiss,
});

export const deleteTraineeDeserveDismissFail = error => ({
  type: DELETE_TRAINEE_DESERVE_DISMISS_FAIL,
  payload: error,
});
