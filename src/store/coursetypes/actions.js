import {
    GET_COURSETYPE_DELETED_VALUE,
    GET_COURSETYPE_DELETED_VALUE_FAIL,
    GET_COURSETYPE_DELETED_VALUE_SUCCESS,
    GET_COURSETYPES,
    GET_COURSETYPES_FAIL,
    GET_COURSETYPES_SUCCESS,
    ADD_NEW_COURSETYPE,
    ADD_COURSETYPE_SUCCESS,
    ADD_COURSETYPE_FAIL,
    UPDATE_COURSETYPE,
    UPDATE_COURSETYPE_SUCCESS,
    UPDATE_COURSETYPE_FAIL,
    DELETE_COURSETYPE,
    DELETE_COURSETYPE_SUCCESS,
    DELETE_COURSETYPE_FAIL,
    } from "./actionTypes"
    
    export const getCourseTypes = () => ({
    type: GET_COURSETYPES,
    })
    
    export const getCourseTypesSuccess = covernorates => ({
    type: GET_COURSETYPES_SUCCESS,
    payload: covernorates,
    })
    
    export const getCourseTypesFail = error => ({
    type: GET_COURSETYPES_FAIL,
    payload: error,
    })
    
    export const getCourseTypeDeletedValue = () => ({
    type: GET_COURSETYPE_DELETED_VALUE,
    })
    
    export const getCourseTypeDeletedValueSuccess = courseTypeProfile => ({
    type: GET_COURSETYPE_DELETED_VALUE_SUCCESS,
    payload: courseTypeProfile,
    })
    
    export const getCourseTypeDeletedValueFail = error => ({
    type: GET_COURSETYPE_DELETED_VALUE_FAIL,
    payload: error,
    })
    
    export const addNewCourseType = courseType => ({
    type: ADD_NEW_COURSETYPE,
    payload: courseType,
    })
    
    export const addCourseTypeSuccess = courseType => ({
        type: ADD_COURSETYPE_SUCCESS,
        payload: courseType,
    })
    
    export const addCourseTypeFail = error => ({
    type: ADD_COURSETYPE_FAIL,
    payload: error,
    })
    
    export const updateCourseType = courseType => {
    return ({
        type: UPDATE_COURSETYPE,
        payload: courseType,
    })
    }
    
    export const updateCourseTypeSuccess = courseType => ({
        type: UPDATE_COURSETYPE_SUCCESS,
        payload: courseType,
    })
    
    export const updateCourseTypeFail = error => ({
    type: UPDATE_COURSETYPE_FAIL,
    payload: error,
    })
    
    export const deleteCourseType = courseType => ({
    type: DELETE_COURSETYPE,
    payload: courseType,
    })
    
    export const deleteCourseTypeSuccess = courseType => ({
        type: DELETE_COURSETYPE_SUCCESS,
        payload: courseType,
    })
    
    export const deleteCourseTypeFail = error => ({
    type: DELETE_COURSETYPE_FAIL,
    payload: error,
    })