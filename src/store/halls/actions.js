import {
  GET_HALL_DELETED_VALUE,
  GET_HALL_DELETED_VALUE_FAIL,
  GET_HALL_DELETED_VALUE_SUCCESS,
  GET_HALLS,
  GET_HALLS_FAIL,
  GET_HALLS_SUCCESS,
  ADD_NEW_HALL,
  ADD_HALL_SUCCESS,
  ADD_HALL_FAIL,
  UPDATE_HALL,
  UPDATE_HALL_SUCCESS,
  UPDATE_HALL_FAIL,
  DELETE_HALL,
  DELETE_HALL_SUCCESS,
  DELETE_HALL_FAIL,
} from "./actionTypes";

export const getHalls = halls => ({
  type: GET_HALLS,
  payload:halls
});

export const getHallsSuccess = halls => ({
  type: GET_HALLS_SUCCESS,
  payload: halls,
});

export const getHallsFail = error => ({
  type: GET_HALLS_FAIL,
  payload: error,
});

export const getHallDeletedValue = () => ({
  type: GET_HALL_DELETED_VALUE,
});

export const getHallDeletedValueSuccess = HallProfile => ({
  type: GET_HALL_DELETED_VALUE_SUCCESS,
  payload: HallProfile,
});

export const getHallDeletedValueFail = error => ({
  type: GET_HALL_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewHall = hall => ({
  type: ADD_NEW_HALL,
  payload: hall,
});

export const addHallSuccess = hall => ({
  type: ADD_HALL_SUCCESS,
  payload: hall,
});

export const addHallFail = error => ({
  type: ADD_HALL_FAIL,
  payload: error,
});

export const updateHall = hall => {
  return {
    type: UPDATE_HALL,
    payload: hall,
  };
};

export const updateHallSuccess = hall => ({
  type: UPDATE_HALL_SUCCESS,
  payload: hall,
});

export const updateHallFail = error => ({
  type: UPDATE_HALL_FAIL,
  payload: error,
});

export const deleteHall = hall => ({
  type: DELETE_HALL,
  payload: hall,
});

export const deleteHallSuccess = hall => ({
  type: DELETE_HALL_SUCCESS,
  payload: hall,
});

export const deleteHallFail = error => ({
  type: DELETE_HALL_FAIL,
  payload: error,
});
