import {
  GET_CERTIFICATE_GRADES,
  GET_CERTIFICATE_GRADES_FAIL,
  GET_CERTIFICATE_GRADES_SUCCESS,
  GET_FILTERED_CERTIFICATE_GRADES,
  GET_FILTERED_CERTIFICATE_GRADES_FAIL,
  GET_FILTERED_CERTIFICATE_GRADES_SUCCESS,
  ADD_NEW_CERTIFICATE_GRADE,
  ADD_CERTIFICATE_GRADE_SUCCESS,
  ADD_CERTIFICATE_GRADE_FAIL,
  UPDATE_CERTIFICATE_GRADE,
  UPDATE_CERTIFICATE_GRADE_SUCCESS,
  UPDATE_CERTIFICATE_GRADE_FAIL,
  DELETE_CERTIFICATE_GRADE,
  DELETE_CERTIFICATE_GRADE_SUCCESS,
  DELETE_CERTIFICATE_GRADE_FAIL,
  GET_CERTIFICATE_GRADE_DELETED_VALUE,
  GET_CERTIFICATE_GRADE_DELETED_VALUE_FAIL,
  GET_CERTIFICATE_GRADE_DELETED_VALUE_SUCCESS,
} from "./actionTypes";

export const getCertificateGrades = certificateGrades => ({
  type: GET_CERTIFICATE_GRADES,
  payload: certificateGrades,
});

export const getCertificateGradesSuccess = certificateGrades => ({
  type: GET_CERTIFICATE_GRADES_SUCCESS,
  payload: certificateGrades,
});

export const getCertificateGradesFail = error => ({
  type: GET_CERTIFICATE_GRADES_FAIL,
  payload: error,
});

export const getFilteredCertificateGrades = certificateGrades => ({
  type: GET_FILTERED_CERTIFICATE_GRADES,
  payload: certificateGrades,
});

export const getFilteredCertificateGradesSuccess = certificateGrades => ({
  type: GET_FILTERED_CERTIFICATE_GRADES_SUCCESS,
  payload: certificateGrades,
});

export const getFilteredCertificateGradesFail = error => ({
  type: GET_FILTERED_CERTIFICATE_GRADES_FAIL,
  payload: error,
});

export const addNewCertificateGrade = certificateGrade => ({
  type: ADD_NEW_CERTIFICATE_GRADE,
  payload: certificateGrade,
});

export const addCertificateGradeSuccess = certificateGrade => ({
  type: ADD_CERTIFICATE_GRADE_SUCCESS,
  payload: certificateGrade,
});

export const addCertificateGradeFail = error => ({
  type: ADD_CERTIFICATE_GRADE_FAIL,
  payload: error,
});

export const updateCertificateGrade = certificateGrade => ({
  type: UPDATE_CERTIFICATE_GRADE,
  payload: certificateGrade,
});

export const updateCertificateGradeSuccess = certificateGrade => ({
  type: UPDATE_CERTIFICATE_GRADE_SUCCESS,
  payload: certificateGrade,
});

export const updateCertificateGradeFail = error => ({
  type: UPDATE_CERTIFICATE_GRADE_FAIL,
  payload: error,
});

export const deleteCertificateGrade = certificateGrade => ({
  type: DELETE_CERTIFICATE_GRADE,
  payload: certificateGrade,
});

export const deleteCertificateGradeSuccess = certificateGrade => ({
  type: DELETE_CERTIFICATE_GRADE_SUCCESS,
  payload: certificateGrade,
});

export const deleteCertificateGradeFail = error => ({
  type: DELETE_CERTIFICATE_GRADE_FAIL,
  payload: error,
});

export const getCertificateGradeDeletedValue = () => ({
  type: GET_CERTIFICATE_GRADE_DELETED_VALUE,
});

export const getCertificateGradeDeletedValueSuccess = deleted => ({
  type: GET_CERTIFICATE_GRADE_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getCertificateGradeDeletedValueFail = error => ({
  type: GET_CERTIFICATE_GRADE_DELETED_VALUE_FAIL,
  payload: error,
});
