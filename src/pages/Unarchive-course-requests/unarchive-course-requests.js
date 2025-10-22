import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { Formik, Field, Form, ErrorMessage } from "formik";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import * as Yup from "yup";
import Select from "react-select";
import * as moment from "moment";
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
import { getFilteredCoursesPlans } from "store/trainee-decrees/actions";

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
import unarchiveCourseRequests from "store/Unarchive-course-requests/reducer";
import UnarchiveCourseRequestsSaga from "store/Unarchive-course-requests/saga";
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
      filteredCoursesModified: [],
      traineesOpt: [],
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
      selectedUserName: null,
      userName: "",
      selectedCourse: null,
      selectedOperstion: null,
      selectedRequestStatus: null,
      CoursenameError: false,
      traineeError: false,
      startDateError: false,
      endDateError: false,
      courseError: false,
      archiveDetailsError: false,
      operationNeededError: false,
      userNameError: false,
      languageState: "",
      selectedTrainee: "",
      selectedStartDate: "",
      selectedApplyingDate: new Date().toISOString().split("T")[0],
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
      employeesNames,
      i18n,
      operationsNeeded,
      gradeTypes,
      coursesOffering,
      unarchiveCourseRequests,
      decisionStatus,
      deleted,
      user_menu,
      onGetUnarchiveCourseRequests,
      onGetDecisionStatus,
      traineesOpt,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (!unarchiveCourseRequests || unarchiveCourseRequests.length === 0) {
      onGetUnarchiveCourseRequests();
    }

    this.setState({
      unarchiveCourseRequests,
      traineesOpt,
      coursesOffering,
      gradeTypes,
      operationsNeeded,
    });

    const currentDate = new Date();

    const formattedDate = currentDate.toISOString().slice(0, 10);

    this.setState({
      applyingDate: formattedDate,
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
    const {
      onAddNewUnarchiveCourseRequest,
      onUpdateUnarchiveCourseRequest,
      traineesOpt,
    } = this.props;

    const {
      isEdit,
      isAdd,
      selectedTrainee,
      selectedStartDate,
      selectedEndDate,
      selectedCourse,
      selectedOperstion,
      selectedUserName,
      selectedArchivedDetaile,
      selectedRequestStatus,
      selectedApplyingDate,
    } = this.state;
    values["userNameId"] = selectedUserName;
    values["archiveDetailsId"] = selectedArchivedDetaile;
    values["operationNeededId"] = selectedOperstion;
    values["courseId"] = selectedCourse;
    values["requestStatusId"] = selectedRequestStatus;
    if (
      values.startDate === "" ||
      values.endDate === "" ||
      values.traineeName === "" ||
      (values.archiveDetailsId === "" && selectedArchivedDetaile === "") ||
      (values.operationNeededId === "" && selectedOperstion === "") ||
      (values.courseId === "" && selectedCourse === "") ||
      (values.userNameId === "" && selectedUserName === "")
    ) {
      this.setState({ firstNameError: true, saveError: true });

      if (values.startDate.trim() === "") {
        this.setState({ startDateError: true, saveError: true });
      }

      if (values.endDate.trim() === "") {
        this.setState({ endDateError: true, saveError: true });
      }
      if (values.traineeName.trim() === "") {
        this.setState({ traineeError: true, saveError: true });
      }
      if (values.courseId === "" && selectedCourse === "") {
        this.setState({ courseError: true, saveError: true });
      }
      if (values.userNameId === "" && selectedUserName === "") {
        this.setState({ userNameError: true, saveError: true });
      }
      if (values.operationNeededId === "" && selectedOperstion === "") {
        this.setState({ operationNeededError: true, saveError: true });
      }
      if (values.archiveDetailsId === "" && selectedArchivedDetaile === "") {
        this.setState({ archiveDetailsError: true, saveError: true });
      }
      const errorSave = this.props.t("Fill the Required Fields to Save");
      this.setState({ errorMessage: errorSave }, () => {
        window.scrollTo(0, 0);
      });
    } else {
      this.setState({ firstNameError: false, saveError: false });
      this.setState({ startDateError: false, saveError: false });
      this.setState({ endDateError: false, saveError: false });
      this.setState({ traineeError: false, saveError: false });
      this.setState({ courseError: false, saveError: false });
      this.setState({ userNameError: false, saveError: false });
      this.setState({ operationNeededError: false, saveError: false });
      this.setState({ archiveDetailsError: false, saveError: false });

      let unarchiveinfo = {};
      Object.keys(values).forEach(function (key) {
        if (
          values[key] != undefined &&
          (values[key].length > 0 || values[key] != "")
        )
          unarchiveinfo[key] = values[key];
      });
      unarchiveinfo.userNameId = this.state.selectedUserName;

      delete unarchiveinfo.traineeName;
      console.log("traineesOpttraineesOpttraineesOpt", traineesOpt);
      const traineeNamePart = values.traineeName.split(" - ")[0].trim();

      const trainee = traineesOpt.find(t => t.value.trim() === traineeNamePart);

      unarchiveinfo["traineeId"] = trainee?.key || null;
      console.log(
        "unarchiveinfounarchiveinfounarchiveinfounarchiveinfo",
        unarchiveinfo
      );
      if (selectedApplyingDate) {
        unarchiveinfo["applyingDate"] = selectedApplyingDate;
      }

      onAddNewUnarchiveCourseRequest(unarchiveinfo);
      this.toggle();
    }
  };
  handleSelect = (fieldName, selectedValue, values) => {
    if (fieldName == "courseId") {
      this.setState({
        selectedCourse: selectedValue,
        // unarchiveCourseRequest: values,
      });
    }
    if (fieldName == "operationNeededId") {
      this.setState({
        selectedOperstion: selectedValue,
        //unarchiveCourseRequest: values,
      });
    }
    if (fieldName == "archiveDetailsId") {
      this.setState({
        selectedArchivedDetaile: selectedValue,
        // unarchiveCourseRequest: values,
      });
    }
  };

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

  handleValidDate = date => {
    const date1 = moment(new Date(date)).format("DD /MM/ Y");
    return date1;
  };

  render() {
    const unarchiveCourseRequest = this.state.unarchiveCourseRequest;
    const {
      gradeTypes,
      unarchiveCourseRequests,
      t,
      deleted,
      decisionStatus,
      traineesOpt,
      onGetFilteredCoursesPlan,
      filteredCourses,
      operationsNeeded,
      employeesNames,
    } = this.props;
    const {
      selectedRequestStatus,
      userNameError,
      operationNeededError,
      archiveDetailsError,
      courseError,
      startDateError,
      endDateError,
      duplicateError,
      deleteModal,
      modal,
      modal2,
      isEdit,
      isOpen,
      isAdd,
      emptyError,
      showAlert,
      traineeError,
      selectedCourse,
      selectedOperstion,
      languageState,
      selectedTrainee,
      selectedApplyingDate,
      selectedStartDate,
      selectedEndDate,
      selectedUser,
      selectedArchivedDetaile,
      selectedDecisionStatus,
    } = this.state;

    const filteredCoursesModified =
      filteredCourses &&
      filteredCourses.map(item => ({
        label: `${item.code} - ${item.CourseName}`,
        value: item.courseId,
      }));

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
        dataField: "requestNum",
        text: this.props.t("Request Num"),
        sort: true,
        editable: false,
      },
      {
        dataField: "traineeNum",
        text: this.props.t("Trainee Num"),
        sort: true,
        editable: false,
      },
      {
        dataField: "traineeName",
        text: this.props.t("Trainee Name"),
        sort: true,
        editable: false,
      },

      {
        dataField: "courseId",
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
        dataField: "startDate",
        text: this.props.t("Start Date"),
        sort: true,
        editable: false,
        formatter: (cellContent, row) => this.handleValidDate(row.startDate),
      },
      {
        dataField: "endDate",
        text: this.props.t("End Date"),
        sort: true,
        editable: false,
        formatter: (cellContent, row) => this.handleValidDate(row.endDate),
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
        formatter: (cellContent, row) => this.handleValidDate(row.applyingDate),
      },
      {
        dataField: "userNameId",
        text: this.props.t("Applying User"),
        sort: true,
        editable: false,
      },
      {
        dataField: "requestStatusId",
        text: this.props.t("Request Status"),
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
            {/* <Tooltip title={this.props.t("Edit")} placement="top">
              <Link className="text-sm-end" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  onClick={() =>
                    this.handleEditArchivedCourse(unarchiveCourseRequest)
                  }
                ></i>
              </Link>
            </Tooltip> */}
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

                                        traineeName:
                                          unarchiveCourseRequest?.selectedTrainee ||
                                          "",

                                        startDate:
                                          unarchiveCourseRequest?.startDate ||
                                          selectedStartDate,

                                        endDate:
                                          unarchiveCourseRequest?.endDate ||
                                          selectedEndDate,

                                        courseId:
                                          unarchiveCourseRequest?.courseId ||
                                          "",

                                        operationNeededId:
                                          unarchiveCourseRequest?.operationNeededId ||
                                          "",
                                        userNameId:
                                          unarchiveCourseRequest?.userNameId ||
                                          selectedUser,
                                        archiveDetailsId:
                                          unarchiveCourseRequest?.archiveDetailsId ||
                                          "",
                                        applyingDate:
                                          unarchiveCourseRequest?.applyingDate ||
                                          selectedApplyingDate,

                                        archiveNotes:
                                          unarchiveCourseRequest?.archiveNotes ||
                                          "",
                                        requestStatusId:
                                          unarchiveCourseRequest?.requestStatusId ||
                                          "",

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
                                                                        <Label for="traineeId">
                                                                          {this.props.t(
                                                                            "Trainee Name"
                                                                          )}
                                                                        </Label>
                                                                        <span className="text-danger">
                                                                          *
                                                                        </span>
                                                                      </Col>
                                                                      <Col className="col-8">
                                                                        {/* <Field
                                                                          name="traineeId"
                                                                          as="input"
                                                                          id="trainee-Id"
                                                                          type="text"
                                                                          placeholder={t(
                                                                            "Search..."
                                                                          )}
                                                                          className={
                                                                            "form-control" +
                                                                            ((errors.traineeId &&
                                                                              touched.traineeId) ||
                                                                            traineeError
                                                                              ? " is-invalid"
                                                                              : "")
                                                                          }
                                                                          value={
                                                                            traineesOpt.find(
                                                                              trainee =>
                                                                                trainee.key ===
                                                                                this
                                                                                  .state
                                                                                  .selectedTraineeId
                                                                            )
                                                                              ?.value ||
                                                                            ""
                                                                          }
                                                                          onChange={e => {
                                                                            const newValue =
                                                                              e
                                                                                .target
                                                                                .value;

                                                                            const selectedTrainee =
                                                                              traineesOpt.find(
                                                                                trainee =>
                                                                                  trainee.value ===
                                                                                  newValue
                                                                              );

                                                                            if (
                                                                              selectedTrainee
                                                                            ) {
                                                                              this.setState(
                                                                                {
                                                                                  selectedTraineeId:
                                                                                    selectedTrainee.key,
                                                                                  traineeName:
                                                                                    selectedTrainee.value,
                                                                                }
                                                                              );
                                                                            } else {
                                                                              this.setState(
                                                                                {
                                                                                  selectedTraineeId:
                                                                                    null,
                                                                                  traineeName:
                                                                                    newValue,
                                                                                }
                                                                              );
                                                                            }
                                                                          }}
                                                                          list="traineesId"
                                                                          autoComplete="off"
                                                                        /> */}
                                                                        <Field
                                                                          name="traineeName"
                                                                          type="text"
                                                                          list="traineeNameList"
                                                                          as="input"
                                                                          id="traineeName-Id"
                                                                          className={
                                                                            "form-control" +
                                                                            ((errors.traineeId &&
                                                                              touched.traineeId) ||
                                                                            traineeError
                                                                              ? " is-invalid"
                                                                              : "")
                                                                          }
                                                                          onChange={e => {
                                                                            const traineeInput =
                                                                              e
                                                                                .target
                                                                                .value;

                                                                            const traineeName =
                                                                              traineeInput.split(
                                                                                " - "
                                                                              )[0];

                                                                            const plan =
                                                                              traineesOpt.find(
                                                                                trainee =>
                                                                                  trainee.value ===
                                                                                  traineeName
                                                                              );
                                                                            console.log(
                                                                              "planplanplan",
                                                                              traineesOpt
                                                                            );
                                                                            if (
                                                                              plan
                                                                            ) {
                                                                              onGetFilteredCoursesPlan(
                                                                                plan
                                                                              );
                                                                            }
                                                                            handleChange(
                                                                              e
                                                                            );
                                                                          }}
                                                                        />
                                                                        <datalist id="traineeNameList">
                                                                          {traineesOpt.map(
                                                                            traineeOpt => (
                                                                              <option
                                                                                key={
                                                                                  traineeOpt.key
                                                                                }
                                                                                value={`${traineeOpt.value} - ${traineeOpt.TraineeNum}`}
                                                                              />
                                                                            )
                                                                          )}
                                                                        </datalist>
                                                                        {traineeError && (
                                                                          <div className="invalid-feedback">
                                                                            {this.props.t(
                                                                              "Trainee Name is required"
                                                                            )}
                                                                          </div>
                                                                        )}
                                                                      </Col>
                                                                    </Row>
                                                                  </div>
                                                                  {/* Course Name */}
                                                                  <div className="mb-3">
                                                                    <Row>
                                                                      <Col className="col-4">
                                                                        <Label for="courseId">
                                                                          {this.props.t(
                                                                            "Courses"
                                                                          )}
                                                                        </Label>
                                                                        <span className="text-danger">
                                                                          *
                                                                        </span>
                                                                      </Col>
                                                                      <Col className="col-8">
                                                                        <Select
                                                                          name="courseId"
                                                                          options={
                                                                            filteredCoursesModified
                                                                          }
                                                                          key={`select_course`}
                                                                          onChange={newValue => {
                                                                            this.handleSelect(
                                                                              "courseId",
                                                                              newValue.value
                                                                            );
                                                                          }}
                                                                          value={filteredCoursesModified.find(
                                                                            opt =>
                                                                              opt.value ===
                                                                              unarchiveCourseRequest?.courseId
                                                                          )}
                                                                          className={
                                                                            "form-control" +
                                                                            ((errors.courseId &&
                                                                              touched.courseId) ||
                                                                            courseError
                                                                              ? " is-invalid"
                                                                              : "")
                                                                          }
                                                                        />

                                                                        {courseError && (
                                                                          <div className="invalid-feedback">
                                                                            {this.props.t(
                                                                              "Courses is required"
                                                                            )}
                                                                          </div>
                                                                        )}
                                                                      </Col>
                                                                    </Row>
                                                                  </div>
                                                                  {/* Start Date */}
                                                                  <div className="mb-3">
                                                                    <Row>
                                                                      <Col className="col-4">
                                                                        <Label for="startDate">
                                                                          {this.props.t(
                                                                            "Start Date"
                                                                          )}
                                                                        </Label>
                                                                        <span className="text-danger">
                                                                          *
                                                                        </span>
                                                                      </Col>
                                                                      <Col className="col-8">
                                                                        <Field
                                                                          name="startDate"
                                                                          className={`form-control ${
                                                                            startDateError
                                                                              ? "is-invalid"
                                                                              : ""
                                                                          }`}
                                                                          type="date"
                                                                          value={
                                                                            values.startDate
                                                                              ? new Date(
                                                                                  values.startDate
                                                                                )
                                                                                  .toISOString()
                                                                                  .split(
                                                                                    "T"
                                                                                  )[0]
                                                                              : ""
                                                                          }
                                                                          onChange={
                                                                            handleChange
                                                                          }
                                                                          onBlur={
                                                                            handleBlur
                                                                          }
                                                                          id="startDate-date-input"
                                                                        />
                                                                        {startDateError && (
                                                                          <div className="invalid-feedback">
                                                                            {this.props.t(
                                                                              "Offering Date is required"
                                                                            )}
                                                                          </div>
                                                                        )}
                                                                      </Col>
                                                                    </Row>
                                                                  </div>

                                                                  {/* End Date */}
                                                                  <div className="mb-3">
                                                                    <Row>
                                                                      <Col className="col-4">
                                                                        <Label for="endDate">
                                                                          {this.props.t(
                                                                            "End Date"
                                                                          )}
                                                                        </Label>
                                                                        <span className="text-danger">
                                                                          *
                                                                        </span>
                                                                      </Col>
                                                                      <Col className="col-8">
                                                                        <Field
                                                                          name="endDate"
                                                                          className={`form-control ${
                                                                            endDateError
                                                                              ? "is-invalid"
                                                                              : ""
                                                                          }`}
                                                                          type="date"
                                                                          value={
                                                                            values.endDate
                                                                              ? new Date(
                                                                                  values.endDate
                                                                                )
                                                                                  .toISOString()
                                                                                  .split(
                                                                                    "T"
                                                                                  )[0]
                                                                              : ""
                                                                          }
                                                                          onChange={
                                                                            handleChange
                                                                          }
                                                                          onBlur={
                                                                            handleBlur
                                                                          }
                                                                          id="endDate-date-input"
                                                                        />
                                                                        {endDateError && (
                                                                          <div className="invalid-feedback">
                                                                            {this.props.t(
                                                                              "End Date is required"
                                                                            )}
                                                                          </div>
                                                                        )}
                                                                      </Col>
                                                                    </Row>
                                                                  </div>

                                                                  {/* archivedetailes */}

                                                                  <div className="mb-3">
                                                                    <Row>
                                                                      <Col className="col-4">
                                                                        <Label for="archiveDetailsId">
                                                                          {this.props.t(
                                                                            "Archive Detailes"
                                                                          )}
                                                                        </Label>
                                                                        <span className="text-danger">
                                                                          *
                                                                        </span>
                                                                      </Col>
                                                                      <Col className="col-8">
                                                                        <Select
                                                                          name="archiveDetailsId"
                                                                          key={`select_archiveDetails`}
                                                                          options={
                                                                            gradeTypes
                                                                          }
                                                                          onChange={newValue => {
                                                                            this.handleSelect(
                                                                              "archiveDetailsId",
                                                                              newValue.value
                                                                            );
                                                                          }}
                                                                          value={gradeTypes.find(
                                                                            opt =>
                                                                              opt.value ===
                                                                              unarchiveCourseRequest?.archiveDetailsId
                                                                          )}
                                                                          className={
                                                                            "form-control" +
                                                                            ((errors.archiveDetailsId &&
                                                                              touched.archiveDetailsId) ||
                                                                            archiveDetailsError
                                                                              ? " is-invalid"
                                                                              : "")
                                                                          }
                                                                        />
                                                                        {archiveDetailsError && (
                                                                          <div className="invalid-feedback">
                                                                            {this.props.t(
                                                                              "Archive Details is required"
                                                                            )}
                                                                          </div>
                                                                        )}
                                                                      </Col>
                                                                    </Row>
                                                                  </div>

                                                                  {/* Operation Needed */}
                                                                  <div className="mb-3">
                                                                    <Row>
                                                                      <Col className="col-4">
                                                                        <Label for="operationNeededId">
                                                                          {this.props.t(
                                                                            "Operation Needed"
                                                                          )}
                                                                        </Label>
                                                                        <span className="text-danger">
                                                                          *
                                                                        </span>
                                                                      </Col>
                                                                      <Col className="col-8">
                                                                        <Select
                                                                          name="operationNeededId"
                                                                          key={`select_operationNeeded`}
                                                                          options={
                                                                            operationsNeeded
                                                                          }
                                                                          onChange={newValue => {
                                                                            this.handleSelect(
                                                                              "operationNeededId",
                                                                              newValue.value
                                                                            );
                                                                          }}
                                                                          value={operationsNeeded.find(
                                                                            opt =>
                                                                              opt.value ===
                                                                              unarchiveCourseRequest?.operationNeededId
                                                                          )}
                                                                          className={
                                                                            "form-control" +
                                                                            ((errors.operationNeededId &&
                                                                              touched.operationNeededId) ||
                                                                            operationNeededError
                                                                              ? " is-invalid"
                                                                              : "")
                                                                          }
                                                                        />
                                                                        {operationNeededError && (
                                                                          <div className="invalid-feedback">
                                                                            {this.props.t(
                                                                              "Operation Needed is required"
                                                                            )}
                                                                          </div>
                                                                        )}
                                                                      </Col>
                                                                    </Row>
                                                                  </div>
                                                                </Row>
                                                              </Col>
                                                              <Col lg="6">
                                                                <div className="mb-3">
                                                                  <Row>
                                                                    <Col className="col-4">
                                                                      <Label for="applying-date">
                                                                        {this.props.t(
                                                                          "Applying Date"
                                                                        )}
                                                                      </Label>
                                                                    </Col>

                                                                    <Col className="col-8">
                                                                      <Input
                                                                        type="text"
                                                                        name="applyingDate"
                                                                        id="applying-date"
                                                                        className={
                                                                          "form-control"
                                                                        }
                                                                        defaultValue={
                                                                          selectedApplyingDate
                                                                        }
                                                                        readOnly
                                                                      />
                                                                    </Col>
                                                                  </Row>
                                                                </div>

                                                                <div className="mb-3">
                                                                  <Row>
                                                                    <Col className="col-4">
                                                                      <Label for="archiveNotes">
                                                                        {this.props.t(
                                                                          "Archive Notes"
                                                                        )}
                                                                      </Label>
                                                                    </Col>
                                                                    <Col className="col-8">
                                                                      <Field
                                                                        as="textarea"
                                                                        name="archiveNotes"
                                                                        id="archiveNotes"
                                                                        className="form-control"
                                                                      />
                                                                    </Col>
                                                                  </Row>
                                                                </div>

                                                                <div className="mb-3">
                                                                  <Row>
                                                                    <Col className="col-4">
                                                                      <Label for="userName-Id">
                                                                        {this.props.t(
                                                                          "User Name"
                                                                        )}
                                                                      </Label>
                                                                      <span className="text-danger">
                                                                        *
                                                                      </span>
                                                                    </Col>
                                                                    <Col className="col-8">
                                                                      <Field
                                                                        name="userNameId"
                                                                        as="input"
                                                                        id="userName-Id"
                                                                        className={
                                                                          "form-control" +
                                                                          ((errors.userNameId &&
                                                                            touched.userNameId) ||
                                                                          userNameError
                                                                            ? " is-invalid"
                                                                            : "")
                                                                        }
                                                                        type="text"
                                                                        placeholder="Search..."
                                                                        value={
                                                                          employeesNames.find(
                                                                            empl =>
                                                                              empl.key ===
                                                                              this
                                                                                .state
                                                                                .selectedUserName
                                                                          )
                                                                            ?.value ||
                                                                          ""
                                                                        }
                                                                        onChange={e => {
                                                                          const newValue =
                                                                            e
                                                                              .target
                                                                              .value;

                                                                          const selectedEmployee =
                                                                            employeesNames.find(
                                                                              empl =>
                                                                                empl.value ===
                                                                                newValue
                                                                            );

                                                                          if (
                                                                            selectedEmployee
                                                                          ) {
                                                                            this.setState(
                                                                              {
                                                                                selectedUserName:
                                                                                  selectedEmployee.key,
                                                                                userName:
                                                                                  selectedEmployee.value,
                                                                              }
                                                                            );
                                                                          } else {
                                                                            this.setState(
                                                                              {
                                                                                selectedUserName:
                                                                                  null,
                                                                                userName:
                                                                                  newValue,
                                                                              }
                                                                            );
                                                                          }
                                                                        }}
                                                                        list="fullNames"
                                                                        autoComplete="off"
                                                                      />

                                                                      <datalist id="fullNames">
                                                                        {employeesNames.map(
                                                                          employeesName => (
                                                                            <option
                                                                              key={
                                                                                employeesName.key
                                                                              }
                                                                              value={
                                                                                employeesName.value
                                                                              }
                                                                            />
                                                                          )
                                                                        )}
                                                                      </datalist>
                                                                      {userNameError && (
                                                                        <div className="invalid-feedback">
                                                                          {this.props.t(
                                                                            "User Name is required"
                                                                          )}
                                                                        </div>
                                                                      )}
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
                                                              <Col lg="4">
                                                                <Label
                                                                  for="requestStatus-Id"
                                                                  className="form-label d-flex"
                                                                >
                                                                  {this.props.t(
                                                                    "Request status"
                                                                  )}
                                                                  <span className="text-danger">
                                                                    *
                                                                  </span>
                                                                </Label>
                                                              </Col>
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
                                                                              selectedRequestStatus ===
                                                                              status.Id
                                                                                ? "active"
                                                                                : ""
                                                                            }`}
                                                                            name="requestStatusId"
                                                                            id={`btnradio${index}`}
                                                                            autoComplete="off"
                                                                            checked={
                                                                              selectedRequestStatus ===
                                                                              status.Id
                                                                                ? "active"
                                                                                : ""
                                                                            }
                                                                            onChange={() => {
                                                                              setFieldValue(
                                                                                "requestStatusId",
                                                                                status.Id
                                                                              );

                                                                              this.setState(
                                                                                {
                                                                                  selectedRequestStatus:
                                                                                    status.Id,
                                                                                }
                                                                              );
                                                                            }}
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
  classScheduling,
  trainees,
  traineesDecrees,
  gradeTypes,
  employees,
}) => ({
  coursesOffering: classScheduling.coursesOffering,
  unarchiveCourseRequests: unarchiveCourseRequests.unarchiveCourseRequests,
  operationsNeeded: unarchiveCourseRequests.operationsNeeded,
  deleted: unarchiveCourseRequests.deleted,
  user_menu: menu_items.user_menu || [],
  decisionStatus: decisions.decisionStatus,
  traineesOpt: trainees.traineesOpt,
  filteredCourses: traineesDecrees.filteredCoursesPlans,
  gradeTypes: gradeTypes.gradeTypes,
  employeesNames: employees.employeesNames,
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
  onGetFilteredCoursesPlan: trainee =>
    dispatch(getFilteredCoursesPlans(trainee)),
  onGetDecisionStatus: () => dispatch(getDecisionStatus()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(UnarchiveCourseReq)));
