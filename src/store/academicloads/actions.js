import {
   GET_ACADEMIC_LOADS,
   GET_ACADEMIC_LOADS_SUCCESS,
   GET_ACADEMIC_LOADS_FAIL,
   ADD_NEW_ACADEMIC_LOAD,
   ADD_ACADEMIC_LOAD_SUCCESS,
   ADD_ACADEMIC_LOAD_FAIL,
   UPDATE_ACADEMIC_LOAD,
   UPDATE_ACADEMIC_LOAD_SUCCESS,
   UPDATE_ACADEMIC_LOAD_FAIL,
   DELETE_ACADEMIC_LOAD,
   DELETE_ACADEMIC_LOAD_SUCCESS,
   DELETE_ACADEMIC_LOAD_FAIL,
   GET_ACADEMIC_LOAD_DELETED_VALUE,
   GET_ACADEMIC_LOAD_DELETED_VALUE_FAIL,
   GET_ACADEMIC_LOAD_DELETED_VALUE_SUCCESS,
  } from "./actionTypes";
  
  export const getAcademicLoads = () => ({
    type: GET_ACADEMIC_LOADS,
  });
  
  export const getAcademicLoadsSuccess = academicloads => ({
    type: GET_ACADEMIC_LOADS_SUCCESS,
    payload: academicloads,
  });
  
  export const getAcademicLoadsFail = error => ({
    type: GET_ACADEMIC_LOADS_FAIL,
    payload: error,
  });
  
  export const addNewAcademicLoad = academicload => ({
    type: ADD_NEW_ACADEMIC_LOAD,
    payload: academicload,
  });
  
  export const addAcademicLoadSuccess = academicload => ({
    type: ADD_ACADEMIC_LOAD_SUCCESS,
    payload: academicload,
  });
  
  export const addAcademicLoadFail = error => ({
    type: ADD_ACADEMIC_LOAD_FAIL,
    payload: error,
  });
  
  export const updateAcademicLoad = academicload => {
    return {
      type: UPDATE_ACADEMIC_LOAD,
      payload: academicload,
    };
  };
  
  export const updateAcademicLoadSuccess = academicload => ({
    type: UPDATE_ACADEMIC_LOAD_SUCCESS,
    payload: academicload,
  });
  
  export const updateAcademicLoadFail = error => ({
    type: UPDATE_ACADEMIC_LOAD_FAIL,
    payload: error,
  });
  
  export const deleteAcademicLoad = academicload => ({
    type: DELETE_ACADEMIC_LOAD,
    payload: academicload,
  });
  
  export const deleteAcademicLoadSuccess = academicload => ({
    type: DELETE_ACADEMIC_LOAD_SUCCESS,
    payload: academicload,
  });
  
  export const deleteAcademicLoadFail = error => ({
    type: DELETE_ACADEMIC_LOAD_FAIL,
    payload: error,
  });
  
  export const getAcademicLoadDeletedValue = () => ({
    type: GET_ACADEMIC_LOAD_DELETED_VALUE,
  });
  
  export const getAcademicLoadDeletedValueSuccess = deleted => ({
    type: GET_ACADEMIC_LOAD_DELETED_VALUE_SUCCESS,
    payload: deleted,
  });
  
  export const getAcademicLoadDeletedValueFail = error => ({
    type: GET_ACADEMIC_LOAD_DELETED_VALUE_FAIL,
    payload: error,
  });