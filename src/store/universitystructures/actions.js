import {
    GET_STRUCTURE_DELETED_VALUE,
    GET_STRUCTURE_DELETED_VALUE_FAIL,
    GET_STRUCTURE_DELETED_VALUE_SUCCESS,
    GET_STRUCTURES,
    GET_STRUCTURES_FAIL,
    GET_STRUCTURES_SUCCESS,
    ADD_NEW_STRUCTURE,
    ADD_STRUCTURE_SUCCESS,
    ADD_STRUCTURE_FAIL,
    UPDATE_STRUCTURE,
    UPDATE_STRUCTURE_SUCCESS,
    UPDATE_STRUCTURE_FAIL,
    DELETE_STRUCTURE,
    DELETE_STRUCTURE_SUCCESS,
    DELETE_STRUCTURE_FAIL,
    } from "./actionTypes"
    
    export const getStructures = () => ({
    type: GET_STRUCTURES,
    })
    
    export const getStructuresSuccess = covernorates => ({
    type: GET_STRUCTURES_SUCCESS,
    payload: covernorates,
    })
    
    export const getStructuresFail = error => ({
    type: GET_STRUCTURES_FAIL,
    payload: error,
    })
    
    export const getStructureDeletedValue = () => ({
    type: GET_STRUCTURE_DELETED_VALUE,
    })
    
    export const getStructureDeletedValueSuccess = deleted => ({
    type: GET_STRUCTURE_DELETED_VALUE_SUCCESS,
    payload: deleted,
    })
    
    export const getStructureDeletedValueFail = error => ({
    type: GET_STRUCTURE_DELETED_VALUE_FAIL,
    payload: error,
    })
    
    export const addNewStructure = structure => ({
    type: ADD_NEW_STRUCTURE,
    payload: structure,
    })
    
    export const addStructureSuccess = structure => ({
        type: ADD_STRUCTURE_SUCCESS,
        payload: structure,
    })
    
    export const addStructureFail = error => ({
    type: ADD_STRUCTURE_FAIL,
    payload: error,
    })
    
    export const updateStructure = structure => {
    return ({
        type: UPDATE_STRUCTURE,
        payload: structure,
    })
    }
    
    export const updateStructureSuccess = structure => ({
        type: UPDATE_STRUCTURE_SUCCESS,
        payload: structure,
    })
    
    export const updateStructureFail = error => ({
    type: UPDATE_STRUCTURE_FAIL,
    payload: error,
    })
    
    export const deleteStructure = structure => ({
    type: DELETE_STRUCTURE,
    payload: structure,
    })
    
    export const deleteStructureSuccess = structure => ({
        type: DELETE_STRUCTURE_SUCCESS,
        payload: structure,
    })
    
    export const deleteStructureFail = error => ({
    type: DELETE_STRUCTURE_FAIL,
    payload: error,
    })