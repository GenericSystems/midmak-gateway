import {
    GET_GOVERNORATES_SUCCESS,
    GET_GOVERNORATES_FAIL,
    ADD_GOVERNORATE_SUCCESS,
    ADD_GOVERNORATE_FAIL,
    UPDATE_GOVERNORATE_SUCCESS,
    UPDATE_GOVERNORATE_FAIL,
    DELETE_GOVERNORATE_SUCCESS,
    DELETE_GOVERNORATE_FAIL,
    GET_GOVERNORATE_DELETED_VALUE_SUCCESS,
    GET_GOVERNORATE_DELETED_VALUE_FAIL,
    IMPORT_GOVERNORATES_SUCCESS,
    IMPORT_GOVERNORATES_FAIL
    } from "./actionTypes"
    
    const INIT_STATE = {
    governorates: [],
    deleted: {},
    error: {},
    }
    
    const governorates = (state = INIT_STATE, action) => {
    switch (action.type) {
    case GET_GOVERNORATES_SUCCESS:
    return {
    ...state,
    governorates: action.payload,
    }
    case GET_GOVERNORATES_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case ADD_GOVERNORATE_SUCCESS:
        return {
            ...state,
            governorates: [...state.governorates, action.payload],
        }

    case ADD_GOVERNORATE_FAIL:
        return {
            ...state,
            error: action.payload,
        }

        
        case IMPORT_GOVERNORATES_SUCCESS:
          return {
            ...state,
            governorates: action.payload,
          }
    
        case IMPORT_GOVERNORATES_FAIL:
          return {
            ...state,
            error: action.payload,
          }
    

    case GET_GOVERNORATE_DELETED_VALUE_SUCCESS:
        return {
            ...state,
            deleted: action.payload,
        }

    case UPDATE_GOVERNORATE_SUCCESS:
        return {
            ...state,
            governorates: state.governorates.map(governorate =>
                governorate.Id.toString() === action.payload.Id.toString()
                    ? { governorate, ...action.payload }
                    : governorate
            ),
        }

    case UPDATE_GOVERNORATE_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case DELETE_GOVERNORATE_SUCCESS:
        return {
            ...state,
            governorates: state.governorates.filter(
                governorate => governorate.Id.toString() !== action.payload.Id.toString()
            ),
            deleted: action.payload.deleted
        }

    case DELETE_GOVERNORATE_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case GET_GOVERNORATE_DELETED_VALUE_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    default:
        return state
}
}

export default governorates
