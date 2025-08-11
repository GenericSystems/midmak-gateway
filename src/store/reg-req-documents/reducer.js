import {
  GET_REG_REQ_DOCUMENTS_SUCCESS,
  GET_REG_REQ_DOCUMENTS_FAIL,
  ADD_REG_REQ_DOCUMENT_SUCCESS,
  ADD_REG_REQ_DOCUMENT_FAIL,
  UPDATE_REG_REQ_DOCUMENT_SUCCESS,
  UPDATE_REG_REQ_DOCUMENT_FAIL,
  DELETE_REG_REQ_DOCUMENT_SUCCESS,
  DELETE_REG_REQ_DOCUMENT_FAIL,
  GET_REG_REQ_DOCUMENT_DELETED_VALUE_SUCCESS,
  GET_REG_REQ_DOCUMENT_DELETED_VALUE_FAIL,
  COPY_REG_REQ_DOC_SUCCESS,
  COPY_REG_REQ_DOC_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  regReqDocuments: [],
  deleted: {},
  error: {},
  // documents: [],
  // currentSemester:{},
};

const regReqDocuments = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_REG_REQ_DOCUMENTS_SUCCESS:
      return {
        ...state,
        regReqDocuments: action.payload,
      };
    case GET_REG_REQ_DOCUMENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_REG_REQ_DOCUMENT_SUCCESS:
      return {
        ...state,
        regReqDocuments: [...state.regReqDocuments, action.payload],
      };

    case ADD_REG_REQ_DOCUMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_REG_REQ_DOCUMENT_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload,
      };

    case UPDATE_REG_REQ_DOCUMENT_SUCCESS:
      return {
        ...state,
        regReqDocuments: state.regReqDocuments.map(regReqDocument =>
          regReqDocument.Id.toString() === action.payload.Id.toString()
            ? { regReqDocument, ...action.payload }
            : regReqDocument
        ),
      };

    case UPDATE_REG_REQ_DOCUMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_REG_REQ_DOCUMENT_SUCCESS:
      return {
        ...state,
        regReqDocuments: state.regReqDocuments.filter(
          regReqDocument =>
            regReqDocument.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_REG_REQ_DOCUMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_REG_REQ_DOCUMENT_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case COPY_REG_REQ_DOC_SUCCESS:
      return {
        ...state,
        regReqDocuments: action.payload,
      };

    case COPY_REG_REQ_DOC_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default regReqDocuments;
