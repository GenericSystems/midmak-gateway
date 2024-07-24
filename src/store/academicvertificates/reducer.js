import {
    GET_ACADEMICCERTIFICATES_SUCCESS,
    GET_ACADEMICCERTIFICATES_FAIL,
    ADD_ACADEMICCERTIFICATES_SUCCESS,
    ADD_ACADEMICCERTIFICATES_FAIL,
    UPDATE_ACADEMICCERTIFICATE_SUCCESS,
    UPDATE_ACADEMICCERTIFICATE_FAIL,
    DELETE_ACADEMICCERTIFICATES_SUCCESS,
    DELETE_ACADEMICCERTIFICATES_FAIL,
    GET_ACADEMICCERTIFICATE_DELETED_VALUE_SUCCESS,
    GET_ACADEMICCERTIFICATE_DELETED_VALUE_FAIL,
    GET_FILTERED_ACADEMIC_CERTIFICATES_SUCCESS,
    GET_FILTERED_ACADEMIC_CERTIFICATES_FAIL
    } from "./actionTypes"
    
    const INIT_STATE = {
    academiccertificates: [],
    filteredAcademicCertificates: [],
    academiccertificateProfile: {},
    deleted: {},
    error: {},
    }
    
    const academiccertificates = (state = INIT_STATE, action) => {
    switch (action.type) {
    case GET_ACADEMICCERTIFICATES_SUCCESS:
    return {
    ...state,
    academiccertificates: action.payload,
    }
    case GET_ACADEMICCERTIFICATES_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case ADD_ACADEMICCERTIFICATES_SUCCESS:
        return {
            ...state,
            academiccertificates: [...state.academiccertificates, action.payload],
        }

    case ADD_ACADEMICCERTIFICATES_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case GET_ACADEMICCERTIFICATE_DELETED_VALUE_SUCCESS:
        return {
            ...state,
            academiccertificateProfile: action.payload,
        }

    case UPDATE_ACADEMICCERTIFICATE_SUCCESS:
        return {
            ...state,
            academiccertificates: state.academiccertificates.map(academiccertificate =>
                academiccertificate.Id === action.payload.Id
                    ? { academiccertificate, ...action.payload }
                    : academiccertificate
            ),
        }

    case UPDATE_ACADEMICCERTIFICATE_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case DELETE_ACADEMICCERTIFICATES_SUCCESS:
        return {
            ...state,
            academiccertificates: state.academiccertificates.filter(
                academiccertificate => academiccertificate.Id !== action.payload.Id
            ),
            deleted: action.payload.deleted
        }

    case DELETE_ACADEMICCERTIFICATES_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case GET_ACADEMICCERTIFICATE_DELETED_VALUE_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case GET_FILTERED_ACADEMIC_CERTIFICATES_SUCCESS:
        return {
        ...state,
        filteredAcademicCertificates: action.payload,
        }
    case GET_FILTERED_ACADEMIC_CERTIFICATES_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    default:
        return state
}
}

export default academiccertificates
