import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { Formik, Field, Form, ErrorMessage } from "formik";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import * as Yup from "yup";
import Select from "react-select";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Alert,
  Input,
  Spinner,
} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";

import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";
import Accordion from "react-bootstrap/Accordion";

import {
  getUnarchiveCourseRequestDeletedValue,
  getUnarchiveCourseRequests,
  addUnarchiveCourseRequest,
  updateUnarchiveCourseRequest,
  deleteUnarchiveCourseRequest,
} from "store/Unarchive-course-requests/actions";

import { getDecisionStatus } from "store/decisions/actions";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import { isEmpty, size, map } from "lodash";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../utils/menuUtils";
class UnarchiveCourseReq extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unarchiveCourseRequests: [],
      unarchiveCourseRequest: "",
      selectConId: null,
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
    };
    this.state = {
      deleteModal: false,
      duplicateError: null,
      selectedRowId: null,
      modal: false,
      modal2: false,
      isEdit: false,
      isOpen: false,
      isAdd: false,
      errorMessage: null,
      successMessage: null,
      values: "",

      selectedCourse: "",
      selectedOperstion: "",
      CoursenameError: false,
      languageState: "",
      selectedTrainee: "",
      selectedStartDate: "",
      selectedRegistrationDate: new Date().toISOString().split("T")[0],
      selectedEndDate: "",
      selectedUser: "",
      selectedArchivedDetaile: "",
      selectedDecisionStatus: "",
    };
    this.toggle = this.toggle.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    const {
      i18n,

      unarchiveCourseRequests,
      decisionStatus,
      deleted,
      user_menu,
      onGetUnarchiveCourseRequests,
      onGetDecisionStatus,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);

    //onGetUnarchiveCourseRequests();
    onGetDecisionStatus();

    this.setState({
      unarchiveCourseRequests,
    });
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
      this.updateShowSearchButton(
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

  updateShowSearchButton = (menu, pathname) => {
    const showSearchButton = checkIsSearchForPage(menu, pathname);
    this.setState({ showSearchButton });
  };

  onPaginationPageChange = page => {
    if (
      this.node &&
      this.node.current &&
      this.node.current.props &&
      this.node.current.props.pagination &&
      this.node.current.props.pagination.options
    ) {
      this.node.current.props.pagination.options.onPageChange(page);
    }
  };
  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
      emptyError: "",
      CoursenameError: false,
      enCoursenameError: false,
    }));
  };

  onClickDelete = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };

  handleAddRow = () => {
    this.setState({
      unarchiveCourseRequest: "",
      isEdit: false,
      isOpen: false,
      isAdd: true,
    });
    this.toggle();
  };

  handleDeleteRow = () => {
    const { onDeleteUnarchiveCourseRequest } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteUnarchiveCourseRequest(selectedRowId);

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  handleSubmit = values => {
    console.log(values);
    const { onAddNewUnarchiveCourseRequest, onUpdateUnarchiveCourseRequest } =
      this.props;

    const {
      isEdit,
      isAdd,
      selectedTrainee,
      selectedStartDate,
      selectedEndDate,
      selectedCourse,
      selectedOperstion,
      selectedUser,
      selectedArchivedDetaile,
    } = this.state;

    let errorMessages = {};

    // Validation
    if (!values.TraineeId) errorMessages.TraineeId = "Trainee is required";
    if (!values.StartDate) errorMessages.StartDate = "Start date is required";
    if (!values.EndDate) errorMessages.EndDate = "End date is required";
    if (!values.CourseName) errorMessages.CourseName = "Course is required";
    if (!values.OperationNeeded)
      errorMessages.OperationNeeded = "Operation is required";
    if (!values.user) errorMessages.user = "User is required";
    if (!values.archivedetaile)
      errorMessages.archivedetaile = "Archive detail is required";

    if (Object.keys(errorMessages).length > 0) {
      this.setState({ errorMessages });
      this.setState({ emptyError: "Please fill all required fields" });

      return;
    }

    const unarchiveInfo = {
      TraineeId: values.TraineeId,
      StartDate: values.StartDate,
      EndDate: values.EndDate,
      CourseName: values.CourseName,
      OperationNeeded: values.OperationNeeded,
      user: values.user,
      description: values.description || "",
      archivedetaile: values.archivedetaile,
    };

    /*    if (isEdit) {
      onUpdateUnarchiveCourseRequest(unarchiveInfo);
    } else if (isAdd) {
      onAddNewUnarchiveCourseRequest(unarchiveInfo);
    } */

    this.setState({
      errorMessages: {},
    });

    this.toggle();
  };
  handleSelect = (fieldName, selectedValue, values) => {};

  handleAlertClose = () => {
    this.setState({ emptyError: null });
  };

  handleSuccessClose = () => {
    const { onGetUnarchiveCourseRequestDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetUnarchiveCourseRequestDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetUnarchiveCourseRequestDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetUnarchiveCourseRequestDeletedValue();
  };

  handleEditArchivedCourse = arg => {
    this.setState({
      unarchiveCourseRequest: arg,
      isEdit: true,
    });

    this.toggle();
  };

  onClickDelete = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };

  handleDeleteRow = () => {
    const { onDeleteUnarchiveCourseRequest } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteUnarchiveCourseRequest(selectedRowId);

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  handleFileChange = event => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file);
    }
  };

  render() {
    const unarchiveCourseRequest = this.state.unarchiveCourseRequest;
    const { unarchiveCourseRequests, t, deleted, decisionStatus } = this.props;
    const {
      duplicateError,
      deleteModal,
      modal,
      modal2,
      isEdit,
      isOpen,
      isAdd,
      emptyError,
      showAlert,

      selectedCourse,
      selectedOperstion,

      languageState,
      selectedTrainee,
      selectedRegistrationDate,
      selectedStartDate,
      selectedEndDate,
      selectedUser,
      selectedArchivedDetaile,
      selectedDecisionStatus,
    } = this.state;
    const { SearchBar } = Search;
    const alertMessage =
      deleted == 0
        ? this.props.t("Can't Delete")
        : this.props.t("Deleted Successfully");

    const defaultSorting = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];

    const columns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },

      {
        dataField: "applyingUser",
        text: this.props.t("Applying Student"),
        sort: true,
        editable: false,
      },

      {
        dataField: "startDate",
        text: this.props.t("start Date"),
        sort: true,
        editable: false,
      },
      {
        dataField: "endDate",
        text: this.props.t("End Date"),
        sort: true,
        editable: false,
      },

      {
        dataField: "courseName",
        text: this.props.t("Course Name"),
        sort: true,
        editable: false,
      },
      {
        dataField: "code",
        text: this.props.t("Course Code"),
        sort: true,
        editable: false,
      },
      {
        dataField: "studentNumber",
        text: this.props.t("Student Number"),
        sort: true,
        editable: false,
      },
      {
        dataField: "studentName",
        text: this.props.t("Student Name"),
        sort: true,
        editable: false,
      },
      {
        dataField: "studentId",
        text: this.props.t("Student ID"),
        sort: true,
        editable: false,
      },
      {
        dataField: "canceledGrade",
        text: this.props.t("Canceled Grade"),
        sort: true,
        editable: false,
      },
      {
        dataField: "applyingDate",
        text: this.props.t("Applying Date"),
        sort: true,
        editable: false,
      },
      {
        dataField: "applyingUserS",
        text: this.props.t("Applying User"),
        sort: true,
        editable: false,
      },
      {
        dataField: "requestStatus",
        text: this.props.t("Request Status"),
        sort: true,
        editable: false,
      },
      {
        dataField: "startDateS",
        text: this.props.t("Start Date"),
        sort: true,
        editable: false,
      },
      {
        dataField: "endDateS",
        text: this.props.t("End Date"),
        sort: true,
        editable: false,
      },

      {
        dataField: "menu",
        text: "",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, unarchiveCourseRequest) => (
          <div className="d-flex gap-3">
            <Tooltip title={this.props.t("Edit")} placement="top">
              <Link className="text-sm-end" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  onClick={() =>
                    this.handleEditArchivedCourse(unarchiveCourseRequest)
                  }
                ></i>
              </Link>
            </Tooltip>
            <Tooltip title={this.props.t("Delete")} placement="top">
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  onClick={() => this.onClickDelete(unarchiveCourseRequest)}
                ></i>
              </Link>
            </Tooltip>
          </div>
        ),
      },
    ];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: unarchiveCourseRequests.length,
      custom: true,
    };

    const traineeList = [];
    const startDateOptions = [];
    const endDateOptions = [];
    const courseList = [];
    const operationList = [];
    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteRow}
          onCloseClick={() =>
            this.setState({ deleteModal: false, selectedRowId: null })
          }
        />
        <div className="page-content">
          <div className="container-fluid">
            <Breadcrumbs
              breadcrumbItem={this.props.t("Unarchive Course Requests")}
            />
            <Row>
              <Col>
                <Card>
                  <CardBody>
                    <div>
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
                            onClick={this.handleErrorClose}
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
                            onClick={this.handleSuccessClose}
                          ></button>
                        </Alert>
                      )}
                    </div>

                    <div className="table-responsive">
                      <PaginationProvider
                        pagination={paginationFactory(pageOptions)}
                        keyField="Id"
                        columns={columns}
                        data={unarchiveCourseRequests}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={unarchiveCourseRequests}
                            columns={columns}
                            search
                          >
                            {toolkitprops => (
                              <React.Fragment>
                                <Row>
                                  <Col sm="4">
                                    <div className="search-box ms-2 mb-2 d-inline-block">
                                      {/*   {showSearchButton && ( */}
                                      <div className="position-relative">
                                        <SearchBar
                                          {...toolkitprops.searchProps}
                                          placeholder={t("Search...")}
                                        />
                                      </div>
                                    </div>
                                  </Col>
                                  {/*    {showAddButton && ( */}
                                  <Col sm="8">
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
                                  </Col>
                                </Row>

                                <BootstrapTable
                                  keyField="Id"
                                  {...toolkitprops.baseProps}
                                  {...paginationTableProps}
                                  data={unarchiveCourseRequests}
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
                                      row.Id, column.dataField, newValue;
                                    },
                                  })}
                                  noDataIndication={this.props.t(
                                    "No Unarchive Course Found"
                                  )}
                                  defaultSorted={defaultSorting}
                                />
                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </Col>
                                <Modal
                                  isOpen={modal}
                                  toggle={this.toggle}
                                  className={"modal-fullscreen"}
                                >
                                  <ModalHeader toggle={this.toggle} tag="h4">
                                    {!!isEdit
                                      ? t("Edit Unarchive Course Requests")
                                      : t("Add Unarchive Course Requests")}
                                  </ModalHeader>
                                  <ModalBody>
                                    <Formik
                                      enableReinitialize={true}
                                      initialValues={{
                                        ...(isEdit &&
                                          unarchiveCourseRequest && {
                                            Id: unarchiveCourseRequest.Id,
                                          }),

                                        TraineeId:
                                          unarchiveCourseRequest?.selectedTrainee ||
                                          "",

                                        StartDate:
                                          unarchiveCourseRequest?.startDateId ||
                                          selectedStartDate,

                                        EndDate:
                                          unarchiveCourseRequest?.endDateId ||
                                          selectedEndDate,

                                        CourseName:
                                          unarchiveCourseRequest?.courseId ||
                                          selectedCourse,

                                        OperationNeeded:
                                          unarchiveCourseRequest?.OperationNeededId ||
                                          selectedOperstion,
                                        user:
                                          unarchiveCourseRequest?.userId ||
                                          selectedUser,
                                        description:
                                          unarchiveCourseRequest?.description ||
                                          "",

                                        archivedetaile:
                                          unarchiveCourseRequest?.archivedetaile ||
                                          selectedArchivedDetaile,

                                        //file: null,
                                      }}
                                      validationSchema={Yup.object().shape({
                                        CourseName: Yup.string().required(
                                          t("Course Name (ar) is required")
                                        ),
                                      })}
                                    >
                                      {({
                                        errors,
                                        status,
                                        touched,
                                        values,
                                        handleChange,
                                        handleBlur,
                                        setFieldValue,
                                      }) => (
                                        <Form>
                                          <Card id="employee-card mt-8">
                                            <CardBody className="cardBody">
                                              {emptyError && (
                                                <Alert
                                                  color="danger"
                                                  className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                  role="alert"
                                                >
                                                  {emptyError}
                                                  <button
                                                    type="button"
                                                    className="btn-close"
                                                    aria-label="Close"
                                                    onClick={
                                                      this.handleAlertClose
                                                    }
                                                  ></button>
                                                </Alert>
                                              )}
                                              <Row>
                                                <Col lg="12">
                                                  <div className="bordered">
                                                    <Col lg="12">
                                                      <Card>
                                                        <CardTitle id="card_header">
                                                          {t(
                                                            "Basic Information"
                                                          )}
                                                        </CardTitle>
                                                        <CardBody className="cardBody">
                                                          <Row>
                                                            <Row>
                                                              <Col lg="6">
                                                                <Row>
                                                                  <div className="mb-3">
                                                                    <Row>
                                                                      <Col className="col-4">
                                                                        <Label for="TraineeId">
                                                                          {this.props.t(
                                                                            "Trainee Name"
                                                                          )}
                                                                        </Label>
                                                                      </Col>

                                                                      <Col className="col-8">
                                                                        <input
                                                                          className={`form-control`}
                                                                          list="TraineeList"
                                                                          name="TraineeId"
                                                                          id="TraineeId"
                                                                          placeholder="Type to search..."
                                                                          autoComplete="off"
                                                                          onChange={e =>
                                                                            this.handleSelect(
                                                                              e
                                                                                .target
                                                                                .name,
                                                                              e
                                                                                .target
                                                                                .value,
                                                                              values
                                                                            )
                                                                          }
                                                                          value={
                                                                            (
                                                                              traineeList.find(
                                                                                trainee =>
                                                                                  trainee.key ===
                                                                                  selectedTrainee
                                                                              ) ||
                                                                              ""
                                                                            )
                                                                              .value
                                                                          }
                                                                        />
                                                                        <datalist id="TraineeList">
                                                                          {traineeList.map(
                                                                            trainee => (
                                                                              <option
                                                                                key={
                                                                                  trainee.key
                                                                                }
                                                                                value={
                                                                                  trainee.value
                                                                                }
                                                                              />
                                                                            )
                                                                          )}
                                                                        </datalist>

                                                                        <ErrorMessage
                                                                          name="TraineeId"
                                                                          component="div"
                                                                          className="invalid-feedback"
                                                                        />
                                                                      </Col>
                                                                    </Row>
                                                                  </div>
                                                                  {/* Start Date */}
                                                                  <div className="mb-3">
                                                                    <Row>
                                                                      <Col className="col-4">
                                                                        <Label for="StartDate">
                                                                          {this.props.t(
                                                                            "Start Date"
                                                                          )}
                                                                        </Label>
                                                                        <span className="text-danger">
                                                                          *
                                                                        </span>
                                                                      </Col>
                                                                      <Col className="col-8">
                                                                        <input
                                                                          className="form-control"
                                                                          list="StartDateList"
                                                                          name="StartDate"
                                                                          id="StartDate"
                                                                          placeholder="Select start date..."
                                                                          autoComplete="off"
                                                                          onChange={e =>
                                                                            this.handleSelect(
                                                                              e
                                                                                .target
                                                                                .name,
                                                                              e
                                                                                .target
                                                                                .value,
                                                                              values
                                                                            )
                                                                          }
                                                                          value={
                                                                            values.StartDate
                                                                          }
                                                                        />
                                                                        <datalist id="StartDateList">
                                                                          {startDateOptions.map(
                                                                            (
                                                                              date,
                                                                              index
                                                                            ) => (
                                                                              <option
                                                                                key={
                                                                                  index
                                                                                }
                                                                                value={
                                                                                  date
                                                                                }
                                                                              />
                                                                            )
                                                                          )}
                                                                        </datalist>
                                                                        <ErrorMessage
                                                                          name="StartDate"
                                                                          component="div"
                                                                          className="invalid-feedback"
                                                                        />
                                                                      </Col>
                                                                    </Row>
                                                                  </div>

                                                                  {/* End Date */}
                                                                  <div className="mb-3">
                                                                    <Row>
                                                                      <Col className="col-4">
                                                                        <Label for="EndDate">
                                                                          {this.props.t(
                                                                            "End Date"
                                                                          )}
                                                                        </Label>
                                                                        <span className="text-danger">
                                                                          *
                                                                        </span>
                                                                      </Col>
                                                                      <Col className="col-8">
                                                                        <input
                                                                          className="form-control"
                                                                          list="EndDateList"
                                                                          name="EndDate"
                                                                          id="EndDate"
                                                                          placeholder="Select end date..."
                                                                          autoComplete="off"
                                                                          onChange={e =>
                                                                            this.handleSelect(
                                                                              e
                                                                                .target
                                                                                .name,
                                                                              e
                                                                                .target
                                                                                .value,
                                                                              values
                                                                            )
                                                                          }
                                                                          value={
                                                                            values.EndDate
                                                                          }
                                                                        />
                                                                        <datalist id="EndDateList">
                                                                          {endDateOptions.map(
                                                                            (
                                                                              date,
                                                                              index
                                                                            ) => (
                                                                              <option
                                                                                key={
                                                                                  index
                                                                                }
                                                                                value={
                                                                                  date
                                                                                }
                                                                              />
                                                                            )
                                                                          )}
                                                                        </datalist>
                                                                        <ErrorMessage
                                                                          name="EndDate"
                                                                          component="div"
                                                                          className="invalid-feedback"
                                                                        />
                                                                      </Col>
                                                                    </Row>
                                                                  </div>

                                                                  {/* Course Name */}
                                                                  <div className="mb-3">
                                                                    <Row>
                                                                      <Col className="col-4">
                                                                        <Label for="CourseName">
                                                                          {this.props.t(
                                                                            "Course Name"
                                                                          )}
                                                                        </Label>
                                                                        <span className="text-danger">
                                                                          *
                                                                        </span>
                                                                      </Col>
                                                                      <Col className="col-8">
                                                                        <input
                                                                          className="form-control"
                                                                          list="CourseList"
                                                                          name="CourseName"
                                                                          id="CourseName"
                                                                          placeholder="Select course..."
                                                                          autoComplete="off"
                                                                          onChange={e =>
                                                                            this.handleSelect(
                                                                              e
                                                                                .target
                                                                                .name,
                                                                              e
                                                                                .target
                                                                                .value,
                                                                              values
                                                                            )
                                                                          }
                                                                          value={
                                                                            values.CourseName
                                                                          }
                                                                        />
                                                                        <datalist id="CourseList">
                                                                          {courseList.map(
                                                                            course => (
                                                                              <option
                                                                                key={
                                                                                  course.key
                                                                                }
                                                                                value={
                                                                                  course.value
                                                                                }
                                                                              />
                                                                            )
                                                                          )}
                                                                        </datalist>
                                                                        <ErrorMessage
                                                                          name="CourseName"
                                                                          component="div"
                                                                          className="invalid-feedback"
                                                                        />
                                                                      </Col>
                                                                    </Row>
                                                                  </div>

                                                                  {/* archivedetailes */}

                                                                  <div className="mb-3">
                                                                    <Row>
                                                                      <Col className="col-4">
                                                                        <Label for="archivedetaile">
                                                                          {this.props.t(
                                                                            "Archive Detailes"
                                                                          )}
                                                                        </Label>
                                                                        <span className="text-danger">
                                                                          *
                                                                        </span>
                                                                      </Col>
                                                                      <Col className="col-8">
                                                                        <input
                                                                          className="form-control"
                                                                          list="archivedetailesList"
                                                                          name="archivedetaile"
                                                                          id="archivedetaile"
                                                                          placeholder="Select archive detailes..."
                                                                          autoComplete="off"
                                                                          onChange={e =>
                                                                            this.handleSelect(
                                                                              e
                                                                                .target
                                                                                .name,
                                                                              e
                                                                                .target
                                                                                .value,
                                                                              values
                                                                            )
                                                                          }
                                                                        />
                                                                        <datalist id="archivedetailesList">
                                                                          {courseList.map(
                                                                            course => (
                                                                              <option
                                                                                key={
                                                                                  course.key
                                                                                }
                                                                                value={
                                                                                  course.value
                                                                                }
                                                                              />
                                                                            )
                                                                          )}
                                                                        </datalist>
                                                                        <ErrorMessage
                                                                          name="archivedetaile"
                                                                          component="div"
                                                                          className="invalid-feedback"
                                                                        />
                                                                      </Col>
                                                                    </Row>
                                                                  </div>

                                                                  {/* Operation Needed */}
                                                                  <div className="mb-3">
                                                                    <Row>
                                                                      <Col className="col-4">
                                                                        <Label for="OperationNeeded">
                                                                          {this.props.t(
                                                                            "Operation Needed"
                                                                          )}
                                                                        </Label>
                                                                        <span className="text-danger">
                                                                          *
                                                                        </span>
                                                                      </Col>
                                                                      <Col className="col-8">
                                                                        <input
                                                                          className="form-control"
                                                                          list="OperationList"
                                                                          name="OperationNeeded"
                                                                          id="OperationNeeded"
                                                                          placeholder="Select operation..."
                                                                          autoComplete="off"
                                                                          onChange={e =>
                                                                            this.handleSelect(
                                                                              e
                                                                                .target
                                                                                .name,
                                                                              e
                                                                                .target
                                                                                .value,
                                                                              values
                                                                            )
                                                                          }
                                                                          value={
                                                                            values.OperationNeeded
                                                                          }
                                                                        />
                                                                        <datalist id="OperationList">
                                                                          {operationList.map(
                                                                            op => (
                                                                              <option
                                                                                key={
                                                                                  op.key
                                                                                }
                                                                                value={
                                                                                  op.value
                                                                                }
                                                                              />
                                                                            )
                                                                          )}
                                                                        </datalist>
                                                                        <ErrorMessage
                                                                          name="OperationNeeded"
                                                                          component="div"
                                                                          className="invalid-feedback"
                                                                        />
                                                                      </Col>
                                                                    </Row>
                                                                  </div>
                                                                </Row>
                                                              </Col>
                                                              <Col lg="6">
                                                                <div className="mb-3">
                                                                  <Row>
                                                                    <Col className="col-4">
                                                                      <Label for="reg-date">
                                                                        {this.props.t(
                                                                          "Applyning Date"
                                                                        )}
                                                                      </Label>
                                                                    </Col>

                                                                    <Col className="col-8">
                                                                      <Input
                                                                        type="text"
                                                                        name="RegistrationDate"
                                                                        id="reg-date"
                                                                        className={
                                                                          "form-control"
                                                                        }
                                                                        defaultValue={
                                                                          selectedRegistrationDate
                                                                        }
                                                                        readOnly
                                                                      />
                                                                    </Col>
                                                                  </Row>
                                                                </div>

                                                                <div className="mb-3">
                                                                  <Row>
                                                                    <Col className="col-4">
                                                                      <Label for="descriptionar">
                                                                        {this.props.t(
                                                                          "Applying Notes"
                                                                        )}
                                                                      </Label>
                                                                    </Col>
                                                                    <Col className="col-8">
                                                                      <Field
                                                                        as="textarea"
                                                                        name="description"
                                                                        id="descriptionar"
                                                                        className="form-control"
                                                                      />
                                                                    </Col>
                                                                  </Row>
                                                                </div>

                                                                <div className="mb-3">
                                                                  <Row>
                                                                    <Col className="col-4">
                                                                      <Label for="applyingUser">
                                                                        {this.props.t(
                                                                          "Applying User"
                                                                        )}
                                                                      </Label>
                                                                      <span className="text-danger">
                                                                        *
                                                                      </span>
                                                                    </Col>
                                                                    <Col className="col-8">
                                                                      <input
                                                                        className="form-control"
                                                                        list="OperationList"
                                                                        name="applyingUser"
                                                                        id="applyingUser"
                                                                        placeholder="Select User..."
                                                                        autoComplete="off"
                                                                        onChange={e =>
                                                                          this.handleSelect(
                                                                            e
                                                                              .target
                                                                              .name,
                                                                            e
                                                                              .target
                                                                              .value,
                                                                            values
                                                                          )
                                                                        }
                                                                      />
                                                                      <datalist id="OperationList">
                                                                        {operationList.map(
                                                                          op => (
                                                                            <option
                                                                              key={
                                                                                op.key
                                                                              }
                                                                              value={
                                                                                op.value
                                                                              }
                                                                            />
                                                                          )
                                                                        )}
                                                                      </datalist>
                                                                      <ErrorMessage
                                                                        name="applyingUser"
                                                                        component="div"
                                                                        className="invalid-feedback"
                                                                      />
                                                                    </Col>
                                                                  </Row>
                                                                </div>

                                                                <Col lg="12">
                                                                  <div
                                                                    className="upload-box p-2 mx-auto"
                                                                    style={{
                                                                      maxWidth:
                                                                        "300px",
                                                                      cursor:
                                                                        "pointer",
                                                                    }}
                                                                    onClick={() =>
                                                                      document
                                                                        .getElementById(
                                                                          "fileInput"
                                                                        )
                                                                        .click()
                                                                    }
                                                                  >
                                                                    <div className="upload-content text-center">
                                                                      <div className="upload-icon-wrapper mb-2">
                                                                        <i className="bx bx-upload upload-icon"></i>
                                                                      </div>
                                                                      <p className="upload-text">
                                                                        {this.props.t(
                                                                          "Click or drag file to upload"
                                                                        )}
                                                                      </p>
                                                                    </div>

                                                                    <input
                                                                      id="fileInput"
                                                                      name="file"
                                                                      type="file"
                                                                      className="d-none"
                                                                      onChange={
                                                                        this
                                                                          .handleFileChange
                                                                      }
                                                                    />
                                                                  </div>
                                                                </Col>
                                                              </Col>
                                                            </Row>
                                                            <Row className="d-flex justify-content-center ml-5 mt-6">
                                                              <Col lg="8">
                                                                <div className="d-flex flex-wrap  gap-3">
                                                                  <div
                                                                    className="btn-group button-or"
                                                                    role="group"
                                                                  >
                                                                    {decisionStatus.map(
                                                                      (
                                                                        status,
                                                                        index
                                                                      ) => (
                                                                        <React.Fragment
                                                                          key={
                                                                            index
                                                                          }
                                                                        >
                                                                          <input
                                                                            type="radio"
                                                                            className={`btn-check button-or ${
                                                                              selectedDecisionStatus ===
                                                                              status.Id
                                                                                ? "active"
                                                                                : ""
                                                                            }`}
                                                                            name="decisionStatusId"
                                                                            id={`btnradio${index}`}
                                                                            autoComplete="off"
                                                                            defaultChecked={
                                                                              selectedDecisionStatus ===
                                                                              status.Id
                                                                                ? "active"
                                                                                : ""
                                                                            }
                                                                            onChange={() =>
                                                                              setFieldValue(
                                                                                "decisionStatusId",
                                                                                status.Id
                                                                              )
                                                                            }
                                                                          />
                                                                          <Label
                                                                            className="btn btn-outline-primary smallButton w-sm"
                                                                            for={`btnradio${index}`}
                                                                          >
                                                                            {
                                                                              status.arTitle
                                                                            }
                                                                          </Label>
                                                                        </React.Fragment>
                                                                      )
                                                                    )}
                                                                  </div>
                                                                </div>
                                                              </Col>
                                                            </Row>
                                                            <Col
                                                              lg="12 mt-6"
                                                              className="mt-4"
                                                            >
                                                              <Row>
                                                                <Col>
                                                                  <div className="text-center">
                                                                    <Link
                                                                      to="#"
                                                                      className="btn btn-primary me-2"
                                                                      onClick={() => {
                                                                        this.handleSubmit(
                                                                          values
                                                                        );
                                                                      }}
                                                                    >
                                                                      {t(
                                                                        "Save"
                                                                      )}
                                                                    </Link>
                                                                  </div>
                                                                </Col>
                                                              </Row>
                                                            </Col>
                                                          </Row>
                                                        </CardBody>
                                                      </Card>
                                                    </Col>
                                                  </div>
                                                </Col>
                                              </Row>
                                            </CardBody>
                                          </Card>
                                        </Form>
                                      )}
                                    </Formik>
                                  </ModalBody>
                                </Modal>
                              </React.Fragment>
                            )}
                          </ToolkitProvider>
                        )}
                      </PaginationProvider>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({
  unarchiveCourseRequests,
  menu_items,
  decisions,
}) => ({
  unarchiveCourseRequests: unarchiveCourseRequests.unarchiveCourseRequests,
  deleted: unarchiveCourseRequests.deleted,
  user_menu: menu_items.user_menu || [],
  decisionStatus: decisions.decisionStatus,
});

const mapDispatchToProps = dispatch => ({
  onGetUnarchiveCourseRequests: () => dispatch(getUnarchiveCourseRequests()),
  onAddNewUnarchiveCourseRequest: unarchiveCourseRequest =>
    dispatch(addUnarchiveCourseRequest(unarchiveCourseRequest)),
  onUpdateUnarchiveCourseRequest: unarchiveCourseRequest =>
    dispatch(updateUnarchiveCourseRequest(unarchiveCourseRequest)),
  onDeleteUnarchiveCourseRequest: unarchiveCourseRequest =>
    dispatch(deleteUnarchiveCourseRequest(unarchiveCourseRequest)),
  onGetUnarchiveCourseRequestDeletedValue: () =>
    dispatch(getUnarchiveCourseRequestDeletedValue()),

  onGetDecisionStatus: () => dispatch(getDecisionStatus()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(UnarchiveCourseReq)));
