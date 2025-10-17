import {
  GET_CHECKED_GRADES,
  GET_CHECKED_GRADES_FAIL,
  GET_CHECKED_GRADES_SUCCESS,
  UPDATE_CHECKED_GRADE,
  UPDATE_CHECKED_GRADE_SUCCESS,
  UPDATE_CHECKED_GRADE_FAIL,
  IMPORT_CHECKED_GRADES,
  IMPORT_CHECKED_GRADES_SUCCESS,
  IMPORT_CHECKED_GRADES_FAIL,
} from "./actionTypes";

export const importCheckedGrades = chGrades => ({
  type: IMPORT_CHECKED_GRADES,
  payload: chGrades,
});

export const importCheckedGradesSuccess = chGrades => ({
  type: IMPORT_CHECKED_GRADES_SUCCESS,
  payload: chGrades,
});

export const importCheckedGradesFail = error => ({
  type: IMPORT_CHECKED_GRADES_FAIL,
  payload: error,
});

export const getCheckedGrades = grades => ({
  type: GET_CHECKED_GRADES,
  payload: grades,
});

export const getCheckedGradesSuccess = grades => ({
  type: GET_CHECKED_GRADES_SUCCESS,
  payload: grades,
});

export const getCheckedGradesFail = error => ({
  type: GET_CHECKED_GRADES_FAIL,
  payload: error,
});

export const updateCheckedGrade = grade => {
  return {
    type: UPDATE_CHECKED_GRADE,
    payload: grade,
  };
};

export const updateCheckedGradeSuccess = grade => ({
  type: UPDATE_CHECKED_GRADE_SUCCESS,
  payload: grade,
});

export const updateCheckedGradeFail = error => ({
  type: UPDATE_CHECKED_GRADE_FAIL,
  payload: error,
});
