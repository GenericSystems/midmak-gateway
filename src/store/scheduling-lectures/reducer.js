import {
  GET_ALL_SCHEDULING_LECTURES_SUCCESS,
  GET_ALL_SCHEDULING_LECTURES_FAIL,
  GET_SCHEDULING_LECTURES_SUCCESS,
  GET_SCHEDULING_LECTURES_FAIL,
  ADD_SCHEDULING_LECTURE_SUCCESS,
  ADD_SCHEDULING_LECTURE_FAIL,
  UPDATE_SCHEDULING_LECTURE_SUCCESS,
  UPDATE_SCHEDULING_LECTURE_FAIL,
  DELETE_SCHEDULING_LECTURE_SUCCESS,
  DELETE_SCHEDULING_LECTURE_FAIL,
  GET_SCHEDULING_LECTURE_PROFILE_SUCCESS,
  GET_SCHEDULING_LECTURE_PROFILE_FAIL,
  GET_INSTRUCTORS_SUCCESS,
  GET_INSTRUCTORS_FAIL,
  GET_SECTION_LAB_PROFILE_FAIL,
  GET_SECTION_LAB_PROFILE_SUCCESS,
  GET_SECTION_LABS_FAIL,
  GET_SECTION_LABS_SUCCESS,
  ADD_SECTION_LAB_SUCCESS,
  ADD_SECTION_LAB_FAIL,
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
GET_SECTOR_TIMINGS_SUCCESS,
GET_SECTOR_TIMINGS_FAIL
} from "./actionTypes";

const INIT_STATE = {
  schedulingLectures: [],
  instructors: [],
  sectionLabs: [],
  weekDays: [],
  lecturePeriods: [],
  sectionLabsProfile: {},
  offeringLectures: [],
  departments: [],
  scheduleTimings: [],
  scheduleTimingDescs: [],
  scheduleTimingsProfile: {},
  schedulingLectureProfile: {},
  filteredSections:[],
  error: {},
  returnMessage:{},
  hallTimings:[]
};

const schedulingLectures = (state = INIT_STATE, action) => {
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
    case GET_SCHEDULING_LECTURES_SUCCESS:
      return {
        ...state,
        offeringLectures: action.payload,
        schedulingLectures: action.payload,
      };
    case GET_SCHEDULING_LECTURES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_ALL_SCHEDULING_LECTURES_SUCCESS:
      return {
        ...state,
        schedulingLectures: action.payload,
      };
    case GET_ALL_SCHEDULING_LECTURES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_SCHEDULING_LECTURE_SUCCESS:
      return {
        ...state,
        schedulingLectures: [...state.schedulingLectures, action.payload],
      };

    case ADD_SCHEDULING_LECTURE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_SCHEDULING_LECTURE_PROFILE_SUCCESS:
      return {
        ...state,
        schedulingLectureProfile: action.payload,
      };

    case UPDATE_SCHEDULING_LECTURE_SUCCESS:
      return {
        ...state,
        schedulingLectures: state.schedulingLectures.map(schedulingLecture =>
          schedulingLecture.Id.toString() === action.payload.Id.toString()
            ? { schedulingLecture, ...action.payload }
            : schedulingLecture
        ),
      };

    case UPDATE_SCHEDULING_LECTURE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_SCHEDULING_LECTURE_SUCCESS:
      return {
        ...state,
        schedulingLectures: state.schedulingLectures.filter(
          schedulingLecture =>
            schedulingLecture.Id.toString() !== action.payload.Id.toString()
        ),
      };

    case DELETE_SCHEDULING_LECTURE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_SCHEDULING_LECTURE_PROFILE_FAIL:
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

    case GET_SECTION_LAB_PROFILE_SUCCESS:
      return {
        ...state,
        sectionLabProfile: action.payload,
      };

    case UPDATE_SECTION_LAB_SUCCESS:
      return {
        ...state,
        sectionLabs: state.sectionLabs.map(sectionLab =>
          (sectionLab.Id === action.payload.Id
            && sectionLab.type === action.payload.type
          )
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
        returnMessage:action.payload
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
          returnMessage: action.payload
        };
      case GET_SCHEDULE_MSG_VALUE_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      
  case GET_SECTOR_TIMINGS_SUCCESS:
    return {
      ...state,
      hallTimings: action.payload,
    };
  case GET_SECTOR_TIMINGS_FAIL:
    return {
      ...state,
      error: action.payload,
    };
    default:
      return state;
  }
};

export default schedulingLectures;
