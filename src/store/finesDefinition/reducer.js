import {
    GET_FINES_DEFINITION_SUCCESS,
    GET_FINES_DEFINITION_FAIL,
    GET_CRITERIA_SUCCESS,
    GET_CRITERIA_FAIL,
    ADD_NEW_FINE_DEFINITION_SUCCESS,
    ADD_NEW_FINE_DEFINITION_FAIL,
    UPDATE_FINE_DEFINITION_SUCCESS,
    UPDATE_FINE_DEFINITION_FAIL,
    DELETE_FINE_DEFINITION_SUCCESS,
    DELETE_FINE_DEFINITION_FAIL,
    GET_FINE_DEFINITION_DELETED_VALUE_SUCCESS,
    GET_FINE_DEFINITION_DELETED_VALUE_FAIL,
    COPY_FINE_SUCCESS,
    COPY_FINE_FAIL,
  } from "./actionTypes";
  
  const INIT_STATE = {
    finesDefinition: [],
    criteria: [],
    deleted: {},
    error: {},
  };
  
  const finesDefinition = (state = INIT_STATE, action) => {
    switch (action.type) {

      case GET_FINES_DEFINITION_SUCCESS:
        return {
          ...state,
          finesDefinition: action.payload,
        };
  
      case GET_FINES_DEFINITION_FAIL:
        return {
          ...state,
          error: action.payload,
        };

        case GET_CRITERIA_SUCCESS:
        return {
          ...state,
          criteria: action.payload,
        };
  
      case GET_CRITERIA_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case ADD_NEW_FINE_DEFINITION_SUCCESS:
        return {
          ...state,
          finesDefinition: [...state.finesDefinition, action.payload],
        };
  
      case ADD_NEW_FINE_DEFINITION_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case GET_FINE_DEFINITION_DELETED_VALUE_SUCCESS:
        return {
          ...state,
          deleted: action.payload.deleted,
        };
  
      case UPDATE_FINE_DEFINITION_SUCCESS:
        return {
          ...state,
          finesDefinition: state.finesDefinition.map(fineDefinition =>
            fineDefinition.Id.toString() === action.payload.Id.toString()
              ? { fineDefinition, ...action.payload }
              : fineDefinition
          ),
        };
  
      case UPDATE_FINE_DEFINITION_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case DELETE_FINE_DEFINITION_SUCCESS:
        return {
          ...state,
          finesDefinition: state.finesDefinition.filter(
            fineDefinition => fineDefinition.Id.toString() !== action.payload.Id.toString()
          ),
          deleted: action.payload.deleted,
        };
  
      case DELETE_FINE_DEFINITION_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case GET_FINE_DEFINITION_DELETED_VALUE_FAIL:
        return {
          ...state,
          error: action.payload,
        };

        case COPY_FINE_SUCCESS:
          return {
            ...state,
            finesDefinition: action.payload,
          };
    
      case COPY_FINE_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      default:
        return state;
    }
  };
  
  export default finesDefinition;
  