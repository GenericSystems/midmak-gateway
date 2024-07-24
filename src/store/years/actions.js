import {
    GET_YEAR_DELETED_VALUE,
    GET_YEAR_DELETED_VALUE_FAIL,
    GET_YEAR_DELETED_VALUE_SUCCESS,
    GET_YEARS,
    GET_YEARS_FAIL,
    GET_YEARS_SUCCESS,
    ADD_NEW_YEAR,
    ADD_YEAR_SUCCESS,
    ADD_YEAR_FAIL,
    UPDATE_YEAR,
    UPDATE_YEAR_SUCCESS,
    UPDATE_YEAR_FAIL,
    DELETE_YEAR,
    DELETE_YEAR_SUCCESS,
    DELETE_YEAR_FAIL,
    } from "./actionTypes"
    
    export const getYears = () => ({
    type: GET_YEARS,
    })
    
    export const getYearsSuccess = years => ({
    type: GET_YEARS_SUCCESS,
    payload: years,
    })
    
    export const getYearsFail = error => ({
    type: GET_YEARS_FAIL,
    payload: error,
    })
    
    export const getYearDeletedValue = () => ({
    type: GET_YEAR_DELETED_VALUE,
    })
    
    export const getYearDeletedValueSuccess = deleted => ({
    type: GET_YEAR_DELETED_VALUE_SUCCESS,
    payload: deleted,
    })
    
    export const getYearDeletedValueFail = error => ({
    type: GET_YEAR_DELETED_VALUE_FAIL,
    payload: error,
    })
    
    export const addNewYear = year => ({
    type: ADD_NEW_YEAR,
    payload: year,
    })
    
    export const addYearSuccess = year => ({
    type: ADD_YEAR_SUCCESS,
    payload: year,
    })
    
    export const addYearFail = error => ({
    type: ADD_YEAR_FAIL,
    payload: error,
    })
    
    export const updateYear = year => {
    return ({
    type: UPDATE_YEAR,
    payload: year,
    })
    }
    
    export const updateYearSuccess = year => ({
    type: UPDATE_YEAR_SUCCESS,
    payload: year,
    })
    
    export const updateYearFail = error => ({
    type: UPDATE_YEAR_FAIL,
    payload: error,
    })
    
    export const deleteYear = year => ({
    type: DELETE_YEAR,
    payload: year,
    })
    
    export const deleteYearSuccess = year => ({
    type: DELETE_YEAR_SUCCESS,
    payload: year,
    })
    
    export const deleteYearFail = error => ({
    type: DELETE_YEAR_FAIL,
    payload: error,
    })