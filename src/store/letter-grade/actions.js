import {
  GET_LETTER_GRADES,
  GET_LETTER_GRADES_SUCCESS,
  GET_LETTER_GRADES_FAIL,
  ADD_NEW_LETTER_GRADE,
  ADD_LETTER_GRADE_SUCCESS,
  ADD_LETTER_GRADE_FAIL,
  UPDATE_LETTER_GRADE,
  UPDATE_LETTER_GRADE_SUCCESS,
  UPDATE_LETTER_GRADE_FAIL,
  DELETE_LETTER_GRADE,
  DELETE_LETTER_GRADE_SUCCESS,
  DELETE_LETTER_GRADE_FAIL,
  GET_LETTER_GRADE_DETAILS,
  GET_LETTER_GRADE_DETAILS_SUCCESS,
  GET_LETTER_GRADE_DETAILS_FAIL,
  ADD_NEW_LETTER_GRADE_DETAIL,
  ADD_LETTER_GRADE_DETAIL_SUCCESS,
  ADD_LETTER_GRADE_DETAIL_FAIL,
  UPDATE_LETTER_GRADE_DETAIL,
  UPDATE_LETTER_GRADE_DETAIL_SUCCESS,
  UPDATE_LETTER_GRADE_DETAIL_FAIL,
  DELETE_LETTER_GRADE_DETAIL,
  DELETE_LETTER_GRADE_DETAIL_SUCCESS,
  DELETE_LETTER_GRADE_DETAIL_FAIL,
  GET_LETTER_GRADE_DELETED_VALUE,
  GET_LETTER_GRADE_DELETED_VALUE_FAIL,
  GET_LETTER_GRADE_DELETED_VALUE_SUCCESS,
  GET_LETTER_GRADE_DETAILS_DELETED_VALUE,
GET_LETTER_GRADE_DETAILS_DELETED_VALUE_SUCCESS,
GET_LETTER_GRADE_DETAILS_DELETED_VALUE_FAIL,
} from "./actionTypes";

export const getLetterGrades = () => ({
  type: GET_LETTER_GRADES,
});

export const getLetterGradesSuccess = letterGrades => ({
  type: GET_LETTER_GRADES_SUCCESS,
  payload: letterGrades,
});

export const getLetterGradesFail = error => ({
  type: GET_LETTER_GRADES_FAIL,
  payload: error,
});

export const addNewLetterGrade = letterGrade => ({
  type: ADD_NEW_LETTER_GRADE,
  payload: letterGrade,
});

export const addLetterGradeSuccess = letterGrade => ({
  type: ADD_LETTER_GRADE_SUCCESS,
  payload: letterGrade,
});

export const addLetterGradeFail = error => ({
  type: ADD_LETTER_GRADE_FAIL,
  payload: error,
});

export const updateLetterGrade = letterGrade => ({
  type: UPDATE_LETTER_GRADE,
  payload: letterGrade,
});

export const updateLetterGradeSuccess = letterGrade => ({
  type: UPDATE_LETTER_GRADE_SUCCESS,
  payload: letterGrade,
});

export const updateLetterGradeFail = error => ({
  type: UPDATE_LETTER_GRADE_FAIL,
  payload: error,
});

export const deleteLetterGrade = letterGrade => ({
  type: DELETE_LETTER_GRADE,
  payload: letterGrade,
});

export const deleteLetterGradeSuccess = letterGrade => ({
  type: DELETE_LETTER_GRADE_SUCCESS,
  payload: letterGrade,
});

export const deleteLetterGradeFail = error => ({
  type: DELETE_LETTER_GRADE_FAIL,
  payload: error,
});
//letterGradeDetails
export const getLetterGradeDetails = letterId => ({
  type: GET_LETTER_GRADE_DETAILS,
  payload: letterId,
});

export const getLetterGradeDetailsSuccess = letterGradeDetails => ({
  type: GET_LETTER_GRADE_DETAILS_SUCCESS,
  payload: letterGradeDetails,
});

export const getLetterGradeDetailsFail = error => ({
  type: GET_LETTER_GRADE_DETAILS_FAIL,
  payload: error,
});

export const addNewLetterGradeDetail = letterGradeDetail => ({
  type: ADD_NEW_LETTER_GRADE_DETAIL,
  payload: letterGradeDetail,
});

export const addLetterGradeDetailSuccess = letterGradeDetail => ({
  type: ADD_LETTER_GRADE_DETAIL_SUCCESS,
  payload: letterGradeDetail,
});

export const addLetterGradeDetailFail = error => ({
  type: ADD_LETTER_GRADE_DETAIL_FAIL,
  payload: error,
});

export const updateLetterGradeDetail = letterGradeDetail => ({
  type: UPDATE_LETTER_GRADE_DETAIL,
  payload: letterGradeDetail,
});

export const updateLetterGradeDetailSuccess = letterGradeDetail => ({
  type: UPDATE_LETTER_GRADE_DETAIL_SUCCESS,
  payload: letterGradeDetail,
});

export const updateLetterGradeDetailFail = error => ({
  type: UPDATE_LETTER_GRADE_DETAIL_FAIL,
  payload: error,
});

export const deleteLetterGradeDetail = letterGradeDetail => ({
  type: DELETE_LETTER_GRADE_DETAIL,
  payload: letterGradeDetail,
});

export const deleteLetterGradeDetailSuccess = letterGradeDetail => ({
  type: DELETE_LETTER_GRADE_DETAIL_SUCCESS,
  payload: letterGradeDetail,
});

export const deleteLetterGradeDetailFail = error => ({
  type: DELETE_LETTER_GRADE_DETAIL_FAIL,
  payload: error,
});

export const getLetterGradeDeletedValue = () => ({
  type: GET_LETTER_GRADE_DELETED_VALUE,
});

export const getLetterGradeDeletedValueSuccess = deleted => ({
  type: GET_LETTER_GRADE_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getLetterGradeDeletedValueFail = error => ({
  type: GET_LETTER_GRADE_DELETED_VALUE_FAIL,
  payload: error,
});

export const getLetterGradeDetailsDeletedValue = () => ({
  type: GET_LETTER_GRADE_DETAILS_DELETED_VALUE,
});

export const getLetterGradeDetailsDeletedValueSuccess = deletedDetail => ({
  type: GET_LETTER_GRADE_DETAILS_DELETED_VALUE_SUCCESS,
  payload: deletedDetail,
});

export const getLetterGradeDetailsDeletedValueFail = error => ({
  type: GET_LETTER_GRADE_DETAILS_DELETED_VALUE_FAIL,
  payload: error,
});