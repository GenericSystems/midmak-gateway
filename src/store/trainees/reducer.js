import {
  GET_TRAINEES_SUCCESS,
  GET_TRAINEES_FAIL,
  ADD_TRAINEE_SUCCESS,
  ADD_TRAINEE_FAIL,
  UPDATE_TRAINEE_SUCCESS,
  UPDATE_TRAINEE_FAIL,
  DELETE_TRAINEE_SUCCESS,
  DELETE_TRAINEE_FAIL,
  GET_TRAINEE_DELETED_VALUE_SUCCESS,
  GET_TRAINEE_DELETED_VALUE_FAIL,
  GET_TEMP_RELATIVES_SUCCESS,
  GET_TEMP_RELATIVES_FAIL,
  GET_REGISTER_CERTIFICATES_SUCCESS,
  GET_REGISTER_CERTIFICATES_FAIL,
  GET_TRAINEE_DEFAULT_REGREQDOCS_SUCCESS,
  GET_TRAINEE_DEFAULT_REGREQDOCS_FAIL,
  GET_SOCIAL_STATUS_SUCCESS,
  GET_SOCIAL_STATUS_FAIL,
  ADD_PROFESSIONAL_EXPERIENCE_SUCCESS,
  ADD_PROFESSIONAL_EXPERIENCE_FAIL,
  UPDATE_PROFESSIONAL_EXPERIENCE_SUCCESS,
  UPDATE_PROFESSIONAL_EXPERIENCE_FAIL,
  DELETE_PROFESSIONAL_EXPERIENCE_SUCCESS,
  DELETE_PROFESSIONAL_EXPERIENCE_FAIL,
  ADD_REQUIRED_DOCS_SUCCESS,
  ADD_REQUIRED_DOCS_FAIL,
  UPDATE_REQUIRED_DOCS_SUCCESS,
  UPDATE_REQUIRED_DOCS_FAIL,
  GENERATE_TRAINEE_SUCCESS,
  GENERATE_TRAINEE_FAIL,
  GET_TRAINEE_BY_ID_SUCCESS,
  GET_TRAINEE_BY_ID_FAIL,
  GET_TRAINEE_STATUS_SUCCESS,
  GET_TRAINEE_STATUS_FAIL,
  GET_TRAINEES_OPT_SUCCESS,
  GET_TRAINEES_OPT_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  trainees: [],
  deleted: {},
  error: {},
  traineesDocuments: [],
  tempRelatives: [],
  trnProfExperiences: [],
  requiredDocs: [],
  lastAddedId: 0,
  traineeById: {},
  traineesOpt: {},
  traineeStatus: {},
};

const trainees = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_TRAINEES_SUCCESS:
      return {
        ...state,
        trainees: action.payload,
      };

    case GET_TRAINEES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_TRAINEE_SUCCESS:
      return {
        ...state,
        trainees: [...state.trainees, action.payload],
        lastAddedId: action.payload.Id,
      };

    case ADD_TRAINEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_TRAINEE_SUCCESS:
      return {
        ...state,
        trainees: state.trainees.map(trainee =>
          trainee.Id.toString() === action.payload.Id.toString()
            ? { ...trainee, ...action.payload }
            : trainee
        ),
      };

    case UPDATE_TRAINEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_TRAINEE_SUCCESS:
      return {
        ...state,
        trainees: state.trainees.filter(
          trainee => trainee.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_TRAINEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_TRAINEE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    case GET_TRAINEE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_TRAINEE_DEFAULT_REGREQDOCS_SUCCESS:
      return {
        ...state,
        traineesDocuments: action.payload,
      };

    case GENERATE_TRAINEE_SUCCESS: {
      return {
        ...state,
        trainees: [...state.trainees, action.payload],
        generated_trainee: action.payload,
      };
    }

    case GENERATE_TRAINEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_TRAINEE_BY_ID_SUCCESS:
      return {
        ...state,
        traineeById: action.payload,
      };

    case GET_TRAINEE_BY_ID_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_TRAINEE_STATUS_SUCCESS:
      return {
        ...state,
        traineeStatus: action.payload,
      };

    case GET_TRAINEE_STATUS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_TRAINEES_OPT_SUCCESS:
      return {
        ...state,
        traineesOpt: action.payload,
      };
    case GET_TRAINEES_OPT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default trainees;
