import { getDecisionReason } from "./actions";
import {
  GET_DISMISS_DECREES_OTHER_SUCCESS,
  GET_DISMISS_DECREES_OTHER_FAIL,
  ADD_DISMISS_DECREE_OTHER_SUCCESS,
  ADD_DISMISS_DECREE_OTHER_FAIL,
  UPDATE_DISMISS_DECREE_OTHER_SUCCESS,
  UPDATE_DISMISS_DECREE_OTHER_FAIL,
  DELETE_DISMISS_DECREE_OTHER_SUCCESS,
  DELETE_DISMISS_DECREE_OTHER_FAIL,
  GET_DISMISS_DECREE_OTHER_DELETED_VALUE_SUCCESS,
  GET_DISMISS_DECREE_OTHER_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  dismissDecreesOther: [],
  deleted: {},
  error: {},
};

const dismissDecreesOther = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DISMISS_DECREES_OTHER_SUCCESS:
      return {
        ...state,
        dismissDecreesOther: action.payload,
      };

    case GET_DISMISS_DECREES_OTHER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_DISMISS_DECREE_OTHER_SUCCESS:
      return {
        ...state,
        dismissDecreesOther: [...state.dismissDecreesOther, action.payload],
      };

    case ADD_DISMISS_DECREE_OTHER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_DISMISS_DECREE_OTHER_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload,
      };

    case UPDATE_DISMISS_DECREE_OTHER_SUCCESS:
      return {
        ...state,
        dismissDecreesOther: state.dismissDecreesOther.map(dismissDecreeOther =>
          dismissDecreeOther.Id.toString() === action.payload.Id.toString()
            ? { ...dismissDecreeOther, ...action.payload }
            : dismissDecreeOther
        ),
      };

    case UPDATE_DISMISS_DECREE_OTHER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_DISMISS_DECREE_OTHER_SUCCESS:
      return {
        ...state,
        dismissDecreesOther: state.dismissDecreesOther.filter(
          dismissDecreeOther =>
            dismissDecreeOther.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_DISMISS_DECREE_OTHER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_DISMISS_DECREE_OTHER_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default dismissDecreesOther;
