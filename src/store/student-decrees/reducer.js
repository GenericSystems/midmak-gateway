import {
  GET_STUDENTS_DECREES_SUCCESS,
  GET_STUDENTS_DECREES_FAIL,
  ADD_STUDENTS_DECREES_SUCCESS,
  ADD_STUDENTS_DECREES_FAIL,
  UPDATE_STUDENTS_DECREES_SUCCESS,
  UPDATE_STUDENTS_DECREES_FAIL,
  DELETE_STUDENTS_DECREES_SUCCESS,
  DELETE_STUDENTS_DECREES_FAIL,
  GET_STUDENTS_DECREES_DELETED_VALUE_SUCCESS,
  GET_STUDENTS_DECREES_DELETED_VALUE_FAIL,
  GET_FILTERED_COURSES_PLANS_SUCCESS,
  GET_FILTERED_COURSES_PLANS_FAIL,
  GET_UNIVERSITY_STUDENTS_DECREE_SUCCESS,
  GET_UNIVERSITY_STUDENTS_DECREE_FAIL,
  GET_COURSES_DECREES_FAIL,
  GET_COURSES_DECREES_SUCCESS,
  GET_DECREE_STATUS_SUCCESS,
  GET_DECREE_STATUS_FAIL,
  GET_STUDENT_DECREES_DISMISS_SUCCESS,
  GET_STUDENT_DECREES_DISMISS_FAIL,
  
} from "./actionTypes";
const INIT_STATE = {
  studentsDecrees: [],
  studentDecreesDismiss: [],
  deleted: {},
  error: {},
  filteredCoursesPlans:[],
  universityStudentsDecrees:[],
  coursesDecrees:[],
  decreeStatus:[],
};
const studentsDecrees = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_STUDENTS_DECREES_SUCCESS:
      return {
        ...state,
        studentsDecrees: action.payload,
      };
    case GET_STUDENTS_DECREES_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_STUDENTS_DECREES_SUCCESS:
      return {
        ...state,
        studentsDecrees: [...state.studentsDecrees, action.payload],
        StudentsDecreesCourses: JSON.parse(action.payload.StudentsDecreesCourses),
      };
    case ADD_STUDENTS_DECREES_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_STUDENTS_DECREES_SUCCESS:
      return {
        ...state,
        studentsDecrees: state.studentsDecrees.map(studentsDecree =>
          studentsDecree.Id === action.payload.Id
            ? { studentsDecree, ...action.payload,
              StudentsDecreesCourses: JSON.parse(action.payload.StudentsDecreesCourses),
            }
            : studentsDecree
        ),
      };
    case UPDATE_STUDENTS_DECREES_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case DELETE_STUDENTS_DECREES_SUCCESS:
      return {
        ...state,
        studentsDecrees: state.studentsDecrees.filter(
          studentsDecree => studentsDecree.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_STUDENTS_DECREES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_STUDENTS_DECREES_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };
    case GET_STUDENTS_DECREES_DELETED_VALUE_FAIL:
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


        case GET_UNIVERSITY_STUDENTS_DECREE_SUCCESS:
          return {
            ...state,
            universityStudentsDecrees: action.payload,
          };
        case GET_UNIVERSITY_STUDENTS_DECREE_FAIL:
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

      case GET_STUDENT_DECREES_DISMISS_SUCCESS:
      return {
        ...state,
        studentDecreesDismiss: action.payload,
      };
    case GET_STUDENT_DECREES_DISMISS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};
export default studentsDecrees;
