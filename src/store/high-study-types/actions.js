import {
  GET_HIGHSTUDYTYPE_DELETED_VALUE,
  GET_HIGHSTUDYTYPE_DELETED_VALUE_FAIL,
  GET_HIGHSTUDYTYPE_DELETED_VALUE_SUCCESS,
  GET_HIGHSTUDYTYPES,
  GET_HIGHSTUDYTYPES_FAIL,
  GET_HIGHSTUDYTYPES_SUCCESS,
  ADD_NEW_HIGHSTUDYTYPE,
  ADD_HIGHSTUDYTYPE_SUCCESS,
  ADD_HIGHSTUDYTYPE_FAIL,
  UPDATE_HIGHSTUDYTYPE,
  UPDATE_HIGHSTUDYTYPE_SUCCESS,
  UPDATE_HIGHSTUDYTYPE_FAIL,
  DELETE_HIGHSTUDYTYPE,
  DELETE_HIGHSTUDYTYPE_SUCCESS,
  DELETE_HIGHSTUDYTYPE_FAIL,
} from "./actionTypes";

// GET
export const getHighStudyTypes = () => ({
  type: GET_HIGHSTUDYTYPES,
});

export const getHighStudyTypesSuccess = highStudyTypes => ({
  type: GET_HIGHSTUDYTYPES_SUCCESS,
  payload: highStudyTypes,
});

export const getHighStudyTypesFail = error => ({
  type: GET_HIGHSTUDYTYPES_FAIL,
  payload: error,
});

// GET DELETED VALUE
export const getHighStudyTypeDeletedValue = () => ({
  type: GET_HIGHSTUDYTYPE_DELETED_VALUE,
});

export const getHighStudyTypeDeletedValueSuccess = highStudyTypeProfile => ({
  type: GET_HIGHSTUDYTYPE_DELETED_VALUE_SUCCESS,
  payload: highStudyTypeProfile,
});

export const getHighStudyTypeDeletedValueFail = error => ({
  type: GET_HIGHSTUDYTYPE_DELETED_VALUE_FAIL,
  payload: error,
});

// ADD
export const addNewHighStudyType = highStudyType => ({
  type: ADD_NEW_HIGHSTUDYTYPE,
  payload: highStudyType,
});

export const addHighStudyTypeSuccess = highStudyType => ({
  type: ADD_HIGHSTUDYTYPE_SUCCESS,
  payload: highStudyType,
});

export const addHighStudyTypeFail = error => ({
  type: ADD_HIGHSTUDYTYPE_FAIL,
  payload: error,
});

// UPDATE
export const updateHighStudyType = highStudyType => ({
  type: UPDATE_HIGHSTUDYTYPE,
  payload: highStudyType,
});

export const updateHighStudyTypeSuccess = highStudyType => ({
  type: UPDATE_HIGHSTUDYTYPE_SUCCESS,
  payload: highStudyType,
});

export const updateHighStudyTypeFail = error => ({
  type: UPDATE_HIGHSTUDYTYPE_FAIL,
  payload: error,
});

// DELETE
export const deleteHighStudyType = highStudyType => ({
  type: DELETE_HIGHSTUDYTYPE,
  payload: highStudyType,
});

export const deleteHighStudyTypeSuccess = highStudyType => ({
  type: DELETE_HIGHSTUDYTYPE_SUCCESS,
  payload: highStudyType,
});

export const deleteHighStudyTypeFail = error => ({
  type: DELETE_HIGHSTUDYTYPE_FAIL,
  payload: error,
});
