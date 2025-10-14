import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as moment from "moment";
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
import {
  getMarksObjections,
  addNewMarkObjection,
  updateMarkObjection,
  deleteMarkObjection,
  getMarkObjectionDeletedValue,
} from "store/marks-objections/actions";
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
} from "../../../utils/menuUtils";
import academicLoadSaga from "store/academicloads/saga";
class MarksObjectionsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      marksObjections: [],
      markObjection: "",
      employee: "",
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
      editModal: false,
      isEdit: false,
      errorMessage: null,
      successMessage: null,
      values: "",
      modalMarkObjectionValue: [],
      requestNumError: false,
      applyingDateError: false,
      selectedTraineeId: null,
      traineeName: "",
      courseError: false,
      selectedCourseId: null,
      courseName: "",
      testExamError: false,
      selectedTestExam: null,
      selectedRequestType: null,
    };
    this.toggle = this.toggle.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    const {
      marksObjections,
      onGetMarksObjections,
      traineeOpt,
      coursesOffering,
      deleted,
      user_menu,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    // if (markObjection && !marksObjections.length) {
    //   onGetMarksObjections();
    // }
    onGetMarksObjections();
    this.setState({
      marksObjections,
      deleted,
      coursesOffering,
      traineeOpt,
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
    }));
  };

  toggleEdit = () => {
    this.setState(prevState => ({
      editModal: !prevState.editModal,
    }));
  };

  onClickDelete = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };

  handleAddRow = () => {
    this.setState({
      markObjection: "",
      selectedTraineeId: null,
      traineeName: "",
      isEdit: false,
      isOpen: false,
      isAdd: true,
    });
    this.toggle();
  };

  handleDeleteRow = () => {
    const { onDeleteMarkObjection } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      let onDelete = { Id: selectedRowId.Id };
      onDeleteMarkObjection(onDelete);

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  handleButtonClick = (fieldName, option) => {
    if (fieldName === "hasMinistryApprove") {
      this.setState({ selectedHasMinistryApprove: option });
    }

    if (fieldName === "governmentWorker") {
      this.setState({ selectedGovernmentWorker: option });
    }
  };

  handleSave = values => {
    const {
      isEdit,
      isAdd,
      isOpen,
      selectedTraineeId,
      selectedCourseId,
      selectedTestExam,
    } = this.state;
    const { onAddNewEmployee, onUpdateEmployee } = this.props;
    console.log("values", values);

    values["courseNameId"] = selectedCourseId;
    values["traineeNameId"] = selectedTraineeId;
    values["testExamId"] = selectedTestExam;
    if (
      values.requestNum === "" ||
      values.applyingDate === "" ||
      values.traineeNameId === "" ||
      values.courseNameId === "" ||
      (values.testExamId === "" && selectedTestExam === null)
    ) {
      this.setState({ requestNumError: true, saveError: true });

      this.setState({ applyingDateError: true, saveError: true });

      this.setState({ traineeError: true, saveError: true });

      this.setState({ courseError: true, saveError: true });

      this.setState({ testExamError: true, saveError: true });
      const emptyError = this.props.t("Fill the Required Fields to Save");

      this.setState({ emptyError: emptyError });
    } else {
      this.setState({ requestNumError: false, saveError: false });
      this.setState({ applyingDateError: false, saveError: false });
      this.setState({ traineeError: false, saveError: false });
      this.setState({ courseError: false, saveError: false });
      this.setState({ testExamError: false, saveError: false });

      let employeeinfo = {};

      Object.keys(values).forEach(function (key) {
        if (
          values[key] != undefined &&
          (values[key].length > 0 || values[key] != "")
        )
          employeeinfo[key] = values[key];
      });
      employeeinfo["courseNameId"] = selectedCourseId;
      employeeinfo["traineeNameId"] = selectedTraineeId;
      employeeinfo["testExamId"] = selectedTestExam;
      this.setState({
        errorMessages: {},
      });

      if (isEdit) {
        console.log("rrrrrrrrrrrrrrr", employeeinfo);
        // onUpdateEmployee(employeeinfo);
      } else if (isAdd) {
        console.log("employeeinfoemployeeinfo", employeeinfo);

        // onAddNewEmployee(employeeinfo);
      }

      const saveEmployeeMessage = "Saved successfully ";
      this.setState({
        successMessage: saveEmployeeMessage,
      });

      this.toggle();
    }
  };

  handleSelectDatalist = e => {
    const selectedValue = e.target.value;
    if (fieldName === "jobTitleId") {
      const selected = this.props.jobTitlesOpt.find(
        job => job.value === selectedValue
      );

      this.setState({
        selectedJobTitle: selected ? selected.key : null,
        jobTitleName: selectedValue,
      });
    }

    if (fieldName === "employeeId") {
      const selected = this.props.employeesNames.find(
        employeeName => employeeName.value === selectedValue
      );

      this.setState({
        selectedFullName: selected ? selected.key : null,
        employeeFullName: selectedValue,
      });
    }

    if (fieldName === "academicYearId") {
      const selected = this.props.academicYearsOpt.find(
        aYear => aYear.value === selectedValue
      );
      this.setState({
        selectedAcademicYearId: selected ? selected.key : null,
        academicYear: selectedValue,
      });

      return;
    }
  };

  handleAlertClose = alertName => {
    this.setState({ [alertName]: null });
  };

  handleSuccessClose = () => {
    const { onGetMarkObjectionDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetMarkObjectionDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetMarkObjectionDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetMarkObjectionDeletedValue();
  };

  handleMarkObjectionClick = arg => {
    console.log("arg", arg);

    this.setState({
      markObjection: arg,
      isEdit: true,
    });
    this.toggleEdit();
  };

  handleValidDate = date => {
    const date1 = moment(new Date(date)).format("DD /MM/ Y");
    return date1;
  };

  handleSelect = (fieldName, selectedValue, values) => {
    if (fieldName == "testExamId") {
      this.setState({
        selectedTestExam: selectedValue,
        markObjection: values,
      });
    }
    if (fieldName == "requestTypeId") {
      this.setState({
        selectedRequestType: selectedValue,
        markObjection: values,
      });
    }
  };

  render() {
    const markObjection = this.state.markObjection;
    const employee = this.state.employee;
    const {
      coursesOffering,
      traineesOpt,
      marksObjections,
      t,
      deleted,
      employmentCases,
      genders,
      nationalitiesOpt,
      employeesNames,
      administrativeSupervisorsOpt,
      workClassifications,
      physicalWorkLocationsOpt,
      jobRanksOpt,
      jobTitlesOpt,
      corporateNodesOpt,
      costCentersOpt,
      academicYearsOpt,
      employees,
    } = this.props;
    const {
      testExamError,
      selectedCourseId,
      courseName,
      courseError,
      traineeError,
      selectedTraineeId,
      applyingDateError,
      requestNumError,
      duplicateError,
      deleteModal,
      modal,
      editModal,
      isEdit,
      isOpen,
      isAdd,
      emptyError,
      showAlert,
      markObjectionTypeError,
      academicYearsIdError,
      jobTitleError,
      signatureDateError,
      selectedHasMinistryApprove,
      selectedGovernmentWorker,
      selectedFullName,
      selectedJobTitle,
      selectedAcademicYearId,
      selectedMarkObjectionType,
      selectedWorkClassification,
      selectedEmploymentCase,
      hireDateError,
      fullNameError,
      ncsDateError,
      corporateNodeError,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
      modalMarkObjectionValue,
      fullNamesOpt,
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
        dataField: "applyingDate",
        text: this.props.t("Applying Date"),
        sort: true,
        editable: false,
        formatter: (cellContent, row) => this.handleValidDate(row.applyingDate),
      },
      {
        dataField: "courseName",
        text: this.props.t("Course Name"),
        sort: true,
        editable: false,
      },
      {
        dataField: "courseCode",
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
        dataField: "examName",
        text: this.props.t("Exam Name"),
        sort: true,
        editable: false,
      },
      {
        dataField: "requestType",
        text: this.props.t("Request Type"),
        sort: true,
        editable: false,
      },
      {
        dataField: "objectionStatus",
        text: this.props.t("Objection Status"),
        sort: true,
        editable: false,
      },
      {
        dataField: "oldMark",
        text: this.props.t("Old Mark"),
        sort: true,
        editable: false,
      },
      {
        dataField: "newMark",
        text: this.props.t("New Mark"),
        sort: true,
        editable: false,
      },
      {
        dataField: "marksDifference",
        text: this.props.t("Marks Difference"),
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
        dataField: "applliedThrough",
        text: this.props.t("Appllied Through"),
        sort: true,
        editable: false,
      },
      {
        dataField: "menu",
        text: "",
        isDummyField: true,
        editable: false,
        //  hidden: !showDeleteButton,
        formatter: (cellContent, markObjection) => (
          <div className="d-flex gap-3">
            <Tooltip title={this.props.t("Edit")} placement="top">
              <IconButton
                onClick={() => this.handleMarkObjectionClick(markObjection)}
              >
                <i className="mdi mdi-pencil font-size-18" id="edittooltip"></i>
              </IconButton>
            </Tooltip>
            <Tooltip title={this.props.t("Delete")} placement="top">
              <IconButton onClick={() => this.onClickDelete(markObjection)}>
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                ></i>
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: marksObjections.length,
      custom: true,
    };
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
            <Breadcrumbs breadcrumbItem={this.props.t("Marks Objections")} />
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
                            onClick={() =>
                              this.handleAlertClose("duplicateError")
                            }
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
                        data={marksObjections}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={marksObjections}
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
                                  data={marksObjections}
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
                                    "No Marks Objections found"
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
                                  size="lg"
                                >
                                  <ModalHeader toggle={this.toggle} tag="h4">
                                    {!!isEdit
                                      ? t("Edit Marks Objections")
                                      : t("Add Marks Objections")}
                                  </ModalHeader>
                                  <ModalBody>
                                    <Formik
                                      enableReinitialize={true}
                                      initialValues={{
                                        requestNum:
                                          (markObjection &&
                                            markObjection.requestNum) ||
                                          "",
                                        applyingDate:
                                          (markObjection &&
                                            markObjection.applyingDate) ||
                                          "",
                                        traineeNameId:
                                          (markObjection &&
                                            markObjection.traineeNameId) ||
                                          "",
                                        courseNameId:
                                          (markObjection &&
                                            markObjection.courseNameId) ||
                                          "",
                                        testExamId:
                                          (markObjection &&
                                            markObjection.testExamId) ||
                                          "",
                                        oldMark:
                                          (markObjection &&
                                            markObjection.oldMark) ||
                                          "",
                                        requestType:
                                          (markObjection &&
                                            markObjection.requestType) ||
                                          "",
                                        applyingNotes:
                                          (markObjection &&
                                            markObjection.absencePercent) ||
                                          "",
                                      }}
                                      validationSchema={Yup.object().shape({
                                        applyingDate: Yup.string()
                                          .nullable()
                                          .test(
                                            "is-valid-date",
                                            "Date must be valid",
                                            value =>
                                              !value ||
                                              moment(
                                                value,
                                                "YYYY-MM-DD",
                                                true
                                              ).isValid()
                                          ),
                                        startDate: Yup.string()
                                          .nullable()
                                          .test(
                                            "is-valid-date",
                                            "Date must be valid",
                                            value =>
                                              !value ||
                                              moment(
                                                value,
                                                "YYYY-MM-DD",
                                                true
                                              ).isValid()
                                          ),
                                        endDate: Yup.string()
                                          .nullable()
                                          .test(
                                            "is-valid-date",
                                            "Date must be valid",
                                            value =>
                                              !value ||
                                              moment(
                                                value,
                                                "YYYY-MM-DD",
                                                true
                                              ).isValid()
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
                                      }) => {
                                        return (
                                          <Form>
                                            <Card id="employee-card">
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
                                                      onClick={() =>
                                                        this.handleAlertClose(
                                                          "emptyError"
                                                        )
                                                      }
                                                    ></button>
                                                  </Alert>
                                                )}
                                                <Card>
                                                  <CardBody>
                                                    <div className="bordered">
                                                      <div className="mb-3">
                                                        <Row>
                                                          <Col className="col-4">
                                                            <Label for="requestNum">
                                                              {this.props.t(
                                                                "Request Num"
                                                              )}
                                                            </Label>

                                                            <span className="text-danger">
                                                              *
                                                            </span>
                                                          </Col>
                                                          <Col className="col-8">
                                                            <Field
                                                              type="text"
                                                              name="requestNum"
                                                              id="requestNum"
                                                              className={
                                                                "form-control" +
                                                                ((errors.requestNum &&
                                                                  touched.requestNum) ||
                                                                requestNumError
                                                                  ? " is-invalid"
                                                                  : "")
                                                              }
                                                            />
                                                            {requestNumError && (
                                                              <div className="invalid-feedback">
                                                                {this.props.t(
                                                                  "Request Num is required"
                                                                )}
                                                              </div>
                                                            )}
                                                          </Col>
                                                        </Row>
                                                      </div>
                                                      <div className="mb-3">
                                                        <Row>
                                                          <Col className="col-4">
                                                            <Label for="applyingDate">
                                                              {this.props.t(
                                                                "Applying Date"
                                                              )}
                                                            </Label>
                                                            <span className="text-danger">
                                                              *
                                                            </span>
                                                          </Col>
                                                          <Col className="col-8">
                                                            <Field
                                                              className={`form-control ${
                                                                applyingDateError
                                                                  ? "is-invalid"
                                                                  : ""
                                                              }`}
                                                              name="applyingDate"
                                                              type="date"
                                                              value={
                                                                values.applyingDate
                                                                  ? new Date(
                                                                      values.applyingDate
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
                                                              id="applyingDate-date-input"
                                                            />
                                                            {applyingDateError && (
                                                              <div className="invalid-feedback">
                                                                {this.props.t(
                                                                  "Applying Date is required"
                                                                )}
                                                              </div>
                                                            )}
                                                          </Col>
                                                        </Row>
                                                      </div>
                                                      <div className="mb-3">
                                                        <Row>
                                                          <Col className="col-4">
                                                            <Label for="traineeNameId">
                                                              {this.props.t(
                                                                "Trainee Name"
                                                              )}
                                                            </Label>
                                                            <span className="text-danger">
                                                              *
                                                            </span>
                                                          </Col>
                                                          <Col className="col-8">
                                                            <Field
                                                              name="traineeNameId"
                                                              as="input"
                                                              id="traineeName-Id"
                                                              type="text"
                                                              placeholder="Search..."
                                                              className={
                                                                "form-control" +
                                                                ((errors.traineeNameId &&
                                                                  touched.traineeNameId) ||
                                                                traineeError
                                                                  ? " is-invalid"
                                                                  : "")
                                                              }
                                                              value={
                                                                traineesOpt.find(
                                                                  trainee =>
                                                                    trainee.key ===
                                                                    this.state
                                                                      .selectedTraineeId
                                                                )?.value || ""
                                                              }
                                                              onChange={e => {
                                                                const newValue =
                                                                  e.target
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
                                                            />
                                                            <datalist id="traineesId">
                                                              {traineesOpt.map(
                                                                traineeOpt => (
                                                                  <option
                                                                    key={
                                                                      traineeOpt.key
                                                                    }
                                                                    value={
                                                                      traineeOpt.value
                                                                    }
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
                                                      <div className="mb-3">
                                                        <Row>
                                                          <Col className="col-4">
                                                            <Label for="courseNameId">
                                                              {this.props.t(
                                                                "Courses"
                                                              )}
                                                            </Label>
                                                            <span className="text-danger">
                                                              *
                                                            </span>
                                                          </Col>
                                                          <Col className="col-8">
                                                            <Field
                                                              name="courseNameId"
                                                              as="input"
                                                              id="courseName-Id"
                                                              type="text"
                                                              placeholder="Search..."
                                                              className={
                                                                "form-control" +
                                                                ((errors.courseNameId &&
                                                                  touched.courseNameId) ||
                                                                courseError
                                                                  ? " is-invalid"
                                                                  : "")
                                                              }
                                                              value={
                                                                coursesOffering.find(
                                                                  course =>
                                                                    course.key ===
                                                                    this.state
                                                                      .selectedCourseId
                                                                )?.value || ""
                                                              }
                                                              onChange={e => {
                                                                const newValue =
                                                                  e.target
                                                                    .value;

                                                                const selectedCouese =
                                                                  coursesOffering.find(
                                                                    course =>
                                                                      course.value ===
                                                                      newValue
                                                                  );

                                                                if (
                                                                  selectedCouese
                                                                ) {
                                                                  this.setState(
                                                                    {
                                                                      selectedCourseId:
                                                                        selectedCouese.key,
                                                                      courseName:
                                                                        selectedCouese.value,
                                                                    }
                                                                  );
                                                                } else {
                                                                  this.setState(
                                                                    {
                                                                      selectedCourseId:
                                                                        null,
                                                                      courseName:
                                                                        newValue,
                                                                    }
                                                                  );
                                                                }
                                                              }}
                                                              list="courseName"
                                                              autoComplete="off"
                                                            />
                                                            <datalist id="courseName">
                                                              {coursesOffering.map(
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
                                                      <div className="mb-3">
                                                        <Row>
                                                          <Col className="col-4">
                                                            <Label for="testExamId">
                                                              {this.props.t(
                                                                "Test/Exam"
                                                              )}
                                                            </Label>
                                                            <span className="text-danger">
                                                              *
                                                            </span>
                                                          </Col>
                                                          <Col className="col-8">
                                                            <Select
                                                              name="testExamId"
                                                              key={`select_testExam`}
                                                              // options={
                                                              //   testExamOpt
                                                              // }
                                                              className={
                                                                "form-control" +
                                                                ((errors.testExamId &&
                                                                  touched.testExamId) ||
                                                                testExamError
                                                                  ? " is-invalid"
                                                                  : "")
                                                              }
                                                              onChange={newValue => {
                                                                this.handleSelect(
                                                                  "testExamId",
                                                                  newValue.value,
                                                                  values
                                                                );
                                                              }}
                                                              // defaultValue={decreeReasons.find(
                                                              //   opt =>
                                                              //     opt.value ===
                                                              //     markObjection?.testExamId
                                                              // )}
                                                            />
                                                            {testExamError && (
                                                              <div className="invalid-feedback">
                                                                {this.props.t(
                                                                  "Test/Exam is required"
                                                                )}
                                                              </div>
                                                            )}
                                                          </Col>
                                                        </Row>
                                                      </div>
                                                      <div className="mb-3">
                                                        <Row>
                                                          <Col className="col-4">
                                                            <Label for="oldMark">
                                                              {this.props.t(
                                                                "Old Mark"
                                                              )}
                                                            </Label>
                                                          </Col>
                                                          <Col className="col-8">
                                                            <Field
                                                              type="text"
                                                              name="oldMark"
                                                              id="oldMark"
                                                              className={
                                                                "form-control"
                                                              }
                                                            />
                                                          </Col>
                                                        </Row>
                                                      </div>
                                                      <div className="mb-3">
                                                        <Row>
                                                          <Col className="col-4">
                                                            <Label for="requestTypeId">
                                                              {this.props.t(
                                                                "Request Type"
                                                              )}
                                                            </Label>
                                                          </Col>
                                                          <Col className="col-8">
                                                            <Select
                                                              name="requestTypeId"
                                                              key={`select_requestType`}
                                                              // options={
                                                              //  requestTypeOpt
                                                              // }
                                                              className={
                                                                "form-control"
                                                              }
                                                              onChange={newValue => {
                                                                this.handleSelect(
                                                                  "requestTypeId",
                                                                  newValue.value,
                                                                  values
                                                                );
                                                              }}
                                                              // defaultValue={requestTypeOpt.find(
                                                              //   opt =>
                                                              //     opt.value ===
                                                              //     markObjection?.requestTypeId
                                                              // )}
                                                            />
                                                          </Col>
                                                        </Row>
                                                      </div>
                                                      <div className="md-2">
                                                        <Row>
                                                          <Col className="col-4">
                                                            <Label for="applyingNotes">
                                                              {this.props.t(
                                                                "Applying Notes"
                                                              )}
                                                            </Label>
                                                          </Col>
                                                          <Col className="col-8">
                                                            <Field
                                                              type="textarea"
                                                              name="applyingNotes"
                                                              as="textarea"
                                                              id="applyingNotes"
                                                              className={
                                                                "form-control"
                                                              }
                                                            />
                                                          </Col>
                                                        </Row>
                                                      </div>
                                                    </div>
                                                  </CardBody>
                                                </Card>
                                              </CardBody>
                                            </Card>
                                            <Row>
                                              <Col>
                                                <div className="text-center">
                                                  <Link
                                                    to="#"
                                                    className="btn btn-primary me-2"
                                                    onClick={() => {
                                                      this.handleSave(values);
                                                    }}
                                                  >
                                                    {t("Save")}
                                                  </Link>
                                                </div>
                                              </Col>
                                            </Row>
                                          </Form>
                                        );
                                      }}
                                    </Formik>
                                  </ModalBody>
                                </Modal>
                                <Modal
                                  isOpen={editModal}
                                  toggle={this.toggleEdit}
                                  className={"modal-fullscreen"}
                                >
                                  <ModalHeader
                                    toggle={this.toggleEdit}
                                    tag="h4"
                                  >
                                    {!!isEdit
                                      ? t("Edit MarkObjection Data")
                                      : t("Add Marks Objections")}
                                  </ModalHeader>
                                  <ModalBody>
                                    <Formik
                                      enableReinitialize={true}
                                      initialValues={{
                                        ...(isEdit &&
                                          markObjection && {
                                            Id: markObjection.Id,
                                          }),
                                        employeeId:
                                          (markObjection &&
                                            markObjection.employeeId) ||
                                          selectedFullName,
                                        jobNumber:
                                          (markObjection &&
                                            markObjection.jobNumber) ||
                                          "",
                                        biometricCode:
                                          (markObjection &&
                                            markObjection.biometricCode) ||
                                          "",
                                        markObjectionTypeId:
                                          (markObjection &&
                                            markObjection.markObjectionTypeId) ||
                                          selectedMarkObjectionType,
                                        markObjectionNumber:
                                          (markObjection &&
                                            markObjection.markObjectionNumber) ||
                                          "",
                                        jobTitleId:
                                          (markObjection &&
                                            markObjection.jobTitleId) ||
                                          selectedJobTitle,
                                        // corporateNodeId:
                                        //   (markObjection &&
                                        //     markObjection.corporateNodeId) ||
                                        //   "",
                                        // physicalWorkLocation:
                                        //   (markObjection &&
                                        //     markObjection.physicalWorkLocation) ||
                                        //   "",
                                        quorum:
                                          (markObjection &&
                                            markObjection.quorum) ||
                                          "",
                                        sequenceInWorkplace:
                                          (markObjection &&
                                            markObjection.sequenceInWorkplace) ||
                                          "",
                                        hireDate: markObjection?.hireDate
                                          ? moment
                                              .utc(markObjection.hireDate)
                                              .local()
                                              .format("YYYY-MM-DD")
                                          : "",
                                        signatureDate:
                                          markObjection?.signatureDate
                                            ? moment
                                                .utc(
                                                  markObjection.signatureDate
                                                )
                                                .local()
                                                .format("YYYY-MM-DD")
                                            : "",

                                        endDate: markObjection?.endDate
                                          ? moment
                                              .utc(markObjection.endDate)
                                              .local()
                                              .format("YYYY-MM-DD")
                                          : "",

                                        ncsDate: markObjection?.ncsDate
                                          ? moment
                                              .utc(markObjection.ncsDate)
                                              .local()
                                              .format("YYYY-MM-DD")
                                          : "",

                                        // administrativeSupervisor:
                                        //   (markObjection &&
                                        //     markObjection.administrativeSupervisor) ||
                                        //   "",
                                        jobRankId:
                                          markObjection?.jobRankId || "",
                                        workClassificationId:
                                          (markObjection &&
                                            markObjection.workClassificationId) ||
                                          selectedWorkClassification,
                                        academicYearId:
                                          (markObjection &&
                                            markObjection.academicYearId) ||
                                          selectedAcademicYearId,
                                        governmentWorker:
                                          (markObjection &&
                                            markObjection.governmentWorker) ||
                                          "",
                                        hasMinistryApprove:
                                          (markObjection &&
                                            markObjection.hasMinistryApprove) ||
                                          "",
                                        employmentCaseId:
                                          (markObjection &&
                                            markObjection.employmentCaseId) ||
                                          selectedEmploymentCase,
                                      }}
                                      validationSchema={Yup.object().shape({
                                        contratType: Yup.string()
                                          .matches(/^[أ-ي]+$/)
                                          .required(
                                            "Please Enter Your Contrat Type"
                                          ),
                                        ncsDate: Yup.string().required(
                                          t("Please Enter Your NCS Date")
                                        ),
                                        hireDate: Yup.string().required(
                                          t("Please Enter Your Hire Date")
                                        ),
                                        academicYearId: Yup.string().required(
                                          t("Please Enter Your Academic Year")
                                        ),
                                        jobTitleId: Yup.string().required(
                                          t("Please Enter Your Job Title")
                                        ),
                                        // corporateNodeId: Yup.string().required(
                                        //   t("Please Enter Your Corporate Node")
                                        // ),

                                        signatureDate: Yup.string().required(
                                          t("Please Enter Your Signature Date")
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
                                          <Card id="employee-card">
                                            <CardTitle id="course_header">
                                              {t("Job profile")}
                                            </CardTitle>
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
                                                    onClick={() =>
                                                      this.handleAlertClose(
                                                        "emptyError"
                                                      )
                                                    }
                                                  ></button>
                                                </Alert>
                                              )}
                                              <Row>
                                                <Col lg="12">
                                                  <div className="mb-3">
                                                    <Row>
                                                      <Col className="col-4">
                                                        <Label for="fullName-Id">
                                                          {this.props.t(
                                                            "Full Name"
                                                          )}
                                                        </Label>
                                                        <span className="text-danger">
                                                          *
                                                        </span>
                                                      </Col>
                                                      <Col className="col-8">
                                                        <Field
                                                          name="employeeId"
                                                          as="input"
                                                          id="fullName-Id"
                                                          type="text"
                                                          placeholder="Search..."
                                                          className={
                                                            "form-control" +
                                                            (errors.employeeId &&
                                                            touched.employeeId
                                                              ? " is-invalid"
                                                              : "")
                                                          }
                                                          value={
                                                            employeesNames.find(
                                                              empl =>
                                                                empl.key ===
                                                                this.state
                                                                  .selectedFullName
                                                            )?.value || ""
                                                          }
                                                          onChange={e => {
                                                            const newValue =
                                                              e.target.value;

                                                            const selectedEmployee =
                                                              employeesNames.find(
                                                                empl =>
                                                                  empl.value ===
                                                                  newValue
                                                              );

                                                            if (
                                                              selectedEmployee
                                                            ) {
                                                              this.setState({
                                                                selectedFullName:
                                                                  selectedEmployee.key,
                                                                employeeFullName:
                                                                  selectedEmployee.value,
                                                              });
                                                            } else {
                                                              this.setState({
                                                                selectedFullName:
                                                                  null,
                                                                employeeFullName:
                                                                  newValue,
                                                              });
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
                                                        {fullNameError && (
                                                          <div className="invalid-feedback">
                                                            {this.props.t(
                                                              "Full Name is required"
                                                            )}
                                                          </div>
                                                        )}
                                                        <ErrorMessage
                                                          name="fullName-Id"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </Col>
                                                    </Row>
                                                  </div>
                                                </Col>
                                              </Row>
                                              <Row>
                                                <Col lg="12">
                                                  <div className="bordered">
                                                    <Col lg="12">
                                                      <Card>
                                                        <CardTitle id="card_header">
                                                          {t("Job Information")}
                                                        </CardTitle>
                                                        <CardBody className="cardBody">
                                                          <Row>
                                                            <Row>
                                                              <Col lg="6">
                                                                <div className="mb-3">
                                                                  <Row>
                                                                    <Col className="col-4">
                                                                      <Label for="jobNumber">
                                                                        {this.props.t(
                                                                          "Job Number"
                                                                        )}
                                                                      </Label>
                                                                    </Col>
                                                                    <Col className="col-8">
                                                                      <Field
                                                                        type="text"
                                                                        name="jobNumber"
                                                                        id="jobNumber"
                                                                        className={
                                                                          "form-control"
                                                                        }
                                                                      />
                                                                    </Col>
                                                                  </Row>
                                                                </div>
                                                                <div className="mb-3">
                                                                  <Row>
                                                                    <Col className="col-4">
                                                                      <Label for="ncsDate">
                                                                        {this.props.t(
                                                                          "NCS Date"
                                                                        )}
                                                                      </Label>
                                                                      <span className="text-danger">
                                                                        *
                                                                      </span>
                                                                    </Col>
                                                                    <Col className="col-8">
                                                                      <Field
                                                                        name="ncsDate"
                                                                        className={`form-control ${
                                                                          ncsDateError
                                                                            ? "is-invalid"
                                                                            : ""
                                                                        }`}
                                                                        type="date"
                                                                        value={
                                                                          values.ncsDate
                                                                            ? new Date(
                                                                                values.ncsDate
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
                                                                        id="ncsDate-date-input"
                                                                      />
                                                                      {ncsDateError && (
                                                                        <div className="invalid-feedback">
                                                                          {this.props.t(
                                                                            "NCS Date is required"
                                                                          )}
                                                                        </div>
                                                                      )}
                                                                    </Col>
                                                                  </Row>
                                                                </div>
                                                                {/* <div className="mb-3">
                                                                                                <Row>
                                                                                                  <Col className="col-4">
                                                                                                    <Label for="administrativeSupervisors">
                                                                                                      {this.props.t(
                                                                                                        "Administrative Supervisor"
                                                                                                      )}
                                                                                                    </Label>
                                                                                                  </Col>
                                                                                                  <Col className="col-8">
                                                                                                    <input
                                                                                                      className={`form-control ${this.state.inputClass}`}
                                                                                                      list="administrativeSupervisors"
                                                                                                      id="administrativeSupervisor"
                                                                                                      placeholder="Type to search..."
                                                                                                      autoComplete="off"
                                                                                                      onChange={
                                                                                                        this
                                                                                                          .handleSelect
                                                                                                      }
                                                                                                    />
                                                                                                    <datalist id="administrativeSupervisors">
                                                                                                      {administrativeSupervisorsOpt.map(
                                                                                                        administrativeSupervisorOpt => (
                                                                                                          <option
                                                                                                            key={
                                                                                                              administrativeSupervisorOpt.Id
                                                                                                            }
                                                                                                            value={
                                                                                                              administrativeSupervisorOpt.arTitle
                                                                                                            }
                                                                                                          />
                                                                                                        )
                                                                                                      )}
                                                                                                    </datalist>
                                                                                                  </Col>
                                                                                                </Row>
                                                                                              </div> */}
                                                              </Col>
                                                              <Col lg="6">
                                                                <div className="mb-3">
                                                                  <Row>
                                                                    <Col className="col-4">
                                                                      <Label for="jobRankId">
                                                                        {this.props.t(
                                                                          "Job Rank"
                                                                        )}
                                                                      </Label>
                                                                    </Col>
                                                                    <Col className="col-8">
                                                                      <Select
                                                                        name="jobRankId"
                                                                        key={`select_jobRank`}
                                                                        options={
                                                                          jobRanksOpt
                                                                        }
                                                                        className={`form-control`}
                                                                        onChange={newValue => {
                                                                          this.handleSelect(
                                                                            "jobRankId",
                                                                            newValue.value
                                                                          );
                                                                        }}
                                                                        defaultValue={jobRanksOpt.find(
                                                                          opt =>
                                                                            opt.value ===
                                                                            markObjection?.jobRankId
                                                                        )}
                                                                      />
                                                                    </Col>
                                                                  </Row>
                                                                </div>
                                                                <div className="mb-3">
                                                                  <Row>
                                                                    <Col className="col-4">
                                                                      <Label for="biometricCode">
                                                                        {this.props.t(
                                                                          "Biometric Code"
                                                                        )}
                                                                      </Label>
                                                                    </Col>
                                                                    <Col className="col-8">
                                                                      <Field
                                                                        type="text"
                                                                        name="biometricCode"
                                                                        id="biometricCode"
                                                                        className={
                                                                          "form-control"
                                                                        }
                                                                      />
                                                                    </Col>
                                                                  </Row>
                                                                </div>
                                                              </Col>
                                                            </Row>
                                                          </Row>
                                                        </CardBody>
                                                      </Card>
                                                    </Col>
                                                  </div>
                                                </Col>
                                              </Row>
                                              <Row>
                                                <Col lg="12">
                                                  <div className="bordered">
                                                    <Col lg="12">
                                                      <Card>
                                                        <CardTitle id="card_header">
                                                          {t(
                                                            "MarkObjectioning Type"
                                                          )}
                                                        </CardTitle>
                                                        <CardBody>
                                                          <Row>
                                                            <Col lg="6">
                                                              <div className="mb-3">
                                                                <Row>
                                                                  <Col className="col-4">
                                                                    <Label for="jobTitleId">
                                                                      {this.props.t(
                                                                        "Job Title"
                                                                      )}
                                                                    </Label>
                                                                    <span className="text-danger">
                                                                      *
                                                                    </span>
                                                                  </Col>
                                                                  <Col className="col-8">
                                                                    <Field
                                                                      name="jobTitleId"
                                                                      as="input"
                                                                      id="jobTitleId"
                                                                      type="text"
                                                                      placeholder="Search..."
                                                                      className={
                                                                        "form-control" +
                                                                        (errors.jobTitleId &&
                                                                        touched.jobTitleId
                                                                          ? " is-invalid"
                                                                          : "")
                                                                      }
                                                                      value={
                                                                        jobTitlesOpt.find(
                                                                          job =>
                                                                            job.key ===
                                                                            this
                                                                              .state
                                                                              .selectedJobTitle
                                                                        )
                                                                          ?.value ||
                                                                        ""
                                                                      }
                                                                      onChange={e => {
                                                                        const newValue =
                                                                          e
                                                                            .target
                                                                            .value;

                                                                        const selectedJob =
                                                                          jobTitlesOpt.find(
                                                                            job =>
                                                                              job.value ===
                                                                              newValue
                                                                          );

                                                                        if (
                                                                          selectedJob
                                                                        ) {
                                                                          this.setState(
                                                                            {
                                                                              selectedJobTitle:
                                                                                selectedJob.key,
                                                                              jobTitleName:
                                                                                selectedJob.value,
                                                                            }
                                                                          );
                                                                        } else {
                                                                          this.setState(
                                                                            {
                                                                              selectedJobTitle:
                                                                                null,
                                                                              jobTitleName:
                                                                                newValue,
                                                                            }
                                                                          );
                                                                        }
                                                                      }}
                                                                      list="jobTitles"
                                                                      autoComplete="off"
                                                                    />

                                                                    <datalist id="jobTitles">
                                                                      {jobTitlesOpt.map(
                                                                        jobTitle => (
                                                                          <option
                                                                            key={
                                                                              jobTitle.key
                                                                            }
                                                                            value={
                                                                              jobTitle.value
                                                                            }
                                                                          />
                                                                        )
                                                                      )}
                                                                    </datalist>
                                                                    {jobTitleError && (
                                                                      <div className="invalid-feedback">
                                                                        {this.props.t(
                                                                          "Job Title is required"
                                                                        )}
                                                                      </div>
                                                                    )}
                                                                    <ErrorMessage
                                                                      name="jobTitleId"
                                                                      component="div"
                                                                      className="invalid-feedback"
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-3">
                                                                <Row>
                                                                  <Col className="col-4">
                                                                    <Label for="workClassificationId">
                                                                      {this.props.t(
                                                                        "Work Classification"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-8">
                                                                    <Select
                                                                      name="workClassificationId"
                                                                      key={`select_workClassification`}
                                                                      options={
                                                                        workClassifications
                                                                      }
                                                                      className={`form-control`}
                                                                      onChange={newValue => {
                                                                        this.handleSelect(
                                                                          "workClassificationId",
                                                                          newValue.value
                                                                        );
                                                                      }}
                                                                      defaultValue={workClassifications.find(
                                                                        opt =>
                                                                          opt.value ===
                                                                          markObjection?.workClassificationId
                                                                      )}
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-3">
                                                                <Row>
                                                                  <Col className="col-4">
                                                                    <Label for="hireDate">
                                                                      {this.props.t(
                                                                        "Hire Date"
                                                                      )}
                                                                    </Label>
                                                                    <span className="text-danger">
                                                                      *
                                                                    </span>
                                                                  </Col>
                                                                  <Col className="col-8">
                                                                    <Field
                                                                      name="hireDate"
                                                                      className={`form-control ${
                                                                        hireDateError
                                                                          ? "is-invalid"
                                                                          : ""
                                                                      }`}
                                                                      type="date"
                                                                      value={
                                                                        values.hireDate
                                                                          ? new Date(
                                                                              values.hireDate
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
                                                                      id="hireDate-date-input"
                                                                    />
                                                                    {hireDateError && (
                                                                      <div className="invalid-feedback">
                                                                        {this.props.t(
                                                                          "Hire Date is required"
                                                                        )}
                                                                      </div>
                                                                    )}
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-3">
                                                                <Row>
                                                                  <Col className="col-4">
                                                                    <Label for="academicYearId">
                                                                      {this.props.t(
                                                                        "Academic Year"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-8">
                                                                    <Field
                                                                      name="academicYearId"
                                                                      as="input"
                                                                      id="academicYearId"
                                                                      type="text"
                                                                      placeholder="Search..."
                                                                      className={
                                                                        "form-control" +
                                                                        (errors.academicYearId &&
                                                                        touched.academicYearId
                                                                          ? " is-invalid"
                                                                          : "")
                                                                      }
                                                                      value={
                                                                        academicYearsOpt.find(
                                                                          academic =>
                                                                            academic.key ===
                                                                            this
                                                                              .state
                                                                              .selectedAcademicYearId
                                                                        )
                                                                          ?.value ||
                                                                        ""
                                                                      }
                                                                      onChange={e => {
                                                                        const newValue =
                                                                          e
                                                                            .target
                                                                            .value;

                                                                        const selectedAcademic =
                                                                          academicYearsOpt.find(
                                                                            academic =>
                                                                              academic.value ===
                                                                              newValue
                                                                          );

                                                                        if (
                                                                          selectedAcademic
                                                                        ) {
                                                                          this.setState(
                                                                            {
                                                                              selectedAcademicYearId:
                                                                                selectedAcademic.key,
                                                                              academicYear:
                                                                                selectedAcademic.value,
                                                                            }
                                                                          );
                                                                        } else {
                                                                          this.setState(
                                                                            {
                                                                              selectedAcademicYearId:
                                                                                null,
                                                                              academicYear:
                                                                                newValue,
                                                                            }
                                                                          );
                                                                        }
                                                                      }}
                                                                      list="academicYearsId"
                                                                      autoComplete="off"
                                                                    />

                                                                    <datalist id="academicYearsId">
                                                                      {academicYearsOpt.map(
                                                                        academicYear => (
                                                                          <option
                                                                            key={
                                                                              academicYear.key
                                                                            }
                                                                            value={
                                                                              academicYear.value
                                                                            }
                                                                          />
                                                                        )
                                                                      )}
                                                                    </datalist>
                                                                    {academicYearsIdError && (
                                                                      <div className="invalid-feedback">
                                                                        {this.props.t(
                                                                          "Academic Years is required"
                                                                        )}
                                                                      </div>
                                                                    )}
                                                                    <ErrorMessage
                                                                      name="academicYearId"
                                                                      component="div"
                                                                      className="invalid-feedback"
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              {/* <div className="mb-3">
                                                                                              <Row>
                                                                                                <Col className="col-4">
                                                                                                  <Label for="corporateNodeId">
                                                                                                    {this.props.t(
                                                                                                      "Corporate Node"
                                                                                                    )}
                                                                                                    <span className="text-danger">
                                                                                                      *
                                                                                                    </span>
                                                                                                  </Label>
                                                                                                </Col>
                                                                                                <Col className="col-8">
                                                                                                  <input
                                                                                                    name="corporateNodeId"
                                                                                                    className={`form-control ${this.state.inputClass}`}
                                                                                                    list="corporateNodes"
                                                                                                    id="corporateNodeId"
                                                                                                    placeholder="Type to search..."
                                                                                                    autoComplete="off"
                                                                                                    onChange={e =>
                                                                                                      this.handleSelect(
                                                                                                        e
                                                                                                          .target
                                                                                                          .name,
                                                                                                        e
                                                                                                          .target
                                                                                                          .value
                                                                                                      )
                                                                                                    }
                                                                                                  />
                                                                                                  <datalist id="corporateNodes">
                                                                                                    {corporateNodesOpt.map(
                                                                                                      corporateNodeOpt => (
                                                                                                        <option
                                                                                                          key={
                                                                                                            corporateNodeOpt.Id
                                                                                                          }
                                                                                                          value={
                                                                                                            corporateNodeOpt.arTitle
                                                                                                          }
                                                                                                        />
                                                                                                      )
                                                                                                    )}
                                                                                                  </datalist>
                                                                                                  {corporateNodeError && (
                                                                                                    <div className="invalid-feedback">
                                                                                                      {this.props.t(
                                                                                                        "Corporate Node is required"
                                                                                                      )}
                                                                                                    </div>
                                                                                                  )}
                                                                                                  <ErrorMessage
                                                                                                    name="corporateNodeId"
                                                                                                    component="div"
                                                                                                    className="invalid-feedback"
                                                                                                  />
                                                                                                </Col>
                                                                                              </Row>
                                                                                            </div> */}
                                                              {/* <div className="mb-3">
                                                                                              <Row>
                                                                                                <Col className="col-4">
                                                                                                  <Label for="physicalWorkLocation">
                                                                                                    {this.props.t(
                                                                                                      "Physical Work Location"
                                                                                                    )}
                                                                                                  </Label>
                                                                                                </Col>
                                                                                                <Col className="col-8">
                                                                                                  <Select
                                                                                                    name="physicalWorkLocation"
                                                                                                    key={`select_physicalWorkLocation`}
                                                                                                    options={
                                                                                                      physicalWorkLocationsOpt
                                                                                                    }
                                                                                                    onChange={newValue => {
                                                                                                      this.handleSelect(
                                                                                                        "physicalWorkLocation",
                                                                                                        newValue.value
                                                                                                      );
                                                                                                    }}
                                                                                                    defaultValue={physicalWorkLocationsOpt.find(
                                                                                                      opt =>
                                                                                                        opt.value ===
                                                                                                        markObjection.physicalWorkLocation
                                                                                                    )}
                                                                                                  />
                                                                                                </Col>
                                                                                              </Row>
                                                                                            </div> */}
                                                              <div className="mb-3">
                                                                <Row>
                                                                  <Col className="col-4">
                                                                    <Label for="quorum">
                                                                      {this.props.t(
                                                                        "Quorum"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-8">
                                                                    <div className="input-group">
                                                                      <Field
                                                                        type="text"
                                                                        name="quorum"
                                                                        id="quorum"
                                                                        className={
                                                                          "form-control"
                                                                        }
                                                                      />
                                                                      <div className="input-group-append">
                                                                        <span className="input-group-text">
                                                                          Weekly
                                                                        </span>
                                                                      </div>
                                                                    </div>
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                            </Col>
                                                            <Col lg="6">
                                                              <div className="mb-3">
                                                                <Row>
                                                                  <Col className="col-4">
                                                                    <Label for="employmentCaseId">
                                                                      {this.props.t(
                                                                        "Employment Case"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-8">
                                                                    <Select
                                                                      name="employmentCaseId"
                                                                      key={`select_employmentCase`}
                                                                      options={
                                                                        employmentCases
                                                                      }
                                                                      className={`form-control`}
                                                                      onChange={newValue => {
                                                                        this.handleSelect(
                                                                          "employmentCaseId",
                                                                          newValue.value
                                                                        );
                                                                      }}
                                                                      defaultValue={employmentCases.find(
                                                                        opt =>
                                                                          opt.value ===
                                                                          markObjection?.employmentCaseId
                                                                      )}
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-3">
                                                                <Row>
                                                                  <Col className="col-4">
                                                                    <Label for="markObjectionNumber">
                                                                      {this.props.t(
                                                                        "MarkObjection Number"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-8">
                                                                    <Field
                                                                      name="markObjectionNumber"
                                                                      type="text"
                                                                      id="markObjectionNumber"
                                                                      className={
                                                                        "form-control"
                                                                      }
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-3">
                                                                <Row>
                                                                  <Col className="col-4">
                                                                    <Label for="signatureDate">
                                                                      {this.props.t(
                                                                        "Signature Date"
                                                                      )}
                                                                    </Label>
                                                                    <span className="text-danger">
                                                                      *
                                                                    </span>
                                                                  </Col>
                                                                  <Col className="col-8">
                                                                    <Field
                                                                      name="signatureDate"
                                                                      className={`form-control ${
                                                                        signatureDateError
                                                                          ? "is-invalid"
                                                                          : ""
                                                                      }`}
                                                                      type="date"
                                                                      value={
                                                                        values.signatureDate
                                                                          ? new Date(
                                                                              values.signatureDate
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
                                                                      id="signatureDate-date-input"
                                                                    />
                                                                    {signatureDateError && (
                                                                      <div className="invalid-feedback">
                                                                        {this.props.t(
                                                                          "Signature Date is required"
                                                                        )}
                                                                      </div>
                                                                    )}
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-3">
                                                                <Row>
                                                                  <Col className="col-4">
                                                                    <Label for="endDate">
                                                                      {this.props.t(
                                                                        "End Date"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-8">
                                                                    <Field
                                                                      className={`form-control`}
                                                                      name="endDate"
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
                                                                  </Col>
                                                                </Row>
                                                              </div>
                                                              <div className="mb-3">
                                                                <Row>
                                                                  <Col className="col-4">
                                                                    <Label for="sequenceInWorkplace">
                                                                      {this.props.t(
                                                                        "Sequence In Workplace"
                                                                      )}
                                                                    </Label>
                                                                  </Col>
                                                                  <Col className="col-8">
                                                                    <Field
                                                                      type="text"
                                                                      name="sequenceInWorkplace"
                                                                      id="sequenceInWorkplace"
                                                                      className={
                                                                        "form-control"
                                                                      }
                                                                    />
                                                                  </Col>
                                                                </Row>
                                                              </div>
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
                                          <Col lg="12">
                                            <div className="bordered">
                                              <Col lg="12">
                                                <Card>
                                                  <CardTitle id="card_header">
                                                    {t("Ministry Information")}
                                                  </CardTitle>
                                                  <CardBody>
                                                    <Row>
                                                      <Col lg="auto">
                                                        {" "}
                                                        <Label for="ministry">
                                                          {this.props.t(
                                                            "Has Ministry Approve"
                                                          )}
                                                        </Label>
                                                      </Col>
                                                      <Col lg="2">
                                                        <div
                                                          name="hasMinistryApprove"
                                                          id="ministry"
                                                          role="group"
                                                          className={
                                                            "btn-group btn-group-example mb-3 bg-transparent"
                                                          }
                                                        >
                                                          <button
                                                            id="yes"
                                                            type="button"
                                                            name="hasMinistryApprove"
                                                            value={
                                                              selectedHasMinistryApprove ==
                                                              1
                                                                ? "active"
                                                                : ""
                                                            }
                                                            className={`btn btn-outline-primary w-sm ${
                                                              selectedHasMinistryApprove ===
                                                              1
                                                                ? "active"
                                                                : ""
                                                            }`}
                                                            onClick={() =>
                                                              this.handleButtonClick(
                                                                "hasMinistryApprove",
                                                                1
                                                              )
                                                            }
                                                          >
                                                            {this.props.t(
                                                              "Yes"
                                                            )}
                                                          </button>

                                                          <button
                                                            id="no"
                                                            type="button"
                                                            name="hasMinistryApprove"
                                                            value={
                                                              selectedHasMinistryApprove ===
                                                              0
                                                                ? "active"
                                                                : ""
                                                            }
                                                            className={`btn btn-outline-primary w-sm ${
                                                              selectedHasMinistryApprove ===
                                                              0
                                                                ? "active"
                                                                : ""
                                                            }`}
                                                            onClick={() =>
                                                              this.handleButtonClick(
                                                                "hasMinistryApprove",
                                                                0
                                                              )
                                                            }
                                                          >
                                                            {this.props.t("No")}
                                                          </button>
                                                        </div>
                                                      </Col>
                                                      <Col
                                                        lg="auto"
                                                        style={{
                                                          marginRight: "2rem",
                                                        }}
                                                      >
                                                        {" "}
                                                        <Label for="government">
                                                          {this.props.t(
                                                            "Government Worker"
                                                          )}
                                                        </Label>
                                                      </Col>
                                                      <Col lg="2">
                                                        <div
                                                          name="governmentWorker"
                                                          id="government"
                                                          role="group"
                                                          className={
                                                            "btn-group btn-group-example mb-3 bg-transparent"
                                                          }
                                                        >
                                                          <button
                                                            id="yes"
                                                            type="button"
                                                            name="governmentWorker"
                                                            value={
                                                              selectedGovernmentWorker ==
                                                              1
                                                                ? "active"
                                                                : ""
                                                            }
                                                            className={`btn btn-outline-primary w-sm ${
                                                              selectedGovernmentWorker ===
                                                              1
                                                                ? "active"
                                                                : ""
                                                            }`}
                                                            onClick={() =>
                                                              this.handleButtonClick(
                                                                "governmentWorker",
                                                                1
                                                              )
                                                            }
                                                          >
                                                            {this.props.t(
                                                              "Yes"
                                                            )}
                                                          </button>

                                                          <button
                                                            id="no"
                                                            type="button"
                                                            name="governmentWorker"
                                                            value={
                                                              selectedGovernmentWorker ===
                                                              0
                                                                ? "active"
                                                                : ""
                                                            }
                                                            className={`btn btn-outline-primary w-sm ${
                                                              selectedGovernmentWorker ===
                                                              0
                                                                ? "active"
                                                                : ""
                                                            }`}
                                                            onClick={() =>
                                                              this.handleButtonClick(
                                                                "governmentWorker",
                                                                0
                                                              )
                                                            }
                                                          >
                                                            {this.props.t("No")}
                                                          </button>
                                                        </div>
                                                      </Col>
                                                    </Row>
                                                  </CardBody>
                                                </Card>
                                              </Col>
                                            </div>
                                          </Col>
                                          <Row>
                                            <Col>
                                              <div className="text-center">
                                                <Link
                                                  to="#"
                                                  className="btn btn-primary me-2"
                                                  onClick={() => {
                                                    this.handleSave(values);
                                                  }}
                                                >
                                                  {t("Save")}
                                                </Link>
                                              </div>
                                            </Col>
                                          </Row>
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
  marksObjections,
  menu_items,
  employees,
  employmentCases,
  workClassifications,
  trainees,
  classScheduling,
}) => ({
  coursesOffering: classScheduling.coursesOffering,
  workClassifications: workClassifications.workClassifications || [],
  // physicalWorkLocationsOpt: employees.physicalWorkLocationsOpt || [],
  jobRanksOpt: employees.jobRanksOpt || [],
  jobTitlesOpt: employees.jobTitlesOpt || [],
  // corporateNodesOpt: employees.corporateNodesOpt || [],
  traineesOpt: trainees.traineesOpt,
  genders: employees.genders,
  nationalitiesOpt: employees.nationalitiesOpt,
  academicYearsOpt: employees.academicYearsOpt,
  employmentCases: employmentCases.employmentCases,
  marksObjections: marksObjections.marksObjections,
  genders: employees.genders,
  employeesNames: employees.employeesNames,
  employees: employees.employees,
  deleted: marksObjections.deleted,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetMarksObjections: () => dispatch(getMarksObjections()),
  onAddNewMarkObjection: markObjection =>
    dispatch(addNewMarkObjection(markObjection)),
  onUpdateMarkObjection: markObjection =>
    dispatch(updateMarkObjection(markObjection)),
  onDeleteMarkObjection: markObjection =>
    dispatch(deleteMarkObjection(markObjection)),
  onGetMarkObjectionDeletedValue: () =>
    dispatch(getMarkObjectionDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(MarksObjectionsList)));
