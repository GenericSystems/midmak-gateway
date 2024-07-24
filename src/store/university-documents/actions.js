import {
    GET_UNI_DOCUMENT_DELETED_VALUE,
    GET_UNI_DOCUMENT_DELETED_VALUE_FAIL,
    GET_UNI_DOCUMENT_DELETED_VALUE_SUCCESS,
    GET_UNI_DOCUMENTS,
    GET_UNI_DOCUMENTS_FAIL,
    GET_UNI_DOCUMENTS_SUCCESS,
    ADD_NEW_UNI_DOCUMENT,
    ADD_UNI_DOCUMENT_SUCCESS,
    ADD_UNI_DOCUMENT_FAIL,
    UPDATE_UNI_DOCUMENT,
    UPDATE_UNI_DOCUMENT_SUCCESS,
    UPDATE_UNI_DOCUMENT_FAIL,
    DELETE_UNI_DOCUMENT,
    DELETE_UNI_DOCUMENT_SUCCESS,
    DELETE_UNI_DOCUMENT_FAIL,
  } from "./actionTypes";
  
  export const getUniDocuments = () => ({
    type: GET_UNI_DOCUMENTS,
  });
  
  export const getUniDocumentsSuccess = uniDocuments => ({
    type: GET_UNI_DOCUMENTS_SUCCESS,
    payload: uniDocuments,
  });
  
  export const getUniDocumentsFail = error => ({
    type: GET_UNI_DOCUMENTS_FAIL,
    payload: error,
  });
  
  export const getUniDocumentDeletedValue = () => ({
    type: GET_UNI_DOCUMENT_DELETED_VALUE,
  });
  
  export const getUniDocumentDeletedValueSuccess = uniDocument => ({
    type: GET_UNI_DOCUMENT_DELETED_VALUE_SUCCESS,
    payload: uniDocument,
  });
  
  export const getUniDocumentDeletedValueFail = error => ({
    type: GET_UNI_DOCUMENT_DELETED_VALUE_FAIL,
    payload: error,
  });
  
  export const addNewUniDocument = uniDocument => ({
    type: ADD_NEW_UNI_DOCUMENT,
    payload: uniDocument,
  });
  
  export const addUniDocumentSuccess = uniDocument => ({
    type: ADD_UNI_DOCUMENT_SUCCESS,
    payload: uniDocument,
  });
  
  export const addUniDocumentFail = error => ({
    type: ADD_UNI_DOCUMENT_FAIL,
    payload: error,
  });
  
  export const updateUniDocument = uniDocument => {
    return {
      type: UPDATE_UNI_DOCUMENT,
      payload: uniDocument,
    };
  };
  
  export const updateUniDocumentSuccess = uniDocument => ({
    type: UPDATE_UNI_DOCUMENT_SUCCESS,
    payload: uniDocument,
  });
  
  export const updateUniDocumentFail = error => ({
    type: UPDATE_UNI_DOCUMENT_FAIL,
    payload: error,
  });
  
  export const deleteUniDocument = uniDocument => ({
    type: DELETE_UNI_DOCUMENT,
    payload: uniDocument,
  });
  
  export const deleteUniDocumentSuccess = uniDocument => ({
    type: DELETE_UNI_DOCUMENT_SUCCESS,
    payload: uniDocument,
  });
  
  export const deleteUniDocumentFail = error => ({
    type: DELETE_UNI_DOCUMENT_FAIL,
    payload: error,
  });
  