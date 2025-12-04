import {
    GET_LECTURE_PERIODS_SUCCESS,
    GET_LECTURE_PERIODS_FAIL,
    ADD_LECTURE_PERIOD_SUCCESS,
    ADD_LECTURE_PERIOD_FAIL,
    UPDATE_LECTURE_PERIOD_SUCCESS,
    UPDATE_LECTURE_PERIOD_FAIL,
    DELETE_LECTURE_PERIOD_SUCCESS,
    DELETE_LECTURE_PERIOD_FAIL,
    GET_LECTURE_PERIOD_PROFILE_SUCCESS,
    GET_LECTURE_PERIOD_PROFILE_FAIL,
  } from "./actionTypes"
  
  const INIT_STATE = {
    lecturePeriods: [],
    lecturePeriodProfile: {},
    error: {},
  }
  
  const lecturePeriods = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_LECTURE_PERIODS_SUCCESS:
        return {
          ...state,
          lecturePeriods: action.payload,
        }
  
      case GET_LECTURE_PERIODS_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case ADD_LECTURE_PERIOD_SUCCESS:
        return {
          ...state,
          lecturePeriods: [action.payload],
        }
  
      case ADD_LECTURE_PERIOD_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case GET_LECTURE_PERIOD_PROFILE_SUCCESS:
        return {
          ...state,
          lecturePeriodProfile: action.payload,
        }
  
        case UPDATE_LECTURE_PERIOD_SUCCESS:
          return {
            ...state,
            lecturePeriods: state.lecturePeriods.map(lecturePeriod =>
              lecturePeriod.Id.toString() === action.payload.Id.toString()
                ? { lecturePeriod, ...action.payload }
                : lecturePeriod
            ),
          }
    
        case UPDATE_LECTURE_PERIOD_FAIL:
          return {
            ...state,
            error: action.payload,
          }
    
        case DELETE_LECTURE_PERIOD_SUCCESS:
          return {
            ...state,
            lecturePeriods: state.lecturePeriods.filter(
              lecturePeriod => lecturePeriod.Id.toString() !== action.payload.Id.toString()
            ),
          }
    
        case DELETE_LECTURE_PERIOD_FAIL:
          return {
            ...state,
            error: action.payload,
          }
  
      case GET_LECTURE_PERIOD_PROFILE_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      default:
        return state
    }
  }
  
  export default lecturePeriods
  