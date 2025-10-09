import { getDecisionReason } from "./actions";
import {
  GET_DISMISS_DECREES_ABSENCE_SUCCESS,
  GET_DISMISS_DECREES_ABSENCE_FAIL,
  ADD_DISMISS_DECREE_ABSENCE_SUCCESS,
  ADD_DISMISS_DECREE_ABSENCE_FAIL,
  UPDATE_DISMISS_DECREE_ABSENCE_SUCCESS,
  UPDATE_DISMISS_DECREE_ABSENCE_FAIL,
  DELETE_DISMISS_DECREE_ABSENCE_SUCCESS,
  DELETE_DISMISS_DECREE_ABSENCE_FAIL,
  GET_DISMISS_DECREE_ABSENCE_DELETED_VALUE_SUCCESS,
  GET_DISMISS_DECREE_ABSENCE_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  dismissDecreesAbsence: [],
  deleted: {},
  error: {},
};

const dismissDecreesAbsence = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DISMISS_DECREES_ABSENCE_SUCCESS:
      return {
        ...state,
        dismissDecreesAbsence: action.payload,
      };

    case GET_DISMISS_DECREES_ABSENCE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_DISMISS_DECREE_ABSENCE_SUCCESS:
      return {
        ...state,
        dismissDecreesAbsence: [...state.dismissDecreesAbsence, action.payload],
      };

    case ADD_DISMISS_DECREE_ABSENCE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_DISMISS_DECREE_ABSENCE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload,
      };

    case UPDATE_DISMISS_DECREE_ABSENCE_SUCCESS:
      return {
        ...state,
        dismissDecreesAbsence: state.dismissDecreesAbsence.map(
          dismissDecreeAbsence =>
            dismissDecreeAbsence.Id.toString() === action.payload.Id.toString()
              ? { ...dismissDecreeAbsence, ...action.payload }
              : dismissDecreeAbsence
        ),
      };

    case UPDATE_DISMISS_DECREE_ABSENCE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_DISMISS_DECREE_ABSENCE_SUCCESS:
      return {
        ...state,
        dismissDecreesAbsence: state.dismissDecreesAbsence.filter(
          dismissDecreeAbsence =>
            dismissDecreeAbsence.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_DISMISS_DECREE_ABSENCE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_DISMISS_DECREE_ABSENCE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default dismissDecreesAbsence;
