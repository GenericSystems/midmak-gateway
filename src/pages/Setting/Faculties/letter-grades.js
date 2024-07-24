import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import { CardBody, Container, Form, Input } from "reactstrap";
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
  getLetterGrades,
  addNewLetterGrade,
  updateLetterGrade,
  deleteLetterGrade,
  getLetterGradeDetails,
  getLetterGradeDeletedValue,
  addNewLetterGradeDetail,
  updateLetterGradeDetail,
  deleteLetterGradeDetail,
  getLetterGradeDetailsDeletedValue,
} from "store/letter-grade/actions";
import { Height } from "@mui/icons-material";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
} from "../../../utils/menuUtils";

class LetterGradesTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      letterGrades: [],
      letterGrade: [],
      openForm: false,

      newLettergrade: "",

      addingLetterGrade: false,

      editingLattergrade: false,

      expandedNodes: ["1"],

      deleteModal: false,
      deleteModalTable: false,
      selectedLetterGrade: null,
      selectedLetterGradeId: null,
      year1: "",
      year2: "",

      editeLettergrade: "",
      editeYear1: "",
      editeYear2: "",

      Id: "",
      letterGradeActive: 0,
      selectedRowId: null,
      letterGradeDetailDes: null,
      duplicateError: "",
      showAlert: null,
      letterGrade: null,
      successMessageTable: "",
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
    };
    this.handleEditLetterGrade = this.handleEditLetterGrade.bind(this);
    this.handleLetterGradeDataChange =
      this.handleLetterGradeDataChange.bind(this);
    this.handleSaveLetterGrade = this.handleSaveLetterGrade.bind(this);
  }

  componentDidMount() {
    const {
      letterGrades,
      onGetLetterGrades,
      years,
      estimates,

      deleted,
      deletedDetail,
      user_menu,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    if (letterGrades && !letterGrades.length) {
      onGetLetterGrades();
    }

    this.setState({ letterGrades, deleted, deletedDetail });
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

  updateShowAddButton = (menu, pathname) => {
    const showAddButton = checkIsAddForPage(menu, pathname);
    this.setState({ showAddButton });
  };

  updateShowDeleteButton = (menu, pathname) => {
    const showDeleteButton = checkIsDeleteForPage(menu, pathname);
    this.setState({ showDeleteButton });
  };

  updateShowEditButton = (menu, pathname) => {
    const showEditButton = checkIsEditForPage(menu, pathname);
    this.setState({ showEditButton });
  };

  handleAddLetterGrade = () => {
    this.setState({
      addingLetterGrade: true,
      letterGradeActive: 0,
      editingLattergrade: false,
    });
  };

  handleLetterGradeDataChange = (fieldName, value) => {
    const { addingLetterGrade } = this.state;

    if (addingLetterGrade) {
      this.setState({
        [fieldName]: value,
      });
    } else {
      this.setState({ editeLettergrade: value });
    }
  };

  handleSelectChange = (fieldName, selectedValue) => {
    const { addingLetterGrade, editingLattergrade } = this.state;
    if (addingLetterGrade) {
      if (fieldName === "fromYearId") {
        this.setState({
          year1: selectedValue,
        });
      } else if (fieldName === "toYearId") {
        this.setState({
          year2: selectedValue,
        });
      }
    } else if (!addingLetterGrade) {
      if (fieldName === "fromYearId") {
        this.setState({
          editeYear1: selectedValue,
        });
      } else if (fieldName === "toYearId") {
        this.setState({
          editeYear2: selectedValue,
        });
      }
    }
  };
  handleSelectChangeDetails = (rowId, fieldName, selectedValue) => {
    const { onUpdateLetterGradeDetail } = this.props;

    let onUpdate = { Id: rowId, [fieldName]: selectedValue };
    onUpdateLetterGradeDetail(onUpdate);
  };
  handleSaveLetterGrade = () => {
    const { newLettergrade, year1, year2, letterGradeActive } = this.state;
    const { onAddLetterGrade, letterGrades } = this.props;

    const variable = {
      title: newLettergrade,
      fromYearId: year1,
      toYearId: year2,
     // active: letterGradeActive,
    };

    if (newLettergrade.trim() === "") {
      this.setState({ errorMessage: this.props.t("Field is empty") });
    } else {
      const isDuplicate = letterGrades.some(
        item => item.title === newLettergrade
      );

      if (isDuplicate) {
        this.setState({ errorMessage: this.props.t("Duplicate entry found") });
      } else {
        const successSavedMessage = this.props.t("Letter saved successfully");
        this.setState({ successMessage: successSavedMessage });

        onAddLetterGrade(variable);

        this.setState({
          newLettergrade: "",
          year1: "",
          year2: "",
        });
      }
      this.handleCloseAdd();
    }
  };

  handleEditLetterGrade = letter => {
    const { letterGrades } = this.props;

    this.setState({
      letterGrade: letter,
      editingLattergrade: true,
      addingLetterGrade: false,
      letterId: letter.Id,
      editeLettergrade: letter.title,
      editeYear1: letter.fromYearId,
      editeYear2: letter.toYearId,
    //  letterGradeActive: letter.active,
    });
  };

  handleSaveUpdate = () => {
    const { onUpdateLetterGrade, letterGrades } = this.props;

    const {
      letterId,
      editeLettergrade,
      editeYear1,
      editeYear2,
      letterGradeActive,
    } = this.state;

    const isDuplicateLetterGrade = letterGrades.some(
      letter =>
        letter.Id &&
        !letterId &&
        letter.title &&
        letter.title.trim() === editeLettergrade.trim()
    );

    if (isDuplicateLetterGrade) {
      this.setState({ errorMessage: "Duplicate entry found" });
    } else {
      const updatvariable = {
        Id: letterId,
        title: editeLettergrade,
        fromYearId: editeYear1,
        toYearId: editeYear2,
     //   active: letterGradeActive,
      };
      onUpdateLetterGrade(updatvariable);
      this.handleCloseUpdate;
    }
  };

  onClickDeleteLetterGrade = letter => {
    this.setState({ selectedLetterGradeId: letter.Id, deleteModal: true });
    this.setState({ selectedLetterGrade: letter });
  };

  handleDeleteLettergrade = () => {
    const { selectedLetterGrade } = this.state;
    const { onDeleteLetterGrade } = this.props;

    if (selectedLetterGrade.Id != undefined) {
      onDeleteLetterGrade(selectedLetterGrade);
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
    this.setState({
      errorMessage: null,
      duplicateError: null,
      errorMessage2: null,
    });
  };

  handleSuccessClose = () => {
    this.setState({ successMessage: null });
  };

  handleCloseAdd = () => {
    this.setState({
      addingLetterGrade: false,
      newLettergrade: "",
      year1: "",
      year2: "",
    });
  };

  handleOpentable = letterId => {
    const { onGetLetterGradeDetails } = this.props;
    onGetLetterGradeDetails(letterId.Id);
    this.setState({
      openForm: true,
      letterGradeDetailDes: letterId.Id,
      letterGrade: letterId,
    });
  };

  handleCloseUpdate = () => {
    this.setState({ editingLattergrade: false, year1: "", year2: "" });
  };

  handleActiveToggle(letterGradeId) {
    const { onUpdateLetterGrade } = this.props;
    let obj = { Id: letterGradeId};
    onUpdateLetterGrade(obj);
  }

  handleLetterGradesDetailsDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateLetterGradeDetail, letterGradeDetails } = this.props;

    const isDuplicate = letterGradeDetails.some(
      letterGradeDetail =>
        letterGradeDetail.Id !== rowId &&
        ((letterGradeDetail.letter && letterGradeDetail.letter.trim()) ===
          fieldValue.trim() ||
          (letterGradeDetail.enTitle && letterGradeDetail.enTitle.trim()) ===
            fieldValue.trim())
    );

    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ errorMessage2: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateLetterGradeDetail(onUpdate);
    } else {
      this.setState({ errorMessage2: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateLetterGradeDetail(onUpdate);
    }
  };
  handleAddRow = () => {
    const { onAddLetterGradeDetail, letterGradeDetails } = this.props;
    const { letterGradeDetailDes } = this.state;
    const emptyLevelExists = letterGradeDetails.some(
      row => row.letter === "" || row.letter == null
    );
    if (emptyLevelExists) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ errorMessage2: errorMessage });
    } else {
      const newRow = {
        LetterGradesDecisionId: letterGradeDetailDes,
      };

      this.setState({ errorMessage2: null });
      onAddLetterGradeDetail(newRow);
    }
  };
  handleDeleteRow = () => {
    const { onDeleteLetterGradeDetail } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteLetterGradeDetail({ Id: selectedRowId });

      this.setState({ selectedRowId: null, deleteModalTable: false });
      this.setState({ showAlert: true });
    }
  };
  handleChangeCheckbox = (row, fieldName) => {
    const { onUpdateLetterGradeDetail } = this.props;

    const newStatus = row[fieldName] ? 0 : 1;
    let ob = {
      Id: row.Id,
      [fieldName]: newStatus,
    };

    onUpdateLetterGradeDetail(ob);
  };

  onClickDelete = row => {
    this.setState({ selectedRowId: row.Id, deleteModalTable: true });
  };

  resetLetterGradeDetails = row => {
    const { onUpdateLetterGradeDetail } = this.props;
    const { letterGradeDetailDes } = this.state;
    let ob = {};
    ob["Id"] = row.Id;
    ob["letter"] = "";
    ob["fromGrade"] = 0;
    ob["toGrade"] = 0;
    ob["points"] = 0;
    ob["isPass"] = 0;
    ob["withinAverage"] = 0;
    ob["estimateId"] = null;
    onUpdateLetterGradeDetail(ob);
  };

  handleDeleteSuccessClose = () => {
    const { onGetLetterGradeDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetLetterGradeDeletedValue();
  };
  handleDeleteDetailsClose = () => {
    const { onGetLetterGradeDetailsDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetLetterGradeDetailsDeletedValue();
  };

  handleDeleteErrorClose = () => {
    const { onGetLetterGradeDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetLetterGradeDeletedValue();
  };

  render() {
    const {
      expandedNodes,
      editingLetterGradeName,
      editingLattergrade,
      errorMessage,
      successMessage,
      addingLetterGrade,
      deleteModal,
      year1,
      year2,
      newLettergrade,
      openForm,
      Id,
      editeLettergrade,
      editeYear1,
      editeYear2,
      letterId,
      letterGrade,
      letterGradeActive,
      deleteModalTable,
      duplicateError,
      showAlert,
      duplicateError2,
      errorMessage2,
      successMessageTable,
      showAddButton,
      showDeleteButton,
      showEditButton,
    } = this.state;

    const {
      t,
      letterGrades,
      years,
      estimates,
      letterGradeDetails,
      deleted,
      deletedDetail,
    } = this.props;

    const alertMessage =
      deleted == 0
        ? "Can't Delete (Delete data related to it)"
        : "Deleted Successfully";
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
        dataField: "LetterGradesDecisionId",
        hidden: true,
        text: this.props.t("letterGrade Id"),
        sort: true,
        editable: showEditButton,
      },

      {
        dataField: "letter",
        text: this.props.t("letter"),
        sort: true,
        editable: showEditButton,
      },

      {
        dataField: "fromGrade",
        text: this.props.t("from grade"),
        sort: true,
        editable: showEditButton,
      },

      {
        dataField: "toGrade",
        text: this.props.t("to grade"),
        sort: true,
        editable: showEditButton,
      },

      {
        dataField: "points",
        text: this.props.t("Points"),
        sort: true,
        editable: showEditButton,
      },
      {
        dataField: "estimateId",
        text: t("Estimation"),
        formatter: (cell, row) => (
          <Select
            key={`ExamAr_select`}
            options={estimates.filter(
              option =>
                !letterGrades.some(row => row.estimateId === option.value)
            )}
            onChange={newValue => {
              this.handleSelectChangeDetails(
                row.Id,
                "estimateId",
                newValue.value
              );
            }}
            value={estimates.find(opt => opt.value == row.estimateId)}
            isDisabled={!showEditButton}
          />
        ),
        editable: false,
      },

      {
        dataField: "isPass",
        text: this.props.t("Is Pass"),
        sort: true,
        editable: false,
        formatter: (cellContent, row, column) => (
          <Input
            type="checkbox"
            name="isPass"
            className={`form-check-input input-mini warning}`}
            id="behaviorButton"
            defaultChecked={cellContent == 1}
            onChange={event => this.handleChangeCheckbox(row, "isPass")}
            disabled={!showEditButton}
          />
        ),
      },

      {
        dataField: "withinAverage",
        text: this.props.t("Within Average"),
        sort: true,
        editable: false,
        formatter: (cellContent, row, column) => (
          <Input
            type="checkbox"
            name="withinAverage"
            className={`form-check-input input-mini warning}`}
            id="behaviorButton"
            defaultChecked={cellContent == 1}
            onChange={event => this.handleChangeCheckbox(row, "withinAverage")}
            disabled={!showEditButton}
          />
        ),
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
              onClick={() => this.resetLetterGradeDetails(row)}
              id="TooltipTop"
              disabled={row.letter === null}
            >
              <i className="bx bx-reset" />
            </IconButton>
          </div>
        ),
      },
    ];
    const addButtonStyle = {
      backgroundColor: "#75dfd1",
      color: "#ffffff",
      textAlign: "left",
    };

    return (
      <div className="page-content">
        <Container fluid>
          <Row>
            <Breadcrumbs
              title={t("Grades")}
              breadcrumbItem={t("Letter Grades")}
            />
            <div>
              <DeleteModal
                show={deleteModal}
                onDeleteClick={this.handleDeleteLettergrade}
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
            </div>
            <Col lg="4">
              <Card>
                <CardBody>
                  <Row>
                    <TreeView
                      key={"lettergrade-tree"}
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
                        nodeId="unique-key-1"
                        key="unique-key-1"
                        label={
                          editingLetterGradeName ? (
                            <Form className="university-name-form">
                              <Input
                                type="text"
                                value={t("Letter Grades")}
                                onChange={e =>
                                  this.setState({
                                    universityDefaultName: e.target.value,
                                  })
                                }
                                onBlur={() =>
                                  this.setState({
                                    editingLetterGradeName: false,
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
                                      editingLetterGradeName: false,
                                    })
                                  }
                                >
                                  {t("Letter Grades")}{" "}
                                </span>
                                {showAddButton && (
                                  <IconButton
                                    className="add-faculty-button"
                                    onClick={this.handleAddLetterGrade}
                                  >
                                    <AddIcon className="zeButton" />
                                  </IconButton>
                                )}
                              </div>
                            </div>
                          )
                        }
                      >
                        {letterGrades
                          ? letterGrades.map((letterGrade, index) => (
                              <TreeItem
                                onClick={() =>
                                  this.handleOpentable(letterGrade)
                                }
                                key={`${index}`}
                                nodeId={`letterGrade-${letterGrade.Id}`}
                                label={
                                  <div className="faculty-item">
                                    <span>{t(letterGrade.title)}</span>

                                    <div className="faculty-item-actions"></div> <div className="faculty-item-actions">
                                      <Tooltip
                                        title={
                                          letterGrade.active
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
                                                letterGrade.Id
                                              )
                                            }
                                            className="circle-icon"
                                            hidden
                                          >
                                            {letterGrade.active ? (
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
                                        <Tooltip title={"Edit"} placement="top">
                                          <IconButton
                                            className="edit-faculty-button p-0"
                                            onClick={() =>
                                              this.handleEditLetterGrade(
                                                letterGrade
                                              )
                                            }
                                          >
                                            <EditIcon className="zeButton" />
                                          </IconButton>
                                        </Tooltip>
                                      )}
                                      {showDeleteButton && (
                                        <Tooltip
                                          title={"Delete"}
                                          placement="top"
                                        >
                                          <IconButton
                                            className="delete-faculty-button"
                                            onClick={() =>
                                              this.onClickDeleteLetterGrade(
                                                letterGrade
                                              )
                                            }
                                          >
                                            <DeleteIcon className="zeButton" />
                                          </IconButton>
                                        </Tooltip>
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
                    {addingLetterGrade && (
                      <>
                        <Row className="ps-3">
                          <Col lg="4">
                            <div className="mt-2 mb-2">
                              <Input
                                type="text"
                                value={newLettergrade}
                                className="form-control"
                                onChange={e =>
                                  this.handleLetterGradeDataChange(
                                    "newLettergrade",
                                    e.target.value
                                  )
                                }
                                placeholder={t("title")}
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
                                onClick={this.handleSaveLetterGrade}
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
                    {editingLattergrade && (
                      <>
                        <Row>
                          <Col lg="4" className="d-flex">
                            <div className="mt-2 mb-2 ms-2">
                              <Input
                                type="text"
                                value={editeLettergrade}
                                className="form-control"
                                onChange={e =>
                                  this.handleLetterGradeDataChange(
                                    "editeLettergrade",
                                    e.target.value
                                  )
                                }
                                placeholder={t("letter grade")}
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
                                      letterGrades.find(
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
                                      letterGrades.find(
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
                </CardBody>
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
                    {duplicateError2 && (
                      <Alert
                        color="danger"
                        className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                        role="alert"
                      >
                        {/* {duplicateError2} */}
                        <button
                          type="button"
                          className="btn-close"
                          aria-label="Close"
                          onClick={this.handleErrorClose}
                        ></button>
                      </Alert>
                    )}

                    {successMessageTable && (
                      <Alert
                        color="danger"
                        className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                        role="alert"
                      >
                        {/* {successMessageTable} */}
                        <button
                          type="button"
                          className="btn-close"
                          aria-label="Close"
                          onClick={this.handleErrorClose}
                        ></button>
                      </Alert>
                    )}
                  </div>
                  {openForm && (
                    <div>
                      <Row>
                        <Typography variant="div">
                          <h5 className="header pt-2 mb-2" id="title">
                            {t("letter Grades Details")}{" "}
                            {letterGrade && <span>({letterGrade.title})</span>}
                          </h5>
                        </Typography>
                      </Row>
                      <Row>
                        {showAddButton && (
                          <div className="text-sm-end">
                            <Tooltip
                              title={this.props.t("Add")}
                              placement="top"
                            >
                              <IconButton
                                color="primary"
                                onClick={this.handleAddRow}
                              >
                                <i className="mdi mdi-plus-circle blue-noti-icon" />
                              </IconButton>
                            </Tooltip>
                          </div>
                        )}

                        <div className="table-responsive">
                          <BootstrapTable
                            keyField="Id"
                            data={letterGradeDetails}
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
                                this.handleLetterGradesDetailsDataChange(
                                  row.Id,
                                  column.dataField,
                                  newValue
                                );
                              },
                            })}
                            noDataIndication={t(
                              "No letter Grades Details found"
                            )}
                          />
                        </div>
                      </Row>
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

const mapStateToProps = ({ letterGrades, menu_items, years, estimates }) => ({
  letterGrades: letterGrades.letterGrades,
  deleted: letterGrades.deleted,
  deletedDetail: letterGrades.deletedDetail,
  years: years.years,
  estimates: estimates.estimates,
  letterGradeDetails: letterGrades.letterGradeDetails,
  user_menu: menu_items.user_menu || [],
});
const mapDispatchToProps = dispatch => ({
  onGetLetterGrades: () => dispatch(getLetterGrades()),
  onAddLetterGrade: letterGrade => dispatch(addNewLetterGrade(letterGrade)),
  onUpdateLetterGrade: letterGrade => dispatch(updateLetterGrade(letterGrade)),
  onDeleteLetterGrade: letterGrade => dispatch(deleteLetterGrade(letterGrade)),
  onGetLetterGradeDeletedValue: () => dispatch(getLetterGradeDeletedValue()),
  onGetLetterGradeDetails: letterId =>
    dispatch(getLetterGradeDetails(letterId)),
  onAddLetterGradeDetail: letterGradeDetail =>
    dispatch(addNewLetterGradeDetail(letterGradeDetail)),
  onUpdateLetterGradeDetail: letterGradeDetail =>
    dispatch(updateLetterGradeDetail(letterGradeDetail)),
  onDeleteLetterGradeDetail: letterGradeDetail =>
    dispatch(deleteLetterGradeDetail(letterGradeDetail)),
  onGetLetterGradeDetailsDeletedValue: () =>
    dispatch(getLetterGradeDetailsDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(LetterGradesTree));
