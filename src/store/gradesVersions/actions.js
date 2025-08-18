import {
  GET_GRADE_VERSION_DELETED_VALUE,
  GET_GRADE_VERSION_DELETED_VALUE_FAIL,
  GET_GRADE_VERSION_DELETED_VALUE_SUCCESS,
  GET_GRADES_VERSIONS,
  GET_GRADES_VERSIONS_FAIL,
  GET_GRADES_VERSIONS_SUCCESS,
  ADD_NEW_GRADE_VERSION,
  ADD_GRADE_VERSION_SUCCESS,
  ADD_GRADE_VERSION_FAIL,
  UPDATE_GRADE_VERSION,
  UPDATE_GRADE_VERSION_SUCCESS,
  UPDATE_GRADE_VERSION_FAIL,
  DELETE_GRADE_VERSION,
  DELETE_GRADE_VERSION_SUCCESS,
  DELETE_GRADE_VERSION_FAIL,
} from "./actionTypes";

export const getGradesVersions = () => ({
  type: GET_GRADES_VERSIONS,
});

export const getGradesVersionsSuccess = gradesVersions => ({
  type: GET_GRADES_VERSIONS_SUCCESS,
  payload: gradesVersions,
});

export const getGradesVersionsFail = error => ({
  type: GET_GRADES_VERSIONS_FAIL,
  payload: error,
});

export const getGradeVersionDeletedValue = () => ({
  type: GET_GRADE_VERSION_DELETED_VALUE,
});

export const getGradeVersionDeletedValueSuccess = gradeVersion => ({
  type: GET_GRADE_VERSION_DELETED_VALUE_SUCCESS,
  payload: gradeVersionProfile,
});

export const getGradeVersionDeletedValueFail = error => ({
  type: GET_GRADE_VERSION_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewGradeVersion = gradeVersion => ({
  type: ADD_NEW_GRADE_VERSION,
  payload: gradeVersion,
});

export const addGradeVersionSuccess = gradeVersion => ({
  type: ADD_GRADE_VERSION_SUCCESS,
  payload: gradeVersion,
});

export const addGradeVersionFail = error => ({
  type: ADD_GRADE_VERSION_FAIL,
  payload: error,
});

export const updateGradeVersion = gradeVersion => {
  return {
    type: UPDATE_GRADE_VERSION,
    payload: gradeVersion,
  };
};

export const updateGradeVersionSuccess = gradeVersion => ({
  type: UPDATE_GRADE_VERSION_SUCCESS,
  payload: gradeVersion,
});

export const updateGradeVersionFail = error => ({
  type: UPDATE_GRADE_VERSION_FAIL,
  payload: error,
});

export const deleteGradeVersion = gradeVersion => ({
  type: DELETE_GRADE_VERSION,
  payload: gradeVersion,
});

export const deleteGradeVersionSuccess = gradeVersion => ({
  type: DELETE_GRADE_VERSION_SUCCESS,
  payload: gradeVersion,
});

export const deleteGradeVersionFail = error => ({
  type: DELETE_GRADE_VERSION_FAIL,
  payload: error,
});
