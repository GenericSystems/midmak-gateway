import {
  GET_CONTRACT_TYPE_DELETED_VALUE,
  GET_CONTRACT_TYPE_DELETED_VALUE_FAIL,
  GET_CONTRACT_TYPE_DELETED_VALUE_SUCCESS,
  GET_CONTRACTS_TYPES,
  GET_CONTRACTS_TYPES_FAIL,
  GET_CONTRACTS_TYPES_SUCCESS,
  ADD_NEW_CONTRACT_TYPE,
  ADD_CONTRACT_TYPE_SUCCESS,
  ADD_CONTRACT_TYPE_FAIL,
  UPDATE_CONTRACT_TYPE,
  UPDATE_CONTRACT_TYPE_SUCCESS,
  UPDATE_CONTRACT_TYPE_FAIL,
  DELETE_CONTRACT_TYPE,
  DELETE_CONTRACT_TYPE_SUCCESS,
  DELETE_CONTRACT_TYPE_FAIL,
} from "./actionTypes";

export const getContractsTypes = () => ({
  type: GET_CONTRACTS_TYPES,
});

export const getContractsTypesSuccess = contractsTypes => ({
  type: GET_CONTRACTS_TYPES_SUCCESS,
  payload: contractsTypes,
});

export const getContractsTypesFail = error => ({
  type: GET_CONTRACTS_TYPES_FAIL,
  payload: error,
});

export const getContractTypeDeletedValue = () => ({
  type: GET_CONTRACT_TYPE_DELETED_VALUE,
});

export const getContractTypeDeletedValueSuccess = contractType => ({
  type: GET_CONTRACT_TYPE_DELETED_VALUE_SUCCESS,
  payload: contractType,
});

export const getContractTypeDeletedValueFail = error => ({
  type: GET_CONTRACT_TYPE_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewContractType = contractType => ({
  type: ADD_NEW_CONTRACT_TYPE,
  payload: contractType,
});

export const addContractTypeSuccess = contractType => ({
  type: ADD_CONTRACT_TYPE_SUCCESS,
  payload: contractType,
});

export const addContractTypeFail = error => ({
  type: ADD_CONTRACT_TYPE_FAIL,
  payload: error,
});

export const updateContractType = contractType => {
  return {
    type: UPDATE_CONTRACT_TYPE,
    payload: contractType,
  };
};

export const updateContractTypeSuccess = contractType => ({
  type: UPDATE_CONTRACT_TYPE_SUCCESS,
  payload: contractType,
});

export const updateContractTypeFail = error => ({
  type: UPDATE_CONTRACT_TYPE_FAIL,
  payload: error,
});

export const deleteContractType = contractType => ({
  type: DELETE_CONTRACT_TYPE,
  payload: contractType,
});

export const deleteContractTypeSuccess = contractType => ({
  type: DELETE_CONTRACT_TYPE_SUCCESS,
  payload: contractType,
});

export const deleteContractTypeFail = error => ({
  type: DELETE_CONTRACT_TYPE_FAIL,
  payload: error,
});
