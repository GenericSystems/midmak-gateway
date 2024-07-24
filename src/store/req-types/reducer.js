import {
    GET_REQUIREMENT_TYPES_SUCCESS,
    GET_REQUIREMENT_TYPES_FAIL,
    ADD_REQUIREMENT_TYPE_SUCCESS,
    ADD_REQUIREMENT_TYPE_FAIL,
    UPDATE_REQUIREMENT_TYPE_SUCCESS,
    UPDATE_REQUIREMENT_TYPE_FAIL,
    DELETE_REQUIREMENT_TYPE_SUCCESS,
    DELETE_REQUIREMENT_TYPE_FAIL,
    GET_REQUIREMENT_DELETED_VALUE_SUCCESS,
    GET_REQUIREMENT_DELETED_VALUE_FAIL,
  } from "./actionTypes"
  
  const INIT_STATE = {
    reqTypes: [],
    deleted: {},
    error: {},
  }
  
  const reqTypes = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_REQUIREMENT_TYPES_SUCCESS:
        return {
          ...state,
          reqTypes: action.payload,
        }
  
      case GET_REQUIREMENT_TYPES_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case ADD_REQUIREMENT_TYPE_SUCCESS:
        return {
          ...state,
          reqTypes: [...state.reqTypes, action.payload],
        }
  
      case ADD_REQUIREMENT_TYPE_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case GET_REQUIREMENT_DELETED_VALUE_SUCCESS:
        return {
          ...state,
          deleted: action.payload,
        }
  
        case UPDATE_REQUIREMENT_TYPE_SUCCESS:
          return {
            ...state,
            reqTypes: state.reqTypes.map(reqType =>
              reqType.Id.toString() === action.payload.Id.toString()
                ? { reqType, ...action.payload }
                : reqType
            ),
          }
    
        case UPDATE_REQUIREMENT_TYPE_FAIL:
          return {
            ...state,
            error: action.payload,
          }
    
        case DELETE_REQUIREMENT_TYPE_SUCCESS:
          return {
            ...state,
            reqTypes: state.reqTypes.filter(
              reqType => reqType.Id.toString() !== action.payload.Id.toString()
            ),
            deleted: action.payload.deleted,
          }
    
        case DELETE_REQUIREMENT_TYPE_FAIL:
          return {
            ...state,
            error: action.payload,
          }
  
      case GET_REQUIREMENT_DELETED_VALUE_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      default:
        return state
    }
  }
  
  export default reqTypes
  