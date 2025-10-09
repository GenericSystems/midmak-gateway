import {
  GET_DISMISS_DECREE_EXAM_DELETED_VALUE,
  GET_DISMISS_DECREE_EXAM_DELETED_VALUE_FAIL,
  GET_DISMISS_DECREE_EXAM_DELETED_VALUE_SUCCESS,
  GET_DISMISS_DECREES_EXAM,
  GET_DISMISS_DECREES_EXAM_FAIL,
  GET_DISMISS_DECREES_EXAM_SUCCESS,
  ADD_NEW_DISMISS_DECREE_EXAM,
  ADD_DISMISS_DECREE_EXAM_SUCCESS,
  ADD_DISMISS_DECREE_EXAM_FAIL,
  UPDATE_DISMISS_DECREE_EXAM,
  UPDATE_DISMISS_DECREE_EXAM_SUCCESS,
  UPDATE_DISMISS_DECREE_EXAM_FAIL,
  DELETE_DISMISS_DECREE_EXAM,
  DELETE_DISMISS_DECREE_EXAM_SUCCESS,
  DELETE_DISMISS_DECREE_EXAM_FAIL,
} from "./actionTypes";

export const getDismissDecreesExam = () => ({
  type: GET_DISMISS_DECREES_EXAM,
});

export const getDismissDecreesExamSuccess = dismissDecreesExam => ({
  type: GET_DISMISS_DECREES_EXAM_SUCCESS,
  payload: dismissDecreesExam,
});

export const getDismissDecreesExamFail = error => ({
  type: GET_DISMISS_DECREES_EXAM_FAIL,
  payload: error,
});

export const getDismissDecreeExamDeletedValue = () => ({
  type: GET_DISMISS_DECREE_EXAM_DELETED_VALUE,
});

export const getDismissDecreeExamDeletedValueSuccess = dismissDecreeExam => ({
  type: GET_DISMISS_DECREE_EXAM_DELETED_VALUE_SUCCESS,
  payload: dismissDecreeExam,
});

export const getDismissDecreeExamDeletedValueFail = error => ({
  type: GET_DISMISS_DECREE_EXAM_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewDismissDecreeExam = dismissDecreeExam => ({
  type: ADD_NEW_DISMISS_DECREE_EXAM,
  payload: dismissDecreeExam,
});

export const addDismissDecreeExamSuccess = dismissDecreeExam => ({
  type: ADD_DISMISS_DECREE_EXAM_SUCCESS,
  payload: dismissDecreeExam,
});

export const addDismissDecreeExamFail = error => ({
  type: ADD_DISMISS_DECREE_EXAM_FAIL,
  payload: error,
});

export const updateDismissDecreeExam = dismissDecreeExam => ({
  type: UPDATE_DISMISS_DECREE_EXAM,
  payload: dismissDecreeExam,
});

export const updateDismissDecreeExamSuccess = dismissDecreeExam => ({
  type: UPDATE_DISMISS_DECREE_EXAM_SUCCESS,
  payload: dismissDecreeExam,
});

export const updateDismissDecreeExamFail = error => ({
  type: UPDATE_DISMISS_DECREE_EXAM_FAIL,
  payload: error,
});

export const deleteDismissDecreeExam = dismissDecreeExam => ({
  type: DELETE_DISMISS_DECREE_EXAM,
  payload: dismissDecreeExam,
});

export const deleteDismissDecreeExamSuccess = dismissDecreeExam => ({
  type: DELETE_DISMISS_DECREE_EXAM_SUCCESS,
  payload: dismissDecreeExam,
});

export const deleteDismissDecreeExamFail = error => ({
  type: DELETE_DISMISS_DECREE_EXAM_FAIL,
  payload: error,
});
