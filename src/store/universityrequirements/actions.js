import {
    GET_UNIVERSITYREQUIREMENTS_PROFILE,
    GET_UNIVERSITYREQUIREMENTS_PROFILE_FAIL,
    GET_UNIVERSITYREQUIREMENTS_PROFILE_SUCCESS,
    GET_UNIVERSITYREQUIREMENTS,
    GET_UNIVERSITYREQUIREMENTS_FAIL,
    GET_UNIVERSITYREQUIREMENTS_SUCCESS,
    ADD_NEW_UNIVERSITYREQUIREMENTS,
    ADD_UNIVERSITYREQUIREMENTS_SUCCESS,
    ADD_UNIVERSITYREQUIREMENTS_FAIL,
    UPDATE_UNIVERSITYREQUIREMENTS,
    UPDATE_UNIVERSITYREQUIREMENTS_SUCCESS,
    UPDATE_UNIVERSITYREQUIREMENTS_FAIL,
    DELETE_UNIVERSITYREQUIREMENTS,
    DELETE_UNIVERSITYREQUIREMENTS_SUCCESS,
    DELETE_UNIVERSITYREQUIREMENTS_FAIL,
    } from "./actionTypes"
    
    export const getUniversityrequirements = () => ({
    type: GET_UNIVERSITYREQUIREMENTS,
    })
    
    export const getUniversityrequirementsSuccess = universityrequirement => ({
    type: GET_UNIVERSITYREQUIREMENTS_SUCCESS,
    payload: universityrequirement,
    })
    
    export const getUniversityrequirementsFail = error => ({
    type: GET_UNIVERSITYREQUIREMENTS_FAIL,
    payload: error,
    })
    
    export const getUniversityrequirementProfile = () => ({
    type: GET_UNIVERSITYREQUIREMENTS_PROFILE,
    })
    
    export const getUniversityrequirementProfileSuccess = universityrequirementProfile => ({
    type: GET_UNIVERSITYREQUIREMENTS_PROFILE_SUCCESS,
    payload: universityrequirementProfile,
    })
    
    export const getUniversityrequirementProfileFail = error => ({
    type: GET_UNIVERSITYREQUIREMENTS_PROFILE_FAIL,
    payload: error,
    })
    
    export const addNewUniversityrequirement = universityrequirement => ({
    type: ADD_NEW_UNIVERSITYREQUIREMENTS,
    payload: universityrequirement,
    })
    
    export const addUniversityrequirementSuccess = universityrequirement => ({
    type: ADD_UNIVERSITYREQUIREMENTS_SUCCESS,
    payload: universityrequirement,
    })
    
    export const addUniversityrequirementFail = error => ({
    type: ADD_UNIVERSITYREQUIREMENTS_FAIL,
    payload: error,
    })
    
    export const updateUniversityrequirement = universityrequirement => {
    return ({
    type: UPDATE_UNIVERSITYREQUIREMENTS,
    payload: universityrequirement,
    })
    }
    
    export const updateUniversityrequirementSuccess = universityrequirement => ({
    type: UPDATE_UNIVERSITYREQUIREMENTS_SUCCESS,
    payload: universityrequirement,
    })
    
    export const updateUniversityrequirementFail = error => ({
    type: UPDATE_UNIVERSITYREQUIREMENTS_FAIL,
    payload: error,
    })
    
    export const deleteUniversityrequirement = universityrequirement => ({
    type: DELETE_UNIVERSITYREQUIREMENTS,
    payload: universityrequirement,
    })
    

    export const deleteUniversityrequirementSuccess = universityrequirement => ({
    type: DELETE_UNIVERSITYREQUIREMENTS_SUCCESS,
    payload: universityrequirement,
    })
    
    export const deleteUniversityrequirementFail = error => ({
    type: DELETE_UNIVERSITYREQUIREMENTS_FAIL,
    payload: error,
    })