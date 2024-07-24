import {
  GET_UNIVERSITY_STUDENTS,
  GET_UNIVERSITY_STUDENTS_FAIL,
  GET_UNIVERSITY_STUDENTS_SUCCESS,
  ADD_NEW_UNIVERSITY_STUDENT,
  ADD_UNIVERSITY_STUDENT_SUCCESS,
  ADD_UNIVERSITY_STUDENT_FAIL,
  UPDATE_UNIVERSITY_STUDENT,
  UPDATE_UNIVERSITY_STUDENT_SUCCESS,
  UPDATE_UNIVERSITY_STUDENT_FAIL,
  DELETE_UNIVERSITY_STUDENT,
  DELETE_UNIVERSITY_STUDENT_SUCCESS,
  DELETE_UNIVERSITY_STUDENT_FAIL,
  GET_UNIVERSITY_STUDENT_BY_ID,
  GET_UNIVERSITY_STUDENT_BY_ID_SUCCESS,
  GET_UNIVERSITY_STUDENT_BY_ID_FAIL,
  GET_UNIVERSITY_STUDENT_REGREQDOCS,
  GET_UNIVERSITY_STUDENT_REGREQDOCS_FAIL,
  GET_UNIVERSITY_STUDENT_REGREQDOCS_SUCCESS,
  UPDATE_UNIVERSITY_STUDENT_REGREQDOC,
  UPDATE_UNIVERSITY_STUDENT_REGREQDOC_SUCCESS,
  UPDATE_UNIVERSITY_STUDENT_REGREQDOC_FAIL,
  GET_STUDENTS_OPT,
  GET_STUDENTS_OPT_FAIL,
  GET_STUDENTS_OPT_SUCCESS,
  GET_BROTHERS,
  GET_BROTHERS_FAIL,
  GET_BROTHERS_SUCCESS,
  ADD_BROTHER,
  ADD_BROTHER_SUCCESS,
  ADD_BROTHER_FAIL,
  DELETE_BROTHER,
  DELETE_BROTHER_SUCCESS,
  DELETE_BROTHER_FAIL,
  UPDATE_BROTHER,
  UPDATE_BROTHER_SUCCESS,
  UPDATE_BROTHER_FAIL,
  GET_STD_RELATIVES,
  GET_STD_RELATIVES_SUCCESS,
  GET_STD_RELATIVES_FAIL,
  ADD_NEW_STD_RELATIVE,
  ADD_STD_RELATIVE_SUCCESS,
  ADD_STD_RELATIVE_FAIL,
  UPDATE_STD_RELATIVE,
  UPDATE_STD_RELATIVE_SUCCESS,
  UPDATE_STD_RELATIVE_FAIL,
  DELETE_STD_RELATIVE,
  DELETE_STD_RELATIVE_SUCCESS,
  DELETE_STD_RELATIVE_FAIL,
  GET_STD_RELATIVE_DELETED_VALUE,
  GET_STD_RELATIVE_DELETED_VALUE_SUCCESS,
  GET_STD_RELATIVE_DELETED_VALUE_FAIL,
} from "./actionTypes";

export const getUniversityStudents = () => ({
  type: GET_UNIVERSITY_STUDENTS,
});

export const getUniversityStudentsSuccess = universityStudents => ({
  type: GET_UNIVERSITY_STUDENTS_SUCCESS,
  payload: universityStudents,
});

export const getUniversityStudentsFail = error => ({
  type: GET_UNIVERSITY_STUDENTS_FAIL,
  payload: error,
});

export const addNewUniversityStudent = universityStudent => ({
  type: ADD_NEW_UNIVERSITY_STUDENT,
  payload: universityStudent,
});

export const addUniversityStudentSuccess = universityStudent => ({
  type: ADD_UNIVERSITY_STUDENT_SUCCESS,
  payload: universityStudent,
});

export const addUniversityStudentFail = error => ({
  type: ADD_UNIVERSITY_STUDENT_FAIL,
  payload: error,
});

export const updateUniversityStudent = universityStudent => ({
  type: UPDATE_UNIVERSITY_STUDENT,
  payload: universityStudent,
});

export const updateUniversityStudentSuccess = universityStudent => ({
  type: UPDATE_UNIVERSITY_STUDENT_SUCCESS,
  payload: universityStudent,
});

export const updateUniversityStudentFail = error => ({
  type: UPDATE_UNIVERSITY_STUDENT_FAIL,
  payload: error,
});

export const deleteUniversityStudent = universityStudent => ({
  type: DELETE_UNIVERSITY_STUDENT,
  payload: universityStudent,
});

export const deleteUniversityStudentSuccess = universityStudent => ({
  type: DELETE_UNIVERSITY_STUDENT_SUCCESS,
  payload: universityStudent,
});

export const deleteUniversityStudentFail = error => ({
  type: DELETE_UNIVERSITY_STUDENT_FAIL,
  payload: error,
});

export const getUniversityStudentById = tempUniversityStudent => ({
  type: GET_UNIVERSITY_STUDENT_BY_ID,
  payload: tempUniversityStudent,
});

export const getUniversityStudentByIdSuccess = tempUniversityStudent => ({
  type: GET_UNIVERSITY_STUDENT_BY_ID_SUCCESS,
  payload: tempUniversityStudent,
});

export const getUniversityStudentByIdFail = error => ({
  type: GET_UNIVERSITY_STUDENT_BY_ID_FAIL,
  payload: error,
});

export const getUniversityStudentRegReqDocs = tempUniversityStudent => ({
  type: GET_UNIVERSITY_STUDENT_REGREQDOCS,
  payload: tempUniversityStudent,
});

export const getUniversityStudentRegReqDocsSuccess =
  tempUniversityStudents => ({
    type: GET_UNIVERSITY_STUDENT_REGREQDOCS_SUCCESS,
    payload: tempUniversityStudents,
  });

export const getUniversityStudentRegReqDocsFail = error => ({
  type: GET_UNIVERSITY_STUDENT_REGREQDOCS_FAIL,
  payload: error,
});

export const updateUniversityStudentRegReqDoc = tempUniversityStudent => {
  return {
    type: UPDATE_UNIVERSITY_STUDENT_REGREQDOC,
    payload: tempUniversityStudent,
  };
};

export const updateUniversityStudentRegReqDocSuccess =
  tempUniversityStudent => ({
    type: UPDATE_UNIVERSITY_STUDENT_REGREQDOC_SUCCESS,
    payload: tempUniversityStudent,
  });

export const updateUniversityStudentRegReqDocFail = error => ({
  type: UPDATE_UNIVERSITY_STUDENT_REGREQDOC_FAIL,
  payload: error,
});

export const getStudentsOpt = () => ({
  type: GET_STUDENTS_OPT,
});

export const getStudentsOptSuccess = studentOpt => ({
  type: GET_STUDENTS_OPT_SUCCESS,
  payload: studentOpt,
});

export const getStudentsOptFail = error => ({
  type: GET_STUDENTS_OPT_FAIL,
  payload: error,
});

export const addBrother = brother => ({
  type: ADD_BROTHER,
  payload: brother,
});

export const addBrotherSuccess = brother => ({
  type: ADD_BROTHER_SUCCESS,
  payload: brother,
});

export const addBrotherFail = error => ({
  type: ADD_BROTHER_FAIL,
  payload: error,
});

export const getBrothers = brothers => ({
  type: GET_BROTHERS,
  payload: brothers,
});

export const getBrothersSuccess = brothers => ({
  type: GET_BROTHERS_SUCCESS,
  payload: brothers,
});

export const getBrothersFail = error => ({
  type: GET_BROTHERS_FAIL,
  payload: error,
});

export const deleteBrother = brother => ({
  type: DELETE_BROTHER,
  payload: brother,
});

export const deleteBrotherSuccess = brother => ({
  type: DELETE_BROTHER_SUCCESS,
  payload: brother,
});

export const deleteBrotherFail = error => ({
  type: DELETE_BROTHER_FAIL,
  payload: error,
});

export const updateBrother = brother => ({
  type: UPDATE_BROTHER,
  payload: brother,
});

export const updateBrotherSuccess = brother => ({
  type: UPDATE_BROTHER_SUCCESS,
  payload: brother,
});

export const updateBrotherFail = error => ({
  type: UPDATE_BROTHER_FAIL,
  payload: error,
});

export const getStdRelatives = relative => ({
  type: GET_STD_RELATIVES,
  payload: relative,
});

export const getStdRelativesSuccess = students => ({
  type: GET_STD_RELATIVES_SUCCESS,
  payload: students,
});

export const getStdRelativesFail = error => ({
  type: GET_STD_RELATIVES_FAIL,
  payload: error,
});

export const addNewStdRelative = student => ({
  type: ADD_NEW_STD_RELATIVE,
  payload: student,
});

export const addStdRelativeSuccess = student => ({
  type: ADD_STD_RELATIVE_SUCCESS,
  payload: student,
});

export const addStdRelativeFail = error => ({
  type: ADD_STD_RELATIVE_FAIL,
  payload: error,
});

export const updateStdRelative = student => ({
  type: UPDATE_STD_RELATIVE,
  payload: student,
});

export const updateStdRelativeSuccess = student => ({
  type: UPDATE_STD_RELATIVE_SUCCESS,
  payload: student,
});

export const updateStdRelativeFail = error => ({
  type: UPDATE_STD_RELATIVE_FAIL,
  payload: error,
});

export const deleteStdRelative = student => ({
  type: DELETE_STD_RELATIVE,
  payload: student,
});

export const deleteStdRelativeSuccess = student => ({
  type: DELETE_STD_RELATIVE_SUCCESS,
  payload: student,
});

export const deleteStdRelativeFail = error => ({
  type: DELETE_STD_RELATIVE_FAIL,
  payload: error,
});
export const getStdRelativeDeletedValue = () => ({
  type: GET_STD_RELATIVE_DELETED_VALUE,
});

export const getStdRelativeDeletedValueSuccess = deleted => ({
  type: GET_STD_RELATIVE_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getStdRelativeDeletedValueFail = error => ({
  type: GET_STD_RELATIVE_DELETED_VALUE_FAIL,
  payload: error,
});
