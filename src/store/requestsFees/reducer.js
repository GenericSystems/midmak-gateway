import {
    GET_REQUESTS_FEES_FAIL,
    GET_REQUESTS_FEES_SUCCESS,
    GET_REQUEST_FEES_DELETED_VALUE_FAIL,
    GET_REQUEST_FEES_DELETED_VALUE_SUCCESS,
    ADD_REQUEST_FEES_SUCCESS,
    ADD_REQUEST_FEES_FAIL,
    UPDATE_REQUEST_FEES_SUCCESS,
    UPDATE_REQUEST_FEES_FAIL,
    DELETE_REQUEST_FEES_SUCCESS,
    DELETE_REQUEST_FEES_FAIL,
    GET_REQUEST_CRITERIA_SUCCESS,
    GET_REQUEST_CRITERIA_FAIL,
    COPY_REQUEST_FEES_SUCCESS,
    COPY_REQUEST_FEES_FAIL,
    GET_YEAR_CONTENTS_SUCCESS,
    GET_YEAR_CONTENTS_FAIL
  } from "./actionTypes"
  
  const INIT_STATE = {
    requestsFees: [],
    yearContents: [],
    requestCriteria : [],
    deleted: {},
    error: {},
  }
  
  const requestsFees = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_REQUESTS_FEES_SUCCESS:
        return {
          ...state,
          requestsFees: action.payload,
        }
  
      case GET_REQUESTS_FEES_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case GET_REQUEST_FEES_DELETED_VALUE_SUCCESS:
        return {
          ...state,
          deleted: action.payload,
        }
  
      case GET_REQUEST_FEES_DELETED_VALUE_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case ADD_REQUEST_FEES_SUCCESS:
        return {
          ...state,
          requestsFees: [...state.requestsFees, action.payload],
        }
  
      case ADD_REQUEST_FEES_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case UPDATE_REQUEST_FEES_SUCCESS:
        return {
          ...state,
          requestsFees: state.requestsFees.map(requestFees =>
            requestFees.Id === action.payload.Id
              ? { requestFees, ...action.payload }
              : requestFees
          ),
        }
  
      case UPDATE_REQUEST_FEES_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case DELETE_REQUEST_FEES_SUCCESS:
        return {
          ...state,
          requestsFees: state.requestsFees.filter(
            requestFees => requestFees.Id !== action.payload.Id
          ),
          deleted: action.payload.deleted,
        }
  
      case DELETE_REQUEST_FEES_FAIL:
        return {
          ...state,
          error: action.payload,
        }

        case GET_REQUEST_CRITERIA_SUCCESS:
          return {
            ...state,
            requestCriteria: action.payload,
          };
    
        case GET_REQUEST_CRITERIA_FAIL:
          return {
            ...state,
            error: action.payload,
          };
  
          case COPY_REQUEST_FEES_SUCCESS:
      return {
        ...state,
        requestFees: action.payload,
      };

    case COPY_REQUEST_FEES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

      case GET_YEAR_CONTENTS_SUCCESS:
        return {
          ...state,
          yearContents: action.payload,
        }
  
      case GET_YEAR_CONTENTS_FAIL:
        return {
          ...state,
          error: action.payload,
        }

      default:
        return state
    }
  }
  
  export default requestsFees
  