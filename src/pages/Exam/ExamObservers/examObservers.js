import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Collapse,
  Container,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Alert,
  Input,
} from "reactstrap";
import classnames from "classnames";
import * as moment from "moment";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import {
  getExamObservers,
  addNewExamObserver,
  updateExamObserver,
  deleteExamObserver,
} from "store/examObservers/actions";

import { getDefineExamDates } from "store/Exam/DefineExamDates/actions";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import Select from "react-select";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";
class ExamObserversList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defineExamDates: [],
      defineExamDate: "",
      duplicateError: null,
      selectedLevel: null,
      verticalActiveTab: 0,
      currentDefineExamDatesId: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
      languageState: "",
    };
    this.toggleVertical = this.toggleVertical.bind(this);
  }
  toggleVertical(defineExamDateId) {
    const { onGetExamObservers } = this.props;
    const { verticalActiveTab } = this.state;

    // Only update the state if the clicked tab is different from the current active tab
    if (verticalActiveTab !== defineExamDateId) {
      this.setState({
        verticalActiveTab: defineExamDateId,
        currentDefineExamDatesId: defineExamDateId,
      });
      onGetExamObservers(defineExamDateId);
    }
  }
  componentDidMount() {
    const lang = localStorage.getItem("I18N_LANGUAGE");
    const {
      studentManagements,
      examObservers,
      defineExamDates,
      onGetDefineExamDates,

      levels,
      user_menu,
      i18n,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (examObservers && !examObservers.length) {
    }

    onGetDefineExamDates();
    this.setState({ examObservers });
    this.setState({ defineExamDates });
    console.log("defineExamDates", defineExamDates);
    this.setState({ languageState: lang });

    i18n.on("languageChanged", this.handleLanguageChange);
  }

  handleLanguageChange = lng => {
    const lang = localStorage.getItem("I18N_LANGUAGE");

    if (lang != lng) {
      this.setState({ languageState: lng });
    }
  };

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

  handleAddRow = () => {
    const { onAddNewExamObserver, examObservers } = this.props;
    const { currentDefineExamDatesId } = this.state;
    const emptyLevelExists = examObservers.some(row => row.levelId === null);
    if (emptyLevelExists) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
      return;
    } else {
      const newRow = {
        defineExamDatesId: currentDefineExamDatesId,
        AllLogin: 0,
        AllowRegister: 0,
        AllowPay: 0,
      };
      this.setState({ duplicateError: null });
      onAddNewExamObserver(newRow);
    }
  };

  handleDeleteRow = rowId => {
    const { onDeleteExamObserver } = this.props;
    let onDelete = { Id: rowId };
    onDeleteExamObserver(onDelete);
  };

  handleChangeCheckbox = (row, currentStatus, fieldName) => {
    const { onUpdateExamObserver } = this.props;
    const { currentDefineExamDatesId } = this.state;
    const newStatus = currentStatus ? 1 : 0;
    let ob = {
      Id: row.Id,
      hallId: row.levelId,
      defineExamDateId: currentDefineExamDatesId,
      AllLogin: fieldName === "AllLogin" ? newStatus : rlogin,
      AllowRegister: fieldName === "AllowRegister" ? newStatus : rAllowRegister,
      AllowPay: fieldName === "AllowPay" ? newStatus : rAllowPay,
    };
    onUpdateExamObserver(ob);
  };
  resetExamObserver = row => {
    const { currentDefineExamDatesId } = this.state;
    const { onUpdateExamObserver } = this.props;
    let ob = {};
    ob["Id"] = row.Id;
    ob["levelId"] = row.levelId;
    (ob["defineExamDateId"] = currentDefineExamDatesId), (ob["AllLogin"] = 0);
    ob["AllowRegister"] = 0;
    ob["AllowPay"] = 0;

    onUpdateExamObserver(ob);
  };

  toggleCheckboxEditMode = () => {
    this.setState(prevState => ({
      checkboxEditable: !prevState.checkboxEditable,
    }));
  };

  handleSelectChange = (rowId, fieldName, selectedValue) => {
    this.setState({
      selectedLevel: selectedValue,
    });
    const { onUpdateExamObserver, examObservers } = this.props;
    const levelExists = examObservers.some(
      row => row.levelId === selectedValue
    );
    if (levelExists) {
      return;
    }
    let onUpdate = { Id: rowId, [fieldName]: selectedValue };
    onUpdateExamObserver(onUpdate);
  };
  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleExamObserverDataChange = (rowId, fieldName, fieldValue) => {
    const { examObservers, onUpdateExamObserver } = this.props;

    const isDuplicate = examObservers.some(examObserver => {
      return (
        examObserver.Id !== rowId &&
        examObserver.examCapacity.trim() === fieldValue.trim()
      );
    });

    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateExamObserver(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateExamObserver(onUpdate);
    }
  };

  render() {
    const {
      languageState,
      selectedLevel,
      duplicateError,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
    } = this.state;
    const { t, studentManagements, examObservers, levels, defineExamDates } =
      this.props;
    console.log("DefineExamDates from props:", this.props.defineExamDates);
    const pageOptions = {
      sizePerPage: 20,
      totalSize: examObservers.length,
      custom: true,
    };

    const columns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
      {
        dataField: "defineExamDateId",
        text: this.props.t("defineExamDateId"),
        hidden: true,
      },

      {
        dataField: "hallArName",
        text: this.props.t("Job No."),
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },

      {
        key: "hallNum",
        dataField: "defineExamDateNum",
        text: this.props.t("Employee Name"),
        editable: false,
      },
      {
        key: "buildingArName",
        dataField: "buildingArName",
        text: this.props.t("Job Title"),
        editable: false,
      },
      {
        key: "examCapacity",
        dataField: "examCapacity",
        text: this.props.t("Contract Type"),
        editable: true,
      },
      {
        key: "examCapacity",
        dataField: "examCapacity",
        text: this.props.t("Obs. Count"),
        editable: true,
      },
      {
        dataField: "action",
        text: "",
        //   hidden: !showDeleteButton,
        isDummyField: true,
        editable: false, // Set the "Action" column to not editable
        formatter: (cellContent, examObserver) => (
          <div className="d-flex gap-3">
            <Tooltip title={this.props.t("Attend Status Edit")} placement="top">
              <Link className="text-secondary" to="#">
                <i
                  className="bx bx-bx bxs-report"
                  id="edit"
                  onClick={() => this.handleObserversSchedule(examObserver)}
                ></i>
              </Link>
            </Tooltip>
          </div>
        ),
      },
    ];
    const addButtonStyle = {
      backgroundColor: "#75dfd1",
      color: "#ffffff",
      textAlign: "left",
    };
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            <Breadcrumbs breadcrumbItem={t("Exam Rooms")} />
            <div className="checkout-tabs">
              <Row>
                <Col lg="3">
                  <Nav pills className="flex-column">
                    {defineExamDates.map(defineExamDate => (
                      <NavItem
                        // className="justify-content-center"
                        key={defineExamDate.Id}
                        navlink={defineExamDate.Id}
                      >
                        <NavLink
                          // id="horizontal-home-link"
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active:
                              this.state.verticalActiveTab ===
                              defineExamDate.Id,
                          })}
                          onClick={() => {
                            this.toggleVertical(defineExamDate.Id);
                          }}
                        >
                          <p className="font-weight-bold m-1 pt-2 ">
                            <span style={{ fontWeight: "bold" }}>
                              {languageState === "ar"
                                ? defineExamDate.arTitle
                                : defineExamDate.enTitle}{" "}
                              - (
                              {moment(defineExamDate.startDate).format(
                                "DD/MM/YYYY"
                              )}{" "}
                              -{" "}
                              {moment(defineExamDate.endDate).format(
                                "DD/MM/YYYY"
                              )}
                              )
                            </span>
                          </p>
                        </NavLink>
                      </NavItem>
                    ))}
                  </Nav>
                </Col>
                <Col lg="9">
                  <TabContent
                    activeTab={this.state.verticalActiveTab}
                    className="text-muted mt-4 mt-md-0"
                  >
                    {defineExamDates.map(defineExamDate => (
                      <TabPane
                        key={defineExamDate.Id}
                        tabId={defineExamDate.Id}
                      >
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
                            </div>

                            <div className="table-responsive">
                              {showAddButton && (
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
                              )}
                              <BootstrapTable
                                keyField="Id"
                                // data={defineExamDates.filter(
                                //   d => d.Id === defineExamDate.Id
                                // )}
                                data={examObservers}
                                columns={columns}
                                filter={filterFactory()}
                                cellEdit={cellEditFactory({
                                  mode: "dbclick",
                                  blurToSave: true,
                                  afterSaveCell: (
                                    oldValue,
                                    newValue,
                                    row,
                                    column
                                  ) => {
                                    this.handleExamObserverDataChange(
                                      row.Id,
                                      column.dataField,
                                      newValue
                                    );
                                  },
                                })}
                                noDataIndication={this.props.t(
                                  "No trainee found"
                                )}
                              />
                            </div>
                          </CardBody>
                        </Card>
                      </TabPane>
                    ))}
                  </TabContent>
                </Col>
              </Row>
            </div>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({
  examObservers,
  academyBuildingStructures,
  studentManagements,
  defineExamDates,
  levels,
  menu_items,
}) => ({
  defineExamDates: academyBuildingStructures.defineExamDates,
  defineExamDates: defineExamDates.defineExamDates,
  examObservers: examObservers.examObservers,
  // studentManagements: studentManagements.studentManagements,
  // levels: levels.levels,
  // faculties: examObservers.faculties,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetExamObservers: defineExamDates =>
    dispatch(getExamObservers(defineExamDates)),
  onGetDefineExamDates: () => dispatch(getDefineExamDates()),
  onAddNewExamObserver: examObserver =>
    dispatch(addNewExamObserver(examObserver)),
  onUpdateExamObserver: examObserver =>
    dispatch(updateExamObserver(examObserver)),
  onDeleteExamObserver: examObserver =>
    dispatch(deleteExamObserver(examObserver)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(ExamObserversList));
