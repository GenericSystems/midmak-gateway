import {
  
  GET_STUDENTS_OPTIONS,
  GET_STUDENTS_OPTIONS_SUCCESS,
  GET_STUDENTS_OPTIONS_FAIL,
  UPDATE_PASSWORD,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAIL,
  } from "./actionTypes"
  
  export const getStudentsOptions = () => ({
    type: GET_STUDENTS_OPTIONS,
  })
  
  export const getStudentsOptionsSuccess = students => ({
    type: GET_STUDENTS_OPTIONS_SUCCESS,
    payload: students,
  })
  
  export const getStudentsOptionsFail = error => ({
    type: GET_STUDENTS_OPTIONS_FAIL,
    payload: error,
  })
  
  export const updatePassword = studentinfo =>{
    return ({
      type: UPDATE_PASSWORD,
      payload: studentinfo,
    })
  } 
  
  export const updatePasswordSuccess = studentinfo => ({
    type: UPDATE_PASSWORD_SUCCESS,
    payload: studentinfo,
  })
  
  export const updatePasswordFail = error => ({
    type: UPDATE_PASSWORD_FAIL,
    payload: error,
  })
  
