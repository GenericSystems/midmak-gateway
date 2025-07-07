import {
  GET_GRADE_TYPES,
  GET_GRADE_TYPES_SUCCESS,
  GET_GRADE_TYPES_FAIL,
  GET_GRADE_TYPE_DELETED_VALUE,
  GET_GRADE_TYPE_DELETED_VALUE_SUCCESS,
  GET_GRADE_TYPE_DELETED_VALUE_FAIL,
  ADD_NEW_GRADE_TYPE,
  ADD_GRADE_TYPE_SUCCESS,
  ADD_GRADE_TYPE_FAIL,
  UPDATE_GRADE_TYPE,
  UPDATE_GRADE_TYPE_SUCCESS,
  UPDATE_GRADE_TYPE_FAIL,
  DELETE_GRADE_TYPE,
  DELETE_GRADE_TYPE_SUCCESS,
  DELETE_GRADE_TYPE_FAIL,
} from "./actionTypes";

// Get All Grade Types
export const getGradeTypes = () => ({
  type: GET_GRADE_TYPES,
});

export const getGradeTypesSuccess = gradeTypes => ({
  type: GET_GRADE_TYPES_SUCCESS,
  payload: gradeTypes,
});

export const getGradeTypesFail = error => ({
  type: GET_GRADE_TYPES_FAIL,
  payload: error,
});

// Get Deleted Grade Type Value
export const getGradeTypeDeletedValue = () => ({
  type: GET_GRADE_TYPE_DELETED_VALUE,
});

export const getGradeTypeDeletedValueSuccess = gradeTypeProfile => ({
  type: GET_GRADE_TYPE_DELETED_VALUE_SUCCESS,
  payload: gradeTypeProfile,
});

export const getGradeTypeDeletedValueFail = error => ({
  type: GET_GRADE_TYPE_DELETED_VALUE_FAIL,
  payload: error,
});

// Add New Grade Type
export const addNewGradeType = gradeType => ({
  type: ADD_NEW_GRADE_TYPE,
  payload: gradeType,
});

export const addGradeTypeSuccess = gradeType => ({
  type: ADD_GRADE_TYPE_SUCCESS,
  payload: gradeType,
});

export const addGradeTypeFail = error => ({
  type: ADD_GRADE_TYPE_FAIL,
  payload: error,
});

// Update Grade Type
export const updateGradeType = gradeType => ({
  type: UPDATE_GRADE_TYPE,
  payload: gradeType,
});

export const updateGradeTypeSuccess = gradeType => ({
  type: UPDATE_GRADE_TYPE_SUCCESS,
  payload: gradeType,
});

export const updateGradeTypeFail = error => ({
  type: UPDATE_GRADE_TYPE_FAIL,
  payload: error,
});

// Delete Grade Type
export const deleteGradeType = gradeType => ({
  type: DELETE_GRADE_TYPE,
  payload: gradeType,
});

export const deleteGradeTypeSuccess = gradeType => ({
  type: DELETE_GRADE_TYPE_SUCCESS,
  payload: gradeType,
});

export const deleteGradeTypeFail = error => ({
  type: DELETE_GRADE_TYPE_FAIL,
  payload: error,
});
