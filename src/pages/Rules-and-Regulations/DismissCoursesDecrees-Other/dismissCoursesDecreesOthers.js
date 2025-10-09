import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as moment from "moment";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import Select from "react-select";
import * as Yup from "yup";
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
  InputGroup,
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
  getDismissDecreesOther,
  addNewDismissDecreeOther,
  updateDismissDecreeOther,
  deleteDismissDecreeOther,
  getDismissDecreeOtherDeletedValue,
} from "store/dismissCoursesDecrees-other/actions";
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

class DismissDecreesOtherList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dismissDecreesOther: [],
      dismissDecreeOther: "",
      deleteModal: false,
      selectedRowId: null,
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
      duplicateError: null,
      duplicateError: null,
      selectedRowId: null,
      modal: false,
      editModal: false,
      isEdit: false,
      isAdd: false,
      selectedDecreeReason: null,
      decreeReasonName: "",
      selectedTraineeId: null,
      traineeName: "",
      selectedCourseId: null,
      courseName: "",
      errorMessage: null,
      successMessage: null,
      applyingDateError: false,
      startDateError: false,
      endDateError: false,
      traineeError: false,
      courseError: false,
      decreeReasonError: false,
      values: "",
    };
    this.state = {};
  }

  componentDidMount() {
    const {
      dismissDecreesOther,
      decreeReasons,
      employeesNames,
      years,
      onGetDismissDecreesOther,
      user_menu,
      deleted,
      coursesOffering,
      decisionStatus,
      turnReasons,
    } = this.props;

    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);

    onGetDismissDecreesOther();
    this.setState({
      dismissDecreesOther,
      coursesOffering,
      decreeReasons,
      years,
      deleted,
      decisionStatus,
      turnReasons,
      employeesNames,
    });
  }

  componentDidUpdate(prevProps) {
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

  handleAddRow = () => {
    const { onAddNewDismissDecreeOther, dismissDecreesOther } = this.props;

    const newRow = {
      TraineeNum: "-----",
    };

    // Check if the same value already exists in the table
    const emptyRowsExist = dismissDecreesOther.some(
      dismissDecreesOther => dismissDecreesOther.TraineeNum.trim() === "-----"
      // ||
      // dismissDecreeOther.enTitle.trim() === ""
    );

    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewDismissDecreeOther(newRow);
    }
  };

  handleDeleteRow = () => {
    const { onDeleteDismissDecreeOther } = this.props;
    const { selectedRowId } = this.state;
    if (selectedRowId !== null) {
      onDeleteDismissDecreeOther(selectedRowId);
      this.setState({
        deleteModal: false,
        selectedRowId: null,
        showAlert: true,
      });
    }
  };

  toggleDeleteModal = () => {
    this.setState(prev => ({ deleteModal: !prev.deleteModal }));
  };

  onClickDelete = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };

  handleDismissDecreeOtherDataChange = (rowId, fieldName, fieldValue) => {
    const { dismissDecreesOther, onUpdateDismissDecreeOther } = this.props;
    const isDuplicate = dismissDecreesOther.some(dismissDecreeOther => {
      return (
        dismissDecreeOther.Id !== rowId &&
        dismissDecreeOther.arTitle.trim() === fieldValue.trim()
      );
    });
    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateDismissDecreeOther(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateDismissDecreeOther(onUpdate);
    }
  };
  handleAlertClose = alertName => {
    this.setState({ [alertName]: null });
  };

  handleSuccessClose = () => {
    this.setState({ showAlert: null });
    this.props.onGetDismissDecreeOtherDeletedValue();
  };

  handleErrorClose = () => {
    this.setState({ showAlert: null });
    this.props.onGetDismissDecreeOtherDeletedValue();
  };

  handleAddRow = () => {
    this.setState({
      dismissDecreeOther: "",
      isEdit: false,
      isOpen: false,
      isAdd: true,
    });
    this.toggle();
  };

  handleSubmit = values => {
    const {
      selectedCourseId,
      selectedTraineeId,
      selectedDecreeReason,
      selectedTurnReason,
      selectedDecisionStatus,
      isEdit,
    } = this.state;
    const { onAddNewDismissDecreeOther, onUpdateDismissDecreeOther } =
      this.props;

    values["traineeId"] = selectedTraineeId;
    values["coursesId"] = selectedCourseId;
    values["decreeReasonId"] = selectedDecreeReason;
    values["decreeStatusId"] = isEdit ? selectedDecisionStatus : 4;
    values["turnReasonId"] = selectedTurnReason;

    console.log("valuesssssssssssssssssssss", values);

    let warningInfo = {};
    if (
      values.startDate &&
      values.endDate &&
      values.applyingDate &&
      selectedTraineeId !== null &&
      selectedCourseId !== null &&
      selectedDecreeReason !== null
    ) {
      Object.keys(values).forEach(function (key) {
        if (
          values[key] != undefined &&
          (values[key].length > 0 || values[key] != "")
        )
          warningInfo[key] = values[key];
      });
      console.log("dismissDecreeOtherInfodismissDecreeOtherInfo", warningInfo);
      if (isEdit) {
        console.log("9999999", warningInfo);
        // onUpdateDismissDecreeOther(warningInfo);
      } else {
        // onAddNewDismissDecreeOther(warningInfo);
      }
      const saveMessage = "Saved successfully ";
      this.setState({
        successMessage: saveMessage,
        errorMessages: {},
      });
      this.toggle();
    } else if (
      values.startDate === "" ||
      values.endDate === "" ||
      values.applyingDate === "" ||
      (values.traineeId === "" && selectedTraineeId === "")(
        values.coursesId === "" && selectedCourseId === ""
      )(values.decreeReasonId === "" && selectedDecreeReason === "")
    ) {
      this.setState({ applyingDateError: true, saveError: true });
      this.setState({ startDateError: true, saveError: true });
      this.setState({ endDateError: true, saveError: true });
      this.setState({ traineeError: true, saveError: true });
      this.setState({ courseError: true, saveError: true });
      this.setState({ decreeReasonError: true, saveError: true });

      const emptyError = this.props.t("Fill the Required Fields to Save");

      this.setState({ emptyError: emptyError });
    }
  };

  handleDismissDecreeOtherEdit = arg => {
    console.log("arg", arg);

    this.setState({
      dismissDecreeOther: arg,
      // selectedJobRank: arg.jobRankId,
      // selectedJobTitle: arg.jobTitleId,
      // jobTitleName: arg.jobTitle,
      // selectedCorporateNode: arg.corporateNodeId,
      // selectedContractType: arg.dismissDecreeOtherTypeId,
      // selectedEmploymentCase: arg.employmentCaseId,
      // selectedHasMinistryApprove: arg.hasMinistryApprove,
      // selectedGovernmentWorker: arg.governmentWorker,
      // selectedWorkClassification: arg.workClassificationId,
      // selectedAcademicYearId: arg.academicYearId,
      // academicYear: arg.academicYear,
      isEdit: true,
    });
    this.toggleEdit();
  };

  handleSelect = (fieldName, selectedValue, values) => {
    if (fieldName == "decreeReasonId") {
      this.setState({
        selectedDecreeReason: selectedValue,
        dismissDecreeOther: values,
      });
    }
  };

  render() {
    const {
      dismissDecreesOther,
      employeesNames,
      years,
      coursesOffering,
      decreeReasons,
      t,
      traineesOpt,
      decisionStatus,
      deleted,
      turnReasons,
    } = this.props;
    const {
      modal,
      editModal,
      deleteModal,
      duplicateError,
      showAlert,
      showAddButton,
      showSearchButton,
      isEdit,
      dismissDecreeOther,
      selectedTraineeId,
      selectedDecreeReason,
      selectedCourseId,
      applyingDateError,
      startDateError,
      endDateError,
      traineeError,
      courseError,
      decreeReasonError,
      selectedDecreeStatus,
      selectedTurnReason,
      emptyError,
      successMessage,
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
      {
        dataField: "Id",
        text: this.props.t("ID"),
        hidden: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "TraineeNum",
        text: t("Trainee Num"),
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "traineeName",
        text: t("Trainee Name"),
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },

      {
        dataField: "ApplyingDate",
        text: t("Applying Date"),
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "StartDate",
        text: t("Start Date"),
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "courseName",
        text: t("Course"),
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "DecreeStatus",
        text: t("Decree Status"),
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "edit",
        text: "",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, dismissDecreeOther) => (
          <Tooltip title={this.props.t("Edit")} placement="top">
            <IconButton
              className="text-sm-end"
              onClick={() =>
                this.handleDismissDecreeOtherEdit(dismissDecreeOther)
              }
            >
              <i className="mdi mdi-pencil font-size-18" id="edittooltip"></i>
            </IconButton>
          </Tooltip>
        ),
      },
    ];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: dismissDecreesOther.length,
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
            <Breadcrumbs
              breadcrumbItem={this.props.t("Dismiss Courses Decrees Other")}
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
                        data={dismissDecreesOther}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={dismissDecreesOther}
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
                                  data={dismissDecreesOther}
                                  columns={columns}
                                  cellEdit={cellEditFactory({
                                    mode: "dbclick",
                                    blurToSave: true,
                                    afterSaveCell: (
                                      oldValue,
                                      newValue,
                                      row,
                                      column
                                    ) => {
                                      this.handleDismissDecreeOtherDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    },
                                  })}
                                  defaultSorted={defaultSorting}
                                  noDataIndication={t(
                                    "No Dismiss Courses Decrees Other found"
                                  )}
                                  filter={filterFactory()}
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
                                      ? t("Edit Decree")
                                      : t("Add Decree")}
                                  </ModalHeader>
                                  <ModalBody>
                                    <Formik
                                      enableReinitialize={true}
                                      initialValues={{
                                        traineeId:
                                          (dismissDecreeOther &&
                                            dismissDecreeOther.traineeId) ||
                                          selectedTraineeId,
                                        decreeReasonId:
                                          (dismissDecreeOther &&
                                            dismissDecreeOther.decreeReasonId) ||
                                          selectedDecreeReason,
                                        coursesId:
                                          (dismissDecreeOther &&
                                            dismissDecreeOther.coursesId) ||
                                          selectedCourseId,
                                        applyingDate:
                                          dismissDecreeOther?.applyingDate
                                            ? moment
                                                .utc(
                                                  dismissDecreeOther.applyingDate
                                                )
                                                .local()
                                                .format("YYYY-MM-DD")
                                            : "",
                                        startDate: dismissDecreeOther?.startDate
                                          ? moment
                                              .utc(dismissDecreeOther.startDate)
                                              .local()
                                              .format("YYYY-MM-DD")
                                          : "",
                                        endDate: dismissDecreeOther?.endDate
                                          ? moment
                                              .utc(dismissDecreeOther.endDate)
                                              .local()
                                              .format("YYYY-MM-DD")
                                          : "",
                                        note:
                                          (dismissDecreeOther &&
                                            dismissDecreeOther.note) ||
                                          "",
                                      }}
                                      validationSchema={Yup.object().shape({
                                        traineeId: Yup.string().required(
                                          "Please select a trainee"
                                        ),
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
                                        coursesId: Yup.string().required(
                                          "Please select or enter a course"
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
                                              <CardTitle id="course_header">
                                                {t("Decree")}
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
                                                <Card>
                                                  <CardBody>
                                                    <div className="bordered">
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
                                                                  "Start Date is required"
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
                                                            <Field
                                                              name="traineeId"
                                                              as="input"
                                                              id="trainee-Id"
                                                              type="text"
                                                              placeholder="Search..."
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
                                                            <Label for="decreeReasonId">
                                                              {this.props.t(
                                                                "Decree Reason"
                                                              )}
                                                            </Label>
                                                            <span className="text-danger">
                                                              *
                                                            </span>
                                                          </Col>
                                                          <Col className="col-8">
                                                            <Select
                                                              name="decreeReasonId"
                                                              key={`select_decreeReason`}
                                                              options={
                                                                decreeReasons
                                                              }
                                                              className={
                                                                "form-control" +
                                                                ((errors.decreeReasonId &&
                                                                  touched.decreeReasonId) ||
                                                                decreeReasonError
                                                                  ? " is-invalid"
                                                                  : "")
                                                              }
                                                              onChange={newValue => {
                                                                this.handleSelect(
                                                                  "decreeReasonId",
                                                                  newValue.value,
                                                                  values
                                                                );
                                                              }}
                                                              defaultValue={decreeReasons.find(
                                                                opt =>
                                                                  opt.value ===
                                                                  dismissDecreeOther?.decreeReasonId
                                                              )}
                                                            />
                                                            {decreeReasonError && (
                                                              <div className="invalid-feedback">
                                                                {this.props.t(
                                                                  "Decree Reason is required"
                                                                )}
                                                              </div>
                                                            )}
                                                          </Col>
                                                        </Row>
                                                      </div>
                                                      <div className="mb-3">
                                                        <Row>
                                                          <Col className="col-4">
                                                            <Label for="coursesId">
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
                                                              name="coursesId"
                                                              as="input"
                                                              id="courses-Id"
                                                              type="text"
                                                              placeholder="Search..."
                                                              className={
                                                                "form-control" +
                                                                ((errors.coursesId &&
                                                                  touched.coursesId) ||
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
                                                              list="coursesId"
                                                              autoComplete="off"
                                                            />
                                                            <datalist id="coursesId">
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
                                                    </div>
                                                  </CardBody>
                                                </Card>
                                                <Card>
                                                  <CardBody>
                                                    <div className="bordered">
                                                      <div className="mb-2">
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
                                                              name="applyingDate"
                                                              className={`form-control ${
                                                                applyingDateError
                                                                  ? "is-invalid"
                                                                  : ""
                                                              }`}
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
                                                      <div className="md-2">
                                                        <Row>
                                                          <Col className="col-4">
                                                            <Label for="note">
                                                              {this.props.t(
                                                                "Notes"
                                                              )}
                                                            </Label>
                                                          </Col>
                                                          <Col className="col-8">
                                                            <Field
                                                              type="textarea"
                                                              name="note"
                                                              as="textarea"
                                                              id="note"
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
                                                      this.handleSubmit(values);
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
                                  fullscreen
                                >
                                  <ModalHeader
                                    toggle={this.toggleEdit}
                                    tag="h4"
                                  >
                                    {!!isEdit
                                      ? t("Update Decree Details")
                                      : t("Add Decree")}
                                  </ModalHeader>
                                  <ModalBody>
                                    <Formik
                                      enableReinitialize={true}
                                      initialValues={{
                                        ...(isEdit &&
                                          dismissDecreeOther && {
                                            Id: dismissDecreeOther.Id,
                                          }),
                                        decreeCode:
                                          (dismissDecreeOther &&
                                            dismissDecreeOther.decreeCode) ||
                                          "",
                                        traineeId:
                                          (dismissDecreeOther &&
                                            dismissDecreeOther.traineeId) ||
                                          selectedTraineeId,
                                        decreeReasonId:
                                          (dismissDecreeOther &&
                                            dismissDecreeOther.decreeReasonId) ||
                                          selectedDecreeReason,
                                        coursesId:
                                          (dismissDecreeOther &&
                                            dismissDecreeOther.coursesId) ||
                                          selectedCourseId,
                                        applyingDate:
                                          dismissDecreeOther?.applyingDate
                                            ? moment
                                                .utc(
                                                  dismissDecreeOther.applyingDate
                                                )
                                                .local()
                                                .format("YYYY-MM-DD")
                                            : "",
                                        startDate: dismissDecreeOther?.startDate
                                          ? moment
                                              .utc(dismissDecreeOther.startDate)
                                              .local()
                                              .format("YYYY-MM-DD")
                                          : "",
                                        endDate: dismissDecreeOther?.endDate
                                          ? moment
                                              .utc(dismissDecreeOther.endDate)
                                              .local()
                                              .format("YYYY-MM-DD")
                                          : "",
                                        decreeNum:
                                          (dismissDecreeOther &&
                                            dismissDecreeOther.decreeNum) ||
                                          "",
                                        decreeDate:
                                          dismissDecreeOther?.decreeDate
                                            ? moment
                                                .utc(
                                                  dismissDecreeOther.decreeDate
                                                )
                                                .local()
                                                .format("YYYY-MM-DD")
                                            : "",
                                        note:
                                          (dismissDecreeOther &&
                                            dismissDecreeOther.note) ||
                                          "",
                                        //file: null,
                                        decreeStatusId:
                                          (dismissDecreeOther &&
                                            dismissDecreeOther.decreeStatusId) ||
                                          selectedDecreeStatus,
                                        turnReasonId:
                                          (dismissDecreeOther &&
                                            dismissDecreeOther.turnReason) ||
                                          selectedTurnReason,
                                        turnDate: dismissDecreeOther?.turnDate
                                          ? moment
                                              .utc(dismissDecreeOther.turnDate)
                                              .local()
                                              .format("YYYY-MM-DD")
                                          : "",
                                        turnNote:
                                          (dismissDecreeOther &&
                                            dismissDecreeOther.turnNote) ||
                                          "",
                                      }}
                                      validationSchema={Yup.object().shape({
                                        traineeId: Yup.string().required(
                                          "Please select a trainee"
                                        ),
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
                                        coursesId: Yup.string().required(
                                          "Please select or enter a course"
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
                                                <Row>
                                                  <Col lg="6">
                                                    <Card>
                                                      <CardBody>
                                                        <div className="bordered">
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col className="col-4">
                                                                <Label for="decreeCode">
                                                                  {this.props.t(
                                                                    "Decree Code"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Field
                                                                  type="text"
                                                                  name="decreeCode"
                                                                  id="decreeCode"
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
                                                                <Label for="traineeId">
                                                                  {this.props.t(
                                                                    "Trainee Name"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Field
                                                                  name="traineeId"
                                                                  as="input"
                                                                  id="trainee-Id"
                                                                  type="text"
                                                                  placeholder="Search..."
                                                                  className={
                                                                    "form-control"
                                                                  }
                                                                  value={
                                                                    traineesOpt.find(
                                                                      trainee =>
                                                                        trainee.key ===
                                                                        this
                                                                          .state
                                                                          .selectedTraineeId
                                                                    )?.value ||
                                                                    ""
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
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col className="col-4">
                                                                <Label for="startDate">
                                                                  {this.props.t(
                                                                    "Start Date"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Field
                                                                  name="startDate"
                                                                  className={`form-control`}
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
                                                                  name="endDate"
                                                                  className={`form-control`}
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
                                                                <Label for="coursesId">
                                                                  {this.props.t(
                                                                    "Courses"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Field
                                                                  name="coursesId"
                                                                  as="input"
                                                                  id="courses-Id"
                                                                  type="text"
                                                                  placeholder="Search..."
                                                                  className={
                                                                    "form-control"
                                                                  }
                                                                  value={
                                                                    coursesOffering.find(
                                                                      course =>
                                                                        course.key ===
                                                                        this
                                                                          .state
                                                                          .selectedCourseId
                                                                    )?.value ||
                                                                    ""
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
                                                                  list="coursesId"
                                                                  autoComplete="off"
                                                                />
                                                                <datalist id="coursesId">
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
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                        </div>
                                                      </CardBody>
                                                    </Card>
                                                  </Col>
                                                  <Col lg="6">
                                                    <Card>
                                                      <CardBody>
                                                        <div className="bordered">
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col className="col-4">
                                                                <Label for="decreeNum">
                                                                  {this.props.t(
                                                                    "Decree Num"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Field
                                                                  type="text"
                                                                  name="decreeNum"
                                                                  id="decreeNum"
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
                                                                <Label for="decreeDate">
                                                                  {this.props.t(
                                                                    "Decree Date"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Field
                                                                  name="decreeDate"
                                                                  className={`form-control`}
                                                                  type="date"
                                                                  value={
                                                                    values.decreeDate
                                                                      ? new Date(
                                                                          values.decreeDate
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
                                                                  id="decreeDate-date-input"
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                          <div
                                                            // className="upload-box1"
                                                            onClick={() =>
                                                              document
                                                                .getElementById(
                                                                  "fileInput"
                                                                )
                                                                .click()
                                                            }
                                                          >
                                                            <div className="upload-content text-center">
                                                              <div className="upload-icon-wrapper">
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
                                                              onChange={event => {
                                                                this.props.setFieldValue(
                                                                  "file",
                                                                  event
                                                                    .currentTarget
                                                                    .files[0]
                                                                );
                                                              }}
                                                            />
                                                          </div>
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col lg="4">
                                                                <Label
                                                                  for="decreeStatus-Id"
                                                                  className="form-label d-flex"
                                                                >
                                                                  {this.props.t(
                                                                    "Decree Status"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <div className="d-flex flex-wrap gap-3">
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
                                                                              selectedDecreeStatus ===
                                                                              status.Id
                                                                                ? "active"
                                                                                : ""
                                                                            }`}
                                                                            name="decreeStatusId"
                                                                            id={`btnradio${index}`}
                                                                            autoComplete="off"
                                                                            defaultChecked={
                                                                              selectedDecreeStatus ===
                                                                              status.Id
                                                                                ? "active"
                                                                                : ""
                                                                            }
                                                                            onChange={() => {
                                                                              setFieldValue(
                                                                                "decreeStatusId",
                                                                                status.Id
                                                                              );

                                                                              this.setState(
                                                                                {
                                                                                  selectedDecreeStatus:
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
                                                          </div>
                                                        </div>
                                                      </CardBody>
                                                    </Card>
                                                  </Col>
                                                </Row>
                                                <Row>
                                                  <Col lg="6">
                                                    <Card>
                                                      <CardBody>
                                                        <div className="bordered">
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col className="col-4">
                                                                <Label for="decreeReasonId">
                                                                  {this.props.t(
                                                                    "Decree Reason"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Select
                                                                  name="decreeReasonId"
                                                                  key={`select_decreeReason`}
                                                                  options={
                                                                    decreeReasons
                                                                  }
                                                                  className={
                                                                    "form-control"
                                                                  }
                                                                  onChange={newValue => {
                                                                    this.handleSelect(
                                                                      "decreeReasonId",
                                                                      newValue.value,
                                                                      values
                                                                    );
                                                                  }}
                                                                  defaultValue={decreeReasons.find(
                                                                    opt =>
                                                                      opt.value ===
                                                                      dismissDecreeOther?.decreeReasonId
                                                                  )}
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                          <div className="mb-2">
                                                            <Row>
                                                              <Col className="col-4">
                                                                <Label for="applyingDate">
                                                                  {this.props.t(
                                                                    "Applying Date"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Field
                                                                  name="applyingDate"
                                                                  className={`form-control `}
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
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                          <div className="mb-2">
                                                            <Row>
                                                              <Col className="col-4">
                                                                <Label for="note">
                                                                  {this.props.t(
                                                                    "Notes"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Field
                                                                  type="textarea"
                                                                  name="note"
                                                                  as="textarea"
                                                                  id="note"
                                                                  className={
                                                                    "form-control"
                                                                  }
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                          <div className="mb-2">
                                                            <Row>
                                                              <Col className="col-4">
                                                                <Label for="userName-Id">
                                                                  {this.props.t(
                                                                    "User Name"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Field
                                                                  name="userNameId"
                                                                  as="input"
                                                                  id="userName-Id"
                                                                  type="text"
                                                                  placeholder="Search..."
                                                                  className={
                                                                    "form-control"
                                                                  }
                                                                  value={
                                                                    employeesNames.find(
                                                                      empl =>
                                                                        empl.key ===
                                                                        this
                                                                          .state
                                                                          .selectedUserNameId
                                                                    )?.value ||
                                                                    ""
                                                                  }
                                                                  onChange={e => {
                                                                    const newValue =
                                                                      e.target
                                                                        .value;

                                                                    const selectedUserName =
                                                                      employeesNames.find(
                                                                        empl =>
                                                                          empl.value ===
                                                                          newValue
                                                                      );

                                                                    if (
                                                                      selectedUserName
                                                                    ) {
                                                                      this.setState(
                                                                        {
                                                                          selectedUserNameId:
                                                                            selectedUserName.key,
                                                                          userName:
                                                                            selectedUserName.value,
                                                                        }
                                                                      );
                                                                    } else {
                                                                      this.setState(
                                                                        {
                                                                          selectedUserNameId:
                                                                            null,
                                                                          userName:
                                                                            newValue,
                                                                        }
                                                                      );
                                                                    }
                                                                  }}
                                                                  list="userNames"
                                                                  autoComplete="off"
                                                                />

                                                                <datalist id="userNames">
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
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                        </div>
                                                      </CardBody>
                                                    </Card>
                                                  </Col>
                                                  <Col lg="6">
                                                    <Card>
                                                      <CardBody>
                                                        <div className="bordered">
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col className="col-4">
                                                                <Label for="turnReasonId">
                                                                  {this.props.t(
                                                                    "Turn Reason"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Select
                                                                  name="turnReasonId"
                                                                  key={`select_turnReason`}
                                                                  options={
                                                                    turnReasons
                                                                  }
                                                                  className={
                                                                    "form-control"
                                                                  }
                                                                  onChange={newValue => {
                                                                    this.handleSelect(
                                                                      "turnReasonId",
                                                                      newValue.value,
                                                                      values
                                                                    );
                                                                  }}
                                                                  defaultValue={turnReasons.find(
                                                                    opt =>
                                                                      opt.value ===
                                                                      dismissDecreeOther?.turnReasonId
                                                                  )}
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                          <div className="mb-2">
                                                            <Row>
                                                              <Col className="col-4">
                                                                <Label for="turnDate">
                                                                  {this.props.t(
                                                                    "Turn Date"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Field
                                                                  name="turnDate"
                                                                  className={`form-control `}
                                                                  type="date"
                                                                  value={
                                                                    values.turnDate
                                                                      ? new Date(
                                                                          values.turnDate
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
                                                                  id="turnDate-date-input"
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                          <div className="mb-2">
                                                            <Row>
                                                              <Col className="col-4">
                                                                <Label for="turnNote">
                                                                  {this.props.t(
                                                                    "Notes"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Field
                                                                  type="textarea"
                                                                  name="turnNote"
                                                                  as="textarea"
                                                                  id="turnNote"
                                                                  className={
                                                                    "form-control"
                                                                  }
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                          <div className="mb-2">
                                                            <Row>
                                                              <Col className="col-4">
                                                                <Label for="turnUserName-Id">
                                                                  {this.props.t(
                                                                    "User Name"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Field
                                                                  name="turnUserNameId"
                                                                  as="input"
                                                                  id="turnUserName-Id"
                                                                  type="text"
                                                                  placeholder="Search..."
                                                                  className={
                                                                    "form-control"
                                                                  }
                                                                  value={
                                                                    employeesNames.find(
                                                                      empl =>
                                                                        empl.key ===
                                                                        this
                                                                          .state
                                                                          .selectedTurnUserNameId
                                                                    )?.value ||
                                                                    ""
                                                                  }
                                                                  onChange={e => {
                                                                    const newValue =
                                                                      e.target
                                                                        .value;

                                                                    const selectedTurnUserName =
                                                                      employeesNames.find(
                                                                        empl =>
                                                                          empl.value ===
                                                                          newValue
                                                                      );

                                                                    if (
                                                                      selectedTurnUserName
                                                                    ) {
                                                                      this.setState(
                                                                        {
                                                                          selectedTurnUserNameId:
                                                                            selectedTurnUserName.key,
                                                                          turnUserName:
                                                                            selectedTurnUserName.value,
                                                                        }
                                                                      );
                                                                    } else {
                                                                      this.setState(
                                                                        {
                                                                          selectedTurnUserNameId:
                                                                            null,
                                                                          turnUserName:
                                                                            newValue,
                                                                        }
                                                                      );
                                                                    }
                                                                  }}
                                                                  list="turnUserNames"
                                                                  autoComplete="off"
                                                                />

                                                                <datalist id="turnUserNames">
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
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                        </div>
                                                      </CardBody>
                                                    </Card>
                                                  </Col>
                                                </Row>
                                              </CardBody>
                                            </Card>
                                            <Row>
                                              <Col>
                                                <div className="text-center">
                                                  <Link
                                                    to="#"
                                                    className="btn btn-primary me-2"
                                                    onClick={() => {
                                                      this.handleSubmit(values);
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
  classScheduling,
  dismissDecreesOther,
  absenceWarnings,
  trainees,
  years,
  menu_items,
  decisions,
  employees,
}) => ({
  dismissDecreesOther: dismissDecreesOther.dismissDecreesOther,
  coursesOffering: classScheduling.coursesOffering,
  deleted: dismissDecreesOther.deleted,
  decreeReasons: absenceWarnings.decreeReasons,
  turnReasons: absenceWarnings.turnReasons,
  years: years.years,
  employeesNames: employees.employeesNames,
  traineesOpt: trainees.traineesOpt,
  decisionStatus: decisions.decisionStatus,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetDismissDecreesOther: () => dispatch(getDismissDecreesOther()),
  onAddNewDismissDecreeOther: dismissDecreeOther =>
    dispatch(addNewDismissDecreeOther(dismissDecreeOther)),
  onUpdateDismissDecreeOther: dismissDecreeOther =>
    dispatch(updateDismissDecreeOther(dismissDecreeOther)),
  onDeleteCDismissDecreeOther: dismissDecreeOther =>
    dispatch(deleteDismissDecreeOther(dismissDecreeOther)),
  onGetDismissDecreeOtherDeletedValue: () =>
    dispatch(getDismissDecreeOtherDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(DismissDecreesOtherList));
