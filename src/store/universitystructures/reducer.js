import {
    GET_STRUCTURES_SUCCESS,
    GET_STRUCTURES_FAIL,
    ADD_STRUCTURE_SUCCESS,
    ADD_STRUCTURE_FAIL,
    UPDATE_STRUCTURE_SUCCESS,
    UPDATE_STRUCTURE_FAIL,
    DELETE_STRUCTURE_SUCCESS,
    DELETE_STRUCTURE_FAIL,
    GET_STRUCTURE_DELETED_VALUE_SUCCESS,
    GET_STRUCTURE_DELETED_VALUE_FAIL,
    } from "./actionTypes"
    
    const INIT_STATE = {
    structures: [],
    deleted: {},
    error: {},
    }
    
    const structures = (state = INIT_STATE, action) => {
    switch (action.type) {
    case GET_STRUCTURES_SUCCESS:
    return {
    ...state,
    structures: action.payload,
    }
    case GET_STRUCTURES_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case ADD_STRUCTURE_SUCCESS:
        return {
            ...state,
            structures: [...state.structures, action.payload],
        }

    case ADD_STRUCTURE_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case GET_STRUCTURE_DELETED_VALUE_SUCCESS:
        return {
            ...state,
            deleeted: action.payload,
        }

    case UPDATE_STRUCTURE_SUCCESS:
        return {
            ...state,
            structures: state.structures.map(structure =>
                structure.Id.toString() === action.payload.Id.toString()
                    ? { structure, ...action.payload }
                    : structure
            ),
        }

    case UPDATE_STRUCTURE_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case DELETE_STRUCTURE_SUCCESS:
        return {
            ...state,
            structures: state.structures.filter(
                structure => structure.Id.toString() !== action.payload.Id.toString()
            ),
            deleted: action.payload.deleted
        }

    case DELETE_STRUCTURE_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case GET_STRUCTURE_DELETED_VALUE_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    default:
        return state
}
}

export default structures
