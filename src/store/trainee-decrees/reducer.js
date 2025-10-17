import {
  GET_TRAINEES_DECREES_SUCCESS,
  GET_TRAINEES_DECREES_FAIL,
  ADD_TRAINEE_DECREE_SUCCESS,
  ADD_TRAINEE_DECREE_FAIL,
  UPDATE_TRAINEE_DECREE_SUCCESS,
  UPDATE_TRAINEE_DECREE_FAIL,
  DELETE_TRAINEE_DECREE_SUCCESS,
  DELETE_TRAINEE_DECREE_FAIL,
  GET_TRAINEE_DECREE_DELETED_VALUE_SUCCESS,
  GET_TRAINEE_DECREE_DELETED_VALUE_FAIL,
  GET_FILTERED_COURSES_PLANS_SUCCESS,
  GET_FILTERED_COURSES_PLANS_FAIL,
  GET_ACADEMY_TRAINEES_DECREE_SUCCESS,
  GET_ACADEMY_TRAINEES_DECREE_FAIL,
  GET_COURSES_DECREES_FAIL,
  GET_COURSES_DECREES_SUCCESS,
  GET_DECREE_STATUS_SUCCESS,
  GET_DECREE_STATUS_FAIL,
  GET_TRAINEE_DECREES_DISMISS_SUCCESS,
  GET_TRAINEE_DECREES_DISMISS_FAIL,
} from "./actionTypes";
const INIT_STATE = {
  traineesDecrees: [],
  traineeDecreesDismiss: [],
  deleted: {},
  error: {},
  filteredCoursesPlans: [],
  academyTraineesDecrees: [],
  coursesDecrees: [],
  decreeStatus: [],
};
const traineesDecrees = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_TRAINEES_DECREES_SUCCESS:
      return {
        ...state,
        traineesDecrees: action.payload,
      };
    case GET_TRAINEES_DECREES_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_TRAINEE_DECREE_SUCCESS:
      return {
        ...state,
        traineesDecrees: [...state.traineesDecrees, action.payload],
        TraineesDecreesCourses: JSON.parse(
          action.payload.TraineesDecreesCourses
        ),
      };
    case ADD_TRAINEE_DECREE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_TRAINEE_DECREE_SUCCESS:
      return {
        ...state,
        traineesDecrees: state.traineesDecrees.map(traineeDecree =>
          traineeDecree.Id === action.payload.Id
            ? {
                traineeDecree,
                ...action.payload,
                TraineesDecreesCourses: JSON.parse(
                  action.payload.TraineesDecreesCourses
                ),
              }
            : traineeDecree
        ),
      };
    case UPDATE_TRAINEE_DECREE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case DELETE_TRAINEE_DECREE_SUCCESS:
      return {
        ...state,
        traineesDecrees: state.traineesDecrees.filter(
          traineeDecree =>
            traineeDecree.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_TRAINEE_DECREE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_TRAINEE_DECREE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };
    case GET_TRAINEE_DECREE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_FILTERED_COURSES_PLANS_SUCCESS:
      return {
        ...state,
        filteredCoursesPlans: action.payload,
      };
    case GET_FILTERED_COURSES_PLANS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_ACADEMY_TRAINEES_DECREE_SUCCESS:
      return {
        ...state,
        academyTraineesDecrees: action.payload,
      };
    case GET_ACADEMY_TRAINEES_DECREE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_COURSES_DECREES_SUCCESS:
      return {
        ...state,
        coursesDecrees: action.payload,
      };
    case GET_COURSES_DECREES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_DECREE_STATUS_SUCCESS:
      return {
        ...state,
        decreeStatus: action.payload,
      };
    case GET_DECREE_STATUS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_TRAINEE_DECREES_DISMISS_SUCCESS:
      return {
        ...state,
        traineeDecreesDismiss: action.payload,
      };
    case GET_TRAINEE_DECREES_DISMISS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};
export default traineesDecrees;
