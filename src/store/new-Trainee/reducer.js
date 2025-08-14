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
} from "./actionTypes";

const INIT_STATE = {
  last_created_trainee: { Id: 0 },
  trainees: [],
  socialStatus: [],
  deleted: {},
  error: {},
  traineesDocuments: [],
  tempRelatives: [],
  regcertificates: [],
  trnProfExperiences: [],
  lastAddedId: 0,
  isLoading: false,
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
    case GET_TRAINEE_DEFAULT_REGREQDOCS_FAIL:
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
    case GET_REGISTER_CERTIFICATES_SUCCESS:
      return {
        ...state,
        regcertificates: action.payload,
      };
    case GET_REGISTER_CERTIFICATES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_SOCIAL_STATUS_SUCCESS:
      return {
        ...state,
        socialStatus: action.payload,
      };

    case GET_SOCIAL_STATUS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_PROFESSIONAL_EXPERIENCE_SUCCESS:
      return {
        ...state,
        trnProfExperiences: [...state.trnProfExperiences, action.payload],
      };

    case ADD_PROFESSIONAL_EXPERIENCE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_PROFESSIONAL_EXPERIENCE_SUCCESS:
      return {
        ...state,
        trnProfExperiences: state.trnProfExperiences.map(trnProfExperience =>
          trnProfExperience.Id.toString() === action.payload.Id.toString()
            ? { ...trnProfExperience, ...action.payload }
            : trnProfExperience
        ),
      };

    case UPDATE_PROFESSIONAL_EXPERIENCE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_PROFESSIONAL_EXPERIENCE_SUCCESS:
      return {
        ...state,
        trnProfExperiences: state.trnProfExperiences.filter(
          trnProfExperience =>
            trnProfExperience.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_PROFESSIONAL_EXPERIENCE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default trainees;
