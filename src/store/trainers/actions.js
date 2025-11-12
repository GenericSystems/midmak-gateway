import {
  GET_TRAINER_DELETED_VALUE,
  GET_TRAINER_DELETED_VALUE_FAIL,
  GET_TRAINER_DELETED_VALUE_SUCCESS,
  GET_TRAINERS,
  GET_TRAINERS_FAIL,
  GET_TRAINERS_SUCCESS,
  ADD_NEW_TRAINER,
  ADD_TRAINER_SUCCESS,
  ADD_TRAINER_FAIL,
  UPDATE_TRAINER,
  UPDATE_TRAINER_SUCCESS,
  UPDATE_TRAINER_FAIL,
  DELETE_TRAINER,
  DELETE_TRAINER_SUCCESS,
  DELETE_TRAINER_FAIL,
} from "./actionTypes";

export const getTrainers = trainers => ({
  type: GET_TRAINERS,
  payload: trainers,
});

export const getTrainersSuccess = trainers => ({
  type: GET_TRAINERS_SUCCESS,
  payload: trainers,
});

export const getTrainersFail = error => ({
  type: GET_TRAINERS_FAIL,
  payload: error,
});

export const getTrainerDeletedValue = () => ({
  type: GET_TRAINER_DELETED_VALUE,
});

export const getTrainerDeletedValueSuccess = trainer => ({
  type: GET_TRAINER_DELETED_VALUE_SUCCESS,
  payload: trainer,
});

export const getTrainerDeletedValueFail = error => ({
  type: GET_TRAINER_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewTrainer = trainer => ({
  type: ADD_NEW_TRAINER,
  payload: trainer,
});

export const addTrainerSuccess = trainer => ({
  type: ADD_TRAINER_SUCCESS,
  payload: trainer,
});

export const addTrainerFail = error => ({
  type: ADD_TRAINER_FAIL,
  payload: error,
});

export const updateTrainer = trainer => {
  return {
    type: UPDATE_TRAINER,
    payload: trainer,
  };
};

export const updateTrainerSuccess = trainer => ({
  type: UPDATE_TRAINER_SUCCESS,
  payload: trainer,
});

export const updateTrainerFail = error => ({
  type: UPDATE_TRAINER_FAIL,
  payload: error,
});

export const deleteTrainer = trainer => ({
  type: DELETE_TRAINER,
  payload: trainer,
});

export const deleteTrainerSuccess = trainer => ({
  type: DELETE_TRAINER_SUCCESS,
  payload: trainer,
});

export const deleteTrainerFail = error => ({
  type: DELETE_TRAINER_FAIL,
  payload: error,
});
