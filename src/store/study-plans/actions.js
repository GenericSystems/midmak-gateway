import {
  GET_STUDY_PLANS,
  GET_STUDY_PLANS_FAIL,
  GET_STUDY_PLANS_SUCCESS,
  GET_STUDY_PLAN_PROFILE,
  GET_STUDY_PLAN_PROFILE_FAIL,
  GET_STUDY_PLAN_PROFILE_SUCCESS,
  ADD_NEW_STUDY_PLAN,
  ADD_STUDY_PLAN_SUCCESS,
  ADD_STUDY_PLAN_FAIL,
  UPDATE_STUDY_PLAN,
  UPDATE_STUDY_PLAN_SUCCESS,
  UPDATE_STUDY_PLAN_FAIL,
  DELETE_STUDY_PLAN,
  DELETE_STUDY_PLAN_SUCCESS,
  DELETE_STUDY_PLAN_FAIL,
  GET_FILTERED_COURSES,
  GET_FILTERED_COURSES_SUCCESS,
  GET_FILTERED_COURSES_FAIL,
  GET_PLAN_HOURS,
  GET_PLAN_HOURS_SUCCESS,
  GET_PLAN_HOURS_FAIL,
  ADD_NEW_PLAN_HOUR,
  ADD_PLAN_HOUR_SUCCESS,
  ADD_PLAN_HOUR_FAIL,
  UPDATE_PLAN_HOUR,
  UPDATE_PLAN_HOUR_SUCCESS,
  UPDATE_PLAN_HOUR_FAIL,
  GENERALIZE_STUDY_PLANS,
  GENERALIZE_STUDY_PLANS_SUCCESS,
  GENERALIZE_STUDY_PLANS_FAIL,
  GET_ALL_STUDY_PLANS,
GET_ALL_STUDY_PLANS_SUCCESS,
GET_ALL_STUDY_PLANS_FAIL,
} from "./actionTypes";

export const getStudyPlans = (faculty, planId, userTypeId) => ({
  type: GET_STUDY_PLANS,
  payload: {
    faculty,
    planId,
    userTypeId,
  },
});

export const getStudyPlansSuccess = studyPlans => ({
  type: GET_STUDY_PLANS_SUCCESS,
  payload: studyPlans,
});

export const getStudyPlansFail = error => ({
  type: GET_STUDY_PLANS_FAIL,
  payload: error,
});

export const getStudyPlanProfile = studyPlanId => ({
  type: GET_STUDY_PLAN_PROFILE,
  studyPlanId,
});

export const getStudyPlanProfileSuccess = studyPlanProfiles => ({
  type: GET_STUDY_PLAN_PROFILE_SUCCESS,
  payload: studyPlanProfiles,
});

export const getStudyPlanProfileFail = error => ({
  type: GET_STUDY_PLAN_PROFILE_FAIL,
  payload: error,
});

export const addNewStudyPlan = studyPlan => ({
  type: ADD_NEW_STUDY_PLAN,
  payload: studyPlan,
});

export const addStudyPlanSuccess = studyPlan => ({
  type: ADD_STUDY_PLAN_SUCCESS,
  payload: studyPlan,
});

export const addStudyPlanFail = error => ({
  type: ADD_STUDY_PLAN_FAIL,
  payload: error,
});

export const updateStudyPlan = studyPlan => ({
  type: UPDATE_STUDY_PLAN,
  payload: studyPlan,
});

export const updateStudyPlanSuccess = studyPlan => ({
  type: UPDATE_STUDY_PLAN_SUCCESS,
  payload: studyPlan,
});

export const updateStudyPlanFail = error => ({
  type: UPDATE_STUDY_PLAN_FAIL,
  payload: error,
});

export const deleteStudyPlan = studyPlan => ({
  type: DELETE_STUDY_PLAN,
  payload: studyPlan,
});

export const deleteStudyPlanSuccess = studyPlan => ({
  type: DELETE_STUDY_PLAN_SUCCESS,
  payload: studyPlan,
});

export const deleteStudyPlanFail = error => ({
  type: DELETE_STUDY_PLAN_FAIL,
  payload: error,
});

export const getFilteredCourses = faculty => ({
  type: GET_FILTERED_COURSES,
  payload: {
    faculty,
  },
});

export const getFilteredCoursesSuccess = studyPlans => ({
  type: GET_FILTERED_COURSES_SUCCESS,
  payload: studyPlans,
});

export const getFilteredCoursesFail = error => ({
  type: GET_FILTERED_COURSES_FAIL,
  payload: error,
});

export const getPlanHours = (faculty, planId, userTypeId) => ({
  type: GET_PLAN_HOURS,
  payload: {
    faculty,
    planId,
    userTypeId,
  },
});

export const getPlanHoursSuccess = planHours => ({
  type: GET_PLAN_HOURS_SUCCESS,
  payload: planHours,
});

export const getPlanHoursFail = error => ({
  type: GET_PLAN_HOURS_FAIL,
  payload: error,
});

export const addNewPlanHour = planHour => ({
  type: ADD_NEW_PLAN_HOUR,
  payload: planHour,
});

export const addPlanHourSuccess = planHour => ({
  type: ADD_PLAN_HOUR_SUCCESS,
  payload: planHour,
});

export const addPlanHourFail = error => ({
  type: ADD_PLAN_HOUR_FAIL,
  payload: error,
});

export const updatePlanHour = planHour => ({
  type: UPDATE_PLAN_HOUR,
  payload: planHour,
});

export const updatePlanHourSuccess = planHour => ({
  type: UPDATE_PLAN_HOUR_SUCCESS,
  payload: planHour,
});

export const updatePlanHourFail = error => ({
  type: UPDATE_PLAN_HOUR_FAIL,
  payload: error,
});

export const generalizeStudyPlans = (faculty, planId, userTypeId) => ({
  type: GENERALIZE_STUDY_PLANS,
  payload: {
    faculty,
    planId,
    userTypeId,
  },
});

export const generalizeStudyPlansSuccess = studyPlans => ({
  type: GENERALIZE_STUDY_PLANS_SUCCESS,
  payload: studyPlans,
});

export const generalizeStudyPlansFail = error => ({
  type: GENERALIZE_STUDY_PLANS_FAIL,
  payload: error,
});

export const getAllStudyPlans = (faculty, planId, userTypeId) => ({
  type: GET_ALL_STUDY_PLANS,
  payload: {
    faculty,
    planId,
    userTypeId,
  },
});

export const getAllStudyPlansSuccess = studyPlans => ({
  type: GET_ALL_STUDY_PLANS_SUCCESS,
  payload: studyPlans,
});

export const getAllStudyPlansFail = error => ({
  type: GET_ALL_STUDY_PLANS_FAIL,
  payload: error,
});
