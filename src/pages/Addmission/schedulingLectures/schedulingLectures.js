import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { Formik, Field, Form, ErrorMessage } from "formik";
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
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Modal,
  ModalHeader,
  FormGroup,
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
  getCoursesOffering,
  getMethodsOfOfferingCourses,
  getAllCoursesOffering,
  addNewCourseOffering,
  updateCourseOffering,
  deleteCourseOffering,
  getCourseOfferingDeletedValue,
  getSectionLabs,
  addNewSectionLab,
  updateSectionLab,
  deleteSectionLab,
} from "store/scheduling-lectures/actions";
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
class SchedulingLecturesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coursesOffering: [],
      classes: [],
      years: [],
      methodsOffering: [],
      courseOffering: "",
      activeTab1: "5",
      activeTab2: "5",
      selectConId: null,
      showAlert: null,
      selectedCourse: null,
      selectedMethodOffering: "",
      selectedYear: "",
      selectedEndOfferingDate: "",
      selectedOfferingDate: "",
      ifUpdateCourse: 0,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
      selectedRows: [],
      deleteModal: false,
      duplicateError: null,
      offeringDateError: null,
      endOfferingDateError: null,
      selectedRowId: null,
      modal: false,
      modal2: false,
      isEdit: false,
      isOpen: false,
      isAdd: false,
      errorMessage: null,
      successMessage: null,
      values: "",
    };
    this.toggle1 = this.toggle1.bind(this);
  }

  componentDidMount() {
    const {
      coursesOffering,
      classes,
      onGetCoursesOffering,
      onGetMethodsOfOfferingCourses,
      methodsOffering,
      onGetAllCoursesOffering,
      allCoursesOffering,
      deleted,
      user_menu,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    onGetCoursesOffering();
    onGetAllCoursesOffering();
    onGetMethodsOfOfferingCourses();
    this.setState({
      coursesOffering,
      allCoursesOffering,
      methodsOffering,
      deleted,
    });

    console.log("rsssssssssssssss", coursesOffering);
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

  onClickDelete = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };

  handleAddRow = () => {
    this.setState({
      courseOffering: "",
      isOpen: true,
    });
    this.toggle();
  };

  handleViewAll = isChecked => {
    const { onGetAllCoursesOffering, onGetCoursesOffering } = this.props;
    this.setState({ showAll: isChecked }, () => {
      onGetCoursesOffering();
    });
  };

  handleSelectChange = (fieldName, selectedValue) => {
    if (fieldName === "methodOfferingId") {
      this.setState({ selectedMethodOffering: selectedValue });
    }
    if (fieldName === "yearId") {
      this.setState({ selectedYear: selectedValue });
    }
  };

  handleViewAll = isChecked => {
    const { onGetAllCoursesOffering, onGetCoursesOffering } = this.props;
    this.setState({ showAll: isChecked }, () => {
      if (isChecked) {
        onGetAllCoursesOffering();
      } else {
        onGetCoursesOffering();
      }
    });
  };

  toggle1(tab) {
    const { onGetCoursesOffering } = this.props;
    const { ifUpdateCourse } = this.state;
    if (this.state.activeTab1 !== tab) {
      this.setState({
        activeTab1: tab,
      });
    }
    if (ifUpdateCourse != 0) {
      onGetCoursesOffering();
      this.setState({ ifUpdateCourse: 0 });
    }

    document.getElementById("square-switch1").checked = false;
  }

  // handleDeleteRow = () => {
  //   const { onDeleteContract } = this.props;
  //   const { selectedRowId } = this.state;

  //   if (selectedRowId !== null) {
  //     onDeleteContract(selectedRowId);

  //     this.setState({
  //       selectedRowId: null,
  //       deleteModal: false,
  //       showAlert: true,
  //     });
  //   }
  // };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleSuccessClose = () => {
    const { onGetContractDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetContractDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetContractDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetContractDeletedValue();
  };

  handleSave = values => {
    const {
      selectedMethodOffering,
      selectedEndOfferingDate,
      selectedOfferingDate,
    } = this.state;
    const { onAddNewCourseOffering } = this.props;

    values["methodOffering"] = selectedMethodOffering;
    console.log("valuesssssssssssssssssssss", values);

    let courseOfferingInfo = {};
    if (
      values.offeringDate &&
      values.endOfferingDate &&
      selectedMethodOffering !== null
    ) {
      Object.keys(values).forEach(function (key) {
        if (
          values[key] != undefined &&
          (values[key].length > 0 || values[key] != "")
        )
          console.log("9999999", courseOfferingInfo);
        courseOfferingInfo[key] = values[key];
      });

      // onAddNewCourseOffering(courseOfferingInfo);
      this.setState({
        errorMessages: {},
      });
      this.toggle();
    } else {
      if (selectedMethodOffering === undefined) {
        this.setState({ methodOfferingError: true, saveError: true });
      }
      if (selectedEndOfferingDate === undefined) {
        this.setState({ endOfferingDateError: true, saveError: true });
      }
      if (selectedOfferingDate === undefined) {
        this.setState({ offeringDateError: true, saveError: true });
      }
      const emptyError = this.props.t("Fill the Required Fields");

      this.setState({ emptyError: emptyError });
    }
  };

  render() {
    const { courseOffering, selectedRows } = this.state;
    const {
      coursesOffering,
      years,
      t,
      deleted,
      sectors,
      methodsOffering,
      trainingFormats,
      certificateTypes,
    } = this.props;
    const {
      duplicateError,
      deleteModal,
      modal,
      modal2,
      isOpen,
      emptyError,
      offeringDateError,
      endOfferingDateError,
      showAlert,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
      modalContractValue,
      selectedCourse,
      selectedMethodOffering,
      selectedEndOfferingDate,
      selectedOfferingDate,
      selectedYear,
    } = this.state;
    const trainingSectorOptions = sectors;
    const trainingFormatOptions = trainingFormats;
    const trainingProgramOptions = certificateTypes;
    const selectRow = {
      mode: "checkbox",
    };

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
      { dataField: "Id", text: t("ID"), hidden: true },
      {
        dataField: "arTitle",
        text: this.props.t("Course Name (ar)"),
        editable: false,
        sort: true,
      },
      {
        dataField: "Code",
        text: this.props.t("Course Code"),
        editable: false,
        sort: true,
      },
      {
        dataField: "sectorName",
        text: this.props.t("Training Sector"),
        sort: true,
        editable: false,
      },
      {
        dataField: "trainingFormat",
        text: this.props.t("Traning Format"),
        editable: false,
        sort: true,
      },
      {
        dataField: "program",
        text: this.props.t("Training Program"),
        sort: true,
        editable: false,
      },
      {
        dataField: "methodOfferingId",
        text: this.props.t("Method Of Offering"),
        sort: true,
        editable: false,
      },
      {
        dataField: "offeringDate",
        text: this.props.t("Start Date"),
        sort: true,
        editable: false,
      },
      {
        dataField: "endOfferingDate",
        text: this.props.t("End Date"),
        sort: true,
        editable: false,
      },
      {
        dataField: "menu",
        text: "",
        isDummyField: true,
        editable: false,
        //  hidden: !showDeleteButton,
        formatter: (cellContent, contract) => (
          <div className="d-flex gap-3">
            <Tooltip
              title={this.props.t("Determine the method of offering courses")}
              placement="top"
            >
              <IconButton color="primary" onClick={this.handleAddRow}>
                <i className="mdi mdi-plus-circle blue-noti-icon" />
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
    ];
    const columns2 = [
      { dataField: "Id", text: t("ID"), hidden: true },
      {
        dataField: "arTitle",
        text: this.props.t("Course Name"),
        editable: false,
        sort: true,
      },
      {
        dataField: "courseCode",
        text: this.props.t("Course Code"),
        editable: false,
        sort: true,
      },
      {
        dataField: "nbHours",
        text: this.props.t("Number of Hours"),
        editable: false,
        sort: true,
      },
      {
        dataField: "courseType",
        text: this.props.t("Course Type"),
        editable: false,
        sort: true,
      },
      {
        dataField: "numOfSections ",
        text: this.props.t("Number of Sections"),
        editable: false,
        sort: true,
      },
      {
        dataField: "numOfLabs ",
        text: this.props.t("Number of Labs"),
        editable: false,
        sort: true,
      },
      {
        dataField: "menu",
        isDummyField: true,
        editable: false,
        text: this.props.t(""),
        formatter: (cellContent, branch) => (
          <div
            className="d-flex gap-3"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Tooltip title={t("Sections & Labs")} placement="top">
              <Link className="section-button text-secondary" to="#">
                <i
                  className="bx bx-calendar-event font-size-18"
                  id="edittooltip"
                  onClick={() => this.handleEditBranch(branch)}
                ></i>
              </Link>
            </Tooltip>
          </div>
        ),
      },
    ];
    const pageOptions = {
      sizePerPage: 20,
      totalSize: coursesOffering.length,
      custom: true,
    };
    // const pageOptions2 = {
    //   sizePerPage: 20,
    //   totalSize: classes.length,
    //   custom: true,
    // };
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
            <Breadcrumbs breadcrumbItem={this.props.t("Scheduling Lectures")} />
            <div className="checkout-tabs"></div>
            <Row>
              <Card>
                <CardTitle className="h4"></CardTitle>
                <Row>
                  <Col md="2">
                    <Nav pills className="flex-column">
                      <NavItem>
                        <NavLink
                          id="vertical-home-link"
                          style={{ cursor: "pointer" }}
                          className={`nav-link ${
                            this.state.activeTab1 === "5" ? "active" : ""
                          }`}
                          onClick={() => {
                            this.toggle1("5");
                          }}
                        >
                          {this.props.t("Course Offering")}
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          id="vertical-home-link"
                          style={{ cursor: "pointer" }}
                          className={`nav-link ${
                            this.state.activeTab1 === "6" ? "active" : ""
                          }`}
                          onClick={() => {
                            this.toggle1("6");
                          }}
                        >
                          {this.props.t("Classes")}
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </Col>
                  <Col md="10">
                    <TabContent
                      activeTab={this.state.activeTab1}
                      className="p-3 text-muted"
                    >
                      <TabPane tabId="5">
                        <PaginationProvider
                          pagination={paginationFactory(pageOptions)}
                          keyField="Id"
                          columns={columns}
                          data={coursesOffering}
                        >
                          {({ paginationProps, paginationTableProps }) => (
                            <ToolkitProvider
                              keyField="Id"
                              data={coursesOffering}
                              columns={columns}
                              search
                            >
                              {toolkitprops => (
                                <React.Fragment>
                                  <Row className="mb-2">
                                    <Col lg="4">
                                      <div className="search-box ms-2 mb-2 d-inline-block">
                                        <div className="position-relative">
                                          <SearchBar
                                            {...toolkitprops.searchProps}
                                            placeholder={t("Search...")}
                                          />
                                          <i className="bx bx-search-alt search-icon" />
                                        </div>
                                      </div>
                                    </Col>
                                    <Col lg="3">
                                      <Select
                                        className="select-style-year"
                                        name="year"
                                        key={`year`}
                                        options={years}
                                        onChange={newValue => {
                                          this.handleSelectChange(
                                            "year",
                                            newValue
                                          );
                                        }}
                                        value={selectedYear}
                                      />
                                      <br />
                                    </Col>
                                    <Col sm="4"></Col>
                                    <Col sm="1">
                                      <Tooltip
                                        title={t("View All")}
                                        placement="top"
                                      >
                                        <div className="square-switch square-switch-view">
                                          <input
                                            type="checkbox"
                                            id="square-switch1"
                                            switch="none"
                                            onChange={event => {
                                              this.handleViewAll(
                                                event.target.checked
                                              );
                                            }}
                                          />
                                          <label
                                            htmlFor="square-switch1"
                                            data-on-label="View"
                                            data-off-label="Off"
                                          />
                                        </div>
                                      </Tooltip>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <BootstrapTable
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      keyField="Id"
                                      data={coursesOffering}
                                      selectRow={selectRow}
                                      defaultSorted={defaultSorting}
                                      classes={
                                        "table align-middle table-nowrap table-hover"
                                      }
                                      columns={columns.map(col => {
                                        if (col.dataField === "select") {
                                          return {
                                            ...col,
                                            formatExtraData: {
                                              ...col.formatExtraData,
                                              pageRows:
                                                paginationTableProps.data || [],
                                            },
                                          };
                                        }
                                        return col;
                                      })}
                                      cellEdit={cellEditFactory({
                                        mode: "click",
                                        blurToSave: true,
                                      })}
                                      noDataIndication={t(
                                        "No Courses Offering"
                                      )}
                                    />
                                  </Row>
                                  <Row className="align-items-md-center mt-30">
                                    <Col className="pagination pagination-rounded justify-content-end mb-2">
                                      <PaginationListStandalone
                                        {...paginationProps}
                                      />
                                      <Modal
                                        isOpen={modal}
                                        toggle={this.toggle}
                                        size="4"
                                      >
                                        <ModalHeader
                                          toggle={this.toggle}
                                          tag="h4"
                                        >
                                          {!!isOpen
                                            ? t(
                                                "Determine the method of offering courses"
                                              )
                                            : ""}
                                        </ModalHeader>
                                        <ModalBody>
                                          <Formik
                                            enableReinitialize={true}
                                            initialValues={{
                                              ...(isOpen &&
                                                courseOffering && {
                                                  Id: courseOffering.Id,
                                                }),
                                              methodOffering:
                                                (courseOffering &&
                                                  courseOffering.methodOffering) ||
                                                selectedMethodOffering,
                                              offeringDate:
                                                (courseOffering &&
                                                  courseOffering.offeringDate) ||
                                                selectedOfferingDate,
                                              endOfferingDate:
                                                (courseOffering &&
                                                  courseOffering.endOfferingDate) ||
                                                selectedEndOfferingDate,
                                            }}
                                            validationSchema={Yup.object().shape(
                                              {
                                                methodsOfferingId:
                                                  Yup.string().required(
                                                    "Please Enter Your Methods Offering"
                                                  ),
                                                endOfferingDate:
                                                  Yup.string().required(
                                                    t(
                                                      "Please Enter Your End Offering Date"
                                                    )
                                                  ),
                                                offeringDate:
                                                  Yup.string().required(
                                                    t(
                                                      "Please Enter Your Offering Date"
                                                    )
                                                  ),
                                              }
                                            )}
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
                                                    {t("Offering Courses")}
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
                                                      <Col lg="12">
                                                        <Row className="mb-3">
                                                          <Col md={5}>
                                                            <Label className="form-label">
                                                              {this.props.t(
                                                                "Method Offering"
                                                              )}
                                                            </Label>
                                                            <span className="text-danger">
                                                              *
                                                            </span>
                                                          </Col>
                                                          <Col md={7}>
                                                            <div className="d-flex gap-4 mt-2 flex-wrap">
                                                              {methodsOffering.map(
                                                                methodOffering => (
                                                                  <div
                                                                    className="form-check form-check-inline"
                                                                    key={
                                                                      methodOffering.value
                                                                    }
                                                                  >
                                                                    <Input
                                                                      type="radio"
                                                                      name="methodOfferingId"
                                                                      value={
                                                                        methodOffering.value
                                                                      }
                                                                      id={
                                                                        methodOffering.value
                                                                      }
                                                                      onChange={event => {
                                                                        this.handleSelectChange(
                                                                          "methodOfferingId",
                                                                          event
                                                                            .target
                                                                            .value
                                                                        );
                                                                      }}
                                                                      defaultChecked={
                                                                        methodOffering.value ===
                                                                        selectedMethodOffering
                                                                      }
                                                                    />
                                                                    <Label
                                                                      className="form-check-label"
                                                                      for={
                                                                        methodOffering.value
                                                                      }
                                                                    >
                                                                      {this.props.t(
                                                                        methodOffering.label
                                                                      )}
                                                                    </Label>
                                                                  </div>
                                                                )
                                                              )}
                                                            </div>
                                                          </Col>
                                                        </Row>

                                                        <div className="mb-3">
                                                          <Row>
                                                            <Col className="col-4">
                                                              <Label for="offeringDate">
                                                                {this.props.t(
                                                                  "Offering Date"
                                                                )}
                                                              </Label>
                                                              <span className="text-danger">
                                                                *
                                                              </span>
                                                            </Col>
                                                            <Col className="col-8">
                                                              <Field
                                                                name="offeringDate"
                                                                className={`form-control ${
                                                                  offeringDateError
                                                                    ? "is-invalid"
                                                                    : ""
                                                                }`}
                                                                type="date"
                                                                value={
                                                                  values.offeringDate
                                                                    ? new Date(
                                                                        values.offeringDate
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
                                                                id="offeringDate-date-input"
                                                              />
                                                              {offeringDateError && (
                                                                <div className="invalid-feedback">
                                                                  {this.props.t(
                                                                    "Offering Date is required"
                                                                  )}
                                                                </div>
                                                              )}
                                                            </Col>
                                                          </Row>
                                                        </div>
                                                        <div className="mb-3">
                                                          <Row>
                                                            <Col className="col-4">
                                                              <Label for="endOfferingDate">
                                                                {this.props.t(
                                                                  "End Offering Date"
                                                                )}
                                                              </Label>
                                                              <span className="text-danger">
                                                                *
                                                              </span>
                                                            </Col>
                                                            <Col className="col-8">
                                                              <Field
                                                                name="endOfferingDate"
                                                                className={`form-control ${
                                                                  endOfferingDateError
                                                                    ? "is-invalid"
                                                                    : ""
                                                                }`}
                                                                type="date"
                                                                value={
                                                                  values.endOfferingDate
                                                                    ? new Date(
                                                                        values.endOfferingDate
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
                                                                id="endOfferingDate-date-input"
                                                              />
                                                              {endOfferingDateError && (
                                                                <div className="invalid-feedback">
                                                                  {this.props.t(
                                                                    "Offering Date is required"
                                                                  )}
                                                                </div>
                                                              )}
                                                            </Col>
                                                          </Row>
                                                        </div>
                                                      </Col>
                                                    </Row>
                                                    <Row>
                                                      <Col>
                                                        <div className="text-center">
                                                          <Link
                                                            to="#"
                                                            className="btn btn-primary me-2"
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
                                                  </CardBody>
                                                </Card>
                                              </Form>
                                            )}
                                          </Formik>
                                        </ModalBody>
                                      </Modal>
                                    </Col>
                                  </Row>
                                </React.Fragment>
                              )}
                            </ToolkitProvider>
                          )}
                        </PaginationProvider>
                      </TabPane>
                      {/* <TabPane tabId="6">
                        <PaginationProvider
                          pagination={paginationFactory(pageOptions2)}
                          keyField="id"
                          columns={columns2}
                          data={classes}
                        >
                          {({ paginationProps, paginationTableProps }) => (
                            <ToolkitProvider
                              keyField="id"
                              columns={columns2}
                              data={classes}
                              search
                            >
                              {toolkitprops => (
                                <React.Fragment>
                                  <Row className="mb-2">
                                    <Col sm="3">
                                      <div className="search-box ms-2 mb-2 d-inline-block">
                                        <div className="position-relative">
                                          <SearchBar
                                            {...toolkitprops.searchProps}
                                          />
                                          <i className="bx bx-search-alt search-icon" />
                                        </div>
                                      </div>
                                    </Col>
                                    <Col>
                                      <label className="cu-Semes form-label mt-1">
                                        {selectedCourse &&
                                          selectedCourse["label"]}{" "}
                                      </label>
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
                      </TabPane> */}
                    </TabContent>
                  </Col>
                </Row>
              </Card>
            </Row>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({
  schedulingLectures,
  years,
  halls,
  mobAppFacultyAccs,
  departments,
  weekDays,
  lecturePeriods,
  semesters,
  academiccertificates,
  generalManagements,
  menu_items,
}) => ({
  coursesOffering: schedulingLectures.coursesOffering,
  offeringLectures: schedulingLectures.offeringLectures,
  // halls: halls.halls,
  instructors: schedulingLectures.instructors,
  classes: schedulingLectures.classes,
  years: years.years,
  scheduleTimings: schedulingLectures.scheduleTimings,
  // faculties: mobAppFacultyAccs.faculties,
  // departments: departments.departments,
  // weekDays: weekDays.weekDays,
  // lecturePeriods: lecturePeriods.lecturePeriods,
  scheduleTimingDescs: schedulingLectures.scheduleTimingDescs,
  // currentSemester: semesters.currentSemester,
  // filteredAcademicCertificates:
  //   academiccertificates.filteredAcademicCertificates,
  returnMessage: schedulingLectures.returnMessage,
  hallTimings: schedulingLectures.hallTimings,
  methodsOffering: schedulingLectures.methodsOffering,
  deleted: schedulingLectures.deleted,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetCoursesOffering: () => dispatch(getCoursesOffering()),
  onGetMethodsOfOfferingCourses: () => dispatch(getMethodsOfOfferingCourses()),
  onGetAllCoursesOffering: () => dispatch(getAllCoursesOffering()),
  onAddNewCourseOffering: CourseOffering =>
    dispatch(addNewCourseOffering(CourseOffering)),
  onUpdateCourseOffering: CourseOffering =>
    dispatch(updateCourseOffering(CourseOffering)),
  // onDeleteContract: contract => dispatch(deleteContract(contract)),
  // onGetContractDeletedValue: () => dispatch(getContractDeletedValue()),
  // onGetJobRanksOpt: () => dispatch(getJobRanksOpt()),
  // onGetJobTitlesOpt: () => dispatch(getJobTitlesOpt()),
  // onGetAcademicYearsOpt: () => dispatch(getAcademicYearsOpt()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(SchedulingLecturesList)));
