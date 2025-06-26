import {
  GET_COURSES_CATALOGS_SUCCESS,
  GET_COURSES_CATALOGS_FAIL,
  ADD_COURSES_CATALOGS_SUCCESS,
  ADD_COURSES_CATALOGS_FAIL,
  UPDATE_COURSES_CATALOGS_SUCCESS,
  UPDATE_COURSES_CATALOGS_FAIL,
  DELETE_COURSES_CATALOGS_SUCCESS,
  DELETE_COURSES_CATALOGS_FAIL,
  GET_COURSES_CATALOGS_DELETED_VALUE_SUCCESS,
  GET_COURSES_CATALOGS_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  coursesCatalogs: [],
  deleted: {},
  error: {},
};

const coursesCatalogs = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_COURSES_CATALOGS_SUCCESS:
      return {
        ...state,
        coursesCatalogs: action.payload,
      };

    case GET_COURSES_CATALOGS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_COURSES_CATALOGS_SUCCESS:
      return {
        ...state,
        coursesCatalogs: [...state.coursesCatalogs, action.payload],
      };

    case ADD_COURSES_CATALOGS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_COURSES_CATALOGS_SUCCESS:
      return {
        ...state,
        coursesCatalogs: state.coursesCatalogs.map(catalog =>
          catalog.Id.toString() === action.payload.Id.toString()
            ? { ...catalog, ...action.payload }
            : catalog
        ),
      };

    case UPDATE_COURSES_CATALOGS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_COURSES_CATALOGS_SUCCESS:
      return {
        ...state,
        coursesCatalogs: state.coursesCatalogs.filter(
          catalog => catalog.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_COURSES_CATALOGS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_COURSES_CATALOGS_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    case GET_COURSES_CATALOGS_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default coursesCatalogs;
