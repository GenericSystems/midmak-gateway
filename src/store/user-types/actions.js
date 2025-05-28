import {
  GET_USER_TYPES,
  GET_USER_TYPES_FAIL,
  GET_USER_TYPES_SUCCESS,
  GET_USER_TYPES_OPT,
  GET_USER_TYPES_OPT_FAIL,
  GET_USER_TYPES_OPT_SUCCESS,
  GET_USER_TYPE_DELETED_VALUE,
  GET_USER_TYPE_DELETED_VALUE_FAIL,
  GET_USER_TYPE_DELETED_VALUE_SUCCESS,
  ADD_NEW_USER_TYPE,
  ADD_USER_TYPE_SUCCESS,
  ADD_USER_TYPE_FAIL,
  UPDATE_USER_TYPE,
  UPDATE_USER_TYPE_SUCCESS,
  UPDATE_USER_TYPE_FAIL,
  DELETE_USER_TYPE,
  DELETE_USER_TYPE_SUCCESS,
  DELETE_USER_TYPE_FAIL,
} from "./actionTypes";

export const getUserTypes = () => ({
  type: GET_USER_TYPES,
});

export const getUserTypesSuccess = userTypes => ({
  type: GET_USER_TYPES_SUCCESS,
  payload: userTypes,
});

export const getUserTypesFail = error => ({
  type: GET_USER_TYPES_FAIL,
  payload: error,
});

export const getUserTypesOpt = () => ({
  type: GET_USER_TYPES_OPT,
});

export const getUserTypesOptSuccess = userTypes => ({
  type: GET_USER_TYPES_OPT_SUCCESS,
  payload: userTypes,
});

export const getUserTypesOptFail = error => ({
  type: GET_USER_TYPES_OPT_FAIL,
  payload: error,
});

export const getUserTypeDeletedValue = () => ({
  type: GET_USER_TYPE_DELETED_VALUE,
});

export const getUserTypeDeletedValueSuccess = userType => ({
  type: GET_USER_TYPE_DELETED_VALUE_SUCCESS,
  payload: userType,
});

export const getUserTypeDeletedValueFail = error => ({
  type: GET_USER_TYPE_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewUserType = userType => ({
  type: ADD_NEW_USER_TYPE,
  payload: userType,
});

export const addUserTypeSuccess = userType => ({
  type: ADD_USER_TYPE_SUCCESS,
  payload: userType,
});

export const addUserTypeFail = error => ({
  type: ADD_USER_TYPE_FAIL,
  payload: error,
});

export const updateUserType = userType => ({
  type: UPDATE_USER_TYPE,
  payload: userType,
});

export const updateUserTypeSuccess = userType => ({
  type: UPDATE_USER_TYPE_SUCCESS,
  payload: userType,
});

export const updateUserTypeFail = error => ({
  type: UPDATE_USER_TYPE_FAIL,
  payload: error,
});

export const deleteUserType = userType => ({
  type: DELETE_USER_TYPE,
  payload: userType,
});

export const deleteUserTypeSuccess = userType => ({
  type: DELETE_USER_TYPE_SUCCESS,
  payload: userType,
});

export const deleteUserTypeFail = error => ({
  type: DELETE_USER_TYPE_FAIL,
  payload: error,
});
