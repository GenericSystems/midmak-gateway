import {
    GET_LECTURE_PERIODS,
    GET_LECTURE_PERIODS_FAIL,
    GET_LECTURE_PERIODS_SUCCESS,
    GET_LECTURE_PERIOD_PROFILE,
    GET_LECTURE_PERIOD_PROFILE_FAIL,
    GET_LECTURE_PERIOD_PROFILE_SUCCESS,
    ADD_NEW_LECTURE_PERIOD,
    ADD_LECTURE_PERIOD_SUCCESS,
    ADD_LECTURE_PERIOD_FAIL,
    UPDATE_LECTURE_PERIOD,
    UPDATE_LECTURE_PERIOD_SUCCESS,
    UPDATE_LECTURE_PERIOD_FAIL,
    DELETE_LECTURE_PERIOD,
    DELETE_LECTURE_PERIOD_SUCCESS,
    DELETE_LECTURE_PERIOD_FAIL,
  } from "./actionTypes"
  
  export const getLecturePeriods = () => ({
    type: GET_LECTURE_PERIODS,
  })
  
  export const getLecturePeriodsSuccess = lecturePeriods => ({
    type: GET_LECTURE_PERIODS_SUCCESS,
    payload: lecturePeriods,
  })
  
  export const getLecturePeriodsFail = error => ({
    type: GET_LECTURE_PERIODS_FAIL,
    payload: error,
  })
  
  export const getLecturePeriodProfile = lecturePeriodId => ({
    type: GET_LECTURE_PERIOD_PROFILE,
    lecturePeriodId,
  })
  
  export const getLecturePeriodProfileSuccess = lecturePeriodProfiles => ({
    type: GET_LECTURE_PERIOD_PROFILE_SUCCESS,
    payload: lecturePeriodProfiles,
  })
  
  export const getLecturePeriodProfileFail = error => ({
    type: GET_LECTURE_PERIOD_PROFILE_FAIL,
    payload: error,
  })
  
  export const addNewLecturePeriod = lecturePeriod => ({
    type: ADD_NEW_LECTURE_PERIOD,
    payload: lecturePeriod,
  })
  
  export const addLecturePeriodSuccess = lecturePeriod => ({
    type: ADD_LECTURE_PERIOD_SUCCESS,
    payload: lecturePeriod,
  })
  
  export const addLecturePeriodFail = error => ({
    type: ADD_LECTURE_PERIOD_FAIL,
    payload: error,
  })
  
  export const updateLecturePeriod = lecturePeriod => ({
    type: UPDATE_LECTURE_PERIOD,
    payload: lecturePeriod,
  })
  
  export const updateLecturePeriodSuccess = lecturePeriod => ({
    type: UPDATE_LECTURE_PERIOD_SUCCESS,
    payload: lecturePeriod,
  })
  
  export const updateLecturePeriodFail = error => ({
    type: UPDATE_LECTURE_PERIOD_FAIL,
    payload: error,
  })
  
  export const deleteLecturePeriod = lecturePeriod => ({
    type: DELETE_LECTURE_PERIOD,
    payload: lecturePeriod,
  })
  
  export const deleteLecturePeriodSuccess = lecturePeriod => ({
    type: DELETE_LECTURE_PERIOD_SUCCESS,
    payload: lecturePeriod,
  })
  
  export const deleteLecturePeriodFail = error => ({
    type: DELETE_LECTURE_PERIOD_FAIL,
    payload: error,
  })