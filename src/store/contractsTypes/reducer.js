import {
  GET_CONTRACTS_TYPES_SUCCESS,
  GET_CONTRACTS_TYPES_FAIL,
  ADD_CONTRACT_TYPE_SUCCESS,
  ADD_CONTRACT_TYPE_FAIL,
  UPDATE_CONTRACT_TYPE_SUCCESS,
  UPDATE_CONTRACT_TYPE_FAIL,
  DELETE_CONTRACT_TYPE_SUCCESS,
  DELETE_CONTRACT_TYPE_FAIL,
  GET_CONTRACT_TYPE_DELETED_VALUE_SUCCESS,
  GET_CONTRACT_TYPE_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  contractsTypes: [],
  deleted: {},
  error: {},
};

const contractsTypes = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CONTRACTS_TYPES_SUCCESS:
      return {
        ...state,
        contractsTypes: action.payload,
      };

    case GET_CONTRACTS_TYPES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_CONTRACT_TYPE_SUCCESS:
      return {
        ...state,
        contractsTypes: [...state.contractsTypes, action.payload],
      };

    case ADD_CONTRACT_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_CONTRACT_TYPE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload,
      };

    case UPDATE_CONTRACT_TYPE_SUCCESS:
      return {
        ...state,
        contractsTypes: state.contractsTypes.map(contractType =>
          contractType.Id.toString() === action.payload.Id.toString()
            ? { contractType, ...action.payload }
            : contractType
        ),
      };

    case UPDATE_CONTRACT_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_CONTRACT_TYPE_SUCCESS:
      return {
        ...state,
        contractsTypes: state.contractsTypes.filter(
          contractType =>
            contractType.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_CONTRACT_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_CONTRACT_TYPE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default contractsTypes;
