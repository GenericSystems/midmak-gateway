import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import classnames from "classnames";
import Tooltip from "@mui/material/Tooltip";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  Label,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Alert,
  Input,
} from "reactstrap";
import Select from "react-select";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import cellEditFactory from "react-bootstrap-table2-editor";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";

import BootstrapTable from "react-bootstrap-table-next";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";
import {
  getDistributingCoursesMethods,
  addNewDistributingCoursesMethod,
  updateDistributingCoursesMethod,
  deleteDistributingCoursesMethod,
  getDistributingCoursesMethodsContents,
  addNewDistributingCoursesMethodContent,
  updateDistributingCoursesMethodContent,
  deleteDistributingCoursesMethodContent,
  copyDistributingMethods,
} from "store/distributing-courses-methods/actions";
import AddIcon from "@mui/icons-material/Add";

import { IconButton } from "@mui/material";
import { isEmpty, size, map } from "lodash";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../utils/menuUtils";
class DistributingCoursesMethods extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      activeTab1: "5",
      activeTab: "0",
      activeTab2: "0",
      mainTab: "5",
      distributingCoursesMethod: "",
      modal: false,
      deleteModal: false,
      deleteModal2: false,
      arTitleSaveError: false,
      EnTitleSaveError: false,
      candidatingPercentageEmpty: false,
      examPrecentageEmpty: false,
      duplicateError: null,

      duplicateErrorEditMode: null,
      selectedCoursesContent: null,
      selectedRowId: null,
      showButtons: false,
      inputFocused: false,
      selectedCoursValue: "",
      selectedCoursId: "",
      deleteModal3: false,
      selectedCourse: "",
      totalPercentage: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
    };

    this.handleDistributingCoursesMethodEditForm =
      this.handleDistributingCoursesMethodEditForm.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleAddDistributingMethodForm =
      this.handleAddDistributingMethodForm.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  componentDidMount() {
    const {
      distributingCoursesMethods,
      onGetDistributingCoursesMethods,
      distributingCoursesMethodsContents,
      gradeTypes,
      user_menu,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (distributingCoursesMethods && !distributingCoursesMethods.length) {
      onGetDistributingCoursesMethods();
    }
    this.setState({ distributingCoursesMethods });
    this.setState({ distributingCoursesMethodsContents });
    this.setState({ gradeTypes });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
      selectedCoursValue: "",
      selectedCoursId: null,
    }));
  }

  handleAddDistributingMethodForm = () => {
    this.setState({
      distributingCoursesMethod: "",
      isEdit: false,
      activeTab1: "5",
    });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { distributingCoursesMethods, distributingCoursesMethodsContents } =
      this.props;
    if (
      !isEmpty(distributingCoursesMethods) &&
      size(prevProps.distributingCoursesMethods) !==
        size(distributingCoursesMethods)
    ) {
      this.setState({ distributingCoursesMethods: {}, isEdit: false });
    }
    if (
      prevProps.distributingCoursesMethodsContents !==
      distributingCoursesMethodsContents
    ) {
      const totalPercentage = this.calculateTotalPrecentage();

      this.setState({ totalPercentage });
    }
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

  updateShowDeleteButton = (menu, pathname) => {
    const showDeleteButton = checkIsDeleteForPage(menu, pathname);
    this.setState({ showDeleteButton });
  };

  updateShowAddButton = (menu, pathname) => {
    const showAddButton = checkIsAddForPage(menu, pathname);
    this.setState({ showAddButton });
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

  /* Insert,Update Delete data */

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };
  toggleDeleteModal2 = () => {
    this.setState(prevState => ({
      deleteModal2: !prevState.deleteModal2,
    }));
  };
  toggleDeleteModal3 = () => {
    this.setState(prevState => ({
      deleteModal3: !prevState.deleteModal3,
    }));
  };

  onClickDelete = distributingCoursesMethod => {
    this.setState({ distributingCoursesMethod: distributingCoursesMethod });
    this.setState({ deleteModal: true });
  };

  handleDeleteDistributingCoursesMethod = () => {
    const { onDeleteDistributingCoursesMethod } = this.props;
    const { distributingCoursesMethod } = this.state;

    if (distributingCoursesMethod.Id !== undefined) {
      let onDelete = { Id: distributingCoursesMethod.Id };
      onDeleteDistributingCoursesMethod(onDelete);
    }
    this.setState({ deleteModal: false });
  };

  handleDistributingCoursesMethodEditForm = arg => {
    const distributingCoursesMethod = arg;

    this.setState({
      distributingCoursesMethod: {
        Id: distributingCoursesMethod.Id,
        arTitle: distributingCoursesMethod.arTitle,
        enTitle: distributingCoursesMethod.enTitle,
        candidatingPercentage: distributingCoursesMethod.candidatingPercentage,
        examPrecentage: distributingCoursesMethod.examPrecentage,
        quarterlyTotal: distributingCoursesMethod.quarterlyTotal,
        finalTotal: distributingCoursesMethod.finalTotal,
      },
      isEdit: true,
    });

    const {
      onGetDistributingCoursesMethods,
      onGetDistributingCoursesMethodsContents,
      distributingCoursesMethods,
    } = this.props;

    if (distributingCoursesMethod && !distributingCoursesMethod.length) {
      onGetDistributingCoursesMethodsContents(distributingCoursesMethod);
    }

    this.toggle();
  };

  toggleMainTab(tab) {
    if (this.state.activeTab1 !== tab) {
      this.setState({
        activeTab1: tab,
        selectedCoursValue: "",
      });
    }
  }

  handleSave = values => {
    const { isEdit, distributingCoursesMethod } = this.state;
    const {
      onAddNewDistributingCoursesMethod,
      onUpdateDistributingCoursesMethod,
      distributingCoursesMethods,
    } = this.props;

    const variables = {
      arTitle: values.arTitle,
      enTitle: values.enTitle,
      candidatingPercentage: parseInt(values.candidatingPercentage),
      examPrecentage: parseInt(values.examPrecentage),
      quarterlyTotal: parseInt(values.quarterlyTotal) || 0,
      finalTotal: parseInt(values.finalTotal) || 0,
    };

    if (variables.arTitle.trim() === "") {
      this.setState({ arTitleSaveError: true });
    }
    if (variables.enTitle.trim() === "") {
      this.setState({ EnTitleSaveError: true });
    }
    if (isNaN(variables.candidatingPercentage)) {
      this.setState({ candidatingPercentageEmpty: true });
    }
    if (isNaN(variables.examPrecentage)) {
      this.setState({ examPrecentageEmpty: true });
    } else {
      if (isEdit) {
        const duplicate = "";
        /* distributingCoursesMethods.find(
          method =>
            method.arTitle === variables.arTitle && method.Id !== values.Id
        ); */

        if (duplicate) {
          const errorMessage = this.props.t("Value already exists");
          this.setState({ duplicateError: errorMessage });
        } else {
          this.setState({ duplicateError: null });
          variables["Id"] = values.Id;
          onUpdateDistributingCoursesMethod(variables);
        }
      } else {
        const duplicateInadd = distributingCoursesMethods.find(
          method =>
            method.arTitle === variables.arTitle && method.Id !== values.Id
        );
        if (!duplicateInadd) {
          this.setState({ duplicateError: null });
          onAddNewDistributingCoursesMethod(variables);
        } else {
          const errorMessage = this.props.t("Value already exists");
          this.setState({ duplicateError: errorMessage });
        }
      }
      this.toggle();
    }
  };

  handleChangeCheckbox = (row, fieldName) => {
    const { onUpdateDistributingCoursesMethodContent } = this.props;
    const { distributingCoursesMethodContent } = this.state;
    const newStatus = row[fieldName] ? 0 : 1;
    const ob = {
      Id: row.Id,
      [fieldName]: newStatus,
    };

    onUpdateDistributingCoursesMethodContent(ob);
  };

  handleSelectChange = (rowId, fieldName, selectedValue) => {
    const { onUpdateDistributingCoursesMethodContent } = this.props;
    this.setState({
      selectedCoursesContent: selectedValue,
    });
    let onUpdate = {
      Id: rowId,
      [fieldName]: selectedValue,
      ["precentage"]: 0,
    };
    onUpdateDistributingCoursesMethodContent(onUpdate);
  };
  handleAddRow = () => {
    const {
      onAddNewDistributingCoursesMethodContent,
      distributingCoursesMethodsContents,
    } = this.props;
    const { distributingCoursesMethod } = this.state;

    const newRow = {
      precentage: 0,
      distributingMethodId: distributingCoursesMethod.Id,
    };

    const emptyRowsExist = distributingCoursesMethodsContents.some(
      distributingCoursesMethodsContent =>
        distributingCoursesMethodsContent.precentage === 0
    );

    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateErrorEditMode: errorMessage });
    } else {
      this.setState({ duplicateErrorEditMode: null });
      onAddNewDistributingCoursesMethodContent(newRow);
    }
  };

  onClickDeleteRow = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal2: true });
  };

  handleDeleteDistributingCoursesMethodContent = () => {
    const { onDeleteDistributingCoursesMethodContent } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteDistributingCoursesMethodContent(selectedRowId);

      this.setState({ selectedRowId: null, deleteModal2: false });
    }
  };

  calculateTotalPrecentage = () => {
    const { distributingCoursesMethodsContents } = this.props;
  };

  handledistributingCoursesMethodsContentsDataChange = (
    rowId,
    fieldName,
    fieldValue,
    oldValue
  ) => {
    const {
      onUpdateDistributingCoursesMethodContent,
      distributingCoursesMethodsContents,
    } = this.props;
    const result = distributingCoursesMethodsContents.reduce(
      (acc, item) => acc + parseInt(item.precentage, 10),
      0
    );

    if (100 < result) {
      const errorMessage = this.props.t("Value is not Valid");
      this.setState({ duplicateErrorEditMode: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: oldValue };
      onUpdateDistributingCoursesMethodContent(onUpdate);
    } else {
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateDistributingCoursesMethodContent(onUpdate);
    }
  };

  handleInputBlur = () => {
    setTimeout(() => {
      this.setState({ showButtons: false });
    }, 200);
  };

  handleInputFocus = () => {
    this.setState({ showButtons: true });
  };

  handleClearInput = () => {
    this.setState({
      selectedCoursId: "",
      selectedCourse: "",
      inputFocused: false,
    });
  };

  copyDistMethods = () => {
    const { onCopyDistributingMethods } = this.props;
    onCopyDistributingMethods();
  };

  handleAddToTable = inputValue => {
    const { onAddNewDistributingCourse, distributingCourses } = this.props;
    const { selectedCoursId, distributingCoursesMethod } = this.state;
    if (selectedCoursId == null || selectedCoursId === "") {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateErrorEditMode: errorMessage });
    } else {
      this.setState({ duplicateErrorEditMode: null });
      const newRow = {
        courseId: selectedCoursId,
        distributingMethodId: distributingCoursesMethod.Id,
      };

      const isDuplicate = distributingCourses.some(row => {
        return (
          row.courseId === newRow.courseId &&
          row.distributingMethodId === newRow.distributingMethodId
        );
      });

      if (isDuplicate) {
        const errorMessage = this.props.t("Value already exists");
        this.setState({ duplicateErrorEditMode: errorMessage });
        this.setState({ selectedCoursId: "" });
      } else {
        onAddNewDistributingCourse(newRow);
      }
      this.setState({ selectedCoursId: "", selectedCourse: "" });
    }
  };

  onClickDeleteCourse = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal3: true });
  };
  handleDeleteDistributingCourse = () => {
    const { onDeleteDistributingCourse } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteDistributingCourse(selectedRowId);
      this.setState({ selectedRowId: null, deleteModal3: false });
    }
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleAlertCloseEditMode = () => {
    this.setState({ duplicateErrorEditMode: null });
  };

  render() {
    //meta title
    document.title =
      "DistributingCoursesMethod List | keyInHands - React Admin & Dashboard Template";

    const { SearchBar } = Search;
    const { t } = this.props;
    const {
      distributingCoursesMethods,
      gradeTypes,
      distributingCourses,
      distributingCoursesMethodsContents,
      onGetDistributingCoursesMethods,
    } = this.props;
    const {
      distributingCoursesMethod,
      showButtons,
      selectedCoursId,
      selectedCourse,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
    } = this.state;

    const {
      isEdit,
      deleteModal,
      deleteModal2,
      deleteModal3,
      arTitleSaveError,
      EnTitleSaveError,
      candidatingPercentageEmpty,
      examPrecentageEmpty,
      duplicateError,
      duplicateErrorEditMode,
      selectedCoursValue,
    } = this.state;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: distributingCoursesMethods.length,
      custom: true,
    };
    const defaultSorted = [
      {
        dataField: "Id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    const distributingCoursesMethodListColumns = [
      {
        text: "id",
        dataField: "Id",
        sort: true,
        hidden: true,
        formatter: (cellContent, distributingCoursesMethods) => (
          <>{distributingCoursesMethods.Id}</>
        ),
        sort: true,
      },
      {
        text: t("Distribution types(Ar)"),
        dataField: "arTitle",
        sort: true,
        formatter: (cellContent, distributingCoursesMethods) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {distributingCoursesMethods.arTitle}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },
      {
        text: t("Distribution types"),
        dataField: "enTitle",
        sort: true,
        formatter: (cellContent, distributingCoursesMethods) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {distributingCoursesMethods.enTitle}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },
      {
        text: t("Candidating Percentage"),
        dataField: "candidatingPercentage",
        sort: true,
        formatter: (cellContent, distributingCoursesMethods) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {distributingCoursesMethods.candidatingPercentage}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },
      {
        text: t("exam Precentage"),
        dataField: "examPrecentage",
        sort: true,
        formatter: (cellContent, distributingCoursesMethods) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {distributingCoursesMethods.examPrecentage}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },
      {
        text: t("quarterly Total"),
        dataField: "quarterlyTotal",
        sort: true,
        formatter: (cellContent, distributingCoursesMethods) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {distributingCoursesMethods.quarterlyTotal}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },

      {
        text: t("final Total grade"),
        dataField: "finalTotal",
        sort: true,
        formatter: (cellContent, distributingCoursesMethods) => (
          <>
            <h5 className="font-size-14 mb-1">
              <Link to="#" className="text-dark">
                {distributingCoursesMethods.finalTotal}
              </Link>
            </h5>
          </>
        ),
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },

      {
        dataField: "menu",
        isDummyField: true,
        editable: false,
        text: "",
        formatter: (cellContent, distributingCoursesMethod) => (
          <div className="d-flex gap-3">
            {showEditButton && (
              <Link className="text-secondary" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={() =>
                    this.handleDistributingCoursesMethodEditForm(
                      distributingCoursesMethod
                    )
                  }
                ></i>
              </Link>
            )}
            {showDeleteButton && (
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(distributingCoursesMethod)}
                ></i>
              </Link>
            )}
          </div>
        ),
      },
    ];
    const columns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
      {
        dataField: "distributingMethodId",
        text: t("distributing MethodId"),
        hidden: true,
      },
      {
        dataField: "courseContentId",
        text: t("Grade Type (Ar)"),
        formatter: (cell, row) => (
          <div>
            {showEditButton && (
              <Select
                key={`ExamAr_select`}
                options={gradeTypes.filter(
                  option =>
                    !distributingCoursesMethodsContents.some(
                      row => row.courseContentId === option.value
                    )
                )}
                onChange={newValue => {
                  this.handleSelectChange(
                    row.Id,
                    "courseContentId",
                    newValue.value
                  );
                }}
                defaultValue={gradeTypes.find(
                  opt => opt.value == row.courseContentId
                )}
              />
            )}
          </div>
        ),
        editable: false,
      },
      {
        dataField: "precentage",
        text: t("Precentage"),
        sort: true,
        editable: showEditButton,
      },
      {
        dataField: "isFinal",
        text: t("is Final"),
        sort: true,
        editable: false,
        formatter: (cellContent, row, column) => (
          <Input
            type="checkbox"
            name="isFinal"
            className={`form-check-input input-mini warning}`}
            id="attestationButton"
            defaultChecked={cellContent == 1}
            onChange={event => this.handleChangeCheckbox(row, "isFinal")}
            disabled={!showEditButton}
          />
        ),
      },
      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        hidden: !showDeleteButton,
        formatter: (cellContent, distributingCoursesMethodContent) => (
          <Link className="text-danger" to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() =>
                this.onClickDeleteRow(distributingCoursesMethodContent)
              }
            ></i>
          </Link>
        ),
      },
    ];

    const selectRow = {
      mode: "checkbox",
    };
    const addButtonStyle = {
      backgroundColor: "#75dfd1",
      color: "#ffffff",
      textAlign: "left",
    };

    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteDistributingCoursesMethod}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <DeleteModal
          show={deleteModal2}
          onDeleteClick={this.handleDeleteDistributingCoursesMethodContent}
          onCloseClick={() =>
            this.setState({ deleteModal2: false, selectedRowId: null })
          }
        />

        <DeleteModal
          show={deleteModal3}
          onDeleteClick={this.handleDeleteDistributingCourse}
          onCloseClick={() =>
            this.setState({ deleteModal2: false, selectedRowId: null })
          }
        />

        <div className="page-content">
          <Container fluid>
            <Breadcrumbs
              title={t("Distributing Courses Methods")}
              breadcrumbItem={t("Distributing Courses Methods List")}
            />
            <Row>
              <Col lg="12">
                <Card>
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
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="Id"
                      columns={distributingCoursesMethodListColumns}
                      data={distributingCoursesMethods}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="Id"
                          columns={distributingCoursesMethodListColumns}
                          data={distributingCoursesMethods}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="4"></Col>
                                <Col sm="8">
                                  <div className="text-sm-end d-none">
                                    <Tooltip
                                      title={this.props.t("Copy")}
                                      placement="top"
                                    >
                                      <IconButton
                                        color="primary"
                                        onClick={this.copyDistMethods}
                                      >
                                        <i className="mdi mdi-content-copy blue-noti-icon" />
                                      </IconButton>
                                    </Tooltip>
                                    {showAddButton && (
                                      <Tooltip
                                        title={this.props.t(
                                          "Create Distributing Method"
                                        )}
                                        placement="top"
                                      >
                                        <IconButton
                                          color="primary"
                                          onClick={
                                            this.handleAddDistributingMethodForm
                                          }
                                        >
                                          <i className="mdi mdi-plus-circle blue-noti-icon" />
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      //selectRow={selectRow}

                                      defaultSorted={defaultSorted}
                                      classes={
                                        "table align-middle table-nowrap table-hover"
                                      }
                                      bordered={false}
                                      striped={false}
                                      responsive
                                      ref={this.node}
                                      filter={filterFactory()}
                                      filterPosition="top"
                                    />
                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.toggle}
                                        tag="h4"
                                      >
                                        {!!isEdit
                                          ? t("Distributing Method")
                                          : t("Add Distributing Method")}
                                      </ModalHeader>
                                      {isEdit && (
                                        <Col md="12">
                                          <div>
                                            {duplicateErrorEditMode && (
                                              <Alert
                                                color="danger"
                                                className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                role="alert"
                                              >
                                                {duplicateErrorEditMode}
                                                <button
                                                  type="button"
                                                  className="btn-close"
                                                  aria-label="Close"
                                                  onClick={
                                                    this
                                                      .handleAlertCloseEditMode
                                                  }
                                                ></button>
                                              </Alert>
                                            )}
                                          </div>
                                          <Nav
                                            pills
                                            className="navtab-bg nav-justified"
                                          >
                                            <NavItem>
                                              <NavLink
                                                id="vertical-home-link"
                                                style={{ cursor: "pointer" }}
                                                className={classnames({
                                                  active:
                                                    this.state.activeTab1 ===
                                                    "5",
                                                })}
                                                onClick={() => {
                                                  this.toggleMainTab("5");
                                                }}
                                              >
                                                {this.props.t(
                                                  "Edit Distributing Method"
                                                )}
                                              </NavLink>
                                            </NavItem>
                                          </Nav>
                                        </Col>
                                      )}
                                      <ModalBody>
                                        <TabContent
                                          activeTab={this.state.activeTab1}
                                          className="p-3 text-muted"
                                          id="verticalTabContent"
                                        >
                                          <TabPane tabId="5">
                                            <Formik
                                              enableReinitialize={true}
                                              initialValues={{
                                                Id: distributingCoursesMethod.Id,
                                                arTitle:
                                                  (distributingCoursesMethod &&
                                                    distributingCoursesMethod.arTitle) ||
                                                  "",
                                                enTitle:
                                                  (distributingCoursesMethod &&
                                                    distributingCoursesMethod.enTitle) ||
                                                  "",
                                                candidatingPercentage:
                                                  (distributingCoursesMethod &&
                                                    distributingCoursesMethod.candidatingPercentage) ||
                                                  "",
                                                examPrecentage:
                                                  (distributingCoursesMethod &&
                                                    distributingCoursesMethod.examPrecentage) ||
                                                  "",
                                                quarterlyTotal:
                                                  (distributingCoursesMethod &&
                                                    distributingCoursesMethod.quarterlyTotal) ||
                                                  "",
                                                finalTotal:
                                                  (distributingCoursesMethod &&
                                                    distributingCoursesMethod.finalTotal) ||
                                                  "",
                                              }}
                                              validationSchema={Yup.object().shape(
                                                {
                                                  arTitle: Yup.string()
                                                    .trim()
                                                    .required(
                                                      "Please Enter Your Distribution types arabic"
                                                    ),
                                                  enTitle: Yup.string()
                                                    .trim()
                                                    .required(
                                                      "Distribution types(En) is required"
                                                    ),
                                                  candidatingPercentage:
                                                    Yup.number().required(
                                                      "candidating Percentage  is required"
                                                    ),

                                                  examPrecentage:
                                                    Yup.number().required(
                                                      "exam Percentage  is required"
                                                    ),
                                                }
                                              )}
                                            >
                                              {({
                                                errors,
                                                status,
                                                touched,
                                                values,
                                              }) => (
                                                <Form>
                                                  <Row>
                                                    <Col md="6">
                                                      <Label className="form-label">
                                                        {t(
                                                          "Distributing Method(ar)"
                                                        )}
                                                      </Label>
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Col>
                                                    <Col md="6">
                                                      <Field
                                                        name="arTitle"
                                                        type="text"
                                                        className={
                                                          "form-control" +
                                                          ((errors.arTitle &&
                                                            touched.arTitle) ||
                                                          arTitleSaveError
                                                            ? " is-invalid"
                                                            : "")
                                                        }
                                                      />
                                                      {arTitleSaveError && (
                                                        <div className="invalid-feedback">
                                                          {t(
                                                            "Distribution types arabic  is required"
                                                          )}
                                                        </div>
                                                      )}
                                                      <ErrorMessage
                                                        name="arTitle"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </Col>
                                                  </Row>
                                                  <Row>
                                                    <Col md="6">
                                                      <Label className="form-label">
                                                        {t(
                                                          "Distributing Method(En)"
                                                        )}
                                                      </Label>
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Col>
                                                    <Col md="6">
                                                      <Field
                                                        name="enTitle"
                                                        type="text"
                                                        className={
                                                          "form-control" +
                                                          ((errors.enTitle &&
                                                            touched.enTitle) ||
                                                          EnTitleSaveError
                                                            ? " is-invalid"
                                                            : "")
                                                        }
                                                      />
                                                      {EnTitleSaveError && (
                                                        <div className="invalid-feedback">
                                                          {t(
                                                            "Distributing Method(En)  is required"
                                                          )}
                                                        </div>
                                                      )}

                                                      <ErrorMessage
                                                        name="enTitle"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </Col>
                                                  </Row>

                                                  <Row>
                                                    <Col md="6">
                                                      <Label className="form-label">
                                                        {t(
                                                          "Candidating Percentage"
                                                        )}
                                                      </Label>
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Col>
                                                    <Col md="6">
                                                      <Label className="form-label">
                                                        {t("exam Precentage")}
                                                      </Label>
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Col>
                                                  </Row>
                                                  <Row>
                                                    <Col md="6">
                                                      <Field
                                                        name="candidatingPercentage"
                                                        type="number"
                                                        className={
                                                          "form-control" +
                                                          ((errors.candidatingPercentage &&
                                                            touched.candidatingPercentage) ||
                                                          candidatingPercentageEmpty
                                                            ? " is-invalid"
                                                            : "")
                                                        }
                                                      />
                                                      {candidatingPercentageEmpty && (
                                                        <div className="invalid-feedback">
                                                          {t(
                                                            "Candidating Percentage  is required"
                                                          )}
                                                        </div>
                                                      )}
                                                      <ErrorMessage
                                                        name="candidatingPercentage"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </Col>
                                                    <Col md="6">
                                                      <Field
                                                        name="examPrecentage"
                                                        type="number"
                                                        className={
                                                          "form-control" +
                                                          ((errors.examPrecentage &&
                                                            touched.examPrecentage) ||
                                                          examPrecentageEmpty
                                                            ? " is-invalid"
                                                            : "")
                                                        }
                                                      />
                                                      {examPrecentageEmpty && (
                                                        <div className="invalid-feedback">
                                                          {this.props.t(
                                                            "Exam  Percentage  is required"
                                                          )}
                                                        </div>
                                                      )}
                                                      <ErrorMessage
                                                        name="examPrecentage"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </Col>
                                                  </Row>
                                                  <Row>
                                                    <Col md="6">
                                                      <Label className="form-label">
                                                        {t("quarterly Total")}
                                                      </Label>
                                                    </Col>
                                                    <Col md="6">
                                                      <Label className="form-label">
                                                        {t("final Total grade")}
                                                      </Label>
                                                    </Col>
                                                  </Row>
                                                  <Row>
                                                    <Col md="6">
                                                      <Field
                                                        name="quarterlyTotal"
                                                        type="number"
                                                        className={
                                                          "form-control" +
                                                          (errors.quarterlyTotal &&
                                                          touched.quarterlyTotal
                                                            ? " is-invalid"
                                                            : "")
                                                        }
                                                      />
                                                      <ErrorMessage
                                                        name="quarterlyTotal"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </Col>
                                                    <Col md="6">
                                                      <Field
                                                        name="finalTotal"
                                                        type="number"
                                                        className={
                                                          "form-control" +
                                                          (errors.finalTotal &&
                                                          touched.finalTotal
                                                            ? " is-invalid"
                                                            : "")
                                                        }
                                                      />
                                                      <ErrorMessage
                                                        name="finalTotal"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </Col>
                                                  </Row>
                                                  <Row>
                                                    {isEdit && (
                                                      <div className="table-responsive">
                                                        <BootstrapTable
                                                          keyField="Id"
                                                          data={
                                                            distributingCoursesMethodsContents
                                                          }
                                                          columns={columns}
                                                          cellEdit={cellEditFactory(
                                                            {
                                                              mode: "click",
                                                              blurToSave: true,
                                                              afterSaveCell: (
                                                                oldValue,
                                                                newValue,
                                                                row,
                                                                column
                                                              ) => {
                                                                this.handledistributingCoursesMethodsContentsDataChange(
                                                                  row.Id,
                                                                  column.dataField,
                                                                  newValue,
                                                                  oldValue
                                                                );
                                                              },
                                                            }
                                                          )}
                                                          noDataIndication={t(
                                                            "No  Courses Contents found"
                                                          )}
                                                        />
                                                        <div className="text-sm-end">
                                                          <IconButton
                                                            style={
                                                              addButtonStyle
                                                            }
                                                            onClick={
                                                              this.handleAddRow
                                                            }
                                                          >
                                                            <AddIcon />
                                                          </IconButton>
                                                        </div>
                                                      </div>
                                                    )}
                                                    <Col>
                                                      <div className="text-end">
                                                        <Link
                                                          to="#"
                                                          onClick={() => {
                                                            this.handleSave(
                                                              values
                                                            );
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
                                          </TabPane>
                                        </TabContent>
                                      </ModalBody>
                                    </Modal>
                                  </div>
                                </Col>
                              </Row>
                              <Row className="align-items-md-center mt-30">
                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </Col>
                              </Row>
                            </React.Fragment>
                          )}
                        </ToolkitProvider>
                      )}
                    </PaginationProvider>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({
  distributingCoursesMethods,
  gradeTypes,
  menu_items,
}) => ({
  distributingCoursesMethods:
    distributingCoursesMethods.distributingCoursesMethods,
  gradeTypes: gradeTypes.gradeTypes,
  distributingCoursesMethodsContents:
    distributingCoursesMethods.distributingCoursesMethodsContents,
  distributingCourses: distributingCoursesMethods.distributingCourses,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetDistributingCoursesMethods: () =>
    dispatch(getDistributingCoursesMethods()),
  onAddNewDistributingCoursesMethod: distributingCoursesMethod =>
    dispatch(addNewDistributingCoursesMethod(distributingCoursesMethod)),
  onUpdateDistributingCoursesMethod: distributingCoursesMethod =>
    dispatch(updateDistributingCoursesMethod(distributingCoursesMethod)),
  onDeleteDistributingCoursesMethod: distributingCoursesMethod =>
    dispatch(deleteDistributingCoursesMethod(distributingCoursesMethod)),
  //

  onGetDistributingCoursesMethodsContents: distributingCourseMethods =>
    dispatch(getDistributingCoursesMethodsContents(distributingCourseMethods)),

  onAddNewDistributingCoursesMethodContent: distributingCoursesMethodContent =>
    dispatch(
      addNewDistributingCoursesMethodContent(distributingCoursesMethodContent)
    ),

  onUpdateDistributingCoursesMethodContent: distributingCoursesMethodContent =>
    dispatch(
      updateDistributingCoursesMethodContent(distributingCoursesMethodContent)
    ),
  onDeleteDistributingCoursesMethodContent: distributingCoursesMethodContent =>
    dispatch(
      deleteDistributingCoursesMethodContent(distributingCoursesMethodContent)
    ),

  onCopyDistributingMethods: () => dispatch(copyDistributingMethods()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(DistributingCoursesMethods)));
