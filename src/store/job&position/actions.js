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
} from "./actionTypes";

export const getPositions = () => ({
  type: GET_POSITIONS,
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
