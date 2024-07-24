import {
    GET_STUDENTS_REQUESTS_SUCCESS,
    GET_STUDENTS_REQUESTS_FAIL,
    ADD_STUDENT_REQUEST_SUCCESS,
    ADD_STUDENT_REQUEST_FAIL,
    UPDATE_STUDENT_REQUEST_SUCCESS,
    UPDATE_STUDENT_REQUEST_FAIL,
    DELETE_STUDENT_REQUEST_SUCCESS,
    DELETE_STUDENT_REQUEST_FAIL,
    GET_PREV_UNI_COURSES_FAIL,
    GET_PREV_UNI_COURSES_SUCCESS,
    ADD_PREV_UNI_COURSE_SUCCESS,
    ADD_PREV_UNI_COURSE_FAIL,
    UPDATE_PREV_UNI_COURSE_SUCCESS,
    UPDATE_PREV_UNI_COURSE_FAIL,
    DELETE_PREV_UNI_COURSE_SUCCESS,
    DELETE_PREV_UNI_COURSE_FAIL,
    GET_TRANSFER_COURSES_SUCCESS,
    GET_TRANSFER_COURSES_FAIL,
    ADD_TRANSFER_COURSE_SUCCESS,
    ADD_TRANSFER_COURSE_FAIL,
    UPDATE_TRANSFER_COURSE_SUCCESS,
    UPDATE_TRANSFER_COURSE_FAIL,
    UPDATE_TRANSFER_COURSE_STATE_SUCCESS,
    UPDATE_TRANSFER_COURSE_STATE_FAIL,
    DELETE_TRANSFER_COURSE_SUCCESS,
    DELETE_TRANSFER_COURSE_FAIL,
    GET_LAST_REQUEST_NUM_SUCCESS,
    GET_LAST_REQUEST_NUM_FAIL,
    GET_REQUEST_DETAILS_SUCCESS,
    GET_REQUEST_DETAILS_FAIL
    
  } from "./actionTypes";


  const INIT_STATE = {
    studentsRequests: [],
    error: {},
    transferCourses: [],
    prevUnivCourses: [],
    lastReqNum: {},
    reqDetails: []
  };
  
  const studentsRequests = (state = INIT_STATE, action) => {
    switch (action.type) {

      case GET_STUDENTS_REQUESTS_SUCCESS:
        
      return {
        ...state,
        studentsRequests: action.payload,
      };
  
      case GET_STUDENTS_REQUESTS_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case ADD_STUDENT_REQUEST_SUCCESS:
        return {
          ...state,
          studentsRequests: [...state.studentsRequests, action.payload],
        };
  
      case ADD_STUDENT_REQUEST_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case UPDATE_STUDENT_REQUEST_SUCCESS:
        return {
          ...state,
          studentsRequests: state.studentsRequests.map(studentManagement =>
            studentManagement.Id.toString() === action.payload.Id.toString()
              ? { ...studentManagement, ...action.payload }
              : studentManagement
          ),
        };
  
      case UPDATE_STUDENT_REQUEST_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case DELETE_STUDENT_REQUEST_SUCCESS:
        return {
          ...state,
          studentsRequests: state.studentsRequests.filter(
            studentManagement => studentManagement.Id.toString() !== action.payload.Id.toString()
          ),
        };
  
      case DELETE_STUDENT_REQUEST_FAIL:
        return {
          ...state,
          error: action.payload,
        };

        case GET_PREV_UNI_COURSES_SUCCESS:
          return {
            ...state,
            prevUnivCourses: action.payload,
          };
    
        case GET_PREV_UNI_COURSES_FAIL:
          return {
            ...state,
            error: action.payload,
          };

        case ADD_PREV_UNI_COURSE_SUCCESS:
          return {
            ...state,
            prevUnivCourses: [...state.prevUnivCourses, action.payload],
          };
    
        case ADD_PREV_UNI_COURSE_FAIL:
          return {
            ...state,
            error: action.payload,
          };
    
        case UPDATE_PREV_UNI_COURSE_SUCCESS:
          return {
            ...state,
            prevUnivCourses: state.prevUnivCourses.map(course =>
              course.Id === action.payload.Id
                ? { course, ...action.payload }
                : course
            ),
          };
    
        case UPDATE_PREV_UNI_COURSE_FAIL:
          return {
            ...state,
            error: action.payload,
          };
    
        case DELETE_PREV_UNI_COURSE_SUCCESS:
          return {
            ...state,
            prevUnivCourses: state.prevUnivCourses.filter(
              course => course.Id.toString() !== action.payload.Id.toString()
            ),
          };
    
        case DELETE_PREV_UNI_COURSE_FAIL:
          return {
            ...state,
            error: action.payload,
          };

          case GET_TRANSFER_COURSES_SUCCESS:
            return {
              ...state,
              transferCourses: action.payload,
            };
      
          case GET_TRANSFER_COURSES_FAIL:
            return {
              ...state,
              error: action.payload,
            };
  
    
        case ADD_TRANSFER_COURSE_SUCCESS:
          return {
            ...state,
            transferCourses: [
              ...state.transferCourses,
              action.payload,
            ],
          };
    
        case ADD_TRANSFER_COURSE_FAIL:
          return {
            ...state,
            error: action.payload,
          };
    
        case UPDATE_TRANSFER_COURSE_SUCCESS:
          return {
            ...state,
            transferCourses: state.transferCourses.map(
              course_requiredCourse =>
                course_requiredCourse.Id.toString() === action.payload.Id.toString()
                  ? { course_requiredCourse, ...action.payload }
                  : course_requiredCourse
            ),
          };
    
        case UPDATE_TRANSFER_COURSE_FAIL:
          return {
            ...state,
            error: action.payload,
          };

          case UPDATE_TRANSFER_COURSE_STATE_SUCCESS:
            return {
              ...state,
              transferCourses: action.payload,
            };
      
          case UPDATE_TRANSFER_COURSE_STATE_FAIL:
            return {
              ...state,
              error: action.payload,
            };
    
        case DELETE_TRANSFER_COURSE_SUCCESS:
          return {
            ...state,
            transferCourses: state.transferCourses.filter(
              course_requiredCourse =>
                course_requiredCourse.Id.toString() !== action.payload.Id.toString()
            ),
          };
    
        case DELETE_TRANSFER_COURSE_FAIL:
          return {
            ...state,
            error: action.payload,
          };

          case GET_LAST_REQUEST_NUM_SUCCESS:
        
          return {
            ...state,
            lastReqNum: action.payload.requestNum,
          };
      
          case GET_LAST_REQUEST_NUM_FAIL:
            return {
              ...state,
              error: action.payload,
            };
            case GET_REQUEST_DETAILS_SUCCESS:
        
            return {
              ...state,
              reqDetails: action.payload.requestNum,
            };
        
            case GET_REQUEST_DETAILS_FAIL:
              return {
                ...state,
                error: action.payload,
              };
    
  
      default:
        return state;
    }
  };
  
  export default studentsRequests;
  