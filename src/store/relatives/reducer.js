import {
    GET_RELATIVES_SUCCESS,
    GET_RELATIVES_FAIL,
    ADD_RELATIVE_SUCCESS,
    ADD_RELATIVE_FAIL,
    UPDATE_RELATIVE_SUCCESS,
    UPDATE_RELATIVE_FAIL,
    DELETE_RELATIVE_SUCCESS,
    DELETE_RELATIVE_FAIL,
    GET_RELATIVE_DELETED_VALUE_SUCCESS,
    GET_RELATIVE_DELETED_VALUE_FAIL,
    IMPORT_RELATIVES_SUCCESS,
    IMPORT_RELATIVES_FAIL
  } from "./actionTypes"
  
  const INIT_STATE = {
    relatives: [],
    deleted: {},
    error: {},
  }
  
  const relatives = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_RELATIVES_SUCCESS:
        return {
          ...state,
          relatives: action.payload,
        }
  
      case GET_RELATIVES_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case ADD_RELATIVE_SUCCESS:
        return {
          ...state,
          relatives: [...state.relatives, action.payload],
        }
  
      case ADD_RELATIVE_FAIL:
        return {
          ...state,
          error: action.payload,
        }

        case IMPORT_RELATIVES_SUCCESS:
          return {
            ...state,
            relatives: action.payload,
          }
    
        case IMPORT_RELATIVES_FAIL:
          return {
            ...state,
            error: action.payload,
          }
    
  
      case GET_RELATIVE_DELETED_VALUE_SUCCESS:
        return {
          ...state,
          deleted: action.payload.deleted,
        }
  
        case UPDATE_RELATIVE_SUCCESS:
          return {
            ...state,
            relatives: state.relatives.map(relative =>
              relative.Id.toString() === action.payload.Id.toString()
                ? { relative, ...action.payload }
                : relative
            ),
          }
    
        case UPDATE_RELATIVE_FAIL:
          return {
            ...state,
            error: action.payload,
          }

        case DELETE_RELATIVE_SUCCESS:
        
          const deleteRelatives = state.relatives.filter(
            relative => relative.Id.toString() !== action.payload.Id.toString()
          );                 
          return {
            ...state,
            relatives: deleteRelatives,
            deleted: action.payload.deleted,
          };
    
        case DELETE_RELATIVE_FAIL:
          return {
            ...state,
            error: action.payload,
          }
  
      case GET_RELATIVE_DELETED_VALUE_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      default:
        return state
    }
  }
  
  export default relatives
  