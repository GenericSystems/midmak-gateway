import {
  GET_COURSE_OFFERING_PROFILE,
  GET_COURSE_OFFERING_PROFILE_FAIL,
  GET_COURSE_OFFERING_PROFILE_SUCCESS,
  GET_METHODS_OF_OFFERING_COURSES,
  GET_METHODS_OF_OFFERING_COURSES_FAIL,
  GET_METHODS_OF_OFFERING_COURSES_SUCCESS,
  GET_ALL_COURSES_OFFERING,
  GET_ALL_COURSES_OFFERING_FAIL,
  GET_ALL_COURSES_OFFERING_SUCCESS,
  GET_COURSES_OFFERING,
  GET_COURSES_OFFERING_FAIL,
  GET_COURSES_OFFERING_SUCCESS,
  ADD_NEW_COURSE_OFFERING,
  ADD_COURSE_OFFERING_SUCCESS,
  ADD_COURSE_OFFERING_FAIL,
  UPDATE_COURSE_OFFERING,
  UPDATE_COURSE_OFFERING_SUCCESS,
  UPDATE_COURSE_OFFERING_FAIL,
  DELETE_COURSE_OFFERING,
  DELETE_COURSE_OFFERING_SUCCESS,
  DELETE_COURSE_OFFERING_FAIL,
  GET_INSTRUCTORS,
  GET_INSTRUCTORS_FAIL,
  GET_INSTRUCTORS_SUCCESS,
  GET_SECTION_LAB_PROFILE,
  GET_SECTION_LAB_PROFILE_FAIL,
  GET_SECTION_LAB_PROFILE_SUCCESS,
  GET_SECTION_LABS,
  GET_SECTION_LABS_FAIL,
  GET_SECTION_LABS_SUCCESS,
  ADD_NEW_SECTION_LAB,
  ADD_SECTION_LAB_SUCCESS,
  ADD_SECTION_LAB_FAIL,
  ADD_NEW_SECTION_LAB_DETAILS,
  ADD_SECTION_LAB_DETAILS_SUCCESS,
  ADD_SECTION_LAB_DETAILS_FAIL,
  UPDATE_SECTION_LAB,
  UPDATE_SECTION_LAB_SUCCESS,
  UPDATE_SECTION_LAB_FAIL,
  DELETE_SECTION_LAB,
  DELETE_SECTION_LAB_SUCCESS,
  DELETE_SECTION_LAB_FAIL,
  GET_SCHEDULE_TIMING_PROFILE,
  GET_SCHEDULE_TIMING_PROFILE_FAIL,
  GET_SCHEDULE_TIMING_PROFILE_SUCCESS,
  GET_SCHEDULE_TIMINGS,
  GET_SCHEDULE_TIMINGS_FAIL,
  GET_SCHEDULE_TIMINGS_SUCCESS,
  ADD_NEW_SCHEDULE_TIMING,
  ADD_SCHEDULE_TIMING_SUCCESS,
  ADD_SCHEDULE_TIMING_FAIL,
  DELETE_SCHEDULE_TIMING,
  DELETE_SCHEDULE_TIMING_SUCCESS,
  DELETE_SCHEDULE_TIMING_FAIL,
  GET_SCHEDULE_TIMING_DESCS,
  GET_SCHEDULE_TIMING_DESCS_SUCCESS,
  GET_SCHEDULE_TIMING_DESCS_FAIL,
  GET_FILTERED_SECTIONS,
  GET_FILTERED_SECTIONS_SUCCESS,
  GET_FILTERED_SECTIONS_FAIL,
  GET_DEFAULT_SETTINGS,
  GET_SCHEDULE_MSG_VALUE,
  GET_SCHEDULE_MSG_VALUE_SUCCESS,
  GET_SCHEDULE_MSG_VALUE_FAIL,
  GET_HALL_TIMINGS,
  GET_HALL_TIMINGS_SUCCESS,
  GET_HALL_TIMINGS_FAIL,
} from "./actionTypes";

export const getCoursesOffering = coursesOffering => ({
  type: GET_COURSES_OFFERING,
  payload: coursesOffering,
});

export const getCoursesOfferingSuccess = coursesOffering => ({
  type: GET_COURSES_OFFERING_SUCCESS,
  payload: coursesOffering,
});

export const getCoursesOfferingFail = error => ({
  type: GET_COURSES_OFFERING_FAIL,
  payload: error,
});

export const getMethodsOfOfferingCourses = () => ({
  type: GET_METHODS_OF_OFFERING_COURSES,
});

export const getMethodsOfOfferingCoursesSuccess = methodsOffering => ({
  type: GET_METHODS_OF_OFFERING_COURSES_SUCCESS,
  payload: methodsOffering,
});

export const getMethodsOfOfferingCoursesFail = error => ({
  type: GET_METHODS_OF_OFFERING_COURSES_FAIL,
  payload: error,
});

export const getAllCoursesOffering = coursesOffering => ({
  type: GET_ALL_COURSES_OFFERING,
  payload: coursesOffering,
});

export const getAllCoursesOfferingSuccess = coursesOffering => ({
  type: GET_ALL_COURSES_OFFERING_SUCCESS,
  payload: coursesOffering,
});

export const getAllCoursesOfferingFail = error => ({
  type: GET_ALL_COURSES_OFFERING_FAIL,
  payload: error,
});

export const getCourseOfferingProfile = () => ({
  type: GET_COURSE_OFFERING_PROFILE,
});

export const getCourseOfferingProfileSuccess = courseOfferingProfile => ({
  type: GET_COURSE_OFFERING_PROFILE_SUCCESS,
  payload: courseOfferingProfile,
});

export const getCourseOfferingProfileFail = error => ({
  type: GET_COURSE_OFFERING_PROFILE_FAIL,
  payload: error,
});

export const addNewCourseOffering = courseOffering => ({
  type: ADD_NEW_COURSE_OFFERING,
  payload: courseOffering,
});

export const addCourseOfferingSuccess = courseOffering => ({
  type: ADD_COURSE_OFFERING_SUCCESS,
  payload: courseOffering,
});

export const addCourseOfferingFail = error => ({
  type: ADD_COURSE_OFFERING_FAIL,
  payload: error,
});

export const updateCourseOffering = courseOffering => {
  return {
    type: UPDATE_COURSE_OFFERING,
    payload: courseOffering,
  };
};

export const updateCourseOfferingSuccess = courseOffering => ({
  type: UPDATE_COURSE_OFFERING_SUCCESS,
  payload: courseOffering,
});

export const updateCourseOfferingFail = error => ({
  type: UPDATE_COURSE_OFFERING_FAIL,
  payload: error,
});

export const deleteCourseOffering = courseOffering => ({
  type: DELETE_COURSE_OFFERING,
  payload: courseOffering,
});

export const deleteCourseOfferingSuccess = courseOffering => ({
  type: DELETE_COURSE_OFFERING_SUCCESS,
  payload: courseOffering,
});

export const deleteCourseOfferingFail = error => ({
  type: DELETE_COURSE_OFFERING_FAIL,
  payload: error,
});

export const getInstructors = () => ({
  type: GET_INSTRUCTORS,
});
export const getInstructorsSuccess = Instructors => ({
  type: GET_INSTRUCTORS_SUCCESS,
  payload: Instructors,
});

export const getInstructorsFail = error => ({
  type: GET_INSTRUCTORS_FAIL,
  payload: error,
});

export const getSectionLabs = SectionLabs => ({
  type: GET_SECTION_LABS,
  payload: SectionLabs,
});

export const getSectionLabsSuccess = SectionLabs => ({
  type: GET_SECTION_LABS_SUCCESS,
  payload: SectionLabs,
});

export const getSectionLabsFail = error => ({
  type: GET_SECTION_LABS_FAIL,
  payload: error,
});

export const getSectionLabProfile = SectionLabId => ({
  type: GET_SECTION_LAB_PROFILE,
  SectionLabId,
});

export const getSectionLabProfileSuccess = SectionLabProfiles => ({
  type: GET_SECTION_LAB_PROFILE_SUCCESS,
  payload: SectionLabProfiles,
});

export const getSectionLabProfileFail = error => ({
  type: GET_SECTION_LAB_PROFILE_FAIL,
  payload: error,
});

export const addNewSectionLab = SectionLabId => ({
  type: ADD_NEW_SECTION_LAB,
  payload: SectionLabId,
});

export const addSectionLabSuccess = SectionLab => ({
  type: ADD_SECTION_LAB_SUCCESS,
  payload: SectionLab,
});

export const addSectionLabFail = error => ({
  type: ADD_SECTION_LAB_FAIL,
  payload: error,
});

export const addNewSectionLabDetails = SectionLabId => ({
  type: ADD_NEW_SECTION_LAB_DETAILS,
  payload: SectionLabId,
});

export const addSectionLabDetailsSuccess = SectionLab => ({
  type: ADD_SECTION_LAB_DETAILS_SUCCESS,
  payload: SectionLab,
});

export const addSectionLabDetailsFail = error => ({
  type: ADD_SECTION_LAB_DETAILS_FAIL,
  payload: error,
});

export const updateSectionLab = SectionLab => ({
  type: UPDATE_SECTION_LAB,
  payload: SectionLab,
});

export const updateSectionLabSuccess = SectionLab => ({
  type: UPDATE_SECTION_LAB_SUCCESS,
  payload: SectionLab,
});

export const updateSectionLabFail = error => ({
  type: UPDATE_SECTION_LAB_FAIL,
  payload: error,
});

export const deleteSectionLab = SectionLab => ({
  type: DELETE_SECTION_LAB,
  payload: SectionLab,
});

export const deleteSectionLabSuccess = SectionLab => ({
  type: DELETE_SECTION_LAB_SUCCESS,
  payload: SectionLab,
});

export const deleteSectionLabFail = error => ({
  type: DELETE_SECTION_LAB_FAIL,
  payload: error,
});

export const getScheduleTimings = scheduleTimingCourse => ({
  type: GET_SCHEDULE_TIMINGS,
  payload: scheduleTimingCourse,
});

export const getScheduleTimingsSuccess = scheduleTimings => ({
  type: GET_SCHEDULE_TIMINGS_SUCCESS,
  payload: scheduleTimings,
});

export const getScheduleTimingsFail = error => ({
  type: GET_SCHEDULE_TIMINGS_FAIL,
  payload: error,
});

export const getScheduleTimingProfile = scheduleTimingId => ({
  type: GET_SCHEDULE_TIMING_PROFILE,
  scheduleTimingId,
});

export const getScheduleTimingProfileSuccess = scheduleTimingProfiles => ({
  type: GET_SCHEDULE_TIMING_PROFILE_SUCCESS,
  payload: scheduleTimingProfiles,
});

export const getScheduleTimingProfileFail = error => ({
  type: GET_SCHEDULE_TIMING_PROFILE_FAIL,
  payload: error,
});

export const addNewScheduleTiming = scheduleTiming => ({
  type: ADD_NEW_SCHEDULE_TIMING,
  payload: scheduleTiming,
});

export const addScheduleTimingSuccess = scheduleTiming => ({
  type: ADD_SCHEDULE_TIMING_SUCCESS,
  payload: scheduleTiming,
});

export const addScheduleTimingFail = error => ({
  type: ADD_SCHEDULE_TIMING_FAIL,
  payload: error,
});

export const deleteScheduleTiming = scheduleTiming => ({
  type: DELETE_SCHEDULE_TIMING,
  payload: scheduleTiming,
});

export const deleteScheduleTimingSuccess = scheduleTiming => ({
  type: DELETE_SCHEDULE_TIMING_SUCCESS,
  payload: scheduleTiming,
});

export const deleteScheduleTimingFail = error => ({
  type: DELETE_SCHEDULE_TIMING_FAIL,
  payload: error,
});
export const getScheduleTimingDescs = scheduleTimingDesc => ({
  type: GET_SCHEDULE_TIMING_DESCS,
  payload: scheduleTimingDesc,
});

export const getScheduleTimingDescsSuccess = scheduleTimingDescs => ({
  type: GET_SCHEDULE_TIMING_DESCS_SUCCESS,
  payload: scheduleTimingDescs,
});

export const getScheduleTimingDescsFail = error => ({
  type: GET_SCHEDULE_TIMING_DESCS_FAIL,
  payload: error,
});

export const getFilteredSections = filteredSrctions => ({
  type: GET_FILTERED_SECTIONS,
  payload: filteredSrctions,
});

export const getFilteredSectionsSuccess = filteredSrctions => ({
  type: GET_FILTERED_SECTIONS_SUCCESS,
  payload: filteredSrctions,
});

export const getFilteredSectionsFail = error => ({
  type: GET_FILTERED_SECTIONS_FAIL,
  payload: error,
});

export const fetchDefaultSettings = () => ({
  type: GET_DEFAULT_SETTINGS,
});

export const getScheduleMsgValue = () => ({
  type: GET_SCHEDULE_MSG_VALUE,
});

export const getScheduleMsgValueSuccess = msg => ({
  type: GET_SCHEDULE_MSG_VALUE_SUCCESS,
  payload: msg,
});

export const getScheduleMsgValueFail = error => ({
  type: GET_SCHEDULE_MSG_VALUE_FAIL,
  payload: error,
});
export const getHallTimings = hallTimingCourse => ({
  type: GET_HALL_TIMINGS,
  payload: hallTimingCourse,
});

export const getHallTimingsSuccess = hallTimings => ({
  type: GET_HALL_TIMINGS_SUCCESS,
  payload: hallTimings,
});

export const getHallTimingsFail = error => ({
  type: GET_HALL_TIMINGS_FAIL,
  payload: error,
});
