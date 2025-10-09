import { getDecisionReason } from "./actions";
import {
  GET_DISMISS_DECREES_EXAM_SUCCESS,
  GET_DISMISS_DECREES_EXAM_FAIL,
  ADD_DISMISS_DECREE_EXAM_SUCCESS,
  ADD_DISMISS_DECREE_EXAM_FAIL,
  UPDATE_DISMISS_DECREE_EXAM_SUCCESS,
  UPDATE_DISMISS_DECREE_EXAM_FAIL,
  DELETE_DISMISS_DECREE_EXAM_SUCCESS,
  DELETE_DISMISS_DECREE_EXAM_FAIL,
  GET_DISMISS_DECREE_EXAM_DELETED_VALUE_SUCCESS,
  GET_DISMISS_DECREE_EXAM_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  dismissDecreesExam: [],
  deleted: {},
  error: {},
};

const dismissDecreesExam = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DISMISS_DECREES_EXAM_SUCCESS:
      return {
        ...state,
        dismissDecreesExam: action.payload,
      };

    case GET_DISMISS_DECREES_EXAM_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_DISMISS_DECREE_EXAM_SUCCESS:
      return {
        ...state,
        dismissDecreesExam: [...state.dismissDecreesExam, action.payload],
      };

    case ADD_DISMISS_DECREE_EXAM_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_DISMISS_DECREE_EXAM_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload,
      };

    case UPDATE_DISMISS_DECREE_EXAM_SUCCESS:
      return {
        ...state,
        dismissDecreesExam: state.dismissDecreesExam.map(dismissDecreeExam =>
          dismissDecreeExam.Id.toString() === action.payload.Id.toString()
            ? { ...dismissDecreeExam, ...action.payload }
            : dismissDecreeExam
        ),
      };

    case UPDATE_DISMISS_DECREE_EXAM_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_DISMISS_DECREE_EXAM_SUCCESS:
      return {
        ...state,
        dismissDecreesExam: state.dismissDecreesExam.filter(
          dismissDecreeExam =>
            dismissDecreeExam.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_DISMISS_DECREE_EXAM_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_DISMISS_DECREE_EXAM_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default dismissDecreesExam;
