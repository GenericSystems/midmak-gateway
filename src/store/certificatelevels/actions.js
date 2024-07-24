import {
    GET_CERTIFICATELEVEL_DELETED_VALUE,
    GET_CERTIFICATELEVEL_DELETED_VALUE_FAIL,
    GET_CERTIFICATELEVEL_DELETED_VALUE_SUCCESS,
    GET_CERTIFICATELEVELS,
    GET_CERTIFICATELEVELS_FAIL,
    GET_CERTIFICATELEVELS_SUCCESS,
    ADD_NEW_CERTIFICATELEVEL,
    ADD_CERTIFICATELEVEL_SUCCESS,
    ADD_CERTIFICATELEVEL_FAIL,
    UPDATE_CERTIFICATELEVEL,
    UPDATE_CERTIFICATELEVEL_SUCCESS,
    UPDATE_CERTIFICATELEVEL_FAIL,
    DELETE_CERTIFICATELEVEL,
    DELETE_CERTIFICATELEVEL_SUCCESS,
    DELETE_CERTIFICATELEVEL_FAIL,
  } from "./actionTypes"
  
  export const getCertificateLevels = () => ({
    type: GET_CERTIFICATELEVELS,
  })
  
  export const getCertificateLevelsSuccess = CertificateLevels => ({
    type: GET_CERTIFICATELEVELS_SUCCESS,
    payload: CertificateLevels,
  })
  
  export const getCertificateLevelsFail = error => ({
    type: GET_CERTIFICATELEVELS_FAIL,
    payload: error,
  })
  
  export const getCertificateLevelDeletedValue = () => ({
    type: GET_CERTIFICATELEVEL_DELETED_VALUE,
  })
  
  export const getCertificateLevelDeletedValueSuccess = CertificateLevelProfile => ({
    type: GET_CERTIFICATELEVEL_DELETED_VALUE_SUCCESS,
    payload: CertificateLevelProfile,
  })
  
  export const getCertificateLevelDeletedValueFail = error => ({
    type: GET_CERTIFICATELEVEL_DELETED_VALUE_FAIL,
    payload: error,
  })
  
  export const addNewCertificateLevel = CertificateLevel => ({
    type: ADD_NEW_CERTIFICATELEVEL,
    payload: CertificateLevel,
  })
  
  export const addCertificateLevelSuccess = CertificateLevel => ({
    type: ADD_CERTIFICATELEVEL_SUCCESS,
    payload: CertificateLevel,
  })
  
  export const addCertificateLevelFail = error => ({
    type: ADD_CERTIFICATELEVEL_FAIL,
    payload: error,
  })
  
  export const updateCertificateLevel = CertificateLevel =>{
    return ({
      type: UPDATE_CERTIFICATELEVEL,
      payload: CertificateLevel,
    })
  } 
  
  export const updateCertificateLevelSuccess = CertificateLevel => ({
    type: UPDATE_CERTIFICATELEVEL_SUCCESS,
    payload: CertificateLevel,
  })
  
  export const updateCertificateLevelFail = error => ({
    type: UPDATE_CERTIFICATELEVEL_FAIL,
    payload: error,
  })
  
  export const deleteCertificateLevel = CertificateLevel => ({
    type: DELETE_CERTIFICATELEVEL,
    payload: CertificateLevel,
  })
  
  export const deleteCertificateLevelSuccess = CertificateLevel => ({
    type: DELETE_CERTIFICATELEVEL_SUCCESS,
    payload: CertificateLevel,
  })
  
  export const deleteCertificateLevelFail = error => ({
    type: DELETE_CERTIFICATELEVEL_FAIL,
    payload: error,
  })
  