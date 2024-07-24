import {
    GET_PERIODS,
    GET_PERIODS_FAIL,
    GET_PERIODS_SUCCESS,
    GET_PERIOD_DELETED_VALUE,
    GET_PERIOD_DELETED_VALUE_FAIL,
    GET_PERIOD_DELETED_VALUE_SUCCESS,
    ADD_NEW_PERIOD,
    ADD_PERIOD_SUCCESS,
    ADD_PERIOD_FAIL,
    UPDATE_PERIOD,
    UPDATE_PERIOD_SUCCESS,
    UPDATE_PERIOD_FAIL,
    DELETE_PERIOD,
    DELETE_PERIOD_SUCCESS,
    DELETE_PERIOD_FAIL,
    GET_FISCAL_YEAR_CONTENTS,
    GET_FISCAL_YEAR_CONTENTS_FAIL,
    GET_FISCAL_YEAR_CONTENTS_SUCCESS,
    GET_FISCAL_YEARS,
    GET_FISCAL_YEARS_FAIL,
    GET_FISCAL_YEARS_SUCCESS,
    GET_FILTERED_PERIODS,
    GET_FILTERED_PERIODS_FAIL,
    GET_FILTERED_PERIODS_SUCCESS,
  } from "./actionTypes"
  
  export const getPeriods = () => ({
    type: GET_PERIODS,
  })
  
  export const getPeriodsSuccess = periods => ({
    type: GET_PERIODS_SUCCESS,
    payload: periods,
  })
  
  export const getPeriodsFail = error => ({
    type: GET_PERIODS_FAIL,
    payload: error,
  })
  
  export const getPeriodDeletedValue = () => ({
    type: GET_PERIOD_DELETED_VALUE,
  })
  
  export const getPeriodDeletedValueSuccess = deleted => ({
    type: GET_PERIOD_DELETED_VALUE_SUCCESS,
    payload: deleted,
  })
  
  export const getPeriodDeletedValueFail = error => ({
    type: GET_PERIOD_DELETED_VALUE_FAIL,
    payload: error,
  })
  
  export const addNewPeriod = period => ({
    type: ADD_NEW_PERIOD,
    payload: period,
  })
  
  export const addPeriodSuccess = period => ({
    type: ADD_PERIOD_SUCCESS,
    payload: period,
  })
  
  export const addPeriodFail = error => ({
    type: ADD_PERIOD_FAIL,
    payload: error,
  })
  
  export const updatePeriod = period => ({
    type: UPDATE_PERIOD,
    payload: period,
  })
  
  export const updatePeriodSuccess = period => ({
    type: UPDATE_PERIOD_SUCCESS,
    payload: period,
  })
  
  export const updatePeriodFail = error => ({
    type: UPDATE_PERIOD_FAIL,
    payload: error,
  })
  
  export const deletePeriod = period => ({
    type: DELETE_PERIOD,
    payload: period,
  })
  
  export const deletePeriodSuccess = period => ({
    type: DELETE_PERIOD_SUCCESS,
    payload: period,
  })
  
  export const deletePeriodFail = error => ({
    type: DELETE_PERIOD_FAIL,
    payload: error,
  })

  export const getFiscalYearContents = fiscalYearContents => ({
    type: GET_FISCAL_YEAR_CONTENTS,
    payload: fiscalYearContents,

  
  })
  
  export const getFiscalYearContentsSuccess = fiscalYearContents => ({
    type: GET_FISCAL_YEAR_CONTENTS_SUCCESS,
    payload: fiscalYearContents,
  })
  
  export const getFiscalYearContentsFail = error => ({
    type: GET_FISCAL_YEAR_CONTENTS_FAIL,
    payload: error,
  })

  export const getFiscalYears = () => ({
    type: GET_FISCAL_YEARS,

  })
  
  export const getFiscalYearsSuccess = fiscalYears => ({
    type: GET_FISCAL_YEARS_SUCCESS,
    payload: fiscalYears,
  })
  
  export const getFiscalYearsFail = error => ({
    type: GET_FISCAL_YEARS_FAIL,
    payload: error,
  })

  export const getFilteredPeriods = filteredPeriods => ({
    type: GET_FILTERED_PERIODS,
    payload: filteredPeriods,

  })
  
  export const getFilteredPeriodsSuccess = filteredPeriods => ({
    type: GET_FILTERED_PERIODS_SUCCESS,
    payload: filteredPeriods,
  })
  
  export const getFilteredPeriodsFail = error => ({
    type: GET_FILTERED_PERIODS_FAIL,
    payload: error,
  })