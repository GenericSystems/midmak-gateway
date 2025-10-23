import { nationalities } from "common/data";
import {
  GET_TRAINEES_DESERVES_DEPRIVATION,
  GET_TRAINEES_DESERVES_DEPRIVATION_FAIL,
  GET_TRAINEES_DESERVES_DEPRIVATION_SUCCESS,
  ADD_NEW_TRAINEE_DESERVE_DEPRIVATION,
  ADD_TRAINEE_DESERVE_DEPRIVATION_SUCCESS,
  ADD_TRAINEE_DESERVE_DEPRIVATION_FAIL,
  UPDATE_TRAINEE_DESERVE_DEPRIVATION,
  UPDATE_TRAINEE_DESERVE_DEPRIVATION_SUCCESS,
  UPDATE_TRAINEE_DESERVE_DEPRIVATION_FAIL,
  GET_TRAINEE_DESERVE_DEPRIVATION_DELETED_VALUE,
  GET_TRAINEE_DESERVE_DEPRIVATION_DELETED_VALUE_SUCCESS,
  GET_TRAINEE_DESERVE_DEPRIVATION_DELETED_VALUE_FAIL,
  DELETE_TRAINEE_DESERVE_DEPRIVATION,
  DELETE_TRAINEE_DESERVE_DEPRIVATION_SUCCESS,
  DELETE_TRAINEE_DESERVE_DEPRIVATION_FAIL,
} from "./actionTypes";

export const getTraineesDeservesDeprivation = () => ({
  type: GET_TRAINEES_DESERVES_DEPRIVATION,
});

export const getTraineesDeservesDeprivationSuccess = traineeDeprivation => ({
  type: GET_TRAINEES_DESERVES_DEPRIVATION_SUCCESS,
  payload: traineeDeprivation,
});

export const getTraineesDeservesDeprivationFail = error => ({
  type: GET_TRAINEES_DESERVES_DEPRIVATION_FAIL,
  payload: error,
});

export const getTraineeDeserveDeprivationDeletedValue = () => ({
  type: GET_TRAINEE_DESERVE_DEPRIVATION_DELETED_VALUE,
});

export const getTraineeDeserveDeprivationDeletedValueSuccess =
  traineeDeprivation => ({
    type: GET_TRAINEE_DESERVE_DEPRIVATION_DELETED_VALUE_SUCCESS,
    payload: traineeDeprivation,
  });

export const getTraineeDeserveDeprivationDeletedValueFail = error => ({
  type: GET_TRAINEE_DESERVE_DEPRIVATION_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewTraineeDeserveDeprivation = traineeDeprivation => ({
  type: ADD_NEW_TRAINEE_DESERVE_DEPRIVATION,
  payload: traineeDeprivation,
});

export const addTraineeDeserveDeprivationSuccess = traineeDeprivation => ({
  type: ADD_TRAINEE_DESERVE_DEPRIVATION_SUCCESS,
  payload: traineeDeprivation,
});

export const addTraineeDeserveDeprivationFail = error => ({
  type: ADD_TRAINEE_DESERVE_DEPRIVATION_FAIL,
  payload: error,
});

export const updateTraineeDeserveDeprivation = traineeDeprivation => {
  return {
    type: UPDATE_TRAINEE_DESERVE_DEPRIVATION,
    payload: traineeDeprivation,
  };
};

export const updateTraineeDeserveDeprivationSuccess = traineeDeprivation => ({
  type: UPDATE_TRAINEE_DESERVE_DEPRIVATION_SUCCESS,
  payload: traineeDeprivation,
});

export const updateTraineeDeserveDeprivationFail = error => ({
  type: UPDATE_TRAINEE_DESERVE_DEPRIVATION_FAIL,
  payload: error,
});

export const deleteTraineeDeserveDeprivation = traineeDeprivation => ({
  type: DELETE_TRAINEE_DESERVE_DEPRIVATION,
  payload: traineeDeprivation,
});

export const deleteTraineeDeserveDeprivationSuccess = traineeDeprivation => ({
  type: DELETE_TRAINEE_DESERVE_DEPRIVATION_SUCCESS,
  payload: traineeDeprivation,
});

export const deleteTraineeDeserveDeprivationFail = error => ({
  type: DELETE_TRAINEE_DESERVE_DEPRIVATION_FAIL,
  payload: error,
});
