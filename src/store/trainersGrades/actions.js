import {
    GET_MAJORS_TYPES,
    GET_MAJORS_TYPES_FAIL,
    GET_MAJORS_TYPES_SUCCESS,
    ADD_NEW_MAJOR_TYPE,
    ADD_MAJOR_TYPE_SUCCESS,
    ADD_MAJOR_TYPE_FAIL,
    UPDATE_MAJOR_TYPE,
    UPDATE_MAJOR_TYPE_SUCCESS,
    UPDATE_MAJOR_TYPE_FAIL,
    DELETE_MAJOR_TYPE,
    DELETE_MAJOR_TYPE_SUCCESS,
    DELETE_MAJOR_TYPE_FAIL,
    GET_MAJOR_TYPE_DELETED_VALUE,
    GET_MAJOR_TYPE_DELETED_VALUE_FAIL,
    GET_MAJOR_TYPE_DELETED_VALUE_SUCCESS,
  } from "./actionTypes"
  
  export const getTrainersGrades = () => ({
    type: GET_MAJORS_TYPES,
  })
  
  export const getTrainersGradesSuccess = trainersGrades => ({
    type: GET_MAJORS_TYPES_SUCCESS,
    payload: trainersGrades,
  })
  
  export const getTrainersGradesFail = error => ({
    type: GET_MAJORS_TYPES_FAIL,
    payload: error,
  })
  
  
  export const addNewTrainerGrade = trainerGrade => ({
    type: ADD_NEW_MAJOR_TYPE,
    payload: trainerGrade,
  })
  
  export const addTrainerGradeSuccess = trainerGrade => ({
    type: ADD_MAJOR_TYPE_SUCCESS,
    payload: trainerGrade,
  })
  
  export const addTrainerGradeFail = error => ({
    type: ADD_MAJOR_TYPE_FAIL,
    payload: error,
  })
  
  export const updateTrainerGrade = trainerGrade =>{
    return ({
      type: UPDATE_MAJOR_TYPE,
      payload: trainerGrade,
    })
  } 
  
  export const updateTrainerGradeSuccess = trainerGrade => ({
    type: UPDATE_MAJOR_TYPE_SUCCESS,
    payload: trainerGrade,
  })
  
  export const updateTrainerGradeFail = error => ({
    type: UPDATE_MAJOR_TYPE_FAIL,
    payload: error,
  })
  
  export const deleteTrainerGrade = trainerGrade => ({
    type: DELETE_MAJOR_TYPE,
    payload: trainerGrade,
  })
  
  export const deleteTrainerGradeSuccess = trainerGrade => ({
    type: DELETE_MAJOR_TYPE_SUCCESS,
    payload: trainerGrade,
  })
  
  export const deleteTrainerGradeFail = error => ({
    type: DELETE_MAJOR_TYPE_FAIL,
    payload: error,
  })
  
  export const getTrainerGradeDeletedValue = () => ({
    type: GET_MAJOR_TYPE_DELETED_VALUE,
  });
  
  export const getTrainerGradeDeletedValueSuccess = deleted => ({
    type: GET_MAJOR_TYPE_DELETED_VALUE_SUCCESS,
    payload: deleted,
  });
  
  export const getTrainerGradeDeletedValueFail = error => ({
    type: GET_MAJOR_TYPE_DELETED_VALUE_FAIL,
    payload: error,
  });