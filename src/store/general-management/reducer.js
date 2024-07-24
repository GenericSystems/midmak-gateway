import {
    GET_GENERAL_MANAGEMENTS_SUCCESS,
    GET_GENERAL_MANAGEMENTS_FAIL,
    ADD_GENERAL_MANAGEMENT_SUCCESS,
    ADD_GENERAL_MANAGEMENT_FAIL,
    UPDATE_GENERAL_MANAGEMENT_SUCCESS,
    UPDATE_GENERAL_MANAGEMENT_FAIL,
    DELETE_GENERAL_MANAGEMENT_SUCCESS,
    DELETE_GENERAL_MANAGEMENT_FAIL,
    GET_GENERAL_MANAGEMENT_PROFILE_SUCCESS,
    GET_GENERAL_MANAGEMENT_PROFILE_FAIL,
    GET_YEAR_SEMESTERS_FAIL,
    GET_YEAR_SEMESTERS_SUCCESS
  } from "./actionTypes"
  
  const INIT_STATE = {
    generalManagements: [],
    yearSemesters:[],
    generalManagementProfile: {},
    error: {},
  }
  
  const generalManagements = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_YEAR_SEMESTERS_SUCCESS:
        return {
          ...state,
          yearSemesters: action.payload,
        }
  
      case GET_YEAR_SEMESTERS_FAIL:
        return {
          ...state,
          error: action.payload,
        }
      case GET_GENERAL_MANAGEMENTS_SUCCESS:
        return {
          ...state,
          generalManagements: action.payload,
        }
  
      case GET_GENERAL_MANAGEMENTS_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case ADD_GENERAL_MANAGEMENT_SUCCESS:
        return {
          ...state,
          generalManagements: [...state.generalManagements, action.payload],
        }
  
      case ADD_GENERAL_MANAGEMENT_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case GET_GENERAL_MANAGEMENT_PROFILE_SUCCESS:
        return {
          ...state,
          generalManagementProfile: action.payload,
        }
  
        case UPDATE_GENERAL_MANAGEMENT_SUCCESS:
          return {
            ...state,
            generalManagements: state.generalManagements.map(generalManagement =>
              generalManagement.Id.toString() === action.payload.Id.toString()
                ? { generalManagement, ...action.payload }
                : generalManagement
            ),
          }
    
        case UPDATE_GENERAL_MANAGEMENT_FAIL:
          return {
            ...state,
            error: action.payload,
          }
    
        case DELETE_GENERAL_MANAGEMENT_SUCCESS:
          return {
            ...state,
            generalManagements: state.generalManagements.filter(
              generalManagement => generalManagement.Id.toString() !== action.payload.Id.toString()
            ),
          }
    
        case DELETE_GENERAL_MANAGEMENT_FAIL:
          return {
            ...state,
            error: action.payload,
          }
  
      case GET_GENERAL_MANAGEMENT_PROFILE_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      default:
        return state
    }
  }
  
  export default generalManagements
  