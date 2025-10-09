import {
  GET_DISMISS_DECREE_OTHER_DELETED_VALUE,
  GET_DISMISS_DECREE_OTHER_DELETED_VALUE_FAIL,
  GET_DISMISS_DECREE_OTHER_DELETED_VALUE_SUCCESS,
  GET_DISMISS_DECREES_OTHER,
  GET_DISMISS_DECREES_OTHER_FAIL,
  GET_DISMISS_DECREES_OTHER_SUCCESS,
  ADD_NEW_DISMISS_DECREE_OTHER,
  ADD_DISMISS_DECREE_OTHER_SUCCESS,
  ADD_DISMISS_DECREE_OTHER_FAIL,
  UPDATE_DISMISS_DECREE_OTHER,
  UPDATE_DISMISS_DECREE_OTHER_SUCCESS,
  UPDATE_DISMISS_DECREE_OTHER_FAIL,
  DELETE_DISMISS_DECREE_OTHER,
  DELETE_DISMISS_DECREE_OTHER_SUCCESS,
  DELETE_DISMISS_DECREE_OTHER_FAIL,
} from "./actionTypes";

export const getDismissDecreesOther = () => ({
  type: GET_DISMISS_DECREES_OTHER,
});

export const getDismissDecreesOtherSuccess = dismissDecreesOther => ({
  type: GET_DISMISS_DECREES_OTHER_SUCCESS,
  payload: dismissDecreesOther,
});

export const getDismissDecreesOtherFail = error => ({
  type: GET_DISMISS_DECREES_OTHER_FAIL,
  payload: error,
});

export const getDismissDecreeOtherDeletedValue = () => ({
  type: GET_DISMISS_DECREE_OTHER_DELETED_VALUE,
});

export const getDismissDecreeOtherDeletedValueSuccess = dismissDecreeOther => ({
  type: GET_DISMISS_DECREE_OTHER_DELETED_VALUE_SUCCESS,
  payload: dismissDecreeOther,
});

export const getDismissDecreeOtherDeletedValueFail = error => ({
  type: GET_DISMISS_DECREE_OTHER_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewDismissDecreeOther = dismissDecreeOther => ({
  type: ADD_NEW_DISMISS_DECREE_OTHER,
  payload: dismissDecreeOther,
});

export const addDismissDecreeOtherSuccess = dismissDecreeOther => ({
  type: ADD_DISMISS_DECREE_OTHER_SUCCESS,
  payload: dismissDecreeOther,
});

export const addDismissDecreeOtherFail = error => ({
  type: ADD_DISMISS_DECREE_OTHER_FAIL,
  payload: error,
});

export const updateDismissDecreeOther = dismissDecreeOther => ({
  type: UPDATE_DISMISS_DECREE_OTHER,
  payload: dismissDecreeOther,
});

export const updateDismissDecreeOtherSuccess = dismissDecreeOther => ({
  type: UPDATE_DISMISS_DECREE_OTHER_SUCCESS,
  payload: dismissDecreeOther,
});

export const updateDismissDecreeOtherFail = error => ({
  type: UPDATE_DISMISS_DECREE_OTHER_FAIL,
  payload: error,
});

export const deleteDismissDecreeOther = dismissDecreeOther => ({
  type: DELETE_DISMISS_DECREE_OTHER,
  payload: dismissDecreeOther,
});

export const deleteDismissDecreeOtherSuccess = dismissDecreeOther => ({
  type: DELETE_DISMISS_DECREE_OTHER_SUCCESS,
  payload: dismissDecreeOther,
});

export const deleteDismissDecreeOtherFail = error => ({
  type: DELETE_DISMISS_DECREE_OTHER_FAIL,
  payload: error,
});
