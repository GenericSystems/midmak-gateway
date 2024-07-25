
import {
    GET_FINE_DEFINITION_DELETED_VALUE,
    GET_FINE_DEFINITION_DELETED_VALUE_FAIL,
    GET_FINE_DEFINITION_DELETED_VALUE_SUCCESS,
    GET_FINES_DEFINITION,
    GET_FINES_DEFINITION_FAIL,
    GET_FINES_DEFINITION_SUCCESS,
    GET_CRITERIA,
    GET_CRITERIA_FAIL,
    GET_CRITERIA_SUCCESS,
    ADD_NEW_FINE_DEFINITION,
    ADD_NEW_FINE_DEFINITION_SUCCESS,
    ADD_NEW_FINE_DEFINITION_FAIL,
    UPDATE_FINE_DEFINITION,
    UPDATE_FINE_DEFINITION_SUCCESS,
    UPDATE_FINE_DEFINITION_FAIL,
    DELETE_FINE_DEFINITION,
    DELETE_FINE_DEFINITION_SUCCESS,
    DELETE_FINE_DEFINITION_FAIL,
    COPY_FINE,
    COPY_FINE_SUCCESS,
    COPY_FINE_FAIL,
  } from "./actionTypes";
  
  export const getFinesDefinition = fineDefinitions => ({
    type: GET_FINES_DEFINITION,
    payload: fineDefinitions,
  });
  
  export const getFinesDefinitionSuccess = fineDefinitions => ({
    type: GET_FINES_DEFINITION_SUCCESS,
    payload: fineDefinitions,
  });
  
  export const getFinesDefinitionFail = error => ({
    type: GET_FINES_DEFINITION_FAIL,
    payload: error,
  });

  export const getCriteria = () => ({
    type: GET_CRITERIA,
  });
  
  export const getCriteriaSuccess = criteria => ({
    type: GET_CRITERIA_SUCCESS,
    payload: criteria,
  });
  
  export const getCriteriaFail = error => ({
    type: GET_CRITERIA_FAIL,
    payload: error,
  });
  
  export const getFineDefinitionDeletedValue = () => ({
    type: GET_FINE_DEFINITION_DELETED_VALUE,
  });
  
  export const getFineDefinitionDeletedValueSuccess = deleted => ({
    type: GET_FINE_DEFINITION_DELETED_VALUE_SUCCESS,
    payload: deleted,
  });
  
  export const getFineDefinitionDeletedValueFail = error => ({
    type: GET_FINE_DEFINITION_DELETED_VALUE_FAIL,
    payload: error,
  });
  
  export const addNewFineDefinition = fineDefinition => ({
    type: ADD_NEW_FINE_DEFINITION,
    payload: fineDefinition,
  });
  
  export const addFineDefinitionSuccess = fineDefinition => ({
    type: ADD_NEW_FINE_DEFINITION_SUCCESS,
    payload: fineDefinition,
  });
  
  export const addFineDefinitionFail = error => ({
    type: ADD_NEW_FINE_DEFINITION_FAIL,
    payload: error,
  });
  
  export const updateFineDefinition = fineDefinition => {
    return {
      type: UPDATE_FINE_DEFINITION,
      payload: fineDefinition,
    };
  };
  
  export const updateFineDefinitionSuccess = fineDefinition => ({
    type: UPDATE_FINE_DEFINITION_SUCCESS,
    payload: fineDefinition,
  });
  
  export const updateFineDefinitionFail = error => ({
    type: UPDATE_FINE_DEFINITION_FAIL,
    payload: error,
  });
  
  export const deleteFineDefinition = fineDefinition => ({
    type: DELETE_FINE_DEFINITION,
    payload: fineDefinition,
  });
  
  export const deleteFineDefinitionSuccess = fineDefinition => ({
    type: DELETE_FINE_DEFINITION_SUCCESS,
    payload: fineDefinition,
  });
  
  export const deleteFineDefinitionFail = error => ({
    type: DELETE_FINE_DEFINITION_FAIL,
    payload: error,
  });
  
  export const copyFine = fineDefinition => ({
    type: COPY_FINE,
    payload: fineDefinition,
  });
  
  export const copyFineSuccess = fineDefinition => ({
    type: COPY_FINE_SUCCESS,
    payload: fineDefinition,
  });
  
  export const copyFineFail = error => ({
    type: COPY_FINE_FAIL,
    payload: error,
  });