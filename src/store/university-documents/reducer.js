import {
    GET_UNI_DOCUMENTS_SUCCESS,
    GET_UNI_DOCUMENTS_FAIL,
    ADD_UNI_DOCUMENT_SUCCESS,
    ADD_UNI_DOCUMENT_FAIL,
    UPDATE_UNI_DOCUMENT_SUCCESS,
    UPDATE_UNI_DOCUMENT_FAIL,
    DELETE_UNI_DOCUMENT_SUCCESS,
    DELETE_UNI_DOCUMENT_FAIL,
    GET_UNI_DOCUMENT_DELETED_VALUE_SUCCESS,
    GET_UNI_DOCUMENT_DELETED_VALUE_FAIL,
    } from "./actionTypes"
    
    const INIT_STATE = {
    uniDocuments: [],
    deleted: {},
    error: {},
    }
    
    const uniDocuments = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_UNI_DOCUMENTS_SUCCESS:
        return {
            ...state,
            uniDocuments: action.payload,
        }
        case GET_UNI_DOCUMENTS_FAIL:
            return {
                ...state,
                error: action.payload,
            }

        case ADD_UNI_DOCUMENT_SUCCESS:
            return {
                ...state,
                uniDocuments: [...state.uniDocuments, action.payload],
            }

        case ADD_UNI_DOCUMENT_FAIL:
            return {
                ...state,
                error: action.payload,
            }

        case GET_UNI_DOCUMENT_DELETED_VALUE_SUCCESS:
            return {
                ...state,
                deleted: action.payload,
            }

        case UPDATE_UNI_DOCUMENT_SUCCESS:
            return {
                ...state,
                uniDocuments: state.uniDocuments.map(uniDocument =>
                    uniDocument.Id.toString() === action.payload.Id.toString()
                        ? { uniDocument, ...action.payload }
                        : uniDocument
                ),
            }

        case UPDATE_UNI_DOCUMENT_FAIL:
            return {
                ...state,
                error: action.payload,
            }

        case DELETE_UNI_DOCUMENT_SUCCESS:
            return {
                ...state,
                uniDocuments: state.uniDocuments.filter(
                    uniDocument => uniDocument.Id.toString() !== action.payload.Id.toString()
                ),
                deleted: action.payload.deleted
            }

        case DELETE_UNI_DOCUMENT_FAIL:
            return {
                ...state,
                error: action.payload,
            }

        case GET_UNI_DOCUMENT_DELETED_VALUE_FAIL:
            return {
                ...state,
                error: action.payload,
            }

        default:
            return state
    }
}

export default uniDocuments
