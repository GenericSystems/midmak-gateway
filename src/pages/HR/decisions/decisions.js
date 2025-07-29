import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import Select from "react-select";
import * as moment from "moment";

import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  FormGroup,
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
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";

import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";
import {
  getDecisions,
  addNewDecision,
  updateDecision,
  deleteDecision,
  getDecisionDeletedValue,
  getDecisionMakers,
  getDecisionStatus,
} from "store/decisions/actions";
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
import { departments } from "common/data";
import decisions from "store/decisions/reducer";
class DecisionsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      decisions: [],
      decision: "",
      decisionsTypes: [],
      selectedDecisionMaker: "",
      selectedApplyDecisionTo: "",
      selectedEmployeeName: "",
      selectedDecisionType: "",
      selectedCorporateNode: "",
      selectedDecisionStatus: "",
      decisionNumberError: null,
      decisionDateError: null,
      decisionReasonError: null,
      decisionMakerError: null,
      applyDecisionToError: null,
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
      modal: false,
      addModal: false,
      deleteModal: false,
      duplicateError: null,
      selectedRowId: null,
      isEdit: false,
    };
    this.toggle = this.toggle.bind(this);
    this.addToggle = this.addToggle.bind(this);
    this.handleDataListChange = this.handleDataListChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }
  componentDidMount() {
    const {
      decisions,
      decisionsTypes,
      onGetDecisions,
      onGetDecisionMakers,
      onGetDecisionStatus,
      decisionStatus,
      decisionMakers,
      employeesNames,
      corporateNodesOpt,
      deleted,
      user_menu,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    // if (decision && !decisions.length) {
    //   onGetDecisions();
    // }
    onGetDecisions();
    onGetDecisionMakers();
    onGetDecisionStatus();

    this.setState({
      decisions,
      decisionMakers,
      employeesNames,
      corporateNodesOpt,
      decisionsTypes,
      decisionStatus,
    });
    this.setState({ deleted });
    console.log("rsssssssssssssss", decisions);
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

  addToggle = () => {
    this.setState(prevState => ({
      addModal: !prevState.addModal,
    }));
  };

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  onClickDelete = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };

  handleAddRow = () => {
    this.setState({
      decision: "",
      isEdit: false,
    });
    this.addToggle();
  };

  handleDecisionClick = arg => {
    console.log("arg", arg);

    this.setState({
      decision: arg,
      selectedDecisionMaker: arg.decisionMakerId,
      selectedApplyDecisionTo: arg.applyDecisionToId,
      // selectedCorporateNode: arg.corporateId,
      // selectedEmployeeName: arg.employeesId,
      selectedDecisionType: arg.decisionTypeId,
      selectedDecisionStatus: arg.decisionStatusId,
      isEdit: true,
    });
    this.toggle();
  };

  handleDeleteRow = () => {
    const { onDeleteDecision } = this.props;
    const { selectedRowId } = this.state;
    console.log("selectedRowId", selectedRowId);
    if (selectedRowId !== null) {
      onDeleteDecision(selectedRowId);

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
    this.toggle();
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleSuccessClose = () => {
    const { onGetDecisionDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetDecisionDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetDecisionDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetDecisionDeletedValue();
  };

  handleDataListChange = (fieldName, selectedValue) => {
    if (fieldName === "decisionMakerId") {
      const selected = this.state.decisionMakers.find(
        decisionMaker => decisionMaker.value.trim() === selectedValue.trim()
      );

      this.setState({
        selectedDecisionMaker: selected ? selected.key : null,
      });
      return;
    }

    if (fieldName === "employeesId") {
      const selected = this.state.employeesNames.find(
        employeeName => employeeName.value === selectedValue
      );

      this.setState({
        selectedEmployeeName: selected ? selected.key : null,
      });
      return;
    }

    if (fieldName === "corporateId") {
      const selected = this.state.corporateNodesOpt.find(
        corporateNode => corporateNode.value === selectedValue
      );

      this.setState({
        selectedCorporateNode: selected ? selected.key : null,
      });
      return;
    }
  };

  handleButtonClick = (fieldName, option) => {
    if (fieldName == "applyDecisionToId") {
      this.setState({ selectedApplyDecisionTo: option });
    }
  };

  handleSave = values => {
    const {
      selectedEmployeeName,
      selectedCorporateNode,
      selectedApplyDecisionTo,
      isEdit,
      selectedDecisionMaker,
      selectedDecisionType,
      selectedDecisionStatus,
    } = this.state;

    const { onAddNewDecision, onUpdateDecision } = this.props;

    values.decisionMakerId = selectedDecisionMaker;
    values.applyDecisionToId = selectedApplyDecisionTo;
    values.decisionTypeId = selectedDecisionType;
    values.decisionStatusId = isEdit ? selectedDecisionStatus : 4;
    console.log("selectedDecisionStatus at save:", selectedDecisionStatus);

    if (isEdit) {
      if (selectedDecisionStatus !== 4) {
        values.executeDate = new Date().toISOString().split("T")[0];
        values.isExecute = 1;
      } else {
        values.executeDate = null;
        values.isExecute = 0;
      }
    }

    if (selectedApplyDecisionTo === 1) {
      delete values.corporateId;
      delete values.employeesId;
    } else if (selectedApplyDecisionTo === 2) {
      values.corporateId = selectedCorporateNode;
      delete values.employeesId;
      if (values.corporateId === "") delete values.corporateId;
    } else if (selectedApplyDecisionTo === 3) {
      values.employeesId = selectedEmployeeName;
      delete values.corporateId;
    }
    Object.keys(values).forEach(key => {
      if (typeof values[key] === "string" && values[key].trim() === "") {
        delete values[key];
      }
    });

    let decisionInfo = {};
    Object.keys(values).forEach(key => {
      const val = values[key];
      if (val !== undefined && val !== null) {
        decisionInfo[key] = val;
      }
    });
    if (isEdit) {
      onUpdateDecision(decisionInfo);
      this.toggle();
    } else {
      onAddNewDecision(decisionInfo);
      this.addToggle();
    }

    this.setState({ errorMessages: {} });
  };

  handleSelect = (fieldName, selectedValue) => {
    if (fieldName == "decisionTypeId") {
      this.setState({
        selectedDecisionType: selectedValue,
      });
    }
  };

  handleValidDate = date => {
    if (
      !date ||
      date === "1970-01-01" ||
      date === "0000-00-00" ||
      moment(date).year() === 1970
    ) {
      return "";
    }
    return moment(date).format("DD-MM-YYYY");
  };

  render() {
    const decision = this.state.decision;
    const {
      decisions,
      employeesNames,
      corporateNodesOpt,
      decisionMakers,
      decisionsTypes,
      decisionStatus,
      t,
      deleted,
    } = this.props;
    const {
      isEdit,
      duplicateError,
      deleteModal,
      selectedDecisionMaker,
      selectedApplyDecisionTo,
      selectedEmployeeName,
      selectedCorporateNode,
      selectedDecisionType,
      selectedDecisionStatus,
      emptyError,
      showAlert,
      modal,
      addModal,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
      decisionNumberError,
      decisionDateError,
      decisionReasonError,
      decisionMakerError,
      applyDecisionToError,
      onGetDecisionMakers,
    } = this.state;
    console.log("decisionMakers:", decisionMakers);

    const showDepartment = selectedApplyDecisionTo === 2;

    const showEmployee = selectedApplyDecisionTo === 3;

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
        dataField: "decisionNumber",
        text: this.props.t("Decision Number"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "decisionDate",
        text: this.props.t("Decision Date"),
        sort: true,
        editable: false,
        formatter: (cellContent, row) => this.handleValidDate(row.decisionDate),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },

      {
        dataField: "decisionTypeId",
        text: this.props.t("Decision Type"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },

      {
        dataField: "decisionMakerId",
        text: this.props.t("Decision Maker"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "isExecute",
        text: this.props.t("Is Execute"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "executeDate",
        text: this.props.t("Execute Date"),
        sort: true,
        editable: false,
        formatter: (cellContent, row) => this.handleValidDate(row.executeDate),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "decisionStatusId",
        text: this.props.t("Decision Status"),
        sort: true,
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "menu",
        text: "",
        isDummyField: true,
        editable: false,
        //  hidden: !showDeleteButton,
        formatter: (cellContent, decision) => (
          <Tooltip title={this.props.t("Edit")} placement="top">
            <Link className="text-sm-end" to="#">
              <i
                className="mdi mdi-pencil font-size-18"
                id="edittooltip"
                onClick={() => this.handleDecisionClick(decision)}
              ></i>
            </Link>
          </Tooltip>
        ),
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: decisions.length,
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
            <Breadcrumbs breadcrumbItem={this.props.t("Decisions")} />
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
                        data={decisions}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={decisions}
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
                                  data={decisions}
                                  columns={columns}
                                  filter={filterFactory()}
                                  noDataIndication={this.props.t(
                                    "No Decisions found"
                                  )}
                                  responsive
                                  defaultSorted={defaultSorting}
                                />
                                <Modal
                                  isOpen={addModal}
                                  toggle={this.addToggle}
                                  fullscreen
                                >
                                  <ModalHeader toggle={this.addToggle} tag="h3">
                                    {!!isEdit
                                      ? t("Edit Decision")
                                      : t("Add Decision")}
                                  </ModalHeader>
                                  <ModalBody>
                                    <Row>
                                      <Col>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            decisionNumber:
                                              (decision &&
                                                decision.decisionNumber) ||
                                              "",
                                            decisionDate:
                                              (decision &&
                                                decision.decisionDate) ||
                                              "",
                                            decisionMakerId:
                                              (decision &&
                                                decision.decisionMakerId) ||
                                              selectedDecisionMaker,
                                            applyDecisionToId:
                                              (decision &&
                                                decision.applyDecisionToId) ||
                                              "",
                                            employeesId:
                                              (decision &&
                                                decision.employeesId) ||
                                              selectedEmployeeName,
                                            corporateId:
                                              (decision &&
                                                decision.corporateId) ||
                                              selectedCorporateNode,
                                            decisionReason:
                                              (decision &&
                                                decision.decisionReason) ||
                                              "",
                                            decisionTypeId:
                                              (decision &&
                                                decision.decisionTypeId) ||
                                              selectedDecisionType,
                                          }}
                                          validationSchema={Yup.object().shape({
                                            decisionNumber: Yup.number()
                                              .required(
                                                "Decision Number is required"
                                              )
                                              .nullable(),
                                            decisionDate: Yup.date().required(
                                              "Decision Date is required"
                                            ),
                                            decisionMakerId:
                                              Yup.string().required(
                                                "Decision Maker Is Required"
                                              ),
                                            applyDecisionToId:
                                              Yup.string().required(
                                                "Apply The Decision To Is Required"
                                              ),
                                            decisionReason:
                                              Yup.string().required(
                                                "Decision Reason Is Required"
                                              ),
                                            decisionTypeId:
                                              Yup.string().required(
                                                "Decision Type Is Required"
                                              ),
                                          })}
                                        >
                                          {({
                                            errors,
                                            status,
                                            touched,
                                            values,
                                            handleSubmit,
                                            setFieldValue,
                                            handleBlur,
                                            handleChange,
                                          }) => (
                                            <Form>
                                              <div className="bordered">
                                                <Card>
                                                  <CardTitle id="card_header">
                                                    {t("Decision Information")}
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
                                                          onClick={
                                                            this
                                                              .handleAlertClose
                                                          }
                                                        ></button>
                                                      </Alert>
                                                    )}
                                                    <Row>
                                                      <Col lg="6">
                                                        <div className="mb-3">
                                                          <Row>
                                                            <Col lg="4">
                                                              <Label for="decisionNumber">
                                                                {this.props.t(
                                                                  "Decision Number"
                                                                )}
                                                              </Label>
                                                              <span className="text-danger">
                                                                *
                                                              </span>
                                                            </Col>
                                                            <Col className="col-6">
                                                              <Field
                                                                type="text"
                                                                name="decisionNumber"
                                                                id="decisionNumber"
                                                                className={
                                                                  "form-control" +
                                                                  ((errors.decisionNumber &&
                                                                    touched.decisionNumber) ||
                                                                  decisionNumberError
                                                                    ? " is-invalid"
                                                                    : "")
                                                                }
                                                              />

                                                              {decisionNumberError && (
                                                                <div className="invalid-feedback">
                                                                  {this.props.t(
                                                                    "Decision Number is required"
                                                                  )}
                                                                </div>
                                                              )}
                                                              <ErrorMessage
                                                                name="decisionNumber"
                                                                component="div"
                                                                className="invalid-feedback"
                                                              />
                                                            </Col>
                                                          </Row>
                                                        </div>
                                                        <div className="mb-3">
                                                          <Row>
                                                            <Col lg="4">
                                                              <Label
                                                                for="decisionMaker-Id"
                                                                className="form-label d-flex"
                                                              >
                                                                {this.props.t(
                                                                  "Decision Maker"
                                                                )}
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
                                                              </Label>
                                                            </Col>
                                                            <Col lg="8">
                                                              <input
                                                                type="text"
                                                                id="decisionMaker-Id"
                                                                name="decisionMakerId"
                                                                list="decisionMakerList"
                                                                className={`form-control ${this.state.inputClass}`}
                                                                onChange={e => {
                                                                  this.handleDataListChange(
                                                                    e.target
                                                                      .name,
                                                                    e.target
                                                                      .value
                                                                  );
                                                                }}
                                                              />
                                                              <datalist id="decisionMakerList">
                                                                {decisionMakers.map(
                                                                  decisionMaker => (
                                                                    <option
                                                                      key={
                                                                        decisionMaker.key
                                                                      }
                                                                      value={
                                                                        decisionMaker.value
                                                                      }
                                                                    />
                                                                  )
                                                                )}
                                                              </datalist>
                                                              {decisionMakerError && (
                                                                <div className="invalid-feedback">
                                                                  {this.props.t(
                                                                    "Decision Maker is required"
                                                                  )}
                                                                </div>
                                                              )}
                                                              <ErrorMessage
                                                                name="decisionMakerId"
                                                                component="div"
                                                                className="invalid-feedback"
                                                              />
                                                            </Col>
                                                          </Row>
                                                        </div>
                                                        {showEmployee && (
                                                          <FormGroup>
                                                            <div className="mb-3">
                                                              <Row>
                                                                <Col className="col-4">
                                                                  <Label for="employee-Id">
                                                                    {this.props.t(
                                                                      "Employees"
                                                                    )}
                                                                  </Label>
                                                                  <span className="text-danger">
                                                                    *
                                                                  </span>
                                                                </Col>
                                                                <Col className="col-8">
                                                                  <input
                                                                    className={`form-control ${this.state.inputClass}`}
                                                                    list="employeeNameDatalist"
                                                                    name="employeesId"
                                                                    id="employee-Id"
                                                                    placeholder="Type to search..."
                                                                    autoComplete="off"
                                                                    onChange={e =>
                                                                      this.handleDataListChange(
                                                                        e.target
                                                                          .name,
                                                                        e.target
                                                                          .value
                                                                      )
                                                                    }
                                                                  />
                                                                  <datalist id="employeeNameDatalist">
                                                                    {employeesNames.map(
                                                                      employeeName => (
                                                                        <option
                                                                          key={
                                                                            employeeName.key
                                                                          }
                                                                          value={
                                                                            employeeName.value
                                                                          }
                                                                        />
                                                                      )
                                                                    )}
                                                                  </datalist>
                                                                </Col>
                                                              </Row>
                                                            </div>
                                                          </FormGroup>
                                                        )}
                                                        {showDepartment && (
                                                          <FormGroup>
                                                            <div className="mb-3">
                                                              <Row>
                                                                <Col lg="4">
                                                                  <Label
                                                                    for="-Id"
                                                                    className="form-label d-flex"
                                                                  >
                                                                    {this.props.t(
                                                                      "Corporate"
                                                                    )}
                                                                    <span className="text-danger">
                                                                      *
                                                                    </span>
                                                                  </Label>
                                                                </Col>
                                                                <Col lg="8">
                                                                  <input
                                                                    type="text"
                                                                    id="corporate-Id"
                                                                    name="corporateId"
                                                                    list="corporatesList"
                                                                    className={`form-control ${this.state.inputClass}`}
                                                                    placeholder="Type to search..."
                                                                    onChange={e => {
                                                                      this.handleDataListChange(
                                                                        e.target
                                                                          .name,
                                                                        e.target
                                                                          .value
                                                                      );
                                                                    }}
                                                                  />
                                                                  <datalist id="corporatesList">
                                                                    {corporateNodesOpt.map(
                                                                      corporateNode => (
                                                                        <option
                                                                          key={
                                                                            corporateNode.key
                                                                          }
                                                                          value={
                                                                            corporateNode.value
                                                                          }
                                                                        />
                                                                      )
                                                                    )}
                                                                  </datalist>
                                                                </Col>
                                                              </Row>
                                                            </div>
                                                          </FormGroup>
                                                        )}
                                                        <div className="md-3">
                                                          <Row>
                                                            <Col className="col-4 text-center">
                                                              <Label for="decision-reason">
                                                                {this.props.t(
                                                                  "Decision Reason"
                                                                )}
                                                              </Label>
                                                            </Col>
                                                            <Col className="col-8">
                                                              <Field
                                                                type="textarea"
                                                                name="decisionReason"
                                                                as="textarea"
                                                                id="decision-reason"
                                                                className={
                                                                  "form-control"
                                                                }
                                                              />
                                                              {decisionReasonError && (
                                                                <div className="invalid-feedback">
                                                                  {this.props.t(
                                                                    "Decision Reason is required"
                                                                  )}
                                                                </div>
                                                              )}
                                                              <ErrorMessage
                                                                name="decisionReason"
                                                                component="div"
                                                                className="invalid-feedback"
                                                              />
                                                            </Col>
                                                          </Row>
                                                        </div>
                                                      </Col>
                                                      <Col lg="6">
                                                        <div className="mb-3">
                                                          <Row>
                                                            <Col lg="4">
                                                              <Label
                                                                for="decisionDate"
                                                                className="form-label d-flex"
                                                              >
                                                                {this.props.t(
                                                                  "Decision Date"
                                                                )}
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
                                                              </Label>
                                                            </Col>
                                                            <Col lg="6">
                                                              <Field
                                                                name="decisionDate"
                                                                type="date"
                                                                id="decisionDate"
                                                                value={
                                                                  values.decisionDate
                                                                    ? new Date(
                                                                        values.decisionDate
                                                                      )
                                                                        .toISOString()
                                                                        .split(
                                                                          "T"
                                                                        )[0]
                                                                    : ""
                                                                }
                                                                className={`form-control ${
                                                                  errors.decisionDate &&
                                                                  touched.decisionDate
                                                                    ? "is-invalid"
                                                                    : ""
                                                                }`}
                                                                onChange={
                                                                  handleChange
                                                                }
                                                              />
                                                              {decisionDateError && (
                                                                <div className="invalid-feedback">
                                                                  {this.props.t(
                                                                    "Decision Date is required"
                                                                  )}
                                                                </div>
                                                              )}
                                                              <ErrorMessage
                                                                name="decisionDate"
                                                                component="div"
                                                                className="invalid-feedback"
                                                              />
                                                            </Col>
                                                          </Row>
                                                        </div>
                                                        <div className="mb-3">
                                                          <Row>
                                                            <Col className="col-4">
                                                              <Label for="applyDecisionTo">
                                                                {this.props.t(
                                                                  "Apply The Decision To"
                                                                )}
                                                              </Label>
                                                              <span className="text-danger">
                                                                *
                                                              </span>
                                                            </Col>
                                                            <Col className="col-8">
                                                              <div
                                                                name="applyDecisionToId"
                                                                id="applyDecisionTo"
                                                                role="group"
                                                                className={
                                                                  "btn-group btn-group-example mb-3 bg-transparent form-control" +
                                                                  ((errors.applyDecisionToId &&
                                                                    touched.applyDecisionToId) ||
                                                                  applyDecisionToError
                                                                    ? " is-invalid"
                                                                    : "")
                                                                }
                                                              >
                                                                <button
                                                                  id="allEmployees"
                                                                  type="button"
                                                                  name="applyDecisionToId"
                                                                  value={
                                                                    selectedApplyDecisionTo ==
                                                                    1
                                                                      ? "active"
                                                                      : ""
                                                                  }
                                                                  className={`btn btn-outline-primary w-sm ${
                                                                    selectedApplyDecisionTo ===
                                                                    "allEmployees"
                                                                      ? "active"
                                                                      : ""
                                                                  }`}
                                                                  onClick={() =>
                                                                    this.handleButtonClick(
                                                                      "applyDecisionToId",
                                                                      1
                                                                    )
                                                                  }
                                                                >
                                                                  {this.props.t(
                                                                    "All Employees"
                                                                  )}
                                                                </button>

                                                                <button
                                                                  id="department"
                                                                  type="button"
                                                                  name="applyDecisionToId"
                                                                  value={
                                                                    selectedApplyDecisionTo ===
                                                                    2
                                                                      ? "active"
                                                                      : ""
                                                                  }
                                                                  className={`btn btn-outline-primary w-sm ${
                                                                    selectedApplyDecisionTo ===
                                                                    "department"
                                                                      ? "active"
                                                                      : ""
                                                                  }`}
                                                                  onClick={() =>
                                                                    this.handleButtonClick(
                                                                      "applyDecisionToId",
                                                                      2
                                                                    )
                                                                  }
                                                                >
                                                                  {this.props.t(
                                                                    "Department"
                                                                  )}
                                                                </button>
                                                                <button
                                                                  id="employees"
                                                                  type="button"
                                                                  name="applyDecisionToId"
                                                                  value={
                                                                    selectedApplyDecisionTo ===
                                                                    "employees"
                                                                      ? "active"
                                                                      : ""
                                                                  }
                                                                  className={`btn btn-outline-primary w-sm ${
                                                                    selectedApplyDecisionTo ===
                                                                    3
                                                                      ? "active"
                                                                      : ""
                                                                  }`}
                                                                  onClick={() =>
                                                                    this.handleButtonClick(
                                                                      "applyDecisionToId",
                                                                      3
                                                                    )
                                                                  }
                                                                >
                                                                  {this.props.t(
                                                                    "Employees"
                                                                  )}
                                                                </button>
                                                              </div>
                                                              {applyDecisionToError && (
                                                                <div className="invalid-feedback">
                                                                  {this.props.t(
                                                                    "Apply The Decision To is required"
                                                                  )}
                                                                </div>
                                                              )}
                                                              <ErrorMessage
                                                                name="applyDecisionToId"
                                                                component="div"
                                                                className="invalid-feedback"
                                                              />
                                                            </Col>
                                                          </Row>
                                                        </div>
                                                      </Col>
                                                    </Row>
                                                  </CardBody>
                                                </Card>
                                                <Card>
                                                  <CardTitle id="card_header">
                                                    {t("Decision Type")}
                                                  </CardTitle>
                                                  <CardBody className="cardBody">
                                                    <Col lg="6">
                                                      <div className="mb-3">
                                                        <Row>
                                                          <Col className="col-4">
                                                            <Label for="decisionType-Id">
                                                              {this.props.t(
                                                                "Decision Type"
                                                              )}
                                                            </Label>
                                                          </Col>
                                                          <Col className="col-8">
                                                            <Select
                                                              name="decisionTypeId"
                                                              id="decisionType-Id"
                                                              key={`select_decisionType`}
                                                              options={
                                                                decisionsTypes
                                                              }
                                                              className={`form-control`}
                                                              onChange={newValue => {
                                                                this.handleSelect(
                                                                  "decisionTypeId",
                                                                  newValue.value
                                                                );
                                                              }}
                                                              defaultValue={decisionsTypes.find(
                                                                opt =>
                                                                  opt.value ===
                                                                  decision.decisionType
                                                              )}
                                                            />
                                                          </Col>
                                                        </Row>
                                                      </div>
                                                      <div className="md-3">
                                                        <Row>
                                                          <Col className="col-4 text-center">
                                                            <Label for="note">
                                                              {this.props.t(
                                                                "Decision Text"
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
                                                    </Col>
                                                  </CardBody>
                                                </Card>
                                              </div>
                                              <Row>
                                                <Col>
                                                  <div className="text-center">
                                                    <button
                                                      type="button"
                                                      className="btn btn-primary me-2"
                                                      onClick={() => {
                                                        this.handleSave(values);
                                                      }}
                                                    >
                                                      {t("Save")}
                                                    </button>
                                                  </div>
                                                </Col>
                                              </Row>
                                            </Form>
                                          )}
                                        </Formik>
                                      </Col>
                                    </Row>
                                  </ModalBody>
                                </Modal>
                                <Modal
                                  isOpen={modal}
                                  toggle={this.toggle}
                                  fullscreen
                                >
                                  <ModalHeader toggle={this.toggle} tag="h3">
                                    {!!isEdit
                                      ? t("Edit Decision")
                                      : t("Add Decision")}
                                  </ModalHeader>
                                  <ModalBody>
                                    <Row>
                                      <Col>
                                        <Formik
                                          enableReinitialize
                                          initialValues={{
                                            ...(isEdit &&
                                              decision && {
                                                Id: decision.Id,
                                              }),
                                            decisionNumber:
                                              (decision &&
                                                decision.decisionNumber) ||
                                              "",
                                            decisionDate:
                                              (decision &&
                                                decision.decisionDate) ||
                                              "",
                                            decisionMakerId:
                                              (decision &&
                                                decision.decisionMakerId) ||
                                              selectedDecisionMaker,
                                            applyDecisionToId:
                                              (decision &&
                                                decision.applyDecisionToId) ||
                                              "",
                                            employeesId:
                                              (decision &&
                                                decision.employeesId) ||
                                              selectedEmployeeName,
                                            corporateId:
                                              (decision &&
                                                decision.corporateId) ||
                                              selectedCorporateNode,
                                            decisionReason:
                                              (decision &&
                                                decision.decisionReason) ||
                                              "",
                                            decisionTypeId:
                                              (decision &&
                                                decision.decisionTypeId) ||
                                              selectedDecisionType,
                                            decisionStatusId:
                                              decision &&
                                              decision.decisionStatusId,
                                          }}
                                          validationSchema={Yup.object().shape({
                                            decisionNumber: Yup.number()
                                              .required(
                                                "Decision Number is required"
                                              )
                                              .nullable(),
                                            decisionDate: Yup.date().required(
                                              "Decision Date is required"
                                            ),
                                            decisionMakerId:
                                              Yup.string().required(
                                                "Decision Maker Is Required"
                                              ),
                                            applyDecisionToId:
                                              Yup.string().required(
                                                "Apply The Decision To Is Required"
                                              ),
                                            decisionReason:
                                              Yup.string().required(
                                                "Decision Reason Is Required"
                                              ),
                                            decisionTypeId:
                                              Yup.string().required(
                                                "Decision Type Is Required"
                                              ),
                                          })}
                                          onSubmit={values => {
                                            this.handleSave(values);
                                          }}
                                        >
                                          {({
                                            errors,
                                            status,
                                            touched,
                                            values,
                                            handleSubmit,
                                            setFieldValue,
                                            handleBlur,
                                            handleChange,
                                          }) => (
                                            <Form>
                                              <div className="bordered">
                                                <Card>
                                                  <CardTitle id="card_header">
                                                    {t("Decision Information")}
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
                                                            onClick={
                                                              this
                                                                .handleAlertClose
                                                            }
                                                          ></button>
                                                        </Alert>
                                                      )}
                                                    </div>
                                                    <Row>
                                                      <Col lg="6">
                                                        <div className="mb-3">
                                                          <Row>
                                                            <Col lg="4">
                                                              <Label for="decisionNumber">
                                                                {this.props.t(
                                                                  "Decision Number"
                                                                )}
                                                              </Label>
                                                              <span className="text-danger">
                                                                *
                                                              </span>
                                                            </Col>
                                                            <Col className="col-6">
                                                              <Field
                                                                type="text"
                                                                name="decisionNumber"
                                                                id="decisionNumber"
                                                                className={
                                                                  "form-control" +
                                                                  ((errors.decisionNumber &&
                                                                    touched.decisionNumber) ||
                                                                  decisionNumberError
                                                                    ? " is-invalid"
                                                                    : "")
                                                                }
                                                              />

                                                              {decisionNumberError && (
                                                                <div className="invalid-feedback">
                                                                  {this.props.t(
                                                                    "Decision Number is required"
                                                                  )}
                                                                </div>
                                                              )}
                                                              <ErrorMessage
                                                                name="decisionNumber"
                                                                component="div"
                                                                className="invalid-feedback"
                                                              />
                                                            </Col>
                                                          </Row>
                                                        </div>
                                                        <div className="mb-3">
                                                          <Row>
                                                            <Col lg="4">
                                                              <Label
                                                                for="decisionMaker-Id"
                                                                className="form-label d-flex"
                                                              >
                                                                {this.props.t(
                                                                  "Decision Maker"
                                                                )}
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
                                                              </Label>
                                                            </Col>
                                                            <Col lg="8">
                                                              <input
                                                                type="text"
                                                                id="decisionMaker-Id"
                                                                name="decisionMakerId"
                                                                list="decisionMakerList"
                                                                className={`form-control ${this.state.inputClass}`}
                                                                onChange={e => {
                                                                  this.handleDataListChange(
                                                                    e.target
                                                                      .name,
                                                                    e.target
                                                                      .value
                                                                  );
                                                                }}
                                                              />
                                                              <datalist id="decisionMakerList">
                                                                {decisionMakers.map(
                                                                  decisionMaker => (
                                                                    <option
                                                                      key={
                                                                        decisionMaker.key
                                                                      }
                                                                      value={
                                                                        decisionMaker.value
                                                                      }
                                                                    />
                                                                  )
                                                                )}
                                                              </datalist>
                                                              {decisionMakerError && (
                                                                <div className="invalid-feedback">
                                                                  {this.props.t(
                                                                    "Decision Maker is required"
                                                                  )}
                                                                </div>
                                                              )}
                                                              <ErrorMessage
                                                                name="decisionMakerId"
                                                                component="div"
                                                                className="invalid-feedback"
                                                              />
                                                            </Col>
                                                          </Row>
                                                        </div>
                                                        {showEmployee && (
                                                          <FormGroup>
                                                            <div className="mb-3">
                                                              <Row>
                                                                <Col className="col-4">
                                                                  <Label for="employee-Id">
                                                                    {this.props.t(
                                                                      "Employees"
                                                                    )}
                                                                  </Label>
                                                                  <span className="text-danger">
                                                                    *
                                                                  </span>
                                                                </Col>
                                                                <Col className="col-8">
                                                                  <input
                                                                    className={`form-control ${this.state.inputClass}`}
                                                                    list="employeeNameDatalist"
                                                                    name="employeesId"
                                                                    id="employee-Id"
                                                                    placeholder="Type to search..."
                                                                    autoComplete="off"
                                                                    onChange={e =>
                                                                      this.handleDataListChange(
                                                                        e.target
                                                                          .name,
                                                                        e.target
                                                                          .value
                                                                      )
                                                                    }
                                                                  />
                                                                  <datalist id="employeeNameDatalist">
                                                                    {employeesNames.map(
                                                                      employeeName => (
                                                                        <option
                                                                          key={
                                                                            employeeName.key
                                                                          }
                                                                          value={
                                                                            employeeName.value
                                                                          }
                                                                        />
                                                                      )
                                                                    )}
                                                                  </datalist>
                                                                </Col>
                                                              </Row>
                                                            </div>
                                                          </FormGroup>
                                                        )}
                                                        {showDepartment && (
                                                          <FormGroup>
                                                            <div className="mb-3">
                                                              <Row>
                                                                <Col lg="4">
                                                                  <Label
                                                                    for="-Id"
                                                                    className="form-label d-flex"
                                                                  >
                                                                    {this.props.t(
                                                                      "Corporate"
                                                                    )}
                                                                    <span className="text-danger">
                                                                      *
                                                                    </span>
                                                                  </Label>
                                                                </Col>
                                                                <Col lg="8">
                                                                  <input
                                                                    type="text"
                                                                    id="corporate-Id"
                                                                    name="corporateId"
                                                                    list="corporatesList"
                                                                    className={`form-control ${this.state.inputClass}`}
                                                                    placeholder="Type to search..."
                                                                    onChange={e => {
                                                                      this.handleDataListChange(
                                                                        e.target
                                                                          .name,
                                                                        e.target
                                                                          .value
                                                                      );
                                                                    }}
                                                                  />
                                                                  <datalist id="corporatesList">
                                                                    {corporateNodesOpt.map(
                                                                      corporateNode => (
                                                                        <option
                                                                          key={
                                                                            corporateNode.key
                                                                          }
                                                                          value={
                                                                            corporateNode.value
                                                                          }
                                                                        />
                                                                      )
                                                                    )}
                                                                  </datalist>
                                                                </Col>
                                                              </Row>
                                                            </div>
                                                          </FormGroup>
                                                        )}
                                                        <div className="md-3">
                                                          <Row>
                                                            <Col className="col-4 text-center">
                                                              <Label for="decision-reason">
                                                                {this.props.t(
                                                                  "Decision Reason"
                                                                )}
                                                              </Label>
                                                            </Col>
                                                            <Col className="col-8">
                                                              <Field
                                                                type="textarea"
                                                                name="decisionReason"
                                                                as="textarea"
                                                                id="decision-reason"
                                                                className={
                                                                  "form-control"
                                                                }
                                                              />
                                                              {decisionReasonError && (
                                                                <div className="invalid-feedback">
                                                                  {this.props.t(
                                                                    "Decision Reason is required"
                                                                  )}
                                                                </div>
                                                              )}
                                                              <ErrorMessage
                                                                name="decisionReason"
                                                                component="div"
                                                                className="invalid-feedback"
                                                              />
                                                            </Col>
                                                          </Row>
                                                        </div>
                                                      </Col>
                                                      <Col lg="6">
                                                        <div className="mb-3">
                                                          <Row>
                                                            <Col lg="4">
                                                              <label
                                                                htmlFor="decisionDate"
                                                                className="form-label d-flex"
                                                              >
                                                                {this.props.t(
                                                                  "Decision Date"
                                                                )}
                                                                <span className="text-danger">
                                                                  *
                                                                </span>
                                                              </label>
                                                            </Col>
                                                            <Col lg="6">
                                                              <Field
                                                                name="decisionDate"
                                                                type="date"
                                                                id="decisionDate"
                                                                value={
                                                                  values.decisionDate
                                                                    ? new Date(
                                                                        values.decisionDate
                                                                      )
                                                                        .toISOString()
                                                                        .split(
                                                                          "T"
                                                                        )[0]
                                                                    : ""
                                                                }
                                                                className={`form-control ${
                                                                  errors.decisionDate &&
                                                                  touched.decisionDate
                                                                    ? "is-invalid"
                                                                    : ""
                                                                }`}
                                                                onChange={
                                                                  handleChange
                                                                }
                                                              />
                                                              {decisionDateError && (
                                                                <div className="invalid-feedback">
                                                                  {this.props.t(
                                                                    "Decision Date is required"
                                                                  )}
                                                                </div>
                                                              )}
                                                              <ErrorMessage
                                                                name="decisionDate"
                                                                component="div"
                                                                className="invalid-feedback"
                                                              />
                                                            </Col>
                                                          </Row>
                                                        </div>
                                                        <div className="mb-3">
                                                          <Row>
                                                            <Col className="col-4">
                                                              <Label for="applyDecisionTo">
                                                                {this.props.t(
                                                                  "Apply The Decision To"
                                                                )}
                                                              </Label>
                                                              <span className="text-danger">
                                                                *
                                                              </span>
                                                            </Col>
                                                            <Col className="col-8">
                                                              <div
                                                                name="applyDecisionToId"
                                                                id="applyDecisionTo"
                                                                role="group"
                                                                className={
                                                                  "btn-group btn-group-example mb-3 bg-transparent form-control" +
                                                                  ((errors.applyDecisionToId &&
                                                                    touched.applyDecisionToId) ||
                                                                  applyDecisionToError
                                                                    ? " is-invalid"
                                                                    : "")
                                                                }
                                                              >
                                                                <button
                                                                  id="allEmployees"
                                                                  type="button"
                                                                  name="applyDecisionToId"
                                                                  value={
                                                                    selectedApplyDecisionTo ==
                                                                    "allEmployees"
                                                                      ? "active"
                                                                      : ""
                                                                  }
                                                                  className={`btn btn-outline-primary w-sm ${
                                                                    selectedApplyDecisionTo ===
                                                                    "allEmployees"
                                                                      ? "active"
                                                                      : ""
                                                                  }`}
                                                                  onClick={() =>
                                                                    this.handleButtonClick(
                                                                      "applyDecisionToId",
                                                                      1
                                                                    )
                                                                  }
                                                                >
                                                                  {this.props.t(
                                                                    "All Employees"
                                                                  )}
                                                                </button>

                                                                <button
                                                                  id="department"
                                                                  type="button"
                                                                  name="applyDecisionToId"
                                                                  value={
                                                                    selectedApplyDecisionTo ===
                                                                    "department"
                                                                      ? "active"
                                                                      : ""
                                                                  }
                                                                  className={`btn btn-outline-primary w-sm ${
                                                                    selectedApplyDecisionTo ===
                                                                    "department"
                                                                      ? "active"
                                                                      : ""
                                                                  }`}
                                                                  onClick={() =>
                                                                    this.handleButtonClick(
                                                                      "applyDecisionToId",
                                                                      2
                                                                    )
                                                                  }
                                                                >
                                                                  {this.props.t(
                                                                    "Department"
                                                                  )}
                                                                </button>
                                                                <button
                                                                  id="employees"
                                                                  type="button"
                                                                  name="applyDecisionToId"
                                                                  value={
                                                                    selectedApplyDecisionTo ===
                                                                    "employees"
                                                                      ? "active"
                                                                      : ""
                                                                  }
                                                                  className={`btn btn-outline-primary w-sm ${
                                                                    selectedApplyDecisionTo ===
                                                                    "employees"
                                                                      ? "active"
                                                                      : ""
                                                                  }`}
                                                                  onClick={() =>
                                                                    this.handleButtonClick(
                                                                      "applyDecisionToId",
                                                                      3
                                                                    )
                                                                  }
                                                                >
                                                                  {this.props.t(
                                                                    "Employees"
                                                                  )}
                                                                </button>
                                                              </div>
                                                              {applyDecisionToError && (
                                                                <div className="invalid-feedback">
                                                                  {this.props.t(
                                                                    "Apply The Decision To is required"
                                                                  )}
                                                                </div>
                                                              )}
                                                              <ErrorMessage
                                                                name="applyDecisionToId"
                                                                component="div"
                                                                className="invalid-feedback"
                                                              />
                                                            </Col>
                                                          </Row>
                                                        </div>
                                                      </Col>
                                                    </Row>
                                                  </CardBody>
                                                </Card>
                                                <Card>
                                                  <CardTitle id="card_header">
                                                    {t("Decision Types")}
                                                  </CardTitle>
                                                  <CardBody className="cardBody">
                                                    <Col lg="6">
                                                      <div className="mb-3">
                                                        <Row>
                                                          <Col className="col-4">
                                                            <Label for="decisionType-Id">
                                                              {this.props.t(
                                                                "Decision Type"
                                                              )}
                                                            </Label>
                                                            <span className="text-danger">
                                                              *
                                                            </span>
                                                          </Col>
                                                          <Col className="col-8">
                                                            <Select
                                                              name="decisionTypeId"
                                                              id="decisionType-Id"
                                                              options={
                                                                decisionsTypes
                                                              }
                                                              className={`form-control`}
                                                              onChange={newValue => {
                                                                this.handleSelect(
                                                                  "decisionTypeId",
                                                                  newValue.value,
                                                                  values
                                                                );
                                                              }}
                                                              Value={decisionsTypes.find(
                                                                opt =>
                                                                  opt.value ===
                                                                  decision.decisionType
                                                              )}
                                                            />
                                                          </Col>
                                                        </Row>
                                                      </div>
                                                      <div className="md-3">
                                                        <Row>
                                                          <Col className="col-4 text-center">
                                                            <Label for="note">
                                                              {this.props.t(
                                                                "Decision Text"
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
                                                    </Col>
                                                  </CardBody>
                                                </Card>
                                              </div>
                                              <Row>
                                                <Card>
                                                  <CardBody>
                                                    <Col lg="12">
                                                      <div className="mb-3">
                                                        <Row>
                                                          <Col lg="4">
                                                            <Label
                                                              for="decisionStatus-Id"
                                                              className="form-label d-flex"
                                                            >
                                                              {this.props.t(
                                                                "Decision Status"
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
                                                                        onChange={() => {
                                                                          setFieldValue(
                                                                            "decisionStatusId",
                                                                            status.Id
                                                                          );

                                                                          this.setState(
                                                                            {
                                                                              selectedDecisionStatus:
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
                                                    </Col>
                                                  </CardBody>
                                                </Card>
                                              </Row>
                                              <Row>
                                                <Col>
                                                  <div className="text-center">
                                                    <button
                                                      type="button"
                                                      className="btn btn-primary me-2"
                                                      onClick={() => {
                                                        this.handleSave(values);
                                                      }}
                                                    >
                                                      {t("Save")}
                                                    </button>
                                                    <button
                                                      type="button"
                                                      className="btn btn-primary me-2"
                                                      onClick={() => {
                                                        this.onClickDelete(
                                                          decision
                                                        );
                                                      }}
                                                    >
                                                      {t("Delete")}
                                                    </button>
                                                  </div>
                                                </Col>
                                              </Row>
                                            </Form>
                                          )}
                                        </Formik>
                                      </Col>
                                    </Row>
                                  </ModalBody>
                                </Modal>
                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </Col>
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
  decisions,
  menu_items,
  employees,
  decisionsTypes,
}) => ({
  decisions: decisions.decisions,
  corporateNodesOpt: employees.corporateNodesOpt || [],
  decisionMakers: decisions.decisionMakers,
  decisionsTypes: decisionsTypes.decisionsTypes,
  decisionStatus: decisions.decisionStatus,
  employeesNames: employees.employeesNames,
  deleted: decisions.deleted,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetDecisions: () => dispatch(getDecisions()),
  onAddNewDecision: decision => dispatch(addNewDecision(decision)),
  onUpdateDecision: decision => dispatch(updateDecision(decision)),
  onDeleteDecision: decision => dispatch(deleteDecision(decision)),
  onGetDecisionDeletedValue: () => dispatch(getDecisionDeletedValue()),
  onGetDecisionMakers: () => dispatch(getDecisionMakers()),
  onGetDecisionStatus: () => dispatch(getDecisionStatus()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(DecisionsList)));
