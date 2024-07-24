import {
    GET_HALLS_SUCCESS,
    GET_HALLS_FAIL,
    ADD_HALL_SUCCESS,
    ADD_HALL_FAIL,
    UPDATE_HALL_SUCCESS,
    UPDATE_HALL_FAIL,
    DELETE_HALL_SUCCESS,
    DELETE_HALL_FAIL,
    GET_HALL_DELETED_VALUE_SUCCESS,
    GET_HALL_DELETED_VALUE_FAIL,
  } from "./actionTypes"
  
  const INIT_STATE = {
    halls: [],
    deleted: {},
    error: {},
  }
  
  const halls = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_HALLS_SUCCESS:
        return {
          ...state,
          halls: action.payload,
        }
  
      case GET_HALLS_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case ADD_HALL_SUCCESS:
        return {
          ...state,
          halls: [...state.halls, action.payload],
        }
  
      case ADD_HALL_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case GET_HALL_DELETED_VALUE_SUCCESS:
        return {
          ...state,
          deleted: action.payload.deleted,
        }
  
        case UPDATE_HALL_SUCCESS:
          return {
            ...state,
            halls: state.halls.map(hall =>
              hall.Id.toString() === action.payload.Id.toString()
                ? { hall, ...action.payload }
                : hall
            ),
          }
    
        case UPDATE_HALL_FAIL:
          return {
            ...state,
            error: action.payload,
          }
    
        case DELETE_HALL_SUCCESS:
          return {
            ...state,
            halls: state.halls.filter(
              hall => hall.Id.toString() !== action.payload.Id.toString()
            ),
            deleted: action.payload.deleted,
          }
    
        case DELETE_HALL_FAIL:
          return {
            ...state,
            error: action.payload,
          }
  
      case GET_HALL_DELETED_VALUE_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      default:
        return state
    }
  }
  
  export default halls
  