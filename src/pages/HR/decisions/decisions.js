import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import Select from "react-select";
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
      selectedFullName: "",
      selectedDecisionType: "",
      selectedCorporateNode: "",
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
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  componentDidMount() {
    const {
      decisions,
      decisionsTypes,
      onGetDecisions,
      onGetDecisionMakers,
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

    this.setState({
      decisions,
      decisionMakers,
      employeesNames,
      corporateNodesOpt,
      decisionsTypes,
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
      selectedCorporateNode: arg.CorporateId,
      selectedFullName: arg.fullNameId,
      selectedDecisionType: arg.decisionTypeId,
      isEdit: true,
    });
    this.toggle();
  };

  handleDeleteRow = () => {
    const { onDeleteDecision } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteDecision(selectedRowId);

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
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
        decisionMaker => decisionMaker.value === selectedValue
      );

      this.setState({
        selectedDecisionMaker: selected ? selected.key : null,
      });
      return;
    }

    if (fieldName === "fullNameId") {
      const selected = this.state.employeesNames.find(
        employeeName => employeeName.value === selectedValue
      );

      this.setState({
        selectedFullName: selected ? selected.key : null,
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
      isEdit,
      isAdd,
      selectedFullName,
      selectedDecisionMaker,
      selectedApplyDecisionTo,
      selectedCorporateNode,
      selectedDecisionType,
      fullNamesOpt,
    } = this.state;
    const { onAddNewDecision, onUpdateDecision } = this.props;

    values["decisionMakerId"] = selectedDecisionMaker;
    values["applyDecisionToId"] = selectedApplyDecisionTo;
    values["corporateId"] = selectedCorporateNode;
    values["fullNameId"] = selectedFullName;
    values["decisionTypeId"] = selectedDecisionType;
    console.log("valuesssssssssssssssssssss", values);

    let decisionInfo = {};
    // if (values.fullNameId) {
    //   const nameObject = fullNamesOpt.find(
    //     fullName => fullName.value === values.fullNameId
    //   );
    //   console.log("nameObject", nameObject);
    //   values["fullNameId"] = nameObject.key;
    // }
    // console.log("valuesssssssssssssssssssss", values);
    if (
      values.decisionNumber &&
      values.decisionDate &&
      values.decisionReason &&
      selectedDecisionMaker !== null &&
      selectedApplyDecisionTo !== null &&
      selectedDecisionType !== null
    ) {
      console.log("selectedFullName", selectedFullName);
      Object.keys(values).forEach(function (key) {
        if (
          values[key] != undefined &&
          (values[key].length > 0 || values[key] != "")
        )
          console.log("9999999", decisionInfo);
        decisionInfo[key] = values[key];
      });
      if (isEdit) {
        console.log("9999999", contractInfo);
        // onUpdateDecision(contractInfo);
        this.toggle();
      } else {
        // onAddNewDecision(contractInfo);
        this.addToggle();
      }
      this.setState({
        errorMessages: {},
      });
    } else {
      let emptyError = "";

      if (selectedCorporateNode === undefined) {
        emptyError = "Fill the empty select";
      }
      this.setState({ emptyError: emptyError });
    }
  };
  handleSelect = (fieldName, selectedValue) => {
    if (fieldName == "decisionTypeId") {
      this.setState({
        selectedDecisionType: selectedValue,
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
      t,
      deleted,
    } = this.props;
    const {
      isEdit,
      duplicateError,
      deleteModal,
      selectedDecisionMaker,
      selectedApplyDecisionTo,
      selectedFullName,
      selectedCorporateNode,
      selectedDecisionType,
      showAlert,
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
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "decisionDate",
        text: this.props.t("Decision Date"),
        sort: true,
        editable: false,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },

      {
        dataField: "decisionTypeId",
        text: this.props.t("Decision Type"),
        sort: true,
        editable: false,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },

      {
        dataField: "decisionMakerId",
        text: this.props.t("Decision Maker"),
        sort: true,
        editable: false,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },

      {
        dataField: "isApprove",
        text: this.props.t("Is Approve"),
        sort: true,
        editable: false,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },

      {
        dataField: "approvalDate",
        text: this.props.t("Approval Date"),
        sort: true,
        editable: false,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "fullNameId",
        text: this.props.t("All Employees"),
        sort: true,
        editable: false,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "isExecute",
        text: this.props.t("Is Execute"),
        sort: true,
        editable: false,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "executeDate",
        text: this.props.t("Execute Date"),
        sort: true,
        editable: false,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "decisionStatus",
        text: this.props.t("Decision Status"),
        sort: true,
        editable: false,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        // }),
      },
      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        //  hidden: !showDeleteButton,
        formatter: (cellContent, decision) => (
          <Tooltip title={this.props.t("Delete")} placement="top">
            <Link className="text-danger" to="#">
              <i
                className="mdi mdi-delete font-size-18"
                id="deletetooltip"
                onClick={() => this.onClickDelete(decision)}
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
                                  // filter={filterFactory()}
                                  cellEdit={cellEditFactory({
                                    mode: "click",
                                    blurToSave: true,
                                    afterSaveCell: (
                                      oldValue,
                                      newValue,
                                      row,
                                      column
                                    ) => {
                                      this.handleEmployeeDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    },
                                  })}
                                  noDataIndication={this.props.t(
                                    "No Decisions found"
                                  )}
                                  responsive
                                  filter={filterFactory()}
                                  defaultSorted={defaultSorting}
                                />
                                <Modal
                                  isOpen={this.state.addModal}
                                  toggle={this.addToggle}
                                  fullscreen
                                >
                                  <ModalHeader toggle={this.addToggle} tag="h3">
                                    {!!isEdit
                                      ? t("Edit Decision")
                                      : t("Add Decision")}
                                  </ModalHeader>
                                  <ModalBody>
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
                                    </div>
                                    <Row>
                                      <Col>
                                        <Formik
                                          enableReinitialize
                                          initialValues={{
                                            decisionNumber:
                                              (decision &&
                                                decision.decisionNumber) ||
                                              "",
                                            decisionDate:
                                              this.state.decision
                                                ?.decisionDate || "",
                                            decisionMakerId:
                                              this.state.decision
                                                ?.decisionMakerId ||
                                              selectedDecisionMaker,
                                            applyDecisionToId:
                                              this.state.decision
                                                ?.applyDecisionToId || "",
                                            fullNameId:
                                              this.state.decision?.fullNameId ||
                                              selectedFullName,
                                            corporateId:
                                              this.state.decision
                                                ?.corporateId ||
                                              selectedCorporateNode,
                                            decisionReason:
                                              this.state.decision
                                                ?.decisionReason || "",
                                            decisionTypeId:
                                              this.state.decision
                                                ?.decisionTypeId ||
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
                                            decisionMaker:
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
                                                                  <input
                                                                    className={`form-control ${this.state.inputClass}`}
                                                                    list="fullNames"
                                                                    name="fullNameId"
                                                                    id="fullName-Id"
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
                                                                  <datalist id="fullNames">
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
                                  isOpen={this.state.modal}
                                  toggle={this.t7oggle}
                                  fullscreen
                                >
                                  <ModalHeader toggle={this.toggle} tag="h3">
                                    {!!isEdit
                                      ? t("Edit Decision")
                                      : t("Add Decision")}
                                  </ModalHeader>
                                  <ModalBody>
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
                                    </div>
                                    <Row>
                                      <Col>
                                        <Formik
                                          enableReinitialize
                                          initialValues={
                                            isEdit && {
                                              Id: this.state.decision.Id,
                                              decisionNumber:
                                                this.state.decision
                                                  .decisionNumber || "",
                                              decisionDate:
                                                this.state.decision
                                                  .decisionDate || "",
                                              decisionMakerId:
                                                this.state.decision
                                                  .decisionMakerId ||
                                                selectedDecisionMaker,
                                              applyDecisionToId:
                                                this.state.decision
                                                  .applyDecisionToId || "",
                                              fullNameId:
                                                this.state.decision
                                                  .fullNameId ||
                                                selectedFullName,
                                              corporateId:
                                                this.state.decision
                                                  .corporateId ||
                                                selectedCorporateNode,
                                              decisionReason:
                                                this.state.decision
                                                  .decisionReason || "",
                                              decisionTypeId:
                                                this.state.decision
                                                  ?.decisionTypeId ||
                                                selectedDecisionType,
                                            }
                                          }
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
                                              this.state.decision
                                                ?.decisionTypeId ||
                                              selectedDecisionType,
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
                                            <Form onSubmit={handleSubmit}>
                                              <div className="bordered">
                                                <Card>
                                                  <CardTitle id="card_header">
                                                    {t("Decision Information")}
                                                  </CardTitle>
                                                  <CardBody className="cardBody">
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
                                                                value={
                                                                  values.decisionMakerId
                                                                }
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
                                                                  <input
                                                                    className={`form-control ${this.state.inputClass}`}
                                                                    list="fullNames"
                                                                    name="fullNameId"
                                                                    id="fullName-Id"
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
                                                                  <datalist id="fullNames">
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
                                                    {t("Decision Information")}
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
                                                                  newValue.value,
                                                                  values
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(DecisionsList)));
