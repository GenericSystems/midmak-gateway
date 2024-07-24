import {
    GET_NATIONALITIES_SUCCESS,
    GET_NATIONALITIES_FAIL,
    ADD_NATIONALITY_SUCCESS,
    ADD_NATIONALITY_FAIL,
    UPDATE_NATIONALITY_SUCCESS,
    UPDATE_NATIONALITY_FAIL,
    DELETE_NATIONALITY_SUCCESS,
    DELETE_NATIONALITY_FAIL,
    GET_NATIONALITY_DELETED_VALUE_SUCCESS,
    GET_NATIONALITY_DELETED_VALUE_FAIL,
    IMPORT_NATIONALITIES_SUCCESS,
    IMPORT_NATIONALITIES_FAIL
  } from "./actionTypes"
  
  const INIT_STATE = {
    nationalities: [],
    deleted: {},
    error: {},
  }
  
  const nationalities = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_NATIONALITIES_SUCCESS:
        return {
          ...state,
          nationalities: action.payload,
        }
  
      case GET_NATIONALITIES_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case ADD_NATIONALITY_SUCCESS:
        return {
          ...state,
          nationalities: [...state.nationalities, action.payload],
        }
  
      case ADD_NATIONALITY_FAIL:
        return {
          ...state,
          error: action.payload,
        }

        case IMPORT_NATIONALITIES_SUCCESS:
          return {
            ...state,
            nationalities: action.payload,
          }
    
        case IMPORT_NATIONALITIES_FAIL:
          return {
            ...state,
            error: action.payload,
          }
    
  
      case GET_NATIONALITY_DELETED_VALUE_SUCCESS:
        return {
          ...state,
          deleted: action.payload.deleted,
        }
  
        case UPDATE_NATIONALITY_SUCCESS:
          return {
            ...state,
            nationalities: state.nationalities.map(nationality =>
              nationality.Id.toString() === action.payload.Id.toString()
                ? { nationality, ...action.payload }
                : nationality
            ),
          }
    
        case UPDATE_NATIONALITY_FAIL:
          return {
            ...state,
            error: action.payload,
          }

        case DELETE_NATIONALITY_SUCCESS:
        
          const deleteNationalities = state.nationalities.filter(
            nationality => nationality.Id.toString() !== action.payload.Id.toString()
          );                 
          return {
            ...state,
            nationalities: deleteNationalities,
            deleted: action.payload.deleted,
          };
    
        case DELETE_NATIONALITY_FAIL:
          return {
            ...state,
            error: action.payload,
          }
  
      case GET_NATIONALITY_DELETED_VALUE_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      default:
        return state
    }
  }
  
  export default nationalities
  