import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Media,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  CardText,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Button,
  Table,
  Alert,
  Collapse,
} from "reactstrap";
import DeleteModal from "components/Common/DeleteModal";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import classnames from "classnames";
/* import "./studyplans.scss"; */
import Editable from "react-bootstrap-editable";
import { withTranslation } from "react-i18next";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { getAcademicCertificates } from "store/academicvertificates/actions";
import { getReqTypes } from "store/req-types/actions";
import {
  getStudyPlans,
  getFilteredCourses,
  addNewStudyPlan,
  deleteStudyPlan,
  getPlanHours,
  addNewPlanHour,
  updatePlanHour,
  generalizeStudyPlans,
  getAllStudyPlans,
} from "store/study-plans/actions";
class StudyPlansList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab1: "5",
      verticalActiveTab: "0",
      verticalActiveTab1: "0",
      verticalActiveTab2: "0",
      verticalActiveTab3: "0",

      selectedValueHours: null,
      inputFocused: false,
      showButtons: false,
      inputFocusedHours: false,
      showButtonsHours: false,

      selectedValue: "",

      duplicateError: null,
      facultyId: null,
      CoursePlanTypeId: null,
      planId: null,
      selectedRowId: null,
      deleteModal: false,
      openAccordionIndices: [],
      totalHours: null,
      inputClass: "",
    };
    this.toggle1 = this.toggle1.bind(this);
    this.handleClearInputHours = this.handleClearInputHours.bind(this);
  }

  componentDidMount() {
    const {
      onGetAcademicCertificates,
      academiccertificates,

      reqTypes,
      onGetReqTypes,
    } = this.props;
    onGetAcademicCertificates();

    this.setState({ academiccertificates });

    this.setState({ reqTypes });
  }
  handleInputChange = event => {
    this.setState({ selectedValue: event.target.value });
  };
  handleAddToTable = inputValue => {
    const {
      onAddNewStudyPlan,
      filteredCourses,
      planHours,
      reqTypes,
      onGetAllStudyPlans,
      onGetFilteredCourses
    } = this.props;
    const { facultyId, CoursePlanTypeId, planId, totalHours } = this.state;
    const selectedReqType = reqTypes.find(
      reqType => reqType.Id == CoursePlanTypeId
    );
    const selectedCourse = filteredCourses.find(
      course => course.arCourseName + " - " + course.code === inputValue
    );
    if (!selectedCourse) {
      const errorMessage = this.props.t("Value is not Valid");
      this.setState({ duplicateError: errorMessage });
      this.setState({ selectedValue: "" });
    } else if (planHours.length > 0 && planHours[0].requiredHours !== 0) {
      if (selectedReqType.required == 1) {
        if (planHours[0].requiredHours >= totalHours + selectedCourse.nbHours) {
          {
            const newRow = {
              PlanId: planId,
              CourseId: selectedCourse.Id,
              CoursePlanTypeId: CoursePlanTypeId,
              facultyId: facultyId,
            };

            onAddNewStudyPlan(newRow);
            this.setState({ duplicateError: null });
            this.setState({ selectedValue: "" });
            onGetAllStudyPlans(facultyId, planId, null);
          }
        } else {
          const errorMessage = this.props.t(
            "Required Hours Exceed Total Hours"
          );
          this.setState({ duplicateError: errorMessage });
        }
      } else {
        const newRow = {
          PlanId: planId,
          CourseId: selectedCourse.Id,
          CoursePlanTypeId: CoursePlanTypeId,
          facultyId: facultyId,
        };

        onAddNewStudyPlan(newRow);
        this.setState({ duplicateError: null });
        this.setState({ selectedValue: "" });
        onGetAllStudyPlans(facultyId, planId, null);
      }
    } else {
      const errorMessage = this.props.t("Schedule Hours are Empty");
      this.setState({ duplicateError: errorMessage });
    }
  };
  toggleAccordion = index => {
    let { openAccordionIndices } = this.state;
    if (openAccordionIndices.includes(index)) {
      openAccordionIndices = openAccordionIndices.filter(i => i !== index);
    } else {
      openAccordionIndices.push(index);
    }
    this.setState({ openAccordionIndices });
  };

  handleDeleteRow = () => {
    const { onDeleteStudyPlan, onGetFilteredCourses } = this.props;
    const { selectedRowId, facultyId } = this.state;

    if (selectedRowId !== null) {
      console.log("selectedRowId", selectedRowId);
      onDeleteStudyPlan(selectedRowId);
      this.setState({ selectedRowId: null, deleteModal: false });
      onGetFilteredCourses(facultyId);
    }
  };
  submitChangeHours = () => {
    const { selectedValueHours, facultyId, CoursePlanTypeId, planId } =
      this.state;
    const { onUpdatePlanHour, onAddNewPlanHour, planHours, onGetPlanHours,reqTypes } =
      this.props;
    if (planHours.length !== 0) {
      let onUpdate1 = {
        Id: planHours[0].Id,
        requiredHours:
          selectedValueHours == null ||
          selectedValueHours === 0 ||
          selectedValueHours === ""
            ? 0
            : selectedValueHours,
      };
      onUpdatePlanHour(onUpdate1);
    } else {
      const newRow = {
        planId: planId,
        requermentTypeId: CoursePlanTypeId,
        facultyId: facultyId,
        requiredHours: selectedValueHours,
      };

      onAddNewPlanHour(newRow);
    }

    onGetPlanHours(facultyId, planId, CoursePlanTypeId);
  };

  handleClearInput = () => {
    this.setState({ selectedValue: "", inputFocused: false });
  };
  handleInputBlur = () => {
    setTimeout(() => {
      this.setState({ showButtons: false });
    }, 200);
  };
  handleInputFocus = () => {
    this.setState({ showButtons: true });
  };

  handleInputChangeHours = event => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      this.setState({ selectedValueHours: value });
    }
  };

  handleClearInputHours = () => {
    const { selectedValueHours, facultyId, CoursePlanTypeId, planId } =
      this.state;
    const { onUpdatePlanHour, onAddNewPlanHour, planHours, onGetPlanHours } =
      this.props;

    if (planHours.length !== 0) {
      let onUpdate1 = {
        Id: planHours[0].Id,
        requiredHours: 0,
      };
      onUpdatePlanHour(onUpdate1);
    } else {
      const newRow = {
        planId: planId,
        requermentTypeId: CoursePlanTypeId,
        facultyId: facultyId,
        requiredHours: 0,
      };

      onAddNewPlanHour(newRow);
    }
    this.setState({ selectedValueHours: null });
    onGetPlanHours(facultyId, planId, CoursePlanTypeId);
  };

  handleInputBlurHours = () => {
    setTimeout(() => {
      this.setState({ showButtonsHours: false });
    }, 200);
  };

  handleInputFocusHours = () => {
    this.setState({ showButtonsHours: true });
  };

  toggle1(tab) {
    if (this.state.activeTab1 !== tab) {
      this.setState({
        activeTab1: tab,
        verticalActiveTab: "0",
        verticalActiveTab1: "0",
        verticalActiveTab2: "0",
        verticalActiveTab3: "0",
        duplicateError: null,
      });
      if (tab === "8") {
        const { onGetStudyPlans } = this.props;
        const { facultyId, planId } = this.state;
        onGetStudyPlans(facultyId, planId, null);
      }
    }
  }
  toggleVertical(tab) {
    const { facultyId, planId } = this.state;
    const { onGetStudyPlans, onGetPlanHours, onGetAllStudyPlans } = this.props;

    const inputClass = facultyId === null ? "nullFacultyId" : "";

    if (this.state.verticalActiveTab !== tab) {
      this.setState({
        verticalActiveTab: tab,
        duplicateError: null,
        CoursePlanTypeId: tab,
        inputClass,
        selectedValue: "",
      });
      if (facultyId == null) {
        const errorMessage = this.props.t("Plan Empty");
        this.setState({ duplicateError: errorMessage });
      }

      onGetStudyPlans(facultyId, planId, tab);
      onGetAllStudyPlans(facultyId, planId, null);
      onGetPlanHours(facultyId, planId, tab);
    }
  }
  toggleVertical1(tab) {
    const { facultyId, planId } = this.state;
    const { onGetStudyPlans, onGetPlanHours, onGetAllStudyPlans } = this.props;
    const inputClass = facultyId === null ? "nullFacultyId" : "";

    if (this.state.verticalActiveTab1 !== tab) {
      this.setState({
        verticalActiveTab1: tab,
        duplicateError: null,
        CoursePlanTypeId: tab,
        inputClass,
        selectedValue: "",
      });

      if (facultyId == null) {
        const errorMessage = this.props.t("Plan Empty");
        this.setState({ duplicateError: errorMessage });
      }
      onGetStudyPlans(facultyId, planId, tab);
      onGetAllStudyPlans(facultyId, planId, null);

      onGetPlanHours(facultyId, planId, tab);
    }
  }
  toggleVertical2(tab) {
    const { facultyId, planId } = this.state;
    const inputClass = facultyId === null ? "nullFacultyId" : "";

    const { onGetStudyPlans, onGetPlanHours, onGetAllStudyPlans } = this.props;

    if (this.state.verticalActiveTab2 !== tab) {
      this.setState({
        verticalActiveTab2: tab,
        duplicateError: null,
        CoursePlanTypeId: tab,
        inputClass,
        selectedValue: "",
      });
      if (facultyId == null) {
        const errorMessage = this.props.t("Plan Empty");
        this.setState({ duplicateError: errorMessage });
      }
      onGetStudyPlans(facultyId, planId, tab);
      onGetAllStudyPlans(facultyId, planId, null);

      onGetPlanHours(facultyId, planId, tab);
    }
  }
  toggleVertical3(tab) {
    if (this.state.verticalActiveTab3 !== tab) {
      this.setState({
        verticalActiveTab3: tab,
        duplicateError: null,
      });
    }
  }
  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleCertificateChange = e => {
    const {
      onGetFilteredCourses,
      onGetStudyPlans,
      onGetPlanHours,
      onGetAllStudyPlans,
      onGetReqTypes,
    } = this.props;
    const { CoursePlanTypeId, activeTab1 } = this.state;

    const selectedValue = e.target.value;

    const selectedCertificate = this.props.academiccertificates.find(
      certificate => certificate.AcadmicCertificatesArName === selectedValue
    );

    if (selectedCertificate) {
      const facultyId = selectedCertificate.facultyId;
      const planId = selectedCertificate.Id;
      this.setState({ facultyId: facultyId });
      this.setState({ planId: planId });
      onGetReqTypes({ facultyId: facultyId });
      onGetFilteredCourses(facultyId);
      if (CoursePlanTypeId != null) {
        onGetStudyPlans(facultyId, planId, CoursePlanTypeId);
        onGetAllStudyPlans(facultyId, planId, null);
        onGetPlanHours(facultyId, planId, CoursePlanTypeId);
      }
      this.setState({ inputClass: "" });
      this.setState({ duplicateError: "" });
      if (activeTab1 === "8") {
        onGetStudyPlans(facultyId, planId, null);
      }
    }
  };
  onClickDelete = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };
  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };
  calculateTotalHours = () => {
    const { studyPlans } = this.props;
    const total = studyPlans.reduce((acc, item) => acc + item.nbHours, 0);
    return total;
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.studyPlans !== this.props.studyPlans) {
      const totalHours = this.calculateTotalHours();

      this.setState({ totalHours });
    }
  }
  handleGeneralization = () => {
    const { facultyId, planId, CoursePlanTypeId } = this.state;
    const { onGeneralizeStudyPlans } = this.props;
    onGeneralizeStudyPlans(facultyId, planId, CoursePlanTypeId);
  };
  render() {
    const { t } = this.props;
    const {
      selectedValue,
      showButtons,
      showButtonsHours,
      duplicateError,
      deleteModal,
      openAccordionIndices,
    } = this.state;
    const {
      academiccertificates,
      studyPlans,
      reqTypes,
      filteredCourses,
      planHours,
      allStudyPlans,
    } = this.props;

    const confirmElement = (
      <button
        type="submit"
        className="btn btn-success editable-submit btn-sm me-1"
      >
        <i className="mdi mdi-check"></i>
      </button>
    );
    console.log("req", reqTypes);
    const CoursePlanColumns = [
      { dataField: "Id", text: t("Id"), hidden: true },

      {
        dataField: "courseName",
        text: t("Course Name"),
        editable: false,
        footer: "",
      },
      { dataField: "code", text: t("Code"), footer: "" },

      {
        dataField: "nbHours",
        text: t("Number of Hours"),
        footer: totalHours => totalHours.reduce((acc, item) => acc + item, 0),
      },
      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, studyPlan) => (
          <Link className="text-danger" to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => this.onClickDelete(studyPlan)}
            ></i>
          </Link>
        ),
      },
    ];
    const CoursePlanColumnsNoDelete = [
      { dataField: "Id", text: t("Id"), hidden: true },

      {
        dataField: "courseName",
        text: t("Course Name"),
        editable: false,
      },
      { dataField: "code", text: t("Code") },

      {
        dataField: "nbHours",
        text: t("Number of Hours"),
      },
    ];
    /** Cancel button */
    const cancelElement = (
      <button type="button" className="btn btn-danger editable-cancel btn-sm">
        <i className="mdi mdi-close"></i>
      </button>
    );
    // const columnValues = ["the one", "second", "3rd", "fourth"];
    const groupedStudyPlans = studyPlans.reduce((acc, studyPlan) => {
      const { CoursePlanType, nbHours } = studyPlan;
      if (!acc[CoursePlanType]) {
        acc[CoursePlanType] = { courses: [], totalHours: 0 };
      }
      acc[CoursePlanType].courses.push(studyPlan);
      acc[CoursePlanType].totalHours += nbHours;
      return acc;
    }, {});
    //meta title
    document.title = "keyInHands - React Admin & Dashboard Template";
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
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Utility" breadcrumbItem={t("Study Plans")} />

            <div className="checkout-tabs">
              <Card>
                <CardBody>
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
                  <CardTitle className="h4"></CardTitle>
                  <Row>
                    <Col md="4">
                      <Card>
                        <div className="col-md-10">
                          <CardTitle id="horizontalTitles">
                            {this.props.t("Choose Plan")}
                          </CardTitle>

                          <input
                            className={`form-control ${this.state.inputClass}`}
                            list="datalistOptions"
                            id="exampleDataList"
                            placeholder="Type to search..."
                            autoComplete="off"
                            onChange={this.handleCertificateChange}
                          />
                          <datalist id="datalistOptions">
                            {academiccertificates.map(certificate => (
                              <option
                                key={certificate.Id}
                                value={certificate.AcadmicCertificatesArName}
                              />
                            ))}
                          </datalist>
                        </div>
                      </Card>
                      <Nav pills className="flex-column">
                        <NavItem>
                          <NavLink
                            id="horizontal-home-link"
                            style={{ cursor: "pointer" }}
                            className={classnames({
                              active: this.state.activeTab1 === "5",
                            })}
                            onClick={() => {
                              this.toggle1("5");
                            }}
                          >
                            {this.props.t("University Requirements")}
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            id="horizontal-home-link"
                            style={{ cursor: "pointer" }}
                            className={classnames({
                              active: this.state.activeTab1 === "6",
                            })}
                            onClick={() => {
                              this.toggle1("6");
                            }}
                          >
                            {this.props.t("Faculty Requirements")}
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            id="horizontal-home-link"
                            style={{ cursor: "pointer" }}
                            className={classnames({
                              active: this.state.activeTab1 === "7",
                            })}
                            onClick={() => {
                              this.toggle1("7");
                            }}
                          >
                            {this.props.t("Certificate Requirements")}
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            id="horizontal-home-link"
                            style={{ cursor: "pointer" }}
                            className={classnames({
                              active: this.state.activeTab1 === "8",
                            })}
                            onClick={() => {
                              this.toggle1("8");
                            }}
                          >
                            {this.props.t("Study Plans")}
                          </NavLink>
                        </NavItem>
                      </Nav>
                    </Col>

                    <Col md="8">
                      <TabContent
                        activeTab={this.state.activeTab1}
                        className="p-3 text-muted"
                        id="verticalTabContent"
                      >
                        <TabPane tabId="5">
                          <Col>
                            <Card>
                              <CardBody>
                                <Col>
                                  <Nav
                                    pills
                                    className="navtab-bg nav-justified"
                                  >
                                    {reqTypes
                                      .filter(
                                        reqType =>
                                          reqType.requirementLevel ===
                                          "University"
                                      )
                                      .map(reqType => (
                                        <NavItem
                                          key={reqType.Id}
                                          navlink={reqType.Id}
                                        >
                                          <NavLink
                                            id="vertical-home-link"
                                            style={{ cursor: "pointer" }}
                                            className={classnames({
                                              "mb-2": true,
                                              active:
                                                this.state.verticalActiveTab ===
                                                reqType.Id,
                                            })}
                                            onClick={() => {
                                              this.toggleVertical(reqType.Id);
                                            }}
                                          >
                                            {this.props.t(reqType.arTitle)}
                                          </NavLink>
                                        </NavItem>
                                      ))}
                                  </Nav>

                                  <TabContent
                                    activeTab={this.state.verticalActiveTab}
                                    className="text-muted mt-4 mt-md-0"
                                  >
                                    {reqTypes
                                      .filter(
                                        reqType =>
                                          reqType.requirementLevel ===
                                          "University"
                                      )
                                      .map(reqType => (
                                        <TabPane
                                          key={reqType.Id}
                                          tabId={reqType.Id}
                                        >
                                          <Container fluid className="p-0">
                                            <Col>
                                              <div className="p-0">
                                                <h5
                                                  className="header pt-2"
                                                  id="title"
                                                >
                                                  {this.props.t(
                                                    "Required Requisites"
                                                  )}
                                                </h5>
                                                <Card>
                                                  <CardBody>
                                                    <form>
                                                      <div className="university-info mb-5">
                                                        <Row className="form-row">
                                                          <Col lg="8">
                                                            <div>
                                                              <label
                                                                htmlFor="semestername(English)"
                                                                className="col-form-label"
                                                              >
                                                                {t(
                                                                  "Schedule Hours"
                                                                )}
                                                                :
                                                              </label>
                                                              <input
                                                                type="number"
                                                                defaultValue={
                                                                  (planHours[0] &&
                                                                    planHours[0]
                                                                      .requiredHours) ||
                                                                  null
                                                                }
                                                                min={0}
                                                                onChange={
                                                                  this
                                                                    .handleInputChangeHours
                                                                }
                                                                onFocus={
                                                                  this
                                                                    .handleInputFocusHours
                                                                }
                                                                onBlur={
                                                                  this
                                                                    .handleInputBlurHours
                                                                }
                                                              />
                                                              {showButtonsHours && (
                                                                <>
                                                                  <Button
                                                                    color="success"
                                                                    id="sucBut"
                                                                    size="sm"
                                                                    onClick={
                                                                      this
                                                                        .submitChangeHours
                                                                    }
                                                                  >
                                                                    &#10004;
                                                                  </Button>
                                                                  <Button
                                                                    color="danger"
                                                                    size="sm"
                                                                    onClick={
                                                                      this
                                                                        .handleClearInputHours
                                                                    }
                                                                  >
                                                                    &#10006;
                                                                  </Button>
                                                                </>
                                                              )}
                                                            </div>
                                                          </Col>
                                                          <Col lg="4">
                                                            <div className="d-flex">
                                                              <Button
                                                                size="md"
                                                                className="btn btn-warning ms-auto"
                                                                onClick={
                                                                  this
                                                                    .handleGeneralization
                                                                }
                                                              >
                                                                <i className="bx bx-error font-size-16 align-middle me-2"></i>
                                                                {this.props.t(
                                                                  "Generalize"
                                                                )}
                                                              </Button>
                                                            </div>
                                                          </Col>
                                                        </Row>
                                                        <div className="container">
                                                          <Row className="form-row">
                                                            <div className="col-md-6">
                                                              <label htmlFor="semesternameEnglish">
                                                                {t("Code Name")}
                                                                :
                                                              </label>
                                                              <div className="d-flex align-items-center">
                                                                <input
                                                                  type="text"
                                                                  id="exampleDataList"
                                                                  list="datalistOptions1"
                                                                  className="form-control"
                                                                  value={
                                                                    selectedValue
                                                                  }
                                                                  onChange={
                                                                    this
                                                                      .handleInputChange
                                                                  }
                                                                  onFocus={
                                                                    this
                                                                      .handleInputFocus
                                                                  }
                                                                  onBlur={
                                                                    this
                                                                      .handleInputBlur
                                                                  }
                                                                  style={{
                                                                    fontSize: 16,
                                                                    padding:
                                                                      "10px",
                                                                    textAlign:
                                                                      "center",
                                                                  }}
                                                                  autoComplete="off"
                                                                />
                                                                <datalist id="datalistOptions1">
                                                                  {filteredCourses
                                                                    .filter(
                                                                      plan =>
                                                                        !allStudyPlans.some(
                                                                          sPlan =>
                                                                            sPlan.courseName ===
                                                                            plan.arCourseName
                                                                        )
                                                                    )
                                                                    .map(
                                                                      plan => (
                                                                        <option
                                                                          key={
                                                                            plan.Id
                                                                          }
                                                                          value={
                                                                            plan.arCourseName +
                                                                            " - " +
                                                                            plan.code
                                                                          }
                                                                        />
                                                                      )
                                                                    )}
                                                                </datalist>
                                                                {showButtons && (
                                                                  <>
                                                                    <Button
                                                                      color="success"
                                                                      id="sucBut"
                                                                      size="sm"
                                                                      onClick={() =>
                                                                        this.handleAddToTable(
                                                                          this
                                                                            .state
                                                                            .selectedValue
                                                                        )
                                                                      }
                                                                    >
                                                                      &#10004;{" "}
                                                                      {/* Checkmark */}
                                                                    </Button>
                                                                    <Button
                                                                      color="danger"
                                                                      size="sm"
                                                                      onClick={
                                                                        this
                                                                          .handleClearInput
                                                                      }
                                                                    >
                                                                      &#10006;{" "}
                                                                      {/* X mark */}
                                                                    </Button>
                                                                  </>
                                                                )}
                                                              </div>
                                                            </div>
                                                          </Row>
                                                          <Row className="form-row">
                                                            <div className="col-md-6">
                                                              <BootstrapTable
                                                                keyField="Id"
                                                                data={
                                                                  studyPlans
                                                                }
                                                                columns={
                                                                  CoursePlanColumns
                                                                }
                                                                noDataIndication={this.props.t(
                                                                  "No Courses Found"
                                                                )}
                                                              />
                                                            </div>
                                                          </Row>
                                                        </div>
                                                      </div>
                                                    </form>
                                                  </CardBody>
                                                </Card>
                                              </div>
                                            </Col>
                                          </Container>
                                        </TabPane>
                                      ))}
                                  </TabContent>
                                </Col>
                              </CardBody>
                            </Card>
                          </Col>
                        </TabPane>

                        <TabPane tabId="6">
                          <Col sm="12">
                            <Card>
                              <CardBody>
                                <Col>
                                  <Nav
                                    pills
                                    className="navtab-bg nav-justified"
                                  >
                                    {reqTypes
                                      .filter(
                                        reqType =>
                                          reqType.requirementLevel === "Faculty"
                                      )
                                      .map(reqType => (
                                        <NavItem
                                          key={reqType.Id}
                                          navlink={reqType.Id}
                                        >
                                          <NavLink
                                            id="vertical-home-link"
                                            style={{ cursor: "pointer" }}
                                            className={classnames({
                                              "mb-2": true,
                                              active:
                                                this.state
                                                  .verticalActiveTab1 ===
                                                reqType.Id,
                                            })}
                                            onClick={() => {
                                              this.toggleVertical1(reqType.Id);
                                            }}
                                          >
                                            {this.props.t(reqType.arTitle)}
                                          </NavLink>
                                        </NavItem>
                                      ))}
                                  </Nav>
                                </Col>
                                <Col>
                                  <TabContent
                                    activeTab={this.state.verticalActiveTab1}
                                    className="text-muted mt-4 mt-md-0"
                                  >
                                    {reqTypes
                                      .filter(
                                        reqType =>
                                          reqType.requirementLevel === "Faculty"
                                      )
                                      .map(reqType => (
                                        <TabPane
                                          key={reqType.Id}
                                          tabId={reqType.Id}
                                        >
                                          <Container fluid className="p-0">
                                            <Col>
                                              <div className="p-0">
                                                <h5
                                                  className="header pt-2"
                                                  id="title"
                                                >
                                                  {this.props.t(
                                                    "Required Requisites"
                                                  )}
                                                </h5>
                                                <Card>
                                                  <CardBody>
                                                    <form>
                                                      <div className="university-info mb-5">
                                                        <Row className="form-row">
                                                          <Col lg="8">
                                                            <div>
                                                              <label
                                                                htmlFor="semestername(English)"
                                                                className="col-form-label"
                                                              >
                                                                {t(
                                                                  "Schedule Hours"
                                                                )}
                                                                :
                                                              </label>
                                                              <input
                                                                type="number"
                                                                defaultValue={
                                                                  (planHours[0] &&
                                                                    planHours[0]
                                                                      .requiredHours) ||
                                                                  null
                                                                }
                                                                min={0}
                                                                onChange={
                                                                  this
                                                                    .handleInputChangeHours
                                                                }
                                                                onFocus={
                                                                  this
                                                                    .handleInputFocusHours
                                                                }
                                                                onBlur={
                                                                  this
                                                                    .handleInputBlurHours
                                                                }
                                                              />
                                                              {showButtonsHours && (
                                                                <>
                                                                  <Button
                                                                    color="success"
                                                                    id="sucBut"
                                                                    size="sm"
                                                                    onClick={
                                                                      this
                                                                        .submitChangeHours
                                                                    }
                                                                  >
                                                                    &#10004;
                                                                  </Button>
                                                                  <Button
                                                                    color="danger"
                                                                    size="sm"
                                                                    onClick={
                                                                      this
                                                                        .handleClearInputHours
                                                                    }
                                                                  >
                                                                    &#10006;
                                                                  </Button>
                                                                </>
                                                              )}
                                                            </div>
                                                          </Col>
                                                          <Col lg="4">
                                                            <div className="d-flex">
                                                              <Button
                                                                size="md"
                                                                className="btn btn-warning ms-auto"
                                                                onClick={
                                                                  this
                                                                    .handleGeneralization
                                                                }
                                                              >
                                                                <i className="bx bx-error font-size-16 align-middle me-2"></i>
                                                                {this.props.t(
                                                                  "Generalize"
                                                                )}
                                                              </Button>
                                                            </div>
                                                          </Col>
                                                        </Row>
                                                        <div className="container">
                                                          <Row className="form-row">
                                                            <div className="col-md-6">
                                                              <label htmlFor="semesternameEnglish">
                                                                {t("Code Name")}
                                                                :
                                                              </label>
                                                              <div className="d-flex align-items-center">
                                                                <input
                                                                  type="text"
                                                                  id="exampleDataList"
                                                                  list="datalistOptions1"
                                                                  className="form-control"
                                                                  value={
                                                                    selectedValue
                                                                  }
                                                                  onChange={
                                                                    this
                                                                      .handleInputChange
                                                                  }
                                                                  onFocus={
                                                                    this
                                                                      .handleInputFocus
                                                                  }
                                                                  onBlur={
                                                                    this
                                                                      .handleInputBlur
                                                                  }
                                                                  style={{
                                                                    fontSize: 16,
                                                                    padding:
                                                                      "10px",
                                                                    textAlign:
                                                                      "center",
                                                                  }}
                                                                  autoComplete="off"
                                                                />
                                                                <datalist id="datalistOptions1">
                                                                  {filteredCourses
                                                                    .filter(
                                                                      plan =>
                                                                        !allStudyPlans.some(
                                                                          sPlan =>
                                                                            sPlan.courseName ===
                                                                            plan.arCourseName
                                                                        )
                                                                    )
                                                                    .map(
                                                                      plan => (
                                                                        <option
                                                                          key={
                                                                            plan.Id
                                                                          }
                                                                          value={
                                                                            plan.arCourseName +
                                                                            " - " +
                                                                            plan.code
                                                                          }
                                                                        />
                                                                      )
                                                                    )}
                                                                </datalist>
                                                                {showButtons && (
                                                                  <>
                                                                    <Button
                                                                      color="success"
                                                                      id="sucBut"
                                                                      size="sm"
                                                                      onClick={() =>
                                                                        this.handleAddToTable(
                                                                          this
                                                                            .state
                                                                            .selectedValue
                                                                        )
                                                                      }
                                                                    >
                                                                      &#10004;{" "}
                                                                      {/* Checkmark */}
                                                                    </Button>
                                                                    <Button
                                                                      color="danger"
                                                                      size="sm"
                                                                      onClick={
                                                                        this
                                                                          .handleClearInput
                                                                      }
                                                                    >
                                                                      &#10006;{" "}
                                                                      {/* X mark */}
                                                                    </Button>
                                                                  </>
                                                                )}
                                                              </div>
                                                            </div>
                                                          </Row>
                                                          <Row className="form-row">
                                                            <div className="col-md-6">
                                                              <BootstrapTable
                                                                keyField="Id"
                                                                data={
                                                                  studyPlans
                                                                }
                                                                columns={
                                                                  CoursePlanColumns
                                                                }
                                                                noDataIndication={this.props.t(
                                                                  "No Courses Found"
                                                                )}
                                                              />
                                                            </div>
                                                          </Row>
                                                        </div>
                                                      </div>
                                                    </form>
                                                  </CardBody>
                                                </Card>
                                              </div>
                                            </Col>
                                          </Container>
                                        </TabPane>
                                      ))}
                                  </TabContent>
                                </Col>
                              </CardBody>
                            </Card>
                          </Col>
                        </TabPane>
                        <TabPane tabId="7">
                          <Col sm="12">
                            <Card>
                              <CardBody>
                                <Col>
                                  <Nav
                                    pills
                                    className="navtab-bg nav-justified"
                                  >
                                    {reqTypes
                                      .filter(
                                        reqType =>
                                          reqType.requirementLevel ===
                                          "Certificate"
                                      )
                                      .map(reqType => (
                                        <NavItem
                                          key={reqType.Id}
                                          navlink={reqType.Id}
                                        >
                                          <NavLink
                                            id="vertical-home-link"
                                            style={{ cursor: "pointer" }}
                                            className={classnames({
                                              "mb-2": true,
                                              active:
                                                this.state
                                                  .verticalActiveTab2 ===
                                                reqType.Id,
                                            })}
                                            onClick={() => {
                                              this.toggleVertical2(reqType.Id);
                                            }}
                                          >
                                            {this.props.t(reqType.arTitle)}
                                          </NavLink>
                                        </NavItem>
                                      ))}
                                  </Nav>
                                </Col>
                                <Col>
                                  <TabContent
                                    activeTab={this.state.verticalActiveTab2}
                                    className="text-muted mt-4 mt-md-0"
                                  >
                                    {reqTypes
                                      .filter(
                                        reqType =>
                                          reqType.requirementLevel ===
                                          "Certificate"
                                      )
                                      .map(reqType => (
                                        <TabPane
                                          key={reqType.Id}
                                          tabId={reqType.Id}
                                        >
                                          <Container fluid className="p-0">
                                            <Col>
                                              <div className="p-0">
                                                <h5
                                                  className="header pt-2"
                                                  id="title"
                                                >
                                                  {this.props.t(
                                                    "Required Requisites"
                                                  )}
                                                </h5>
                                                <Card>
                                                  <CardBody>
                                                    <form>
                                                      <div className="university-info mb-5">
                                                        <Row className="form-row">
                                                          <Col lg="8">
                                                            <div>
                                                              <label
                                                                htmlFor="semestername(English)"
                                                                className="col-form-label"
                                                              >
                                                                {t(
                                                                  "Schedule Hours"
                                                                )}
                                                                :
                                                              </label>
                                                              <input
                                                                type="number"
                                                                defaultValue={
                                                                  (planHours[0] &&
                                                                    planHours[0]
                                                                      .requiredHours) ||
                                                                  null
                                                                }
                                                                min={1}
                                                                onChange={
                                                                  this
                                                                    .handleInputChangeHours
                                                                }
                                                                onFocus={
                                                                  this
                                                                    .handleInputFocusHours
                                                                }
                                                                onBlur={
                                                                  this
                                                                    .handleInputBlurHours
                                                                }
                                                              />
                                                              {showButtonsHours && (
                                                                <>
                                                                  <Button
                                                                    color="success"
                                                                    id="sucBut"
                                                                    size="sm"
                                                                    onClick={
                                                                      this
                                                                        .submitChangeHours
                                                                    }
                                                                  >
                                                                    &#10004;
                                                                  </Button>
                                                                  <Button
                                                                    color="danger"
                                                                    size="sm"
                                                                    onClick={
                                                                      this
                                                                        .handleClearInputHours
                                                                    }
                                                                  >
                                                                    &#10006;
                                                                  </Button>
                                                                </>
                                                              )}
                                                            </div>
                                                          </Col>
                                                          <Col lg="4">
                                                            <div className="d-flex">
                                                              <Button
                                                                size="md"
                                                                className="btn btn-warning ms-auto"
                                                                onClick={
                                                                  this
                                                                    .handleGeneralization
                                                                }
                                                              >
                                                                <i className="bx bx-error font-size-16 align-middle me-2"></i>
                                                                {this.props.t(
                                                                  "Generalize"
                                                                )}
                                                              </Button>
                                                            </div>
                                                          </Col>
                                                        </Row>
                                                        <div className="container">
                                                          <Row className="form-row">
                                                            <div className="col-md-6">
                                                              <label htmlFor="semesternameEnglish">
                                                                {t("Code Name")}
                                                                :
                                                              </label>
                                                              <div className="d-flex align-items-center">
                                                                <input
                                                                  type="text"
                                                                  id="exampleDataList"
                                                                  list="datalistOptions1"
                                                                  className="form-control"
                                                                  value={
                                                                    selectedValue
                                                                  }
                                                                  onChange={
                                                                    this
                                                                      .handleInputChange
                                                                  }
                                                                  onFocus={
                                                                    this
                                                                      .handleInputFocus
                                                                  }
                                                                  onBlur={
                                                                    this
                                                                      .handleInputBlur
                                                                  }
                                                                  style={{
                                                                    fontSize: 16,
                                                                    padding:
                                                                      "10px",
                                                                    textAlign:
                                                                      "center",
                                                                  }}
                                                                  autoComplete="off"
                                                                />
                                                                <datalist id="datalistOptions1">
                                                                  {filteredCourses
                                                                    .filter(
                                                                      plan =>
                                                                        !allStudyPlans.some(
                                                                          sPlan =>
                                                                            sPlan.courseName ===
                                                                            plan.arCourseName
                                                                        )
                                                                    )
                                                                    .map(
                                                                      plan => (
                                                                        <option
                                                                          key={
                                                                            plan.Id
                                                                          }
                                                                          value={
                                                                            plan.arCourseName +
                                                                            " - " +
                                                                            plan.code
                                                                          }
                                                                        />
                                                                      )
                                                                    )}
                                                                </datalist>
                                                                {showButtons && (
                                                                  <>
                                                                    <Button
                                                                      color="success"
                                                                      id="sucBut"
                                                                      size="sm"
                                                                      onClick={() =>
                                                                        this.handleAddToTable(
                                                                          this
                                                                            .state
                                                                            .selectedValue
                                                                        )
                                                                      }
                                                                    >
                                                                      &#10004;{" "}
                                                                      {/* Checkmark */}
                                                                    </Button>
                                                                    <Button
                                                                      color="danger"
                                                                      size="sm"
                                                                      onClick={
                                                                        this
                                                                          .handleClearInput
                                                                      }
                                                                    >
                                                                      &#10006;{" "}
                                                                      {/* X mark */}
                                                                    </Button>
                                                                  </>
                                                                )}
                                                              </div>
                                                            </div>
                                                          </Row>
                                                          <Row className="form-row">
                                                            <div className="col-md-6">
                                                              <BootstrapTable
                                                                keyField="Id"
                                                                data={
                                                                  studyPlans
                                                                }
                                                                columns={
                                                                  CoursePlanColumns
                                                                }
                                                                noDataIndication={this.props.t(
                                                                  "No Courses Found"
                                                                )}
                                                              />
                                                            </div>
                                                          </Row>
                                                        </div>
                                                      </div>
                                                    </form>
                                                  </CardBody>
                                                </Card>
                                              </div>
                                            </Col>
                                          </Container>
                                        </TabPane>
                                      ))}
                                  </TabContent>
                                </Col>
                              </CardBody>
                            </Card>
                          </Col>
                        </TabPane>

                        <TabPane tabId="8">
                          <Col sm="12">
                            <Card>
                              <CardBody>
                                <Col>
                                  <h5 className="header pt-2" id="title">
                                    {this.props.t("Study Plans")}
                                  </h5>
                                  <div className="accordion" id="accordion">
                                    {reqTypes.map((reqtype, index) => {
                                      const isAccordionOpen =
                                        openAccordionIndices.includes(index);
                                      const planTypeData =
                                        groupedStudyPlans[reqtype.arTitle];

                                      return (
                                        <div
                                          className="accordion-item"
                                          key={reqtype.Id}
                                        >
                                          <h2 className="accordion-header">
                                            <button
                                              className={`accordion-button fw-medium ${
                                                isAccordionOpen
                                                  ? ""
                                                  : "collapsed"
                                              }`}
                                              type="button"
                                              onClick={() =>
                                                this.toggleAccordion(index)
                                              }
                                              style={{ cursor: "pointer" }}
                                            >
                                              <h5>
                                                {this.props.t(reqtype.arTitle)}{" "}
                                                (
                                                {this.props.t("Schedule Hours")}
                                                :{" "}
                                                {planTypeData
                                                  ? planTypeData.totalHours
                                                  : 0}
                                                )
                                              </h5>
                                            </button>
                                          </h2>
                                          <Collapse
                                            isOpen={isAccordionOpen}
                                            className="accordion-collapse"
                                          >
                                            <div className="accordion-body">
                                              {planTypeData &&
                                              planTypeData.courses.length >
                                                0 ? (
                                                <BootstrapTable
                                                  keyField="Id"
                                                  data={planTypeData.courses}
                                                  columns={
                                                    CoursePlanColumnsNoDelete
                                                  }
                                                  noDataIndication={this.props.t(
                                                    "No Courses Found"
                                                  )}
                                                />
                                              ) : (
                                                <p>
                                                  {this.props.t(
                                                    "No Courses Found"
                                                  )}
                                                </p>
                                              )}
                                            </div>
                                          </Collapse>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </Col>
                              </CardBody>
                            </Card>
                          </Col>
                        </TabPane>
                      </TabContent>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </div>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = ({ academiccertificates, studyPlans, reqTypes }) => ({
  academiccertificates: academiccertificates.academiccertificates,
  studyPlans: studyPlans.studyPlans,
  reqTypes: reqTypes.reqTypes,
  filteredCourses: studyPlans.filteredCourses,
  planHours: studyPlans.planHours,
  allStudyPlans: studyPlans.allStudyPlans,
});
const mapDispatchToProps = dispatch => ({
  onGetAcademicCertificates: () => dispatch(getAcademicCertificates()),
  onGetReqTypes: facultyId => dispatch(getReqTypes(facultyId)),
  onGetStudyPlans: (facultyNum, planId, reqTypeId) =>
    dispatch(getStudyPlans(facultyNum, planId, reqTypeId)),
  onGetAllStudyPlans: (facultyNum, planId, reqTypeId) =>
    dispatch(getAllStudyPlans(facultyNum, planId, reqTypeId)),
  onGetFilteredCourses: facultyNum => dispatch(getFilteredCourses(facultyNum)),
  onAddNewStudyPlan: studyPlan => dispatch(addNewStudyPlan(studyPlan)),
  onDeleteStudyPlan: studyPlan => dispatch(deleteStudyPlan(studyPlan)),
  onGetPlanHours: (facultyNum, planId, reqTypeId) =>
    dispatch(getPlanHours(facultyNum, planId, reqTypeId)),
  onAddNewPlanHour: planHour => dispatch(addNewPlanHour(planHour)),
  onUpdatePlanHour: planHour => dispatch(updatePlanHour(planHour)),
  onGeneralizeStudyPlans: (facultyNum, planId, reqTypeId) =>
    dispatch(generalizeStudyPlans(facultyNum, planId, reqTypeId)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(StudyPlansList)));
