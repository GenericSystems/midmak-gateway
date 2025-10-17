import {
  GET_EXAM_ATTENDANCE_OBSERVERS_SUCCESS,
  GET_EXAM_ATTENDANCE_OBSERVERS_FAIL,
  ADD_EXAM_ATTENDANCE_OBSERVER_SUCCESS,
  ADD_EXAM_ATTENDANCE_OBSERVER_FAIL,
  UPDATE_EXAM_ATTENDANCE_OBSERVER_SUCCESS,
  UPDATE_EXAM_ATTENDANCE_OBSERVER_FAIL,
  DELETE_EXAM_ATTENDANCE_OBSERVER_SUCCESS,
  DELETE_EXAM_ATTENDANCE_OBSERVER_FAIL,
  GET_EXAM_ATTENDANCE_OBSERVER_DELETED_VALUE_SUCCESS,
  GET_EXAM_ATTENDANCE_OBSERVER_DELETED_VALUE_FAIL,
  // GET_ATTEND_STATUS_SUCCESS,
  // GET_ATTEND_STATUS_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  attendanceObservers: [],
  attendStatus: [],
  error: {},
};

const attendanceObservers = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_EXAM_ATTENDANCE_OBSERVERS_SUCCESS:
      return {
        ...state,
        attendanceObservers: action.payload,
        deleted: {},
      };

    case GET_EXAM_ATTENDANCE_OBSERVERS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_EXAM_ATTENDANCE_OBSERVER_SUCCESS:
      return {
        ...state,
        attendanceObservers: [...state.attendanceObservers, action.payload],
      };

    case ADD_EXAM_ATTENDANCE_OBSERVER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_EXAM_ATTENDANCE_OBSERVER_SUCCESS:
      return {
        ...state,
        attendanceObservers: state.attendanceObservers.map(attendanceObserver =>
          attendanceObserver.Id.toString() === action.payload.Id.toString()
            ? { attendanceObserver, ...action.payload }
            : attendanceObserver
        ),
      };

    case UPDATE_EXAM_ATTENDANCE_OBSERVER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_EXAM_ATTENDANCE_OBSERVER_SUCCESS:
      return {
        ...state,
        attendanceObservers: state.attendanceObservers.filter(
          attendanceObserver => attendanceObserver.Id !== action.payload.Id
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_EXAM_ATTENDANCE_OBSERVER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_EXAM_ATTENDANCE_OBSERVER_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    case GET_EXAM_ATTENDANCE_OBSERVER_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    // case GET_ATTEND_STATUS_SUCCESS:
    //   return {
    //     ...state,
    //     attendStatus: action.payload,
    //     deleted: {},
    //   };

    // case GET_ATTEND_STATUS_FAIL:
    //   return {
    //     ...state,
    //     error: action.payload,
    //   };

    default:
      return state;
  }
};

export default attendanceObservers;
