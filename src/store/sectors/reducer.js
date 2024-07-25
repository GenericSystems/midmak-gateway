import {
    GET_SECTORS_SUCCESS,
    GET_SECTORS_FAIL,
    ADD_SECTOR_SUCCESS,
    ADD_SECTOR_FAIL,
    UPDATE_SECTOR_SUCCESS,
    UPDATE_SECTOR_FAIL,
    DELETE_SECTOR_SUCCESS,
    DELETE_SECTOR_FAIL,
    GET_SECTOR_DELETED_VALUE_SUCCESS,
    GET_SECTOR_DELETED_VALUE_FAIL,
  } from "./actionTypes"
  
  const INIT_STATE = {
    sectors: [],
    deleted: {},
    error: {},
  }
  
  const sectors = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_SECTORS_SUCCESS:
        return {
          ...state,
          sectors: action.payload,
        }
  
      case GET_SECTORS_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case ADD_SECTOR_SUCCESS:
        return {
          ...state,
          sectors: [...state.sectors, action.payload],
        }
  
      case ADD_SECTOR_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case GET_SECTOR_DELETED_VALUE_SUCCESS:
        return {
          ...state,
          deleted: action.payload.deleted,
        }
  
        case UPDATE_SECTOR_SUCCESS:
          return {
            ...state,
            sectors: state.sectors.map(sector =>
              sector.Id.toString() === action.payload.Id.toString()
                ? { sector, ...action.payload }
                : sector
            ),
          }
    
        case UPDATE_SECTOR_FAIL:
          return {
            ...state,
            error: action.payload,
          }
    
        case DELETE_SECTOR_SUCCESS:
          return {
            ...state,
            sectors: state.sectors.filter(
              sector => sector.Id.toString() !== action.payload.Id.toString()
            ),
            deleted: action.payload.deleted,
          }
    
        case DELETE_SECTOR_FAIL:
          return {
            ...state,
            error: action.payload,
          }
  
      case GET_SECTOR_DELETED_VALUE_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      default:
        return state
    }
  }
  
  export default sectors
  