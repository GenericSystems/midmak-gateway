import {
  GET_REG_REQ_DOCUMENT_DELETED_VALUE,
  GET_REG_REQ_DOCUMENT_DELETED_VALUE_FAIL,
  GET_REG_REQ_DOCUMENT_DELETED_VALUE_SUCCESS,
  GET_REG_REQ_DOCUMENTS,
  GET_REG_REQ_DOCUMENTS_FAIL,
  GET_REG_REQ_DOCUMENTS_SUCCESS,
  ADD_NEW_REG_REQ_DOCUMENT,
  ADD_REG_REQ_DOCUMENT_SUCCESS,
  ADD_REG_REQ_DOCUMENT_FAIL,
  UPDATE_REG_REQ_DOCUMENT,
  UPDATE_REG_REQ_DOCUMENT_SUCCESS,
  UPDATE_REG_REQ_DOCUMENT_FAIL,
  DELETE_REG_REQ_DOCUMENT,
  DELETE_REG_REQ_DOCUMENT_SUCCESS,
  DELETE_REG_REQ_DOCUMENT_FAIL,
  COPY_REG_REQ_DOC,
  COPY_REG_REQ_DOC_SUCCESS,
  COPY_REG_REQ_DOC_FAIL,
} from "./actionTypes";

export const getRegReqDocuments = RegReqDocuments => ({
  type: GET_REG_REQ_DOCUMENTS,
  payload: RegReqDocuments,

});

export const getRegReqDocumentsSuccess = RegReqDocuments => ({
  type: GET_REG_REQ_DOCUMENTS_SUCCESS,
  payload: RegReqDocuments,
});

export const getRegReqDocumentsFail = error => ({
  type: GET_REG_REQ_DOCUMENTS_FAIL,
  payload: error,
});

export const getRegReqDocumentDeletedValue = () => ({
  type: GET_REG_REQ_DOCUMENT_DELETED_VALUE,
});

export const getRegReqDocumentDeletedValueSuccess = deleted => ({
  type: GET_REG_REQ_DOCUMENT_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getRegReqDocumentDeletedValueFail = error => ({
  type: GET_REG_REQ_DOCUMENT_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewRegReqDocument = regReqDocument => ({
  type: ADD_NEW_REG_REQ_DOCUMENT,
  payload: regReqDocument,
});

export const addRegReqDocumentSuccess = regReqDocument => ({
  type: ADD_REG_REQ_DOCUMENT_SUCCESS,
  payload: regReqDocument,
});

export const addRegReqDocumentFail = error => ({
  type: ADD_REG_REQ_DOCUMENT_FAIL,
  payload: error,
});

export const updateRegReqDocument = regReqDocument => {
  return {
    type: UPDATE_REG_REQ_DOCUMENT,
    payload: regReqDocument,
  };
};

export const updateRegReqDocumentSuccess = regReqDocument => ({
  type: UPDATE_REG_REQ_DOCUMENT_SUCCESS,
  payload: regReqDocument,
});

export const updateRegReqDocumentFail = error => ({
  type: UPDATE_REG_REQ_DOCUMENT_FAIL,
  payload: error,
});

export const deleteRegReqDocument = regReqDocument => ({
  type: DELETE_REG_REQ_DOCUMENT,
  payload: regReqDocument,
});

export const deleteRegReqDocumentSuccess = regReqDocument => ({
  type: DELETE_REG_REQ_DOCUMENT_SUCCESS,
  payload: regReqDocument,
});

export const deleteRegReqDocumentFail = error => ({
  type: DELETE_REG_REQ_DOCUMENT_FAIL,
  payload: error,
});

export const copyRegReqDoc = regReqDocument => ({
  type: COPY_REG_REQ_DOC,
  payload: regReqDocument,
});

export const copyRegReqDocSuccess = regReqDocument => ({
  type: COPY_REG_REQ_DOC_SUCCESS,
  payload: regReqDocument,
});

export const copyRegReqDocFail = error => ({
  type: COPY_REG_REQ_DOC_FAIL,
  payload: error,
});

