import {
  GET_TRAINEE_REQUESTS_SUCCESS,
  GET_TRAINEE_REQUESTS_FAIL,
  ADD_TRAINEE_REQUEST_SUCCESS,
  ADD_TRAINEE_REQUEST_FAIL,
  UPDATE_TRAINEE_REQUEST_SUCCESS,
  UPDATE_TRAINEE_REQUEST_FAIL,
  DELETE_TRAINEE_REQUEST_SUCCESS,
  DELETE_TRAINEE_REQUEST_FAIL,
  GET_GRADE_TYPES_SUCCESS,
  GET_GRADE_TYPES_FAIL,
  GET_FILTERED_COURSES_OBJECTION_SUCCESS,
  GET_FILTERED_COURSES_OBJECTION_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  traineesRequests: [],
  error: {},
  transferCourses: [],
  prevUnivCourses: [],
  lastReqNum: {},
  reqDetails: [],
  gradeTypes: [],
  coursesObjection: [],
};

const traineesRequests = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_TRAINEE_REQUESTS_SUCCESS:
      return {
        ...state,
        traineesRequests: action.payload,
      };

    case GET_TRAINEE_REQUESTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_TRAINEE_REQUEST_SUCCESS:
      return {
        ...state,
        traineesRequests: [...state.traineesRequests, action.payload],
      };

    case ADD_TRAINEE_REQUEST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_TRAINEE_REQUEST_SUCCESS:
      return {
        ...state,
        traineesRequests: state.traineesRequests.map(traineeManagement =>
          traineeManagement.Id.toString() === action.payload.Id.toString()
            ? { ...traineeManagement, ...action.payload }
            : traineeManagement
        ),
      };

    case UPDATE_TRAINEE_REQUEST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_TRAINEE_REQUEST_SUCCESS:
      return {
        ...state,
        traineesRequests: state.traineesRequests.filter(
          traineeManagement =>
            traineeManagement.Id.toString() !== action.payload.Id.toString()
        ),
      };

    case DELETE_TRAINEE_REQUEST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_GRADE_TYPES_SUCCESS:
      return {
        ...state,
        gradeTypes: action.payload,
      };

    case GET_GRADE_TYPES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_FILTERED_COURSES_OBJECTION_SUCCESS:
      return {
        ...state,
        coursesObjection: action.payload,
      };

    case GET_FILTERED_COURSES_OBJECTION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default traineesRequests;
