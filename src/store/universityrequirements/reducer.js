import {
    GET_UNIVERSITYREQUIREMENTS_SUCCESS,
    GET_UNIVERSITYREQUIREMENTS_FAIL,
    ADD_UNIVERSITYREQUIREMENTS_SUCCESS,
    ADD_UNIVERSITYREQUIREMENTS_FAIL,
    UPDATE_UNIVERSITYREQUIREMENTS_SUCCESS,
    UPDATE_UNIVERSITYREQUIREMENTS_FAIL,
    DELETE_UNIVERSITYREQUIREMENTS_SUCCESS,
    DELETE_UNIVERSITYREQUIREMENTS_FAIL,
    GET_UNIVERSITYREQUIREMENTS_PROFILE_SUCCESS,
    GET_UNIVERSITYREQUIREMENTS_PROFILE_FAIL,
    } from "./actionTypes"
    
    const INIT_STATE = {
    universityrequirements: [],
    universityrequirementProfile: {},
    error: {},
    }
    
    const universityrequirements = (state = INIT_STATE, action) => {
    switch (action.type) {
    case GET_UNIVERSITYREQUIREMENTS_SUCCESS:
    return {
    ...state,
    universityrequirements: action.payload,
    }
    case GET_UNIVERSITYREQUIREMENTS_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case ADD_UNIVERSITYREQUIREMENTS_SUCCESS:
        return {
            ...state,
            universityrequirements: [...state.universityrequirements, action.payload],
        }

    case ADD_UNIVERSITYREQUIREMENTS_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case GET_UNIVERSITYREQUIREMENTS_PROFILE_SUCCESS:
        return {
            ...state,
            universityrequirementProfile: action.payload,
        }

    case UPDATE_UNIVERSITYREQUIREMENTS_SUCCESS:
        return {
            ...state,
            universityrequirements: state.universityrequirements.map(universityrequirement =>
                universityrequirement.id.toString() === action.payload.id.toString()
                    ? { universityrequirement, ...action.payload }
                    : universityrequirement
            ),
        }

    case UPDATE_UNIVERSITYREQUIREMENTS_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case DELETE_UNIVERSITYREQUIREMENTS_SUCCESS:
        return {
            ...state,
            universityrequirements: state.universityrequirements.filter(
                universityrequirement => universityrequirement.id.toString() !== action.payload.id.toString()
            ),
        }

    case DELETE_UNIVERSITYREQUIREMENTS_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case GET_UNIVERSITYREQUIREMENTS_PROFILE_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    default:
        return state
}
}

export default universityrequirements
