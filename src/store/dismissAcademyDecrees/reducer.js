import { getDecisionReason } from "./actions";
import {
  GET_DISMISS_ACADEMY_DECREES_SUCCESS,
  GET_DISMISS_ACADEMY_DECREES_FAIL,
  ADD_DISMISS_ACADEMY_DECREE_SUCCESS,
  ADD_DISMISS_ACADEMY_DECREE_FAIL,
  UPDATE_DISMISS_ACADEMY_DECREE_SUCCESS,
  UPDATE_DISMISS_ACADEMY_DECREE_FAIL,
  DELETE_DISMISS_ACADEMY_DECREE_SUCCESS,
  DELETE_DISMISS_ACADEMY_DECREE_FAIL,
  GET_DISMISS_ACADEMY_DECREE_DELETED_VALUE_SUCCESS,
  GET_DISMISS_ACADEMY_DECREE_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  dismissAcademyDecrees: [],
  deleted: {},
  error: {},
};

const dismissAcademyDecrees = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DISMISS_ACADEMY_DECREES_SUCCESS:
      return {
        ...state,
        dismissAcademyDecrees: action.payload,
      };

    case GET_DISMISS_ACADEMY_DECREES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_DISMISS_ACADEMY_DECREE_SUCCESS:
      return {
        ...state,
        dismissAcademyDecrees: [...state.dismissAcademyDecrees, action.payload],
      };

    case ADD_DISMISS_ACADEMY_DECREE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_DISMISS_ACADEMY_DECREE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload,
      };

    case UPDATE_DISMISS_ACADEMY_DECREE_SUCCESS:
      return {
        ...state,
        dismissAcademyDecrees: state.dismissAcademyDecrees.map(
          dismissAcademyDecree =>
            dismissAcademyDecree.Id.toString() === action.payload.Id.toString()
              ? { ...dismissAcademyDecree, ...action.payload }
              : dismissAcademyDecree
        ),
      };

    case UPDATE_DISMISS_ACADEMY_DECREE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_DISMISS_ACADEMY_DECREE_SUCCESS:
      return {
        ...state,
        dismissAcademyDecrees: state.dismissAcademyDecrees.filter(
          dismissAcademyDecree =>
            dismissAcademyDecree.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_DISMISS_ACADEMY_DECREE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_DISMISS_ACADEMY_DECREE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default dismissAcademyDecrees;
