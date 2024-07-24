import {
    GET_REQUESTS_FEES,
    GET_REQUESTS_FEES_FAIL,
    GET_REQUESTS_FEES_SUCCESS,
    GET_REQUEST_FEES_DELETED_VALUE,
    GET_REQUEST_FEES_DELETED_VALUE_FAIL,
    GET_REQUEST_FEES_DELETED_VALUE_SUCCESS,
    ADD_NEW_REQUEST_FEES,
    ADD_REQUEST_FEES_SUCCESS,
    ADD_REQUEST_FEES_FAIL,
    UPDATE_REQUEST_FEES,
    UPDATE_REQUEST_FEES_SUCCESS,
    UPDATE_REQUEST_FEES_FAIL,
    DELETE_REQUEST_FEES,
    DELETE_REQUEST_FEES_SUCCESS,
    DELETE_REQUEST_FEES_FAIL,
    GET_REQUEST_CRITERIA,
    GET_REQUEST_CRITERIA_FAIL,
    GET_REQUEST_CRITERIA_SUCCESS,
    COPY_REQUEST_FEES,
    COPY_REQUEST_FEES_SUCCESS,
    COPY_REQUEST_FEES_FAIL,
    GET_YEAR_CONTENTS,
    GET_YEAR_CONTENTS_FAIL,
    GET_YEAR_CONTENTS_SUCCESS,
  } from "./actionTypes"
  
  export const getRequestsFees = requestsFees => ({
    type: GET_REQUESTS_FEES,
    payload: requestsFees,

  })
  
  export const getRequestsFeesSuccess = requestsFees => ({
    type: GET_REQUESTS_FEES_SUCCESS,
    payload: requestsFees,
  })
  
  export const getRequestsFeesFail = error => ({
    type: GET_REQUESTS_FEES_FAIL,
    payload: error,
  })
  
  export const getRequestFeesDeletedValue = () => ({
    type: GET_REQUEST_FEES_DELETED_VALUE,
  })
  
  export const getRequestFeesDeletedValueSuccess = deleted => ({
    type: GET_REQUEST_FEES_DELETED_VALUE_SUCCESS,
    payload: deleted,
  })
  
  export const getRequestFeesDeletedValueFail = error => ({
    type: GET_REQUEST_FEES_DELETED_VALUE_FAIL,
    payload: error,
  })
  
  export const addNewRequestFees = requestFees => ({
    type: ADD_NEW_REQUEST_FEES,
    payload: requestFees,
  })
  
  export const addRequestFeesSuccess = requestFees => ({
    type: ADD_REQUEST_FEES_SUCCESS,
    payload: requestFees,
  })
  
  export const addRequestFeesFail = error => ({
    type: ADD_REQUEST_FEES_FAIL,
    payload: error,
  })
  
  export const updateRequestFees = requestFees => ({
    type: UPDATE_REQUEST_FEES,
    payload: requestFees,
  })
  
  export const updateRequestFeesSuccess = requestFees => ({
    type: UPDATE_REQUEST_FEES_SUCCESS,
    payload: requestFees,
  })
  
  export const updateRequestFeesFail = error => ({
    type: UPDATE_REQUEST_FEES_FAIL,
    payload: error,
  })
  
  export const deleteRequestFees = requestFees => ({
    type: DELETE_REQUEST_FEES,
    payload: requestFees,
  })
  
  export const deleteRequestFeesSuccess = requestFees => ({
    type: DELETE_REQUEST_FEES_SUCCESS,
    payload: requestFees,
  })
  
  export const deleteRequestFeesFail = error => ({
    type: DELETE_REQUEST_FEES_FAIL,
    payload: error,
  })

  export const getRequestCriteria = () => ({
    type: GET_REQUEST_CRITERIA,
  });
  
  export const getRequestCriteriaSuccess = criteria => ({
    type: GET_REQUEST_CRITERIA_SUCCESS,
    payload: criteria,
  });
  
  export const getRequestCriteriaFail = error => ({
    type: GET_REQUEST_CRITERIA_FAIL,
    payload: error,
  });

  export const copyRequestFees = feesDefinition => ({
    type: COPY_REQUEST_FEES,
    payload: feesDefinition,
  });
  
  export const copyRequestFeesSuccess = feesDefinition => ({
    type: COPY_REQUEST_FEES_SUCCESS,
    payload: feesDefinition,
  });
  
  export const copyRequestFeesFail = error => ({
    type: COPY_REQUEST_FEES_FAIL,
    payload: error,
  });

  export const getYearContents = () => ({
    type: GET_YEAR_CONTENTS,
  })
  
  export const getYearContentsSuccess = yearContent => ({
    type: GET_YEAR_CONTENTS_SUCCESS,
    payload: yearContent,
  })
  
  export const getYearContentsFail = error => ({
    type: GET_YEAR_CONTENTS_FAIL,
    payload: error,
  })