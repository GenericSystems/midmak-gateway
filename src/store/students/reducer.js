import {
  GET_STUDENTS_FAIL,
  GET_STUDENTS_SUCCESS,
  ADD_STUDENT_SUCCESS,
  ADD_STUDENT_FAIL,
  UPDATE_STUDENT_SUCCESS,
  UPDATE_STUDENT_FAIL,
  DELETE_STUDENT_SUCCESS,
  DELETE_STUDENT_FAIL,
  GET_STUDENT_BY_ID_SUCCESS,
  GET_STUDENT_BY_ID_FAIL,
  GET_DEFAULT_REGREQDOCS_FAIL,
  GET_DEFAULT_REGREQDOCS_SUCCESS,
  GENERATE_STUDENT_SUCCESS,
  GENERATE_STUDENT_FAIL,
  GET_STUDENT_DELETED_VALUE_SUCCESS,
  GET_STUDENT_DELETED_VALUE_FAIL,
  GET_TEMP_RELATIVES_SUCCESS,
  GET_TEMP_RELATIVES_FAIL,
  GET_TEMP_RELATIVE_DELETED_VALUE_SUCCESS,
  GET_TEMP_RELATIVE_DELETED_VALUE_FAIL,


} from "./actionTypes";

const INIT_STATE = {
  last_created_student: { Id: 0 },
  students: [],
  tempStudent: {},
  tempStudent_regReqDocs: [],
  generated_student: {},
  deleted: {},
  error: {},
  tempRelatives: [],
};

const students = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_STUDENTS_SUCCESS:
      return {
        ...state,
        students: action.payload,
      };

    case GET_STUDENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_STUDENT_SUCCESS: {
      return {
        ...state,
        students: [...state.students, action.payload],
        last_created_student: action.payload.Id,
      };
    }

    case ADD_STUDENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_STUDENT_SUCCESS:
      return {
        ...state,
        students: state.students.map(student =>
          student.Id === action.payload.Id
            ? { student, ...action.payload }
            : student
        ),
      };

    case UPDATE_STUDENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_STUDENT_SUCCESS:
      return {
        ...state,
        students: state.students.filter(
          student => student.Id !== action.payload.Id
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_STUDENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_STUDENT_BY_ID_SUCCESS:
      return {
        ...state,
        tempStudent: action.payload,
      };

    case GET_STUDENT_BY_ID_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_DEFAULT_REGREQDOCS_SUCCESS:
      return {
        ...state,
        tempStudent_regReqDocs: action.payload,
      };

    case GET_DEFAULT_REGREQDOCS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GENERATE_STUDENT_SUCCESS: {
      return {
        ...state,
        students: [...state.students, action.payload],
        generated_student: action.payload,
      };
    }

    case GENERATE_STUDENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_STUDENT_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    case GET_STUDENT_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_TEMP_RELATIVES_SUCCESS:
      return {
        ...state,
        tempRelatives: action.payload,
      };

    case GET_TEMP_RELATIVES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_TEMP_RELATIVE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    case GET_TEMP_RELATIVE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
 



    default:
      return state;
  }
};

export default students;
