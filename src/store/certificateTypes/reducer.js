import {
    GET_CERTIFICATE_TYPES_SUCCESS,
    GET_CERTIFICATE_TYPES_FAIL,
    ADD_CERTIFICATE_TYPE_SUCCESS,
    ADD_CERTIFICATE_TYPE_FAIL,
    UPDATE_CERTIFICATE_TYPE_SUCCESS,
    UPDATE_CERTIFICATE_TYPE_FAIL,
    DELETE_CERTIFICATE_TYPE_SUCCESS,
    DELETE_CERTIFICATE_TYPE_FAIL,
    GET_CERTIFICATE_TYPE_DELETED_VALUE_SUCCESS,
    GET_CERTIFICATE_TYPE_DELETED_VALUE_FAIL,
  } from "./actionTypes";
  
  const INIT_STATE = {
    certificateTypes: [],
    deleted: {},
    error: {},
  };
  
  const certificateTypes = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_CERTIFICATE_TYPES_SUCCESS:
        return {
          ...state,
          certificateTypes: action.payload,
        };
  
      case GET_CERTIFICATE_TYPES_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case ADD_CERTIFICATE_TYPE_SUCCESS:
        return {
          ...state,
          certificateTypes: [...state.certificateTypes, action.payload],
        };
  
      case ADD_CERTIFICATE_TYPE_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case GET_CERTIFICATE_TYPE_DELETED_VALUE_SUCCESS:
        return {
          ...state,
          deleted: action.payload,
        };
  
      case UPDATE_CERTIFICATE_TYPE_SUCCESS:
        return {
          ...state,
          certificateTypes: state.certificateTypes.map(certificateType =>
            certificateType.Id.toString() === action.payload.Id.toString()
              ? { ...certificateType, ...action.payload }
              : certificateType
          ),
        };
  
      case UPDATE_CERTIFICATE_TYPE_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case DELETE_CERTIFICATE_TYPE_SUCCESS:
        return {
          ...state,
          certificateTypes: state.certificateTypes.filter(
            certificateType => certificateType.Id.toString() !== action.payload.Id.toString()
          ),
          deleted: action.payload.deleted
        };
  
      case DELETE_CERTIFICATE_TYPE_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case GET_CERTIFICATE_TYPE_DELETED_VALUE_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      default:
        return state;
    }
  };
  
  export default certificateTypes;
  