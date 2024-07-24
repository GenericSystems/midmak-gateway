import {
  GET_LETTER_GRADES_SUCCESS,
  GET_LETTER_GRADES_FAIL,
  ADD_LETTER_GRADE_SUCCESS,
  ADD_LETTER_GRADE_FAIL,
  UPDATE_LETTER_GRADE_SUCCESS,
  UPDATE_LETTER_GRADE_FAIL,
  DELETE_LETTER_GRADE_SUCCESS,
  DELETE_LETTER_GRADE_FAIL,
  GET_LETTER_GRADE_DETAILS_SUCCESS,
GET_LETTER_GRADE_DETAILS_FAIL,
ADD_LETTER_GRADE_DETAIL_SUCCESS,
ADD_LETTER_GRADE_DETAIL_FAIL,
UPDATE_LETTER_GRADE_DETAIL_SUCCESS,
UPDATE_LETTER_GRADE_DETAIL_FAIL,
DELETE_LETTER_GRADE_DETAIL_SUCCESS,
DELETE_LETTER_GRADE_DETAIL_FAIL,
GET_LETTER_GRADE_DELETED_VALUE_SUCCESS,
GET_LETTER_GRADE_DELETED_VALUE_FAIL,
GET_LETTER_GRADE_DETAILS_DELETED_VALUE_SUCCESS,
GET_LETTER_GRADE_DETAILS_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  letterGrades: [],
  letterGradeDetails:[],
  deletedDetail:null,
  error: {},
};

const letterGrades = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_LETTER_GRADES_SUCCESS:
      return {
        ...state,
        letterGrades: action.payload,
      };

    case GET_LETTER_GRADES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_LETTER_GRADE_SUCCESS:
      return {
        ...state,
        letterGrades: [...state.letterGrades, action.payload],
      };

    case ADD_LETTER_GRADE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_LETTER_GRADE_SUCCESS:
      return {
        ...state,
        letterGrades: state.letterGrades.map(letterGrade =>
          letterGrade.Id.toString() === action.payload.Id.toString()
            ? { letterGrade, ...action.payload }
            : letterGrade
        ),
      };

    case UPDATE_LETTER_GRADE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_LETTER_GRADE_SUCCESS:
      return {
        ...state,
        letterGrades: state.letterGrades.filter(
          letterGrade =>
            letterGrade.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_LETTER_GRADE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

      case GET_LETTER_GRADE_DETAILS_SUCCESS:
        return {
          ...state,
          letterGradeDetails: action.payload,
        };
    
      case GET_LETTER_GRADE_DETAILS_FAIL:
        return {
          ...state,
          error: action.payload,
        };
    
      case ADD_LETTER_GRADE_DETAIL_SUCCESS:
        return {
          ...state,
          letterGradeDetails: [...state.letterGradeDetails, action.payload],
        };
    
      case ADD_LETTER_GRADE_DETAIL_FAIL:
        return {
          ...state,
          error: action.payload,
        };
    
      case UPDATE_LETTER_GRADE_DETAIL_SUCCESS:
        return {
          ...state,
          letterGradeDetails: state.letterGradeDetails.map(letterGradeDetail =>
            letterGradeDetail.Id.toString() === action.payload.Id.toString()
              ? { letterGradeDetail, ...action.payload }
              : letterGradeDetail
          ),
        };
    
      case UPDATE_LETTER_GRADE_DETAIL_FAIL:
        return {
          ...state,
          error: action.payload,
        };
    
      case DELETE_LETTER_GRADE_DETAIL_SUCCESS:
        return {
          ...state,
          letterGradeDetails: state.letterGradeDetails.filter(
            letterGradeDetail =>
              letterGradeDetail.Id.toString() !== action.payload.Id.toString()
          ),
          deletedDetail: action.payload.deleted,
        };
    
      case DELETE_LETTER_GRADE_DETAIL_FAIL:
        return {
          ...state,
          error: action.payload,
        };

        case GET_LETTER_GRADE_DELETED_VALUE_SUCCESS:
          return {
              ...state,
              deleted: action.payload.deleted,
          }  

        case GET_LETTER_GRADE_DELETED_VALUE_FAIL:
          return {
              ...state,
              error: action.payload,
          }
          case GET_LETTER_GRADE_DETAILS_DELETED_VALUE_SUCCESS:
            return {
                ...state,
                deletedDetail: action.payload.deleted,
            }  
  
          case GET_LETTER_GRADE_DETAILS_DELETED_VALUE_FAIL:
            return {
                ...state,
                error: action.payload,
            }
    
    
    default:
      return state;
  }
};

export default letterGrades;
