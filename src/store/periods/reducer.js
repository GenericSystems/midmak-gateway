import {
    GET_PERIODS_FAIL,
    GET_PERIODS_SUCCESS,
    GET_PERIOD_DELETED_VALUE_FAIL,
    GET_PERIOD_DELETED_VALUE_SUCCESS,
    ADD_PERIOD_SUCCESS,
    ADD_PERIOD_FAIL,
    UPDATE_PERIOD_SUCCESS,
    UPDATE_PERIOD_FAIL,
    DELETE_PERIOD_SUCCESS,
    DELETE_PERIOD_FAIL,
    GET_FISCAL_YEAR_CONTENTS_FAIL,
    GET_FISCAL_YEAR_CONTENTS_SUCCESS,
    GET_FISCAL_YEARS_FAIL,
    GET_FISCAL_YEARS_SUCCESS,
    GET_FILTERED_PERIODS_FAIL,
    GET_FILTERED_PERIODS_SUCCESS,
  } from "./actionTypes"
  
  const INIT_STATE = {
    periods: [],
    fiscalYearContents: [],
    fiscalYears: [],
    filteredPeriods: [],
    deleted: {},
    error: {},
  }
  
  const periods = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_PERIODS_SUCCESS:
        return {
          ...state,
          periods: action.payload,
        }
  
      case GET_PERIODS_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case GET_PERIOD_DELETED_VALUE_SUCCESS:
        return {
          ...state,
          deleted: action.payload,
        }
  
      case GET_PERIOD_DELETED_VALUE_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case ADD_PERIOD_SUCCESS:
        return {
          ...state,
          periods: [...state.periods, action.payload],
        }
  
      case ADD_PERIOD_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case UPDATE_PERIOD_SUCCESS:
        return {
          ...state,
          periods: state.periods.map(period =>
            period.Id === action.payload.Id
              ? { period, ...action.payload }
              : period
          ),
        }
  
      case UPDATE_PERIOD_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case DELETE_PERIOD_SUCCESS:
        return {
          ...state,
          periods: state.periods.filter(
            period => period.Id !== action.payload.Id
          ),
          deleted: action.payload.deleted,
        }
  
      case DELETE_PERIOD_FAIL:
        return {
          ...state,
          error: action.payload,
        }

        case GET_FISCAL_YEAR_CONTENTS_SUCCESS:
          return {
            ...state,
            fiscalYearContents: action.payload,
          }
    
        case GET_FISCAL_YEAR_CONTENTS_FAIL:
          return {
            ...state,
            error: action.payload,
          }

          case GET_FISCAL_YEARS_SUCCESS:
            return {
              ...state,
              fiscalYears: action.payload,
            }
      
          case GET_FISCAL_YEARS_FAIL:
            return {
              ...state,
              error: action.payload,
            }

            case GET_FILTERED_PERIODS_SUCCESS:
        return {
          ...state,
          filteredPeriods: action.payload,
        }
  
      case GET_FILTERED_PERIODS_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      default:
        return state
    }
  }
  
  export default periods
  