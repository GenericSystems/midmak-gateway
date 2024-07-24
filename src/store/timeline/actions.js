import {
  GET_TIMELINE_DELETED_VALUE,
  GET_TIMELINE_DELETED_VALUE_FAIL,
  GET_TIMELINE_DELETED_VALUE_SUCCESS,
  GET_TIMELINES,
  GET_TIMELINES_FAIL,
  GET_TIMELINES_SUCCESS,
  ADD_NEW_TIMELINE,
  ADD_TIMELINE_SUCCESS,
  ADD_TIMELINE_FAIL,
  UPDATE_TIMELINE,
  UPDATE_TIMELINE_SUCCESS,
  UPDATE_TIMELINE_FAIL,
  DELETE_TIMELINE,
  DELETE_TIMELINE_SUCCESS,
  DELETE_TIMELINE_FAIL,
  GET_REQUEST_PERIOD_ALLOWANCE,
  GET_REQUEST_PERIOD_ALLOWANCE_SUCCESS,
  GET_REQUEST_PERIOD_ALLOWANCE_FAIL,
  GET_REQUEST_PERIOD_ALLOWANCE_TIME,
  GET_REQUEST_PERIOD_ALLOWANCE_TIME_SUCCESS,
  GET_REQUEST_PERIOD_ALLOWANCE_TIME_FAIL,
  UPDATE_REQUEST_PERIOD_ALLOWANCE_TIME,
  UPDATE_REQUEST_PERIOD_ALLOWANCE_TIME_SUCCESS,
  UPDATE_REQUEST_PERIOD_ALLOWANCE_TIME_FAIL,
  GENERALIZE_REQUEST_PERIOD_ALLOWANCE_TIME,
  GENERALIZE_REQUEST_PERIOD_ALLOWANCE_TIME_SUCCESS,
  GENERALIZE_REQUEST_PERIOD_ALLOWANCE_TIME_FAIL,
  GET_REQUEST_PERIOD_PERMISSION,
  GET_REQUEST_PERIOD_PERMISSION_SUCCESS,
  GET_REQUEST_PERIOD_PERMISSION_FAIL,
  ADD_REQUEST_PERIOD_PERMISSION,
  ADD_REQUEST_PERIOD_PERMISSION_SUCCESS,
  ADD_REQUEST_PERIOD_PERMISSION_FAIL,
  UPDATE_REQUEST_PERIOD_PERMISSION,
  UPDATE_REQUEST_PERIOD_PERMISSION_SUCCESS,
  UPDATE_REQUEST_PERIOD_PERMISSION_FAIL,
  DELETE_REQUEST_PERIOD_PERMISSION,
  DELETE_REQUEST_PERIOD_PERMISSION_SUCCESS,
  DELETE_REQUEST_PERIOD_PERMISSION_FAIL,
} from "./actionTypes";

export const getTimeLines = () => ({
  type: GET_TIMELINES,
});

export const getTimeLinesSuccess = timeLines => ({
  type: GET_TIMELINES_SUCCESS,
  payload: timeLines,
});

export const getTimeLinesFail = error => ({
  type: GET_TIMELINES_FAIL,
  payload: error,
});

export const getTimeLineDeletedValue = () => ({
  type: GET_TIMELINE_DELETED_VALUE,
});

export const getTimeLineDeletedValueSuccess = deleted => ({
  type: GET_TIMELINE_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getTimeLineDeletedValueFail = error => ({
  type: GET_TIMELINE_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewTimeLine = timeLine => ({
  type: ADD_NEW_TIMELINE,
  payload: timeLine,
});

export const addTimeLineSuccess = timeLine => ({
  type: ADD_TIMELINE_SUCCESS,
  payload: timeLine,
});

export const addTimeLineFail = error => ({
  type: ADD_TIMELINE_FAIL,
  payload: error,
});

export const updateTimeLine = timeLine => {
  return {
    type: UPDATE_TIMELINE,
    payload: timeLine,
  };
};

export const updateTimeLineSuccess = timeLine => ({
  type: UPDATE_TIMELINE_SUCCESS,
  payload: timeLine,
});

export const updateTimeLineFail = error => ({
  type: UPDATE_TIMELINE_FAIL,
  payload: error,
});

export const deleteTimeLine = timeLine => ({
  type: DELETE_TIMELINE,
  payload: timeLine,
});

export const deleteTimeLineSuccess = timeLine => ({
  type: DELETE_TIMELINE_SUCCESS,
  payload: timeLine,
});

export const deleteTimeLineFail = error => ({
  type: DELETE_TIMELINE_FAIL,
  payload: error,
});

export const getRequestsPeriodAllowance = () => ({
  type: GET_REQUEST_PERIOD_ALLOWANCE,
});

export const getRequestsPeriodAllowanceSuccess = requestsPeriodAllowance => ({
  type: GET_REQUEST_PERIOD_ALLOWANCE_SUCCESS,
  payload: requestsPeriodAllowance,
});

export const getRequestsPeriodAllowanceFail = error => ({
  type: GET_REQUEST_PERIOD_ALLOWANCE_FAIL,
  payload: error,
});

export const getRequestsPeriodAllowanceTime = requestsPeriodAllowanceTime => ({
  type: GET_REQUEST_PERIOD_ALLOWANCE_TIME,
  payload: requestsPeriodAllowanceTime,
});

export const getRequestsPeriodAllowanceTimeSuccess =
  requestsPeriodAllowanceTime => ({
    type: GET_REQUEST_PERIOD_ALLOWANCE_TIME_SUCCESS,
    payload: requestsPeriodAllowanceTime,
  });

export const getRequestsPeriodAllowanceTimeFail = error => ({
  type: GET_REQUEST_PERIOD_ALLOWANCE_TIME_FAIL,
  payload: error,
});

export const updateRequestsPeriodAllowanceTime =
  requestsPeriodAllowanceTime => ({
    type: UPDATE_REQUEST_PERIOD_ALLOWANCE_TIME,
    payload: requestsPeriodAllowanceTime,
  });

export const updateRequestsPeriodAllowanceTimeSuccess =
  requestsPeriodAllowanceTime => ({
    type: UPDATE_REQUEST_PERIOD_ALLOWANCE_TIME_SUCCESS,
    payload: requestsPeriodAllowanceTime,
  });

export const updateRequestsPeriodAllowanceTimeFail = error => ({
  type: UPDATE_REQUEST_PERIOD_ALLOWANCE_TIME_FAIL,
  payload: error,
});

export const generalizeRequestsPeriodAllowanceTime =
  requestsPeriodAllowanceTime => ({
    type: GENERALIZE_REQUEST_PERIOD_ALLOWANCE_TIME,
    payload: requestsPeriodAllowanceTime,
  });

export const generalizeRequestsPeriodAllowanceTimeSuccess =
  requestsPeriodAllowanceTime => ({
    type: GENERALIZE_REQUEST_PERIOD_ALLOWANCE_TIME_SUCCESS,
    payload: requestsPeriodAllowanceTime,
  });

export const generalizeRequestsPeriodAllowanceTimeFail = error => ({
  type: GENERALIZE_REQUEST_PERIOD_ALLOWANCE_TIME_FAIL,
  payload: error,
});

export const getRequestsPeriodPermission = requestsPeriodPermission => ({
  type: GET_REQUEST_PERIOD_PERMISSION,
  payload: requestsPeriodPermission,
});

export const getRequestsPeriodPermissionSuccess = requestsPeriodPermission => ({
  type: GET_REQUEST_PERIOD_PERMISSION_SUCCESS,
  payload: requestsPeriodPermission,
});

export const getRequestsPeriodPermissionFail = error => ({
  type: GET_REQUEST_PERIOD_PERMISSION_FAIL,
  payload: error,
});

export const addRequestsPeriodPermission = requestsPeriodPermission => ({
  type: ADD_REQUEST_PERIOD_PERMISSION,
  payload: requestsPeriodPermission,
});

export const addRequestsPeriodPermissionSuccess = requestsPeriodPermission => ({
  type: ADD_REQUEST_PERIOD_PERMISSION_SUCCESS,
  payload: requestsPeriodPermission,
});

export const addRequestsPeriodPermissionFail = error => ({
  type: ADD_REQUEST_PERIOD_PERMISSION_FAIL,
  payload: error,
});

export const updateRequestsPeriodPermission = requestsPeriodPermission => ({
  type: UPDATE_REQUEST_PERIOD_PERMISSION,
  payload: requestsPeriodPermission,
});

export const updateRequestsPeriodPermissionSuccess =
  requestsPeriodPermission => ({
    type: UPDATE_REQUEST_PERIOD_PERMISSION_SUCCESS,
    payload: requestsPeriodPermission,
  });

export const updateRequestsPeriodPermissionFail = error => ({
  type: UPDATE_REQUEST_PERIOD_PERMISSION_FAIL,
  payload: error,
});

export const deleteRequestsPeriodPermission = requestsPeriodPermission => ({
  type: DELETE_REQUEST_PERIOD_PERMISSION,
  payload: requestsPeriodPermission,
});

export const deleteRequestsPeriodPermissionSuccess =
  requestsPeriodPermission => ({
    type: DELETE_REQUEST_PERIOD_PERMISSION_SUCCESS,
    payload: requestsPeriodPermission,
  });

export const deleteRequestsPeriodPermissionFail = error => ({
  type: DELETE_REQUEST_PERIOD_PERMISSION_FAIL,
  payload: error,
});
