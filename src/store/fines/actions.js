import {
  GET_FINE_DELETED_VALUE,
  GET_FINE_DELETED_VALUE_FAIL,
  GET_FINE_DELETED_VALUE_SUCCESS,
  GET_FINES,
  GET_FINES_FAIL,
  GET_FINES_SUCCESS,
  ADD_NEW_FINE,
  ADD_FINE_SUCCESS,
  ADD_FINE_FAIL,
  UPDATE_FINE,
  UPDATE_FINE_SUCCESS,
  UPDATE_FINE_FAIL,
  DELETE_FINE,
  DELETE_FINE_SUCCESS,
  DELETE_FINE_FAIL,
} from "./actionTypes";

export const getFines = () => ({
  type: GET_FINES,
});

export const getFinesSuccess = fines => ({
  type: GET_FINES_SUCCESS,
  payload: fines,
});

export const getFinesFail = error => ({
  type: GET_FINES_FAIL,
  payload: error,
});

export const getFineDeletedValue = () => ({
  type: GET_FINE_DELETED_VALUE,
});

export const getFineDeletedValueSuccess = deleted => ({
  type: GET_FINE_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getFineDeletedValueFail = error => ({
  type: GET_FINE_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewFine = fine => ({
  type: ADD_NEW_FINE,
  payload: fine,
});

export const addFineSuccess = fine => ({
  type: ADD_FINE_SUCCESS,
  payload: fine,
});

export const addFineFail = error => ({
  type: ADD_FINE_FAIL,
  payload: error,
});

export const updateFine = fine => {
  return {
    type: UPDATE_FINE,
    payload: fine,
  };
};

export const updateFineSuccess = fine => ({
  type: UPDATE_FINE_SUCCESS,
  payload: fine,
});

export const updateFineFail = error => ({
  type: UPDATE_FINE_FAIL,
  payload: error,
});

export const deleteFine = fine => ({
  type: DELETE_FINE,
  payload: fine,
});

export const deleteFineSuccess = fine => ({
  type: DELETE_FINE_SUCCESS,
  payload: fine,
});

export const deleteFineFail = error => ({
  type: DELETE_FINE_FAIL,
  payload: error,
});
