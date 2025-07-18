import {
    GET_MOB_APP_FACULTY_ACCS_SUCCESS,
    GET_MOB_APP_FACULTY_ACCS_FAIL,
    ADD_MOB_APP_FACULTY_ACC_SUCCESS,
    ADD_MOB_APP_FACULTY_ACC_FAIL,
    UPDATE_MOB_APP_FACULTY_ACC_SUCCESS,
    UPDATE_MOB_APP_FACULTY_ACC_FAIL,
    DELETE_MOB_APP_FACULTY_ACC_SUCCESS,
    DELETE_MOB_APP_FACULTY_ACC_FAIL,
    GET_MOB_APP_FACULTY_ACC_PROFILE_SUCCESS,
    GET_MOB_APP_FACULTY_ACC_PROFILE_FAIL,
    GET_FACULTIES_SUCCESS,
    GET_FACULTIES_FAIL,
    UPDATE_FACULTY,
  UPDATE_FACULTY_FAIL,
  UPDATE_FACULTY_SUCCESS
  } from "./actionTypes"
  
  const INIT_STATE = {
    mobAppFacultyAccs: [],
    faculties:[],
    mobAppFacultyAccProfile: {},
    error: {},
  }
  
  const mobAppFacultyAccs = (state = INIT_STATE, action) => {
    switch (action.type) {

      case GET_FACULTIES_SUCCESS:
        return {
          ...state,
          faculties: action.payload,
        }
  
      case GET_FACULTIES_FAIL:
        return {
          ...state,
          error: action.payload,
        }
        case UPDATE_FACULTY_SUCCESS:
    return {
      ...state,
      faculties: state.faculties.map(faculty =>
        faculty.Id.toString() === action.payload.Id.toString()
          ? { faculty, ...action.payload }
          : faculty
      ),
    }

  case UPDATE_FACULTY_FAIL:
    return {
      ...state,
      error: action.payload,
    }
      case GET_MOB_APP_FACULTY_ACCS_SUCCESS:
        return {
          ...state,
          mobAppFacultyAccs: action.payload,
        }
  
      case GET_MOB_APP_FACULTY_ACCS_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case ADD_MOB_APP_FACULTY_ACC_SUCCESS:
        return {
          ...state,
          mobAppFacultyAccs: [...state.mobAppFacultyAccs, action.payload],
        }
  
      case ADD_MOB_APP_FACULTY_ACC_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case GET_MOB_APP_FACULTY_ACC_PROFILE_SUCCESS:
        return {
          ...state,
          mobAppFacultyAccProfile: action.payload,
        }
  
        case UPDATE_MOB_APP_FACULTY_ACC_SUCCESS:
          return {
            ...state,
            mobAppFacultyAccs: state.mobAppFacultyAccs.map(mobAppFacultyAcc =>
              mobAppFacultyAcc.Id.toString() === action.payload.Id.toString()
                ? { mobAppFacultyAcc, ...action.payload }
                : mobAppFacultyAcc
            ),
          }
    
        case UPDATE_MOB_APP_FACULTY_ACC_FAIL:
          return {
            ...state,
            error: action.payload,
          }
    
        case DELETE_MOB_APP_FACULTY_ACC_SUCCESS:
          return {
            ...state,
            mobAppFacultyAccs: state.mobAppFacultyAccs.filter(
              mobAppFacultyAcc => mobAppFacultyAcc.Id.toString() !== action.payload.Id.toString()
            ),
          }
    
        case DELETE_MOB_APP_FACULTY_ACC_FAIL:
          return {
            ...state,
            error: action.payload,
          }
  
      case GET_MOB_APP_FACULTY_ACC_PROFILE_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      default:
        return state
    }
  }
  
  export default mobAppFacultyAccs
  