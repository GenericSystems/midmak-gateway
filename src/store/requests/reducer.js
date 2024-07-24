import {
    GET_REQUESTS_SUCCESS,
    GET_REQUESTS_FAIL,
    ADD_REQUEST_SUCCESS,
    ADD_REQUEST_FAIL,
    UPDATE_REQUEST_SUCCESS,
    UPDATE_REQUEST_FAIL,
    DELETE_REQUEST_SUCCESS,
    DELETE_REQUEST_FAIL,
    GET_REQUEST_DELETED_VALUE_SUCCESS,
    GET_REQUEST_DELETED_VALUE_FAIL,
  } from "./actionTypes";
  
  const INIT_STATE = {
    requests: [],
    deleted: {},
    error: {},
  };
  
  const requests = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_REQUESTS_SUCCESS:
        return {
          ...state,
          requests: action.payload,
        };
  
      case GET_REQUESTS_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case ADD_REQUEST_SUCCESS:
        return {
          ...state,
          requests: [...state.requests, action.payload],
        };
  
      case ADD_REQUEST_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case GET_REQUEST_DELETED_VALUE_SUCCESS:
        return {
          ...state,
          deleted: action.payload.deleted,
        };
  
      case UPDATE_REQUEST_SUCCESS:
        return {
          ...state,
          requests: state.requests.map(request =>
            request.Id.toString() === action.payload.Id.toString()
              ? { request, ...action.payload }
              : request
          ),
        };
  
      case UPDATE_REQUEST_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case DELETE_REQUEST_SUCCESS:
        return {
          ...state,
          requests: state.requests.filter(
            request => request.Id.toString() !== action.payload.Id.toString()
          ),
          deleted: action.payload.deleted,
        };
  
      case DELETE_REQUEST_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case GET_REQUEST_DELETED_VALUE_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      default:
        return state;
    }
  };
  
  export default requests;
  