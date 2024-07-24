import {
    GET_SCHEDULE_PROFILE,
    GET_SCHEDULE_PROFILE_FAIL,
    GET_SCHEDULE_PROFILE_SUCCESS,
    GET_SCHEDULES,
    GET_SCHEDULES_FAIL,
    GET_SCHEDULES_SUCCESS,
    ADD_NEW_SCHEDULE,
    ADD_SCHEDULE_SUCCESS,
    ADD_SCHEDULE_FAIL,
    UPDATE_SCHEDULE,
    UPDATE_SCHEDULE_SUCCESS,
    UPDATE_SCHEDULE_FAIL,
    DELETE_SCHEDULE,
    DELETE_SCHEDULE_SUCCESS,
    DELETE_SCHEDULE_FAIL,
    } from "./actionTypes"
    
    export const getSchedules = () => ({
    type: GET_SCHEDULES,
    })
    
    export const getSchedulesSuccess = schedules => ({
    type: GET_SCHEDULES_SUCCESS,
    payload: schedules,
    })
    
    export const getSchedulesFail = error => ({
    type: GET_SCHEDULES_FAIL,
    payload: error,
    })
    
    export const getScheduleProfile = () => ({
    type: GET_SCHEDULE_PROFILE,
    })
    
    export const getScheduleProfileSuccess = scheduleProfile => ({
    type: GET_SCHEDULE_PROFILE_SUCCESS,
    payload: scheduleProfile,
    })
    
    export const getScheduleProfileFail = error => ({
    type: GET_SCHEDULE_PROFILE_FAIL,
    payload: error,
    })
    
    export const addNewSchedule = schedule => ({
    type: ADD_NEW_SCHEDULE,
    payload: schedule,
    })
    
    export const addScheduleSuccess = schedule => ({
    type: ADD_SCHEDULE_SUCCESS,
    payload: schedule,
    })
    
    export const addScheduleFail = error => ({
    type: ADD_SCHEDULE_FAIL,
    payload: error,
    })
    
    export const updateSchedule = schedule => {
    return ({
    type: UPDATE_SCHEDULE,
    payload: schedule,
    })
    }
    
    export const updateScheduleSuccess = schedule => ({
    type: UPDATE_SCHEDULE_SUCCESS,
    payload: schedule,
    })
    
    export const updateScheduleFail = error => ({
    type: UPDATE_SCHEDULE_FAIL,
    payload: error,
    })
    
    export const deleteSchedule = schedule => ({
    type: DELETE_SCHEDULE,
    payload: schedule,
    })
    
    export const deleteScheduleSuccess = schedule => ({
    type: DELETE_SCHEDULE_SUCCESS,
    payload: schedule,
    })
    
    export const deleteScheduleFail = error => ({
    type: DELETE_SCHEDULE_FAIL,
    payload: error,
    })