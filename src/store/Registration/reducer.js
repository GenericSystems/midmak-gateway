import {
  GET_REGISTRATIONS_SUCCESS,
  GET_REGISTRATIONS_FAIL,
  ADD_REGISTRATION_SUCCESS,
  ADD_REGISTRATION_FAIL,
  UPDATE_REGISTRATION_SUCCESS,
  UPDATE_REGISTRATION_FAIL,
  DELETE_REGISTRATION_SUCCESS,
  DELETE_REGISTRATION_FAIL,
  GET_STUDENT_REGISTER_INFO_SUCCESS,
  GET_STUDENT_REGISTER_INFO_FAIL,
  GET_AVAILABLE_COURSES_FAIL,
  GET_AVAILABLE_COURSES_SUCCESS,
  ADD_AVAILABLE_COURSE_SUCCESS,
  ADD_AVAILABLE_COURSE_FAIL,
  GET_NON_ACTIVE_CURRS_SUCCESS,
  GET_NON_ACTIVE_CURRS_FAIL,
  UPDATE_NON_ACTIVE_CURR_SUCCESS,
  UPDATE_NON_ACTIVE_CURR_FAIL,
  DELETE_NON_ACTIVE_CURR_SUCCESS,
  DELETE_NON_ACTIVE_CURR_FAIL,
  GET_TRAINEE_SCHEDULES_SUCCESS,
  GET_TRAINEE_SCHEDULES_FAIL,
  DELETE_ALL_NON_ACTIVE_CURR_SUCCESS,
  DELETE_ALL_NON_ACTIVE_CURR_FAIL,
  GET_ACHIEVED_COURSES_FAIL,
  GET_ACHIEVED_COURSES_SUCCESS,
  SAVE_ALL_NON_ACTIVE_CURR_SUCCESS,
  SAVE_ALL_NON_ACTIVE_CURR_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  registrations: [],
  availableCourses: [],
  nonActiveCurrs: [],
  traineeSchedules: [],
  error: {},
  achievedCourses: [],
  studentRegisterInfo: [],
};

const registrations = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_REGISTRATIONS_SUCCESS:
      return {
        ...state,
        registrations: action.payload,
      };

    case GET_REGISTRATIONS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_REGISTRATION_SUCCESS:
      return {
        ...state,
        registrations: [...state.registrations, action.payload],
      };

    case ADD_REGISTRATION_FAIL:
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
        nonActiveCurrs: [...state.nonActiveCurrs, parsedPayload],
      };

    case ADD_AVAILABLE_COURSE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    // case GET_STUDENT_REGISTER_INFO_SUCCESS:
    //   return {
    //     ...state,
    //     studentRegisterInfo: action.payload,
    //   };
    //  case GET_STUDENT_REGISTER_INFO_FAIL:
    //   return {
    //     ...state,
    //     error: action.payload,
    //   };

    case UPDATE_REGISTRATION_SUCCESS:
      return {
        ...state,
        registrations: state.registrations.map(registration =>
          registration.Id.toString() === action.payload.Id.toString()
            ? { registration, ...action.payload }
            : registration
        ),
      };

    case UPDATE_REGISTRATION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_REGISTRATION_SUCCESS:
      return {
        ...state,
        registrations: state.registrations.filter(
          registration =>
            registration.Id.toString() !== action.payload.Id.toString()
        ),
      };

    case DELETE_REGISTRATION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_NON_ACTIVE_CURRS_SUCCESS:
      const updatedNonActiveCurrs = action.payload.map(row => ({
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
        nonActiveCurrs: updatedNonActiveCurrs,
      };
    case GET_NON_ACTIVE_CURRS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_NON_ACTIVE_CURR_SUCCESS:
      return {
        ...state,
        nonActiveCurrs: state.nonActiveCurrs.map(nonActiveCurr =>
          nonActiveCurr.Id.toString() === action.payload.Id.toString()
            ? {
                nonActiveCurr,
                ...action.payload,
                labs: JSON.parse(action.payload.labs),
                sections: JSON.parse(action.payload.sections),
              }
            : nonActiveCurr
        ),
      };

    case UPDATE_NON_ACTIVE_CURR_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case DELETE_NON_ACTIVE_CURR_SUCCESS:
      return {
        ...state,
        nonActiveCurrs: state.nonActiveCurrs.filter(
          nonActiveCurrs =>
            nonActiveCurrs.Id.toString() !== action.payload.Id.toString()
        ),
      };

    case DELETE_NON_ACTIVE_CURR_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_TRAINEE_SCHEDULES_SUCCESS:
      return {
        ...state,
        traineeSchedules: action.payload,
      };

    case GET_TRAINEE_SCHEDULES_FAIL:
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
    case DELETE_ALL_NON_ACTIVE_CURR_SUCCESS:
      return {
        ...state,
        nonActiveCurrs: action.payload,
      };

    case DELETE_ALL_NON_ACTIVE_CURR_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case SAVE_ALL_NON_ACTIVE_CURR_SUCCESS:
      return {
        ...state,
        nonActiveCurrs: action.payload,
      };

    case SAVE_ALL_NON_ACTIVE_CURR_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default registrations;
