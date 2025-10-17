import {
  GET_HALL_SCHEDULES,
  GET_HALL_SCHEDULES_FAIL,
  GET_HALL_SCHEDULES_SUCCESS,
  ADD_NEW_HALL_SCHEDULE,
  ADD_HALL_SCHEDULE_SUCCESS,
  ADD_HALL_SCHEDULE_FAIL,
  UPDATE_HALL_SCHEDULE,
  UPDATE_HALL_SCHEDULE_SUCCESS,
  UPDATE_HALL_SCHEDULE_FAIL,
  DELETE_HALL_SCHEDULE,
  DELETE_HALL_SCHEDULE_SUCCESS,
  DELETE_HALL_SCHEDULE_FAIL,
  GET_HALL_SCHEDULE_DELETED_VALUE,
  GET_HALL_SCHEDULE_DELETED_VALUE_FAIL,
  GET_HALL_SCHEDULE_DELETED_VALUE_SUCCESS,
} from "./actionTypes";

export const getHallSchedules = () => ({
  type: GET_HALL_SCHEDULES,
  // payload: HallSchedules,
});

export const getHallSchedulesSuccess = hallSchedules => ({
  type: GET_HALL_SCHEDULES_SUCCESS,
  payload: hallSchedules,
});

export const getHallSchedulesFail = error => ({
  type: GET_HALL_SCHEDULES_FAIL,
  payload: error,
});

export const addNewHallSchedule = hallSchedule => ({
  type: ADD_NEW_HALL_SCHEDULE,
  payload: hallSchedule,
});

export const addHallScheduleSuccess = hallSchedule => ({
  type: ADD_HALL_SCHEDULE_SUCCESS,
  payload: hallSchedule,
});

export const addHallScheduleFail = error => ({
  type: ADD_HALL_SCHEDULE_FAIL,
  payload: error,
});

export const updateHallSchedule = hallSchedule => {
  return {
    type: UPDATE_HALL_SCHEDULE,
    payload: hallSchedule,
  };
};

export const updateHallScheduleSuccess = hallSchedule => ({
  type: UPDATE_HALL_SCHEDULE_SUCCESS,
  payload: hallSchedule,
});

export const updateHallScheduleFail = error => ({
  type: UPDATE_HALL_SCHEDULE_FAIL,
  payload: error,
});

export const deleteHallSchedule = hallSchedule => ({
  type: DELETE_HALL_SCHEDULE,
  payload: hallSchedule,
});

export const deleteHallScheduleSuccess = hallSchedule => ({
  type: DELETE_HALL_SCHEDULE_SUCCESS,
  payload: hallSchedule,
});

export const deleteHallScheduleFail = error => ({
  type: DELETE_HALL_SCHEDULE_FAIL,
  payload: error,
});

export const getHallScheduleDeletedValue = () => ({
  type: GET_HALL_SCHEDULE_DELETED_VALUE,
});

export const getHallScheduleDeletedValueSuccess = deleted => ({
  type: GET_HALL_SCHEDULE_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getHallScheduleDeletedValueFail = error => ({
  type: GET_HALL_SCHEDULE_DELETED_VALUE_FAIL,
  payload: error,
});
