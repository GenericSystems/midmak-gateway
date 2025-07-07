import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import "../Academy/Academy.scss";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import { Container, Form, Input } from "reactstrap";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Row, Col, Alert } from "reactstrap";
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";
import { connect } from "react-redux";
import { isEmpty, size, map } from "lodash";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  TextField,
} from "@mui/material";
import {
  getAcademyBuildingStructures,
  addNewAcademyBuildingStructure,
  updateAcademyBuildingStructure,
  deleteAcademyBuildingStructure,
  getAcademyBuildingStructureDeletedValue,
} from "store/halls/actions";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import Select from "react-select";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
} from "../../utils/menuUtils";
class HallsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      academyBuildingStructures: [],
      academyBuildingStructure: "",
      showAlert: null,
      editingAcademyName: false,
      newBuildingArName: "",
      newBuildingEnName: "",
      editBuildingArName: "",
      editBuildingEnName: "",
      newFloorArName: "",
      newFloorEnName: "",
      newFloorNum: "",
      flrBuildingId: "",
      editFloorArName: "",
      editFloorEnName: "",
      editFloorOrder: "",
      addingFloor: false,
      academyDefaultName: "Your Academy",
      expandedNodes: ["1"],
      editingAcademyName: false,
      openForm: null,
      errorMessage: null,
      successMessage: null,
      buildBeingEdited: "",
      floorBeingEdited: "",
      buildingNameError: false,
      buildingNumError: false,
      buildingCodeError: false,
      floorNameError: false,
      floorNumError: false,
      deletebBuildingModal: false,
      deleteFloorModal: false,
      selectedFloorId: null,
      selectedBuildingId: null,
      selectedBuilding: null,
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      floorId: "",

      NewHallArName: "",
      NewHallEnName: "",
      NewHallCode: "",
      NewHallOrder: "",
      NewhallTypeId: "",
      NewMaxNumOfPer: "",
      NewCurrentNumOfPer: "",
      selectedHallType: null,

      editHallArName: "",
      editHallEnName: "",
      editHallCode: "",
      editHallOrder: "",
      editMaxNumOfPer: "",
      editCurrentNumOfPer: "",
      edithallTypeId: "",

      hallArnameError: false,
      hallEnnameError: false,
      hallId: "",
      floorHallId: "",
      selectedFloor: null,
      selectedHallId: null,
      deleteHallModal: false,
    };
    this.state = {
      duplicateError: null,
      deleteModal: false,
    };
  }

  componentDidMount() {
    const {
      academyBuildingStructures,
      onGetAcademyBuildingStructures,
      deleted,
      user_menu,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);

    onGetAcademyBuildingStructures();

    this.setState({ academyBuildingStructures });
    this.setState({ deleted });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { onAddNewHall, academyBuildingStructures } = this.props;
  }
  onPaginationPageChange = page => {
    if (
      this.props.user_menu !== prevProps.user_menu ||
      this.props.location.pathname !== prevProps.location.pathname
    ) {
      this.updateShowAddButton(
        this.props.user_menu,
        this.props.location.pathname
      );
      this.updateShowDeleteButton(
        this.props.user_menu,
        this.props.location.pathname
      );
      this.updateShowEditButton(
        this.props.user_menu,
        this.props.location.pathname
      );
    }
  };

  updateShowDeleteButton = (menu, pathname) => {
    const showDeleteButton = checkIsDeleteForPage(menu, pathname);
    this.setState({ showDeleteButton });
  };

  updateShowAddButton = (menu, pathname) => {
    const showAddButton = checkIsAddForPage(menu, pathname);
    this.setState({ showAddButton });
  };

  updateShowEditButton = (menu, pathname) => {
    const showEditButton = checkIsEditForPage(menu, pathname);
    this.setState({ showEditButton });
  };

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };
  onClickDelete = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };
  handleBuildingDataChange = (fieldName, value) => {
    const { openForm } = this.state;
    console.log("value", value);
    if (openForm == "building") {
      if (fieldName == "arTitle") {
        this.setState({ newBuildingArName: value });
        if (value.trim() === "") {
          this.setState({ buildingNameError: true });
        } else {
          this.setState({ buildingNameError: false });
        }
      }

      if (fieldName == "enTitle") {
        this.setState({ newBuildingEnName: value });
      }
    } else if (openForm == "editBuilding") {
      if (fieldName == "arTitle") {
        this.setState({ editBuildingArName: value });
      }

      if (fieldName == "enTitle") {
        this.setState({ editBuildingEnName: value });
      }
    }
  };

  handleFloorDataChange = (fieldName, value) => {
    const { openForm } = this.state;
    console.log("value", value);

    if (openForm == "floor") {
      if (fieldName == "floorArName") {
        this.setState({ newFloorArName: value });
        if (value.trim() === "") {
          this.setState({ floorNameError: true });
        } else {
          this.setState({ floorNameError: false });
        }
      }

      if (fieldName == "floorEnName") {
        this.setState({ newFloorEnName: value });
      }
    } else if (openForm == "editFloor") {
      if (fieldName == "floorArName") {
        this.setState({ editFloorArName: value });
      }

      if (fieldName == "floorEnName") {
        this.setState({ editFloorEnName: value });
      }
    }
  };

  handleSaveBuilding = () => {
    const { openForm, buildingId } = this.state;
    const { academyBuildingStructures } = this.props;

    if (openForm == "building") {
      const { onAddAcademyBuildingStructure } = this.props;
      const { newBuildingArName, newBuildingEnName } = this.state;

      if (newBuildingArName.trim() === "") {
        this.setState({ buildingNameError: true, saveError: true });
      } else {
        this.setState({ buildingNameError: false, saveError: false });

        const isDuplicateBuilding = academyBuildingStructures.some(
          building =>
            building.Id &&
            building.buildingArName &&
            building.buildingArName.trim() === newBuildingArName.trim()
        );

        if (isDuplicateBuilding) {
          const duplicateErrorMessage = this.props.t(
            "Building Name already exists"
          );
          this.setState({ errorMessage: duplicateErrorMessage });
        } else {
          const successSavedMessage = this.props.t(
            "Building saved successfully"
          );
          this.setState({ successMessage: successSavedMessage });

          const payload = {
            arTitle: newBuildingArName,
            enTitle: newBuildingEnName,
          };
          (payload["tablename"] = "Common_Directorate"),
            onAddAcademyBuildingStructure(payload);
        }
      }
    } else if (openForm == "editBuilding") {
      const { onUpdateAcademyBuildingStructure } = this.props;
      const { editBuildingArName, editBuildingEnName } = this.state;

      const isDuplicateBuilding = academyBuildingStructures
        .filter(building => building.Id !== buildingId)
        .some(
          building =>
            building.Id &&
            typeof building.arTitle === "string" &&
            building.arTitle.trim() === editBuildingArName.trim()
        );

      if (isDuplicateBuilding) {
        const duplicateErrorMessage = this.props.t(
          "Building Name already exists"
        );
        this.setState({ errorMessage: duplicateErrorMessage });
      }
      if (!isDuplicateBuilding) {
        if (editBuildingArName.trim() === "") {
          this.setState({ buildingNameError: true, saveError: true });
        } else if (
          (editBuildingArName.trim() !== editBuildingArName.trim()) !==
          ""
        ) {
          this.setState({ buildingNameError: false, saveError: false });
        }

        if (editBuildingArName.trim() !== "") {
          const successUpdatedMessage = this.props.t(
            "Building updated successfully"
          );
          this.setState({ successMessage: successUpdatedMessage });
          const payload = {
            Id: buildingId,
            arTitle: editBuildingArName,
            enTitle: editBuildingEnName,
          };
          (payload["tablename"] = "Common_Directorate"),
            onUpdateAcademyBuildingStructure(payload);
        }
      }
    }
  };

  handleSaveFloor = () => {
    const { openForm, floorId, flrBuildingId } = this.state;
    const { academyBuildingStructures } = this.props;
    console.log(" dep form ");
    if (openForm == "floor") {
      const { onAddAcademyBuildingStructure } = this.props;
      const { newFloorArName, newFloorEnName } = this.state;

      if (newFloorArName.trim() === "") {
        this.setState({ floorNameError: true, saveError: true });
      } else {
        this.setState({ floorNameError: false, saveError: false });

        const isDuplicateFloor = academyBuildingStructures.some(
          building =>
            building.Id &&
            building.floors.some(
              floor =>
                floor.Id &&
                floor.floorArName &&
                floor.floorArName.trim() === newFloorArName.trim()
            )
        );

        const selectedBuilding = academyBuildingStructures.find(
          building => building.Id === flrBuildingId
        );

        console.log("selectedBuilding", selectedBuilding);
        if (!selectedBuilding) {
          console.log(`Building with buildingId ${flrBuildingId} not found.`);
          return;
        }

        if (isDuplicateFloor) {
          const duplicateErrorMessage = this.props.t(
            "Floor Name already exists"
          );
          this.setState({ errorMessage: duplicateErrorMessage });
        }
        const payload = {
          arTitle: newFloorArName,
          enTitle: newFloorEnName,
          buildingId: flrBuildingId,
        };
        (payload["tablename"] = "Common_Department"),
          //console.log(payload, "ppppppppppppppp");
          onAddAcademyBuildingStructure(payload);
      }
    } else if (openForm == "editFloor") {
      console.log("open edit dep form ");

      const { onUpdateAcademyBuildingStructure } = this.props;
      const { editFloorArName, editFloorEnName } = this.state;

      const isDuplicateFloor = academyBuildingStructures.some(
        building =>
          building.Id &&
          building.floors
            .filter(floor => floor.Id !== floorId)
            .some(
              floor =>
                floor.Id &&
                typeof floor.floorArName === "string" &&
                floor.floorArName.trim() === editFloorArName.trim()
            )
      );
      console.log(" dep isDuplicateFloor ", isDuplicateFloor);

      if (isDuplicateFloor) {
        console.log(" dep duplicate");

        const duplicateErrorMessage = this.props.t("Floor already exists");
        this.setState({ errorMessage: duplicateErrorMessage });
      } else {
        console.log(" dep not duplicate");

        if (editFloorArName.trim() === "") {
          this.setState({ floorNameError: true, saveError: true });
          console.log(" editFloorArName = empty");
        } else if (
          editFloorArName.trim() !== "" ||
          editFloorEnName.trim() !== ""
        ) {
          const successUpdatedMessage = this.props.t(
            "Floor updated successfully"
          );
          this.setState({
            floorNumError: false,
            saveError: false,
            successMessage: successUpdatedMessage,
          });

          const payload = {
            Id: floorId,
            arTitle: editFloorArName,
            enTitle: editFloorEnName,
            buildingId: flrBuildingId,
          };
          (payload["tablename"] = "Common_Department"),
            onUpdateAcademyBuildingStructure(payload);
        }
      }
    }
  };

  handleSaveHall = () => {
    const { openForm, hallId, floorHallId } = this.state;
    const {
      academyBuildingStructures,
      onAddAcademyBuildingStructure,
      onUpdateAcademyBuildingStructure,
      t,
    } = this.props;

    if (openForm === "hall") {
      const {
        NewHallArName,
        NewHallEnName,
        NewHallCode,
        NewHallOrder,
        NewhallTypeId,
        NewMaxNumOfPer,
        NewCurrentNumOfPer,
      } = this.state;

      // Validation
      if (NewHallArName.trim() === "") {
        this.setState({
          hallArnameError: NewHallArName.trim() === "",
          saveError: true,
        });
        return;
      }

      const selectedFloor = academyBuildingStructures
        .flatMap(building => building.floors)
        .find(floor => floor.Id === floorHallId);

      if (!selectedHall) {
        console.log(`Floor with ID ${floorHallId} not found.`);
        return;
      }

      const isDuplicateHall = selectedFloor.halls?.some(
        hall => hall.hallArName === NewHallArName
      );

      if (isDuplicateHall) {
        const duplicateErrorMessage = t("Hall Name already exists");
        this.setState({ errorMessage: duplicateErrorMessage });
      } else {
        const payload = {
          arTitle: NewHallArName,
          enTitle: NewHallEnName,
          hallOrder: parseInt(NewHallOrder, 10),
          hallCode: NewHallCode,
          hallTypeId: selectedHallType,
          maxNumOfPer: NewMaxNumOfPer,
          currentNumOfPer: NewCurrentNumOfPer,
          floorId: floorHallId,
          tablename: "Common_Organism",
        };

        const successSavedMessage = t("Hall saved successfully");
        this.setState({
          successMessage: successSavedMessage,
          saveError: false,
        });

        onAddAcademyBuildingStructure(payload);
      }
    } else if (openForm === "editHall") {
      const {
        editHallArName,
        editHallEnName,
        editHallCode,
        editHallOrder,
        edithallTypeId,
        editMaxNumOfPer,
        editCurrentNumOfPer,
      } = this.state;

      const selectedFloor = academyBuildingStructures
        .flatMap(building => building.floors)
        .find(floor => floor.Id === floorHallId);

      const isDuplicateHall = selectedFloor?.halls?.some(
        hall => hall.Id !== organismId && hall.hallArName === editOrganismArName
      );

      console.log(editHallArName, "hhhh");

      if (isDuplicateHall) {
        const duplicateErrorMessage = t("Hall already exists");
        this.setState({ errorMessage: duplicateErrorMessage });
      } else {
        if (editHallArName.trim() === "") {
          this.setState({ hallArnameError: true, saveError: true });
          return;
        }

        const payload = {
          Id: hallId,
          arTitle: editHallArName,
          enTitle: editHallEnName,
          hallOrder: parseInt(editHallOrder, 10),
          hallCode: editHallCode,
          hallTypeId: edithallTypeId,
          maxNumOfPer: editMaxNumOfPer,
          currentNumOfPer: editCurrentNumOfPer,
          floorId: floorHallId,
          tablename: "Common_Organism",
        };

        const successUpdatedMessage = t("Hall updated successfully");
        this.setState({
          hallArnameError: false,
          saveError: false,
          successMessage: successUpdatedMessage,
        });

        onUpdateAcademyBuildingStructure(payload);
      }
    }
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleSelectFaculty(rowId, fieldName, selectedValue) {
    const { onUpdateHall } = this.props;
    let onUpdate = { Id: rowId, [fieldName]: selectedValue };
    onUpdateHall(onUpdate);
  }

  handleSuccessClose = () => {
    const { onGetHallDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetHallDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetHallDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetHallDeletedValue();
  };

  handleAddBuildingForm = () => {
    this.setState({ openForm: "Building" });
    this.setState({ newBuildingArName: "" });
    this.setState({ newBuildingEnName: "" });
  };

  handleAddFloorForm = floor => {
    this.setState({ openForm: "floor" });
    this.setState({ buildFloorId: floor });
    this.setState({ newFloorArName: "" });
    this.setState({ newFloorEnName: "" });
  };

  handleEditFloor = (floor, buildingId) => {
    this.setState({ openForm: "editFloor" });
    this.setState({ floorId: floor.Id });
    this.setState({ flrBuildingId: buildingId });
    this.setState({ editFloorArName: floor.floorArName });
    this.setState({
      editFloorEnName: floor.floorEnName || "",
    });
  };

  handleEditBuilding = building => {
    this.setState({ openForm: "editBuilding" });
    this.setState({ buildingId: building.Id });
    this.setState({ editBuildingArName: building.buildingArName });
    this.setState({
      editbuildingEnName: building.buildingEnName || "",
    });
  };

  onClickDeleteBuilding = building => {
    this.setState({
      selectedBuildingId: building.Id,
      deleteBuildingModal: true,
    });
    this.setState({ selectedBuilding: building });
  };

  onClickDeleteFloor = (floorId, floor) => {
    this.setState({
      selectedFloorId: floorId,
      deleteFloorModal: true,
      selectedFloor: floor,
    });
  };

  handelAddHallForm = buildingId => {
    this.setState({ openForm: "hall" });
    this.setState({ buildHallId: buildingId });
    this.setState({ NewHallArName: "" });
    this.setState({ NewHallEnName: "" });
    this.setState({ NewHallCode: "" });
    this.setState({ NewHallOrder: "" });
    this.setState({ NewhallTypeId: selectedHallType });
    this.setState({ NewMaxNumOfPer: "" });
    this.setState({ NewCurrentNumOfPer: "" });
  };

  handelEditHall = (hall, buildingId) => {
    this.setState({ openForm: "editHall" });
    this.setState({ hallId: hall.Id });
    this.setState({ buildHallId: buildingId });
    this.setState({ editHallArName: hall.hallArName });
    this.setState({ editHallEnName: hall.hallEnName || "" });
    this.setState({ editHallCode: hall.hallCode || "" });
    this.setState({ editHallOrder: hall.hallOrder || "" });
    this.setState({ edithallTypeId: selectedHallType });
    this.setState({ editMaxNumOfPer: hall.maxNumOfPer });
    this.setState({ editCurrentNumOfPer: hall.currentNumOfPer });
  };

  render() {
    const { academyBuildingStructures, t, deleted } = this.props;
    const {
      newBuildingArName,
      newBuildingEnName,
      editBuildingArName,
      editBuildingEnName,
      newFloorArName,
      newFloorEnName,
      flrBuildingId,
      editFloorArName,
      editFloorEnName,
      selectedBuildingId,
      academyDefaultName,
      expandedNodes,
      editingAcademyName,
      openForm,
      errorMessage,
      successMessage,
      buildingBeingEdited,
      floorBeingEdited,
      buildingNameError,
      floorNameError,
      deleteBuildingModal,
      deleteFloorModal,
      showAlert,
      showAddButton,
      showDeleteButton,
      showEditButton,
      floorHallId,
      NewHallArName,
      NewHallEnName,
      NewHallCode,
      NewHallOrder,
      NewhallTypeId,
      NewCurrentNumOfPer,
      NewMaxNumOfPer,
      hallArnameError,
      editHallArName,
      editHallEnName,
      editHallCode,
      editHallOrder,
      editMaxNumOfPer,
      editCurrentNumOfPer,
      edithallTypeId,
      deleteHallModal,
    } = this.state;
    const expanded = expandedNodes || [];
    const alertMessage =
      deleted == 0 ? "Can't Delete " : "Deleted Successfully";
    return (
      <div className="page-content">
        <DeleteModal
          show={deleteBuildingModal}
          onDeleteClick={this.handleDeleteBuilding}
          onCloseClick={() => this.setState({ deleteBuildingModal: false })}
        />
        <DeleteModal
          show={deleteFloorModal}
          onDeleteClick={this.handleDeleteFloor}
          onCloseClick={() => this.setState({ deleteFloorModal: false })}
        />
        <DeleteModal
          show={deleteHallModal}
          onDeleteClick={this.handelDeleteHall}
          onCloseClick={() => this.setState({ deleteHallModal: false })}
        />
        <Row>
          <Breadcrumbs
            title={this.props.t("Academy Building Structures")}
            breadcrumbItem={this.props.t("Halls List")}
          />

          <Col lg="4">
            <Container fluid>
              <Card>
                <TreeView
                  key={"univeristy-tree"}
                  aria-label="multi-select"
                  defaultCollapseIcon={<ExpandMoreIcon />}
                  defaultExpandIcon={<ChevronRightIcon />}
                  multiSelect
                  expanded={expandedNodes}
                  onNodeToggle={(event, nodeIds) =>
                    this.setState({ expandedNodes: nodeIds })
                  }
                  sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    "& .MuiTreeItem-label": {
                      padding: "0px",
                    },
                    "& .MuiTreeItem-content": {
                      padding: "0px",
                    },
                    "& .MuiTreeItem-root": {
                      padding: "0px",
                      borderBottom: "1px solid #ddd",
                    },
                    "& .MuiTreeItem-content.Mui-expanded": {
                      padding: "0px",
                    },
                    "& .MuiTreeItem-content .MuiTreeItem-label": {
                      padding: "0px",
                    },
                  }}
                >
                  <TreeItem
                    nodeId="1"
                    key="1"
                    label={
                      editingAcademyName ? (
                        <Form className="university-name-form">
                          <Input
                            type="text"
                            value={academyInfo.universityName}
                            onChange={e =>
                              this.setState({
                                academyDefaultName: e.target.value,
                              })
                            }
                            onBlur={() =>
                              this.setState({ editingAcademyName: false })
                            }
                            autoFocus
                          />
                        </Form>
                      ) : (
                        <div className="university-name-container">
                          <div className="university-name-border">
                            <span
                              className="university-name"
                              onClick={() =>
                                this.setState({
                                  editingAcademyName: false,
                                })
                              }
                            >
                              {"Midmak Academy"}{" "}
                            </span>
                            {showAddButton && (
                              <IconButton
                                className="add-directorate-button"
                                onClick={this.handleAddBuildingForm}
                              >
                                <AddIcon className="zeButton" />
                              </IconButton>
                            )}
                          </div>
                        </div>
                      )
                    }
                  >
                    {academyBuildingStructures
                      ? academyBuildingStructures.map(
                          academyBuildingStructure => (
                            <TreeItem
                              key={academyBuildingStructure.Id}
                              nodeId={`academyBuildingStructure-${academyBuildingStructure.Id}`}
                              label={
                                <div className="directorate-item">
                                  <span>
                                    {t(academyBuildingStructure.buildingArName)}
                                  </span>
                                  <div className="directorate-item-actions">
                                    {showAddButton && (
                                      <IconButton
                                        className="add-directorate-button"
                                        onClick={() =>
                                          this.handleAddFloorForm(
                                            academyBuildingStructure.Id
                                          )
                                        }
                                      >
                                        <AddIcon className="zeButton" />
                                      </IconButton>
                                    )}
                                    {showEditButton && (
                                      <IconButton
                                        className="edit-directorate-button"
                                        onClick={() =>
                                          this.handleEditBuilding(
                                            academyBuildingStructure
                                          )
                                        }
                                      >
                                        <EditIcon className="zeButton" />
                                      </IconButton>
                                    )}

                                    {showDeleteButton && (
                                      <div className="directorate-item-actions">
                                        <IconButton
                                          className="delete-directorate-button"
                                          onClick={() =>
                                            this.onClickDeleteBuilding(
                                              academyBuildingStructure
                                            )
                                          }
                                        >
                                          <DeleteIcon className="zeButton" />
                                        </IconButton>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              }
                            >
                              {academyBuildingStructure.floors &&
                              academyBuildingStructure.floors[0].Id != null
                                ? academyBuildingStructure.floors.map(floor => (
                                    <TreeItem
                                      key={floor.Id}
                                      nodeId={`floor-${floor.Id}`}
                                      label={
                                        <div className="department-item">
                                          <span>{floor.floorArName}</span>
                                          <div className="directorate-item-actions">
                                            {showAddButton && (
                                              <IconButton
                                                className="add-directorate-button"
                                                onClick={() =>
                                                  this.handelAddHallForm(
                                                    floor.Id
                                                  )
                                                }
                                              >
                                                <AddIcon className="zeButton" />
                                              </IconButton>
                                            )}
                                            {showEditButton && (
                                              <IconButton
                                                className="delete-department-button"
                                                onClick={() =>
                                                  this.handleEditFloor(
                                                    floor,
                                                    academyBuildingStructure.Id
                                                  )
                                                }
                                              >
                                                <EditIcon className="zeButton" />
                                              </IconButton>
                                            )}
                                            {showDeleteButton && (
                                              <div className="department-item-actions">
                                                <IconButton
                                                  className="delete-department-button"
                                                  onClick={() =>
                                                    this.onClickDeleteFloor(
                                                      floor.Id,
                                                      floor
                                                    )
                                                  }
                                                >
                                                  <DeleteIcon className="zeButton" />
                                                </IconButton>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      }
                                    >
                                      {floor.halls &&
                                        floor.halls.length > 0 &&
                                        floor.halls.map(hall => (
                                          <TreeItem
                                            key={hall.Id}
                                            nodeId={`hall-${hall.Id}`}
                                            label={
                                              <div className="organism-item">
                                                <span>{hall.hallArName}</span>
                                                <div className="directorate-item-actions">
                                                  {showEditButton && (
                                                    <IconButton
                                                      className="edit-organism-button"
                                                      onClick={() =>
                                                        this.handelEditHall(
                                                          hall,
                                                          floor.Id
                                                        )
                                                      }
                                                    >
                                                      <EditIcon className="zeButton" />
                                                    </IconButton>
                                                  )}
                                                  {showDeleteButton && (
                                                    <IconButton
                                                      className="delete-organism-button"
                                                      onClick={() =>
                                                        this.onClickDeleteOrganism(
                                                          organism.Id
                                                        )
                                                      }
                                                    >
                                                      <DeleteIcon className="zeButton" />
                                                    </IconButton>
                                                  )}
                                                </div>
                                              </div>
                                            }
                                          />
                                        ))}
                                    </TreeItem>
                                  ))
                                : null}
                            </TreeItem>
                          )
                        )
                      : null}
                  </TreeItem>
                </TreeView>
              </Card>
            </Container>
          </Col>
          <Col lg="8">
            <Card>
              <CardContent>
                <div>
                  {errorMessage && (
                    <Alert
                      color="danger"
                      className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                      role="alert"
                    >
                      {errorMessage}
                      <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={this.handleErrorClose}
                      ></button>
                    </Alert>
                  )}

                  {successMessage && (
                    <Alert
                      color="success"
                      className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                      role="alert"
                    >
                      {successMessage}
                      <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={this.handleSuccessClose}
                      ></button>
                    </Alert>
                  )}
                  {deleted == 0 && showAlert && (
                    <Alert
                      color="danger"
                      className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                      role="alert"
                    >
                      {alertMessage}
                      <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={this.handleErrorDeletedClose}
                      ></button>
                    </Alert>
                  )}
                  {deleted == 1 && showAlert && (
                    <Alert
                      color="success"
                      className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                      role="alert"
                    >
                      {alertMessage}
                      <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={this.handleSuccessDeletedClose}
                      ></button>
                    </Alert>
                  )}
                </div>
                {openForm == "building" && (
                  <div>
                    <Row>
                      <Typography variant="div">
                        <h5 className="header pt-2 mb-2" id="title">
                          {t("Add New Building")}
                        </h5>
                      </Typography>
                    </Row>
                    <Row className="mt-4">
                      <Col lg="2">
                        <label
                          htmlFor="BuildingName(ar)"
                          className="col-form-label"
                        >
                          {t("Building Name(ar)")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="BuildingName(ar)"
                          name="arTitle"
                          autoComplete="off"
                          className={`form-control ${
                            buildingNameError ? "is-invalid" : ""
                          }`}
                          placeholder={t("Building Name(ar)")}
                          value={newBuildingArName}
                          onChange={e => {
                            this.handleBuildingDataChange(
                              "arTitle",
                              e.target.value
                            );
                          }}
                        />
                        {buildingNameError && (
                          <div className="invalid-feedback">
                            {t("Building Name is required")}
                          </div>
                        )}
                      </Col>
                      <Col lg="2">
                        <label
                          htmlFor="buildingName"
                          className="col-form-label"
                        >
                          {"Building Name"}:
                        </label>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="buildingName"
                          name="enTitle"
                          autoComplete="off"
                          className="form-control mb-2"
                          placeholder={t("Building Name")}
                          value={newBuildingEnName}
                          onChange={e => {
                            this.handleBuildingDataChange(
                              "enTitle",
                              e.target.value
                            );
                          }}
                        />
                      </Col>
                    </Row>
                    <div className="d-flex justify-content-end mt-4">
                      <button
                        type="button"
                        className="btn btn-primary save-building-button"
                        onClick={this.handleSaveBuilding}
                      >
                        {t("Save Building")}
                      </button>
                    </div>
                  </div>
                )}
                {openForm === "floor" && flrBuildingId && (
                  <div>
                    <Row>
                      <Typography variant="div">
                        <h5 className="header pt-2 mb-2" id="title">
                          {this.props.t("Add New Floor")}{" "}
                          {
                            academyBuildingStructures.find(
                              floor => floor.Id === selectedFloorId
                            )?.arTitle
                          }
                        </h5>
                      </Typography>
                    </Row>

                    <Row className="mt-4">
                      <Col lg="2">
                        <label
                          htmlFor="floorName(ar)"
                          className="col-form-label"
                        >
                          {t("Floor Name(ar)")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col lg="4">
                        <input
                          type="text"
                          id="floorName(ar)"
                          name="floorArName"
                          autoComplete="off"
                          className={`form-control ${
                            floorNameError ? "is-invalid" : ""
                          }`}
                          placeholder={"Floor Name(ar)"}
                          value={newFloorArName}
                          onChange={e => {
                            this.handleFloorDataChange(
                              "floorArName",
                              e.target.value
                            );
                          }}
                        />
                        {floorNameError && (
                          <div className="invalid-feedback">
                            {t("Floor Name is required")}
                          </div>
                        )}
                      </Col>
                      <Col lg="2">
                        <label htmlFor="floorName" className="col-form-label">
                          {"Floor Name"}:
                        </label>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="floorName"
                          name="floorEnName"
                          className="form-control mb-2"
                          placeholder={t("Floor Name")}
                          value={newFloorEnName}
                          onChange={e => {
                            this.handleFloorDataChange(
                              "floorEnName",
                              e.target.value
                            );
                          }}
                        />
                      </Col>
                    </Row>
                    <div className="d-flex justify-content-end mt-4">
                      <button
                        type="button"
                        className="btn btn-primary save-directorate-button"
                        onClick={this.handleSaveFloor}
                      >
                        {t("Save Floor")}
                      </button>
                    </div>
                  </div>
                )}
                {openForm === "editBuilding" && (
                  <div>
                    <Row>
                      <Typography variant="div">
                        <h5 className="header pt-2 mb-2" id="title">
                          {t("Edit Building")}
                        </h5>
                      </Typography>
                    </Row>
                    <Row className="mt-4">
                      <Col lg="2">
                        <label
                          htmlFor="BuildingName(ar)"
                          className="col-form-label"
                        >
                          {t("Building Name(ar)")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="BuildingName(ar)"
                          name="arTitle"
                          autoComplete="off"
                          className={`form-control ${
                            buildingNameError ? "is-invalid" : ""
                          }`}
                          placeholder={t("Building Name(ar)")}
                          value={editBuildingArName}
                          onChange={e => {
                            this.handleBuildingDataChange(
                              "arTitle",
                              e.target.value
                            );
                          }}
                          disabled={!showEditButton}
                        />
                        {buildingNameError && (
                          <div className="invalid-feedback">
                            {t("Building Name is required")}
                          </div>
                        )}
                      </Col>
                      <Col lg="2">
                        <label
                          htmlFor="BuildingName"
                          className="col-form-label"
                        >
                          {"Building Name"}:
                        </label>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="BuildingName"
                          name="enTitle"
                          autoComplete="off"
                          className="form-control mb-2"
                          placeholder={t("Building Name")}
                          value={editBuildingEnName}
                          onChange={e => {
                            this.handleBuildingDataChange(
                              "enTitle",
                              e.target.value
                            );
                          }}
                          disabled={!showEditButton}
                        />
                      </Col>
                    </Row>
                    <div className="d-flex justify-content-end mt-4">
                      <button
                        type="button"
                        className="btn btn-primary save-directorate-button"
                        onClick={this.handleSaveBuilding}
                      >
                        {t("Save Building")}
                      </button>
                    </div>
                  </div>
                )}
                {openForm === "editFloor" && (
                  <div>
                    <Row>
                      <Typography variant="div">
                        <h5 className="header pt-2 mb-2" id="title">
                          {t("Edit Floor")} {BuildingBeingEdited} -{" "}
                          {floorBeingEdited}
                        </h5>
                      </Typography>
                    </Row>
                    <Row className="mt-4">
                      <Col lg="2">
                        <label htmlFor="floorNameAr" className="col-form-label">
                          {t("Floor Name(ar)")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="floorNameAr"
                          name="floorArName"
                          className="form-control mb-2"
                          placeholder={t("Floor Name(ar)")}
                          value={editFloorArName}
                          onChange={e => {
                            this.handleFloorDataChange(
                              "floorArName",
                              e.target.value
                            );
                          }}
                          disabled={!showEditButton}
                        />
                        {floorNameError && (
                          <div className="invalid-feedback">
                            {t("Floor Name is required")}
                          </div>
                        )}
                      </Col>
                      <Col lg="2">
                        <label htmlFor="floorNameEn" className="col-form-label">
                          {"Floor Name"}:
                        </label>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="floorNameEn"
                          name="floorEnName"
                          className="form-control mb-2"
                          placeholder={t("Floor Name")}
                          value={editFloorEnName}
                          onChange={e => {
                            this.handleFloorDataChange(
                              "floorEnName",
                              e.target.value
                            );
                          }}
                          disabled={!showEditButton}
                        />
                      </Col>
                    </Row>
                    <div className="d-flex justify-content-end mt-4">
                      <button
                        type="button"
                        className="btn btn-primary save-directorate-button"
                        onClick={this.handleSaveFloor}
                      >
                        {t("Save Floor")}
                      </button>
                    </div>
                  </div>
                )}
                {openForm === "hall" && floorHallId && (
                  <div>
                    <Row>
                      <Typography variant="div">
                        <h5 className="header pt-2 mb-2" id="title">
                          {this.props.t("Add New Hall")}{" "}
                          {
                            academyBuildingStructures
                              .flatMap(building => building.floors)
                              .find(floor => floor.Id === floorHallId)?.arTitle
                          }
                        </h5>
                      </Typography>
                    </Row>

                    <Row className="mt-4">
                      <Col lg="2">
                        <label htmlFor="hallNameAr" className="col-form-label">
                          {t("Hall Name(ar)")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="hallNameAr"
                          name="hallArName"
                          className={`form-control mb-2 ${
                            hallArnameError ? "is-invalid" : ""
                          }`}
                          placeholder={t("Hall Name(ar)")}
                          value={NewHallArName}
                          onChange={e =>
                            this.handleHallDataChange(
                              "hallArName",
                              e.target.value
                            )
                          }
                          disabled={!showEditButton}
                        />
                        {hallArnameError && (
                          <div className="invalid-feedback">
                            {t("Hall Name is required")}
                          </div>
                        )}
                      </Col>

                      <Col lg="2">
                        <label htmlFor="hallNameEn" className="col-form-label">
                          {t("Hall Name")}:
                        </label>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="hallNameEn"
                          name="hallEnName"
                          className="form-control mb-2"
                          placeholder={t("Hall Name")}
                          value={NewHallEnName}
                          onChange={e =>
                            this.handleHallDataChange(
                              "hallEnName",
                              e.target.value
                            )
                          }
                          disabled={!showEditButton}
                        />
                      </Col>
                    </Row>

                    <Row className="mt-4">
                      <Col lg="2">
                        <label htmlFor="hallCode" className="col-form-label">
                          {t("Hall Number")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col md="4">
                        <input
                          type="number"
                          id="hallCode"
                          name="hallCode"
                          className={`form-control mb-2 ${
                            hallCodeError ? "is-invalid" : ""
                          }`}
                          placeholder={t("Hall Number")}
                          value={NewHallCode}
                          onChange={e =>
                            this.handleHallDataChange(
                              "hallCode",
                              e.target.value
                            )
                          }
                          disabled={!showEditButton}
                        />
                      </Col>

                      <Col lg="2">
                        <label htmlFor="hallOrder" className="col-form-label">
                          {t("Hall Order")}:
                        </label>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="hallOrder"
                          name="hallOrder"
                          className="form-control mb-2"
                          placeholder={t("Hall Order")}
                          value={NewHallOrder}
                          onChange={e =>
                            this.handleHallDataChange(
                              "hallOrder",
                              e.target.value
                            )
                          }
                          disabled={!showEditButton}
                        />
                      </Col>
                      <Col lg="2">
                        <label htmlFor="maxNumOfPer" className="col-form-label">
                          {t("Max Numer Of Persons")}:
                        </label>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="maxNumOfPer"
                          name="maxNumOfPer"
                          className="form-control mb-2"
                          placeholder={t("Max Numer Of Person")}
                          value={NewMaxNumOfPer}
                          onChange={e =>
                            this.handleHallDataChange(
                              "maxNumOfPer",
                              e.target.value
                            )
                          }
                          disabled={!showEditButton}
                        />
                      </Col>
                      <Col lg="2">
                        <label
                          htmlFor="currentNumOfPer"
                          className="col-form-label"
                        >
                          {t("current Number Of Persons")}:
                        </label>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="currentNumOfPer"
                          name="currentNumOfPer"
                          className="form-control mb-2"
                          placeholder={t("current Number Of Person")}
                          value={NewCurrentNumOfPer}
                          onChange={e =>
                            this.handleHallDataChange(
                              "currentNumOfPer",
                              e.target.value
                            )
                          }
                          disabled={!showEditButton}
                        />
                      </Col>
                    </Row>

                    <div className="d-flex justify-content-end mt-4">
                      <button
                        type="button"
                        className="btn btn-primary save-directorate-button"
                        onClick={this.handleSaveHall}
                      >
                        {t("Save Hall")}
                      </button>
                    </div>
                  </div>
                )}
                {openForm === "editOrganism" && (
                  <div>
                    <Row>
                      <Typography variant="div">
                        <h5 className="header pt-2 mb-2" id="title">
                          {t("Edit Hall")}{" "}
                          {
                            academyOrgStructures
                              .flatMap(directorate => directorate.departments)
                              .find(floor => floor.Id === floorHallId)?.arTitle
                          }{" "}
                          - {editHallArName}
                        </h5>
                      </Typography>
                    </Row>

                    <Row className="mt-4">
                      <Col lg="2">
                        <label htmlFor="hallNameAr" className="col-form-label">
                          {t("Hall Name(ar)")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="hallNameAr"
                          name="hallArName"
                          className={`form-control mb-2 ${
                            hallArnameError ? "is-invalid" : ""
                          }`}
                          placeholder={t("Hall Name(ar)")}
                          value={editHallArName}
                          onChange={e =>
                            this.handleHallDataChange(
                              "hallArName",
                              e.target.value
                            )
                          }
                          disabled={!showEditButton}
                        />
                        {hallArnameError && (
                          <div className="invalid-feedback">
                            {t("Hall Name is required")}
                          </div>
                        )}
                      </Col>

                      <Col lg="2">
                        <label htmlFor="hallNameEn" className="col-form-label">
                          {t("Hall Name")}:
                        </label>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="hallNameEn"
                          name="hallEnName"
                          className="form-control mb-2"
                          placeholder={t("Hall Name")}
                          value={editHallEnName}
                          onChange={e =>
                            this.handleHallDataChange(
                              "hallEnName",
                              e.target.value
                            )
                          }
                          disabled={!showEditButton}
                        />
                      </Col>
                    </Row>

                    <Row className="mt-4">
                      <Col lg="2">
                        <label htmlFor="hallCode" className="col-form-label">
                          {t("Hall Number")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col md="4">
                        <input
                          type="number"
                          id="hallCode"
                          name="hallCode"
                          className={`form-control mb-2 ${
                            hallCodeError ? "is-invalid" : ""
                          }`}
                          placeholder={t("Hall Number")}
                          value={editHallCode}
                          onChange={e =>
                            this.handleHallDataChange(
                              "hallCode",
                              e.target.value
                            )
                          }
                          disabled={!showEditButton}
                        />
                      </Col>

                      <Col lg="2">
                        <label htmlFor="hallOrder" className="col-form-label">
                          {t("Hall Order")}:
                        </label>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="hallOrder"
                          name="hallOrder"
                          className="form-control mb-2"
                          placeholder={t("Hall Order")}
                          value={editHallOrder}
                          onChange={e =>
                            this.handleHallDataChange(
                              "hallOrder",
                              e.target.value
                            )
                          }
                          disabled={!showEditButton}
                        />
                      </Col>
                      <Col lg="2">
                        <label htmlFor="maxNumOfPer" className="col-form-label">
                          {t("Max Numer Of Persons")}:
                        </label>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="maxNumOfPer"
                          name="maxNumOfPer"
                          className="form-control mb-2"
                          placeholder={t("Max Numer Of Person")}
                          value={editMaxNumOfPer}
                          onChange={e =>
                            this.handleHallDataChange(
                              "maxNumOfPer",
                              e.target.value
                            )
                          }
                          disabled={!showEditButton}
                        />
                      </Col>
                      <Col lg="2">
                        <label
                          htmlFor="currentNumOfPer"
                          className="col-form-label"
                        >
                          {t("current Number Of Persons")}:
                        </label>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="currentNumOfPer"
                          name="currentNumOfPer"
                          className="form-control mb-2"
                          placeholder={t("current Number Of Person")}
                          value={editCurrentNumOfPer}
                          onChange={e =>
                            this.handleHallDataChange(
                              "currentNumOfPer",
                              e.target.value
                            )
                          }
                          disabled={!showEditButton}
                        />
                      </Col>
                    </Row>

                    <div className="d-flex justify-content-end mt-4">
                      <button
                        type="button"
                        className="btn btn-primary save-directorate-button"
                        onClick={this.handleSaveHall}
                      >
                        {t("Save Hall")}
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = ({ academyBuildingStructures, menu_items }) => ({
  academyBuildingStructures:
    academyBuildingStructures.academyBuildingStructures || [],
  deleted: academyBuildingStructures.deleted || false,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetAcademyBuildingStructures: () =>
    dispatch(getAcademyBuildingStructures()),
  onAddNewAcademyBuildingStructure: academyBuildingStructure =>
    dispatch(addNewAcademyBuildingStructure(AcademyBuildingStructure)),
  onUpdateAcademyBuildingStructure: academyBuildingStructure =>
    dispatch(updateAcademyBuildingStructure(AcademyBuildingStructure)),
  onDeleteAcademyBuildingStructure: academyBuildingStructure =>
    dispatch(deleteAcademyBuildingStructure(AcademyBuildingStructure)),
  onGetAcademyBuildingStructureDeletedValue: () =>
    dispatch(getAcademyBuildingStructureDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(HallsList));
