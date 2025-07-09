import {
  GET_COURSE_DISTRIBUTIONS_SUCCESS,
  GET_COURSE_DISTRIBUTIONS_FAIL,
  ADD_COURSE_DISTRIBUTION_SUCCESS,
  ADD_COURSE_DISTRIBUTION_FAIL,
  UPDATE_COURSE_DISTRIBUTION_SUCCESS,
  UPDATE_COURSE_DISTRIBUTION_FAIL,
  DELETE_COURSE_DISTRIBUTION_SUCCESS,
  DELETE_COURSE_DISTRIBUTION_FAIL,
  GET_COURSE_DISTRIBUTION_DELETED_VALUE_SUCCESS,
  GET_COURSE_DISTRIBUTION_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  courseDistributions: [],
  deleted: {},
  error: {},
};

const courseDistributions = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_COURSE_DISTRIBUTIONS_SUCCESS:
      return {
        ...state,
        courseDistributions: action.payload,
      };

    case GET_COURSE_DISTRIBUTIONS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_COURSE_DISTRIBUTION_SUCCESS:
      return {
        ...state,
        courseDistributions: [...state.courseDistributions, action.payload],
      };

    case ADD_COURSE_DISTRIBUTION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_COURSE_DISTRIBUTION_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    case GET_COURSE_DISTRIBUTION_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_COURSE_DISTRIBUTION_SUCCESS:
      return {
        ...state,
        courseDistributions: state.courseDistributions.map(courseDistribution =>
          courseDistribution.Id.toString() === action.payload.Id.toString()
            ? { ...courseDistribution, ...action.payload }
            : courseDistribution
        ),
      };

    case UPDATE_COURSE_DISTRIBUTION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_COURSE_DISTRIBUTION_SUCCESS:
      return {
        ...state,
        courseDistributions: state.courseDistributions.filter(
          courseDistribution => courseDistribution.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_COURSE_DISTRIBUTION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default courseDistributions;
