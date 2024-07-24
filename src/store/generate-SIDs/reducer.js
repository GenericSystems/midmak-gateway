import {
    GET_GENERATE_SIDS_SUCCESS,
    GET_GENERATE_SIDS_FAIL,
    ADD_GENERATE_SID_SUCCESS,
    ADD_GENERATE_SID_FAIL,
    UPDATE_GENERATE_SID_SUCCESS,
    UPDATE_GENERATE_SID_FAIL,
    DELETE_GENERATE_SID_SUCCESS,
    DELETE_GENERATE_SID_FAIL,
    GET_GENERATE_SID_PROFILE_SUCCESS,
    GET_GENERATE_SID_PROFILE_FAIL,
    GET_TEMPSTUDENTS_FAIL,
    GET_TEMPSTUDENTS_SUCCESS
  } from "./actionTypes"
  
  const INIT_STATE = {
    generateSIDs: [],
    years:[],
    semesters:[],
    tempStudents:[],
    generateSIDProfile: {},
    error: {},
  }
  
  const generateSIDs = (state = INIT_STATE, action) => {
    switch (action.type) {

      case GET_TEMPSTUDENTS_SUCCESS:
        return {
          ...state,
          tempStudents: action.payload,
        }
  
      case GET_TEMPSTUDENTS_FAIL:
        return {
          ...state,
          error: action.payload,
        }

      case GET_GENERATE_SIDS_SUCCESS:
        return {
          ...state,
          generateSIDs: action.payload,
        }
  
      case GET_GENERATE_SIDS_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case ADD_GENERATE_SID_SUCCESS:
        return {
          ...state,
          generateSIDs: [...state.generateSIDs, action.payload],
        }
  
      case ADD_GENERATE_SID_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case GET_GENERATE_SID_PROFILE_SUCCESS:
        return {
          ...state,
          generateSIDProfile: action.payload,
        }
  
        case UPDATE_GENERATE_SID_SUCCESS:
          return {
            ...state,
            generateSIDs: state.generateSIDs.map(generateSID =>
              generateSID.Id.toString() === action.payload.Id.toString()
                ? { generateSID, ...action.payload }
                : generateSID
            ),
          }
    
        case UPDATE_GENERATE_SID_FAIL:
          return {
            ...state,
            error: action.payload,
          }
    
        case DELETE_GENERATE_SID_SUCCESS:
          return {
            ...state,
            generateSIDs: state.generateSIDs.filter(
              generateSID => generateSID.Id.toString() !== action.payload.Id.toString()
            ),
          }
    
        case DELETE_GENERATE_SID_FAIL:
          return {
            ...state,
            error: action.payload,
          }
  
      case GET_GENERATE_SID_PROFILE_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      default:
        return state
    }
  }
  
  export default generateSIDs
  