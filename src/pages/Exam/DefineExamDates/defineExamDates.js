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
  Table,
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
  getDefineExamDates,
  addNewDefineExamDate,
  updateDefineExamDate,
  deleteDefineExamDate,
  getDefineExamDateDeletedValue,
  getStudentsOrder,
} from "store/Exam/DefineExamDates/actions";
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
class DefineExamDatesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      defineExamDates: [],
      gradeTypes: [],
      defineExamDate: "",
      employee: "",
      selectConId: null,
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
      newStartTime: "",
      newEndTime: "",
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
      selectedExamType: "",
      selectedDefinPeriod: "",
      selectedStudentsOrder: "",
      startDateError: false,
      endDateError: false,
      examArError: false,
      examEnError: false,
      examTypeError: false,
      errorMessage: null,
      successMessage: null,
      values: "",
      isShowPreReq: false,
      examTypesOpt: [],
    };
    this.toggle = this.toggle.bind(this);
    this.toggle2 = this.toggle2.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    const {
      defineExamDates,
      onGetDefineExamDates,
      onGetStudentsOrder,
      gradeTypes,
      deleted,
      studentsOrder,
      user_menu,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    onGetDefineExamDates();
    onGetStudentsOrder();

    this.setState({
      defineExamDates,
      deleted,
      gradeTypes,
      studentsOrder,
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

  toggle2 = () => {
    this.setState(prevState => ({
      modal2: !prevState.modal2,
    }));
  };

  onClickDelete = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };

  handleAddRow = () => {
    this.setState({
      defineExamDate: "",
      isEdit: false,
      isOpen: false,
      isAdd: true,
    });
    this.toggle();
  };

  // handleAddDefinePeriod = () => {
  //   const { onAddNewContractType, contractsTypes } = this.props;

  //   const newRow = {
  //     arTitle: "-----",
  //   };

  //   // Check if the same value already exists in the table
  //   const emptyRowsExist = contractsTypes.some(
  //     contractsTypes => contractsTypes.arTitle.trim() === "-----"
  //     // ||
  //     // contractType.enTitle.trim() === ""
  //   );

  //   if (emptyRowsExist) {
  //     const errorMessage = this.props.t("Fill in the empty row");
  //     this.setState({ duplicateError: errorMessage });
  //   } else {
  //     this.setState({ duplicateError: null });
  //     onAddNewContractType(newRow);
  //   }
  // };

  handleDeleteRow = () => {
    const { onDeleteDefineExamDate } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteDefineExamDate(selectedRowId);

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  handleSubmit = values => {
    const { selectedExamType, selectedStudentsOrder, isEdit } = this.state;
    const { onAddNewDefineExamDate, onUpdateDefineExamDate } = this.props;
    values["arTitle"] = values["arTitle"] || "";
    values["enTitle"] = values["enTitle"] || "";
    values["examTypeId"] = selectedExamType;
    values["studentOrderId"] = selectedStudentsOrder;
    // values["definPeriodId"] = selectedDefinPeriod;
    console.log("valuesssssssssssssssssssss", values);

    let defineExamDateInfo = {};
    if (
      values.arTitle &&
      values.enTitle &&
      values.startDate &&
      values.endDate &&
      selectedExamType !== null &&
      selectedStudentsOrder !== null
    ) {
      Object.keys(values).forEach(function (key) {
        if (
          values[key] != undefined &&
          (values[key].length > 0 || values[key] != "")
        )
          console.log("9999999", defineExamDateInfo);
        defineExamDateInfo[key] = values[key];
      });
      if (isEdit) {
        console.log("9999999", defineExamDateInfo);
        onUpdateDefineExamDate(defineExamDateInfo);
        this.toggle();
      } else {
        onAddNewDefineExamDate(defineExamDateInfo);
        this.setState({ isShowPreReq: true });
      }
      this.setState({
        errorMessages: {},
      });
    } else {
      let emptyError = "";
      if (selectedExamType === undefined) {
        emptyError = "Fill the empty select";
      }

      this.setState({ emptyError: emptyError });
    }
  };

  handleSelect = (fieldName, selectedValue) => {
    if (fieldName == "examTypeId") {
      this.setState({
        selectedExamType: selectedValue,
      });
    }
  };

  handleAlertClose = alertName => {
    this.setState({ [alertName]: null });
  };

  handleSuccessClose = () => {
    const { onGetDefineExamDateDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetDefineExamDateDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetDefineExamDateDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetDefineExamDateDeletedValue();
  };

  handleDefineExamDateClick = arg => {
    console.log("arg", arg);

    this.setState({
      defineExamDate: arg,
      selectedExamType: arg.examTypeId,
      selectedStudentsOrder: arg.studentOrderId,
      // selectedDefinPeriod: arg.definPeriodId,
      isEdit: true,
    });
    this.toggle();
  };

  // handleEmployeeDataClick = defineExamDate => {
  //   console.log("arg", defineExamDate);

  //   this.setState({
  //     isOpen: true,
  //     selectConId: defineExamDate.Id,
  //     modalContractValue: defineExamDate,
  //   });
  //   this.toggle2();
  // };
  // testselected = val => {
  //   console.log(val, "vvvvvvvvvvvvvvvvvv");
  // };
  handleValidDate = date => {
    const date1 = moment(new Date(date)).format("DD /MM/ Y");
    return date1;
  };

  handleDefinePeriodDataChange = (rowId, fieldName, fieldValue) => {
    const { contractsTypes, onUpdateContractType } = this.props;

    const isDuplicate = contractsTypes.some(contractType => {
      return (
        contractType.Id !== rowId &&
        contractType.arTitle.trim() === fieldValue.trim()
      );
    });

    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateContractType(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateContractType(onUpdate);
    }
  };

  render() {
    const defineExamDate = this.state.defineExamDate;
    const { defineExamDates, studentsOrder, gradeTypes, t, deleted } =
      this.props;
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
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
      selectedDefinPeriod,
      selectedExamType,
      selectedStudentsOrder,
      isShowPreReq,
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
    const examTypesOpt = gradeTypes;
    const columns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
      {
        dataField: "arTitle,",
        text: this.props.t("Exam"),
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
        dataField: "position",
        text: this.props.t("Days Count"),
        sort: true,
        editable: false,
      },
      {
        dataField: "examTypeId",
        text: this.props.t("Exam Type"),
        sort: true,
        editable: false,
      },
      {
        dataField: "menu",
        text: "",
        isDummyField: true,
        editable: false,
        //  hidden: !showDeleteButton,
        formatter: (cellContent, defineExamDate) => (
          <div className="d-flex gap-3">
            {/* <Tooltip
              title={this.props.t("View Employee Information")}
              placement="top"
            >
              <Link className="text-sm-end" to="#">
                <i
                  className="fas fa-male font-size-18"
                  id="viewtooltip"
                  onClick={() => this.handleEmployeeDataClick(defineExamDate)}
                ></i>
              </Link>
            </Tooltip> */}
            <Tooltip title={this.props.t("Edit")} placement="top">
              <Link className="text-sm-end" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={() => this.handleDefineExamDateClick(defineExamDate)}
                ></i>
              </Link>
            </Tooltip>
            <Tooltip title={this.props.t("Delete")} placement="top">
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(defineExamDate)}
                ></i>
              </Link>
            </Tooltip>
          </div>
        ),
      },
    ];
    const columns2 = [
      { dataField: "Id", text: t("ID"), hidden: true },
      {
        dataField: "startTime",
        text: t("Start Time"),
        sort: true,
        editable: true,
      },
      {
        dataField: "endTime",
        text: t("End Time"),
        sort: true,
        editable: true,
      },
      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        // hidden: !showDeleteButton,
        formatter: (cellContent, lecturePeriod) => (
          <Link className="text-danger" to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => this.onClickDelete(lecturePeriod)}
            ></i>
          </Link>
        ),
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: defineExamDates.length,
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
            <Breadcrumbs breadcrumbItem={this.props.t("Define Exam Dates")} />
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
                            onClick={this.handleAlertClose("duplicateError")}
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
                        data={defineExamDates}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={defineExamDates}
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
                                  data={defineExamDates}
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
                                    "No Exam Dates found"
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
                                  // className={"modal-fullscreen"}
                                  size="lg"
                                >
                                  <ModalHeader toggle={this.toggle} tag="h4">
                                    {!!isEdit
                                      ? t("Edit Exam Date")
                                      : t("Add Exam Date")}
                                  </ModalHeader>
                                  <ModalBody>
                                    <Formik
                                      enableReinitialize={true}
                                      initialValues={{
                                        ...(isEdit &&
                                          defineExamDate && {
                                            Id: defineExamDate.Id,
                                          }),
                                        arTitle:
                                          (defineExamDate &&
                                            defineExamDate.arTitle) ||
                                          "",
                                        enTitle:
                                          (defineExamDate &&
                                            defineExamDate.enTitle) ||
                                          "",
                                        examTypeId:
                                          (defineExamDate &&
                                            defineExamDate.jobTitleId) ||
                                          selectedExamType,
                                        // definPeriodId:
                                        //   (defineExamDate &&
                                        //     defineExamDate.definPeriodId) ||
                                        //   selectedDefinPeriod,
                                        startDate:
                                          (defineExamDate &&
                                            defineExamDate.startDate) ||
                                          "",
                                        endDate:
                                          (defineExamDate &&
                                            defineExamDate.endDate) ||
                                          "",
                                        studentOrderId:
                                          (defineExamDate &&
                                            defineExamDate.studentOrderId) ||
                                          "",
                                        // startTime:
                                        //   (defineExamDate &&
                                        //     defineExamDate.startTime) ||
                                        //   "",
                                        // endTime:
                                        //   (defineExamDate &&
                                        //     defineExamDate.endTime) ||
                                        //   "",
                                      }}
                                      validationSchema={Yup.object().shape({
                                        arTitle: Yup.string()
                                          .matches(
                                            /^[أ-ي]+$/,
                                            "Only Arabic letters are allowed"
                                          )
                                          .required(
                                            "Please Enter Your Exam Name In Arabic"
                                          ),
                                        enTitle: Yup.string()
                                          .matches(
                                            /^[A-Za-z]+$/,
                                            "Only English letters are allowed"
                                          )
                                          .required(
                                            "Please Enter Exam Name In English"
                                          ),
                                        startDate: Yup.date().required(
                                          "Please Enter Your Start Date"
                                        ),
                                        endDate: Yup.date()
                                          .required(
                                            "Please Enter Your End Date"
                                          )
                                          .min(
                                            Yup.ref("startDate"),
                                            "End date must be after start date"
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
                                              {t("Add Exam Name")}
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
                                                    onClick={this.handleAlertClose(
                                                      "emptyError"
                                                    )}
                                                  ></button>
                                                </Alert>
                                              )}
                                              <Row>
                                                <Col lg="12">
                                                  <div className="bordered">
                                                    <Col lg="12">
                                                      <Row>
                                                        <Col lg="12">
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col className="col-4">
                                                                <Label for="arTitle">
                                                                  {this.props.t(
                                                                    "Exam (ar)"
                                                                  )}
                                                                </Label>
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Field
                                                                  name="arTitle"
                                                                  type="text"
                                                                  id="arTitle"
                                                                  className={`form-control ${
                                                                    errors.arTitle &&
                                                                    touched.arTitle
                                                                      ? "is-invalid"
                                                                      : ""
                                                                  }`}
                                                                />
                                                                <ErrorMessage
                                                                  name="arTitle"
                                                                  component="div"
                                                                  className="invalid-feedback"
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col className="col-4">
                                                                <Label for="enTitle">
                                                                  {this.props.t(
                                                                    "Exam (en)"
                                                                  )}
                                                                </Label>
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Field
                                                                  name="enTitle"
                                                                  type="text"
                                                                  id="enTitle"
                                                                  className={`form-control ${
                                                                    errors.enTitle &&
                                                                    touched.enTitle
                                                                      ? "is-invalid"
                                                                      : ""
                                                                  }`}
                                                                />
                                                                <ErrorMessage
                                                                  name="enTitle"
                                                                  component="div"
                                                                  className="invalid-feedback"
                                                                />
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
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Field
                                                                  name="startDate"
                                                                  className={`form-control ${
                                                                    errors.startDate &&
                                                                    touched.startDate
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
                                                                <ErrorMessage
                                                                  name="startDate"
                                                                  component="div"
                                                                  className="invalid-feedback"
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
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Field
                                                                  className={`form-control ${
                                                                    errors.endDate &&
                                                                    touched.endDate
                                                                      ? "is-invalid"
                                                                      : ""
                                                                  }`}
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
                                                                <ErrorMessage
                                                                  name="endDate"
                                                                  component="div"
                                                                  className="invalid-feedback"
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                          <div className="mb-3">
                                                            <Row>
                                                              <Col className="col-4">
                                                                <Label for="examTypeId">
                                                                  {this.props.t(
                                                                    "Exam Type"
                                                                  )}
                                                                </Label>
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
                                                              </Col>
                                                              <Col className="col-8">
                                                                <Select
                                                                  name="examTypeId"
                                                                  options={
                                                                    examTypesOpt
                                                                  }
                                                                  className={`form-control`}
                                                                  onChange={newValue => {
                                                                    this.handleSelect(
                                                                      "examTypeId",
                                                                      newValue.value
                                                                    );
                                                                  }}
                                                                  defaultValue={examTypesOpt.find(
                                                                    opt =>
                                                                      opt.value ===
                                                                      defineExamDate?.examTypeId
                                                                  )}
                                                                />
                                                              </Col>
                                                            </Row>
                                                          </div>
                                                          <Row>
                                                            <Col lg="4">
                                                              <Label
                                                                for="studentOrder-Id"
                                                                className="form-label d-flex"
                                                              >
                                                                {this.props.t(
                                                                  "Students Order"
                                                                )}
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
                                                              </Label>
                                                            </Col>
                                                            <Col lg="8">
                                                              <div className="d-flex flex-wrap gap-3">
                                                                <div
                                                                  className="btn-group button-or"
                                                                  role="group"
                                                                >
                                                                  {studentsOrder.map(
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
                                                                            selectedStudentsOrder ===
                                                                            status.value
                                                                              ? "active"
                                                                              : ""
                                                                          }`}
                                                                          name="studentOrderId"
                                                                          id={`btnradio${index}`}
                                                                          autoComplete="off"
                                                                          checked={
                                                                            selectedStudentsOrder ===
                                                                            status.value
                                                                          }
                                                                          onChange={() => {
                                                                            setFieldValue(
                                                                              "studentOrderId",
                                                                              status.value
                                                                            );

                                                                            this.setState(
                                                                              {
                                                                                selectedStudentsOrder:
                                                                                  status.value,
                                                                              }
                                                                            );
                                                                          }}
                                                                        />
                                                                        <Label
                                                                          className="btn btn-outline-primary smallButton w-sm"
                                                                          for={`btnradio${index}`}
                                                                        >
                                                                          {
                                                                            status.label
                                                                          }
                                                                        </Label>
                                                                      </React.Fragment>
                                                                    )
                                                                  )}
                                                                </div>
                                                              </div>
                                                            </Col>
                                                          </Row>
                                                        </Col>
                                                      </Row>
                                                    </Col>
                                                  </div>
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
                                                          {t("Save")}
                                                        </Link>
                                                      </div>
                                                    </Col>
                                                  </Row>
                                                </Col>
                                              </Row>
                                            </CardBody>
                                          </Card>
                                          {(isEdit || isShowPreReq) && (
                                            <Card id="employee-card">
                                              <CardTitle id="course_header">
                                                {t("Define Period")}
                                              </CardTitle>
                                              <CardBody className="cardBody">
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
                                                        onClick={this.handleAlertClose(
                                                          "duplicateError"
                                                        )}
                                                      ></button>
                                                    </Alert>
                                                  )}
                                                </div>
                                                <Row>
                                                  <Col className="col-3">
                                                    <Label for="definePeriodId">
                                                      {this.props.t(
                                                        "Define Period"
                                                      )}
                                                    </Label>
                                                  </Col>
                                                  <Col className="col-5">
                                                    <Select
                                                      name="definePeriodId"
                                                      key={`select_definePeriodId`}
                                                      // options={
                                                      //   definePeriodOptions
                                                      // }
                                                      // className={`form-control`}
                                                      // onChange={newValue =>
                                                      //   setFieldValue(
                                                      //     "definePeriodId",
                                                      //     newValue.value
                                                      //   )
                                                      // }
                                                      //   value={definePeriodOptions.find(
                                                      //     opt =>
                                                      //       opt.value ===
                                                      //       values.definePeriodId
                                                      //   )}
                                                    />
                                                  </Col>
                                                  <Col className="col-4">
                                                    <div className="text-sm-end">
                                                      <Tooltip
                                                        title={this.props.t(
                                                          "Add"
                                                        )}
                                                        placement="top"
                                                      >
                                                        <IconButton
                                                          color="primary"
                                                          onClick={
                                                            this
                                                              .handleAddDefinePeriod
                                                          }
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
                                                  data={defineExamDates}
                                                  columns={columns2}
                                                  cellEdit={cellEditFactory({
                                                    mode: "dbclick",
                                                    blurToSave: true,
                                                    afterSaveCell: (
                                                      oldValue,
                                                      newValue,
                                                      row,
                                                      column
                                                    ) => {
                                                      this.handleDefinePeriodDataChange(
                                                        row.Id,
                                                        column.dataField,
                                                        newValue
                                                      );
                                                    },
                                                  })}
                                                  defaultSorted={defaultSorting}
                                                />
                                                {/* <div className="table-responsive">
                                                <PaginationProvider
                                                  pagination={paginationFactory(
                                                    pageOptions
                                                  )}
                                                  keyField="Id"
                                                  columns={columns2}
                                                  data={defineExamDates}
                                                >
                                                  {({
                                                    paginationProps,
                                                    paginationTableProps,
                                                  }) => (
                                                    <ToolkitProvider
                                                      keyField="Id"
                                                      data={defineExamDates}
                                                      columns={columns2}
                                                      search
                                                    >
                                                      {toolkitprops => (
                                                        <React.Fragment>
                                                         
                                                         
                                                        </React.Fragment>
                                                      )}
                                                    </ToolkitProvider>
                                                  )}
                                                </PaginationProvider>
                                              </div> */}
                                              </CardBody>
                                            </Card>
                                          )}
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

const mapStateToProps = ({ menu_items, gradeTypes, defineExamDates }) => ({
  defineExamDates: defineExamDates.defineExamDates,
  studentsOrder: defineExamDates.studentsOrder,
  deleted: defineExamDates.deleted,
  gradeTypes: gradeTypes.gradeTypes,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetDefineExamDates: () => dispatch(getDefineExamDates()),
  onGetStudentsOrder: () => dispatch(getStudentsOrder()),
  onAddNewDefineExamDate: defineExamDate =>
    dispatch(addNewDefineExamDate(defineExamDate)),
  onUpdateDefineExamDate: defineExamDate =>
    dispatch(updateDefineExamDate(defineExamDate)),
  onDeleteDefineExamDate: defineExamDate =>
    dispatch(deleteDefineExamDate(defineExamDate)),
  onGetDefineExamDateDeletedValue: () =>
    dispatch(getDefineExamDateDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(DefineExamDatesList)));
