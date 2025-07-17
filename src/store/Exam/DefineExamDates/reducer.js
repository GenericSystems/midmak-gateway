import {
  GET_CONTRACTS_SUCCESS,
  GET_CONTRACTS_FAIL,
  ADD_CONTRACT_SUCCESS,
  ADD_CONTRACT_FAIL,
  UPDATE_CONTRACT_SUCCESS,
  UPDATE_CONTRACT_FAIL,
  GET_CONTRACT_DELETED_VALUE_SUCCESS,
  GET_CONTRACT_DELETED_VALUE_FAIL,
  DELETE_CONTRACT_SUCCESS,
  DELETE_CONTRACT_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  contracts: [],
  deleted: {},
  error: {},
};

const contracts = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CONTRACTS_SUCCESS:
      return {
        ...state,
        contracts: action.payload,
        deleted: {},
      };

    case GET_CONTRACTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_CONTRACT_SUCCESS:
      return {
        ...state,
        contracts: [...state.contracts, action.payload],
      };

    case ADD_CONTRACT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_CONTRACT_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    case GET_CONTRACT_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_CONTRACT_SUCCESS:
      return {
        ...state,
        contracts: state.contracts.map(contract =>
          contract.Id.toString() === action.payload.Id.toString()
            ? { contract, ...action.payload }
            : contract
        ),
      };

    case UPDATE_CONTRACT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_CONTRACT_SUCCESS:
      return {
        ...state,
        contracts: state.contracts.filter(
          contract => contract.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_CONTRACT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default contracts;
