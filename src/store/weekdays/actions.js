import {
  GET_WEEKDAY_PROFILE,
  GET_WEEKDAY_PROFILE_FAIL,
  GET_WEEKDAY_PROFILE_SUCCESS,
  GET_WEEKDAYS,
  GET_WEEKDAYS_FAIL,
  GET_WEEKDAYS_SUCCESS,
  ADD_NEW_WEEKDAY,
  ADD_WEEKDAY_SUCCESS,
  ADD_WEEKDAY_FAIL,
  UPDATE_WEEKDAY,
  UPDATE_WEEKDAY_SUCCESS,
  UPDATE_WEEKDAY_FAIL,
  DELETE_WEEKDAY,
  DELETE_WEEKDAY_SUCCESS,
  DELETE_WEEKDAY_FAIL,
  } from "./actionTypes"
  
  export const getWeekDays = () => ({
  type: GET_WEEKDAYS,
  })
  
  export const getWeekDaysSuccess = weekDays => ({
  type: GET_WEEKDAYS_SUCCESS,
  payload: weekDays,
  })
  
  export const getWeekDaysFail = error => ({
  type: GET_WEEKDAYS_FAIL,
  payload: error,
  })
  
  export const getWeekDayProfile = () => ({
  type: GET_WEEKDAY_PROFILE,
  })
  
  export const getWeekDayProfileSuccess = weekDayProfile => ({
  type: GET_WEEKDAY_PROFILE_SUCCESS,
  payload: weekDayProfile,
  })
  
  export const getWeekDayProfileFail = error => ({
  type: GET_WEEKDAY_PROFILE_FAIL,
  payload: error,
  })
  
  export const addNewWeekDay = weekDay => ({
  type: ADD_NEW_WEEKDAY,
  payload: weekDay,
  })
  
  export const addWeekDaySuccess = weekDay => ({
  type: ADD_WEEKDAY_SUCCESS,
  payload: weekDay,
  })
  
  export const addWeekDayFail = error => ({
  type: ADD_WEEKDAY_FAIL,
  payload: error,
  })
  
  export const updateWeekDay = weekDay => {
  return ({
  type: UPDATE_WEEKDAY,
  payload: weekDay,
  })
  }
  
  export const updateWeekDaySuccess = weekDay => ({
  type: UPDATE_WEEKDAY_SUCCESS,
  payload: weekDay,
  })
  
  export const updateWeekDayFail = error => ({
  type: UPDATE_WEEKDAY_FAIL,
  payload: error,
  })
  
  export const deleteWeekDay = weekDay => ({
  type: DELETE_WEEKDAY,
  payload: weekDay,
  })
  
  export const deleteWeekDaySuccess = weekDay => ({
  type: DELETE_WEEKDAY_SUCCESS,
  payload: weekDay,
  })
  
  export const deleteWeekDayFail = error => ({
  type: DELETE_WEEKDAY_FAIL,
  payload: error,
  })