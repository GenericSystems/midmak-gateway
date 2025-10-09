import { getDecisionReason } from "./actions";
import {
  GET_ORAL_WARNING_DECREES_SUCCESS,
  GET_ORAL_WARNING_DECREES_FAIL,
  ADD_ORAL_WARNING_DECREE_SUCCESS,
  ADD_ORAL_WARNING_DECREE_FAIL,
  UPDATE_ORAL_WARNING_DECREE_SUCCESS,
  UPDATE_ORAL_WARNING_DECREE_FAIL,
  DELETE_ORAL_WARNING_DECREE_SUCCESS,
  DELETE_ORAL_WARNING_DECREE_FAIL,
  GET_ORAL_WARNING_DECREE_DELETED_VALUE_SUCCESS,
  GET_ORAL_WARNING_DECREE_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  oralWarningDecrees: [],
  deleted: {},
  error: {},
};

const oralWarningDecrees = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ORAL_WARNING_DECREES_SUCCESS:
      return {
        ...state,
        oralWarningDecrees: action.payload,
      };

    case GET_ORAL_WARNING_DECREES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_ORAL_WARNING_DECREE_SUCCESS:
      return {
        ...state,
        oralWarningDecrees: [...state.oralWarningDecrees, action.payload],
      };

    case ADD_ORAL_WARNING_DECREE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_ORAL_WARNING_DECREE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload,
      };

    case UPDATE_ORAL_WARNING_DECREE_SUCCESS:
      return {
        ...state,
        oralWarningDecrees: state.oralWarningDecrees.map(absenceWarning =>
          absenceWarning.Id.toString() === action.payload.Id.toString()
            ? { ...absenceWarning, ...action.payload }
            : absenceWarning
        ),
      };

    case UPDATE_ORAL_WARNING_DECREE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_ORAL_WARNING_DECREE_SUCCESS:
      return {
        ...state,
        oralWarningDecrees: state.oralWarningDecrees.filter(
          absenceWarning =>
            absenceWarning.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_ORAL_WARNING_DECREE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_ORAL_WARNING_DECREE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default oralWarningDecrees;
