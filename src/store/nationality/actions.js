import {
    GET_NATIONALITY_DELETED_VALUE,
    GET_NATIONALITY_DELETED_VALUE_FAIL,
    GET_NATIONALITY_DELETED_VALUE_SUCCESS,
    GET_NATIONALITIES,
    GET_NATIONALITIES_FAIL,
    GET_NATIONALITIES_SUCCESS,
    ADD_NEW_NATIONALITY,
    ADD_NATIONALITY_SUCCESS,
    ADD_NATIONALITY_FAIL,
    UPDATE_NATIONALITY,
    UPDATE_NATIONALITY_SUCCESS,
    UPDATE_NATIONALITY_FAIL,
    DELETE_NATIONALITY,
    DELETE_NATIONALITY_SUCCESS,
    DELETE_NATIONALITY_FAIL,
    IMPORT_NATIONALITIES,
    IMPORT_NATIONALITIES_SUCCESS,
    IMPORT_NATIONALITIES_FAIL
  } from "./actionTypes"
  
  export const getNationalities = () => ({
    type: GET_NATIONALITIES,
  })
  
  export const getNationalitiesSuccess = Nationalities => ({
    type: GET_NATIONALITIES_SUCCESS,
    payload: Nationalities,
  })
  
  export const getNationalitiesFail = error => ({
    type: GET_NATIONALITIES_FAIL,
    payload: error,
  })
  
  export const getNationalityDeletedValue = () => ({
    type: GET_NATIONALITY_DELETED_VALUE,
  })
  
  export const getNationalityDeletedValueSuccess = NationalityProfile => ({
    type: GET_NATIONALITY_DELETED_VALUE_SUCCESS,
    payload: NationalityProfile,
  })
  
  export const getNationalityDeletedValueFail = error => ({
    type: GET_NATIONALITY_DELETED_VALUE_FAIL,
    payload: error,
  })
  
  export const addNewNationality = nationality => ({
    type: ADD_NEW_NATIONALITY,
    payload: nationality,
  })
  
  export const addNationalitySuccess = nationality => ({
    type: ADD_NATIONALITY_SUCCESS,
    payload: nationality,
  })
  
  export const addNationalityFail = error => ({
    type: ADD_NATIONALITY_FAIL,
    payload: error,
  })

  export const importNationalities = nationality => ({
    type: IMPORT_NATIONALITIES,
    payload: nationality,
  })
  
  export const importNationalitiesSuccess = nationality => ({
    type: IMPORT_NATIONALITIES_SUCCESS,
    payload: nationality,
  })
  
  export const importNationalitiesFail = error => ({
    type: IMPORT_NATIONALITIES_FAIL,
    payload: error,
  })
  
  export const updateNationality = nationality =>{
    return ({
      type: UPDATE_NATIONALITY,
      payload: nationality,
    })
  } 
  
  export const updateNationalitySuccess = Nationality => ({
    type: UPDATE_NATIONALITY_SUCCESS,
    payload: Nationality,
  })
  
  export const updateNationalityFail = error => ({
    type: UPDATE_NATIONALITY_FAIL,
    payload: error,
  })
  
  export const deleteNationality = Nationality => ({
    type: DELETE_NATIONALITY,
    payload: Nationality,
  })
  
  export const deleteNationalitySuccess = Nationality => ({
    type: DELETE_NATIONALITY_SUCCESS,
    payload: Nationality,
  })
  
  export const deleteNationalityFail = error => ({
    type: DELETE_NATIONALITY_FAIL,
    payload: error,
  })
  