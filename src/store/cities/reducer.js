import {
    GET_CITIES_SUCCESS,
    GET_CITIES_FAIL,
    ADD_CITY_SUCCESS,
    ADD_CITY_FAIL,
    UPDATE_CITY_SUCCESS,
    UPDATE_CITY_FAIL,
    DELETE_CITY_SUCCESS,
    DELETE_CITY_FAIL,
    GET_CITY_DELETED_VALUE_SUCCESS,
    GET_CITY_DELETED_VALUE_FAIL,
    IMPORT_CITIES_SUCCESS,
    IMPORT_CITIES_FAIL
  } from "./actionTypes";
  const INIT_STATE = {
      cities: [],
      deleted: {},
      error: {},
    };
    const cities = (state = INIT_STATE, action) => {
      switch (action.type) {
        case GET_CITIES_SUCCESS:
          return {
            ...state,
            cities: action.payload,
          };
        case GET_CITIES_FAIL:
          return {
            ...state,
            error: action.payload,
          };
        case ADD_CITY_SUCCESS:
          return {
            ...state,
            cities: [...state.cities, action.payload],
          };
        case ADD_CITY_FAIL:
          return {
            ...state,
            error: action.payload,
          };

          case IMPORT_CITIES_SUCCESS:
            return {
              ...state,
              cities: action.payload,
            }
      
          case IMPORT_CITIES_FAIL:
            return {
              ...state,
              error: action.payload,
            }
      
        
        case UPDATE_CITY_SUCCESS:
          return {
            ...state,
            cities: state.cities.map(city =>
              city.Id === action.payload.Id
                ? { city, ...action.payload }
                : city
            ),
          };
        case UPDATE_CITY_FAIL:
          return {
            ...state,
            error: action.payload,
          };
        case DELETE_CITY_SUCCESS:
          return {
            ...state,
            cities: state.cities.filter(
              city => city.Id !== action.payload.Id
            ),
            deleted: action.payload.deleted
          };
        case DELETE_CITY_FAIL:
          return {
            ...state,
            error: action.payload,
          };

          case GET_CITY_DELETED_VALUE_SUCCESS:
            return {
                ...state,
                deleted: action.payload.deleted,
            }

          case GET_CITY_DELETED_VALUE_FAIL:
            return {
                ...state,
                error: action.payload,
            }
       
        default:
          return state;
      }
    };
    export default cities;