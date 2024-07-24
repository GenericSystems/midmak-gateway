import {
    GET_ACADEMIC_LOADS_SUCCESS,
    GET_ACADEMIC_LOADS_FAIL,
    ADD_ACADEMIC_LOAD_SUCCESS,
    ADD_ACADEMIC_LOAD_FAIL,
    UPDATE_ACADEMIC_LOAD_SUCCESS,
    UPDATE_ACADEMIC_LOAD_FAIL,
    DELETE_ACADEMIC_LOAD_SUCCESS,
    DELETE_ACADEMIC_LOAD_FAIL,
    GET_ACADEMIC_LOAD_DELETED_VALUE_SUCCESS,
    GET_ACADEMIC_LOAD_DELETED_VALUE_FAIL,
  } from "./actionTypes"
  
  const INIT_STATE = {
    academicLoads: [],
    deleted: {},
    error: {},
  }
  
  const academicLoads = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_ACADEMIC_LOADS_SUCCESS:
        return {
          ...state,
          academicLoads: action.payload,
        }
  
      case GET_ACADEMIC_LOADS_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case ADD_ACADEMIC_LOAD_SUCCESS:
        return {
          ...state,
          academicLoads: [...state.academicLoads, action.payload],
        }
  
      case ADD_ACADEMIC_LOAD_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
    
  
        case UPDATE_ACADEMIC_LOAD_SUCCESS:
          return {
            ...state,
            academicLoads: state.academicLoads.map(academicLoad =>
              academicLoad.Id.toString() === action.payload.Id.toString()
                ? { academicLoad, ...action.payload }
                : academicLoad
            ),
          }
    
        case UPDATE_ACADEMIC_LOAD_FAIL:
          return {
            ...state,
            error: action.payload,
          }
    
        case DELETE_ACADEMIC_LOAD_SUCCESS:
          return {
            ...state,
            academicLoads: state.academicLoads.filter(
              academicLoad => academicLoad.Id.toString() !== action.payload.Id.toString()
            ),
            deleted: action.payload.deleted,
          }
    
        case DELETE_ACADEMIC_LOAD_FAIL:
          return {
            ...state,
            error: action.payload,
          }

          case GET_ACADEMIC_LOAD_DELETED_VALUE_SUCCESS:
            return {
                ...state,
                deleted: action.payload.deleted,
            }

            case GET_ACADEMIC_LOAD_DELETED_VALUE_FAIL:
              return {
                  ...state,
                  error: action.payload,
              }
  
  
  
      default:
        return state
    }
  }
  
  export default academicLoads
  