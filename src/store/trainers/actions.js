import {
GET_TRAINERS,
GET_TRAINERS_FAIL,
GET_TRAINERS_SUCCESS,
ADD_NEW_TRAINER,
ADD_TRAINER_FAIL,
ADD_TRAINER_SUCCESS,
UPDATE_TRAINER,
UPDATE_TRAINER_FAIL,
UPDATE_TRAINER_SUCCESS,
DELETE_TRAINER,
DELETE_TRAINER_SUCCESS,
DELETE_TRAINER_FAIL,
GET_TRAINER_DELETED_VALUE,
GET_TRAINER_DELETED_VALUE_FAIL,
GET_TRAINER_DELETED_VALUE_SUCCESS,
  } from "./actionTypes";
  
  export const getTrainers = () => ({
    type: GET_TRAINERS,
  });
  
  export const getTrainersSuccess = warnings => ({
    type: GET_TRAINERS_SUCCESS,
    payload: warnings,
  });
  
  export const getTrainersFail = error => ({
    type: GET_TRAINERS_FAIL,
    payload: error,
  });
  
  
  export const addNewTrainer = warning => ({
    type: ADD_NEW_TRAINER,
    payload: warning,
  });
  
  export const addTrainerSuccess = warning => ({
    type: ADD_TRAINER_SUCCESS,
    payload: warning,
  });
  
  export const addTrainerFail = error => ({
    type: ADD_TRAINER_FAIL,
    payload: error,
  });
  
  export const updateTrainer = warning => {
    return {
      type: UPDATE_TRAINER,
      payload: warning,
    };
  };
  
  export const updateTrainerSuccess = warning => ({
    type: UPDATE_TRAINER_SUCCESS,
    payload: warning,
  });
  
  export const updateTrainerFail = error => ({
    type: UPDATE_TRAINER_FAIL,
    payload: error,
  });
  
  export const deleteTrainer = warning => ({
    type: DELETE_TRAINER,
    payload: warning,
  });
  
  export const deleteTrainerSuccess = warning => ({
    type: DELETE_TRAINER_SUCCESS,
    payload: warning,
  });
  
  export const deleteTrainerFail = error => ({
    type: DELETE_TRAINER_FAIL,
    payload: error,
  });
  
  
export const getTrainerDeletedValue = () => ({
  type: GET_TRAINER_DELETED_VALUE,
});

export const getTrainerDeletedValueSuccess = deleted => ({
  type: GET_TRAINER_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getTrainerDeletedValueFail = error => ({
  type: GET_TRAINER_DELETED_VALUE_FAIL,
  payload: error,
});