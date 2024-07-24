import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import { Container, Form, Input } from "reactstrap";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Row, Col, Alert, Button } from "reactstrap";
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";
import { connect } from "react-redux";
import { isEmpty, size, map } from "lodash";
import { Card, CardContent, Typography, Stack, TextField } from "@mui/material";
import Select from "react-select";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import cellEditFactory from "react-bootstrap-table2-editor";
import Tooltip from "@mui/material/Tooltip";
import BootstrapTable from "react-bootstrap-table-next";
import {
  getLevelingDecisions,
  addNewLevelingDecision,
  updateLevelingDecision,
  deleteLevelingDecision,
  getLevelingDecisionDetails,
  addNewLevelingDecisionDetail,
  updateLevelingDecisionDetail,
  deleteLevelingDecisionDetail,
  getLevelingDecisionDeletedValue,
  getLevelingDecisionDetailsDeletedValue,
  copyFaculty,
} from "store/leveling-decisions/actions";
import { Height } from "@mui/icons-material";
import zIndex from "@mui/material/styles/zIndex";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
} from "../../../utils/menuUtils";
class LevelingDecisionsTree extends Component {
  selectRef = null;
  selectFacultyRef = null;
  constructor(props) {
    super(props);
    this.state = {
      levelingDecisions: [],
      levelingDecision: [],
      openForm: false,
      showAlert: null,
      newLevelingdecision: "",
      addingLevelingDecision: false,
      editingLevelDecision: false,
      expandedNodes: ["1"],
      deleteModal: false,
      deleteModalTable: false,
      selectedLevelingDecision: null,
      selectedLevelingDecisionId: null,
      year1: "",
      year2: "",
      editeLevelingdecision: "",
      editeYear1: "",
      editeYear2: "",
      Id: "",
      levelingDecisionActive: 0,
      selectedRowId: null,
      levelingDecisionDetailDes: null,
      duplicateError: "",
      inputFocused: false,
      showButtons: false,
      facultyCopySelection: null,
      facultyId: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
    };
    this.handleEditLevelingDecision =
      this.handleEditLevelingDecision.bind(this);
    this.handleLevelingDecisionDataChange =
      this.handleLevelingDecisionDataChange.bind(this);
    this.handleSaveLevelingDecision =
      this.handleSaveLevelingDecision.bind(this);
  }

  componentDidMount() {
    const {
      levelingDecisions,
      onGetLevelingDecisions,
      years,
      estimates,
      onGetLevelingDecisionDetails,
      deleted,
      deletedDetail,
      user_menu,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    if (levelingDecisions && !levelingDecisions.length) {
      onGetLevelingDecisions();
    }

    this.setState({ levelingDecisions, deleted, deletedDetail });
    this.setState({ years });
    this.setState({ estimates });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
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
  }

  updateShowEditButton = (menu, pathname) => {
    const showEditButton = checkIsEditForPage(menu, pathname);
    this.setState({ showEditButton });
  };

  updateShowAddButton = (menu, pathname) => {
    const showAddButton = checkIsAddForPage(menu, pathname);
    this.setState({ showAddButton });
  };

  updateShowDeleteButton = (menu, pathname) => {
    const showDeleteButton = checkIsDeleteForPage(menu, pathname);
    this.setState({ showDeleteButton });
  };

  handleAddLevelingDecision = () => {
    this.setState({ addingLevelingDecision: true, editingLevelingDecision: false, levelingDecisionActive: 0 });
  };

  handleSuccess = () => {
    const { facultyCopySelection, facultyId, levelingDecisionDetailDes } =
      this.state;
    const { onCopyFaculty } = this.props;

    const facultyCopy = {
      copyFacultyId: facultyCopySelection.value,
      facultyId: facultyId.value,
      levelDecisionId: levelingDecisionDetailDes,
    };
    onCopyFaculty(facultyCopy);
  };
  handleInputBlur = () => {
    setTimeout(() => {
      this.setState({ showButtons: false });
    }, 200);
  };

  handleInputFocus = () => {
    this.setState({ showButtons: true });
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleClearInput = () => {
    this.setState({ facultySelectionCopy: null });

    this.selectRef.select.clearValue();
  };

  handleLevelingDecisionDataChange = (fieldName, value) => {
    const { addingLevelingDecision } = this.state;

    if (addingLevelingDecision) {
      this.setState({
        [fieldName]: value,
      });
    } else {
      this.setState({ editeLevelingdecision: value });
    }
  };

  handleSelectChange = (fieldName, selectedValue) => {
    const {
      addingLevelingDecision,
      facultyId,
      editingLevelDecision,
      levelingDecisionDetailDes,
    } = this.state;
    const { onGetLevelingDecisionDetails } = this.props;
    if (addingLevelingDecision) {
      if (fieldName === "fromYearId") {
        this.setState({
          year1: selectedValue,
        });
      } else if (fieldName === "toYearId") {
        this.setState({
          year2: selectedValue,
        });
      }
    } else if (!addingLevelingDecision) {
      if (fieldName === "fromYearId") {
        this.setState({
          editeYear1: selectedValue,
        });
      } else if (fieldName === "toYearId") {
        this.setState({
          editeYear2: selectedValue,
        });
      } else if (fieldName === "faculty") {
        this.setState({ facultyId: selectedValue });
        if (selectedValue != null) {
          onGetLevelingDecisionDetails(
            levelingDecisionDetailDes,
            selectedValue.value
          );
        }
      } else if (fieldName === "facultySelectionCopy") {
        this.setState({ facultyCopySelection: selectedValue });
      }
    }
  };

  handleCopyButtonClick = () => {
    this.setState(prevState => ({
      showDropdown: !prevState.showDropdown,
    }));
  };
  handleSelectChangeDetails = (rowId, fieldName, selectedValue) => {
    const { onUpdateLevelingDecisionDetail } = this.props;

    let onUpdate = { Id: rowId, [fieldName]: selectedValue };
    onUpdateLevelingDecisionDetail(onUpdate);
  };

  handleSaveLevelingDecision = () => {
    const { newLevelingdecision, year1, year2, levelingDecisionActive } =
      this.state;
    const { onAddLevelingDecision, levelingDecisions } = this.props;

    const variable = {
      title: newLevelingdecision,
     // active: levelingDecisionActive,
      fromYearId: year1,
      toYearId: year2,
    };

    if (newLevelingdecision.trim() === "") {
      this.setState({ errorMessage: "Field is empty" });
    } else {
      const isDuplicate = levelingDecisions.some(
        item => item.title === newLevelingdecision
      );

      if (isDuplicate) {
        this.setState({ errorMessage: "Duplicate entry found" });
      } else {
        const successSavedMessage = this.props.t("succeed process!!");
        this.setState({ successMessage: successSavedMessage });

        onAddLevelingDecision(variable);

        this.setState({
          newLevelingdecision: "",
          year1: "",
          year2: "",
        });
      }
      this.handleCloseAdd();
    }
  };

  handleEditLevelingDecision = levelDecision => {
    const { levelingDecisions } = this.props;

    this.setState({
      levelingDecision: levelDecision,
      editingLevelDecision: true,
      addingLevelingDecision: false,
      letterId: levelDecision.Id,
      editeLevelingdecision: levelDecision.title,
      editeYear1: levelDecision.fromYearId,
      editeYear2: levelDecision.toYearId,
     // levelingDecisionActive: levelDecision.active,
    });
  };

  handleSaveUpdate = () => {
    const { onUpdateLevelingDecision, levelingDecisions } = this.props;

    const {
      letterId,
      editeLevelingdecision,
      editeYear1,
      editeYear2,
      levelingDecisionActive,
    } = this.state;

    const isDuplicateLevelingDecision = levelingDecisions.some(
      letter =>
        letter.Id &&
        !letterId &&
        letter.title &&
        letter.title.trim() === editeLevelingdecision.trim()
    );

    if (isDuplicateLevelingDecision) {
      this.setState({ errorMessage: "Duplicate entry found" });
    } else {
      const updatvariable = {
        Id: letterId,
        title: editeLevelingdecision,
        fromYearId: editeYear1,
        toYearId: editeYear2,
      //  active: levelingDecisionActive,
      };
      onUpdateLevelingDecision(updatvariable);
      this.handleCloseUpdate;
    }
  };

  onClickDeleteLevelingDecision = letter => {
    this.setState({ selectedLevelingDecisionId: letter.Id, deleteModal: true });
    this.setState({ selectedLevelingDecision: letter });
  };

  handleDeleteLevelingdecision = () => {
    const { selectedLevelingDecision } = this.state;
    const { onDeleteLevelingDecision } = this.props;

    if (selectedLevelingDecision.Id != undefined) {
      onDeleteLevelingDecision(selectedLevelingDecision);
      this.setState({ deleteModal: false, showAlert: true });
    }
  };

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  toggleDeleteModalTable = () => {
    this.setState(prevState => ({
      deleteModalTable: !prevState.deleteModalTable,
    }));
  };
  handleErrorClose = () => {
    this.setState({ errorMessage: null, errorMessage2: null });
  };

  handleSuccessClose = () => {
    this.setState({ successMessage: null });
  };

  handleCloseAdd = () => {
    this.setState({
      addingLevelingDecision: false,
      newLevelingdecision: "",
      year1: "",
      year2: "",
    });
  };

  handleOpentable = (letterId, key) => {
    console.log("key",key)
    const { onGetLevelingDecisionDetails } = this.props;
    this.setState({
      openForm: true,
      levelingDecisionDetailDes: letterId.Id,
      levelingDecision: letterId,
      facultyId: null,
    });

    if (this.selectFacultyRef != null) {
      this.selectFacultyRef.select.clearValue();
    }
    onGetLevelingDecisionDetails(0, 0);
  };

  handleCloseUpdate = () => {
    this.setState({ editingLevelDecision: false, year1: "", year2: "" });
  };



  handleActiveToggle(levelingDecisionId) {
    const { onUpdateLevelingDecision } = this.props;
    let obj = { Id: levelingDecisionId };
    onUpdateLevelingDecision(obj);
  }

  handleLevelingDecisionsDetailsDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateLevelingDecisionDetail, levelingDecisionDetails } =
      this.props;
    /* let obUpdate = { Id: rowId, [fieldName]: fieldValue };
    onUpdateSemester(obUpdate);  */

    const isDuplicate = levelingDecisionDetails.some(
      levelingDecisionDetail =>
        levelingDecisionDetail.Id !== rowId &&
        ((levelingDecisionDetail.arTitle &&
          levelingDecisionDetail.arTitle.trim()) === fieldValue.trim() ||
          (levelingDecisionDetail.enTitle &&
            levelingDecisionDetail.enTitle.trim()) === fieldValue.trim())
    );

    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ errorMessage2: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateLevelingDecisionDetail(onUpdate);
    } else {
      this.setState({ errorMessage2: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateLevelingDecisionDetail(onUpdate);
    }
  };
  handleAddRow = () => {
    const { onAddLevelingDecisionDetail, levelingDecisionDetails } = this.props;
    const { levelingDecisionDetailDes, facultyId } = this.state;
    const emptyLevelExists = levelingDecisionDetails.some(
      row => row.levelId === null || row.minPts == null || row.MaxPts == null
    );
    if (facultyId) {
    if (emptyLevelExists) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ errorMessage2: errorMessage });
      return;
    } else {
      const newRow = {
        levelDecisionId: levelingDecisionDetailDes,
        facultyId: facultyId.value,
      };

      this.setState({ errorMessage2: null });
      onAddLevelingDecisionDetail(newRow);
    }}
    else{
      const errorMessage = this.props.t("Select a faculty");
      this.setState({ errorMessage2: errorMessage });

    }
  };
  handleDeleteRow = () => {
    const { onDeleteLevelingDecisionDetail } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteLevelingDecisionDetail({ Id: selectedRowId });

      this.setState({
        selectedRowId: null,
        deleteModalTable: false,
        showAlert: true,
      });
    }
  };
  handleChangeCheckbox = (row, fieldName) => {
    const { onUpdateLevelingDecisionDetail } = this.props;

    const newStatus = row[fieldName] ? 0 : 1;
    let ob = {
      Id: row.Id,
      [fieldName]: newStatus,
    };

    onUpdateLevelingDecisionDetail(ob);
  };

  onClickDelete = row => {
    this.setState({ selectedRowId: row.Id, deleteModalTable: true });
  };

  resetLevelingDecisionDetails = row => {
    const { onUpdateLevelingDecisionDetail } = this.props;
    let ob = {};
    ob["Id"] = row.Id;
    ob["MaxPts"] = 0;
    ob["minPts"] = 0;
    ob["levelId"] = null;

    onUpdateLevelingDecisionDetail(ob);
  };

  handleDeleteSuccessClose = () => {
    const { onGetLevelingDecisionDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetLevelingDecisionDeletedValue();
  };

  handleDeleteDetailsClose = () => {
    const { onGetLevelingDecisionDetailsDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetLevelingDecisionDetailsDeletedValue();
  };

  handleDeleteErrorClose = () => {
    const { onGetLevelingDecisionDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetLevelingDecisionDeletedValue();
  };

  render() {
    const {
      facultyCopySelection,
      showButtons,
      showDropdown,
      duplicateError,
      expandedNodes,
      editingLevelingDecisionName,
      editingLevelDecision,
      errorMessage,
      successMessage,
      addingLevelingDecision,
      deleteModal,
      year1,
      year2,
      newLevelingdecision,
      openForm,
      Id,
      editeLevelingdecision,
      editeYear1,
      editeYear2,
      letterId,
      levelingDecision,
      levelingDecisionActive,
      deleteModalTable,
      showAlert,
      errorMessage2,
      showAddButton,
      showDeleteButton,
      showEditButton,
    } = this.state;

    const {
      t,
      faculties,
      levelingDecisions,
      years,
      estimates,
      levelingDecisionDetails,
      levels,
      deleted,
      deletedDetail,
    } = this.props;

    const alertMessage =
      deleted == 0 ? "Can't Delete " : "Deleted Successfully";
    const alertMessageDetail =
      deletedDetail == 0
        ? "Can't Delete (Delete data related to it)"
        : "Deleted Successfully";
    const columns = [
      {
        dataField: "Id",
        hidden: true,
        text: this.props.t("#"),
      },

      {
        dataField: "LevelingDecisionsDecisionId",
        hidden: true,
        text: this.props.t("levelingDecision Id"),
        sort: true,
      },
      {
        dataField: "levelId",
        text: t("Levels"),
        formatter: (cell, row) => (
          <Select
            key={`level_select`}
            options={levels.filter(
              option =>
                !levelingDecisionDetails.some(
                  row => row.levelId === option.value
                )
            )}
            onChange={newValue => {
              this.handleSelectChangeDetails(row.Id, "levelId", newValue.value);
            }}
            value={levels.find(opt => opt.value == row.levelId)}
            isDisabled={!showEditButton}
          />
        ),
        editable: false,
      },
      {
        dataField: "minPts",
        text: this.props.t("Minimum Points"),
        sort: true,
        editable: showEditButton,
      },

      {
        dataField: "MaxPts",
        text: this.props.t("Maximum Points"),
        sort: true,
        editable: showEditButton,
      },

      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        hidden: !showDeleteButton,
        formatter: (cellContent, row) => (
          <div className="d-flex gap-3">
            <IconButton
              color="error"
              id="deletetooltip"
              onClick={() => this.onClickDelete(row)}
            >
              <i className="mdi mdi-delete" />
            </IconButton>

            <IconButton
              color="primary"
              onClick={() => this.resetLevelingDecisionDetails(row)}
              id="TooltipTop"
              disabled={row.levelId === null}
            >
              <i className="bx bx-reset" />
            </IconButton>
          </div>
        ),
      },
    ];

    return (
      <div className="page-content">
        <Container fluid>
          <Row>
            <Breadcrumbs
              title={t("Grades")}
              breadcrumbItem={t("Leveling Decisions")}
            />
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
                  onClick={this.handleDeleteErrorClose}
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
                  onClick={this.handleDeleteSuccessClose}
                ></button>
              </Alert>
            )}
            {duplicateError && (
              <Alert
                color="danger"
                className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                role="alert"
              >
                {duplicateError}
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={this.handleAlertClose}
                ></button>
              </Alert>
            )}
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

            <div>
              <DeleteModal
                show={deleteModal}
                onDeleteClick={this.handleDeleteLevelingdecision}
                onCloseClick={() => this.setState({ deleteModal: false })}
              />
              <DeleteModal
                show={deleteModalTable}
                onDeleteClick={this.handleDeleteRow}
                onCloseClick={() =>
                  this.setState({
                    deleteModalTable: false,
                    selectedRowId: null,
                  })
                }
              />
            </div>
            <Col lg="4">
              <Card>
                <Row>
                  <TreeView
                    key={"leveldecision-tree"}
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
                        editingLevelingDecisionName ? (
                          <Form className="university-name-form">
                            <Input
                              type="text"
                              value={this.props.t("Leveling Decisions")}
                              onChange={e =>
                                this.setState({
                                  universityDefaultName: e.target.value,
                                })
                              }
                              onBlur={() =>
                                this.setState({
                                  editingLevelingDecisionName: false,
                                })
                              }
                              autoFocus
                            />
                          </Form>
                        ) : (
                          <div>
                            <div className="university-name-border">
                              <span
                                className="university-name"
                                onClick={() =>
                                  this.setState({
                                    editingLevelingDecisionName: false,
                                  })
                                }
                              >
                                {t("Leveling Decisions")}{" "}
                              </span>
                              {showAddButton && (
                                <IconButton
                                  className="add-faculty-button"
                                  onClick={this.handleAddLevelingDecision}
                                >
                                  <AddIcon className="zeButton" />
                                </IconButton>
                              )}
                            </div>
                          </div>
                        )
                      }
                    >
                      {levelingDecisions
                        ? levelingDecisions.map((levelingDecision, index) => (
                          
                            <TreeItem
                              onClick={() =>
                                this.handleOpentable(levelingDecision, `levelingDecision-${levelingDecision.Id}-${index}`)
                              }
                              key={`levelingDecision-${levelingDecision.Id}-${index}`}
                              nodeId={`levelingDecision-${levelingDecision.Id}`}
                              label={
                                <div className="faculty-item">
                                  <span>{t(levelingDecision.title)}</span>

                                  <div className="faculty-item-actions">
                                      <Tooltip
                                        title={
                                          levelingDecision.active
                                            ? "Active"
                                            : "Inactive"
                                        }
                                        placement="top"
                                      >
                                        <span>
                                          <IconButton
                                            color="primary"
                                            disabled={!showEditButton}
                                            onClick={() =>
                                              this.handleActiveToggle(
                                                levelingDecision.Id
                                              )
                                            }
                                            className="circle-icon"
                                            hidden
                                          >
                                            {levelingDecision.active ? (
                                              <i
                                                className="bx bx-radio-circle-marked"
                                                style={{ color: "green" }}
                                              />
                                            ) : (
                                              <i
                                                className="bx bx-radio-circle"
                                                style={{ color: "red" }}
                                              />
                                            )}
                                          </IconButton>
                                        </span>
                                      </Tooltip>
                                      {showEditButton && (
                                    <IconButton
                                      className="edit-faculty-button"
                                      onClick={() =>
                                        this.handleEditLevelingDecision(
                                          levelingDecision
                                        )
                                      }
                                    >
                                      <EditIcon className="zeButton" />
                                    </IconButton>
                                  )}
                                  {showDeleteButton && (
                                    <div className="faculty-item-actions">
                                      <IconButton
                                        className="delete-faculty-button"
                                        onClick={() =>
                                          this.onClickDeleteLevelingDecision(
                                            levelingDecision
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
                            ></TreeItem>
                          ))
                        : null}
                    </TreeItem>
                  </TreeView>
                </Row>
                <Row>
                  {addingLevelingDecision && (
                    <>
                     

                      <Row className="ps-3">
                          <Col lg="4">
                            <div className="mt-2 mb-2">
                            <Input
                              type="text"
                              value={newLevelingdecision}
                              className="form-control"
                              onChange={e =>
                                this.handleLevelingDecisionDataChange(
                                  "newLevelingdecision",
                                  e.target.value
                                )
                              }
                              placeholder={t("leveling decision")}
                            />
                            </div>
                          </Col>
                          <Col lg="4">
                            <div className="mt-2 mb-2">
                              <Select
                                className="select-style select-width"
                                options={years}
                                onChange={newValue => {
                                  this.handleSelectChange(
                                    "fromYearId",
                                    newValue.value
                                  );
                                }}
                                placeholder={"from year"}
                                menuPortalTarget={document.body}
                                styles={{
                                  menu: provided => ({
                                    ...provided,
                                    position: "absolute",
                                    zIndex: 9999,
                                    top: "-120%",
                                    left: 0,
                                  }),
                                }}
                              />
                            </div>
                          </Col>
                          <Col lg="4">
                            <div className="mt-2 mb-2">
                              <Select
                                className="select-style select-width"
                                options={years}
                                onChange={newValue => {
                                  this.handleSelectChange(
                                    "toYearId",
                                    newValue.value
                                  );
                                }}
                                placeholder={"to year"}
                                menuPortalTarget={document.body}
                                styles={{
                                  menu: provided => ({
                                    ...provided,
                                    position: "absolute",
                                    zIndex: 9999,
                                    top: "-120%",
                                    left: 0,
                                  }),
                                }}
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row className="justify-content-center text-center">
                          <Col>
                          <Tooltip
                              title={this.props.t("Save")}
                              placement="bottom"
                            >
                              <IconButton
                                className="save-department-button"
                                onClick={this.handleSaveLevelingDecision}
                              >
                                <i className="far fa-save" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip
                              title={this.props.t("Close")}
                              placement="bottom"
                            >
                              <IconButton
                                className="close-department-button"
                                onClick={this.handleCloseAdd}
                              >
                                <i className="fas fa-window-close" />
                              </IconButton>
                            </Tooltip>
                          </Col>
                        </Row>
                    </>
                  )}
                </Row>
                <Row>
                  {editingLevelDecision && (
                    <>
                
                      <Row>
                          <Col lg="4" className="d-flex">
                            <div className="mt-2 mb-2 ms-2">
                            <Input
                              type="text"
                              value={editeLevelingdecision}
                              className="form-control"
                              onChange={e =>
                                this.handleLevelingDecisionDataChange(
                                  "editeLevelingdecision",
                                  e.target.value
                                )
                              }
                              placeholder={t("leveling decision")}
                            />
                            </div>
                          </Col>
                          <Col lg="4">
                            <div className="mt-2 mb-2">
                              <Select
                                className="select-style select-width"
                                options={years}
                                onChange={newValue => {
                                  this.handleSelectChange(
                                    "fromYearId",
                                    newValue.value
                                  );
                                }}
                                value={years.find(
                                  obj =>
                                    obj.value ==
                                      levelingDecisions.find(
                                        opt =>
                                          opt.fromYearId == editeYear1 &&
                                          opt.Id == letterId
                                      )?.fromYearId || ""
                                )}
                                menuPortalTarget={document.body}
                                styles={{
                                  menu: provided => ({
                                    ...provided,
                                    position: "absolute",
                                    zIndex: 9999,
                                    top: "-120%",
                                    left: 0,
                                  }),
                                }}
                              />
                            </div>
                          </Col>
                          <Col lg="4">
                            <div className="mt-2 mb-2">
                              <Select
                                className="select-style select-width"
                                options={years}
                                onChange={newValue => {
                                  this.handleSelectChange(
                                    "toYearId",
                                    newValue.value
                                  );
                                }}
                                value={years.find(
                                  obj =>
                                    obj.value ==
                                  levelingDecisions.find(
                                        opt =>
                                          opt.toYearId &&
                                          opt.toYearId == editeYear2 &&
                                          opt.Id == letterId
                                      )?.toYearId || ""
                                )}
                                menuPortalTarget={document.body} // Render the menu outside the root container
                                styles={{
                                  menu: provided => ({
                                    ...provided,
                                    position: "absolute",
                                    zIndex: 9999,
                                    top: "-120%",
                                    left: 0,
                                  }),
                                }}
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row className="justify-content-center text-center">
                          <Col>
                            <Tooltip
                              title={this.props.t("Save")}
                              placement="bottom"
                            >
                              <IconButton
                                className="save-department-button"
                                onClick={this.handleSaveUpdate}
                              >
                                <i className="far fa-save" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip
                              title={this.props.t("Close")}
                              placement="bottom"
                            >
                              <IconButton
                                className="close-department-button"
                                onClick={this.handleCloseUpdate}
                              >
                                <i className="fas fa-window-close" />
                              </IconButton>
                            </Tooltip>
                          </Col>
                        </Row>
                      
                    </>
                  )}
                </Row>
              </Card>
            </Col>

            <Col lg="8">
              <Card>
                <CardContent>
                  <div>
                    {errorMessage2 && (
                      <Alert
                        color="danger"
                        className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                        role="alert"
                      >
                        {errorMessage2}
                        <button
                          type="button"
                          className="btn-close"
                          aria-label="Close"
                          onClick={this.handleErrorClose}
                        ></button>
                      </Alert>
                    )}
                    {deletedDetail == 0 && showAlert && (
                      <Alert
                        color="danger"
                        className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                        role="alert"
                      >
                        {alertMessageDetail}
                        <button
                          type="button"
                          className="btn-close"
                          aria-label="Close"
                          onClick={this.handleDeleteDetailsClose}
                        ></button>
                      </Alert>
                    )}
                    {deletedDetail == 1 && showAlert && (
                      <Alert
                        color="success"
                        className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                        role="alert"
                      >
                        {alertMessageDetail}
                        <button
                          type="button"
                          className="btn-close"
                          aria-label="Close"
                          onClick={this.handleDeleteDetailsClose}
                        ></button>
                      </Alert>
                    )}
                  </div>
                  {openForm && (
                    <div>
                      <Row>
                        <Typography variant="div">
                          <h5 className="header pt-2 mb-2" id="title">
                            {t("Leveling Decisions Details")}{" "}
                            {levelingDecision && (
                              <span>({levelingDecision.title})</span>
                            )}
                          </h5>
                        </Typography>
                      </Row>
                      <Row>
                        <Col className="d-flex ps-3" lg="6">
                          <Select
                            ref={ref => {
                              this.selectFacultyRef = ref;
                            }}
                            className="select-style"
                            options={faculties}
                            classNamePrefix="select"
                            onChange={selectedOption => {
                              this.handleSelectChange(
                                "faculty",
                                selectedOption
                              );
                            }}
                            placeholder={"Select faculty"}
                            menuPortalTarget={document.body}
                            styles={{
                              menu: provided => ({
                                ...provided,

                                zIndex: 9999,
                              }),
                            }}
                          />
                        </Col>
                        <Col className="d-flex ps-0">
                          <Tooltip
                            title={this.props.t("Copy From")}
                            placement="top"
                          >
                            <IconButton
                              color="primary"
                              onClick={this.handleCopyButtonClick}
                            >
                              <i className="mdi mdi-content-copy blue-noti-icon" />
                            </IconButton>
                          </Tooltip>
                          {showDropdown && (
                            <Select
                              ref={ref => {
                                this.selectRef = ref;
                              }}
                              className="select-style"
                              classNamePrefix="select"
                              options={faculties}
                              onChange={selectedOption => {
                                this.handleSelectChange(
                                  "facultySelectionCopy",
                                  selectedOption
                                );
                              }}
                              menuPortalTarget={document.body}
                              styles={{
                                menu: provided => ({
                                  ...provided,
                                  zIndex: 9999,
                                }),
                              }}
                              onFocus={() => this.handleInputFocus()}
                              onBlur={() => this.handleInputBlur()}
                            />
                          )}
                          {showButtons && (
                            <div className="input-group-append d-flex align-items-center mb-3 ms-1">
                              <Button
                                type="submit"
                                color="success"
                                size="sm"
                                className="me-1"
                                onClick={() => this.handleSuccess()}
                              >
                                &#10004;
                              </Button>
                              <Button
                                color="danger"
                                size="sm"
                                onClick={() => this.handleClearInput()}
                              >
                                &#10006;
                              </Button>
                            </div>
                          )}
                          {showAddButton && (
                            <div>
                              <Tooltip
                                title={this.props.t("Add New Row")}
                                placement="top"
                              >
                                <IconButton onClick={this.handleAddRow}>
                                  <i className="mdi mdi-plus-circle blue-noti-icon" />
                                </IconButton>
                              </Tooltip>
                            </div>
                          )}
                        </Col>
                      </Row>
                      <div className="table-responsive">
                        <BootstrapTable
                          keyField="Id"
                          data={levelingDecisionDetails}
                          columns={columns}
                          cellEdit={cellEditFactory({
                            mode: "click",
                            blurToSave: true,
                            afterSaveCell: (
                              oldValue,
                              newValue,
                              row,
                              column
                            ) => {
                              this.handleLevelingDecisionsDetailsDataChange(
                                row.Id,
                                column.dataField,
                                newValue
                              );
                            },
                          })}
                          noDataIndication={t(
                            "No  Leveling Decisions Details found"
                          )}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = ({
  levelingDecisions,
  years,
  estimates,
  mobAppFacultyAccs,
  levels,
  menu_items,
}) => ({
  levelingDecisions: levelingDecisions.levelingDecisions,
  deleted: levelingDecisions.deleted,
  years: years.years,
  estimates: estimates.estimates,
  levelingDecisionDetails: levelingDecisions.levelingDecisionDetails,
  faculties: mobAppFacultyAccs.faculties,
  levels: levels.levels,
  deletedDetail: levelingDecisions.deletedDetail,
  user_menu: menu_items.user_menu || [],
});
const mapDispatchToProps = dispatch => ({
  onGetLevelingDecisions: () => dispatch(getLevelingDecisions()),
  onAddLevelingDecision: levelingDecision =>
    dispatch(addNewLevelingDecision(levelingDecision)),
  onUpdateLevelingDecision: levelingDecision =>
    dispatch(updateLevelingDecision(levelingDecision)),
  onDeleteLevelingDecision: levelingDecision =>
    dispatch(deleteLevelingDecision(levelingDecision)),

  onGetLevelingDecisionDetails: (letterId, facultyId) =>
    dispatch(getLevelingDecisionDetails(letterId, facultyId)),
  onAddLevelingDecisionDetail: levelingDecisionDetail =>
    dispatch(addNewLevelingDecisionDetail(levelingDecisionDetail)),
  onUpdateLevelingDecisionDetail: levelingDecisionDetail =>
    dispatch(updateLevelingDecisionDetail(levelingDecisionDetail)),
  onDeleteLevelingDecisionDetail: levelingDecisionDetail =>
    dispatch(deleteLevelingDecisionDetail(levelingDecisionDetail)),
  onCopyFaculty: copyFacultyData => dispatch(copyFaculty(copyFacultyData)),
  onGetLevelingDecisionDeletedValue: () =>
    dispatch(getLevelingDecisionDeletedValue()),
  onGetLevelingDecisionDetailsDeletedValue: () =>
    dispatch(getLevelingDecisionDetailsDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(LevelingDecisionsTree));
