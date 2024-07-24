import {
    GET_GOVERNORATE_DELETED_VALUE,
    GET_GOVERNORATE_DELETED_VALUE_FAIL,
    GET_GOVERNORATE_DELETED_VALUE_SUCCESS,
    GET_GOVERNORATES,
    GET_GOVERNORATES_FAIL,
    GET_GOVERNORATES_SUCCESS,
    ADD_NEW_GOVERNORATE,
    ADD_GOVERNORATE_SUCCESS,
    ADD_GOVERNORATE_FAIL,
    UPDATE_GOVERNORATE,
    UPDATE_GOVERNORATE_SUCCESS,
    UPDATE_GOVERNORATE_FAIL,
    DELETE_GOVERNORATE,
    DELETE_GOVERNORATE_SUCCESS,
    DELETE_GOVERNORATE_FAIL,
    IMPORT_GOVERNORATES,
    IMPORT_GOVERNORATES_SUCCESS,
    IMPORT_GOVERNORATES_FAIL
    } from "./actionTypes"
    
    export const getGovernorates = () => ({
    type: GET_GOVERNORATES,
    })
    
    export const getGovernoratesSuccess = covernorates => ({
    type: GET_GOVERNORATES_SUCCESS,
    payload: covernorates,
    })
    
    export const getGovernoratesFail = error => ({
    type: GET_GOVERNORATES_FAIL,
    payload: error,
    })
    
    export const getGovernorateDeletedValue = () => ({
    type: GET_GOVERNORATE_DELETED_VALUE,
    })
    
    export const getGovernorateDeletedValueSuccess = governorateProfile => ({
    type: GET_GOVERNORATE_DELETED_VALUE_SUCCESS,
    payload: governorateProfile,
    })
    
    export const getGovernorateDeletedValueFail = error => ({
    type: GET_GOVERNORATE_DELETED_VALUE_FAIL,
    payload: error,
    })
    
    export const addNewGovernorate = governorate => ({
    type: ADD_NEW_GOVERNORATE,
    payload: governorate,
    })
    
    export const addGovernorateSuccess = governorate => ({
    type: ADD_GOVERNORATE_SUCCESS,
    payload: governorate,
    })
    
    export const addGovernorateFail = error => ({
    type: ADD_GOVERNORATE_FAIL,
    payload: error,
    })

    export const importGovernorates = nationality => ({
        type: IMPORT_GOVERNORATES,
        payload: nationality,
      })
      
      export const importGovernoratesSuccess = nationality => ({
        type: IMPORT_GOVERNORATES_SUCCESS,
        payload: nationality,
      })
      
      export const importGovernoratesFail = error => ({
        type: IMPORT_GOVERNORATES_FAIL,
        payload: error,
      })
      
    
    export const updateGovernorate = governorate => {
    return ({
    type: UPDATE_GOVERNORATE,
    payload: governorate,
    })
    }
    
    export const updateGovernorateSuccess = governorate => ({
    type: UPDATE_GOVERNORATE_SUCCESS,
    payload: governorate,
    })
    
    export const updateGovernorateFail = error => ({
    type: UPDATE_GOVERNORATE_FAIL,
    payload: error,
    })
    
    export const deleteGovernorate = governorate => ({
    type: DELETE_GOVERNORATE,
    payload: governorate,
    })
    
    export const deleteGovernorateSuccess = governorate => ({
    type: DELETE_GOVERNORATE_SUCCESS,
    payload: governorate,
    })
    
    export const deleteGovernorateFail = error => ({
    type: DELETE_GOVERNORATE_FAIL,
    payload: error,
    })