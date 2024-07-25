import {
    GET_CERTIFICATE_TYPE_DELETED_VALUE,
    GET_CERTIFICATE_TYPE_DELETED_VALUE_FAIL,
    GET_CERTIFICATE_TYPE_DELETED_VALUE_SUCCESS,
    GET_CERTIFICATE_TYPES,
    GET_CERTIFICATE_TYPES_FAIL,
    GET_CERTIFICATE_TYPES_SUCCESS,
    ADD_NEW_CERTIFICATE_TYPE,
    ADD_CERTIFICATE_TYPE_SUCCESS,
    ADD_CERTIFICATE_TYPE_FAIL,
    UPDATE_CERTIFICATE_TYPE,
    UPDATE_CERTIFICATE_TYPE_SUCCESS,
    UPDATE_CERTIFICATE_TYPE_FAIL,
    DELETE_CERTIFICATE_TYPE,
    DELETE_CERTIFICATE_TYPE_SUCCESS,
    DELETE_CERTIFICATE_TYPE_FAIL,
  } from "./actionTypes"
  
  export const getCertificateTypes = () => ({
    type: GET_CERTIFICATE_TYPES,
  })
  
  export const getCertificateTypesSuccess = CertificateTypes => ({
    type: GET_CERTIFICATE_TYPES_SUCCESS,
    payload: CertificateTypes,
  })
  
  export const getCertificateTypesFail = error => ({
    type: GET_CERTIFICATE_TYPES_FAIL,
    payload: error,
  })
  
  export const getCertificateTypeDeletedValue = () => ({
    type: GET_CERTIFICATE_TYPE_DELETED_VALUE,
  })
  
  export const getCertificateTypeDeletedValueSuccess = CertificateType => ({
    type: GET_CERTIFICATE_TYPE_DELETED_VALUE_SUCCESS,
    payload: CertificateType,
  })
  
  export const getCertificateTypeDeletedValueFail = error => ({
    type: GET_CERTIFICATE_TYPE_DELETED_VALUE_FAIL,
    payload: error,
  })
  
  export const addNewCertificateType = CertificateType => ({
    type: ADD_NEW_CERTIFICATE_TYPE,
    payload: CertificateType,
  })
  
  export const addCertificateTypeSuccess = CertificateType => ({
    type: ADD_CERTIFICATE_TYPE_SUCCESS,
    payload: CertificateType,
  })
  
  export const addCertificateTypeFail = error => ({
    type: ADD_CERTIFICATE_TYPE_FAIL,
    payload: error,
  })
  
  export const updateCertificateType = CertificateType =>{
    return ({
      type: UPDATE_CERTIFICATE_TYPE,
      payload: CertificateType,
    })
  } 
  
  export const updateCertificateTypeSuccess = CertificateType => ({
    type: UPDATE_CERTIFICATE_TYPE_SUCCESS,
    payload: CertificateType,
  })
  
  export const updateCertificateTypeFail = error => ({
    type: UPDATE_CERTIFICATE_TYPE_FAIL,
    payload: error,
  })
  
  export const deleteCertificateType = CertificateType => ({
    type: DELETE_CERTIFICATE_TYPE,
    payload: CertificateType,
  })
  
  export const deleteCertificateTypeSuccess = CertificateType => ({
    type: DELETE_CERTIFICATE_TYPE_SUCCESS,
    payload: CertificateType,
  })
  
  export const deleteCertificateTypeFail = error => ({
    type: DELETE_CERTIFICATE_TYPE_FAIL,
    payload: error,
  })
  