import {
  GET_WRITTEN_WARNING_DECREE_DELETED_VALUE,
  GET_WRITTEN_WARNING_DECREE_DELETED_VALUE_FAIL,
  GET_WRITTEN_WARNING_DECREE_DELETED_VALUE_SUCCESS,
  GET_WRITTEN_WARNING_DECREES,
  GET_WRITTEN_WARNING_DECREES_FAIL,
  GET_WRITTEN_WARNING_DECREES_SUCCESS,
  ADD_NEW_WRITTEN_WARNING_DECREE,
  ADD_WRITTEN_WARNING_DECREE_SUCCESS,
  ADD_WRITTEN_WARNING_DECREE_FAIL,
  UPDATE_WRITTEN_WARNING_DECREE,
  UPDATE_WRITTEN_WARNING_DECREE_SUCCESS,
  UPDATE_WRITTEN_WARNING_DECREE_FAIL,
  DELETE_WRITTEN_WARNING_DECREE,
  DELETE_WRITTEN_WARNING_DECREE_SUCCESS,
  DELETE_WRITTEN_WARNING_DECREE_FAIL,
} from "./actionTypes";

export const getWrittenWarningDecrees = () => ({
  type: GET_WRITTEN_WARNING_DECREES,
});

export const getWrittenWarningDecreesSuccess = writtenWarningDecrees => ({
  type: GET_WRITTEN_WARNING_DECREES_SUCCESS,
  payload: writtenWarningDecrees,
});

export const getWrittenWarningDecreesFail = error => ({
  type: GET_WRITTEN_WARNING_DECREES_FAIL,
  payload: error,
});

export const getWrittenWarningDecreeDeletedValue = () => ({
  type: GET_WRITTEN_WARNING_DECREE_DELETED_VALUE,
});

export const getWrittenWarningDecreeDeletedValueSuccess =
  writtenWarningDecree => ({
    type: GET_WRITTEN_WARNING_DECREE_DELETED_VALUE_SUCCESS,
    payload: writtenWarningDecree,
  });

export const getWrittenWarningDecreeDeletedValueFail = error => ({
  type: GET_WRITTEN_WARNING_DECREE_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewWrittenWarningDecree = writtenWarningDecree => ({
  type: ADD_NEW_WRITTEN_WARNING_DECREE,
  payload: writtenWarningDecree,
});

export const addWrittenWarningDecreeSuccess = writtenWarningDecree => ({
  type: ADD_WRITTEN_WARNING_DECREE_SUCCESS,
  payload: writtenWarningDecree,
});

export const addWrittenWarningDecreeFail = error => ({
  type: ADD_WRITTEN_WARNING_DECREE_FAIL,
  payload: error,
});

export const updateWrittenWarningDecree = writtenWarningDecree => ({
  type: UPDATE_WRITTEN_WARNING_DECREE,
  payload: writtenWarningDecree,
});

export const updateWrittenWarningDecreeSuccess = writtenWarningDecree => ({
  type: UPDATE_WRITTEN_WARNING_DECREE_SUCCESS,
  payload: writtenWarningDecree,
});

export const updateWrittenWarningDecreeFail = error => ({
  type: UPDATE_WRITTEN_WARNING_DECREE_FAIL,
  payload: error,
});

export const deleteWrittenWarningDecree = writtenWarningDecree => ({
  type: DELETE_WRITTEN_WARNING_DECREE,
  payload: writtenWarningDecree,
});

export const deleteWrittenWarningDecreeSuccess = writtenWarningDecree => ({
  type: DELETE_WRITTEN_WARNING_DECREE_SUCCESS,
  payload: writtenWarningDecree,
});

export const deleteWrittenWarningDecreeFail = error => ({
  type: DELETE_WRITTEN_WARNING_DECREE_FAIL,
  payload: error,
});
