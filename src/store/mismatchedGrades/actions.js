import {
  GET_MISMATCHED_GRADE_DELETED_VALUE,
  GET_MISMATCHED_GRADE_DELETED_VALUE_FAIL,
  GET_MISMATCHED_GRADE_DELETED_VALUE_SUCCESS,
  GET_MISMATCHED_GRADES,
  GET_MISMATCHED_GRADES_FAIL,
  GET_MISMATCHED_GRADES_SUCCESS,
  ADD_NEW_MISMATCHED_GRADE,
  ADD_MISMATCHED_GRADE_SUCCESS,
  ADD_MISMATCHED_GRADE_FAIL,
  UPDATE_MISMATCHED_GRADE,
  UPDATE_MISMATCHED_GRADE_SUCCESS,
  UPDATE_MISMATCHED_GRADE_FAIL,
  DELETE_MISMATCHED_GRADE,
  DELETE_MISMATCHED_GRADE_SUCCESS,
  DELETE_MISMATCHED_GRADE_FAIL,
} from "./actionTypes";

export const getMismatchedGrades = () => ({
  type: GET_MISMATCHED_GRADES,
});

export const getMismatchedGradesSuccess = mismatchedGrades => ({
  type: GET_MISMATCHED_GRADES_SUCCESS,
  payload: mismatchedGrades,
});

export const getMismatchedGradesFail = error => ({
  type: GET_MISMATCHED_GRADES_FAIL,
  payload: error,
});

export const getMismatchedGradeDeletedValue = () => ({
  type: GET_MISMATCHED_GRADE_DELETED_VALUE,
});

export const getMismatchedGradeDeletedValueSuccess = courseTypeProfile => ({
  type: GET_MISMATCHED_GRADE_DELETED_VALUE_SUCCESS,
  payload: courseTypeProfile,
});

export const getMismatchedGradeDeletedValueFail = error => ({
  type: GET_MISMATCHED_GRADE_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewMismatchedGrade = courseType => ({
  type: ADD_NEW_MISMATCHED_GRADE,
  payload: courseType,
});

export const addMismatchedGradeSuccess = courseType => ({
  type: ADD_MISMATCHED_GRADE_SUCCESS,
  payload: courseType,
});

export const addMismatchedGradeFail = error => ({
  type: ADD_MISMATCHED_GRADE_FAIL,
  payload: error,
});

export const updateMismatchedGrade = courseType => {
  return {
    type: UPDATE_MISMATCHED_GRADE,
    payload: courseType,
  };
};

export const updateMismatchedGradeSuccess = courseType => ({
  type: UPDATE_MISMATCHED_GRADE_SUCCESS,
  payload: courseType,
});

export const updateMismatchedGradeFail = error => ({
  type: UPDATE_MISMATCHED_GRADE_FAIL,
  payload: error,
});

export const deleteMismatchedGrade = courseType => ({
  type: DELETE_MISMATCHED_GRADE,
  payload: courseType,
});

export const deleteMismatchedGradeSuccess = courseType => ({
  type: DELETE_MISMATCHED_GRADE_SUCCESS,
  payload: courseType,
});

export const deleteMismatchedGradeFail = error => ({
  type: DELETE_MISMATCHED_GRADE_FAIL,
  payload: error,
});
