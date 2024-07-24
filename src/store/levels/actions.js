import {
    GET_LEVEL_DELETED_VALUE,
    GET_LEVEL_DELETED_VALUE_FAIL,
    GET_LEVEL_DELETED_VALUE_SUCCESS,
    GET_LEVELS,
    GET_LEVELS_FAIL,
    GET_LEVELS_SUCCESS,
    ADD_NEW_LEVEL,
    ADD_LEVEL_SUCCESS,
    ADD_LEVEL_FAIL,
    UPDATE_LEVEL,
    UPDATE_LEVEL_SUCCESS,
    UPDATE_LEVEL_FAIL,
    DELETE_LEVEL,
    DELETE_LEVEL_SUCCESS,
    DELETE_LEVEL_FAIL,
    } from "./actionTypes"
    
    export const getLevels = () => ({
    type: GET_LEVELS,
    })
    
    export const getLevelsSuccess = levels => ({
    type: GET_LEVELS_SUCCESS,
    payload: levels,
    })
    
    export const getLevelsFail = error => ({
    type: GET_LEVELS_FAIL,
    payload: error,
    })
    
    export const getLevelDeletedValue = () => ({
    type: GET_LEVEL_DELETED_VALUE,
    })
    
    export const getLevelDeletedValueSuccess = deleted => ({
    type: GET_LEVEL_DELETED_VALUE_SUCCESS,
    payload: deleted,
    })
    
    export const getLevelDeletedValueFail = error => ({
    type: GET_LEVEL_DELETED_VALUE_FAIL,
    payload: error,
    })
    
    export const addNewLevel = level => ({
    type: ADD_NEW_LEVEL,
    payload: level,
    })
    
    export const addLevelSuccess = level => ({
    type: ADD_LEVEL_SUCCESS,
    payload: level,
    })
    
    export const addLevelFail = error => ({
    type: ADD_LEVEL_FAIL,
    payload: error,
    })
    
    export const updateLevel = level => {
    return ({
    type: UPDATE_LEVEL,
    payload: level,
    })
    }
    
    export const updateLevelSuccess = level => ({
    type: UPDATE_LEVEL_SUCCESS,
    payload: level,
    })
    
    export const updateLevelFail = error => ({
    type: UPDATE_LEVEL_FAIL,
    payload: error,
    })
    
    export const deleteLevel = level => ({
    type: DELETE_LEVEL,
    payload: level,
    })
    
    export const deleteLevelSuccess = level => ({
    type: DELETE_LEVEL_SUCCESS,
    payload: level,
    })
    
    export const deleteLevelFail = error => ({
    type: DELETE_LEVEL_FAIL,
    payload: error,
    })