import {
    GET_CERTIFICATELEVELS_SUCCESS,
    GET_CERTIFICATELEVELS_FAIL,
    ADD_CERTIFICATELEVEL_SUCCESS,
    ADD_CERTIFICATELEVEL_FAIL,
    UPDATE_CERTIFICATELEVEL_SUCCESS,
    UPDATE_CERTIFICATELEVEL_FAIL,
    DELETE_CERTIFICATELEVEL_SUCCESS,
    DELETE_CERTIFICATELEVEL_FAIL,
    GET_CERTIFICATELEVEL_DELETED_VALUE_SUCCESS,
    GET_CERTIFICATELEVEL_DELETED_VALUE_FAIL,
  } from "./actionTypes";
  
  const INIT_STATE = {
    certificatelevels: [],
    deleted: {},
    error: {},
  };
  
  const certificatelevels = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_CERTIFICATELEVELS_SUCCESS:
        return {
          ...state,
          certificatelevels: action.payload,
        };
  
      case GET_CERTIFICATELEVELS_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case ADD_CERTIFICATELEVEL_SUCCESS:
        return {
          ...state,
          certificatelevels: [...state.certificatelevels, action.payload],
        };
  
      case ADD_CERTIFICATELEVEL_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case GET_CERTIFICATELEVEL_DELETED_VALUE_SUCCESS:
        return {
          ...state,
          deleted: action.payload,
        };
  
      case UPDATE_CERTIFICATELEVEL_SUCCESS:
        return {
          ...state,
          certificatelevels: state.certificatelevels.map(certificatelevel =>
            certificatelevel.Id.toString() === action.payload.Id.toString()
              ? { ...certificatelevel, ...action.payload }
              : certificatelevel
          ),
        };
  
      case UPDATE_CERTIFICATELEVEL_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case DELETE_CERTIFICATELEVEL_SUCCESS:
        return {
          ...state,
          certificatelevels: state.certificatelevels.filter(
            certificatelevel => certificatelevel.Id.toString() !== action.payload.Id.toString()
          ),
          deleted: action.payload.deleted
        };
  
      case DELETE_CERTIFICATELEVEL_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case GET_CERTIFICATELEVEL_DELETED_VALUE_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      default:
        return state;
    }
  };
  
  export default certificatelevels;
  