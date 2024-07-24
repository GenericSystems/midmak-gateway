import {
    GET_STUDENTS_OPTIONS_SUCCESS,
    GET_STUDENTS_OPTIONS_FAIL,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_FAIL,
  } from "./actionTypes"
  
  const INIT_STATE = {
    studentsInfo: [],
    students: [],
    error: {},
  }
  
  const studentsInfo = (state = INIT_STATE, action) => {
    switch (action.type) {
  
      case GET_STUDENTS_OPTIONS_SUCCESS:
        return {
          ...state,
          students: action.payload,
        }

      case GET_STUDENTS_OPTIONS_FAIL:
        return {
          ...state,
          error: action.payload,
        }

        case UPDATE_PASSWORD_SUCCESS:
          return {
            ...state,
            studentsInfo: state.studentsInfo.map(studentInfo =>
              studentInfo.Id.toString() === action.payload.Id.toString()
                ? { studentInfo, ...action.payload }
                : studentInfo
            ),
          }
    
        case UPDATE_PASSWORD_FAIL:
          return {
            ...state,
            error: action.payload,
          }
    
  
      default:
        return state
    }
  }
  
  export default studentsInfo
  