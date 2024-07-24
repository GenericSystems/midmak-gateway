import {
  GET_STUDENTS,
  GET_STUDENTS_FAIL,
  GET_STUDENTS_SUCCESS,
  ADD_NEW_STUDENT,
  ADD_STUDENT_SUCCESS,
  ADD_STUDENT_FAIL,
  UPDATE_STUDENT,
  UPDATE_STUDENT_SUCCESS,
  UPDATE_STUDENT_FAIL,
  DELETE_STUDENT,
  DELETE_STUDENT_SUCCESS,
  DELETE_STUDENT_FAIL,
  GET_STUDENT_BY_ID,
  GET_STUDENT_BY_ID_SUCCESS,
  GET_STUDENT_BY_ID_FAIL,
  GET_DEFAULT_REGREQDOCS,
  GET_DEFAULT_REGREQDOCS_FAIL,
  GET_DEFAULT_REGREQDOCS_SUCCESS,
  GENERATE_STUDENT,
  GENERATE_STUDENT_SUCCESS,
  GENERATE_STUDENT_FAIL,
  GET_STUDENT_DELETED_VALUE,
  GET_STUDENT_DELETED_VALUE_FAIL,
  GET_STUDENT_DELETED_VALUE_SUCCESS,
  GET_TEMP_RELATIVES,
  GET_TEMP_RELATIVES_SUCCESS,
  GET_TEMP_RELATIVES_FAIL,
  GET_TEMP_RELATIVE_DELETED_VALUE,
  GET_TEMP_RELATIVE_DELETED_VALUE_SUCCESS,
  GET_TEMP_RELATIVE_DELETED_VALUE_FAIL,

} from "./actionTypes";

export const getStudents = () => ({
  type: GET_STUDENTS,
});

export const getStudentsSuccess = students => ({
  type: GET_STUDENTS_SUCCESS,
  payload: students,
});

export const getStudentsFail = error => ({
  type: GET_STUDENTS_FAIL,
  payload: error,
});

export const addNewStudent = student => ({
  type: ADD_NEW_STUDENT,
  payload: student,
});

export const addStudentSuccess = student => ({
  type: ADD_STUDENT_SUCCESS,
  payload: student,
});

export const addStudentFail = error => ({
  type: ADD_STUDENT_FAIL,
  payload: error,
});

export const updateStudent = student => ({
  type: UPDATE_STUDENT,
  payload: student,
});

export const updateStudentSuccess = student => ({
  type: UPDATE_STUDENT_SUCCESS,
  payload: student,
});

export const updateStudentFail = error => ({
  type: UPDATE_STUDENT_FAIL,
  payload: error,
});

export const deleteStudent = student => ({
  type: DELETE_STUDENT,
  payload: student,
});

export const deleteStudentSuccess = student => ({
  type: DELETE_STUDENT_SUCCESS,
  payload: student,
});

export const deleteStudentFail = error => ({
  type: DELETE_STUDENT_FAIL,
  payload: error,
});

export const getStudentById = tempStudent => ({
  type: GET_STUDENT_BY_ID,
  payload: tempStudent,
});

export const getStudentByIdSuccess = tempStudent => ({
  type: GET_STUDENT_BY_ID_SUCCESS,
  payload: tempStudent,
});

export const getStudentByIdFail = error => ({
  type: GET_STUDENT_BY_ID_FAIL,
  payload: error,
});

export const getDefaultRegReqDocs = year => ({
  type: GET_DEFAULT_REGREQDOCS,
  payload: year,
});

export const getDefaultRegReqDocsSuccess = year => ({
  type: GET_DEFAULT_REGREQDOCS_SUCCESS,
  payload: year,
});

export const getDefaultRegReqDocsFail = error => ({
  type: GET_DEFAULT_REGREQDOCS_FAIL,
  payload: error,
});

export const generateStudent = student => ({
  type: GENERATE_STUDENT,
  payload: student,
});

export const generateStudentSuccess = student => ({
  type: GENERATE_STUDENT_SUCCESS,
  payload: student,
});

export const generateStudentFail = error => ({
  type: GENERATE_STUDENT_FAIL,
  payload: error,
});

export const getStudentDeletedValue = () => ({
  type: GET_STUDENT_DELETED_VALUE,
});

export const getStudentDeletedValueSuccess = deleted => ({
  type: GET_STUDENT_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getStudentDeletedValueFail = error => ({
  type: GET_STUDENT_DELETED_VALUE_FAIL,
  payload: error,
});



export const getTempRelatives = tempRelative => ({
  type: GET_TEMP_RELATIVES,
  payload:tempRelative
});

export const getTempRelativesSuccess = students => ({
  type: GET_TEMP_RELATIVES_SUCCESS,
  payload: students,
});

export const getTempRelativesFail = error => ({
  type: GET_TEMP_RELATIVES_FAIL,
  payload: error,
});

export const getTempRelativeDeletedValue = () => ({
  type: GET_TEMP_RELATIVE_DELETED_VALUE,
});

export const getTempRelativeDeletedValueSuccess = deleted => ({
  type: GET_TEMP_RELATIVE_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getTempRelativeDeletedValueFail = error => ({
  type: GET_TEMP_RELATIVE_DELETED_VALUE_FAIL,
  payload: error,
});


