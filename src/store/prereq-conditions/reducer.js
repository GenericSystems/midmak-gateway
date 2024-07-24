import {
    GET_PREREQS_SUCCESS,
    GET_PREREQS_FAIL,
    ADD_PREREQ_SUCCESS,
    ADD_PREREQ_FAIL,
    UPDATE_PREREQ_SUCCESS,
    UPDATE_PREREQ_FAIL,
    DELETE_PREREQ_SUCCESS,
    DELETE_PREREQ_FAIL,
    GET_PREREQ_DELETED_VALUE_SUCCESS,
    GET_PREREQ_DELETED_VALUE_FAIL,
    } from "./actionTypes"
    
    const INIT_STATE = {
    prereqs: [],
    deleted: {},
    error: {},
    }
    
    const prereqs = (state = INIT_STATE, action) => {
    switch (action.type) {
    case GET_PREREQS_SUCCESS:
    return {
    ...state,
    prereqs: action.payload,
    }
    case GET_PREREQS_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case ADD_PREREQ_SUCCESS:
        return {
            ...state,
            prereqs: [...state.prereqs, action.payload],
        }

    case ADD_PREREQ_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case GET_PREREQ_DELETED_VALUE_SUCCESS:
        return {
            ...state,
            deleted: action.payload,
        }

    case UPDATE_PREREQ_SUCCESS:
        return {
            ...state,
            prereqs: state.prereqs.map(prereq =>
                prereq.Id.toString() === action.payload.Id.toString()
                    ? { prereq, ...action.payload }
                    : prereq
            ),
        }

    case UPDATE_PREREQ_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case DELETE_PREREQ_SUCCESS:
        return {
            ...state,
            prereqs: state.prereqs.filter(
                prereq => prereq.Id.toString() !== action.payload.Id.toString()
            ),
            deleted: action.payload.deleted,
        }

    case DELETE_PREREQ_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case GET_PREREQ_DELETED_VALUE_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    default:
        return state
}
}

export default prereqs
