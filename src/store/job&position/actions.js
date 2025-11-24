import { nationalities } from "common/data";
import {
  GET_POSITIONS,
  GET_POSITIONS_FAIL,
  GET_POSITIONS_SUCCESS,
  ADD_NEW_POSITION,
  ADD_POSITION_SUCCESS,
  ADD_POSITION_FAIL,
  UPDATE_POSITION,
  UPDATE_POSITION_SUCCESS,
  UPDATE_POSITION_FAIL,
  GET_POSITION_DELETED_VALUE,
  GET_POSITION_DELETED_VALUE_SUCCESS,
  GET_POSITION_DELETED_VALUE_FAIL,
  DELETE_POSITION,
  DELETE_POSITION_SUCCESS,
  DELETE_POSITION_FAIL,
  GET_POSITION_TYPES,
  GET_POSITION_TYPES_FAIL,
  GET_POSITION_TYPES_SUCCESS,
  GET_POSITIONS_OPT,
  GET_POSITIONS_OPT_FAIL,
  GET_POSITIONS_OPT_SUCCESS,
  ADD_NEW_JOB_TITLE,
  ADD_JOB_TITLE_SUCCESS,
  ADD_JOB_TITLE_FAIL,
  UPDATE_JOB_TITLE,
  UPDATE_JOB_TITLE_SUCCESS,
  UPDATE_JOB_TITLE_FAIL,
  DELETE_JOB_TITLE,
  DELETE_JOB_TITLE_SUCCESS,
  DELETE_JOB_TITLE_FAIL,
} from "./actionTypes";

export const getPositions = positions => ({
  type: GET_POSITIONS,
  payload: positions,
});

export const getPositionsSuccess = positions => ({
  type: GET_POSITIONS_SUCCESS,
  payload: positions,
});

export const getPositionsFail = error => ({
  type: GET_POSITIONS_FAIL,
  payload: error,
});

export const getPositionDeletedValue = () => ({
  type: GET_POSITION_DELETED_VALUE,
});

export const getPositionDeletedValueSuccess = position => ({
  type: GET_POSITION_DELETED_VALUE_SUCCESS,
  payload: position,
});

export const getPositionDeletedValueFail = error => ({
  type: GET_POSITION_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewPosition = position => ({
  type: ADD_NEW_POSITION,
  payload: position,
});

export const addPositionSuccess = position => ({
  type: ADD_POSITION_SUCCESS,
  payload: position,
});

export const addPositionFail = error => ({
  type: ADD_POSITION_FAIL,
  payload: error,
});

export const updatePosition = position => {
  return {
    type: UPDATE_POSITION,
    payload: position,
  };
};

export const updatePositionSuccess = position => ({
  type: UPDATE_POSITION_SUCCESS,
  payload: position,
});

export const updatePositionFail = error => ({
  type: UPDATE_POSITION_FAIL,
  payload: error,
});

export const deletePosition = position => ({
  type: DELETE_POSITION,
  payload: position,
});

export const deletePositionSuccess = position => ({
  type: DELETE_POSITION_SUCCESS,
  payload: position,
});

export const deletePositionFail = error => ({
  type: DELETE_POSITION_FAIL,
  payload: error,
});

export const getPositionTypes = () => ({
  type: GET_POSITION_TYPES,
});

export const getPositionTypesSuccess = positions => ({
  type: GET_POSITION_TYPES_SUCCESS,
  payload: positions,
});

export const getPositionTypesFail = error => ({
  type: GET_POSITION_TYPES_FAIL,
  payload: error,
});

export const getPositionsOpt = () => ({
  type: GET_POSITIONS_OPT,
});

export const getPositionsOptSuccess = positions => ({
  type: GET_POSITIONS_OPT_SUCCESS,
  payload: positions,
});

export const getPositionsOptFail = error => ({
  type: GET_POSITIONS_OPT_FAIL,
  payload: error,
});

export const addNewJobTitle = jobTitle => ({
  type: ADD_NEW_JOB_TITLE,
  payload: jobTitle,
});

export const addJobTitleSuccess = jobTitle => ({
  type: ADD_JOB_TITLE_SUCCESS,
  payload: jobTitle,
});

export const addJobTitleFail = error => ({
  type: ADD_JOB_TITLE_FAIL,
  payload: error,
});

export const updateJobTitle = jobTitle => {
  return {
    type: UPDATE_JOB_TITLE,
    payload: jobTitle,
  };
};

export const updateJobTitleSuccess = jobTitle => ({
  type: UPDATE_JOB_TITLE_SUCCESS,
  payload: jobTitle,
});

export const updateJobTitleFail = error => ({
  type: UPDATE_JOB_TITLE_FAIL,
  payload: error,
});

export const deleteJobTitle = jobTitle => ({
  type: DELETE_JOB_TITLE,
  payload: jobTitle,
});

export const deleteJobTitleSuccess = jobTitle => ({
  type: DELETE_JOB_TITLE_SUCCESS,
  payload: jobTitle,
});

export const deleteJobTitleFail = error => ({
  type: DELETE_JOB_TITLE_FAIL,
  payload: error,
});
