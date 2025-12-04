import {
    GET_YEARS_SUCCESS,
    GET_YEARS_FAIL,
    ADD_YEAR_SUCCESS,
    ADD_YEAR_FAIL,
    UPDATE_YEAR_SUCCESS,
    UPDATE_YEAR_FAIL,
    DELETE_YEAR_SUCCESS,
    DELETE_YEAR_FAIL,
    GET_YEAR_DELETED_VALUE_SUCCESS,
    GET_YEAR_DELETED_VALUE_FAIL,
    } from "./actionTypes"
    
    const INIT_STATE = {
    years: [],
    deleted: {},
    error: {},
    }
    
    const years = (state = INIT_STATE, action) => {
    switch (action.type) {
    case GET_YEARS_SUCCESS:
    return {
    ...state,
    years: action.payload,
    }
    case GET_YEARS_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case ADD_YEAR_SUCCESS:
        return {
            ...state,
            years: [...state.years, action.payload],
        }

    case ADD_YEAR_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case GET_YEAR_DELETED_VALUE_SUCCESS:
        return {
            ...state,
            deleted: action.payload,
        }

    case UPDATE_YEAR_SUCCESS:
        return {
            ...state,
            years: state.years.map(year =>
                year.Id.toString() === action.payload.Id.toString()
                    ? { year, ...action.payload }
                    : year
            ),
        }

    case UPDATE_YEAR_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case DELETE_YEAR_SUCCESS:
        return {
            ...state,
            years: state.years.filter(
                year => year.Id.toString() !== action.payload.Id.toString()
            ),
            deleted: action.payload.deleted
        }

    case DELETE_YEAR_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case GET_YEAR_DELETED_VALUE_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    default:
        return state
}
}

export default years
