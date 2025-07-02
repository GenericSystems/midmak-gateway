import {
  GET_COURSES_REGISTRATIONS_SUCCESS,
  GET_COURSES_REGISTRATIONS_FAIL,
  ADD_COURSE_REGISTRATION_SUCCESS,
  ADD_COURSE_REGISTRATION_FAIL,
  UPDATE_COURSE_REGISTRATION_SUCCESS,
  UPDATE_COURSE_REGISTRATION_FAIL,
  DELETE_COURSE_REGISTRATION_SUCCESS,
  DELETE_COURSE_REGISTRATION_FAIL,
  GET_STUDENT_REGISTER_INFO_SUCCESS,
  GET_STUDENT_REGISTER_INFO_FAIL,
  GET_AVAILABLE_COURSES_FAIL,
  GET_AVAILABLE_COURSES_SUCCESS,
  ADD_AVAILABLE_COURSE_SUCCESS,
  ADD_AVAILABLE_COURSE_FAIL,
  GET_NON_ACTIVE_STD_CURRS_SUCCESS,
  GET_NON_ACTIVE_STD_CURRS_FAIL,
  UPDATE_NON_ACTIVE_STD_CURR_SUCCESS,
  UPDATE_NON_ACTIVE_STD_CURR_FAIL,
  DELETE_NON_ACTIVE_STD_CURR_SUCCESS,
  DELETE_NON_ACTIVE_STD_CURR_FAIL,
  GET_TEMP_STD_SCHEDULES_SUCCESS,
  GET_TEMP_STD_SCHEDULES_FAIL,
  DELETE_ALL_NON_ACTIVE_STD_CURR_SUCCESS,
  DELETE_ALL_NON_ACTIVE_STD_CURR_FAIL,
  GET_ACHIEVED_COURSES_FAIL,
  GET_ACHIEVED_COURSES_SUCCESS,
  SAVE_ALL_NON_ACTIVE_STD_CURR_SUCCESS,
  SAVE_ALL_NON_ACTIVE_STD_CURR_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  coursesRegistration: [],
  availableCourses: [],
  nonActiveStdCurrs: [],
  tempStdSchedules: [],
  error: {},
  achievedCourses: [],
  studentRegisterInfo: [],
};

const coursesRegistration = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_COURSES_REGISTRATIONS_SUCCESS:
      return {
        ...state,
        coursesRegistration: action.payload,
      };

    case GET_COURSES_REGISTRATIONS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_COURSE_REGISTRATION_SUCCESS:
      return {
        ...state,
        coursesRegistration: [...state.coursesRegistration, action.payload],
      };

    case ADD_COURSE_REGISTRATION_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_AVAILABLE_COURSES_SUCCESS:
      return {
        ...state,
        availableCourses: action.payload,
      };

    case GET_AVAILABLE_COURSES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_AVAILABLE_COURSE_SUCCESS:
      const parsedPayload = {
        ...action.payload,
        labs: JSON.parse(action.payload.labs).map(lab => ({
          ...lab,
          type: "lab",
          rowId: action.payload.Id,
          details: lab.LabDetails === null ? [] : lab.LabDetails,
          LabDetails: undefined,
        })),
        sections: JSON.parse(action.payload.sections).map(section => ({
          ...section,
          type: "section",
          rowId: action.payload.Id,
          details:
            section.SectionDetails === null ? [] : section.SectionDetails,
          SectionDetails: undefined,
        })),
      };

      return {
        ...state,
        nonActiveStdCurrs: [...state.nonActiveStdCurrs, parsedPayload],
      };

    case ADD_AVAILABLE_COURSE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_STUDENT_REGISTER_INFO_SUCCESS:
      return {
        ...state,
        studentRegisterInfo: action.payload,
      };

    case UPDATE_COURSE_REGISTRATION_SUCCESS:
      return {
        ...state,
        coursesRegistration: state.coursesRegistration.map(courseRegistration =>
          courseRegistration.Id.toString() === action.payload.Id.toString()
            ? { courseRegistration, ...action.payload }
            : courseRegistration
        ),
      };

    case UPDATE_COURSE_REGISTRATION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_COURSE_REGISTRATION_SUCCESS:
      return {
        ...state,
        coursesRegistration: state.coursesRegistration.filter(
          courseRegistration =>
            courseRegistration.Id.toString() !== action.payload.Id.toString()
        ),
      };

    case DELETE_COURSE_REGISTRATION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_STUDENT_REGISTER_INFO_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_NON_ACTIVE_STD_CURRS_SUCCESS:
      const updatedNonActiveStdCurrs = action.payload.map(row => ({
        ...row,
        sections: row.sections.map(section => ({
          ...section,
          details:
            section.SectionDetails === null ? [] : section.SectionDetails,
          type: "section",
          rowId: row.Id,
          SectionDetails: undefined,
        })),
        labs: row.labs.map(lab => ({
          ...lab,
          details: lab.LabDetails === null ? [] : lab.LabDetails,
          type: "lab",
          rowId: row.Id,
          LabDetails: undefined,
        })),
      }));

      return {
        ...state,
        nonActiveStdCurrs: updatedNonActiveStdCurrs,
      };
    case GET_NON_ACTIVE_STD_CURRS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_NON_ACTIVE_STD_CURR_SUCCESS:
      return {
        ...state,
        nonActiveStdCurrs: state.nonActiveStdCurrs.map(nonActiveStdCurr =>
          nonActiveStdCurr.Id.toString() === action.payload.Id.toString()
            ? {
                nonActiveStdCurr,
                ...action.payload,
                labs: JSON.parse(action.payload.labs),
                sections: JSON.parse(action.payload.sections),
              }
            : nonActiveStdCurr
        ),
      };

    case UPDATE_NON_ACTIVE_STD_CURR_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case DELETE_NON_ACTIVE_STD_CURR_SUCCESS:
      return {
        ...state,
        nonActiveStdCurrs: state.nonActiveStdCurrs.filter(
          nonActiveStdCurrs =>
            nonActiveStdCurrs.Id.toString() !== action.payload.Id.toString()
        ),
      };

    case DELETE_NON_ACTIVE_STD_CURR_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_TEMP_STD_SCHEDULES_SUCCESS:
      return {
        ...state,
        tempStdSchedules: action.payload,
      };

    case GET_TEMP_STD_SCHEDULES_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_ACHIEVED_COURSES_SUCCESS:
      return {
        ...state,
        achievedCourses: action.payload,
      };

    case GET_ACHIEVED_COURSES_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case DELETE_ALL_NON_ACTIVE_STD_CURR_SUCCESS:
      return {
        ...state,
        nonActiveStdCurrs: action.payload,
      };

    case DELETE_ALL_NON_ACTIVE_STD_CURR_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case SAVE_ALL_NON_ACTIVE_STD_CURR_SUCCESS:
      return {
        ...state,
        nonActiveStdCurrs: action.payload,
      };

    case SAVE_ALL_NON_ACTIVE_STD_CURR_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default coursesRegistration;
