import {
  GET_REGISTER_TRAINEES_ATTENDANCE_SUCCESS,
  GET_REGISTER_TRAINEES_ATTENDANCE_FAIL,
  ADD_REGISTER_TRAINEE_ATTENDANCE_SUCCESS,
  ADD_REGISTER_TRAINEE_ATTENDANCE_FAIL,
  UPDATE_REGISTER_TRAINEE_ATTENDANCE_SUCCESS,
  UPDATE_REGISTER_TRAINEE_ATTENDANCE_FAIL,
  DELETE_REGISTER_TRAINEE_ATTENDANCE_SUCCESS,
  DELETE_REGISTER_TRAINEE_ATTENDANCE_FAIL,
  GET_REGISTER_TRAINEE_ATTENDANCE_DELETED_VALUE_SUCCESS,
  GET_REGISTER_TRAINEE_ATTENDANCE_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  regTrainees: [],
  deleted: {},
  error: {},
};

const regTraineesAttendance = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_REGISTER_TRAINEES_ATTENDANCE_SUCCESS:
      return {
        ...state,
        regTrainees: action.payload,
      };

    case GET_REGISTER_TRAINEES_ATTENDANCE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_REGISTER_TRAINEE_ATTENDANCE_SUCCESS:
      return {
        ...state,
        regTrainees: [...state.regTrainees, action.payload],
        lastAddedId: action.payload.Id,
      };

    case ADD_REGISTER_TRAINEE_ATTENDANCE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_REGISTER_TRAINEE_ATTENDANCE_SUCCESS:
      return {
        ...state,
        regTrainees: state.regTrainees.map(trainee =>
          trainee.Id.toString() === action.payload.Id.toString()
            ? { ...trainee, ...action.payload }
            : trainee
        ),
      };

    case UPDATE_REGISTER_TRAINEE_ATTENDANCE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_REGISTER_TRAINEE_ATTENDANCE_SUCCESS:
      return {
        ...state,
        regTrainees: state.regTrainees.filter(
          trainee => trainee.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_REGISTER_TRAINEE_ATTENDANCE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_REGISTER_TRAINEE_ATTENDANCE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    default:
      return state;
  }
};

export default regTraineesAttendance;
