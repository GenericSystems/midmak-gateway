import {
    GET_LEVELS_SUCCESS,
    GET_LEVELS_FAIL,
    ADD_LEVEL_SUCCESS,
    ADD_LEVEL_FAIL,
    UPDATE_LEVEL_SUCCESS,
    UPDATE_LEVEL_FAIL,
    DELETE_LEVEL_SUCCESS,
    DELETE_LEVEL_FAIL,
    GET_LEVEL_DELETED_VALUE_SUCCESS,
    GET_LEVEL_DELETED_VALUE_FAIL,
    } from "./actionTypes"
    
    const INIT_STATE = {
    levels: [],
    deleted: {},
    error: {},
    }
    
    const levels = (state = INIT_STATE, action) => {
    switch (action.type) {
    case GET_LEVELS_SUCCESS:
    return {
    ...state,
    levels: action.payload,
    }
    case GET_LEVELS_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case ADD_LEVEL_SUCCESS:
        return {
            ...state,
            levels: [...state.levels, action.payload],
        }

    case ADD_LEVEL_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case GET_LEVEL_DELETED_VALUE_SUCCESS:
        return {
            ...state,
            deleted: action.payload,
        }

    case UPDATE_LEVEL_SUCCESS:
        return {
            ...state,
            levels: state.levels.map(level =>
                level.Id.toString() === action.payload.Id.toString()
                    ? { level, ...action.payload }
                    : level
            ),
        }

    case UPDATE_LEVEL_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case DELETE_LEVEL_SUCCESS:
        return {
            ...state,
            levels: state.levels.filter(
                level => level.Id.toString() !== action.payload.Id.toString()
            ),
            deleted: action.payload.deleted
        }

    case DELETE_LEVEL_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case GET_LEVEL_DELETED_VALUE_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    default:
        return state
}
}

export default levels
