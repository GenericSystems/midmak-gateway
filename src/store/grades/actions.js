import {
  GET_GRADES,
  GET_GRADES_FAIL,
  GET_GRADES_SUCCESS,
  GET_FILTERED_GRADES,
  GET_FILTERED_GRADES_FAIL,
  GET_FILTERED_GRADES_SUCCESS,
  ADD_NEW_GRADE,
  ADD_GRADE_SUCCESS,
  ADD_GRADE_FAIL,
  UPDATE_GRADE,
  UPDATE_GRADE_SUCCESS,
  UPDATE_GRADE_FAIL,
  DELETE_GRADE,
  DELETE_GRADE_SUCCESS,
  DELETE_GRADE_FAIL,
  GET_GRADE_DELETED_VALUE,
  GET_GRADE_DELETED_VALUE_FAIL,
  GET_GRADE_DELETED_VALUE_SUCCESS,
} from "./actionTypes";

export const getGrades = Grades => ({
  type: GET_GRADES,
  payload: Grades,
});

export const getGradesSuccess = Grades => ({
  type: GET_GRADES_SUCCESS,
  payload: Grades,
});

export const getGradesFail = error => ({
  type: GET_GRADES_FAIL,
  payload: error,
});

export const getFilteredGrades = Grades => ({
  type: GET_FILTERED_GRADES,
  payload: Grades,
});

export const getFilteredGradesSuccess = Grades => ({
  type: GET_FILTERED_GRADES_SUCCESS,
  payload: Grades,
});

export const getFilteredGradesFail = error => ({
  type: GET_FILTERED_GRADES_FAIL,
  payload: error,
});

export const addNewGrade = Grade => ({
  type: ADD_NEW_GRADE,
  payload: Grade,
});

export const addGradeSuccess = Grade => ({
  type: ADD_GRADE_SUCCESS,
  payload: Grade,
});

export const addGradeFail = error => ({
  type: ADD_GRADE_FAIL,
  payload: error,
});

export const updateGrade = Grade => {
  return {
    type: UPDATE_GRADE,
    payload: Grade,
  };
};

export const updateGradeSuccess = Grade => ({
  type: UPDATE_GRADE_SUCCESS,
  payload: Grade,
});

export const updateGradeFail = error => ({
  type: UPDATE_GRADE_FAIL,
  payload: error,
});

export const deleteGrade = Grade => ({
  type: DELETE_GRADE,
  payload: Grade,
});

export const deleteGradeSuccess = Grade => ({
  type: DELETE_GRADE_SUCCESS,
  payload: Grade,
});

export const deleteGradeFail = error => ({
  type: DELETE_GRADE_FAIL,
  payload: error,
});

export const getGradeDeletedValue = () => ({
  type: GET_GRADE_DELETED_VALUE,
});

export const getGradeDeletedValueSuccess = deleted => ({
  type: GET_GRADE_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getGradeDeletedValueFail = error => ({
  type: GET_GRADE_DELETED_VALUE_FAIL,
  payload: error,
});
