import {
    GET_CURRENCY_DELETED_VALUE,
    GET_CURRENCY_DELETED_VALUE_FAIL,
    GET_CURRENCY_DELETED_VALUE_SUCCESS,
    GET_CURRENCIES,
    GET_CURRENCIES_FAIL,
    GET_CURRENCIES_SUCCESS,
    ADD_NEW_CURRENCY,
    ADD_CURRENCY_SUCCESS,
    ADD_CURRENCY_FAIL,
    UPDATE_CURRENCY,
    UPDATE_CURRENCY_SUCCESS,
    UPDATE_CURRENCY_FAIL,
    DELETE_CURRENCY,
    DELETE_CURRENCY_SUCCESS,
    DELETE_CURRENCY_FAIL,
    } from "./actionTypes"
    
    export const getCurrencies = () => ({
    type: GET_CURRENCIES,
    })
    
    export const getCurrenciesSuccess = covernorates => ({
    type: GET_CURRENCIES_SUCCESS,
    payload: covernorates,
    })
    
    export const getCurrenciesFail = error => ({
    type: GET_CURRENCIES_FAIL,
    payload: error,
    })
    
    export const getCurrencyDeletedValue = () => ({
    type: GET_CURRENCY_DELETED_VALUE,
    })
    
    export const getCurrencyDeletedValueSuccess = currencyProfile => ({
    type: GET_CURRENCY_DELETED_VALUE_SUCCESS,
    payload: currencyProfile,
    })
    
    export const getCurrencyDeletedValueFail = error => ({
    type: GET_CURRENCY_DELETED_VALUE_FAIL,
    payload: error,
    })
    
    export const addNewCurrency = currency => ({
    type: ADD_NEW_CURRENCY,
    payload: currency,
    })
    
    export const addCurrencySuccess = currency => ({
        type: ADD_CURRENCY_SUCCESS,
        payload: currency,
    })
    
    export const addCurrencyFail = error => ({
    type: ADD_CURRENCY_FAIL,
    payload: error,
    })
    
    export const updateCurrency = currency => {
    return ({
        type: UPDATE_CURRENCY,
        payload: currency,
    })
    }
    
    export const updateCurrencySuccess = currency => ({
        type: UPDATE_CURRENCY_SUCCESS,
        payload: currency,
    })
    
    export const updateCurrencyFail = error => ({
    type: UPDATE_CURRENCY_FAIL,
    payload: error,
    })
    
    export const deleteCurrency = currency => ({
    type: DELETE_CURRENCY,
    payload: currency,
    })
    
    export const deleteCurrencySuccess = currency => ({
        type: DELETE_CURRENCY_SUCCESS,
        payload: currency,
    })
    
    export const deleteCurrencyFail = error => ({
    type: DELETE_CURRENCY_FAIL,
    payload: error,
    })