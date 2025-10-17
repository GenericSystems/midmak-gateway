import {
  GET_EXAM_ATTENDANCE_OBSERVERS,
  GET_EXAM_ATTENDANCE_OBSERVERS_FAIL,
  GET_EXAM_ATTENDANCE_OBSERVERS_SUCCESS,
  GET_ATTEND_STATUS,
  GET_ATTEND_STATUS_FAIL,
  GET_ATTEND_STATUS_SUCCESS,
  ADD_NEW_EXAM_ATTENDANCE_OBSERVER,
  ADD_EXAM_ATTENDANCE_OBSERVER_SUCCESS,
  ADD_EXAM_ATTENDANCE_OBSERVER_FAIL,
  UPDATE_EXAM_ATTENDANCE_OBSERVER,
  UPDATE_EXAM_ATTENDANCE_OBSERVER_SUCCESS,
  UPDATE_EXAM_ATTENDANCE_OBSERVER_FAIL,
  DELETE_EXAM_ATTENDANCE_OBSERVER,
  DELETE_EXAM_ATTENDANCE_OBSERVER_SUCCESS,
  DELETE_EXAM_ATTENDANCE_OBSERVER_FAIL,
  GET_EXAM_ATTENDANCE_OBSERVER_DELETED_VALUE,
  GET_EXAM_ATTENDANCE_OBSERVER_DELETED_VALUE_FAIL,
  GET_EXAM_ATTENDANCE_OBSERVER_DELETED_VALUE_SUCCESS,
} from "./actionTypes";

export const getExamAttendanceObservers = () => ({
  type: GET_EXAM_ATTENDANCE_OBSERVERS,
  // payload: examsAttendance,
});

export const getExamAttendanceObserversSuccess = attendanceObservers => ({
  type: GET_EXAM_ATTENDANCE_OBSERVERS_SUCCESS,
  payload: attendanceObservers,
});

export const getExamAttendanceObserversFail = error => ({
  type: GET_EXAM_ATTENDANCE_OBSERVERS_FAIL,
  payload: error,
});

export const addNewExamAttendanceObserver = attendanceObserver => ({
  type: ADD_NEW_EXAM_ATTENDANCE_OBSERVER,
  payload: attendanceObserver,
});

export const addExamAttendanceObserverSuccess = attendanceObserver => ({
  type: ADD_EXAM_ATTENDANCE_OBSERVER_SUCCESS,
  payload: attendanceObserver,
});

export const addExamAttendanceObserverFail = error => ({
  type: ADD_EXAM_ATTENDANCE_OBSERVER_FAIL,
  payload: error,
});

export const updateExamAttendanceObserver = attendanceObserver => {
  return {
    type: UPDATE_EXAM_ATTENDANCE_OBSERVER,
    payload: examAttendance,
  };
};

export const updateExamAttendanceObserverSuccess = examAttendance => ({
  type: UPDATE_EXAM_ATTENDANCE_OBSERVER_SUCCESS,
  payload: attendanceObserver,
});

export const updateExamAttendanceObserverFail = error => ({
  type: UPDATE_EXAM_ATTENDANCE_OBSERVER_FAIL,
  payload: error,
});

export const deleteExamAttendanceObserver = attendanceObserver => ({
  type: DELETE_EXAM_ATTENDANCE_OBSERVER,
  payload: attendanceObserver,
});

export const deleteExamAttendanceObserverSuccess = attendanceObserver => ({
  type: DELETE_EXAM_ATTENDANCE_OBSERVER_SUCCESS,
  payload: attendanceObserver,
});

export const deleteExamAttendanceObserverFail = error => ({
  type: DELETE_EXAM_ATTENDANCE_OBSERVER_FAIL,
  payload: error,
});

export const getExamAttendanceObserverDeletedValue = () => ({
  type: GET_EXAM_ATTENDANCE_OBSERVER_DELETED_VALUE,
});

export const getExamAttendanceObserverDeletedValueSuccess = deleted => ({
  type: GET_EXAM_ATTENDANCE_OBSERVER_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getExamAttendanceObserverDeletedValueFail = error => ({
  type: GET_EXAM_ATTENDANCE_OBSERVER_DELETED_VALUE_FAIL,
  payload: error,
});

// export const getAttendStatus = () => ({
//   type: GET_ATTEND_STATUS,
//   // payload: examsAttendance,
// });

// export const getAttendStatusSuccess = attendStatus => ({
//   type: GET_ATTEND_STATUS_SUCCESS,
//   payload: attendStatus,
// });

// export const getAttendStatusFail = error => ({
//   type: GET_ATTEND_STATUS_FAIL,
//   payload: error,
// });
