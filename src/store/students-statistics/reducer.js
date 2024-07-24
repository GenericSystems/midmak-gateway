import {
    GET_STUDENTS_STATISTICS_SUCCESS,
    GET_STUDENTS_STATISTICS_FAIL,
 
  } from "./actionTypes";
  
  const INIT_STATE = {
    tempStudentsStatistics: [],
    error: {},
  };
  
  const studentsStatistics = (state = INIT_STATE, action) => {
    switch (action.type) {
 
      case GET_STUDENTS_STATISTICS_SUCCESS:
        return {
          ...state,
          tempStudentsStatistics: action.payload,
        };
  
      case GET_STUDENTS_STATISTICS_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      
      default:
        return state;
    }
  };
  
  export default studentsStatistics;
  