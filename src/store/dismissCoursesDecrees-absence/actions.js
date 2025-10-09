import {
  GET_DISMISS_DECREE_ABSENCE_DELETED_VALUE,
  GET_DISMISS_DECREE_ABSENCE_DELETED_VALUE_FAIL,
  GET_DISMISS_DECREE_ABSENCE_DELETED_VALUE_SUCCESS,
  GET_DISMISS_DECREES_ABSENCE,
  GET_DISMISS_DECREES_ABSENCE_FAIL,
  GET_DISMISS_DECREES_ABSENCE_SUCCESS,
  ADD_NEW_DISMISS_DECREE_ABSENCE,
  ADD_DISMISS_DECREE_ABSENCE_SUCCESS,
  ADD_DISMISS_DECREE_ABSENCE_FAIL,
  UPDATE_DISMISS_DECREE_ABSENCE,
  UPDATE_DISMISS_DECREE_ABSENCE_SUCCESS,
  UPDATE_DISMISS_DECREE_ABSENCE_FAIL,
  DELETE_DISMISS_DECREE_ABSENCE,
  DELETE_DISMISS_DECREE_ABSENCE_SUCCESS,
  DELETE_DISMISS_DECREE_ABSENCE_FAIL,
} from "./actionTypes";

export const getDismissDecreesAbsence = () => ({
  type: GET_DISMISS_DECREES_ABSENCE,
});

export const getDismissDecreesAbsenceSuccess = dismissDecreesAbsence => ({
  type: GET_DISMISS_DECREES_ABSENCE_SUCCESS,
  payload: dismissDecreesAbsence,
});

export const getDismissDecreesAbsenceFail = error => ({
  type: GET_DISMISS_DECREES_ABSENCE_FAIL,
  payload: error,
});

export const getDismissDecreeAbsenceDeletedValue = () => ({
  type: GET_DISMISS_DECREE_ABSENCE_DELETED_VALUE,
});

export const getDismissDecreeAbsenceDeletedValueSuccess =
  dismissDecreeAbsence => ({
    type: GET_DISMISS_DECREE_ABSENCE_DELETED_VALUE_SUCCESS,
    payload: dismissDecreeAbsence,
  });

export const getDismissDecreeAbsenceDeletedValueFail = error => ({
  type: GET_DISMISS_DECREE_ABSENCE_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewDismissDecreeAbsence = dismissDecreeAbsence => ({
  type: ADD_NEW_DISMISS_DECREE_ABSENCE,
  payload: dismissDecreeAbsence,
});

export const addDismissDecreeAbsenceSuccess = dismissDecreeAbsence => ({
  type: ADD_DISMISS_DECREE_ABSENCE_SUCCESS,
  payload: dismissDecreeAbsence,
});

export const addDismissDecreeAbsenceFail = error => ({
  type: ADD_DISMISS_DECREE_ABSENCE_FAIL,
  payload: error,
});

export const updateDismissDecreeAbsence = dismissDecreeAbsence => ({
  type: UPDATE_DISMISS_DECREE_ABSENCE,
  payload: dismissDecreeAbsence,
});

export const updateDismissDecreeAbsenceSuccess = dismissDecreeAbsence => ({
  type: UPDATE_DISMISS_DECREE_ABSENCE_SUCCESS,
  payload: dismissDecreeAbsence,
});

export const updateDismissDecreeAbsenceFail = error => ({
  type: UPDATE_DISMISS_DECREE_ABSENCE_FAIL,
  payload: error,
});

export const deleteDismissDecreeAbsence = dismissDecreeAbsence => ({
  type: DELETE_DISMISS_DECREE_ABSENCE,
  payload: dismissDecreeAbsence,
});

export const deleteDismissDecreeAbsenceSuccess = dismissDecreeAbsence => ({
  type: DELETE_DISMISS_DECREE_ABSENCE_SUCCESS,
  payload: dismissDecreeAbsence,
});

export const deleteDismissDecreeAbsenceFail = error => ({
  type: DELETE_DISMISS_DECREE_ABSENCE_FAIL,
  payload: error,
});
