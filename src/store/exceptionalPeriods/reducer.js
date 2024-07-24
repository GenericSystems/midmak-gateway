import {
    GET_EXCEPTIONAL_PERIODS_SUCCESS,
    GET_EXCEPTIONAL_PERIODS_FAIL,
    ADD_EXCEPTIONAL_PERIOD_SUCCESS,
    ADD_EXCEPTIONAL_PERIOD_FAIL,
    UPDATE_EXCEPTIONAL_PERIOD_SUCCESS,
    UPDATE_EXCEPTIONAL_PERIOD_FAIL,
    DELETE_EXCEPTIONAL_PERIOD_SUCCESS,
    DELETE_EXCEPTIONAL_PERIOD_FAIL,
    GET_EXCEPTIONAL_PERIOD_DELETED_VALUE_SUCCESS,
    GET_EXCEPTIONAL_PERIOD_DELETED_VALUE_FAIL,
    GET_EXCEPTIONAL_PERIODS_OPT_SUCCESS,
    GET_EXCEPTIONAL_PERIODS_OPT_FAIL,

  } from "./actionTypes";
  
  const INIT_STATE = {
    exceptionalPeriods: [],
    exceptionalPeriodsOpt: [],
    deleted: {},
    error: {},
  };
  
  const exceptionalPeriods = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_EXCEPTIONAL_PERIODS_SUCCESS:
        return {
          ...state,
          exceptionalPeriods: action.payload,
        };
      case GET_EXCEPTIONAL_PERIODS_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case ADD_EXCEPTIONAL_PERIOD_SUCCESS:
        return {
          ...state,
          exceptionalPeriods: [...state.exceptionalPeriods, action.payload],
        };
  
      case ADD_EXCEPTIONAL_PERIOD_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case UPDATE_EXCEPTIONAL_PERIOD_SUCCESS:
        return {
          ...state,
          exceptionalPeriods: state.exceptionalPeriods.map(warningRule =>
            warningRule.Id === action.payload.Id
              ? { warningRule, ...action.payload }
              : warningRule
          ),
        };
  
      case UPDATE_EXCEPTIONAL_PERIOD_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case DELETE_EXCEPTIONAL_PERIOD_SUCCESS:
        return {
          ...state,
          exceptionalPeriods: state.exceptionalPeriods.filter(
            warningRule => warningRule.Id.toString() !== action.payload.Id.toString()
          ),
          deleted: action.payload.deleted,
        };
  
      case DELETE_EXCEPTIONAL_PERIOD_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case GET_EXCEPTIONAL_PERIOD_DELETED_VALUE_SUCCESS:
        return {
          ...state,
          deleted: action.payload.deleted,
        };
      case GET_EXCEPTIONAL_PERIOD_DELETED_VALUE_FAIL:
        return {
          ...state,
          error: action.payload,
        };

    
      case GET_EXCEPTIONAL_PERIODS_OPT_SUCCESS:
        return {
          ...state,
          exceptionalPeriodsOpt: action.payload,
        };
      case GET_EXCEPTIONAL_PERIODS_OPT_FAIL:
        return {
          ...state,
          error: action.payload,
        };


  
      default:
        return state;
    }
  };
  
  export default exceptionalPeriods;
  