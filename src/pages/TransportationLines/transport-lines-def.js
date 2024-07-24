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
  getTransportLines,
  addNewTransportLine,
  updateTransportLine,
  deleteTransportLine,
  getTransportLineDetails,
  getTransportLineDeletedValue,
  addNewTransportLineDetail,
  updateTransportLineDetail,
  deleteTransportLineDetail,
  getTransportLineDetailsDeletedValue,
} from "store/transportLines/actions";
import { Height } from "@mui/icons-material";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
} from "../../utils/menuUtils";

class TransportLinesTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transportLines: [],
      transportLine: [],
      openForm: false,

      newTransportLine: "",

      addingTransportLine: false,

      editingTransportLine: false,

      expandedNodes: ["1"],

      deleteModal: false,
      deleteModalTable: false,
      selectedTransportLine: null,
      selectedTransportLineId: null,
      year1: "",
      year2: "",

      editTransportLine: "",
      editeYear1: "",
      editeYear2: "",

      Id: "",
      transportLineActive: 0,
      selectedRowId: null,
      transLineId: null,
      duplicateError: "",
      showAlert: null,
      transportLine: null,
      successMessageTable: "",
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
    };
    this.handleEditTransportLine = this.handleEditTransportLine.bind(this);
    this.handleTransportLineDataChange =
      this.handleTransportLineDataChange.bind(this);
    this.handleSaveTransportLine = this.handleSaveTransportLine.bind(this);
  }

  componentDidMount() {
    const {
      transportLines,
      onGetTransportLines,
      years,
      estimates,

      deleted,
      deletedDetail,
      user_menu,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    if (transportLines && !transportLines.length) {
      onGetTransportLines();
    }

    this.setState({ transportLines, deleted, deletedDetail });
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

  handleAddTransportLine = () => {
    this.setState({
      addingTransportLine: true,
      transportLineActive: 0,
      editingTransportLine: false,
    });
  };

  handleTransportLineDataChange = (fieldName, value) => {
    const { addingTransportLine } = this.state;

    if (addingTransportLine) {
      this.setState({
        [fieldName]: value,
      });
    } else {
      this.setState({ editTransportLine: value });
    }
  };

  handleSelectChange = (fieldName, selectedValue) => {
    const { addingTransportLine, editingTransportLine } = this.state;
    if (addingTransportLine) {
      if (fieldName === "fromYearId") {
        this.setState({
          year1: selectedValue,
        });
      } else if (fieldName === "toYearId") {
        this.setState({
          year2: selectedValue,
        });
      }
    } else if (!addingTransportLine) {
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
    const { onUpdateTransportLineDetail } = this.props;

    let onUpdate = { Id: rowId, [fieldName]: selectedValue };
    onUpdateTransportLineDetail(onUpdate);
  };
  handleSaveTransportLine = () => {
    const { newTransportLine, year1, year2, transportLineActive } = this.state;
    const { onAddTransportLine, transportLines } = this.props;

    const newRow = {
      title: newTransportLine,
     // fromYearId: year1,
    //  toYearId: year2,
     // active: transportLineActive,
    };

    if (newTransportLine.trim() === "") {
      this.setState({ errorMessage: this.props.t("Field is empty") });
    } else {
      const isDuplicate = transportLines.some(
        item => item.title === newTransportLine
      );

      if (isDuplicate) {
        this.setState({ errorMessage: this.props.t("Duplicate entry found") });
      } else {
        const successSavedMessage = this.props.t("Line saved successfully");
        this.setState({ successMessage: successSavedMessage });

        onAddTransportLine(newRow);

        this.setState({
          newTransportLine: "",
          year1: "",
          year2: "",
        });
      }
      this.handleCloseAdd();
    }
  };

  handleEditTransportLine = letter => {
    const { transportLines } = this.props;

    this.setState({
      transportLine: letter,
      editingTransportLine: true,
      addingTransportLine: false,
      letterId: letter.Id,
      editTransportLine: letter.title,
      editeYear1: letter.fromYearId,
      editeYear2: letter.toYearId,
    //  transportLineActive: letter.active,
    });
  };

  handleSaveUpdate = () => {
    const { onUpdateTransportLine, transportLines } = this.props;

    const {
      letterId,
      editTransportLine,
      editeYear1,
      editeYear2,
      transportLineActive,
    } = this.state;

    const isDuplicateTransportLine = transportLines.some(
      letter =>
        letter.Id &&
        !letterId &&
        letter.title &&
        letter.title.trim() === editTransportLine.trim()
    );

    if (isDuplicateTransportLine) {
      this.setState({ errorMessage: "Duplicate entry found" });
    } else {
      const updatvariable = {
        Id: letterId,
        title: editTransportLine,
     //   fromYearId: editeYear1,
      //  toYearId: editeYear2,
     //   active: transportLineActive,
      };
      onUpdateTransportLine(updatvariable);
      this.handleCloseUpdate;
    }
  };

  onClickDeleteTransportLine = letter => {
    this.setState({ selectedTransportLineId: letter.Id, deleteModal: true });
    this.setState({ selectedTransportLine: letter });
  };

  handleDeleteTransportLine = () => {
    const { selectedTransportLine } = this.state;
    const { onDeleteTransportLine } = this.props;

    if (selectedTransportLine.Id != undefined) {
      onDeleteTransportLine(selectedTransportLine);
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
      addingTransportLine: false,
      newTransportLine: "",
      year1: "",
      year2: "",
    });
  };

  handleOpentable = transLine => {
    console.log("transLine",transLine )
    const { onGetTransportLineDetails } = this.props;
    onGetTransportLineDetails(transLine.Id);
    this.setState({
      openForm: true,
      transLineId: transLine.Id,
      transportLine: transLine,
    });
  };

  handleCloseUpdate = () => {
    this.setState({ editingTransportLine: false, year1: "", year2: "" });
  };

  handleActiveToggle(transportLine) {
    const { onUpdateTransportLine } = this.props;
    console.log("transportLine",transportLine)
    let activeValue = transportLine.active === 1 ? 0 : 1;
    let obj = { Id: transportLine.Id, active : activeValue };
    onUpdateTransportLine(obj);
  }

  handleTransportLinesDetailsDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateTransportLineDetail, transportLineDetails } = this.props;

    const isDuplicate = transportLineDetails.some(
      transportLineDetail =>
        transportLineDetail.Id !== rowId &&
        ((transportLineDetail.letter && transportLineDetail.letter.trim()) ===
          fieldValue.trim() ||
          (transportLineDetail.enTitle && transportLineDetail.enTitle.trim()) ===
            fieldValue.trim())
    );

    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ errorMessage2: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateTransportLineDetail(onUpdate);
    } else {
      this.setState({ errorMessage2: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateTransportLineDetail(onUpdate);
    }
  };
  handleAddRow = () => {
    const { onAddTransportLineDetail, transportLineDetails } = this.props;
    const { transLineId } = this.state;
    const emptyLevelExists = transportLineDetails.some(
      row => row.busStop === "" || row.busStop == null
    );

    console.log("transLineId in add",transLineId)
    if (emptyLevelExists) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ errorMessage2: errorMessage });
    } else {
      const newRow = {
        transportLineId: transLineId,
      };

      this.setState({ errorMessage2: null });
      onAddTransportLineDetail(newRow);
    }
  };
  handleDeleteRow = () => {
    const { onDeleteTransportLineDetail } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteTransportLineDetail({ Id: selectedRowId });

      this.setState({ selectedRowId: null, deleteModalTable: false });
      this.setState({ showAlert: true });
    }
  };
  handleChangeCheckbox = (row, fieldName) => {
    const { onUpdateTransportLineDetail } = this.props;

    const newStatus = row[fieldName] ? 0 : 1;
    let ob = {
      Id: row.Id,
      [fieldName]: newStatus,
    };

    onUpdateTransportLineDetail(ob);
  };

  onClickDelete = row => {
    this.setState({ selectedRowId: row.Id, deleteModalTable: true });
  };

  resetTransportLineDetails = row => {
    const { onUpdateTransportLineDetail } = this.props;
    const { transLineId } = this.state;
    let ob = {};
    ob["Id"] = row.Id;
    ob["letter"] = "";
    ob["fromGrade"] = 0;
    ob["toGrade"] = 0;
    ob["points"] = 0;
    ob["isPass"] = 0;
    ob["withinAverage"] = 0;
    ob["estimateId"] = null;
    onUpdateTransportLineDetail(ob);
  };

  handleDeleteSuccessClose = () => {
    const { onGetTransportLineDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetTransportLineDeletedValue();
  };
  handleDeleteDetailsClose = () => {
    const { onGetTransportLineDetailsDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetTransportLineDetailsDeletedValue();
  };

  handleDeleteErrorClose = () => {
    const { onGetTransportLineDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetTransportLineDeletedValue();
  };

  render() {
    const {
      expandedNodes,
      editingTransportLineName,
      editingTransportLine,
      errorMessage,
      successMessage,
      addingTransportLine,
      deleteModal,
      year1,
      year2,
      newTransportLine,
      openForm,
      Id,
      editTransportLine,
      editeYear1,
      editeYear2,
      letterId,
      transportLine,
      transportLineActive,
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
      transportLines,
      years,
      estimates,
      transportLineDetails,
      deleted,
      deletedDetail,
    } = this.props;

    //console.log("transportLines",transportLines)


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
        dataField: "transportLineId",
        hidden: true,
        text: this.props.t("transportLine Id"),
        sort: true,
        editable: showEditButton,
      },

      {
        dataField: "busStop",
        text: this.props.t("Bus Stop"),
        sort: true,
        editable: showEditButton,
      },

      {
        dataField: "location",
        text: this.props.t("Location"),
        sort: true,
        editable: showEditButton,
      },
      {
        dataField: "fromHour",
        text: this.props.t("From Hour"),
        sort: true,
        editable: false,
        formatter: (cellContent, row, column) => (
            <Input
            className="form-control"
            type="time"
            value={row.fromHour}
            onChange={newValue => {
              this.handleTransportLinesDetailsDataChange(
                row.Id,
                "fromHour",
                newValue.target.value
              );
            }}
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
              onClick={() => this.resetTransportLineDetails(row)}
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
              breadcrumbItem={t("Transportation Lines")}
            />
            <div>
              <DeleteModal
                show={deleteModal}
                onDeleteClick={this.handleDeleteTransportLine}
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
                      key={"transportLine-tree"}
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
                          editingTransportLineName ? (
                            <Form className="university-name-form">
                              <Input
                                type="text"
                                value={t("Transportation Lines")}
                                onChange={e =>
                                  this.setState({
                                    universityDefaultName: e.target.value,
                                  })
                                }
                                onBlur={() =>
                                  this.setState({
                                    editingTransportLineName: false,
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
                                      editingTransportLineName: false,
                                    })
                                  }
                                >
                                  {t("Transportation Lines")}{" "}
                                </span>
                                {showAddButton && (
                                  <IconButton
                                    className="add-faculty-button"
                                    onClick={this.handleAddTransportLine}
                                  >
                                    <AddIcon className="zeButton" />
                                  </IconButton>
                                )}
                              </div>
                            </div>
                          )
                        }
                      >
                        {transportLines
                          ? transportLines.map((transportLine, index) => (
                              <TreeItem
                                onClick={() =>
                                  this.handleOpentable(transportLine)
                                }
                                key={`${index}`}
                                nodeId={`transportLine-${transportLine.Id}`}
                                label={
                                  <div className="faculty-item">
                                    <span>{t(transportLine.title)}</span>

                                    <div className="faculty-item-actions"></div> <div className="faculty-item-actions">
                                      <Tooltip
                                        title={
                                          transportLine.active
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
                                                transportLine
                                              )
                                            }
                                            className="circle-icon"
                                            
                                          >
                                            {transportLine.active ? (
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
                                              this.handleEditTransportLine(
                                                transportLine
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
                                              this.onClickDeleteTransportLine(
                                                transportLine
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
                    {addingTransportLine && (
                      <>
                        <Row className="ps-3">
                          <Col lg="6">
                            <div className="mt-2 mb-2">
                              <Input
                                type="text"
                                value={newTransportLine}
                                className="form-control"
                                onChange={e =>
                                  this.handleTransportLineDataChange(
                                    "newTransportLine",
                                    e.target.value
                                  )
                                }
                                placeholder={t("Line Name")}
                              />
                            </div>
                          </Col>
                          <Col lg="6">
                            <Tooltip
                              title={this.props.t("Save")}
                              placement="bottom"
                            >
                              <IconButton
                                className="save-department-button"
                                onClick={this.handleSaveTransportLine}
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
                    {editingTransportLine && (
                      <>
                        <Row>
                          <Col lg="6">
                            <div className="mt-2 mb-2 ms-2">
                              <Input
                                type="text"
                                value={editTransportLine}
                                className="form-control"
                                onChange={e =>
                                  this.handleTransportLineDataChange(
                                    "editTransportLine",
                                    e.target.value
                                  )
                                }
                                placeholder={t("Line Name")}
                              />
                            </div>
                          </Col>
                          <Col lg="6">
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
                            {t("Transportation Lines Details")}{" "}
                            {transportLine && <span>({transportLine.title})</span>}
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
                            data={transportLineDetails}
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
                                this.handleTransportLinesDetailsDataChange(
                                  row.Id,
                                  column.dataField,
                                  newValue
                                );
                              },
                            })}
                            noDataIndication={t(
                              "No Transportation Lines Details found"
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

const mapStateToProps = ({ transportLines, menu_items, years, estimates }) => ({
  transportLines: transportLines.transportLines,
  deleted: transportLines.deleted,
  deletedDetail: transportLines.deletedDetail,
  years: years.years,
  estimates: estimates.estimates,
  transportLineDetails: transportLines.transportLineDetails,
  user_menu: menu_items.user_menu || [],
});
const mapDispatchToProps = dispatch => ({
  onGetTransportLines: () => dispatch(getTransportLines()),
  onAddTransportLine: transportLine => dispatch(addNewTransportLine(transportLine)),
  onUpdateTransportLine: transportLine => dispatch(updateTransportLine(transportLine)),
  onDeleteTransportLine: transportLine => dispatch(deleteTransportLine(transportLine)),
  onGetTransportLineDeletedValue: () => dispatch(getTransportLineDeletedValue()),
  onGetTransportLineDetails: letterId =>
    dispatch(getTransportLineDetails(letterId)),
  onAddTransportLineDetail: transportLineDetail =>
    dispatch(addNewTransportLineDetail(transportLineDetail)),
  onUpdateTransportLineDetail: transportLineDetail =>
    dispatch(updateTransportLineDetail(transportLineDetail)),
  onDeleteTransportLineDetail: transportLineDetail =>
    dispatch(deleteTransportLineDetail(transportLineDetail)),
  onGetTransportLineDetailsDeletedValue: () =>
    dispatch(getTransportLineDetailsDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(TransportLinesTree));
