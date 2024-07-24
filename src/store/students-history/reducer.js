import {
    GET_STUDENTS_HISTORY_SUCCESS,
    GET_STUDENTS_HISTORY_FAIL,
    ADD_STUDENT_HISTORY_SUCCESS,
    ADD_STUDENT_HISTORY_FAIL,
    CALCULATE_STUDENT_HISTORY_SUCCESS,
    CALCULATE_STUDENT_HISTORY_FAIL,
    CALCULATE_ALL_STUDENT_HISTORY_SUCCESS,
    CALCULATE_ALL_STUDENT_HISTORY_FAIL,
    
  } from "./actionTypes";


  const INIT_STATE = {
    studentsHistory: [],
    error: {},
  };
  
  const studentsHistory = (state = INIT_STATE, action) => {
    switch (action.type) {
 
      case GET_STUDENTS_HISTORY_SUCCESS:
        return {
          ...state,
          studentsHistory: action.payload,
        };
  
      case GET_STUDENTS_HISTORY_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case ADD_STUDENT_HISTORY_SUCCESS:
        return {
          ...state,
          studentsHistory: [...state.studentsHistory, action.payload],
        };
  
      case ADD_STUDENT_HISTORY_FAIL:
        return {
          ...state,
          error: action.payload,
        };

  
      case CALCULATE_STUDENT_HISTORY_SUCCESS:
        return {
          ...state,
          studentsHistory: action.payload,
        };

  
      case CALCULATE_STUDENT_HISTORY_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case CALCULATE_ALL_STUDENT_HISTORY_SUCCESS:
        return {
          ...state,
          studentsHistory: action.payload,
        };
  
      case CALCULATE_ALL_STUDENT_HISTORY_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      default:
        return state;
    }
  };
  
  export default studentsHistory;
  