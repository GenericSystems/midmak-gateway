import { nationalities } from "common/data";
import {
  GET_CONTRACTS,
  GET_CONTRACTS_FAIL,
  GET_CONTRACTS_SUCCESS,
  ADD_NEW_CONTRACT,
  ADD_CONTRACT_SUCCESS,
  ADD_CONTRACT_FAIL,
  UPDATE_CONTRACT,
  UPDATE_CONTRACT_SUCCESS,
  UPDATE_CONTRACT_FAIL,
  GET_CONTRACT_DELETED_VALUE,
  GET_CONTRACT_DELETED_VALUE_SUCCESS,
  GET_CONTRACT_DELETED_VALUE_FAIL,
  DELETE_CONTRACT,
  DELETE_CONTRACT_SUCCESS,
  DELETE_CONTRACT_FAIL,
} from "./actionTypes";

export const getContracts = () => ({
  type: GET_CONTRACTS,
});

export const getContractsSuccess = contracts => ({
  type: GET_CONTRACTS_SUCCESS,
  payload: contracts,
});

export const getContractsFail = error => ({
  type: GET_CONTRACTS_FAIL,
  payload: error,
});

export const getContractDeletedValue = () => ({
  type: GET_CONTRACT_DELETED_VALUE,
});

export const getContractDeletedValueSuccess = contract => ({
  type: GET_CONTRACT_DELETED_VALUE_SUCCESS,
  payload: contract,
});

export const getContractDeletedValueFail = error => ({
  type: GET_CONTRACT_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewContract = contract => ({
  type: ADD_NEW_CONTRACT,
  payload: contract,
});

export const addContractSuccess = contract => ({
  type: ADD_CONTRACT_SUCCESS,
  payload: contract,
});

export const addContractFail = error => ({
  type: ADD_CONTRACT_FAIL,
  payload: error,
});

export const updateContract = contract => {
  return {
    type: UPDATE_CONTRACT,
    payload: contract,
  };
};

export const updateContractSuccess = contract => ({
  type: UPDATE_CONTRACT_SUCCESS,
  payload: contract,
});

export const updateContractFail = error => ({
  type: UPDATE_CONTRACT_FAIL,
  payload: error,
});

export const deleteContract = contract => ({
  type: DELETE_CONTRACT,
  payload: contract,
});

export const deleteContractSuccess = contract => ({
  type: DELETE_CONTRACT_SUCCESS,
  payload: contract,
});

export const deleteContractFail = error => ({
  type: DELETE_CONTRACT_FAIL,
  payload: error,
});
