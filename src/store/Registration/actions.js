import {
  GET_REGISTRATIONS,
  GET_REGISTRATIONS_SUCCESS,
  GET_REGISTRATIONS_FAIL,
  ADD_NEW_REGISTRATION,
  ADD_REGISTRATION_SUCCESS,
  ADD_REGISTRATION_FAIL,
  UPDATE_REGISTRATION,
  UPDATE_REGISTRATION_SUCCESS,
  UPDATE_REGISTRATION_FAIL,
  DELETE_REGISTRATION,
  DELETE_REGISTRATION_SUCCESS,
  DELETE_REGISTRATION_FAIL,
  // GET_STUDENT_REGISTER_INFO,
  // GET_STUDENT_REGISTER_INFO_SUCCESS,
  // GET_STUDENT_REGISTER_INFO_FAIL,
  GET_AVAILABLE_COURSES,
  GET_AVAILABLE_COURSES_FAIL,
  GET_AVAILABLE_COURSES_SUCCESS,
  ADD_NEW_AVAILABLE_COURSE,
  ADD_AVAILABLE_COURSE_SUCCESS,
  ADD_AVAILABLE_COURSE_FAIL,
  GET_NON_ACTIVE_STD_CURRS,
  GET_NON_ACTIVE_STD_CURRS_SUCCESS,
  GET_NON_ACTIVE_STD_CURRS_FAIL,
  UPDATE_NON_ACTIVE_STD_CURR,
  UPDATE_NON_ACTIVE_STD_CURR_SUCCESS,
  UPDATE_NON_ACTIVE_STD_CURR_FAIL,
  DELETE_NON_ACTIVE_STD_CURR,
  DELETE_NON_ACTIVE_STD_CURR_SUCCESS,
  DELETE_NON_ACTIVE_STD_CURR_FAIL,
  GET_TEMP_STD_SCHEDULES,
  GET_TEMP_STD_SCHEDULES_SUCCESS,
  GET_TEMP_STD_SCHEDULES_FAIL,
  DELETE_ALL_NON_ACTIVE_STD_CURR,
  DELETE_ALL_NON_ACTIVE_STD_CURR_SUCCESS,
  DELETE_ALL_NON_ACTIVE_STD_CURR_FAIL,
  GET_ACHIEVED_COURSES,
  GET_ACHIEVED_COURSES_FAIL,
  GET_ACHIEVED_COURSES_SUCCESS,
  SAVE_ALL_NON_ACTIVE_STD_CURR,
  SAVE_ALL_NON_ACTIVE_STD_CURR_SUCCESS,
  SAVE_ALL_NON_ACTIVE_STD_CURR_FAIL,
} from "./actionTypes";

export const getRegistrations = () => ({
  type: GET_REGISTRATIONS,
});

export const getRegistrationsSuccess = registrations => ({
  type: GET_REGISTRATIONS_SUCCESS,
  payload: registrations,
});

export const getRegistrationsFail = error => ({
  type: GET_REGISTRATIONS_FAIL,
  payload: error,
});

// export const getStudentRegisterInfo = studentId => ({
//   type: GET_STUDENT_REGISTER_INFO,
//   payload: studentId,
// });

// export const getStudentRegisterInfoSuccess = studentRegisterInfos => ({
//   type: GET_STUDENT_REGISTER_INFO_SUCCESS,
//   payload: studentRegisterInfos,
// });

// export const getStudentRegisterInfoFail = error => ({
//   type: GET_STUDENT_REGISTER_INFO_FAIL,
//   payload: error,
// });

export const addNewRegistration = registration => ({
  type: ADD_NEW_REGISTRATION,
  payload: registration,
});

export const addRegistrationSuccess = registration => ({
  type: ADD_REGISTRATION_SUCCESS,
  payload: registration,
});

export const addRegistrationFail = error => ({
  type: ADD_REGISTRATION_FAIL,
  payload: error,
});

export const updateRegistration = registration => ({
  type: UPDATE_REGISTRATION,
  payload: registration,
});

export const updateRegistrationSuccess = registration => ({
  type: UPDATE_REGISTRATION_SUCCESS,
  payload: registration,
});

export const updateRegistrationFail = error => ({
  type: UPDATE_REGISTRATION_FAIL,
  payload: error,
});

export const deleteRegistration = registration => ({
  type: DELETE_REGISTRATION,
  payload: registration,
});

export const deleteRegistrationSuccess = registration => ({
  type: DELETE_REGISTRATION_SUCCESS,
  payload: registration,
});

export const deleteRegistrationFail = error => ({
  type: DELETE_REGISTRATION_FAIL,
  payload: error,
});

export const getAvailableCourses = traineeId => ({
  type: GET_AVAILABLE_COURSES,
  payload: {
    traineeId,
  },
});

export const getAvailableCourseSuccess = availableCourse => ({
  type: GET_AVAILABLE_COURSES_SUCCESS,
  payload: availableCourse,
});

export const getAvailableCourseFail = error => ({
  type: GET_AVAILABLE_COURSES_FAIL,
  payload: error,
});
export const addNewAvailableCourse = availableCourse => ({
  type: ADD_NEW_AVAILABLE_COURSE,
  payload: availableCourse,
});

export const addAvailableCourseSuccess = availableCourse => ({
  type: ADD_AVAILABLE_COURSE_SUCCESS,
  payload: availableCourse,
});

export const addAvailableCourseFail = error => ({
  type: ADD_AVAILABLE_COURSE_FAIL,
  payload: error,
});
export const getNonActiveStdCurr = (active, traineeId) => ({
  type: GET_NON_ACTIVE_STD_CURRS,
  payload: {
    active,
    traineeId,
  },
});

export const getNonActiveStdCurrSuccess = nonActiveStdCurr => ({
  type: GET_NON_ACTIVE_STD_CURRS_SUCCESS,
  payload: nonActiveStdCurr,
});

export const getNonActiveStdCurrFail = error => ({
  type: GET_NON_ACTIVE_STD_CURRS_FAIL,
  payload: error,
});

export const updateNonActiveStdCurr = (nonActiveStdCurr, active) => ({
  type: UPDATE_NON_ACTIVE_STD_CURR,
  payload: { nonActiveStdCurr, active },
});

export const updateNonActiveStdCurrSuccess = nonActiveStdCurr => ({
  type: UPDATE_NON_ACTIVE_STD_CURR_SUCCESS,
  payload: nonActiveStdCurr,
});

export const updateNonActiveStdCurrFail = error => ({
  type: UPDATE_NON_ACTIVE_STD_CURR_FAIL,
  payload: error,
});

export const deleteNonActiveStdCurr = nonActiveStdCurr => ({
  type: DELETE_NON_ACTIVE_STD_CURR,
  payload: nonActiveStdCurr,
});

export const deleteNonActiveStdCurrSuccess = nonActiveStdCurr => ({
  type: DELETE_NON_ACTIVE_STD_CURR_SUCCESS,
  payload: nonActiveStdCurr,
});

export const deleteNonActiveStdCurrFail = error => ({
  type: DELETE_NON_ACTIVE_STD_CURR_FAIL,
  payload: error,
});

export const getTempStdSchedules = studentId => ({
  type: GET_TEMP_STD_SCHEDULES,
  payload: { studentId },
});

export const getTempStdSchedulesSuccess = tempStdSchedules => ({
  type: GET_TEMP_STD_SCHEDULES_SUCCESS,
  payload: tempStdSchedules,
});

export const getTempStdSchedulesFail = error => ({
  type: GET_TEMP_STD_SCHEDULES_FAIL,
  payload: error,
});

export const deleteAllNonActiveStdCurr = nonActiveStdCurr => ({
  type: DELETE_ALL_NON_ACTIVE_STD_CURR,
  payload: nonActiveStdCurr,
});

export const deleteAllNonActiveStdCurrSuccess = nonActiveStdCurr => ({
  type: DELETE_ALL_NON_ACTIVE_STD_CURR_SUCCESS,
  payload: nonActiveStdCurr,
});

export const deleteAllNonActiveStdCurrFail = error => ({
  type: DELETE_ALL_NON_ACTIVE_STD_CURR_FAIL,
  payload: error,
});

export const saveAllNonActiveStdCurr = nonActiveStdCurr => ({
  type: SAVE_ALL_NON_ACTIVE_STD_CURR,
  payload: nonActiveStdCurr,
});

export const saveAllNonActiveStdCurrSuccess = nonActiveStdCurr => ({
  type: SAVE_ALL_NON_ACTIVE_STD_CURR_SUCCESS,
  payload: nonActiveStdCurr,
});

export const saveAllNonActiveStdCurrFail = error => ({
  type: SAVE_ALL_NON_ACTIVE_STD_CURR_FAIL,
  payload: error,
});

export const getAchievedCourses = studentId => ({
  type: GET_ACHIEVED_COURSES,
  payload: { studentId },
});

export const getAchievedCoursesSuccess = achievedCourse => ({
  type: GET_ACHIEVED_COURSES_SUCCESS,
  payload: achievedCourse,
});

export const getAchievedCoursesFail = error => ({
  type: GET_ACHIEVED_COURSES_FAIL,
  payload: error,
});
