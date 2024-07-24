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
  Label,
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
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { getAcademicCertificates } from "store/academicvertificates/actions";
import { getReqTypes } from "store/req-types/actions";
import ReactApexChart from "react-apexcharts";
import {
  getStudyPlans,
  getFilteredCourses,
  deleteStudyPlan,
  getPlanHours,
  addNewPlanHour,
  updatePlanHour,
  generalizeStudyPlans,
} from "store/study-plans/actions";

import { getTempStudentsStatistics } from "store/students-statistics/actions";
import { getYears } from "store/years/actions";
class StudentsStatisticsDiagrams extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputFocused: false,
      showButtons: false,
      selectedValue: "",
      sidebarOpen: true,
      duplicateError: null,
      selectedRowId: null,
      deleteModal: false,
      showApplicantStd: true,
      showAcceptedStd: false,
      showRegularStd: false,
      showRegisteredStd: false,
      showDropoutStd: false,
      showGraduatedStd: false,
      showAcceptanceRate: false,
      showGraduationRate: false,
      showRegistrationRate: false,
      showDropedoutRate: false,
      
    };
  }

  componentDidMount() {
    const {
      onGetTempStudentsStatistics,
      onGetYears,
      academiccertificates,
      tempStudentsStatistics,
      reqTypes,
      currentSemester,
      years
    } = this.props;
    onGetTempStudentsStatistics({IsAccepted: 0});
    onGetYears()

    this.setState({ academiccertificates, tempStudentsStatistics });
    this.setState({ currentSemester , years});
    this.setState({ reqTypes });
  }
  handleInputChange = event => {
    this.setState({ selectedValue: event.target.value });
  };

  handleDeleteRow = () => {
    const { onDeleteStudyPlan } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteStudyPlan(selectedRowId);

      this.setState({ selectedRowId: null, deleteModal: false });
    }
  };

 
  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  onClickDelete = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };
  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  toggleSidebar() {
    this.setState(prevState => ({
      sidebarOpen: !prevState.sidebarOpen,
    }));
  }

  handleCheckboxClick(clickedCheckboxId, fieldName) {
    const checkboxIds = [
      "btncheck1",
      "btncheck2",
      "btncheck3",
      "btncheck4",
      "btncheck5",
      "btncheck6",
      "btncheck7",
      "btncheck8",
      "btncheck9",
      "btncheck10",
    ];
    checkboxIds.forEach(checkboxId => {
      if (checkboxId === clickedCheckboxId) {
        document.getElementById(checkboxId).checked = true;
      } else {
        document.getElementById(checkboxId).checked = false;
      }
    });

    if (fieldName == "numOfAppStd") {
      this.setState({
        showApplicantStd :true
      })
    }

    if (fieldName == "numOfAcceptedStd") {
      this.setState({
        showApplicantStd :false
      })
    }

    if (fieldName == "fromSemester") {
      this.setState({
        showApplicantStd :false
      })
    }

    if (fieldName == "numOfRegisteredStd") {
      this.setState({
        showApplicantStd :false
      })
    }

    if (fieldName == "numOfDropedoutStd") {
      this.setState({
        showApplicantStd :false
      })
    }

    if (fieldName == "toRegSemester") {
      this.setState({
        showApplicantStd :false
      })
    }

    if (fieldName == "numOfGraduatedStd") {
      this.setState({
        showApplicantStd :false
      })
    }

    if (fieldName == "stdAcceptanceRate") {
      this.setState({
        showApplicantStd :false
      })
    }

    if (fieldName == "stdGraduationRate") {
      this.setState({
        showApplicantStd :false
      })
    }

    if (fieldName == "stdRegistrationRate") {
      this.setState({
        showApplicantStd :false
      })
    }

    if (fieldName == "stdDropedoutRate") {
      this.setState({
        showApplicantStd :false
      })
    }
  }

  render() {
    const { t } = this.props;
    const {
      deleteModal,
      sidebarOpen,
      showAcceptedStd,
      showRegularStd,
      showRegisteredStd,
      showDropoutStd,
      showGraduatedStd,
      showAcceptanceRate,
      showGraduationRate,
      showRegistrationRate,
      showDropedoutRate,
      showApplicantStd,
    } = this.state;
    const { studyPlans, tempStudentsStatistics, currentSemester, years} = this.props;

    // currrent applicant std
    const currentApplicant = tempStudentsStatistics.filter(data => data.yearId === currentSemester.cuYearId);



    

    function generateRandomLightColor() {
      const r = Math.floor(Math.random() * 200) +50;
      const g = Math.floor(Math.random() * 200) +50;
      const b = Math.floor(Math.random() * 200) +50;
      return `rgb(${r}, ${g}, ${b})`;
    }

    const totalCuApplicantStd = currentApplicant.reduce(
      (total, faculty) => total + parseInt(faculty.stdNum),
      0
    );

    const statisticsColumns = [
      { dataField: "facultyId", text: t("ID"), hidden: true },
      {
        dataField: "arTitle",
        text: t("Faculty"),
        sort: true,
        editable: false,
      },
      {
        dataField: "stdNum",
        text: t("Number"),
        sort: true,
        editable: false,
      },
      {
        dataField: "rate",
        text: t("Rate"),
        sort: true,
        editable: false,
      },
     
    ];


    const cuApplicantSeries = currentApplicant.map(data => data.stdNum);
    const cuApplicantOptions = {
      labels:  currentApplicant.map(data => data.arTitle),
      colors:  currentApplicant.map(data => generateRandomLightColor()),
      legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "center",
        verticalAlign: "middle",
        floating: false,
        fontSize: "14px",
        offsetX: 0,
        offsetY: -10,
      },
      responsive: [
        {
          breakpoint: 600,
          options: {
            chart: {
              height: 240,
            },
            legend: {
              show: false,
            },
          },
        },
      ],
   
    };

    const totalCuApplicantRow = {
      Id: "total",
      arTitle: "Total",
      stdNum: totalCuApplicantStd.toString(),
      rate: "",
    };
    currentApplicant.push(totalCuApplicantRow);

// prev applicant std
    const cuYearIndex = years.findIndex(year => year.Id === currentSemester.cuYearId);

    const prevYearId = cuYearIndex > 0 ? years[cuYearIndex - 1].Id : "";

    const prevApplicant = tempStudentsStatistics.filter(data => data.yearId === prevYearId);

    const totalPrevApplicantStd = prevApplicant.reduce(
      (total, faculty) => total + parseInt(faculty.stdNum),
      0
    );

    const prevApplicantSeries = prevApplicant.map(data => data.stdNum);
    const prevApplicantOptions = {
      labels:  prevApplicant.map(data => data.arTitle),
      colors:  prevApplicant.map(data => generateRandomLightColor()),
      legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "center",
        verticalAlign: "middle",
        floating: false,
        fontSize: "14px",
        offsetX: 0,
        offsetY: -10,
      },
      responsive: [
        {
          breakpoint: 600,
          options: {
            chart: {
              height: 240,
            },
            legend: {
              show: false,
            },
          },
        },
      ],
   
    };

    const totalPrevApplicantRow = {
      Id: "total",
      arTitle: "Total",
      stdNum: totalPrevApplicantStd.toString(),
      rate: "",
    };
    prevApplicant.push(totalPrevApplicantRow);


  const defaultSorting = [
    {
      dataField: "id",
      order: "asc",
    },
  ];

  const selectRow = {
    mode: "checkbox",
  };


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
          <div className="container-fluid">
            <Breadcrumbs
              title={t("Academic Warning Rules")}
              breadcrumbItem={t("Academic Warning Rules List")}
            />

            <Card>
              <CardBody>
                <DeleteModal
                  show={deleteModal}
                  onDeleteClick={this.handleDeleteRow}
                  onCloseClick={() =>
                    this.setState({ deleteModal: false, selectedRowId: null })
                  }
                />
                <Row>
                  {sidebarOpen && (
                    <div style={{ width: sidebarOpen ? "14%" : "0" }}>
                      <Card>
                        <CardTitle id="warning_rules_header">
                          {t("Statistics Type")}
                        </CardTitle>
                        <CardBody>
                          <div className="mb-1">
                            <Row>
                              <Col>
                                <input
                                  type="checkbox"
                                  className="btn-check"
                                  id="btncheck1"
                                  autoComplete="off"
                                  defaultChecked={showApplicantStd}
                                  onClick={() =>
                                    this.handleCheckboxClick(
                                      "btncheck1",
                                      "numOfAppStd"
                                    )
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck1"
                                >
                                  {this.props.t("Num of Applicant Students")}
                                </label>
                              </Col>
                            </Row>
                          </div>
                          <div className="mb-1">
                            <Row>
                              <Col>
                                <input
                                  type="checkbox"
                                  className="btn-check"
                                  id="btncheck2"
                                  autoComplete="off"
                                  defaultChecked={showAcceptedStd}
                                  onClick={() =>
                                    this.handleCheckboxClick(
                                      "btncheck2",
                                      "numOfAcceptedStd"
                                    )
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check big-width-check"
                                  htmlFor="btncheck2"
                                >
                                  {this.props.t("Num of Accepted Students")}
                                </label>
                              </Col>
                            </Row>
                          </div>
                          <div className="mb-1">
                            <Row>
                              <Col>
                                <input
                                  type="checkbox"
                                  className="btn-check"
                                  id="btncheck3"
                                  autoComplete="off"
                                  defaultChecked={showRegularStd}
                                  onClick={() =>
                                    this.handleCheckboxClick(
                                      "btncheck3",
                                      "numOfRegularStd"
                                    )
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck3"
                                >
                                  {this.props.t("Num of Regular Students")}
                                </label>
                              </Col>
                            </Row>
                          </div>
                          <div className="mb-1">
                            <Row>
                              <Col>
                                <input
                                  type="checkbox"
                                  className="btn-check"
                                  id="btncheck4"
                                  autoComplete="off"
                                  defaultChecked={showRegisteredStd}
                                  onClick={() =>
                                    this.handleCheckboxClick(
                                      "btncheck4",
                                      "numOfRegisteredStd"
                                    )
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck4"
                                >
                                  {this.props.t("Num of Registered Students")}
                                </label>
                              </Col>
                            </Row>
                          </div>
                          <div className="mb-1">
                            <Row>
                              <Col>
                                <input
                                  type="checkbox"
                                  className="btn-check"
                                  id="btncheck5"
                                  autoComplete="off"
                                  defaultChecked={showDropoutStd}
                                  onClick={() =>
                                    this.handleCheckboxClick(
                                      "btncheck5",
                                      "numOfDropedoutStd"
                                    )
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck5"
                                >
                                  {this.props.t("Num of Dropout Students")}
                                </label>
                              </Col>
                            </Row>
                          </div>
                          <div className="mb-1">
                            <Row>
                              <Col>
                                <input
                                  type="checkbox"
                                  className="btn-check"
                                  id="btncheck6"
                                  autoComplete="off"
                                  defaultChecked={showGraduatedStd}
                                  onClick={() =>
                                    this.handleCheckboxClick(
                                      "btncheck6",
                                      "numOfGraduatedStd"
                                    )
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck6"
                                >
                                  {this.props.t("Num of Graduated Students")}
                                </label>
                              </Col>
                            </Row>
                          </div>
                          <div className="mb-1">
                            <Row>
                              <Col>
                                <input
                                  type="checkbox"
                                  className="btn-check"
                                  id="btncheck7"
                                  autoComplete="off"
                                  defaultChecked={showAcceptanceRate}
                                  onClick={() =>
                                    this.handleCheckboxClick(
                                      "btncheck7",
                                      "stdAcceptanceRate"
                                    )
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck7"
                                >
                                  {this.props.t("Student Acceptance Rate")}
                                </label>
                              </Col>
                            </Row>
                          </div>
                          <div className="mb-1">
                            <Row>
                              <Col>
                                <input
                                  type="checkbox"
                                  className="btn-check"
                                  id="btncheck8"
                                  autoComplete="off"
                                  defaultChecked={showGraduationRate}
                                  onClick={() =>
                                    this.handleCheckboxClick(
                                      "btncheck8",
                                      "stdGraduationRate"
                                    )
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck8"
                                >
                                  {this.props.t("Student Graduation Rate")}
                                </label>
                              </Col>
                            </Row>
                          </div>
                          <div className="mb-1">
                            <Row>
                              <Col>
                                <input
                                  type="checkbox"
                                  className="btn-check"
                                  id="btncheck9"
                                  autoComplete="off"
                                  defaultChecked={showRegistrationRate}
                                  onClick={() =>
                                    this.handleCheckboxClick(
                                      "btncheck9",
                                      "stdRegistrationRate"
                                    )
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck9"
                                >
                                  {this.props.t("Student Registration Rate")}
                                </label>
                              </Col>
                            </Row>
                          </div>
                          <div className="mb-1">
                            <Row>
                              <Col>
                                <input
                                  type="checkbox"
                                  className="btn-check"
                                  id="btncheck10"
                                  autoComplete="off"
                                  defaultChecked={showDropedoutRate}
                                  onClick={() =>
                                    this.handleCheckboxClick(
                                      "btncheck10",
                                      "stdDropedoutRate"
                                    )
                                  }
                                />
                                <label
                                  className="btn btn-outline-primary big-width-check"
                                  htmlFor="btncheck10"
                                >
                                  {this.props.t("Student Dropedout Rate")}
                                </label>
                              </Col>
                            </Row>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  )}

                  <Col lg="auto" className="p-0">
                    <div className="collapse-course">
                      <i
                        onClick={this.toggleSidebar}
                        className="bx bx-menu"
                      ></i>
                    </div>
                  </Col>

                  <Col lg={sidebarOpen ? "" : ""}>
                    {showApplicantStd &&(
                    <Row>
                      <Col lg={6}>
                        <Card>
                          <CardBody>
                            <CardTitle id="add_header">
                              {" "}
                              {this.props.t(
                                "Numbers of students applying for the academic year"
                              )} {currentApplicant? currentApplicant[0].yearName : ""}
                            </CardTitle>
                            <ReactApexChart
                              options={cuApplicantOptions}
                              series={cuApplicantSeries}
                              type="pie"
                              height="320"
                              className="apex-charts"
                            />
                            <Row>
                              <Col xl="12">
                                <div>
                                  <BootstrapTable
                                    keyField="Id"
                                    data={currentApplicant}
                                    columns={statisticsColumns}
                                    cellEdit={cellEditFactory({
                                      mode: "click",
                                      blurToSave: true,
                                    })}
                                    noDataIndication={t("No Study Fees found")}
                                    defaultSorted={defaultSorting}
                                    rowEvents={{
                                      onClick: (e, row, rowIndex, cellName) =>
                                        this.handleClickCell(row),
                                    }}
                                  />
                                </div>
                              </Col>
                            </Row>

{/*                             <Row className="justify-content-center">
                              <Col sm={4}>
                                <div className="text-center">
                                  <h5 className="mb-0 font-size-20">48484</h5>
                                  <p className="text-muted">Activated</p>
                                </div>
                              </Col>
                              <Col sm={4}>
                                <div className="text-center">
                                  <h5 className="mb-0 font-size-20">48652</h5>
                                  <p className="text-muted">Pending</p>
                                </div>
                              </Col>
                              <Col sm={4}>
                                <div className="text-center">
                                  <h5 className="mb-0 font-size-20">85412</h5>
                                  <p className="text-muted">Deactivated</p>
                                </div>
                              </Col>
                            </Row>
 */}
                            
                          </CardBody>
                        </Card>
                      </Col>
                      <Col lg={6}>
                        <Card>
                          <CardBody>
                            <CardTitle id="add_header">
                              {this.props.t(
                                "Numbers of students applying for the academic year"
                              )} {prevApplicant? prevApplicant[0].yearName : ""}
                            </CardTitle>

                            <ReactApexChart
                              options={prevApplicantOptions}
                              series={prevApplicantSeries}
                              type="pie"
                              height="320"
                              className="apex-charts"
                            />

                            <Row>
                              <Col xl="12">
                                <div>
                                  <BootstrapTable
                                    keyField="Id"
                                    data={prevApplicant}
                                    columns={statisticsColumns}
                                    cellEdit={cellEditFactory({
                                      mode: "click",
                                      blurToSave: true,
                                    })}
                                    noDataIndication={t("No Study Fees found")}
                                    defaultSorted={defaultSorting}
                                    rowEvents={{
                                      onClick: (e, row, rowIndex, cellName) =>
                                        this.handleClickCell(row),
                                    }}
                                  />
                                </div>
                              </Col>
                            </Row>
{/* 
                            <Row className="justify-content-center">
                              <Col sm={4}>
                                <div className="text-center">
                                  <h5 className="mb-0 font-size-20">48484</h5>
                                  <p className="text-muted">Activated</p>
                                </div>
                              </Col>
                              <Col sm={4}>
                                <div className="text-center">
                                  <h5 className="mb-0 font-size-20">48652</h5>
                                  <p className="text-muted">Pending</p>
                                </div>
                              </Col>
                              <Col sm={4}>
                                <div className="text-center">
                                  <h5 className="mb-0 font-size-20">85412</h5>
                                  <p className="text-muted">Deactivated</p>
                                </div>
                              </Col>
                            </Row> */}

                          </CardBody>
                        </Card>
                      </Col>
                    </Row>)}
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = ({
  academiccertificates,
  studyPlans,
  reqTypes,
  studentsStatistics,
  semesters,
  years
}) => ({
  tempStudentsStatistics: studentsStatistics.tempStudentsStatistics,
  academiccertificates: academiccertificates.academiccertificates,
  studyPlans: studyPlans.studyPlans,
  reqTypes: reqTypes.reqTypes,
  filteredCourses: studyPlans.filteredCourses,
  planHours: studyPlans.planHours,
  currentSemester: semesters.currentSemester,
  years: years.years,

});
const mapDispatchToProps = dispatch => ({
  onGetCurrentSemester: () => dispatch(getCurrentSemester()),
  onGetYears: () => dispatch(getYears()),
  onGetTempStudentsStatistics: tempStudentsStatistics => dispatch(getTempStudentsStatistics(tempStudentsStatistics)),
  onGetAcademicCertificates: () => dispatch(getAcademicCertificates()),
  onGetReqTypes: () => dispatch(getReqTypes()),
  onGetStudyPlans: (facultyNum, planId, reqTypeId) =>
    dispatch(getStudyPlans(facultyNum, planId, reqTypeId)),
  onGetFilteredCourses: facultyNum => dispatch(getFilteredCourses(facultyNum)),
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
)(withRouter(withTranslation()(StudentsStatisticsDiagrams)));
