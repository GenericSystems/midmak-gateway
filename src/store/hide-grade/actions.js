import {
  GET_HIDDEN_GRADE_DELETED_VALUE,
  GET_HIDDEN_GRADE_DELETED_VALUE_FAIL,
  GET_HIDDEN_GRADE_DELETED_VALUE_SUCCESS,
  GET_HIDDEN_GRADES,
  GET_HIDDEN_GRADES_FAIL,
  GET_HIDDEN_GRADES_SUCCESS,
  ADD_NEW_HIDDEN_GRADE,
  ADD_HIDDEN_GRADE_SUCCESS,
  ADD_HIDDEN_GRADE_FAIL,
  UPDATE_HIDDEN_GRADE,
  UPDATE_HIDDEN_GRADE_SUCCESS,
  UPDATE_HIDDEN_GRADE_FAIL,
  DELETE_HIDDEN_GRADE,
  DELETE_HIDDEN_GRADE_SUCCESS,
  DELETE_HIDDEN_GRADE_FAIL,
  GET_HIDE_REASONS,
  GET_HIDE_REASONS_SUCCESS,
  GET_HIDE_REASONS_FAIL
} from "./actionTypes";

export const getHiddenGrades = () => ({
  type: GET_HIDDEN_GRADES,
});

export const getHiddenGradesSuccess = hiddenGrades => ({
  type: GET_HIDDEN_GRADES_SUCCESS,
  payload: hiddenGrades,
});

export const getHiddenGradesFail = error => ({
  type: GET_HIDDEN_GRADES_FAIL,
  payload: error,
});

export const getHideReasons = () => ({
  type: GET_HIDE_REASONS,
});

export const getHideReasonSuccess = hidereasons => ({
  type: GET_HIDE_REASONS_SUCCESS,
  payload: hidereasons,
});

export const getHideReasonFail = error => ({
  type: GET_HIDE_REASONS_FAIL,
  payload: error,
});



export const getHiddenGradeDeletedValue = () => ({
  type: GET_HIDDEN_GRADE_DELETED_VALUE,
});

export const getHiddenGradeDeletedValueSuccess = hiddenGradeProfile => ({
  type: GET_HIDDEN_GRADE_DELETED_VALUE_SUCCESS,
  payload: hiddenGradeProfile,
});

export const getHiddenGradeDeletedValueFail = error => ({
  type: GET_HIDDEN_GRADE_DELETED_VALUE_FAIL,
  payload: error,
});



export const addNewHiddenGrade = hiddenGrade => ({
  type: ADD_NEW_HIDDEN_GRADE,
  payload: hiddenGrade,
});

export const addHiddenGradeSuccess = hiddenGrade => ({
  type: ADD_HIDDEN_GRADE_SUCCESS,
  payload: hiddenGrade,
});

export const addHiddenGradeFail = error => ({
  type: ADD_HIDDEN_GRADE_FAIL,
  payload: error,
});

export const updateHiddenGrade = hiddenGrade => {
  return {
    type: UPDATE_HIDDEN_GRADE,
    payload: hiddenGrade,
  };
};

export const updateHiddenGradeSuccess = hiddenGrade => ({
  type: UPDATE_HIDDEN_GRADE_SUCCESS,
  payload: hiddenGrade,
});

export const updateHiddenGradeFail = error => ({
  type: UPDATE_HIDDEN_GRADE_FAIL,
  payload: error,
});

export const deleteHiddenGrade = hiddenGrade => ({
  type: DELETE_HIDDEN_GRADE,
  payload: hiddenGrade,
});

export const deleteHiddenGradeSuccess = hiddenGrade => ({
  type: DELETE_HIDDEN_GRADE_SUCCESS,
  payload: hiddenGrade,
});

export const deleteHiddenGradeFail = error => ({
  type: DELETE_HIDDEN_GRADE_FAIL,
  payload: error,
});
