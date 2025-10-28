import { getRequestStatus } from "./actions";
import {
  GET_MARKS_OBJECTIONS_SUCCESS,
  GET_MARKS_OBJECTIONS_FAIL,
  ADD_MARK_OBJECTION_SUCCESS,
  ADD_MARK_OBJECTION_FAIL,
  UPDATE_MARK_OBJECTION_SUCCESS,
  UPDATE_MARK_OBJECTION_FAIL,
  GET_MARK_OBJECTION_DELETED_VALUE_SUCCESS,
  GET_MARK_OBJECTION_DELETED_VALUE_FAIL,
  DELETE_MARK_OBJECTION_SUCCESS,
  DELETE_MARK_OBJECTION_FAIL,
  GET_REQUEST_STATUS_SUCCESS,
  GET_REQUEST_STATUS_FAIL,
  GET_REQUEST_TYPES_SUCCESS,
  GET_REQUEST_TYPES_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  marksObjections: [],
  requestStatus: [],
  requestTypes: [],
  deleted: {},
  error: {},
};

const marksObjections = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_MARKS_OBJECTIONS_SUCCESS:
      return {
        ...state,
        marksObjections: action.payload,
        deleted: {},
      };

    case GET_MARKS_OBJECTIONS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_MARK_OBJECTION_SUCCESS:
      return {
        ...state,
        marksObjections: [...state.marksObjections, action.payload],
      };

    case ADD_MARK_OBJECTION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_MARK_OBJECTION_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    case GET_MARK_OBJECTION_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_MARK_OBJECTION_SUCCESS:
      return {
        ...state,
        marksObjections: state.marksObjections.map(markObjection =>
          markObjection.Id.toString() === action.payload.Id.toString()
            ? { markObjection, ...action.payload }
            : markObjection
        ),
      };

    case UPDATE_MARK_OBJECTION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_MARK_OBJECTION_SUCCESS:
      return {
        ...state,
        marksObjections: state.marksObjections.filter(
          markObjection =>
            markObjection.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_MARK_OBJECTION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_REQUEST_STATUS_SUCCESS:
      return {
        ...state,
        requestStatus: action.payload,
        deleted: {},
      };

    case GET_REQUEST_STATUS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_REQUEST_TYPES_SUCCESS:
      return {
        ...state,
        requestTypes: action.payload,
        deleted: {},
      };

    case GET_REQUEST_TYPES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default marksObjections;
