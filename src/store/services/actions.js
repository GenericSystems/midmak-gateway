import {
    GET_SERVICE_DELETED_VALUE,
    GET_SERVICE_DELETED_VALUE_FAIL,
    GET_SERVICE_DELETED_VALUE_SUCCESS,
    GET_SERVICES,
    GET_SERVICES_FAIL,
    GET_SERVICES_SUCCESS,
    ADD_NEW_SERVICE,
    ADD_SERVICE_SUCCESS,
    ADD_SERVICE_FAIL,
    UPDATE_SERVICE,
    UPDATE_SERVICE_SUCCESS,
    UPDATE_SERVICE_FAIL,
    DELETE_SERVICE,
    DELETE_SERVICE_SUCCESS,
    DELETE_SERVICE_FAIL,
  } from "./actionTypes";
  
  export const getServices = () => ({
    type: GET_SERVICES,
  });
  
  export const getServicesSuccess = services => ({
    type: GET_SERVICES_SUCCESS,
    payload: services,
  });
  
  export const getServicesFail = error => ({
    type: GET_SERVICES_FAIL,
    payload: error,
  });
  
  export const getServiceDeletedValue = () => ({
    type: GET_SERVICE_DELETED_VALUE,
  });
  
  export const getServiceDeletedValueSuccess = deleted => ({
    type: GET_SERVICE_DELETED_VALUE_SUCCESS,
    payload: deleted,
  });
  
  export const getServiceDeletedValueFail = error => ({
    type: GET_SERVICE_DELETED_VALUE_FAIL,
    payload: error,
  });
  
  export const addNewService = service => ({
    type: ADD_NEW_SERVICE,
    payload: service,
  });
  
  export const addServiceSuccess = service => ({
    type: ADD_SERVICE_SUCCESS,
    payload: service,
  });
  
  export const addServiceFail = error => ({
    type: ADD_SERVICE_FAIL,
    payload: error,
  });
  
  export const updateService = service => {
    return {
      type: UPDATE_SERVICE,
      payload: service,
    };
  };
  
  export const updateServiceSuccess = service => ({
    type: UPDATE_SERVICE_SUCCESS,
    payload: service,
  });
  
  export const updateServiceFail = error => ({
    type: UPDATE_SERVICE_FAIL,
    payload: error,
  });
  
  export const deleteService = service => ({
    type: DELETE_SERVICE,
    payload: service,
  });
  
  export const deleteServiceSuccess = service => ({
    type: DELETE_SERVICE_SUCCESS,
    payload: service,
  });
  
  export const deleteServiceFail = error => ({
    type: DELETE_SERVICE_FAIL,
    payload: error,
  });
  