import {
  UNARCHIVE_COURSE_REQUESTS_SUCCESS,
  UNARCHIVE_COURSE_REQUESTS_FAIL,
  ADD_UNARCHIVE_COURSE_REQUEST_SUCCESS,
  ADD_UNARCHIVE_COURSE_REQUEST_FAIL,
  UPDATE_UNARCHIVE_COURSE_REQUEST_SUCCESS,
  UPDATE_UNARCHIVE_COURSE_REQUEST_FAIL,
  DELETE_UNARCHIVE_COURSE_REQUEST_SUCCESS,
  DELETE_UNARCHIVE_COURSE_REQUEST_FAIL,
  GET_UNARCHIVE_COURSE_REQUEST_DELETED_VALUE_SUCCESS,
  GET_UNARCHIVE_COURSE_REQUEST_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  unarchiveCourseRequests: [],
  deleted: {},
  error: {},
};

const unarchiveCourseRequests = (state = INIT_STATE, action) => {
  switch (action.type) {
    case UNARCHIVE_COURSE_REQUESTS_SUCCESS:
      return {
        ...state,
        unarchiveCourseRequests: action.payload,
        deleted: {},
      };
    case UNARCHIVE_COURSE_REQUESTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_UNARCHIVE_COURSE_REQUEST_SUCCESS:
      return {
        ...state,
        unarchiveCourseRequests: [
          ...state.unarchiveCourseRequests,
          action.payload,
        ],
      };
    case ADD_UNARCHIVE_COURSE_REQUEST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_UNARCHIVE_COURSE_REQUEST_SUCCESS:
      return {
        ...state,
        unarchiveCourseRequests: state.unarchiveCourseRequests.map(request =>
          request.Id.toString() === action.payload.Id.toString()
            ? { request, ...action.payload }
            : request
        ),
      };
    case UPDATE_UNARCHIVE_COURSE_REQUEST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_UNARCHIVE_COURSE_REQUEST_SUCCESS:
      return {
        ...state,
        unarchiveCourseRequests: state.unarchiveCourseRequests.filter(
          request => request.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };
    case DELETE_UNARCHIVE_COURSE_REQUEST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_UNARCHIVE_COURSE_REQUEST_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };
    case GET_UNARCHIVE_COURSE_REQUEST_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default unarchiveCourseRequests;
