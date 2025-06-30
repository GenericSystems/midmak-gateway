import {
  GET_COURSES_CATALOGS,
  GET_COURSES_CATALOGS_SUCCESS,
  GET_COURSES_CATALOGS_FAIL,
  ADD_NEW_COURSES_CATALOGS,
  ADD_COURSES_CATALOGS_SUCCESS,
  ADD_COURSES_CATALOGS_FAIL,
  UPDATE_COURSES_CATALOGS_SUCCESS,
  UPDATE_COURSES_CATALOGS,
  UPDATE_COURSES_CATALOGS_FAIL,
  DELETE_COURSES_CATALOGS,
  DELETE_COURSES_CATALOGS_SUCCESS,
  DELETE_COURSES_CATALOGS_FAIL,
  GET_COURSES_CATALOGS_DELETED_VALUE_SUCCESS,
  GET_COURSES_CATALOGS_DELETED_VALUE_FAIL,
  GET_COURSES_CATALOGS_DATALIST,
  GET_COURSES_CATALOGS_DATALIST_SUCCESS,
  GET_COURSES_CATALOGS_DATALIST_FAIL,
  GET_COURSE_CATALOGE_PREREQUISITES,
  GET_COURSE_CATALOGE_PREREQUISITES_SUCCESS,
  GET_COURSE_CATALOGE_PREREQUISITES_FAIL,
  ADD_NEW_COURSE_CATALOGE_PREREQUISITES,
  ADD_COURSE_CATALOGE_PREREQUISITES_SUCCESS,
  ADD_COURSE_CATALOGE_PREREQUISITES_FAIL,
  UPDATE_COURSE_CATALOGE_PREREQUISITES,
  UPDATE_COURSE_CATALOGE_PREREQUISITES_SUCCESS,
  UPDATE_COURSE_CATALOGE_PREREQUISITES_FAIL,
  DELETE_COURSE_CATALOGE_PREREQUISITES,
  DELETE_COURSE_CATALOGE_PREREQUISITES_SUCCESS,
  DELETE_COURSE_CATALOGE_PREREQUISITES_FAIL,
  GET_COURSE_CATALOGE_PREREQUISITES_DELETED_VALUE,
  GET_COURSE_CATALOGE_PREREQUISITES_DELETED_VALUE_SUCCESS,
  GET_COURSE_CATALOGE_PREREQUISITES_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  coursesCatalogs: [],
  deleted: {},
  error: {},
  isLoading: false,
  preReqCourses: [],
  coursesCatalogsPrReq: [],
  lastAddedId:0
};

const coursesCatalogs = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_COURSES_CATALOGS:
    case ADD_NEW_COURSES_CATALOGS:
    case UPDATE_COURSES_CATALOGS:
    case DELETE_COURSES_CATALOGS:
    case GET_COURSES_CATALOGS_DATALIST:
      return {
        ...state,
        isLoading: true,
      };

    case GET_COURSES_CATALOGS_SUCCESS:
      return {
        ...state,
        coursesCatalogs: action.payload,
        isLoading: false,
      };

    case GET_COURSES_CATALOGS_FAIL:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case ADD_COURSES_CATALOGS_SUCCESS:
      return {
        ...state,
        coursesCatalogs: [...state.coursesCatalogs, action.payload],
        isLoading: false,
        lastAddedId:action.payload.Id
      };

    case ADD_COURSES_CATALOGS_FAIL:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case UPDATE_COURSES_CATALOGS_SUCCESS:
      return {
        ...state,
        coursesCatalogs: state.coursesCatalogs.map(catalog =>
          catalog.Id.toString() === action.payload.Id.toString()
            ? { ...catalog, ...action.payload }
            : catalog
        ),
        isLoading: false,
      };

    case UPDATE_COURSES_CATALOGS_FAIL:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case DELETE_COURSES_CATALOGS_SUCCESS:
      return {
        ...state,
        coursesCatalogs: state.coursesCatalogs.filter(
          catalog => catalog.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
        isLoading: false,
      };

    case DELETE_COURSES_CATALOGS_FAIL:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case GET_COURSES_CATALOGS_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
        isLoading: false,
      };

    case GET_COURSES_CATALOGS_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case GET_COURSES_CATALOGS_DATALIST_SUCCESS:
      return {
        ...state,
        preReqCourses: action.payload,
        isLoading: false,
      };

    case GET_COURSES_CATALOGS_DATALIST_FAIL:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    // GET success/fail preeeereqqqq

    case GET_COURSE_CATALOGE_PREREQUISITES_SUCCESS:
      return {
        ...state,
        coursesCatalogsPrReq: action.payload,
      };

    case GET_COURSE_CATALOGE_PREREQUISITES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    // ADD success/fail
    case ADD_COURSE_CATALOGE_PREREQUISITES_SUCCESS:
      return {
        ...state,
        coursesCatalogsPrReq: [...state.coursesCatalogsPrReq, action.payload],
      };

    case ADD_COURSE_CATALOGE_PREREQUISITES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    // UPDATE success/fail
    case UPDATE_COURSE_CATALOGE_PREREQUISITES_SUCCESS:
      return {
        ...state,
        coursesCatalogsPrReq: state.coursesCatalogsPrReq.map(prereq =>
          prereq.Id.toString() === action.payload.Id.toString()
            ? { ...prereq, ...action.payload }
            : prereq
        ),
      };

    case UPDATE_COURSE_CATALOGE_PREREQUISITES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    // DELETE success/fail
    case DELETE_COURSE_CATALOGE_PREREQUISITES_SUCCESS:
      return {
        ...state,
        coursesCatalogsPrReq: state.coursesCatalogsPrReq.filter(
          prereq => prereq.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_COURSE_CATALOGE_PREREQUISITES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    // DELETED VALUE success/fail
    case GET_COURSE_CATALOGE_PREREQUISITES_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    case GET_COURSE_CATALOGE_PREREQUISITES_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default coursesCatalogs;
