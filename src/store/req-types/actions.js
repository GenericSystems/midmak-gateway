import {
    GET_REQUIREMENT_TYPES,
    GET_REQUIREMENT_TYPES_FAIL,
    GET_REQUIREMENT_TYPES_SUCCESS,
    GET_REQUIREMENT_DELETED_VALUE,
    GET_REQUIREMENT_DELETED_VALUE_FAIL,
    GET_REQUIREMENT_DELETED_VALUE_SUCCESS,
    ADD_NEW_REQUIREMENT_TYPE,
    ADD_REQUIREMENT_TYPE_SUCCESS,
    ADD_REQUIREMENT_TYPE_FAIL,
    UPDATE_REQUIREMENT_TYPE,
    UPDATE_REQUIREMENT_TYPE_SUCCESS,
    UPDATE_REQUIREMENT_TYPE_FAIL,
    DELETE_REQUIREMENT_TYPE,
    DELETE_REQUIREMENT_TYPE_SUCCESS,
    DELETE_REQUIREMENT_TYPE_FAIL,
  } from "./actionTypes"
  
  export const getReqTypes = reqTypes => ({
    type: GET_REQUIREMENT_TYPES,
    payload: reqTypes
  })
  
  export const getReqTypesSuccess = reqTypes => ({
    type: GET_REQUIREMENT_TYPES_SUCCESS,
    payload: reqTypes,
  })
  
  export const getReqTypesFail = error => ({
    type: GET_REQUIREMENT_TYPES_FAIL,
    payload: error,
  })
  
  export const getReqTypeDeletedValue = reqTypeId => ({
    type: GET_REQUIREMENT_DELETED_VALUE,
    reqTypeId,
  })
  
  export const getReqTypeDeletedValueSuccess = reqTypeProfiles => ({
    type: GET_REQUIREMENT_DELETED_VALUE_SUCCESS,
    payload: reqTypeProfiles,
  })
  
  export const getReqTypeDeletedValueFail = error => ({
    type: GET_REQUIREMENT_DELETED_VALUE_FAIL,
    payload: error,
  })
  
  export const addNewReqType = reqType => ({
    type: ADD_NEW_REQUIREMENT_TYPE,
    payload: reqType,
  })
  
  export const addReqTypeSuccess = reqType => ({
    type: ADD_REQUIREMENT_TYPE_SUCCESS,
    payload: reqType,
  })
  
  export const addReqTypeFail = error => ({
    type: ADD_REQUIREMENT_TYPE_FAIL,
    payload: error,
  })
  
  export const updateReqType = reqType => ({
    type: UPDATE_REQUIREMENT_TYPE,
    payload: reqType,
  })
  
  export const updateReqTypeSuccess = reqType => ({
    type: UPDATE_REQUIREMENT_TYPE_SUCCESS,
    payload: reqType,
  })
  
  export const updateReqTypeFail = error => ({
    type: UPDATE_REQUIREMENT_TYPE_FAIL,
    payload: error,
  })
  
  export const deleteReqType = reqType => ({
    type: DELETE_REQUIREMENT_TYPE,
    payload: reqType,
  })
  
  export const deleteReqTypeSuccess = reqType => ({
    type: DELETE_REQUIREMENT_TYPE_SUCCESS,
    payload: reqType,
  })
  
  export const deleteReqTypeFail = error => ({
    type: DELETE_REQUIREMENT_TYPE_FAIL,
    payload: error,
  })