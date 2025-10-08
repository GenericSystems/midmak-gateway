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
  getAbsenceWarnings,
  addNewAbsenceWarning,
  updateAbsenceWarning,
  deleteAbsenceWarning,
  getAbsenceWarningDeletedValue,
} from "store/Rules-and-Regulations/Absence-warnings/actions";
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
import absenceWarnings from "store/Rules-and-Regulations/Absence-warnings/reducer";
import decisions from "pages/HR/decisions/decisions";

class AbsenceWarningsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      absenceWarnings: [],
      absenceWarning: "",
      deleteModal: false,
      selectedRowId: null,
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
      duplicateError: null,
      deleteModal: false,
      duplicateError: null,
      selectedRowId: null,
      modal: false,
      isEdit: false,
      isAdd: false,
      selectedDecisionReason: null,
      decisionReasonName: "",
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
      decisionReasonError: false,
      values: "",
    };
    this.state = {};
  }

  componentDidMount() {
    const {
      absenceWarnings,
      decisionReasons,
      years,
      onGetAbsenceWarnings,
      user_menu,
      deleted,
      coursesOffering,
    } = this.props;

    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);

    onGetAbsenceWarnings();
    this.setState({
      absenceWarnings,
      coursesOffering,
      decisionReasons,
      years,
      deleted,
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

  toggle2 = () => {
    this.setState(prevState => ({
      modal2: !prevState.modal2,
    }));
  };

  handleAddRow = () => {
    const { onAddNewAbsenceWarning, absenceWarnings } = this.props;

    const newRow = {
      TraineeNum: "-----",
    };

    // Check if the same value already exists in the table
    const emptyRowsExist = absenceWarnings.some(
      absenceWarnings => absenceWarnings.TraineeNum.trim() === "-----"
      // ||
      // absenceWarning.enTitle.trim() === ""
    );

    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewAbsenceWarning(newRow);
    }
  };

  handleDeleteRow = () => {
    const { onDeleteAbsenceWarning } = this.props;
    const { selectedRowId } = this.state;
    if (selectedRowId !== null) {
      onDeleteAbsenceWarning(selectedRowId);
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

  handleAbsenceWarningDataChange = (rowId, fieldName, fieldValue) => {
    const { absenceWarnings, onUpdateAbsenceWarning } = this.props;
    const isDuplicate = absenceWarnings.some(absenceWarning => {
      return (
        absenceWarning.Id !== rowId &&
        absenceWarning.arTitle.trim() === fieldValue.trim()
      );
    });
    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateAbsenceWarning(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateAbsenceWarning(onUpdate);
    }
  };
  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleSuccessClose = () => {
    this.setState({ showAlert: null });
    this.props.onGetAbsenceWarningDeletedValue();
  };

  handleErrorClose = () => {
    this.setState({ showAlert: null });
    this.props.onGetAbsenceWarningDeletedValue();
  };

  handleAddRow = () => {
    this.setState({
      absenceWarning: "",
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
      selectedDecisionReason,
      isEdit,
    } = this.state;
    const { onAddNewAbsenceWarning, onUpdateAbsenceWarning } = this.props;

    values["traineeId"] = selectedTraineeId;
    values["coursesId"] = selectedCourseId;
    values["decisionReasonId"] = selectedDecisionReason;

    console.log("valuesssssssssssssssssssss", values);

    let warningInfo = {};
    if (
      values.startDate &&
      values.endDate &&
      values.applyingDate &&
      selectedTraineeId !== null &&
      selectedCourseId !== null &&
      selectedDecisionReason !== null
    ) {
      Object.keys(values).forEach(function (key) {
        if (
          values[key] != undefined &&
          (values[key].length > 0 || values[key] != "")
        )
          warningInfo[key] = values[key];
      });
      console.log("absenceWarningInfoabsenceWarningInfo", warningInfo);
      if (isEdit) {
        console.log("9999999", warningInfo);
        // onUpdateContract(warningInfo);
      } else {
        // onAddNewContract(warningInfo);
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
      )(values.decisionReasonId === "" && selectedDecisionReason === "")
    ) {
      this.setState({ applyingDateError: true, saveError: true });
      this.setState({ startDateError: true, saveError: true });
      this.setState({ endDateError: true, saveError: true });
      this.setState({ traineeError: true, saveError: true });
      this.setState({ courseError: true, saveError: true });
      this.setState({ decisionReasonError: true, saveError: true });

      const emptyError = this.props.t("Fill the Required Fields to Save");

      this.setState({ emptyError: emptyError });
    }
  };

  handleAbsenceWarningEdit = arg => {
    console.log("arg", arg);

    this.setState({
      absenceWarning: arg,
      // selectedJobRank: arg.jobRankId,
      // selectedJobTitle: arg.jobTitleId,
      // jobTitleName: arg.jobTitle,
      // selectedCorporateNode: arg.corporateNodeId,
      // selectedContractType: arg.absenceWarningTypeId,
      // selectedEmploymentCase: arg.employmentCaseId,
      // selectedHasMinistryApprove: arg.hasMinistryApprove,
      // selectedGovernmentWorker: arg.governmentWorker,
      // selectedWorkClassification: arg.workClassificationId,
      // selectedAcademicYearId: arg.academicYearId,
      // academicYear: arg.academicYear,
      isEdit: true,
    });
    this.toggle();
  };

  handleSelect = (fieldName, selectedValue, values) => {
    if (fieldName == "decisionReasonId") {
      this.setState({
        selectedDecisionReason: selectedValue,
        absenceWarning: values,
      });
    }
  };

  render() {
    const {
      absenceWarnings,
      years,
      coursesOffering,
      decisionReasons,
      t,
      traineesOpt,
      deleted,
    } = this.props;
    const {
      modal,
      deleteModal,
      duplicateError,
      showAlert,
      showAddButton,
      showSearchButton,
      isEdit,
      absenceWarning,
      selectedTraineeId,
      selectedDecisionReason,
      selectedCourseId,
      applyingDateError,
      startDateError,
      endDateError,
      traineeError,
      courseError,
      decisionReasonError,
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
        formatter: (cellContent, absenceWarning) => (
          <Tooltip title={this.props.t("Edit")} placement="top">
            <IconButton
              className="text-sm-end"
              onClick={() => this.handleAbsenceWarningEdit(absenceWarning)}
            >
              <i className="mdi mdi-pencil font-size-18" id="edittooltip"></i>
            </IconButton>
          </Tooltip>
        ),
      },
    ];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: absenceWarnings.length,
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
            <Breadcrumbs breadcrumbItem={this.props.t("AbsenceWarning")} />
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
                        data={absenceWarnings}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={absenceWarnings}
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
                                  data={absenceWarnings}
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
                                      this.handleAbsenceWarningDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    },
                                  })}
                                  defaultSorted={defaultSorting}
                                  noDataIndication={t(
                                    "No Absence Warnings found"
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
                                      ? t("Edit Absence Warning")
                                      : t("Add Absence Warning")}
                                  </ModalHeader>
                                  <ModalBody>
                                    <Formik
                                      enableReinitialize={true}
                                      initialValues={{
                                        ...(isEdit &&
                                          absenceWarning && {
                                            Id: absenceWarning.Id,
                                          }),
                                        traineeId:
                                          (absenceWarning &&
                                            absenceWarning.traineeId) ||
                                          selectedTraineeId,
                                        decisionReasonId:
                                          (absenceWarning &&
                                            absenceWarning.decisionReasonId) ||
                                          selectedDecisionReason,
                                        coursesId:
                                          (absenceWarning &&
                                            absenceWarning.coursesId) ||
                                          selectedCourseId,
                                        applyingDate:
                                          absenceWarning?.applyingDate
                                            ? moment
                                                .utc(
                                                  absenceWarning.applyingDate
                                                )
                                                .local()
                                                .format("YYYY-MM-DD")
                                            : "",
                                        startDate: absenceWarning?.startDate
                                          ? moment
                                              .utc(absenceWarning.startDate)
                                              .local()
                                              .format("YYYY-MM-DD")
                                          : "",
                                        endDate: absenceWarning?.endDate
                                          ? moment
                                              .utc(absenceWarning.endDate)
                                              .local()
                                              .format("YYYY-MM-DD")
                                          : "",
                                        note:
                                          (absenceWarning &&
                                            absenceWarning.note) ||
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
                                                {t("Absence Warning")}
                                              </CardTitle>
                                              <CardBody className="cardBody">
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
                                                            <Label for="decisionReasonId">
                                                              {this.props.t(
                                                                "Decision Reason"
                                                              )}
                                                            </Label>
                                                            <span className="text-danger">
                                                              *
                                                            </span>
                                                          </Col>
                                                          <Col className="col-8">
                                                            <Select
                                                              name="decisionReasonId"
                                                              key={`select_decisionReason`}
                                                              options={
                                                                decisionReasons
                                                              }
                                                              className={
                                                                "form-control" +
                                                                ((errors.decisionReasonId &&
                                                                  touched.decisionReasonId) ||
                                                                decisionReasonError
                                                                  ? " is-invalid"
                                                                  : "")
                                                              }
                                                              onChange={newValue => {
                                                                this.handleSelect(
                                                                  "decisionReasonId",
                                                                  newValue.value,
                                                                  values
                                                                );
                                                              }}
                                                              defaultValue={decisionReasons.find(
                                                                opt =>
                                                                  opt.value ===
                                                                  absenceWarning?.decisionReasonId
                                                              )}
                                                            />
                                                            {decisionReasonError && (
                                                              <div className="invalid-feedback">
                                                                {this.props.t(
                                                                  "Decision Reason is required"
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
                                                      <div className="md-3">
                                                        <Row>
                                                          <Col className="col-4 text-center">
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
  absenceWarnings,
  trainees,
  years,
  menu_items,
}) => ({
  absenceWarnings: absenceWarnings.absenceWarnings,
  coursesOffering: classScheduling.coursesOffering,
  deleted: absenceWarnings.deleted,
  decisionReasons: absenceWarnings.decisionReasons,
  years: years.years,
  traineesOpt: trainees.traineesOpt,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetAbsenceWarnings: () => dispatch(getAbsenceWarnings()),
  onAddNewAbsenceWarning: absenceWarning =>
    dispatch(addNewAbsenceWarning(absenceWarning)),
  onUpdateAbsenceWarning: absenceWarning =>
    dispatch(updateAbsenceWarning(absenceWarning)),
  onDeleteCAbsenceWarning: absenceWarning =>
    dispatch(deleteAbsenceWarning(absenceWarning)),
  onGetAbsenceWarningDeletedValue: () =>
    dispatch(getAbsenceWarningDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(AbsenceWarningsList));
