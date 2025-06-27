import {
  GET_TRAINING_FORMATS,
  GET_TRAINING_FORMATS_SUCCESS,
  GET_TRAINING_FORMATS_FAIL,
  GET_TRAINING_FORMAT_DELETED_VALUE,
  GET_TRAINING_FORMAT_DELETED_VALUE_SUCCESS,
  GET_TRAINING_FORMAT_DELETED_VALUE_FAIL,
  ADD_NEW_TRAINING_FORMAT,
  ADD_TRAINING_FORMAT_SUCCESS,
  ADD_TRAINING_FORMAT_FAIL,
  UPDATE_TRAINING_FORMAT,
  UPDATE_TRAINING_FORMAT_SUCCESS,
  UPDATE_TRAINING_FORMAT_FAIL,
  DELETE_TRAINING_FORMAT,
  DELETE_TRAINING_FORMAT_SUCCESS,
  DELETE_TRAINING_FORMAT_FAIL,
} from "./actionTypes"

// Get all training formats
export const getTrainingFormats = () => ({
  type: GET_TRAINING_FORMATS,
})

export const getTrainingFormatsSuccess = trainingFormats => ({
  type: GET_TRAINING_FORMATS_SUCCESS,
  payload: trainingFormats,
})

export const getTrainingFormatsFail = error => ({
  type: GET_TRAINING_FORMATS_FAIL,
  payload: error,
})

// Get deleted training format value
export const getTrainingFormatDeletedValue = () => ({
  type: GET_TRAINING_FORMAT_DELETED_VALUE,
})

export const getTrainingFormatDeletedValueSuccess = trainingFormat => ({
  type: GET_TRAINING_FORMAT_DELETED_VALUE_SUCCESS,
  payload: trainingFormat,
})

export const getTrainingFormatDeletedValueFail = error => ({
  type: GET_TRAINING_FORMAT_DELETED_VALUE_FAIL,
  payload: error,
})

// Add new training format
export const addNewTrainingFormat = trainingFormat => ({
  type: ADD_NEW_TRAINING_FORMAT,
  payload: trainingFormat,
})

export const addTrainingFormatSuccess = trainingFormat => ({
  type: ADD_TRAINING_FORMAT_SUCCESS,
  payload: trainingFormat,
})

export const addTrainingFormatFail = error => ({
  type: ADD_TRAINING_FORMAT_FAIL,
  payload: error,
})

// Update training format
export const updateTrainingFormat = trainingFormat => ({
  type: UPDATE_TRAINING_FORMAT,
  payload: trainingFormat,
})

export const updateTrainingFormatSuccess = trainingFormat => ({
  type: UPDATE_TRAINING_FORMAT_SUCCESS,
  payload: trainingFormat,
})

export const updateTrainingFormatFail = error => ({
  type: UPDATE_TRAINING_FORMAT_FAIL,
  payload: error,
})

// Delete training format
export const deleteTrainingFormat = trainingFormat => ({
  type: DELETE_TRAINING_FORMAT,
  payload: trainingFormat,
})

export const deleteTrainingFormatSuccess = trainingFormat => ({
  type: DELETE_TRAINING_FORMAT_SUCCESS,
  payload: trainingFormat,
})

export const deleteTrainingFormatFail = error => ({
  type: DELETE_TRAINING_FORMAT_FAIL,
  payload: error,
})
