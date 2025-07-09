import {
  GET_ACADEMY_BUILDING_STRUCTURES,
  GET_ACADEMY_BUILDING_STRUCTURES_SUCCESS,
  GET_ACADEMY_BUILDING_STRUCTURES_FAIL,
  GET_HALLS,
  GET_HALLS_SUCCESS,
  GET_HALLS_FAIL,
  GET_HALL_TYPES,
  GET_HALL_TYPES_SUCCESS,
  GET_HALL_TYPES_FAIL,
  ADD_NEW_ACADEMY_BUILDING_STRUCTURE,
  ADD_ACADEMY_BUILDING_STRUCTURE_SUCCESS,
  ADD_ACADEMY_BUILDING_STRUCTURE_FAIL,
  UPDATE_ACADEMY_BUILDING_STRUCTURE,
  UPDATE_ACADEMY_BUILDING_STRUCTURE_SUCCESS,
  UPDATE_ACADEMY_BUILDING_STRUCTURE_FAIL,
  DELETE_ACADEMY_BUILDING_STRUCTURE,
  DELETE_ACADEMY_BUILDING_STRUCTURE_SUCCESS,
  DELETE_ACADEMY_BUILDING_STRUCTURE_FAIL,
  GET_ACADEMY_BUILDING_STRUCTURE_DELETED_VALUE,
  GET_ACADEMY_BUILDING_STRUCTURE_DELETED_VALUE_SUCCESS,
  GET_ACADEMY_BUILDING_STRUCTURE_DELETED_VALUE_FAIL,
} from "./actionTypes";

export const getAcademyBuildingStructures = () => ({
  type: GET_ACADEMY_BUILDING_STRUCTURES,
});

export const getAcademyBuildingStructuresSuccess =
  academyBuildingStructures => ({
    type: GET_ACADEMY_BUILDING_STRUCTURES_SUCCESS,
    payload: academyBuildingStructures,
  });

export const getAcademyBuildingStructuresFail = error => ({
  type: GET_ACADEMY_BUILDING_STRUCTURES_FAIL,
  payload: error,
});

export const getHalls = () => ({
  type: GET_HALLS,
});

export const getHallsSuccess = halls => ({
  type: GET_HALLS_SUCCESS,
  payload: halls,
});

export const getHallsFail = error => ({
  type: GET_HALLS_FAIL,
  payload: error,
});

export const getHallTypes = () => ({
  type: GET_HALL_TYPES,
});

export const getHallTypesSuccess = halls => ({
  type: GET_HALL_TYPES_SUCCESS,
  payload: halls,
});

export const getHallTypesFail = error => ({
  type: GET_HALL_TYPES_FAIL,
  payload: error,
});

export const getAcademyBuildingStructureDeletedValue = () => ({
  type: GET_ACADEMY_BUILDING_STRUCTURE_DELETED_VALUE,
});

export const getAcademyBuildingStructureDeletedValueSuccess =
  academyBuildingStructureProfile => ({
    type: GET_ACADEMY_BUILDING_STRUCTURE_DELETED_VALUE_SUCCESS,
    payload: academyBuildingStructureProfile,
  });

export const getAcademyBuildingStructureDeletedValueFail = error => ({
  type: GET_ACADEMY_BUILDING_STRUCTURE_DELETED_VALUE_FAIL,
  payload: error,
});

export const addNewAcademyBuildingStructure = academyBuildingStructure => ({
  type: ADD_NEW_ACADEMY_BUILDING_STRUCTURE,
  payload: academyBuildingStructure,
});

export const addAcademyBuildingStructureSuccess = academyBuildingStructure => ({
  type: ADD_ACADEMY_BUILDING_STRUCTURE_SUCCESS,
  payload: academyBuildingStructure,
});

export const addAcademyBuildingStructureFail = error => ({
  type: ADD_ACADEMY_BUILDING_STRUCTURE_FAIL,
  payload: error,
});

export const updateAcademyBuildingStructure = academyBuildingStructure => {
  return {
    type: UPDATE_ACADEMY_BUILDING_STRUCTURE,
    payload: academyBuildingStructure,
  };
};

export const updateAcademyBuildingStructureSuccess =
  academyBuildingStructure => ({
    type: UPDATE_ACADEMY_BUILDING_STRUCTURE_SUCCESS,
    payload: academyBuildingStructure,
  });

export const updateAcademyBuildingStructureFail = error => ({
  type: UPDATE_ACADEMY_BUILDING_STRUCTURE_FAIL,
  payload: error,
});

export const deleteAcademyBuildingStructure = academyBuildingStructure => ({
  type: DELETE_ACADEMY_BUILDING_STRUCTURE,
  payload: academyBuildingStructure,
});

export const deleteAcademyBuildingStructureSuccess =
  academyBuildingStructure => ({
    type: DELETE_ACADEMY_BUILDING_STRUCTURE_SUCCESS,
    payload: academyBuildingStructure,
  });

export const deleteAcademyBuildingStructureFail = error => ({
  type: DELETE_ACADEMY_BUILDING_STRUCTURE_FAIL,
  payload: error,
});
