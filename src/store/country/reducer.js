import {
    GET_COUNTRIES_SUCCESS,
    GET_COUNTRIES_FAIL,
    ADD_COUNTRY_SUCCESS,
    ADD_COUNTRY_FAIL,
    UPDATE_COUNTRY_SUCCESS,
    UPDATE_COUNTRY_FAIL,
    DELETE_COUNTRY_SUCCESS,
    DELETE_COUNTRY_FAIL,
    GET_COUNTRY_DELETED_VALUE_SUCCESS,
    GET_COUNTRY_DELETED_VALUE_FAIL,
    IMPORT_COUNTRIES_SUCCESS,
    IMPORT_COUNTRIES_FAIL
    } from "./actionTypes"
    
    const INIT_STATE = {
    countries: [],
    deleted : {},
    error: {},
    }
    
    const countries = (state = INIT_STATE, action) => {
    switch (action.type) {
    case GET_COUNTRIES_SUCCESS:
    return {
    ...state,
    countries: action.payload,
    }
    case GET_COUNTRIES_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case ADD_COUNTRY_SUCCESS:
        return {
            ...state,
            countries: [...state.countries, action.payload],
        }

    case ADD_COUNTRY_FAIL:
        return {
            ...state,
            error: action.payload,
        }

        case IMPORT_COUNTRIES_SUCCESS:
            return {
              ...state,
              countries: action.payload,
            }
      
          case IMPORT_COUNTRIES_FAIL:
            return {
              ...state,
              error: action.payload,
            }

    case GET_COUNTRY_DELETED_VALUE_SUCCESS:
        return {
            ...state,
            deleted: action.payload.deleted,
        }

    case UPDATE_COUNTRY_SUCCESS:
        return {
            ...state,
            countries: state.countries.map(country =>
                country.Id.toString() === action.payload.Id.toString()
                    ? { country, ...action.payload }
                    : country
            ),
        }

    case UPDATE_COUNTRY_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case DELETE_COUNTRY_SUCCESS:
        return {
            ...state,
            countries: state.countries.filter(
                country => country.Id.toString() !== action.payload.Id.toString()
            ),
            deleted: action.payload.deleted,
        }

    case DELETE_COUNTRY_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case GET_COUNTRY_DELETED_VALUE_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    default:
        return state
}
}

export default countries
