import {
  GET_UNIVERSITY_STUDENTS_SUCCESS,
  GET_UNIVERSITY_STUDENTS_FAIL,
  ADD_UNIVERSITY_STUDENT_SUCCESS,
  ADD_UNIVERSITY_STUDENT_FAIL,
  UPDATE_UNIVERSITY_STUDENT_SUCCESS,
  UPDATE_UNIVERSITY_STUDENT_FAIL,
  DELETE_UNIVERSITY_STUDENT_SUCCESS,
  DELETE_UNIVERSITY_STUDENT_FAIL,
  GET_UNIVERSITY_STUDENT_BY_ID_SUCCESS,
  GET_UNIVERSITY_STUDENT_BY_ID_FAIL,
  GET_UNIVERSITY_STUDENT_REGREQDOCS_FAIL,
  GET_UNIVERSITY_STUDENT_REGREQDOCS_SUCCESS,
  UPDATE_UNIVERSITY_STUDENT_REGREQDOC_SUCCESS,
  UPDATE_UNIVERSITY_STUDENT_REGREQDOC_FAIL,
  GET_STUDENTS_OPT_SUCCESS,
  GET_STUDENTS_OPT_FAIL,
  ADD_BROTHER_SUCCESS,
  ADD_BROTHER_FAIL,
  GET_BROTHERS_SUCCESS,
  GET_BROTHERS_FAIL,
  DELETE_BROTHER_SUCCESS,
  DELETE_BROTHER_FAIL,
  UPDATE_BROTHER_SUCCESS,
  UPDATE_BROTHER_FAIL,
  GET_STD_RELATIVES_SUCCESS,
  GET_STD_RELATIVES_FAIL,
  ADD_STD_RELATIVE_SUCCESS,
  ADD_STD_RELATIVE_FAIL,
  UPDATE_STD_RELATIVE_SUCCESS,
  UPDATE_STD_RELATIVE_FAIL,
  DELETE_STD_RELATIVE_SUCCESS,
  DELETE_STD_RELATIVE_FAIL,
  GET_STD_RELATIVE_DELETED_VALUE_SUCCESS,
  GET_STD_RELATIVE_DELETED_VALUE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  universityStudents: [],
  tempUniversityStudent: {},
  tempUniversityStudent_regReqDocs: [],
  studentsOpt: [],
  studentBrothers: [],
  error: {},
  stdRelatives: [],
};

const universityStudents = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_UNIVERSITY_STUDENTS_SUCCESS:
      return {
        ...state,
        universityStudents: action.payload,
      };
    case GET_UNIVERSITY_STUDENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_UNIVERSITY_STUDENT_SUCCESS:
      return {
        ...state,
        universityStudents: [...state.universityStudents, action.payload],
      };

    case ADD_UNIVERSITY_STUDENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_UNIVERSITY_STUDENT_SUCCESS:
      return {
        ...state,
        universityStudents: state.universityStudents.map(universityStudent =>
          universityStudent.Id === action.payload.Id
            ? { universityStudent, ...action.payload }
            : universityStudent
        ),
      };

    case UPDATE_UNIVERSITY_STUDENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_UNIVERSITY_STUDENT_SUCCESS:
      return {
        ...state,
        universityStudents: state.universityStudents.filter(
          universityStudent =>
            universityStudent.Id.toString() !== action.payload.Id.toString()
        ),
      };

    case DELETE_UNIVERSITY_STUDENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_UNIVERSITY_STUDENT_BY_ID_SUCCESS:
      return {
        ...state,
        tempUniversityStudent: action.payload,
      };

    case GET_UNIVERSITY_STUDENT_BY_ID_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_UNIVERSITY_STUDENT_REGREQDOCS_SUCCESS:
      return {
        ...state,
        tempUniversityStudent_regReqDocs: action.payload,
      };

    case GET_UNIVERSITY_STUDENT_REGREQDOCS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_UNIVERSITY_STUDENT_REGREQDOC_SUCCESS:
      return {
        ...state,
        tempUniversityStudent_regReqDocs:
          state.tempUniversityStudent_regReqDocs.map(
            tempUniversityStudent_regReqDoc =>
              tempUniversityStudent_regReqDoc.Id.toString() ===
              action.payload.Id.toString()
                ? { tempUniversityStudent_regReqDoc, ...action.payload }
                : tempUniversityStudent_regReqDoc
          ),
      };

    case UPDATE_UNIVERSITY_STUDENT_REGREQDOC_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_STUDENTS_OPT_SUCCESS:
      return {
        ...state,
        studentsOpt: action.payload,
      };
    case GET_STUDENTS_OPT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_BROTHER_SUCCESS:
      return {
        ...state,
        studentBrothers: [...state.studentBrothers, action.payload],
      };

    case ADD_BROTHER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_BROTHER_SUCCESS:
      return {
        ...state,
        studentBrothers: state.studentBrothers.filter(
          studentBrother =>
            studentBrother.Id.toString() !== action.payload.Id.toString()
        ),
      };

    case DELETE_BROTHER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_BROTHER_SUCCESS:
      return {
        ...state,
        studentBrothers: state.studentBrothers.map(studentBrother =>
          studentBrother.Id.toString() === action.payload.Id.toString()
            ? { studentBrother, ...action.payload }
            : studentBrother
        ),
      };

    case UPDATE_BROTHER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_BROTHERS_SUCCESS:
      return {
        ...state,
        studentBrothers: action.payload,
      };
    case GET_BROTHERS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_STD_RELATIVES_SUCCESS:
      return {
        ...state,
        stdRelatives: action.payload,
      };

    case GET_STD_RELATIVES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_STD_RELATIVE_SUCCESS: {
      return {
        ...state,
        stdRelatives: [...state.stdRelatives, action.payload],
        last_created_stdRelative: action.payload.Id,
      };
    }

    case ADD_STD_RELATIVE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_STD_RELATIVE_SUCCESS:
      return {
        ...state,
        stdRelatives: state.stdRelatives.map(stdRelative =>
          stdRelative.Id.toString() === action.payload.Id.toString()
            ? { stdRelative, ...action.payload }
            : stdRelative
        ),
      };

    case UPDATE_STD_RELATIVE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_STD_RELATIVE_SUCCESS:
      return {
        ...state,
        stdRelatives: state.stdRelatives.filter(
          stdRelative => stdRelative.Id !== action.payload.Id
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_STD_RELATIVE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_STD_RELATIVE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    case GET_STD_RELATIVE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default universityStudents;
