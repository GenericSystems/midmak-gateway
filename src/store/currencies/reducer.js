import {
    GET_CURRENCIES_SUCCESS,
    GET_CURRENCIES_FAIL,
    ADD_CURRENCY_SUCCESS,
    ADD_CURRENCY_FAIL,
    UPDATE_CURRENCY_SUCCESS,
    UPDATE_CURRENCY_FAIL,
    DELETE_CURRENCY_SUCCESS,
    DELETE_CURRENCY_FAIL,
    GET_CURRENCY_DELETED_VALUE_SUCCESS,
    GET_CURRENCY_DELETED_VALUE_FAIL,
    } from "./actionTypes"
    
    const INIT_STATE = {
    currencies: [],
    deleted: {},
    error: {},
    }
    
    const currencies = (state = INIT_STATE, action) => {
    switch (action.type) {
    case GET_CURRENCIES_SUCCESS:
    return {
    ...state,
    currencies: action.payload,
    }
    case GET_CURRENCIES_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case ADD_CURRENCY_SUCCESS:
        return {
            ...state,
            currencies: [...state.currencies, action.payload],
        }

    case ADD_CURRENCY_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case GET_CURRENCY_DELETED_VALUE_SUCCESS:
        return {
            ...state,
            deleted: action.payload,
        }

    case UPDATE_CURRENCY_SUCCESS:
        return {
            ...state,
            currencies: state.currencies.map(currency =>
                currency.Id.toString() === action.payload.Id.toString()
                    ? { currency, ...action.payload }
                    : currency
            ),
        }

    case UPDATE_CURRENCY_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case DELETE_CURRENCY_SUCCESS:
        return {
            ...state,
            currencies: state.currencies.filter(
                currency => currency.Id.toString() !== action.payload.Id.toString()
            ),
            deleted: action.payload.deleted,
        }

    case DELETE_CURRENCY_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case GET_CURRENCY_DELETED_VALUE_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    default:
        return state
}
}

export default currencies 
