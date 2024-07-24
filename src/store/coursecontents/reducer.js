import {
    GET_COURSE_CONTENTS_SUCCESS,
    GET_COURSE_CONTENTS_FAIL,
    ADD_COURSE_CONTENT_SUCCESS,
    ADD_COURSE_CONTENT_FAIL,
    UPDATE_COURSE_CONTENT_SUCCESS,
    UPDATE_COURSE_CONTENT_FAIL,
    DELETE_COURSE_CONTENT_SUCCESS,
    DELETE_COURSE_CONTENT_FAIL,
    GET_DEFAULTVALUES_SUCCESS,
    GET_DEFAULTVALUES_FAIL,
    GET_COURSE_CONTENT_DELETED_VALUE_SUCCESS,
    GET_COURSE_CONTENT_DELETED_VALUE_FAIL,
    } from "./actionTypes"
    
    const INIT_STATE = {
    coursecontents: [],
    defaultValues: [],
    deleted: {},
    error: {},
    }
    
    const coursecontents = (state = INIT_STATE, action) => {
    switch (action.type) {

    case GET_COURSE_CONTENTS_SUCCESS:
    return {
    ...state,
    coursecontents: action.payload,
    }

    case GET_COURSE_CONTENTS_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case ADD_COURSE_CONTENT_SUCCESS:
        return {
            ...state,
            coursecontents: [...state.coursecontents, action.payload],
        }

    case ADD_COURSE_CONTENT_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case UPDATE_COURSE_CONTENT_SUCCESS:
        return {
            ...state,
            coursecontents: state.coursecontents.map(courseContent =>
                courseContent.Id.toString() === action.payload.Id.toString()
                    ? { courseContent, ...action.payload }
                    : courseContent
            ),
        }

    case UPDATE_COURSE_CONTENT_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case DELETE_COURSE_CONTENT_SUCCESS:
        return {
            ...state,
            coursecontents: state.coursecontents.filter(
                courseContent => courseContent.Id.toString() !== action.payload.Id.toString()
            ),
            deleted: action.payload.deleted,
        }

    case DELETE_COURSE_CONTENT_FAIL:
        return {
            ...state,
            error: action.payload,
        }

    case GET_DEFAULTVALUES_SUCCESS:
        return {
            ...state,
            defaultValues: action.payload,
        }
    
    case GET_DEFAULTVALUES_FAIL:
        return {
            ...state,
            error: action.payload,
        }
        case GET_COURSE_CONTENT_DELETED_VALUE_SUCCESS:
            return {
                ...state,
                deleted: action.payload.deleted,
            }

            case GET_COURSE_CONTENT_DELETED_VALUE_FAIL:
                return {
                    ...state,
                    error: action.payload,
                }

    default:
        return state
}
}

export default coursecontents
