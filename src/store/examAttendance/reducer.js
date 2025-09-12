import {
  GET_EXAMS_ATTENDANCE_SUCCESS,
  GET_EXAMS_ATTENDANCE_FAIL,
  ADD_EXAM_ATTENDANCE_SUCCESS,
  ADD_EXAM_ATTENDANCE_FAIL,
  UPDATE_EXAM_ATTENDANCE_SUCCESS,
  UPDATE_EXAM_ATTENDANCE_FAIL,
  DELETE_EXAM_ATTENDANCE_SUCCESS,
  DELETE_EXAM_ATTENDANCE_FAIL,
  GET_EXAM_ATTENDANCE_DELETED_VALUE_SUCCESS,
  GET_EXAM_ATTENDANCE_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  examsAttendance: [],
  error: {},
};

const examsAttendance = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_EXAMS_ATTENDANCE_SUCCESS:
      return {
        ...state,
        examsAttendance: action.payload,
        deleted: {},
      };

    case GET_EXAMS_ATTENDANCE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_EXAM_ATTENDANCE_SUCCESS:
      return {
        ...state,
        examsAttendance: [...state.examsAttendance, action.payload],
      };

    case ADD_EXAM_ATTENDANCE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_EXAM_ATTENDANCE_SUCCESS:
      return {
        ...state,
        examsAttendance: state.examsAttendance.map(examAttendance =>
          examAttendance.Id.toString() === action.payload.Id.toString()
            ? { examAttendance, ...action.payload }
            : examAttendance
        ),
      };

    case UPDATE_EXAM_ATTENDANCE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_EXAM_ATTENDANCE_SUCCESS:
      return {
        ...state,
        examsAttendance: state.examsAttendance.filter(
          examAttendance => examAttendance.Id !== action.payload.Id
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_EXAM_ATTENDANCE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_EXAM_ATTENDANCE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    case GET_EXAM_ATTENDANCE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default examsAttendance;
