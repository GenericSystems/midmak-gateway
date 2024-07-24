import {
    GET_RELATIVE_DELETED_VALUE,
    GET_RELATIVE_DELETED_VALUE_FAIL,
    GET_RELATIVE_DELETED_VALUE_SUCCESS,
    GET_RELATIVES,
    GET_RELATIVES_FAIL,
    GET_RELATIVES_SUCCESS,
    ADD_NEW_RELATIVE,
    ADD_RELATIVE_SUCCESS,
    ADD_RELATIVE_FAIL,
    UPDATE_RELATIVE,
    UPDATE_RELATIVE_SUCCESS,
    UPDATE_RELATIVE_FAIL,
    DELETE_RELATIVE,
    DELETE_RELATIVE_SUCCESS,
    DELETE_RELATIVE_FAIL,
    IMPORT_RELATIVES,
    IMPORT_RELATIVES_SUCCESS,
    IMPORT_RELATIVES_FAIL
  } from "./actionTypes"
  
  export const getRelatives = () => ({
    type: GET_RELATIVES,
  })
  
  export const getRelativesSuccess = Relatives => ({
    type: GET_RELATIVES_SUCCESS,
    payload: Relatives,
  })
  
  export const getRelativesFail = error => ({
    type: GET_RELATIVES_FAIL,
    payload: error,
  })
  
  export const getRelativeDeletedValue = () => ({
    type: GET_RELATIVE_DELETED_VALUE,
  })
  
  export const getRelativeDeletedValueSuccess = RelativeProfile => ({
    type: GET_RELATIVE_DELETED_VALUE_SUCCESS,
    payload: RelativeProfile,
  })
  
  export const getRelativeDeletedValueFail = error => ({
    type: GET_RELATIVE_DELETED_VALUE_FAIL,
    payload: error,
  })
  
  export const addNewRelative = relative => ({
    type: ADD_NEW_RELATIVE,
    payload: relative,
  })
  
  export const addRelativeSuccess = relative => ({
    type: ADD_RELATIVE_SUCCESS,
    payload: relative,
  })
  
  export const addRelativeFail = error => ({
    type: ADD_RELATIVE_FAIL,
    payload: error,
  })

  export const importRelatives = relative => ({
    type: IMPORT_RELATIVES,
    payload: relative,
  })
  
  export const importRelativesSuccess = relative => ({
    type: IMPORT_RELATIVES_SUCCESS,
    payload: relative,
  })
  
  export const importRelativesFail = error => ({
    type: IMPORT_RELATIVES_FAIL,
    payload: error,
  })
  
  export const updateRelative = relative =>{
    return ({
      type: UPDATE_RELATIVE,
      payload: relative,
    })
  } 
  
  export const updateRelativeSuccess = Relative => ({
    type: UPDATE_RELATIVE_SUCCESS,
    payload: Relative,
  })
  
  export const updateRelativeFail = error => ({
    type: UPDATE_RELATIVE_FAIL,
    payload: error,
  })
  
  export const deleteRelative = Relative => ({
    type: DELETE_RELATIVE,
    payload: Relative,
  })
  
  export const deleteRelativeSuccess = Relative => ({
    type: DELETE_RELATIVE_SUCCESS,
    payload: Relative,
  })
  
  export const deleteRelativeFail = error => ({
    type: DELETE_RELATIVE_FAIL,
    payload: error,
  })
  