import { getDecisionReason } from "./actions";
import {
  GET_WRITTEN_WARNING_DECREES_SUCCESS,
  GET_WRITTEN_WARNING_DECREES_FAIL,
  ADD_WRITTEN_WARNING_DECREE_SUCCESS,
  ADD_WRITTEN_WARNING_DECREE_FAIL,
  UPDATE_WRITTEN_WARNING_DECREE_SUCCESS,
  UPDATE_WRITTEN_WARNING_DECREE_FAIL,
  DELETE_WRITTEN_WARNING_DECREE_SUCCESS,
  DELETE_WRITTEN_WARNING_DECREE_FAIL,
  GET_WRITTEN_WARNING_DECREE_DELETED_VALUE_SUCCESS,
  GET_WRITTEN_WARNING_DECREE_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  writtenWarningDecrees: [],
  deleted: {},
  error: {},
};

const writtenWarningDecrees = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_WRITTEN_WARNING_DECREES_SUCCESS:
      return {
        ...state,
        writtenWarningDecrees: action.payload,
      };

    case GET_WRITTEN_WARNING_DECREES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_WRITTEN_WARNING_DECREE_SUCCESS:
      return {
        ...state,
        writtenWarningDecrees: [...state.writtenWarningDecrees, action.payload],
      };

    case ADD_WRITTEN_WARNING_DECREE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_WRITTEN_WARNING_DECREE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload,
      };

    case UPDATE_WRITTEN_WARNING_DECREE_SUCCESS:
      return {
        ...state,
        writtenWarningDecrees: state.writtenWarningDecrees.map(
          writtenWarningDecree =>
            writtenWarningDecree.Id.toString() === action.payload.Id.toString()
              ? { ...writtenWarningDecree, ...action.payload }
              : writtenWarningDecree
        ),
      };

    case UPDATE_WRITTEN_WARNING_DECREE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_WRITTEN_WARNING_DECREE_SUCCESS:
      return {
        ...state,
        writtenWarningDecrees: state.writtenWarningDecrees.filter(
          writtenWarningDecree =>
            writtenWarningDecree.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_WRITTEN_WARNING_DECREE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_WRITTEN_WARNING_DECREE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default writtenWarningDecrees;
