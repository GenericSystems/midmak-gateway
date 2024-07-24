import {
    GET_CURRENT_SEMESTER,
    GET_CURRENT_SEMESTER_FAIL,
    GET_CURRENT_SEMESTER_SUCCESS,
    GET_SEMESTERS,
    GET_SEMESTERS_FAIL,
    GET_SEMESTERS_SUCCESS,
    ADD_NEW_SEMESTER,
    ADD_SEMESTER_SUCCESS,
    ADD_SEMESTER_FAIL,
    UPDATE_SEMESTER,
    UPDATE_SEMESTER_SUCCESS,
    UPDATE_SEMESTER_FAIL,
    DELETE_SEMESTER,
    DELETE_SEMESTER_SUCCESS,
    DELETE_SEMESTER_FAIL,
    GET_SEMESTER_DELETED_VALUE,
    GET_SEMESTER_DELETED_VALUE_FAIL,
    GET_SEMESTER_DELETED_VALUE_SUCCESS,
    } from "./actionTypes"
    
    export const getSemesters = () => ({
    type: GET_SEMESTERS,
    })
    
    export const getSemestersSuccess = semesters => ({
    type: GET_SEMESTERS_SUCCESS,
    payload: semesters,
    })
    
    export const getSemestersFail = error => ({
    type: GET_SEMESTERS_FAIL,
    payload: error,
    })
    
    export const getCurrentSemester = () => ({
    type: GET_CURRENT_SEMESTER,
    })
    
    export const getCurrentSemesterSuccess = currentSemester => ({
    type: GET_CURRENT_SEMESTER_SUCCESS,
    payload: currentSemester,
    })
    
    export const getCurrentSemesterFail = error => ({
    type: GET_CURRENT_SEMESTER_FAIL,
    payload: error,
    })
    
    export const addNewSemester = semester => ({
    type: ADD_NEW_SEMESTER,
    payload: semester,
    })
    
    export const addSemesterSuccess = semester => ({
    type: ADD_SEMESTER_SUCCESS,
    payload: semester,
    })
    
    export const addSemesterFail = error => ({
    type: ADD_SEMESTER_FAIL,
    payload: error,
    })
    
    export const updateSemester = semester => {
    return ({
    type: UPDATE_SEMESTER,
    payload: semester,
    })
    }
    
    export const updateSemesterSuccess = semester => ({
    type: UPDATE_SEMESTER_SUCCESS,
    payload: semester,
    })
    
    export const updateSemesterFail = error => ({
    type: UPDATE_SEMESTER_FAIL,
    payload: error,
    })
    
    export const deleteSemester = semester => ({
    type: DELETE_SEMESTER,
    payload: semester,
    })
    
    export const deleteSemesterSuccess = semester => ({
    type: DELETE_SEMESTER_SUCCESS,
    payload: semester,
    })
    
    export const deleteSemesterFail = error => ({
    type: DELETE_SEMESTER_FAIL,
    payload: error,
    })

    export const getSemesterDeletedValue = () => ({
        type: GET_SEMESTER_DELETED_VALUE,
      });
      
      export const getSemesterDeletedValueSuccess = deleted => ({
        type: GET_SEMESTER_DELETED_VALUE_SUCCESS,
        payload: deleted,
      });
      
      export const getSemesterDeletedValueFail = error => ({
        type: GET_SEMESTER_DELETED_VALUE_FAIL,
        payload: error,
      });