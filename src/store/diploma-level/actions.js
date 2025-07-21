import {
  GET_DIPLOMALEVEL_DELETED_VALUE,
  GET_DIPLOMALEVEL_DELETED_VALUE_FAIL,
  GET_DIPLOMALEVEL_DELETED_VALUE_SUCCESS,
  GET_DIPLOMALEVELS,
  GET_DIPLOMALEVELS_FAIL,
  GET_DIPLOMALEVELS_SUCCESS,
  ADD_NEW_DIPLOMALEVEL,
  ADD_DIPLOMALEVEL_SUCCESS,
  ADD_DIPLOMALEVEL_FAIL,
  UPDATE_DIPLOMALEVEL,
  UPDATE_DIPLOMALEVEL_SUCCESS,
  UPDATE_DIPLOMALEVEL_FAIL,
  DELETE_DIPLOMALEVEL,
  DELETE_DIPLOMALEVEL_SUCCESS,
  DELETE_DIPLOMALEVEL_FAIL,
} from "./actionTypes";

// GET
export const getDiplomaLevels = () => ({
  type: GET_DIPLOMALEVELS,
});

export const getDiplomaLevelsSuccess = diplomaLevels => ({
  type: GET_DIPLOMALEVELS_SUCCESS,
  payload: diplomaLevels,
});

export const getDiplomaLevelsFail = error => ({
  type: GET_DIPLOMALEVELS_FAIL,
  payload: error,
});

// GET DELETED VALUE
export const getDiplomaLevelDeletedValue = () => ({
  type: GET_DIPLOMALEVEL_DELETED_VALUE,
});

export const getDiplomaLevelDeletedValueSuccess = diplomaLevelProfile => ({
  type: GET_DIPLOMALEVEL_DELETED_VALUE_SUCCESS,
  payload: diplomaLevelProfile,
});

export const getDiplomaLevelDeletedValueFail = error => ({
  type: GET_DIPLOMALEVEL_DELETED_VALUE_FAIL,
  payload: error,
});

// ADD
export const addNewDiplomaLevel = diplomaLevel => ({
  type: ADD_NEW_DIPLOMALEVEL,
  payload: diplomaLevel,
});

export const addDiplomaLevelSuccess = diplomaLevel => ({
  type: ADD_DIPLOMALEVEL_SUCCESS,
  payload: diplomaLevel,
});

export const addDiplomaLevelFail = error => ({
  type: ADD_DIPLOMALEVEL_FAIL,
  payload: error,
});

// UPDATE
export const updateDiplomaLevel = diplomaLevel => ({
  type: UPDATE_DIPLOMALEVEL,
  payload: diplomaLevel,
});

export const updateDiplomaLevelSuccess = diplomaLevel => ({
  type: UPDATE_DIPLOMALEVEL_SUCCESS,
  payload: diplomaLevel,
});

export const updateDiplomaLevelFail = error => ({
  type: UPDATE_DIPLOMALEVEL_FAIL,
  payload: error,
});

// DELETE
export const deleteDiplomaLevel = diplomaLevel => ({
  type: DELETE_DIPLOMALEVEL,
  payload: diplomaLevel,
});

export const deleteDiplomaLevelSuccess = diplomaLevel => ({
  type: DELETE_DIPLOMALEVEL_SUCCESS,
  payload: diplomaLevel,
});

export const deleteDiplomaLevelFail = error => ({
  type: DELETE_DIPLOMALEVEL_FAIL,
  payload: error,
});
