import {
    GET_PREREQ_DELETED_VALUE,
    GET_PREREQ_DELETED_VALUE_FAIL,
    GET_PREREQ_DELETED_VALUE_SUCCESS,
    GET_PREREQS,
    GET_PREREQS_FAIL,
    GET_PREREQS_SUCCESS,
    ADD_NEW_PREREQ,
    ADD_PREREQ_SUCCESS,
    ADD_PREREQ_FAIL,
    UPDATE_PREREQ,
    UPDATE_PREREQ_SUCCESS,
    UPDATE_PREREQ_FAIL,
    DELETE_PREREQ,
    DELETE_PREREQ_SUCCESS,
    DELETE_PREREQ_FAIL,
    } from "./actionTypes"
    
    export const getPrereqs = () => ({
    type: GET_PREREQS,
    })
    
    export const getPrereqsSuccess = prereqs => ({
    type: GET_PREREQS_SUCCESS,
    payload: prereqs,
    })
    
    export const getPrereqsFail = error => ({
    type: GET_PREREQS_FAIL,
    payload: error,
    })
    
    export const getPrereqDeletedValue = () => ({
    type: GET_PREREQ_DELETED_VALUE,
    })
    
    export const getPrereqDeletedValueSuccess = deleted => ({
    type: GET_PREREQ_DELETED_VALUE_SUCCESS,
    payload: deleted,
    })
    
    export const getPrereqDeletedValueFail = error => ({
    type: GET_PREREQ_DELETED_VALUE_FAIL,
    payload: error,
    })
    
    export const addNewPrereq = prereq => ({
    type: ADD_NEW_PREREQ,
    payload: prereq,
    })
    
    export const addPrereqSuccess = prereq => ({
    type: ADD_PREREQ_SUCCESS,
    payload: prereq,
    })
    
    export const addPrereqFail = error => ({
    type: ADD_PREREQ_FAIL,
    payload: error,
    })
    
    export const updatePrereq = prereq => {
    return ({
    type: UPDATE_PREREQ,
    payload: prereq,
    })
    }
    
    export const updatePrereqSuccess = prereq => ({
    type: UPDATE_PREREQ_SUCCESS,
    payload: prereq,
    })
    
    export const updatePrereqFail = error => ({
    type: UPDATE_PREREQ_FAIL,
    payload: error,
    })
    
    export const deletePrereq = prereq => ({
    type: DELETE_PREREQ,
    payload: prereq,
    })
    
    export const deletePrereqSuccess = prereq => ({
    type: DELETE_PREREQ_SUCCESS,
    payload: prereq,
    })
    
    export const deletePrereqFail = error => ({
    type: DELETE_PREREQ_FAIL,
    payload: error,
    })