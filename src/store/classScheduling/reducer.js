import {
  GET_ALL_COURSES_OFFERING_SUCCESS,
  GET_ALL_COURSES_OFFERING_FAIL,
  GET_METHODS_OF_OFFERING_COURSES_SUCCESS,
  GET_METHODS_OF_OFFERING_COURSES_FAIL,
  GET_COURSES_OFFERING_SUCCESS,
  GET_COURSES_OFFERING_FAIL,
  ADD_COURSE_OFFERING_SUCCESS,
  ADD_COURSE_OFFERING_FAIL,
  UPDATE_COURSE_OFFERING_SUCCESS,
  UPDATE_COURSE_OFFERING_FAIL,
  DELETE_COURSE_OFFERING_SUCCESS,
  DELETE_COURSE_OFFERING_FAIL,
  GET_COURSE_OFFERING_PROFILE_SUCCESS,
  GET_COURSE_OFFERING_PROFILE_FAIL,
  GET_INSTRUCTORS_SUCCESS,
  GET_INSTRUCTORS_FAIL,
  GET_SECTION_LAB_PROFILE_FAIL,
  GET_SECTION_LAB_PROFILE_SUCCESS,
  GET_SECTION_LABS_FAIL,
  GET_SECTION_LABS_SUCCESS,
  ADD_SECTION_LAB_SUCCESS,
  ADD_SECTION_LAB_FAIL,
  ADD_SECTION_LAB_DETAILS_SUCCESS,
  ADD_SECTION_LAB_DETAILS_FAIL,
  UPDATE_SECTION_LAB_SUCCESS,
  UPDATE_SECTION_LAB_FAIL,
  DELETE_SECTION_LAB_SUCCESS,
  DELETE_SECTION_LAB_FAIL,
  GET_SCHEDULE_TIMING_PROFILE_FAIL,
  GET_SCHEDULE_TIMING_PROFILE_SUCCESS,
  GET_SCHEDULE_TIMINGS_FAIL,
  GET_SCHEDULE_TIMINGS_SUCCESS,
  ADD_SCHEDULE_TIMING_SUCCESS,
  ADD_SCHEDULE_TIMING_FAIL,
  DELETE_SCHEDULE_TIMING_SUCCESS,
  DELETE_SCHEDULE_TIMING_FAIL,
  GET_SCHEDULE_TIMING_DESCS_FAIL,
  GET_SCHEDULE_TIMING_DESCS_SUCCESS,
  GET_FILTERED_SECTIONS_SUCCESS,
  GET_FILTERED_SECTIONS_FAIL,
  GET_SCHEDULE_MSG_VALUE_SUCCESS,
  GET_SCHEDULE_MSG_VALUE_FAIL,
  GET_HALL_TIMINGS_SUCCESS,
  GET_HALL_TIMINGS_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  classScheduling: [],
  methodsOffering: [],
  instructors: [],
  sectionLabs: [],
  sectionLabsDetails: [],
  weekDays: [],
  lecturePeriods: [],
  classProfile: {},
  offeringLectures: [],
  coursesOffering: [],
  departments: [],
  scheduleTimings: [],
  scheduleTimingDescs: [],
  scheduleTimingsProfile: {},
  courseOfferingProfile: {},
  filteredSections: [],
  error: {},
  returnMessage: {},
  hallTimings: [],
};

const classScheduling = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_INSTRUCTORS_SUCCESS:
      return {
        ...state,
        instructors: action.payload,
      };

    case GET_INSTRUCTORS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_METHODS_OF_OFFERING_COURSES_SUCCESS:
      return {
        ...state,
        methodsOffering: action.payload,
      };

    case GET_METHODS_OF_OFFERING_COURSES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_COURSES_OFFERING_SUCCESS:
      return {
        ...state,
        offeringLectures: action.payload,
        coursesOffering: action.payload,
      };
    case GET_COURSES_OFFERING_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_ALL_COURSES_OFFERING_SUCCESS:
      return {
        ...state,
        coursesOffering: action.payload,
      };
    case GET_ALL_COURSES_OFFERING_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_COURSE_OFFERING_SUCCESS:
      return {
        ...state,
        coursesOffering: [...state.coursesOffering, action.payload],
      };

    case ADD_COURSE_OFFERING_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_COURSE_OFFERING_PROFILE_SUCCESS:
      return {
        ...state,
        courseOfferingProfile: action.payload,
      };

    case UPDATE_COURSE_OFFERING_SUCCESS:
      return {
        ...state,
        coursesOffering: state.coursesOffering.map(courseOffering =>
          courseOffering.Id.toString() === action.payload.Id.toString()
            ? { courseOffering, ...action.payload }
            : courseOffering
        ),
      };

    case UPDATE_COURSE_OFFERING_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_COURSE_OFFERING_SUCCESS:
      return {
        ...state,
        coursesOffering: state.coursesOffering.filter(
          courseOffering =>
            courseOffering.Id.toString() !== action.payload.Id.toString()
        ),
      };

    case DELETE_COURSE_OFFERING_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_COURSE_OFFERING_PROFILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_SECTION_LABS_SUCCESS:
      return {
        ...state,
        sectionLabs: action.payload,
      };
    case GET_SECTION_LABS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_SECTION_LAB_SUCCESS:
      return {
        ...state,
        sectionLabs: [...state.sectionLabs, action.payload],
      };

    case ADD_SECTION_LAB_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_SECTION_LAB_DETAILS_SUCCESS:
      return {
        ...state,
        sectionLabsDetails: [...state.sectionLabsDetails, action.payload],
      };

    case ADD_SECTION_LAB_DETAILS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_SECTION_LAB_PROFILE_SUCCESS:
      return {
        ...state,
        sectionLabProfile: action.payload,
      };

    case UPDATE_SECTION_LAB_SUCCESS:
      return {
        ...state,
        sectionLabs: state.sectionLabs.map(sectionLab =>
          sectionLab.Id === action.payload.Id &&
          sectionLab.type === action.payload.type
            ? { sectionLab, ...action.payload }
            : sectionLab
        ),
      };

    case UPDATE_SECTION_LAB_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_SECTION_LAB_SUCCESS:
      return {
        ...state,
        sectionLabs: state.sectionLabs.filter(
          sectionLab =>
            sectionLab.Id.toString() !== action.payload.Id.toString()
        ),
      };

    case DELETE_SECTION_LAB_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_SECTION_LAB_PROFILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_SCHEDULE_TIMINGS_SUCCESS:
      return {
        ...state,
        scheduleTimings: action.payload,
      };
    case GET_SCHEDULE_TIMINGS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_SCHEDULE_TIMING_SUCCESS:
      return {
        ...state,
        scheduleTimings: [...state.scheduleTimings, action.payload],
        returnMessage: action.payload,
      };

    case ADD_SCHEDULE_TIMING_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_SCHEDULE_TIMING_PROFILE_SUCCESS:
      return {
        ...state,
        scheduleTimingProfile: action.payload,
      };

    case DELETE_SCHEDULE_TIMING_SUCCESS:
      return {
        ...state,
        scheduleTimings: state.scheduleTimings.filter(
          scheduleTiming =>
            scheduleTiming.Id.toString() !== action.payload.Id.toString()
        ),
      };

    case DELETE_SCHEDULE_TIMING_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_SCHEDULE_TIMING_PROFILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_SCHEDULE_TIMING_DESCS_SUCCESS:
      return {
        ...state,
        scheduleTimingDescs: action.payload,
      };
    case GET_SCHEDULE_TIMING_DESCS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_FILTERED_SECTIONS_SUCCESS:
      return {
        ...state,
        filteredSections: action.payload,
      };

    case GET_FILTERED_SECTIONS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_SCHEDULE_MSG_VALUE_SUCCESS:
      return {
        ...state,
        returnMessage: action.payload,
      };
    case GET_SCHEDULE_MSG_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_HALL_TIMINGS_SUCCESS:
      return {
        ...state,
        hallTimings: action.payload,
      };
    case GET_HALL_TIMINGS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default classScheduling;
