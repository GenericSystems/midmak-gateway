import {
    GET_DOCUMENTS_SUCCESS,
    GET_DOCUMENTS_FAIL,
    ADD_DOCUMENT_SUCCESS,
    ADD_DOCUMENT_FAIL,
    UPDATE_DOCUMENT_SUCCESS,
    UPDATE_DOCUMENT_FAIL,
    DELETE_DOCUMENT_SUCCESS,
    DELETE_DOCUMENT_FAIL,
    GET_DOCUMENT_DELETED_VALUE_SUCCESS,
    GET_DOCUMENT_DELETED_VALUE_FAIL,
    } from "./actionTypes"
    
    const INIT_STATE = {
    documents: [],
    deleted: {},
    error: {},
    }
    
    const documents = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_DOCUMENTS_SUCCESS:
        return {
            ...state,
            documents: action.payload,
        }
        case GET_DOCUMENTS_FAIL:
            return {
                ...state,
                error: action.payload,
            }

        case ADD_DOCUMENT_SUCCESS:
            return {
                ...state,
                documents: [...state.documents, action.payload],
            }

        case ADD_DOCUMENT_FAIL:
            return {
                ...state,
                error: action.payload,
            }

        case GET_DOCUMENT_DELETED_VALUE_SUCCESS:
            return {
                ...state,
                deleted: action.payload,
            }

        case UPDATE_DOCUMENT_SUCCESS:
            return {
                ...state,
                documents: state.documents.map(document =>
                    document.Id.toString() === action.payload.Id.toString()
                        ? { document, ...action.payload }
                        : document
                ),
            }

        case UPDATE_DOCUMENT_FAIL:
            return {
                ...state,
                error: action.payload,
            }

        case DELETE_DOCUMENT_SUCCESS:
            return {
                ...state,
                documents: state.documents.filter(
                    document => document.Id.toString() !== action.payload.Id.toString()
                ),
                deleted: action.payload.deleted
            }

        case DELETE_DOCUMENT_FAIL:
            return {
                ...state,
                error: action.payload,
            }

        case GET_DOCUMENT_DELETED_VALUE_FAIL:
            return {
                ...state,
                error: action.payload,
            }

        default:
            return state
    }
}

export default documents
