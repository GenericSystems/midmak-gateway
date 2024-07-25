import {
  GET_SCHEDULING_LECTURE_PROFILE,
  GET_SCHEDULING_LECTURE_PROFILE_FAIL,
  GET_SCHEDULING_LECTURE_PROFILE_SUCCESS,
  GET_ALL_SCHEDULING_LECTURES,
  GET_ALL_SCHEDULING_LECTURES_FAIL,
  GET_ALL_SCHEDULING_LECTURES_SUCCESS,
  GET_SCHEDULING_LECTURES,
  GET_SCHEDULING_LECTURES_FAIL,
  GET_SCHEDULING_LECTURES_SUCCESS,
  ADD_NEW_SCHEDULING_LECTURE,
  ADD_SCHEDULING_LECTURE_SUCCESS,
  ADD_SCHEDULING_LECTURE_FAIL,
  UPDATE_SCHEDULING_LECTURE,
  UPDATE_SCHEDULING_LECTURE_SUCCESS,
  UPDATE_SCHEDULING_LECTURE_FAIL,
  DELETE_SCHEDULING_LECTURE,
  DELETE_SCHEDULING_LECTURE_SUCCESS,
  DELETE_SCHEDULING_LECTURE_FAIL,
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
GET_SECTOR_TIMINGS,
GET_SECTOR_TIMINGS_SUCCESS,
GET_SECTOR_TIMINGS_FAIL
} from "./actionTypes";

export const getSchedulingLectures = yearSemesterId => ({
  type: GET_SCHEDULING_LECTURES,
  payload: yearSemesterId
});

export const getSchedulingLecturesSuccess = offeringLectures => ({
  type: GET_SCHEDULING_LECTURES_SUCCESS,
  payload: offeringLectures,
});

export const getSchedulingLecturesFail = error => ({
  type: GET_SCHEDULING_LECTURES_FAIL,
  payload: error,
});

export const getAllSchedulingLectures = yearSemesterId => ({
  type: GET_ALL_SCHEDULING_LECTURES,
  payload: yearSemesterId
});

export const getAllSchedulingLecturesSuccess = schedulingLectures => ({
  type: GET_ALL_SCHEDULING_LECTURES_SUCCESS,
  payload: schedulingLectures,
});

export const getAllSchedulingLecturesFail = error => ({
  type: GET_ALL_SCHEDULING_LECTURES_FAIL,
  payload: error,
});

export const getSchedulingLectureProfile = () => ({
  type: GET_SCHEDULING_LECTURE_PROFILE,
});

export const getSchedulingLectureProfileSuccess = schedulingLectureProfile => ({
  type: GET_SCHEDULING_LECTURE_PROFILE_SUCCESS,
  payload: schedulingLectureProfile,
});

export const getSchedulingLectureProfileFail = error => ({
  type: GET_SCHEDULING_LECTURE_PROFILE_FAIL,
  payload: error,
});

export const addNewSchedulingLecture = schedulingLecture => ({
  type: ADD_NEW_SCHEDULING_LECTURE,
  payload: schedulingLecture,
});

export const addSchedulingLectureSuccess = schedulingLecture => ({
  type: ADD_SCHEDULING_LECTURE_SUCCESS,
  payload: schedulingLecture,
});

export const addSchedulingLectureFail = error => ({
  type: ADD_SCHEDULING_LECTURE_FAIL,
  payload: error,
});

export const updateSchedulingLecture = schedulingLecture => {
  return {
    type: UPDATE_SCHEDULING_LECTURE,
    payload: schedulingLecture,
  };
};

export const updateSchedulingLectureSuccess = schedulingLecture => ({
  type: UPDATE_SCHEDULING_LECTURE_SUCCESS,
  payload: schedulingLecture,
});

export const updateSchedulingLectureFail = error => ({
  type: UPDATE_SCHEDULING_LECTURE_FAIL,
  payload: error,
});

export const deleteSchedulingLecture = schedulingLecture => ({
  type: DELETE_SCHEDULING_LECTURE,
  payload: schedulingLecture,
});

export const deleteSchedulingLectureSuccess = schedulingLecture => ({
  type: DELETE_SCHEDULING_LECTURE_SUCCESS,
  payload: schedulingLecture,
});

export const deleteSchedulingLectureFail = error => ({
  type: DELETE_SCHEDULING_LECTURE_FAIL,
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

export const getSectionLabs = sectionLabCourse => ({
  type: GET_SECTION_LABS,
  payload: sectionLabCourse,
});

export const getSectionLabsSuccess = sectionLabs => ({
  type: GET_SECTION_LABS_SUCCESS,
  payload: sectionLabs,
});

export const getSectionLabsFail = error => ({
  type: GET_SECTION_LABS_FAIL,
  payload: error,
});

export const getSectionLabProfile = sectionLabId => ({
  type: GET_SECTION_LAB_PROFILE,
  sectionLabId,
});

export const getSectionLabProfileSuccess = sectionLabProfiles => ({
  type: GET_SECTION_LAB_PROFILE_SUCCESS,
  payload: sectionLabProfiles,
});

export const getSectionLabProfileFail = error => ({
  type: GET_SECTION_LAB_PROFILE_FAIL,
  payload: error,
});

export const addNewSectionLab = sectionLab => ({
  type: ADD_NEW_SECTION_LAB,
  payload: sectionLab,
});

export const addSectionLabSuccess = sectionLab => ({
  type: ADD_SECTION_LAB_SUCCESS,
  payload: sectionLab,
});

export const addSectionLabFail = error => ({
  type: ADD_SECTION_LAB_FAIL,
  payload: error,
});

export const updateSectionLab = sectionLab => ({
  type: UPDATE_SECTION_LAB,
  payload: sectionLab,
});

export const updateSectionLabSuccess = sectionLab => ({
  type: UPDATE_SECTION_LAB_SUCCESS,
  payload: sectionLab,
});

export const updateSectionLabFail = error => ({
  type: UPDATE_SECTION_LAB_FAIL,
  payload: error,
});

export const deleteSectionLab = sectionLab => ({
  type: DELETE_SECTION_LAB,
  payload: sectionLab,
});

export const deleteSectionLabSuccess = sectionLab => ({
  type: DELETE_SECTION_LAB_SUCCESS,
  payload: sectionLab,
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
export const getSectorTimings = hallTimingCourse => ({
  type: GET_SECTOR_TIMINGS,
  payload: hallTimingCourse,
});

export const getSectorTimingsSuccess = hallTimings => ({
  type: GET_SECTOR_TIMINGS_SUCCESS,
  payload: hallTimings,
});

export const getSectorTimingsFail = error => ({
  type: GET_SECTOR_TIMINGS_FAIL,
  payload: error,
});
