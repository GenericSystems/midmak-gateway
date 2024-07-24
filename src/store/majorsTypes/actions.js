import {
    GET_MAJORS_TYPES,
    GET_MAJORS_TYPES_FAIL,
    GET_MAJORS_TYPES_SUCCESS,
    ADD_NEW_MAJOR_TYPE,
    ADD_MAJOR_TYPE_SUCCESS,
    ADD_MAJOR_TYPE_FAIL,
    UPDATE_MAJOR_TYPE,
    UPDATE_MAJOR_TYPE_SUCCESS,
    UPDATE_MAJOR_TYPE_FAIL,
    DELETE_MAJOR_TYPE,
    DELETE_MAJOR_TYPE_SUCCESS,
    DELETE_MAJOR_TYPE_FAIL,
    GET_MAJOR_TYPE_DELETED_VALUE,
    GET_MAJOR_TYPE_DELETED_VALUE_FAIL,
    GET_MAJOR_TYPE_DELETED_VALUE_SUCCESS,
  } from "./actionTypes"
  
  export const getMajorsTypes = () => ({
    type: GET_MAJORS_TYPES,
  })
  
  export const getMajorsTypesSuccess = majorsTypes => ({
    type: GET_MAJORS_TYPES_SUCCESS,
    payload: majorsTypes,
  })
  
  export const getMajorsTypesFail = error => ({
    type: GET_MAJORS_TYPES_FAIL,
    payload: error,
  })
  
  
  export const addNewMajorType = majorType => ({
    type: ADD_NEW_MAJOR_TYPE,
    payload: majorType,
  })
  
  export const addMajorTypeSuccess = majorType => ({
    type: ADD_MAJOR_TYPE_SUCCESS,
    payload: majorType,
  })
  
  export const addMajorTypeFail = error => ({
    type: ADD_MAJOR_TYPE_FAIL,
    payload: error,
  })
  
  export const updateMajorType = majorType =>{
    return ({
      type: UPDATE_MAJOR_TYPE,
      payload: majorType,
    })
  } 
  
  export const updateMajorTypeSuccess = majorType => ({
    type: UPDATE_MAJOR_TYPE_SUCCESS,
    payload: majorType,
  })
  
  export const updateMajorTypeFail = error => ({
    type: UPDATE_MAJOR_TYPE_FAIL,
    payload: error,
  })
  
  export const deleteMajorType = majorType => ({
    type: DELETE_MAJOR_TYPE,
    payload: majorType,
  })
  
  export const deleteMajorTypeSuccess = majorType => ({
    type: DELETE_MAJOR_TYPE_SUCCESS,
    payload: majorType,
  })
  
  export const deleteMajorTypeFail = error => ({
    type: DELETE_MAJOR_TYPE_FAIL,
    payload: error,
  })
  
  export const getMajorTypeDeletedValue = () => ({
    type: GET_MAJOR_TYPE_DELETED_VALUE,
  });
  
  export const getMajorTypeDeletedValueSuccess = deleted => ({
    type: GET_MAJOR_TYPE_DELETED_VALUE_SUCCESS,
    payload: deleted,
  });
  
  export const getMajorTypeDeletedValueFail = error => ({
    type: GET_MAJOR_TYPE_DELETED_VALUE_FAIL,
    payload: error,
  });