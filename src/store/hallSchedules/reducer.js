import {
  GET_HALL_SCHEDULES_SUCCESS,
  GET_HALL_SCHEDULES_FAIL,
  ADD_HALL_SCHEDULE_SUCCESS,
  ADD_HALL_SCHEDULE_FAIL,
  UPDATE_HALL_SCHEDULE_SUCCESS,
  UPDATE_HALL_SCHEDULE_FAIL,
  DELETE_HALL_SCHEDULE_SUCCESS,
  DELETE_HALL_SCHEDULE_FAIL,
  GET_HALL_SCHEDULE_DELETED_VALUE_SUCCESS,
  GET_HALL_SCHEDULE_DELETED_VALUE_FAIL,
  GET_ATTEND_STATUS_SUCCESS,
  GET_ATTEND_STATUS_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  hallSchedules: [],
  error: {},
};

const hallSchedules = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_HALL_SCHEDULES_SUCCESS:
      return {
        ...state,
        hallSchedules: action.payload,
        deleted: {},
      };

    case GET_HALL_SCHEDULES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_HALL_SCHEDULE_SUCCESS:
      return {
        ...state,
        hallSchedules: [...state.hallSchedules, action.payload],
      };

    case ADD_HALL_SCHEDULE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_HALL_SCHEDULE_SUCCESS:
      return {
        ...state,
        hallSchedules: state.hallSchedules.map(hallSchedule =>
          hallSchedule.Id.toString() === action.payload.Id.toString()
            ? { hallSchedule, ...action.payload }
            : hallSchedule
        ),
      };

    case UPDATE_HALL_SCHEDULE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_HALL_SCHEDULE_SUCCESS:
      return {
        ...state,
        hallSchedules: state.hallSchedules.filter(
          hallSchedule => hallSchedule.Id !== action.payload.Id
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_HALL_SCHEDULE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_HALL_SCHEDULE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    case GET_HALL_SCHEDULE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_ATTEND_STATUS_SUCCESS:
      return {
        ...state,
        attendStatus: action.payload,
        deleted: {},
      };

    case GET_ATTEND_STATUS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default hallSchedules;
