import {
    GET_STUDENTMANAGEMENTS_SUCCESS,
    GET_STUDENTMANAGEMENTS_FAIL,
    ADD_STUDENTMANAGEMENT_SUCCESS,
    ADD_STUDENTMANAGEMENT_FAIL,
    UPDATE_STUDENTMANAGEMENT_SUCCESS,
    UPDATE_STUDENTMANAGEMENT_FAIL,
    DELETE_STUDENTMANAGEMENT_SUCCESS,
    DELETE_STUDENTMANAGEMENT_FAIL,
    GET_STUDENTMANAGEMENT_PROFILE_SUCCESS,
    GET_STUDENTMANAGEMENT_PROFILE_FAIL,
    
  } from "./actionTypes";
  import{
    GET_FACULTIES_SUCCESS,
    GET_FACULTIES_FAIL
  } from "../mob-app-faculty-accs/actionTypes"

  const INIT_STATE = {
    studentManagements: [],
    faculties:[],
    studentManagementProfile: {},
    error: {},
  };
  
  const studentManagements = (state = INIT_STATE, action) => {
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
      case GET_STUDENTMANAGEMENTS_SUCCESS:
        return {
          ...state,
          studentManagements: action.payload,
        };
  
      case GET_STUDENTMANAGEMENTS_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case ADD_STUDENTMANAGEMENT_SUCCESS:
        return {
          ...state,
          studentManagements: [...state.studentManagements, action.payload],
        };
  
      case ADD_STUDENTMANAGEMENT_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case GET_STUDENTMANAGEMENT_PROFILE_SUCCESS:
        return {
          ...state,
          studentManagementProfile: action.payload,
        };
  
      case UPDATE_STUDENTMANAGEMENT_SUCCESS:
        return {
          ...state,
          studentManagements: state.studentManagements.map(studentManagement =>
            studentManagement.Id.toString() === action.payload.Id.toString()
              ? { ...studentManagement, ...action.payload }
              : studentManagement
          ),
        };
  
      case UPDATE_STUDENTMANAGEMENT_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case DELETE_STUDENTMANAGEMENT_SUCCESS:
        return {
          ...state,
          studentManagements: state.studentManagements.filter(
            studentManagement => studentManagement.Id.toString() !== action.payload.Id.toString()
          ),
        };
  
      case DELETE_STUDENTMANAGEMENT_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case GET_STUDENTMANAGEMENT_PROFILE_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      default:
        return state;
    }
  };
  
  export default studentManagements;
  