import {
    GET_SERVICES_SUCCESS,
    GET_SERVICES_FAIL,
    ADD_SERVICE_SUCCESS,
    ADD_SERVICE_FAIL,
    UPDATE_SERVICE_SUCCESS,
    UPDATE_SERVICE_FAIL,
    DELETE_SERVICE_SUCCESS,
    DELETE_SERVICE_FAIL,
    GET_SERVICE_DELETED_VALUE_SUCCESS,
    GET_SERVICE_DELETED_VALUE_FAIL,
  } from "./actionTypes";
  
  const INIT_STATE = {
    services: [],
    deleted: {},
    error: {},
  };
  
  const services = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_SERVICES_SUCCESS:
        return {
          ...state,
          services: action.payload,
        };
  
      case GET_SERVICES_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case ADD_SERVICE_SUCCESS:
        return {
          ...state,
          services: [...state.services, action.payload],
        };
  
      case ADD_SERVICE_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case GET_SERVICE_DELETED_VALUE_SUCCESS:
        return {
          ...state,
          deleted: action.payload.deleted,
        };
  
      case UPDATE_SERVICE_SUCCESS:
        return {
          ...state,
          services: state.services.map(service =>
            service.Id.toString() === action.payload.Id.toString()
              ? { service, ...action.payload }
              : service
          ),
        };
  
      case UPDATE_SERVICE_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case DELETE_SERVICE_SUCCESS:
        return {
          ...state,
          services: state.services.filter(
            service => service.Id.toString() !== action.payload.Id.toString()
          ),
          deleted: action.payload.deleted,
        };
  
      case DELETE_SERVICE_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case GET_SERVICE_DELETED_VALUE_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      default:
        return state;
    }
  };
  
  export default services;
  