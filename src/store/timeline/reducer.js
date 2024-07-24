import {
  GET_TIMELINES_SUCCESS,
  GET_TIMELINES_FAIL,
  ADD_TIMELINE_SUCCESS,
  ADD_TIMELINE_FAIL,
  UPDATE_TIMELINE_SUCCESS,
  UPDATE_TIMELINE_FAIL,
  DELETE_TIMELINE_SUCCESS,
  DELETE_TIMELINE_FAIL,
  GET_TIMELINE_DELETED_VALUE_SUCCESS,
  GET_TIMELINE_DELETED_VALUE_FAIL,
  GET_REQUEST_PERIOD_ALLOWANCE_SUCCESS,
  GET_REQUEST_PERIOD_ALLOWANCE_FAIL,
  GET_REQUEST_PERIOD_ALLOWANCE_TIME_SUCCESS,
  GET_REQUEST_PERIOD_ALLOWANCE_TIME_FAIL,
  UPDATE_REQUEST_PERIOD_ALLOWANCE_TIME_SUCCESS,
  UPDATE_REQUEST_PERIOD_ALLOWANCE_TIME_FAIL,
  GENERALIZE_REQUEST_PERIOD_ALLOWANCE_TIME_SUCCESS,
  GENERALIZE_REQUEST_PERIOD_ALLOWANCE_TIME_FAIL,
  GET_REQUEST_PERIOD_PERMISSION_SUCCESS,
  GET_REQUEST_PERIOD_PERMISSION_FAIL,
  ADD_REQUEST_PERIOD_PERMISSION_SUCCESS,
  ADD_REQUEST_PERIOD_PERMISSION_FAIL,
  UPDATE_REQUEST_PERIOD_PERMISSION_SUCCESS,
  UPDATE_REQUEST_PERIOD_PERMISSION_FAIL,
  DELETE_REQUEST_PERIOD_PERMISSION_SUCCESS,
  DELETE_REQUEST_PERIOD_PERMISSION_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  timeLines: [],
  requestsPeriodAllowance: [],
  requestsPeriodAllowanceTime: [],
  requestsPeriodPermission: [],
  deleted: {},
  error: {},
};

const timeLines = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_TIMELINES_SUCCESS:
      return {
        ...state,
        timeLines: action.payload,
      };
    case GET_TIMELINES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_TIMELINE_SUCCESS:
      return {
        ...state,
        timeLines: [...state.timeLines, action.payload],
      };

    case ADD_TIMELINE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_TIMELINE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload,
      };

    case UPDATE_TIMELINE_SUCCESS:
      return {
        ...state,
        timeLines: state.timeLines.map(timeLine =>
          timeLine.Id.toString() === action.payload.Id.toString()
            ? { timeLine, ...action.payload }
            : timeLine
        ),
      };

    case UPDATE_TIMELINE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_TIMELINE_SUCCESS:
      return {
        ...state,
        timeLines: state.timeLines.filter(
          timeLine => timeLine.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_TIMELINE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_TIMELINE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_REQUEST_PERIOD_ALLOWANCE_SUCCESS:
      return {
        ...state,
        requestsPeriodAllowance: action.payload,
      };
    case GET_REQUEST_PERIOD_ALLOWANCE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_REQUEST_PERIOD_ALLOWANCE_TIME_SUCCESS:
      return {
        ...state,
        requestsPeriodAllowanceTime: action.payload,
      };
    case GET_REQUEST_PERIOD_ALLOWANCE_TIME_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_REQUEST_PERIOD_ALLOWANCE_TIME_SUCCESS:
      return {
        ...state,
        requestsPeriodAllowanceTime: state.requestsPeriodAllowanceTime.map(
          requestPeriodAllowanceTime =>
            requestPeriodAllowanceTime.Id.toString() ===
            action.payload.Id.toString()
              ? { requestPeriodAllowanceTime, ...action.payload }
              : requestPeriodAllowanceTime
        ),
      };

    case UPDATE_REQUEST_PERIOD_ALLOWANCE_TIME_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GENERALIZE_REQUEST_PERIOD_ALLOWANCE_TIME_SUCCESS:
      return {
        ...state,
        requestsPeriodAllowanceTime: action.payload,
      };

    case GENERALIZE_REQUEST_PERIOD_ALLOWANCE_TIME_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_REQUEST_PERIOD_PERMISSION_SUCCESS:
      return {
        ...state,
        requestsPeriodPermission: action.payload,
      };
    case GET_REQUEST_PERIOD_PERMISSION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_REQUEST_PERIOD_PERMISSION_SUCCESS:
      return {
        ...state,
        requestsPeriodPermission: state.requestsPeriodPermission.map(
          requestsPeriodPer =>
            requestsPeriodPer.Id.toString() === action.payload.Id.toString()
              ? { requestsPeriodPer, ...action.payload }
              : requestsPeriodPer
        ),
      };

    case UPDATE_REQUEST_PERIOD_PERMISSION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_REQUEST_PERIOD_PERMISSION_SUCCESS:
      return {
        ...state,
        requestsPeriodPermission: [
          ...state.requestsPeriodPermission,
          action.payload,
        ],
      };

    case ADD_REQUEST_PERIOD_PERMISSION_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case DELETE_REQUEST_PERIOD_PERMISSION_SUCCESS:
      return {
        ...state,
        requestsPeriodPermission: state.requestsPeriodPermission.filter(
          requestsPeriodPer =>
            requestsPeriodPer.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_REQUEST_PERIOD_PERMISSION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default timeLines;
