import {
  GET_ADMISSION_SETTING,
    GET_ADMISSION_CONDITIONS,
    GET_ADMISSION_CONDITIONS_FAIL,
    GET_ADMISSION_CONDITIONS_SUCCESS,
    ADD_NEW_ADMISSION_CONDITION,
    ADD_ADMISSION_CONDITION_SUCCESS,
    ADD_ADMISSION_CONDITION_FAIL,
    UPDATE_ADMISSION_CONDITION,
    UPDATE_ADMISSION_CONDITION_SUCCESS,
    UPDATE_ADMISSION_CONDITION_FAIL,
    DELETE_ADMISSION_CONDITION,
    DELETE_ADMISSION_CONDITION_SUCCESS,
    DELETE_ADMISSION_CONDITION_FAIL,
    GET_FILTERED_FACULTIES,
    GET_FILTERED_FACULTIES_FAIL,
    GET_FILTERED_FACULTIES_SUCCESS,
    GET_ADMISSION_CONDITION_DELETED_VALUE,
    GET_ADMISSION_CONDITION_DELETED_VALUE_FAIL,
    GET_ADMISSION_CONDITION_DELETED_VALUE_SUCCESS,
    COPY_ADMISSION_COND,
    COPY_ADMISSION_COND_SUCCESS,
    COPY_ADMISSION_COND_FAIL,
  } from "./actionTypes";
  
  export const getAdmissionConditions = admissionConditions => ({
    type: GET_ADMISSION_CONDITIONS,
    payload: admissionConditions,
  });
  
  export const getAdmissionConditionsSuccess = admissionConditions => ({
    type: GET_ADMISSION_CONDITIONS_SUCCESS,
    payload: admissionConditions,
  });
  
  export const getAdmissionConditionsFail = error => ({
    type: GET_ADMISSION_CONDITIONS_FAIL,
    payload: error,
  });
  
  export const addNewAdmissionCondition = admissionCondition => ({
    type: ADD_NEW_ADMISSION_CONDITION,
    payload: admissionCondition,
  });
  
  export const addAdmissionConditionSuccess = admissionCondition => ({
    type: ADD_ADMISSION_CONDITION_SUCCESS,
    payload: admissionCondition,
  });
  
  export const addAdmissionConditionFail = error => ({
    type: ADD_ADMISSION_CONDITION_FAIL,
    payload: error,
  });
  
  export const updateAdmissionCondition = admissionCondition => ({
    type: UPDATE_ADMISSION_CONDITION,
    payload: admissionCondition,
  });
  
  export const updateAdmissionConditionSuccess = admissionCondition => ({
    type: UPDATE_ADMISSION_CONDITION_SUCCESS,
    payload: admissionCondition,
  });
  
  export const updateAdmissionConditionFail = error => ({
    type: UPDATE_ADMISSION_CONDITION_FAIL,
    payload: error,
  });
  
  export const deleteAdmissionCondition = admissionCondition => ({
    type: DELETE_ADMISSION_CONDITION,
    payload: admissionCondition,
  });
  
  export const deleteAdmissionConditionSuccess = admissionCondition => ({
    type: DELETE_ADMISSION_CONDITION_SUCCESS,
    payload: admissionCondition,
  });
  
  export const deleteAdmissionConditionFail = error => ({
    type: DELETE_ADMISSION_CONDITION_FAIL,
    payload: error,
  });
  
  export const fetchAdmissionSetting = () => ({
    type: GET_ADMISSION_SETTING,
  });

  export const getFilteredFaculties = admissionCond => ({ 
    type: GET_FILTERED_FACULTIES,
    payload: admissionCond,
  });
  
  export const getFilteredFacultiesSuccess = admissionCond => ({
    type: GET_FILTERED_FACULTIES_SUCCESS,
    payload: admissionCond,
  });
  
  export const getFilteredFacultiesFail = error => ({
    type: GET_FILTERED_FACULTIES_FAIL,
    payload: error,
  });

  export const getAdmissionConditionDeletedValue = () => ({
    type: GET_ADMISSION_CONDITION_DELETED_VALUE,
  });
  
  
  
  export const getAdmissionConditionDeletedValueSuccess = deleted => ({
    type: GET_ADMISSION_CONDITION_DELETED_VALUE_SUCCESS,
    payload: deleted,
  });
  
  export const getAdmissionConditionDeletedValueFail = error => ({
    type: GET_ADMISSION_CONDITION_DELETED_VALUE_FAIL,
    payload: error,
  });

  export const copyAdmissionCond = admissionCond => ({
    type: COPY_ADMISSION_COND,
    payload: admissionCond,
  });
  
  export const copyAdmissionCondSuccess = admissionCond => ({
    type: COPY_ADMISSION_COND_SUCCESS,
    payload: admissionCond,
  });
  
  export const copyAdmissionCondFail = error => ({
    type: COPY_ADMISSION_COND_FAIL,
    payload: error,
  });
  