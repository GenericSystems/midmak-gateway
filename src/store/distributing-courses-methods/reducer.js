import {
  GET_DISTRIBUTING_COURSES_METHODS_SUCCESS,
  GET_DISTRIBUTING_COURSES_METHODS_FAIL,
  ADD_DISTRIBUTING_COURSES_METHOD_SUCCESS,
  ADD_DISTRIBUTING_COURSES_METHOD_FAIL,
  UPDATE_DISTRIBUTING_COURSES_METHOD_SUCCESS,
  UPDATE_DISTRIBUTING_COURSES_METHOD_FAIL,
  DELETE_DISTRIBUTING_COURSES_METHOD_SUCCESS,
  DELETE_DISTRIBUTING_COURSES_METHOD_FAIL,
  GET_DISTRIBUTING_COURSES_METHODS_CONTENTS_SUCCESS,
  GET_DISTRIBUTING_COURSES_METHODS_CONTENTS_FAIL,
  ADD_DISTRIBUTING_COURSES_METHOD_CONTENT_SUCCESS,
  ADD_DISTRIBUTING_COURSES_METHOD_CONTENT_FAIL,
  UPDATE_DISTRIBUTING_COURSES_METHOD_CONTENT_SUCCESS,
  UPDATE_DISTRIBUTING_COURSES_METHOD_CONTENT_FAIL,
  DELETE_DISTRIBUTING_COURSES_METHOD_CONTENT_SUCCESS,
  DELETE_DISTRIBUTING_COURSES_METHOD_CONTENT_FAIL,

  GET_DISTRIBUTING_COURSES_SUCCESS,
  GET_DISTRIBUTING_COURSES_FAIL,
  ADD_DISTRIBUTING_COURSE_SUCCESS,
  ADD_DISTRIBUTING_COURSE_FAIL,
  DELETE_DISTRIBUTING_COURSE_SUCCESS,
  DELETE_DISTRIBUTING_COURSE_FAIL,
  COPY_DISTRIBUTING_METHODS_SUCCESS,
  COPY_DISTRIBUTING_METHODS_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  distributingCoursesMethods: [],
  distributingCoursesMethodsContents: [],
  distributingCourses: [],
  error: {},
};

const distributingCoursesMethods = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DISTRIBUTING_COURSES_METHODS_SUCCESS:
      return {
        ...state,
        distributingCoursesMethods: action.payload,
      };
    case GET_DISTRIBUTING_COURSES_METHODS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_DISTRIBUTING_COURSES_METHOD_SUCCESS:
      return {
        ...state,
        distributingCoursesMethods: [
          ...state.distributingCoursesMethods,
          action.payload,
        ],
      };

    case ADD_DISTRIBUTING_COURSES_METHOD_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      case COPY_DISTRIBUTING_METHODS_SUCCESS:
        return {
          ...state,
          distributingCoursesMethods: action.payload,
        };
  
    case COPY_DISTRIBUTING_METHODS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
  
    case UPDATE_DISTRIBUTING_COURSES_METHOD_SUCCESS:
      return {
        ...state,
        distributingCoursesMethods: state.distributingCoursesMethods.map(
          distributingCoursesMethod =>
            distributingCoursesMethod.Id === action.payload.Id
              ? { distributingCoursesMethod, ...action.payload }
              : distributingCoursesMethod
        ),
      };

    case UPDATE_DISTRIBUTING_COURSES_METHOD_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_DISTRIBUTING_COURSES_METHOD_SUCCESS:
      return {
        ...state,
        distributingCoursesMethods: state.distributingCoursesMethods.filter(
          distributingCoursesMethod =>
            distributingCoursesMethod.Id.toString() !==
            action.payload.Id.toString()
        ),
      };

    case DELETE_DISTRIBUTING_COURSES_METHOD_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    ///

    case GET_DISTRIBUTING_COURSES_METHODS_CONTENTS_SUCCESS:
      return {
        ...state,
        distributingCoursesMethodsContents: action.payload,
      };

    case GET_DISTRIBUTING_COURSES_METHODS_CONTENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_DISTRIBUTING_COURSES_METHOD_CONTENT_SUCCESS:
      return {
        ...state,
        distributingCoursesMethodsContents: [
          ...state.distributingCoursesMethodsContents,
          action.payload,
        ],
      };

    case ADD_DISTRIBUTING_COURSES_METHOD_CONTENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_DISTRIBUTING_COURSES_METHOD_CONTENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_DISTRIBUTING_COURSES_METHOD_CONTENT_SUCCESS:
      return {
        ...state,
        distributingCoursesMethodsContents:
          state.distributingCoursesMethodsContents.map(
            distributingCoursesMethodsContent =>
              distributingCoursesMethodsContent.Id === action.payload.Id
                ? { distributingCoursesMethodsContent, ...action.payload }
                : distributingCoursesMethodsContent
          ),
      };

    case DELETE_DISTRIBUTING_COURSES_METHOD_CONTENT_SUCCESS:
      return {
        ...state,
        distributingCoursesMethodsContents:
          state.distributingCoursesMethodsContents.filter(
            distributingCoursesMethodsContent =>
              distributingCoursesMethodsContent.Id.toString() !==
              action.payload.Id.toString()
          ),
      };

    case DELETE_DISTRIBUTING_COURSES_METHOD_CONTENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    //
    case GET_DISTRIBUTING_COURSES_SUCCESS:
      return {
        ...state,
        distributingCourses: action.payload,
      };
    case GET_DISTRIBUTING_COURSES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

      case ADD_DISTRIBUTING_COURSE_SUCCESS:
        return {
          ...state,
          distributingCourses: [
            ...state.distributingCourses,
            action.payload,
          ],
        };
  
      case ADD_DISTRIBUTING_COURSE_FAIL:
        return {
          ...state,
          error: action.payload,
        };

        
        case DELETE_DISTRIBUTING_COURSE_SUCCESS:
          return {
            ...state,
            distributingCourses: state.distributingCourses.filter(
              distributingCourse =>
                distributingCourse.Id.toString() !==
                action.payload.Id.toString()
            ),
          };
    
        case DELETE_DISTRIBUTING_COURSE_FAIL:
          return {
            ...state,
            error: action.payload,
          };

    default:
      return state;
  }
};

export default distributingCoursesMethods;
