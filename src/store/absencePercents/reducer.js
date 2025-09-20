import {
    GET_ABSENCE_PERCENTS_SUCCESS,
    GET_ABSENCE_PERCENTS_FAIL,
    ADD_ABSENCE_PERCENT_SUCCESS,
    ADD_ABSENCE_PERCENT_FAIL,
    UPDATE_ABSENCE_PERCENT_SUCCESS,
    UPDATE_ABSENCE_PERCENT_FAIL,
    DELETE_ABSENCE_PERCENT_SUCCESS,
    DELETE_ABSENCE_PERCENT_FAIL,
    GET_ABSENCE_PERCENT_DELETED_VALUE_SUCCESS,
    GET_ABSENCE_PERCENT_DELETED_VALUE_FAIL,
  
    


    } from "./actionTypes"
    
    const INIT_STATE = {
    absencePercents: [],
    deleted: {},
    error: {},
    hidereasons:[],
    }
    
    const absencePercents = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_ABSENCE_PERCENTS_SUCCESS:
        return {
          ...state,
          absencePercents: action.payload,
        };
      case GET_ABSENCE_PERCENTS_FAIL:
        return {
          ...state,
          error: action.payload,
        };

    
      case ADD_ABSENCE_PERCENT_SUCCESS:
        return {
          ...state,
          absencePercents: [...state.absencePercents, action.payload],
        };

      case ADD_ABSENCE_PERCENT_FAIL:
        return {
          ...state,
          error: action.payload,
        };

      case GET_ABSENCE_PERCENT_DELETED_VALUE_SUCCESS:
        return {
          ...state,
          deleted: action.payload,
        };
      case "UPDATE_ABSENCE_PERCENT":
        return {
          ...state,
          absencePercents: state.absencePercents.map(hg =>
            hg.Id.toString() === action.payload.Id.toString()
              ? { ...hg, ...action.payload }
              : hg
          ),
        };
        

      case UPDATE_ABSENCE_PERCENT_SUCCESS:
        return {
          ...state,
          absencePercents: state.absencePercents.map(absencePercent =>
            absencePercent.Id.toString() === action.payload.Id.toString()
              ? { ...absencePercent, ...action.payload }
              : absencePercent
          ),
        };

      case UPDATE_ABSENCE_PERCENT_FAIL:
        return {
          ...state,
          error: action.payload,
        };

      case DELETE_ABSENCE_PERCENT_SUCCESS:
        return {
          ...state,
          absencePercents: state.absencePercents.filter(
            absencePercent =>
              absencePercent.Id.toString() !== action.payload.Id.toString()
          ),
          deleted: action.payload.deleted,
        };

      case DELETE_ABSENCE_PERCENT_FAIL:
        return {
          ...state,
          error: action.payload,
        };

      case GET_ABSENCE_PERCENT_DELETED_VALUE_FAIL:
        return {
          ...state,
          error: action.payload,
        };

      default:
        return state;
    }
}

export default absencePercents
