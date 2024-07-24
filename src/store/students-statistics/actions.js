import {
    GET_STUDENTS_STATISTICS,
    GET_STUDENTS_STATISTICS_FAIL,
    GET_STUDENTS_STATISTICS_SUCCESS,

  } from "./actionTypes";
  
  export const getTempStudentsStatistics = tempStudentsStatistics => ({
    type: GET_STUDENTS_STATISTICS,
    payload: tempStudentsStatistics,

  });
  
  export const getTempStudentsStatisticsSuccess = tempStudentsStatistics => ({
    type: GET_STUDENTS_STATISTICS_SUCCESS,
    payload: tempStudentsStatistics,
  });
  
  export const getTempStudentsStatisticsFail = error => ({
    type: GET_STUDENTS_STATISTICS_FAIL,
    payload: error,
  });
  
