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
      selectedRequestStatus: null,
    };
    this.toggle = this.toggle.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    const {
      requestStatus,
      marksObjections,
      onGetMarksObjections,
      traineeOpt,
      deleted,
      user_menu,
      requestTypes,
      gradeTypes,
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
      requestStatus,
      marksObjections,
      deleted,
      traineeOpt,
      requestTypes,
      gradeTypes,
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
      selectedRequestType,
      selectedRequestStatus,
    } = this.state;
    const { traineesOpt, onAddNewMarkObjection, onUpdateMarkObjection } =
      this.props;
    console.log("values", values);

    values["courseId"] = selectedCourseId;
    values["testExamId"] = selectedTestExam;
    values["requestTypeId"] = selectedRequestType;
    values.requestStatusId = isEdit ? selectedRequestStatus : 4;
    if (
      values.requestNum === "" ||
      values.applyingDate === "" ||
      values.traineeName === "" ||
      (values.courseId === "" && selectedCourseId === "") ||
      (values.testExamId === "" && selectedTestExam === "")
    ) {
      if (values.requestNum.trim() === "") {
        this.setState({ requestNumError: true, saveError: true });
      }

      if (values.applyingDate.trim() === "") {
        this.setState({ applyingDateError: true, saveError: true });
      }
      if (values.traineeName.trim() === "") {
        this.setState({ traineeError: true, saveError: true });
      }
      if (values.courseId === "" && selectedCourseId === "") {
        this.setState({ courseError: true, saveError: true });
      }
      if (values.testExamId === "" && selectedTestExam === "") {
        this.setState({ testExamError: true, saveError: true });
      }

      const errorSave = this.props.t("Fill the Required Fields to Save");

      this.setState({ errorMessage: errorSave }, () => {
        window.scrollTo(0, 0);
      });
    } else {
      this.setState({ requestNumError: false, saveError: false });
      this.setState({ applyingDateError: false, saveError: false });
      this.setState({ traineeError: false, saveError: false });
      this.setState({ courseError: false, saveError: false });
      this.setState({ testExamError: false, saveError: false });

      let objectioninfo = {};

      Object.keys(values).forEach(function (key) {
        if (
          values[key] != undefined &&
          (values[key].length > 0 || values[key] != "")
        )
          objectioninfo[key] = values[key];
      });
      objectioninfo["courseId"] = selectedCourseId;
      objectioninfo["testExamId"] = selectedTestExam;
      objectioninfo["requestTypeId"] = selectedRequestType;
      delete objectioninfo.traineeName;
      const traineeNamePart = values.traineeName.split(" - ")[0].trim();

      const trainee = traineesOpt.find(t => t.value.trim() === traineeNamePart);

      objectioninfo["traineeId"] = trainee?.key || null;
      console.log("qqqqqqqqqqqqqqq", objectioninfo);

      this.setState({
        errorMessages: {},
      });

      if (isEdit) {
        console.log("rrrrrrrrrrrrrrr", objectioninfo);
        // onUpdatemar(objectioninfo);
        const saveMessage = "Saved successfully ";
        this.setState({
          successMessage: saveMessage,
        });

        this.toggleEdit();
      } else {
        console.log("objectioninfoobjectioninfo", objectioninfo);

        onAddNewMarkObjection(objectioninfo);
        const saveMessage = "Saved successfully ";
        this.setState({
          successMessage: saveMessage,
        });

        this.toggle();
      }
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
    const { traineesOpt, onGetFilteredCoursesPlan } = this.props;
    console.log("traineetraineetrainee", traineesOpt);
    let markObjection = arg;
    const trainee = traineesOpt.find(
      trainee => trainee.fullName === markObjection["traineeName"]
    );
    console.log("traineetraineetrainee", trainee);
    onGetFilteredCoursesPlan(trainee);
    console.log("traineetraineetrainee", markObjection);

    this.setState({
      markObjection,
      selectedTestExam: markObjection[testExamId],
      selectedRequestType: markObjection[requestTypeId],
      selectedRequestStatus: markObjection[requestStatusId],
      isEdit: true,
    });
    this.toggleEdit();
  };

  handleValidDate = date => {
    const date1 = moment(new Date(date)).format("DD /MM/ Y");
    return date1;
  };

  handleSelect = (fieldName, selectedValue, values) => {
    if (fieldName == "courseId") {
      this.setState({
        selectedCourseId: selectedValue,
        markObjection: values,
      });
    }
    if (fieldName == "testExamId") {
      this.setState({
        selectedTestExam: selectedValue,
        // markObjection: values,
      });
    }
    if (fieldName == "requestTypeId") {
      this.setState({
        selectedRequestType: selectedValue,
        // markObjection: values,
      });
    }
  };

  render() {
    const markObjection = this.state.markObjection;
    const {
      requestStatus,
      coursesOffering,
      traineesOpt,
      marksObjections,
      onGetFilteredCoursesPlan,
      filteredCourses,
      t,
      deleted,
      requestTypes,
      gradeTypes,
    } = this.props;
    const {
      errorMessage,
      selectedRequestStatus,
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
        dataField: "requestTypeId",
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
        dataField: "requestStatusId",
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
    const gradeColumns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
      {
        dataField: "Ex1",
        text: this.props.t("(20)first test"),
        sort: true,
        editable: false,
      },
      {
        dataField: "Ex2",
        text: this.props.t("(30)test 2"),
        sort: true,
        editable: false,
      },
      {
        dataField: "Ex3",
        text: this.props.t("(50)final"),
        sort: true,
        editable: false,
      },
      {
        dataField: "totalGrade",
        text: this.props.t("Total"),
        sort: true,
        editable: false,
      },
      {
        dataField: "letter_grade",
        text: this.props.t("Letter"),
        sort: true,
        editable: false,
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
                                      ? t("Edit Mark Objection")
                                      : t("Add Mark Objection")}
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
                                        traineeName:
                                          markObjection?.selectedTrainee || "",
                                        courseId:
                                          (markObjection &&
                                            markObjection.courseId) ||
                                          "",
                                        testExamId:
                                          (markObjection &&
                                            markObjection.testExamId) ||
                                          "",
                                        oldMark:
                                          (markObjection &&
                                            markObjection.oldMark) ||
                                          "",
                                        requestTypeId:
                                          (markObjection &&
                                            markObjection.requestTypeId) ||
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
                                                      onClick={() =>
                                                        this.handleAlertClose(
                                                          "errorMessage"
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
                                                              type="number"
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
                                                            <Label for="traineeName">
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
                                                              name="traineeName"
                                                              type="text"
                                                              list="traineeNameList"
                                                              as="input"
                                                              id="traineeName-Id"
                                                              className={
                                                                "form-control" +
                                                                ((errors.traineeName &&
                                                                  touched.traineeName) ||
                                                                traineeError
                                                                  ? " is-invalid"
                                                                  : "")
                                                              }
                                                              onChange={e => {
                                                                const traineeInput =
                                                                  e.target
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
                                                                if (plan) {
                                                                  onGetFilteredCoursesPlan(
                                                                    plan
                                                                  );
                                                                }
                                                                handleChange(e);
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
                                                                  markObjection?.courseId
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
                                                              options={
                                                                gradeTypes
                                                              }
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
                                                              value={gradeTypes.find(
                                                                opt =>
                                                                  opt.value ===
                                                                  markObjection?.testExamId
                                                              )}
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
                                                              type="number"
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
                                                              options={
                                                                requestTypes
                                                              }
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
                                                              defaultValue={requestTypes.find(
                                                                opt =>
                                                                  opt.value ===
                                                                  markObjection?.requestTypeId
                                                              )}
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
                                  size="xl"
                                >
                                  <ModalHeader
                                    toggle={this.toggleEdit}
                                    tag="h4"
                                  >
                                    {!!isEdit
                                      ? t("Edit Mark Objection")
                                      : t("Add Mark Objection")}
                                  </ModalHeader>
                                  <ModalBody>
                                    <Formik
                                      enableReinitialize={true}
                                      initialValues={{
                                        ...(isEdit &&
                                          markObjection && {
                                            Id: markObjection.Id,
                                          }),
                                        requestNum:
                                          (markObjection &&
                                            markObjection.requestNum) ||
                                          "",
                                        applyingDate:
                                          (markObjection &&
                                            markObjection.applyingDate) ||
                                          "",
                                        traineeName:
                                          markObjection?.selectedTrainee || "",
                                        courseId:
                                          (markObjection &&
                                            markObjection.courseId) ||
                                          "",
                                        testExamId:
                                          (markObjection &&
                                            markObjection.testExamId) ||
                                          "",
                                        oldMark:
                                          (markObjection &&
                                            markObjection.oldMark) ||
                                          "",
                                        requestTypeId:
                                          (markObjection &&
                                            markObjection.requestTypeId) ||
                                          "",
                                        applyingNotes:
                                          (markObjection &&
                                            markObjection.absencePercent) ||
                                          "",
                                      }}
                                      validationSchema={Yup.object().shape({})}
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
                                              {t("")}
                                            </CardTitle>
                                            <CardBody className="cardBody">
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
                                                    onClick={
                                                      this.handleAlertClose
                                                    }
                                                  ></button>
                                                </Alert>
                                              )}

                                              <div className="bordered">
                                                <Row>
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
                                                              markObjection?.courseId
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
                                                  {/*<Row>
                                                    <Col lg="12">
                                                      <BootstrapTable
                                                        keyField="Id"
                                                        // data={coursesOffering}
                                                        columns={gradeColumns}
                                                        cellEdit={cellEditFactory(
                                                          {
                                                            mode: "dbclick",
                                                            blurToSave: true,
                                                            afterSaveCell: (
                                                              oldValue,
                                                              newValue,
                                                              row,
                                                              column
                                                            ) => {
                                                              this.handleExperienceDataChange(
                                                                row.Id,
                                                                column.dataField,
                                                                newValue
                                                              );
                                                            },
                                                          }
                                                        )}
                                                      />
                                                    </Col>
                                                  </Row>*/}
                                                  <Row>
                                                    <Col className="col-6">
                                                      <div className="mb-3">
                                                        <Row>
                                                          <Col className="col-4">
                                                            <Label for="testExamId">
                                                              {this.props.t(
                                                                "Test/Exam"
                                                              )}
                                                            </Label>
                                                          </Col>
                                                          <Col className="col-8">
                                                            <Select
                                                              name="testExamId"
                                                              key={`select_testExam`}
                                                              // options={
                                                              //   testExamOpt
                                                              // }
                                                              className={
                                                                "form-control"
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
                                                          </Col>
                                                        </Row>
                                                      </div>
                                                    </Col>
                                                    <Col className="col-6">
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
                                                    </Col>
                                                  </Row>
                                                  <Row>
                                                    <Col className="col-6">
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
                                                    </Col>
                                                    <Col className="col-6">
                                                      <div className="mb-3">
                                                        <Row>
                                                          <Col className="col-4">
                                                            <Label for="newMark">
                                                              {this.props.t(
                                                                "New Mark"
                                                              )}
                                                            </Label>
                                                            <span className="text-danger">
                                                              *
                                                            </span>
                                                          </Col>
                                                          <Col className="col-8">
                                                            <Field
                                                              type="text"
                                                              name="newMark"
                                                              id="newMark"
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
                                                <Row>
                                                  <Col className="col-6">
                                                    <div className="mb-3">
                                                      <Row>
                                                        <Col className="col-4">
                                                          <Label for="applyingUser">
                                                            {this.props.t(
                                                              "Applying User"
                                                            )}
                                                          </Label>
                                                        </Col>
                                                        <Col className="col-8">
                                                          <Field
                                                            type="text"
                                                            name="applyingUser"
                                                            id="applyingUser"
                                                            className={
                                                              "form-control"
                                                            }
                                                          />
                                                        </Col>
                                                      </Row>
                                                    </div>
                                                  </Col>
                                                  <Col className="col-6">
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
                                                  </Col>
                                                </Row>
                                              </div>

                                              <div className="bordered">
                                                <div className="mb-3">
                                                  <Row>
                                                    <Col className="col-4">
                                                      <Label for="decisionDate">
                                                        {this.props.t(
                                                          "Decision Date"
                                                        )}
                                                      </Label>
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Col>
                                                    <Col className="col-8">
                                                      <Field
                                                        className={`form-control`}
                                                        name="decisionDate"
                                                        type="date"
                                                        value={
                                                          values.decisionDate
                                                            ? new Date(
                                                                values.decisionDate
                                                              )
                                                                .toISOString()
                                                                .split("T")[0]
                                                            : ""
                                                        }
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        id="decisionDate-date-input"
                                                      />
                                                    </Col>
                                                  </Row>
                                                </div>
                                                <Row>
                                                  <Col className="col-6">
                                                    <div className="mb-3">
                                                      <Row>
                                                        <Col className="col-4">
                                                          <Label for="decisionUser">
                                                            {this.props.t(
                                                              "Decision User"
                                                            )}
                                                          </Label>
                                                        </Col>
                                                        <Col className="col-8">
                                                          <Field
                                                            type="text"
                                                            name="decisionUser"
                                                            id="decisionUser"
                                                            className={
                                                              "form-control"
                                                            }
                                                          />
                                                        </Col>
                                                      </Row>
                                                    </div>
                                                  </Col>
                                                  <Col className="col-6">
                                                    <div className="md-2">
                                                      <Row>
                                                        <Col className="col-4">
                                                          <Label for="decisionNotes">
                                                            {this.props.t(
                                                              "Decision Notes"
                                                            )}
                                                          </Label>
                                                        </Col>
                                                        <Col className="col-8">
                                                          <Field
                                                            type="textarea"
                                                            name="decisionNotes"
                                                            as="textarea"
                                                            id="decisionNotes"
                                                            className={
                                                              "form-control"
                                                            }
                                                          />
                                                        </Col>
                                                      </Row>
                                                    </div>
                                                  </Col>
                                                </Row>
                                                <div className="mb-3 mt-3">
                                                  <Row>
                                                    <Col lg="4">
                                                      <label
                                                        htmlFor="requestStatusId"
                                                        className="form-label d-flex"
                                                      >
                                                        {this.props.t(
                                                          "Request Status"
                                                        )}
                                                        <span className="text-danger">
                                                          *
                                                        </span>
                                                      </label>
                                                    </Col>
                                                    <Col lg="8">
                                                      <div className="d-flex flex-wrap gap-3">
                                                        <div
                                                          className="btn-group button-or"
                                                          role="group"
                                                        >
                                                          {requestStatus.map(
                                                            (status, index) => (
                                                              <React.Fragment
                                                                key={index}
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
                                                                  defaultChecked={
                                                                    selectedRequestStatus ===
                                                                    status.Id
                                                                      ? "active"
                                                                      : ""
                                                                  }
                                                                  onChange={() =>
                                                                    setFieldValue(
                                                                      "requestStatusId",
                                                                      status.Id
                                                                    )
                                                                  }
                                                                />
                                                                <label
                                                                  className="btn btn-outline-primary smallButton w-sm"
                                                                  htmlFor={`btnradio${index}`}
                                                                >
                                                                  {
                                                                    status.arTitle
                                                                  }
                                                                </label>
                                                              </React.Fragment>
                                                            )
                                                          )}
                                                        </div>
                                                      </div>
                                                    </Col>
                                                  </Row>
                                                </div>
                                              </div>

                                              <div className="bordered">
                                                <div className="mb-3">
                                                  <Row>
                                                    <Col className="col-4">
                                                      <Label for="turnDate">
                                                        {this.props.t(
                                                          "Turn Date"
                                                        )}
                                                      </Label>
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Col>
                                                    <Col className="col-8">
                                                      <Field
                                                        className={`form-control`}
                                                        name="turnDate"
                                                        type="date"
                                                        value={
                                                          values.turnDate
                                                            ? new Date(
                                                                values.turnDate
                                                              )
                                                                .toISOString()
                                                                .split("T")[0]
                                                            : ""
                                                        }
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        id="turnDate-date-input"
                                                      />
                                                    </Col>
                                                  </Row>
                                                </div>
                                                <Row>
                                                  <Col className="col-6">
                                                    <div className="mb-3">
                                                      <Row>
                                                        <Col className="col-4">
                                                          <Label for="turnUser">
                                                            {this.props.t(
                                                              "Turn User"
                                                            )}
                                                          </Label>
                                                        </Col>
                                                        <Col className="col-8">
                                                          <Field
                                                            type="text"
                                                            name="turnUser"
                                                            id="turnUser"
                                                            className={
                                                              "form-control"
                                                            }
                                                          />
                                                        </Col>
                                                      </Row>
                                                    </div>
                                                  </Col>
                                                  <Col className="col-6">
                                                    <div className="md-2">
                                                      <Row>
                                                        <Col className="col-4">
                                                          <Label for="turnNotes">
                                                            {this.props.t(
                                                              "Turn Notes"
                                                            )}
                                                          </Label>

                                                          <span className="text-danger">
                                                            *
                                                          </span>
                                                        </Col>
                                                        <Col className="col-8">
                                                          <Field
                                                            type="textarea"
                                                            name="turnNotes"
                                                            as="textarea"
                                                            id="turnNotes"
                                                            className={
                                                              "form-control"
                                                            }
                                                          />
                                                        </Col>
                                                      </Row>
                                                    </div>
                                                  </Col>
                                                </Row>
                                              </div>
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
  traineesDecrees,
  menu_items,
  employees,
  trainees,
  gradeTypes,
}) => ({
  filteredCourses: traineesDecrees.filteredCoursesPlans,
  traineesOpt: trainees.traineesOpt,
  requestStatus: marksObjections.requestStatus,
  requestTypes: marksObjections.requestTypes,
  marksObjections: marksObjections.marksObjections,
  employeesNames: employees.employeesNames,
  employees: employees.employees,
  deleted: marksObjections.deleted,
  user_menu: menu_items.user_menu || [],
  gradeTypes: gradeTypes.gradeTypes,
});

const mapDispatchToProps = dispatch => ({
  onGetMarksObjections: () => dispatch(getMarksObjections()),
  onAddNewMarkObjection: markObjection =>
    dispatch(addNewMarkObjection(markObjection)),
  onUpdateMarkObjection: markObjection =>
    dispatch(updateMarkObjection(markObjection)),
  onDeleteMarkObjection: markObjection =>
    dispatch(deleteMarkObjection(markObjection)),
  onGetFilteredCoursesPlan: trainee =>
    dispatch(getFilteredCoursesPlans(trainee)),
  onGetMarkObjectionDeletedValue: () =>
    dispatch(getMarkObjectionDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(MarksObjectionsList)));
