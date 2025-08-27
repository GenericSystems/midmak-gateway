import {
  GET_TEMP_TRAINEES_SUCCESS,
  GET_TEMP_TRAINEES_FAIL,
  ADD_TEMP_TRAINEE_SUCCESS,
  ADD_TEMP_TRAINEE_FAIL,
  UPDATE_TEMP_TRAINEE_SUCCESS,
  UPDATE_TEMP_TRAINEE_FAIL,
  DELETE_TEMP_TRAINEE_SUCCESS,
  DELETE_TEMP_TRAINEE_FAIL,
  GET_TEMP_TRAINEE_DELETED_VALUE_SUCCESS,
  GET_TEMP_TRAINEE_DELETED_VALUE_FAIL,
  GET_REGISTER_CERTIFICATES_SUCCESS,
  GET_REGISTER_CERTIFICATES_FAIL,
  GET_TEMP_TRAINEE_DEFAULT_REGREQDOCS_SUCCESS,
  GET_TEMP_TRAINEE_DEFAULT_REGREQDOCS_FAIL,
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
  GENERATE_TEMP_TRAINEE_SUCCESS,
  GENERATE_TEMP_TRAINEE_FAIL,
  GET_TEMP_TRAINEE_BY_ID_SUCCESS,
  GET_TEMP_TRAINEE_BY_ID_FAIL,
  GET_TEMP_TRAINEE_STATUS_SUCCESS,
  GET_TEMP_TRAINEE_STATUS_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  tempTrainees: [],
  socialStatus: [],
  tempTraineeStatus: [],
  deleted: {},
  error: {},
  tempTraineesDocuments: [],
  tempRelatives: [],
  regcertificates: [],
  trnProfExperiences: [],
  requiredDocs: [],
  lastAddedId: 0,
  tempTrainee: {},
  generated_tempTrainee: {},
};

const tempTrainees = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_TEMP_TRAINEES_SUCCESS:
      return {
        ...state,
        tempTrainees: action.payload,
      };

    case GET_TEMP_TRAINEES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_TEMP_TRAINEE_SUCCESS:
      return {
        ...state,
        tempTrainees: [...state.tempTrainees, action.payload],
        lastAddedId: action.payload.Id,
      };

    case ADD_TEMP_TRAINEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_TEMP_TRAINEE_SUCCESS:
      return {
        ...state,
        tempTrainees: state.tempTrainees.map(tempTrainee =>
          tempTrainee.Id.toString() === action.payload.Id.toString()
            ? { ...tempTrainee, ...action.payload }
            : tempTrainee
        ),
      };

    case UPDATE_TEMP_TRAINEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_TEMP_TRAINEE_SUCCESS:
      return {
        ...state,
        tempTrainees: state.tempTrainees.filter(
          tempTrainee =>
            tempTrainee.Id.toString() !== action.payload.Id.toString()
        ),
        deleted: action.payload.deleted,
      };

    case DELETE_TEMP_TRAINEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_TEMP_TRAINEE_DELETED_VALUE_SUCCESS:
      return {
        ...state,
        deleted: action.payload.deleted,
      };

    case GET_TEMP_TRAINEE_DELETED_VALUE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_TEMP_TRAINEE_DEFAULT_REGREQDOCS_SUCCESS:
      return {
        ...state,
        tempTraineesDocuments: action.payload,
      };
    case GET_TEMP_TRAINEE_DEFAULT_REGREQDOCS_FAIL:
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

    case ADD_REQUIRED_DOCS_SUCCESS:
      return {
        ...state,
        requiredDocs: [...state.requiredDocs, action.payload],
      };

    case ADD_REQUIRED_DOCS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_REQUIRED_DOCS_SUCCESS:
      return {
        ...state,
        requiredDocs: state.requiredDocs.map(requiredDoc =>
          requiredDoc.Id.toString() === action.payload.Id.toString()
            ? { ...requiredDoc, ...action.payload }
            : requiredDoc
        ),
      };

    case UPDATE_REQUIRED_DOCS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GENERATE_TEMP_TRAINEE_SUCCESS: {
      return {
        ...state,
        tempTrainees: [...state.tempTrainees, action.payload],
        generated_TEMP_TRAINEE: action.payload,
      };
    }

    case GENERATE_TEMP_TRAINEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_TEMP_TRAINEE_BY_ID_SUCCESS:
      return {
        ...state,
        tempTrainee: action.payload,
      };

    case GET_TEMP_TRAINEE_BY_ID_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_TEMP_TRAINEE_STATUS_SUCCESS:
      return {
        ...state,
        tempTraineeStatus: action.payload,
      };

    case GET_TEMP_TRAINEE_STATUS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default tempTrainees;
