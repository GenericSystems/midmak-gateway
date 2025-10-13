import {
  GET_TRAINEES_DECREES,
  GET_TRAINEES_DECREES_SUCCESS,
  GET_TRAINEES_DECREES_FAIL,
  ADD_NEW_TRAINEES_DECREES,
  ADD_TRAINEES_DECREES_SUCCESS,
  ADD_TRAINEES_DECREES_FAIL,
  UPDATE_TRAINEES_DECREES,
  UPDATE_TRAINEES_DECREES_SUCCESS,
  UPDATE_TRAINEES_DECREES_FAIL,
  DELETE_TRAINEES_DECREES,
  DELETE_TRAINEES_DECREES_SUCCESS,
  DELETE_TRAINEES_DECREES_FAIL,
  GET_TRAINEES_DECREES_DELETED_VALUE,
  GET_TRAINEES_DECREES_DELETED_VALUE_FAIL,
  GET_TRAINEES_DECREES_DELETED_VALUE_SUCCESS,
  GET_FILTERED_COURSES_PLANS,
  GET_FILTERED_COURSES_PLANS_SUCCESS,
  GET_FILTERED_COURSES_PLANS_FAIL,
  GET_ACADEMY_TRAINEES_DECREE,
  GET_ACADEMY_TRAINEES_DECREE_SUCCESS,
  GET_ACADEMY_TRAINEES_DECREE_FAIL,
  GET_COURSES_DECREES,
  GET_COURSES_DECREES_FAIL,
  GET_COURSES_DECREES_SUCCESS,
  GET_DECREE_STATUS,
  GET_DECREE_STATUS_SUCCESS,
  GET_DECREE_STATUS_FAIL,
  GET_TRAINEE_DECREES_DISMISS,
  GET_TRAINEE_DECREES_DISMISS_SUCCESS,
  GET_TRAINEE_DECREES_DISMISS_FAIL,
} from "./actionTypes";

export const getTraineesDecrees = () => ({
  type: GET_TRAINEES_DECREES,
});

export const getTraineesDecreesSuccess = traineesDecrees => ({
  type: GET_TRAINEES_DECREES_SUCCESS,
  payload: traineesDecrees,
});

export const getTraineesDecreesFail = error => ({
  type: GET_TRAINEES_DECREES_FAIL,
  payload: error,
});

export const addNewTraineesDecree = traineesDecree => ({
  type: ADD_NEW_TRAINEES_DECREES,
  payload: traineesDecree,
});

export const addTraineesDecreeSuccess = traineesDecree => ({
  type: ADD_TRAINEES_DECREES_SUCCESS,
  payload: traineesDecree,
});

export const addTraineesDecreeFail = error => ({
  type: ADD_TRAINEES_DECREES_FAIL,
  payload: error,
});
export const updateTraineesDecree = traineesDecree => {
  return {
    type: UPDATE_TRAINEES_DECREES,
    payload: traineesDecree,
  };
};

export const updateTraineesDecreeSuccess = traineesDecree => ({
  type: UPDATE_TRAINEES_DECREES_SUCCESS,
  payload: traineesDecree,
});

export const updateTraineesDecreeFail = error => ({
  type: UPDATE_TRAINEES_DECREES_FAIL,
  payload: error,
});
export const deleteTraineesDecree = traineesDecree => ({
  type: DELETE_TRAINEES_DECREES,
  payload: traineesDecree,
});
export const deleteTraineesDecreeSuccess = traineesDecree => ({
  type: DELETE_TRAINEES_DECREES_SUCCESS,
  payload: traineesDecree,
});
export const deleteTraineesDecreeFail = error => ({
  type: DELETE_TRAINEES_DECREES_FAIL,
  payload: error,
});

export const getTraineesDecreeDeletedValue = () => ({
  type: GET_TRAINEES_DECREES_DELETED_VALUE,
});

export const getTraineesDecreeDeletedValueSuccess = deleted => ({
  type: GET_TRAINEES_DECREES_DELETED_VALUE_SUCCESS,
  payload: deleted,
});

export const getTraineesDecreeDeletedValueFail = error => ({
  type: GET_TRAINEES_DECREES_DELETED_VALUE_FAIL,
  payload: error,
});

export const getFilteredCoursesPlans = plan => ({
  type: GET_FILTERED_COURSES_PLANS,
  payload: plan,
});

export const getFilteredCoursesPlansSuccess = coursesPlan => ({
  type: GET_FILTERED_COURSES_PLANS_SUCCESS,
  payload: coursesPlan,
});

export const getFilteredCoursesPlansFail = error => ({
  type: GET_FILTERED_COURSES_PLANS_FAIL,
  payload: error,
});

export const getAcademyTraineesDecrees = () => ({
  type: GET_ACADEMY_TRAINEES_DECREE,
});

export const getAcademyTraineesDecreesSuccess = trainees => ({
  type: GET_ACADEMY_TRAINEES_DECREE_SUCCESS,
  payload: trainees,
});

export const getAcademyTraineesDecreesFail = error => ({
  type: GET_ACADEMY_TRAINEES_DECREE_FAIL,
  payload: error,
});

export const getCoursesDecrees = plan => ({
  type: GET_COURSES_DECREES,
  payload: plan,
});

export const getCoursesDecreesSuccess = coursesPlan => ({
  type: GET_COURSES_DECREES_SUCCESS,
  payload: coursesPlan,
});

export const getCoursesDecreesFail = error => ({
  type: GET_COURSES_DECREES_FAIL,
  payload: error,
});

export const getDecreeStatus = () => ({
  type: GET_DECREE_STATUS,
});

export const getDecreeStatusSuccess = traineesDecrees => ({
  type: GET_DECREE_STATUS_SUCCESS,
  payload: traineesDecrees,
});

export const getDecreeStatusFail = error => ({
  type: GET_DECREE_STATUS_FAIL,
  payload: error,
});

export const getTraineeDecreesDismiss = traineeDecreesDismiss => ({
  type: GET_TRAINEE_DECREES_DISMISS,
  payload: traineeDecreesDismiss,
});

export const getTraineeDecreesDismissSuccess = traineeDecreesDismiss => ({
  type: GET_TRAINEE_DECREES_DISMISS_SUCCESS,
  payload: traineeDecreesDismiss,
});

export const getTraineeDecreesDismissFail = error => ({
  type: GET_TRAINEE_DECREES_DISMISS_FAIL,
  payload: error,
});
