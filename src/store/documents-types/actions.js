import {
  GET_DOCUMENT_DELETED_VALUE,
  GET_DOCUMENT_DELETED_VALUE_FAIL,
  GET_DOCUMENT_DELETED_VALUE_SUCCESS,
  GET_DOCUMENTS,
  GET_DOCUMENTS_FAIL,
  GET_DOCUMENTS_SUCCESS,
  ADD_NEW_DOCUMENT,
  ADD_DOCUMENT_SUCCESS,
  ADD_DOCUMENT_FAIL,
  UPDATE_DOCUMENT,
  UPDATE_DOCUMENT_SUCCESS,
  UPDATE_DOCUMENT_FAIL,
  DELETE_DOCUMENT,
  DELETE_DOCUMENT_SUCCESS,
  DELETE_DOCUMENT_FAIL,
} from "./actionTypes";

export const getDocuments = () => ({
  type: GET_DOCUMENTS,
});

export const getDocumentsSuccess = documents => ({
  type: GET_DOCUMENTS_SUCCESS,
  payload: documents,
  
});

export const getDocumentsFail = error => ({
  type: GET_DOCUMENTS_FAIL,
  payload: error,
});

export const getDocumentDeletedValue = () => ({
  type: GET_DOCUMENT_DELETED_VALUE,
});

export const getDocumentDeletedValueSuccess = documentProfile => ({
  type: GET_DOCUMENT_DELETED_VALUE_SUCCESS,
  payload: documentProfile,
});

export const getDocumentDeletedValueFail = error => ({
  type: GET_DOCUMENT_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewDocument = document => ({
  type: ADD_NEW_DOCUMENT,
  payload: document,
});

export const addDocumentSuccess = document => ({
  type: ADD_DOCUMENT_SUCCESS,
  payload: document,
});

export const addDocumentFail = error => ({
  type: ADD_DOCUMENT_FAIL,
  payload: error,
});

export const updateDocument = document => {
  return {
    type: UPDATE_DOCUMENT,
    payload: document,
  };
};

export const updateDocumentSuccess = document => ({
  type: UPDATE_DOCUMENT_SUCCESS,
  payload: document,
});

export const updateDocumentFail = error => ({
  type: UPDATE_DOCUMENT_FAIL,
  payload: error,
});

export const deleteDocument = document => ({
  type: DELETE_DOCUMENT,
  payload: document,
});

export const deleteDocumentSuccess = document => ({
  type: DELETE_DOCUMENT_SUCCESS,
  payload: document,
});

export const deleteDocumentFail = error => ({
  type: DELETE_DOCUMENT_FAIL,
  payload: error,
});
