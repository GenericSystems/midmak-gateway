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
  GET_NON_ACTIVE_CURRS,
  GET_NON_ACTIVE_CURRS_SUCCESS,
  GET_NON_ACTIVE_CURRS_FAIL,
  UPDATE_NON_ACTIVE_CURR,
  UPDATE_NON_ACTIVE_CURR_SUCCESS,
  UPDATE_NON_ACTIVE_CURR_FAIL,
  DELETE_NON_ACTIVE_CURR,
  DELETE_NON_ACTIVE_CURR_SUCCESS,
  DELETE_NON_ACTIVE_CURR_FAIL,
  GET_TRAINEE_SCHEDULES,
  GET_TRAINEE_SCHEDULES_SUCCESS,
  GET_TRAINEE_SCHEDULES_FAIL,
  DELETE_ALL_NON_ACTIVE_CURR,
  DELETE_ALL_NON_ACTIVE_CURR_SUCCESS,
  DELETE_ALL_NON_ACTIVE_CURR_FAIL,
  GET_ACHIEVED_COURSES,
  GET_ACHIEVED_COURSES_FAIL,
  GET_ACHIEVED_COURSES_SUCCESS,
  SAVE_ALL_NON_ACTIVE_CURR,
  SAVE_ALL_NON_ACTIVE_CURR_SUCCESS,
  SAVE_ALL_NON_ACTIVE_CURR_FAIL,
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

// export const getStudentRegisterInfo = traineeId => ({
//   type: GET_STUDENT_REGISTER_INFO,
//   payload: traineeId,
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
export const getNonActiveCurr = (active, traineeId) => ({
  type: GET_NON_ACTIVE_CURRS,
  payload: {
    active,
    traineeId,
  },
});

export const getNonActiveCurrSuccess = nonActiveCurr => ({
  type: GET_NON_ACTIVE_CURRS_SUCCESS,
  payload: nonActiveCurr,
});

export const getNonActiveCurrFail = error => ({
  type: GET_NON_ACTIVE_CURRS_FAIL,
  payload: error,
});

export const updateNonActiveCurr = (nonActiveCurr, active) => ({
  type: UPDATE_NON_ACTIVE_CURR,
  payload: { nonActiveCurr, active },
});

export const updateNonActiveCurrSuccess = nonActiveCurr => ({
  type: UPDATE_NON_ACTIVE_CURR_SUCCESS,
  payload: nonActiveCurr,
});

export const updateNonActiveCurrFail = error => ({
  type: UPDATE_NON_ACTIVE_CURR_FAIL,
  payload: error,
});

export const deleteNonActiveCurr = nonActiveCurr => ({
  type: DELETE_NON_ACTIVE_CURR,
  payload: nonActiveCurr,
});

export const deleteNonActiveCurrSuccess = nonActiveCurr => ({
  type: DELETE_NON_ACTIVE_CURR_SUCCESS,
  payload: nonActiveCurr,
});

export const deleteNonActiveCurrFail = error => ({
  type: DELETE_NON_ACTIVE_CURR_FAIL,
  payload: error,
});

export const getTraineeSchedules = traineeId => ({
  type: GET_TRAINEE_SCHEDULES,
  payload: { traineeId },
});

export const getTraineeSchedulesSuccess = traineeSchedules => ({
  type: GET_TRAINEE_SCHEDULES_SUCCESS,
  payload: traineeSchedules,
});

export const getTraineeSchedulesFail = error => ({
  type: GET_TRAINEE_SCHEDULES_FAIL,
  payload: error,
});

export const deleteAllNonActiveCurr = nonActiveCurr => ({
  type: DELETE_ALL_NON_ACTIVE_CURR,
  payload: nonActiveCurr,
});

export const deleteAllNonActiveCurrSuccess = nonActiveCurr => ({
  type: DELETE_ALL_NON_ACTIVE_CURR_SUCCESS,
  payload: nonActiveCurr,
});

export const deleteAllNonActiveCurrFail = error => ({
  type: DELETE_ALL_NON_ACTIVE_CURR_FAIL,
  payload: error,
});

export const saveAllNonActiveCurr = nonActiveCurr => ({
  type: SAVE_ALL_NON_ACTIVE_CURR,
  payload: nonActiveCurr,
});

export const saveAllNonActiveCurrSuccess = nonActiveCurr => ({
  type: SAVE_ALL_NON_ACTIVE_CURR_SUCCESS,
  payload: nonActiveCurr,
});

export const saveAllNonActiveCurrFail = error => ({
  type: SAVE_ALL_NON_ACTIVE_CURR_FAIL,
  payload: error,
});

export const getAchievedCourses = traineeId => ({
  type: GET_ACHIEVED_COURSES,
  payload: { traineeId },
});

export const getAchievedCoursesSuccess = achievedCourse => ({
  type: GET_ACHIEVED_COURSES_SUCCESS,
  payload: achievedCourse,
});

export const getAchievedCoursesFail = error => ({
  type: GET_ACHIEVED_COURSES_FAIL,
  payload: error,
});
