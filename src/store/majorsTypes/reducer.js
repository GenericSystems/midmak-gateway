import {
    GET_MAJORS_TYPES_SUCCESS,
    GET_MAJORS_TYPES_FAIL,
    ADD_MAJOR_TYPE_SUCCESS,
    ADD_MAJOR_TYPE_FAIL,
    UPDATE_MAJOR_TYPE_SUCCESS,
    UPDATE_MAJOR_TYPE_FAIL,
    DELETE_MAJOR_TYPE_SUCCESS,
    DELETE_MAJOR_TYPE_FAIL,
    GET_MAJOR_TYPE_DELETED_VALUE_SUCCESS,
    GET_MAJOR_TYPE_DELETED_VALUE_FAIL,
  } from "./actionTypes"
  
  const INIT_STATE = {
    majorsTypes: [],
    error: {},
  }
  
  const majorsTypes = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_MAJORS_TYPES_SUCCESS:
        return {
          ...state,
          majorsTypes: action.payload,
          deleted: {}
        }
  
      case GET_MAJORS_TYPES_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case ADD_MAJOR_TYPE_SUCCESS:
        return {
          ...state,
          majorsTypes: [...state.majorsTypes, action.payload],
        }
  
      case ADD_MAJOR_TYPE_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
        case UPDATE_MAJOR_TYPE_SUCCESS:
          return {
            ...state,
            majorsTypes: state.majorsTypes.map(majorType =>
              majorType.Id.toString() === action.payload.Id.toString()
                ? { majorType, ...action.payload }
                : majorType
            ),
          }
    
        case UPDATE_MAJOR_TYPE_FAIL:
          return {
            ...state,
            error: action.payload,
          }
    
        case DELETE_MAJOR_TYPE_SUCCESS:
          return {
            ...state,
            majorsTypes: state.majorsTypes.filter(
              majorType => majorType.Id !== action.payload.Id
            ),
            deleted: action.payload.deleted,
          }
    
        case DELETE_MAJOR_TYPE_FAIL:
          return {
            ...state,
            error: action.payload,
          }
  
          case GET_MAJOR_TYPE_DELETED_VALUE_SUCCESS:
            return {
                ...state,
                deleted: action.payload.deleted,
            }
  
          
      case GET_MAJOR_TYPE_DELETED_VALUE_FAIL:
        return {
            ...state,
            error: action.payload,
        }
      
  
      default:
        return state
    }
  }
  
  export default majorsTypes
  