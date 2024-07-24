import {
    GET_EXCEPTIONAL_PERIODS,
    GET_EXCEPTIONAL_PERIODS_FAIL,
    GET_EXCEPTIONAL_PERIODS_SUCCESS,
    ADD_NEW_EXCEPTIONAL_PERIOD,
    ADD_EXCEPTIONAL_PERIOD_FAIL,
    ADD_EXCEPTIONAL_PERIOD_SUCCESS,
    UPDATE_EXCEPTIONAL_PERIOD,
    UPDATE_EXCEPTIONAL_PERIOD_FAIL,
    UPDATE_EXCEPTIONAL_PERIOD_SUCCESS,
    DELETE_EXCEPTIONAL_PERIOD,
    DELETE_EXCEPTIONAL_PERIOD_SUCCESS,
    DELETE_EXCEPTIONAL_PERIOD_FAIL,
    GET_EXCEPTIONAL_PERIOD_DELETED_VALUE,
    GET_EXCEPTIONAL_PERIOD_DELETED_VALUE_FAIL,
    GET_EXCEPTIONAL_PERIOD_DELETED_VALUE_SUCCESS,
    GET_EXCEPTIONAL_PERIODS_OPT,
    GET_EXCEPTIONAL_PERIODS_OPT_FAIL,
    GET_EXCEPTIONAL_PERIODS_OPT_SUCCESS,

      } from "./actionTypes";
      
      export const getExceptionalPeriods = () => ({
        type: GET_EXCEPTIONAL_PERIODS,
      });
      
      export const getExceptionalPeriodsSuccess = exceptionalPeriods => ({
        type: GET_EXCEPTIONAL_PERIODS_SUCCESS,
        payload: exceptionalPeriods,
      });
      
      export const getExceptionalPeriodsFail = error => ({
        type: GET_EXCEPTIONAL_PERIODS_FAIL,
        payload: error,
      });

      
      
      export const addNewExceptionalPeriod = exceptionalPeriod => ({
        type: ADD_NEW_EXCEPTIONAL_PERIOD,
        payload: exceptionalPeriod,
      });
      
      export const addExceptionalPeriodSuccess = exceptionalPeriod => ({
        type: ADD_EXCEPTIONAL_PERIOD_SUCCESS,
        payload: exceptionalPeriod,
      });
      
      export const addExceptionalPeriodFail = error => ({
        type: ADD_EXCEPTIONAL_PERIOD_FAIL,
        payload: error,
      });
      
      export const updateExceptionalPeriod = exceptionalPeriod => {
        return {
          type: UPDATE_EXCEPTIONAL_PERIOD,
          payload: exceptionalPeriod,
        };
      };
      
      export const updateExceptionalPeriodSuccess = exceptionalPeriod => ({
        type: UPDATE_EXCEPTIONAL_PERIOD_SUCCESS,
        payload: exceptionalPeriod,
      });
      
      export const updateExceptionalPeriodFail = error => ({
        type: UPDATE_EXCEPTIONAL_PERIOD_FAIL,
        payload: error,
      });
      
      export const deleteExceptionalPeriod = exceptionalPeriod => ({
        type: DELETE_EXCEPTIONAL_PERIOD,
        payload: exceptionalPeriod,
      });
      
      export const deleteExceptionalPeriodSuccess = exceptionalPeriod => ({
        type: DELETE_EXCEPTIONAL_PERIOD_SUCCESS,
        payload: exceptionalPeriod,
      });
      
      export const deleteExceptionalPeriodFail = error => ({
        type: DELETE_EXCEPTIONAL_PERIOD_FAIL,
        payload: error,
      });
      
      
    export const getExceptionalPeriodDeletedValue = () => ({
      type: GET_EXCEPTIONAL_PERIOD_DELETED_VALUE,
    });
    
    export const getExceptionalPeriodDeletedValueSuccess = deleted => ({
      type: GET_EXCEPTIONAL_PERIOD_DELETED_VALUE_SUCCESS,
      payload: deleted,
    });
    
    export const getExceptionalPeriodDeletedValueFail = error => ({
      type: GET_EXCEPTIONAL_PERIOD_DELETED_VALUE_FAIL,
      payload: error,
    });

    export const getExceptionalPeriodsOpt = () => ({
      type: GET_EXCEPTIONAL_PERIODS_OPT,
    });
    
    export const getExceptionalPeriodsOptSuccess = warnings => ({
      type: GET_EXCEPTIONAL_PERIODS_OPT_SUCCESS,
      payload: warnings,
    });
    
    export const getExceptionalPeriodsOptFail = error => ({
      type: GET_EXCEPTIONAL_PERIODS_OPT_FAIL,
      payload: error,
    });