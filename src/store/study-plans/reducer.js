import {
  GET_STUDY_PLANS_SUCCESS,
  GET_STUDY_PLANS_FAIL,
  ADD_STUDY_PLAN_SUCCESS,
  ADD_STUDY_PLAN_FAIL,
  UPDATE_STUDY_PLAN_SUCCESS,
  UPDATE_STUDY_PLAN_FAIL,
  DELETE_STUDY_PLAN_SUCCESS,
  DELETE_STUDY_PLAN_FAIL,
  GET_STUDY_PLAN_PROFILE_SUCCESS,
  GET_STUDY_PLAN_PROFILE_FAIL,
  GET_FILTERED_COURSES_SUCCESS,
  GET_FILTERED_COURSES_FAIL,
  GET_PLAN_HOURS_SUCCESS,
  GET_PLAN_HOURS_FAIL,
  ADD_PLAN_HOUR_SUCCESS,
  ADD_PLAN_HOUR_FAIL,
  UPDATE_PLAN_HOUR_SUCCESS,
  UPDATE_PLAN_HOUR_FAIL,
  GENERALIZE_STUDY_PLANS_SUCCESS,
  GENERALIZE_STUDY_PLANS_FAIL,
  GET_ALL_STUDY_PLANS_SUCCESS,
  GET_ALL_STUDY_PLANS_FAIL
} from "./actionTypes";

const INIT_STATE = {
  studyPlans: [],
  filteredCourses: [],
  planHours: [],
  studyPlanProfile: {},
  error: {},
  allStudyPlans:[]
};

const studyPlans = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PLAN_HOURS_SUCCESS:
      return {
        ...state,
        planHours: action.payload,
      };

    case GET_PLAN_HOURS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_PLAN_HOUR_SUCCESS:
      return {
        ...state,
        planHours: [...state.planHours, action.payload],
      };

    case ADD_PLAN_HOUR_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_PLAN_HOUR_SUCCESS:
      return {
        ...state,
        planHours: state.planHours.map(planHour =>
          planHour.Id.toString() === action.payload.Id.toString()
            ? { planHour, ...action.payload }
            : planHour
        ),
      };

    case UPDATE_PLAN_HOUR_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_STUDY_PLANS_SUCCESS:
      return {
        ...state,
        studyPlans: action.payload,
      };

    case GET_STUDY_PLANS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_FILTERED_COURSES_SUCCESS:
      return {
        ...state,
        filteredCourses: action.payload,
      };

    case GET_FILTERED_COURSES_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_STUDY_PLAN_SUCCESS:
      return {
        ...state,
        studyPlans: [...state.studyPlans, action.payload],
      };

    case ADD_STUDY_PLAN_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_STUDY_PLAN_PROFILE_SUCCESS:
      return {
        ...state,
        studyPlanProfile: action.payload,
      };

    case UPDATE_STUDY_PLAN_SUCCESS:
      return {
        ...state,
        studyPlans: state.studyPlans.map(studyPlan =>
          studyPlan.Id.toString() === action.payload.Id.toString()
            ? { studyPlan, ...action.payload }
            : studyPlan
        ),
      };

    case UPDATE_STUDY_PLAN_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_STUDY_PLAN_SUCCESS:
      return {
        ...state,
        studyPlans: state.studyPlans.filter(
          studyPlan => studyPlan.Id.toString() !== action.payload.Id.toString()
        ),
      };

    case DELETE_STUDY_PLAN_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_STUDY_PLAN_PROFILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      case GENERALIZE_STUDY_PLANS_SUCCESS:
        return {
          ...state,
          studyPlans: action.payload,
        };
    
      case GENERALIZE_STUDY_PLANS_FAIL:
        return {
          ...state,
          error: action.payload,
        };
        case GET_ALL_STUDY_PLANS_SUCCESS:
      return {
        ...state,
        allStudyPlans: action.payload,
      };

    case GET_ALL_STUDY_PLANS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      
    default:
      return state;
  }
};

export default studyPlans;
