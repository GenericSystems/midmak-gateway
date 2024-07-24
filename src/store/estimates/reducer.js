import {
    GET_ESTIMATES_SUCCESS,
    GET_ESTIMATES_FAIL,
    ADD_ESTIMATE_SUCCESS,
    ADD_ESTIMATE_FAIL,
    UPDATE_ESTIMATE_SUCCESS,
    UPDATE_ESTIMATE_FAIL,
    DELETE_ESTIMATE_SUCCESS,
    DELETE_ESTIMATE_FAIL,
    GET_ESTIMATE_DELETED_VALUE_SUCCESS,
    GET_ESTIMATE_DELETED_VALUE_FAIL,
    } from "./actionTypes"
    
    const INIT_STATE = {
    estimates: [],
    deleted: {},
    error: {},
    }
    
    const estimates = (state = INIT_STATE, action) => {
    switch (action.type) {
    case GET_ESTIMATES_SUCCESS:
    return {
    ...state,
    estimates: action.payload,
    }
    case GET_ESTIMATES_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case ADD_ESTIMATE_SUCCESS:
        return {
            ...state,
            estimates: [...state.estimates, action.payload],
        }

    case ADD_ESTIMATE_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case GET_ESTIMATE_DELETED_VALUE_SUCCESS:
        return {
            ...state,
            deleted: action.payload,
        }

    case UPDATE_ESTIMATE_SUCCESS:
        return {
            ...state,
            estimates: state.estimates.map(estimate =>
                estimate.Id.toString() === action.payload.Id.toString()
                    ? { estimate, ...action.payload }
                    : estimate
            ),
        }

    case UPDATE_ESTIMATE_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case DELETE_ESTIMATE_SUCCESS:
        return {
            ...state,
            estimates: state.estimates.filter(
                estimate => estimate.Id.toString() !== action.payload.Id.toString()
            ),
            deleted: action.payload.deleted
        }

    case DELETE_ESTIMATE_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case GET_ESTIMATE_DELETED_VALUE_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    default:
        return state
}
}

export default estimates
