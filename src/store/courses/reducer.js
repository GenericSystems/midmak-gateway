import {
  GET_COURSES_SUCCESS,
  GET_COURSES_FAIL,
  ADD_COURSE_SUCCESS,
  ADD_COURSE_FAIL,
  UPDATE_COURSE_SUCCESS,
  UPDATE_COURSE_FAIL,
  DELETE_COURSE_SUCCESS,
  DELETE_COURSE_FAIL,
  GET_COURSE_REQUIRED_COURSES_SUCCESS,
  GET_COURSE_REQUIRED_COURSES_FAIL,
  ADD_COURSE_REQUIRED_COURSE_SUCCESS,
  ADD_COURSE_REQUIRED_COURSE_FAIL,
  UPDATE_COURSE_REQUIRED_COURSE_SUCCESS,
  UPDATE_COURSE_REQUIRED_COURSE_FAIL,
  DELETE_COURSE_REQUIRED_COURSE_SUCCESS,
  DELETE_COURSE_REQUIRED_COURSE_FAIL,
  GET_COURSES_OPT_SUCCESS,
  GET_COURSES_OPT_FAIL,
  GET_COURSE_DELETED_VALUE_SUCCESS,
  GET_COURSE_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  courses: [],
  coursesOpt: [],
  course_requiredCourses: [],
  courseTypes: [],
  levels: [],
  faculties: [],
  departments: [],
  deleted: {},
  error: {},
};

const courses = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_COURSES_SUCCESS:
      return {
        ...state,
        courses: action.payload,
      };
    case GET_COURSES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_COURSE_SUCCESS:
      return {
        ...state,
        courses: [...state.courses, action.payload],
      };

    case ADD_COURSE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_COURSE_SUCCESS:
      return {
        ...state,
        courses: state.courses.map(course =>
          course.Id === action.payload.Id
            ? { course, ...action.payload }
            : course
        ),
      };

    case UPDATE_COURSE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_COURSE_SUCCESS:
      return {
        ...state,
        courses: state.courses.filter(
          course => course.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_COURSE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    
    case GET_COURSE_REQUIRED_COURSES_SUCCESS:
      return {
        ...state,
        course_requiredCourses: action.payload,
      };

    case GET_COURSE_REQUIRED_COURSES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_COURSE_REQUIRED_COURSE_SUCCESS:
      return {
        ...state,
        course_requiredCourses: [
          ...state.course_requiredCourses,
          action.payload,
        ],
      };

    case ADD_COURSE_REQUIRED_COURSE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_COURSE_REQUIRED_COURSE_SUCCESS:
      return {
        ...state,
        course_requiredCourses: state.course_requiredCourses.map(
          course_requiredCourse =>
            course_requiredCourse.Id.toString() === action.payload.Id.toString()
              ? { course_requiredCourse, ...action.payload }
              : course_requiredCourse
        ),
      };

    case UPDATE_COURSE_REQUIRED_COURSE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_COURSE_REQUIRED_COURSE_SUCCESS:
      return {
        ...state,
        course_requiredCourses: state.course_requiredCourses.filter(
          course_requiredCourse =>
            course_requiredCourse.Id.toString() !== action.payload.Id.toString()
        ),
      };

    case DELETE_COURSE_REQUIRED_COURSE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_COURSES_OPT_SUCCESS:
      return {
        ...state,
        coursesOpt: action.payload,
      };
    case GET_COURSES_OPT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_COURSE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    case GET_COURSE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default courses;
