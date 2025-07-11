import {
  GET_ARCHIVED_GRADES,
  GET_ARCHIVED_GRADES_SUCCESS,
  GET_ARCHIVED_GRADES_FAIL,
  UPDATE_ARCHIVED_GRADE,
  UPDATE_ARCHIVED_GRADE_SUCCESS,
  UPDATE_ARCHIVED_GRADE_FAIL,
} from "./actionTypes";

export const getArchivedGrades = grades => ({
  type: GET_ARCHIVED_GRADES,
  payload: grades,
});

export const getArchivedGradesSuccess = grades => ({
  type: GET_ARCHIVED_GRADES_SUCCESS,
  payload: grades,
});

export const getArchivedGradesFail = error => ({
  type: GET_ARCHIVED_GRADES_FAIL,
  payload: error,
});

export const updateArchivedGrade = grade => ({
  type: UPDATE_ARCHIVED_GRADE,
  payload: grade,
});

export const updateArchivedGradeSuccess = grade => ({
  type: UPDATE_ARCHIVED_GRADE_SUCCESS,
  payload: grade,
});

export const updateArchivedGradeFail = error => ({
  type: UPDATE_ARCHIVED_GRADE_FAIL,
  payload: error,
});
