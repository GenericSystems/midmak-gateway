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
      decisionMakerName: null,
      selectedApplyDecisionTo: "",
      selectedEmployeeName: null,
      employeeName: "",
      employeesArray: [],
      selectedDecisionType: null,
      selectedCorporateNode: null,
      corporateNodeName: "",
      selectedDecisionStatus: null,
      decisionNumberError: null,
      decisionDateError: false,
      decisionMakerError: false,
      applyDecisionToError: false,
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
      loginUser: "",
    };
    this.toggle = this.toggle.bind(this);
    this.addToggle = this.addToggle.bind(this);
    this.handleDataListChange = this.handleDataListChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }
  componentDidMount() {
    const authUserStr = localStorage.getItem("authUser");
    let loginUser = "";

    if (authUserStr) {
      try {
        const parsed = JSON.parse(authUserStr);
        if (parsed && parsed.length > 0) {
          loginUser = parsed[0].userName;
        }
      } catch (e) {
        console.error("authUser parsing failed", e);
      }
    }

    this.setState({ loginUser });
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
      selectedDecisionMaker: null,
      selectedApplyDecisionTo: null,
      selectedCorporateNode: null,
      corporateNodeName: "",
      employeesArray: [],
      employeesId: [],
      isEdit: false,
    });
    this.addToggle();
  };

  handleDecisionClick = arg => {
    console.log("arg", arg);
    const employeesArray = arg.employees ? JSON.parse(arg.employees) : [];
    this.setState({
      decision: arg,
      selectedDecisionMaker: arg.decisionMakerId,
      decisionMakerName: arg.decisionMakerName,
      selectedApplyDecisionTo: arg.applyDecisionToId,
      selectedCorporateNode: arg.corporateId,
      corporateNodeName: arg.corporateNodeName,
      // selectedEmployeeName: arg.employeesId,
      // employeeName: arg.employeeName,
      employeesArray,
      employeesId: employeesArray.map(i => i.value),
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

  handleAlertClose = alertName => {
    this.setState({ [alertName]: null });
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
    console.log("values", values);
    const {
      selectedEmployeeName,
      selectedCorporateNode,
      selectedApplyDecisionTo,
      isEdit,
      selectedDecisionMaker,
      selectedDecisionType,
      selectedDecisionStatus,
      employeesArray,
    } = this.state;

    const { onAddNewDecision, onUpdateDecision } = this.props;

    const formattedEmployees =
      employeesArray?.map(item => ({
        label: item.label,
        value: item.value,
      })) || [];

    values.decisionMakerId = selectedDecisionMaker;
    values.applyDecisionToId = selectedApplyDecisionTo;
    values.decisionTypeId = selectedDecisionType;
    values.decisionStatusId = isEdit ? selectedDecisionStatus : 4;
    values["corporateId"] = selectedCorporateNode;
    values["employeesId"] = formattedEmployees;
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
    if (
      values.decisionNumber === "" ||
      values.decisionMakerId === "" ||
      values.decisionDate === "" ||
      (values.applyDecisionToId === "" && selectedApplyDecisionTo === "")
    ) {
      this.setState({ decisionNumberError: true, saveError: true });

      this.setState({ decisionMakerError: true, saveError: true });

      this.setState({ decisionDateError: true, saveError: true });

      this.setState({ applyDecisionToError: true, saveError: true });

      const emptyError = this.props.t(
        "Fill the Required Fields to Save Decision"
      );

      this.setState({ emptyError: emptyError });
    } else {
      this.setState({ decisionNumberError: false, saveError: false });

      this.setState({ decisionMakerError: false, saveError: false });

      this.setState({ decisionDateError: false, saveError: false });

      this.setState({ applyDecisionToError: false, saveError: false });
      let decisionInfo = {};
      Object.keys(values).forEach(function (key) {
        if (
          values[key] != undefined &&
          (values[key].length > 0 || values[key] != "")
        )
          decisionInfo[key] = values[key];
      });

      if (values.corporateId) {
        const corporateObject = this.props.corporateNodesOpt.find(
          corporate => String(corporate.value) === String(values.corporateId)
        );

        console.log("corporateObject", corporateObject);

        if (corporateObject) {
          decisionInfo["corporateId"] = corporateObject.key;
        } else {
          console.warn("No corporate found for", values.corporateId);
        }
      }

      if (values.employeesId) {
        decisionInfo["employeesId"] = formattedEmployees;
      }

      this.setState({
        errorMessages: {},
      });

      if (isEdit) {
        onUpdateDecision(decisionInfo);
        const saveDecisionMessage = "Saved successfully";
        this.setState({
          successMessage: saveDecisionMessage,
        });
        this.toggle();
      } else {
        onAddNewDecision(decisionInfo);
        const saveDecisionMessage = "Saved successfully";
        this.setState({
          successMessage: saveDecisionMessage,
        });
        this.addToggle();
      }
    }
  };

  handleSelect = (fieldName, selectedValue) => {
    if (fieldName == "decisionTypeId") {
      this.setState({
        selectedDecisionType: selectedValue,
      });
    }
  };

  handleValidDate = date => {
    const date1 = moment(new Date(date)).format("DD /MM/ Y");
    return date1;
  };

  handleMultiEmployees = (fieldName, selectedMulti) => {
    if (fieldName === "employeesId") {
      const selectedIds = selectedMulti
        ? selectedMulti.map(option => option.value)
        : [];
      this.setState({
        employeesArray: selectedMulti || [],
        employeesId: selectedIds,
      });
    }
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
      employeesArray,
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
                                            decisionDate: decision?.decisionDate
                                              ? moment
                                                  .utc(decision.decisionDate)
                                                  .local()
                                                  .format("YYYY-MM-DD")
                                              : "",
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
                                                          onClick={() =>
                                                            this.handleAlertClose(
                                                              "emptyError"
                                                            )
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
                                                              <Field
                                                                name="decisionMakerId"
                                                                as="input"
                                                                id="decisionMaker-Id"
                                                                type="text"
                                                                placeholder="Search..."
                                                                className={
                                                                  "form-control" +
                                                                  (errors.decisionMakerId &&
                                                                  touched.decisionMakerId
                                                                    ? " is-invalid"
                                                                    : "")
                                                                }
                                                                value={
                                                                  decisionMakers.find(
                                                                    decisionMaker =>
                                                                      decisionMaker.key ===
                                                                      this.state
                                                                        .selectedDecisionMaker
                                                                  )?.value || ""
                                                                }
                                                                onChange={e => {
                                                                  const newValue =
                                                                    e.target
                                                                      .value;

                                                                  const selectedMaker =
                                                                    decisionMakers.find(
                                                                      decisionMaker =>
                                                                        decisionMaker.value ===
                                                                        newValue
                                                                    );

                                                                  if (
                                                                    selectedMaker
                                                                  ) {
                                                                    this.setState(
                                                                      {
                                                                        selectedDecisionMaker:
                                                                          selectedMaker.key,
                                                                        decisionMakerName:
                                                                          selectedMaker.value,
                                                                      }
                                                                    );
                                                                  } else {
                                                                    this.setState(
                                                                      {
                                                                        selectedDecisionMaker:
                                                                          null,
                                                                        decisionMakerName:
                                                                          newValue,
                                                                      }
                                                                    );
                                                                  }
                                                                }}
                                                                list="decisionMakerList"
                                                                autoComplete="off"
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
                                                            {/* <div className="mb-3">
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
                                                                  <Field
                                                                    name="employeesId"
                                                                    as="input"
                                                                    id="employee-Id"
                                                                    type="text"
                                                                    placeholder="Search..."
                                                                    className={
                                                                      "form-control" +
                                                                      (errors.employeesId &&
                                                                      touched.employeesId
                                                                        ? " is-invalid"
                                                                        : "")
                                                                    }
                                                                    value={
                                                                      employeesNames.find(
                                                                        empl =>
                                                                          empl.key ===
                                                                          this
                                                                            .state
                                                                            .selectedEmployeeName
                                                                      )
                                                                        ?.value ||
                                                                      ""
                                                                    }
                                                                    onChange={e => {
                                                                      const newValue =
                                                                        e.target
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
                                                                            selectedEmployeeName:
                                                                              selectedEmployee.key,
                                                                            employeeName:
                                                                              selectedEmployee.value,
                                                                          }
                                                                        );
                                                                      } else {
                                                                        this.setState(
                                                                          {
                                                                            selectedEmployeeName:
                                                                              null,
                                                                            employeeName:
                                                                              newValue,
                                                                          }
                                                                        );
                                                                      }
                                                                    }}
                                                                    list="employeeNameDatalist"
                                                                    autoComplete="off"
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
                                                            </div> */}
                                                            <div className="mb-3">
                                                              <Row>
                                                                <Col className="col-4">
                                                                  <Label for="employee-Id">
                                                                    {this.props.t(
                                                                      "Employees"
                                                                    )}
                                                                  </Label>
                                                                </Col>

                                                                <Col className="col-8">
                                                                  <Select
                                                                    classNamePrefix="select2-selection"
                                                                    id="employee-Id"
                                                                    name="employeesId"
                                                                    key={`employeesId`}
                                                                    options={
                                                                      employeesNames
                                                                    }
                                                                    onChange={selectedOption =>
                                                                      this.handleMultiEmployees(
                                                                        "employeesId",
                                                                        selectedOption
                                                                      )
                                                                    }
                                                                    isMulti
                                                                    value={
                                                                      employeesArray
                                                                    }
                                                                  />
                                                                </Col>
                                                              </Row>{" "}
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
                                                                  <Field
                                                                    name="corporateId"
                                                                    as="input"
                                                                    id="corporate-Id"
                                                                    type="text"
                                                                    placeholder="Search..."
                                                                    className={
                                                                      "form-control" +
                                                                      (errors.corporateId &&
                                                                      touched.corporateId
                                                                        ? " is-invalid"
                                                                        : "")
                                                                    }
                                                                    value={
                                                                      corporateNodesOpt.find(
                                                                        corporate =>
                                                                          corporate.key ===
                                                                          this
                                                                            .state
                                                                            .selectedCorporateNode
                                                                      )
                                                                        ?.value ||
                                                                      ""
                                                                    }
                                                                    onChange={e => {
                                                                      const newValue =
                                                                        e.target
                                                                          .value;

                                                                      const selectedCorporate =
                                                                        corporateNodesOpt.find(
                                                                          corporate =>
                                                                            corporate.value ===
                                                                            newValue
                                                                        );

                                                                      if (
                                                                        selectedCorporate
                                                                      ) {
                                                                        this.setState(
                                                                          {
                                                                            selectedCorporateNode:
                                                                              selectedCorporate.key,
                                                                            corporateNodeName:
                                                                              selectedCorporate.value,
                                                                          }
                                                                        );
                                                                      } else {
                                                                        this.setState(
                                                                          {
                                                                            selectedCorporateNode:
                                                                              null,
                                                                            corporateNodeName:
                                                                              newValue,
                                                                          }
                                                                        );
                                                                      }
                                                                    }}
                                                                    list="corporatesList"
                                                                    autoComplete="off"
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
                                                                  decisionDateError
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
                                            turnUser: this.state.loginUser,
                                            turnNotes:
                                              (decision &&
                                                decision.turnNotes) ||
                                              "",
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
                                            decisionMakerId: Yup.string()
                                              .matches(/^[\u0600-\u06FF\s]+$/)
                                              .required(
                                                "Decision Maker Is Required"
                                              ),
                                            applyDecisionToId:
                                              Yup.string().required(
                                                "Apply The Decision To Is Required"
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
                                                            onClick={() =>
                                                              this.handleAlertClose(
                                                                "duplicateError"
                                                              )
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
                                                              <Field
                                                                name="decisionMakerId"
                                                                as="input"
                                                                id="decisionMaker-Id"
                                                                type="text"
                                                                placeholder="Search..."
                                                                className={
                                                                  "form-control" +
                                                                  ((errors.decisionMakerId &&
                                                                    touched.decisionMakerId) ||
                                                                  decisionMakerError
                                                                    ? " is-invalid"
                                                                    : "")
                                                                }
                                                                value={
                                                                  decisionMakers.find(
                                                                    decisionMaker =>
                                                                      decisionMaker.key ===
                                                                      this.state
                                                                        .selectedDecisionMaker
                                                                  )?.value || ""
                                                                }
                                                                onChange={e => {
                                                                  const newValue =
                                                                    e.target
                                                                      .value;

                                                                  const selectedMaker =
                                                                    decisionMakers.find(
                                                                      decisionMaker =>
                                                                        decisionMaker.value ===
                                                                        newValue
                                                                    );

                                                                  if (
                                                                    selectedMaker
                                                                  ) {
                                                                    this.setState(
                                                                      {
                                                                        selectedDecisionMaker:
                                                                          selectedMaker.key,
                                                                        decisionMakerName:
                                                                          selectedMaker.value,
                                                                      }
                                                                    );
                                                                  } else {
                                                                    this.setState(
                                                                      {
                                                                        selectedDecisionMaker:
                                                                          null,
                                                                        decisionMakerName:
                                                                          newValue,
                                                                      }
                                                                    );
                                                                  }
                                                                }}
                                                                list="decisionMakerList"
                                                                autoComplete="off"
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
                                                            {/* if you want datalist instead of multi select */}

                                                            {/* <div className="mb-3">
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
                                                                  <Field
                                                                    name="employeesId"
                                                                    as="input"
                                                                    id="employee-Id"
                                                                    type="text"
                                                                    placeholder="Search..."
                                                                    className={
                                                                      "form-control" +
                                                                      (errors.employeesId &&
                                                                      touched.employeesId
                                                                        ? " is-invalid"
                                                                        : "")
                                                                    }
                                                                    value={
                                                                      employeesNames.find(
                                                                        empl =>
                                                                          empl.key ===
                                                                          this
                                                                            .state
                                                                            .selectedEmployeeName
                                                                      )
                                                                        ?.value ||
                                                                      ""
                                                                    }
                                                                    onChange={e => {
                                                                      const newValue =
                                                                        e.target
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
                                                                            selectedEmployeeName:
                                                                              selectedEmployee.key,
                                                                            employeeName:
                                                                              selectedEmployee.value,
                                                                          }
                                                                        );
                                                                      } else {
                                                                        this.setState(
                                                                          {
                                                                            selectedEmployeeName:
                                                                              null,
                                                                            employeeName:
                                                                              newValue,
                                                                          }
                                                                        );
                                                                      }
                                                                    }}
                                                                    list="employeeNameDatalist"
                                                                    autoComplete="off"
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
                                                            </div> */}
                                                            <div className="mb-3">
                                                              <Row>
                                                                <Col className="col-4">
                                                                  <Label for="employee-Id">
                                                                    {this.props.t(
                                                                      "Employees"
                                                                    )}
                                                                  </Label>
                                                                </Col>

                                                                <Col className="col-8">
                                                                  <Select
                                                                    classNamePrefix="select2-selection"
                                                                    id="employee-Id"
                                                                    name="employeesId"
                                                                    key={`employeesId`}
                                                                    options={
                                                                      employeesNames
                                                                    }
                                                                    onChange={selectedOption =>
                                                                      this.handleMultiEmployees(
                                                                        "employeesId",
                                                                        selectedOption
                                                                      )
                                                                    }
                                                                    isMulti
                                                                    value={
                                                                      employeesArray
                                                                    }
                                                                  />
                                                                </Col>
                                                              </Row>{" "}
                                                            </div>
                                                          </FormGroup>
                                                        )}
                                                        {showDepartment && (
                                                          <FormGroup>
                                                            <div className="mb-3">
                                                              <Row>
                                                                <Col lg="4">
                                                                  <Label
                                                                    for="corporate-Id"
                                                                    className="form-label d-flex"
                                                                  >
                                                                    {this.props.t(
                                                                      "Corporate"
                                                                    )}
                                                                  </Label>
                                                                </Col>
                                                                <Col lg="8">
                                                                  <Field
                                                                    name="corporateId"
                                                                    as="input"
                                                                    id="corporate-Id"
                                                                    type="text"
                                                                    placeholder="Search..."
                                                                    className={
                                                                      "form-control" +
                                                                      (errors.corporateId &&
                                                                      touched.corporateId
                                                                        ? " is-invalid"
                                                                        : "")
                                                                    }
                                                                    value={
                                                                      corporateNodesOpt.find(
                                                                        corporate =>
                                                                          corporate.key ===
                                                                          this
                                                                            .state
                                                                            .selectedCorporateNode
                                                                      )
                                                                        ?.value ||
                                                                      ""
                                                                    }
                                                                    onChange={e => {
                                                                      const newValue =
                                                                        e.target
                                                                          .value;

                                                                      const selectedCorporate =
                                                                        corporateNodesOpt.find(
                                                                          corporate =>
                                                                            corporate.value ===
                                                                            newValue
                                                                        );

                                                                      if (
                                                                        selectedCorporate
                                                                      ) {
                                                                        this.setState(
                                                                          {
                                                                            selectedCorporateNode:
                                                                              selectedCorporate.key,
                                                                            corporateNodeName:
                                                                              selectedCorporate.value,
                                                                          }
                                                                        );
                                                                      } else {
                                                                        this.setState(
                                                                          {
                                                                            selectedCorporateNode:
                                                                              null,
                                                                            corporateNodeName:
                                                                              newValue,
                                                                          }
                                                                        );
                                                                      }
                                                                    }}
                                                                    list="corporatesList"
                                                                    autoComplete="off"
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
                                                                  decisionDateError
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
                                                    {selectedDecisionStatus ===
                                                      2 && (
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
                                                    )}
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
