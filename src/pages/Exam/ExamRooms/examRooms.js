import React, { Component } from "react";
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
  getExamRooms,
  addNewExamRoom,
  updateExamRoom,
  deleteExamRoom,
  fetchSettingExam,
} from "store/Exam/ExamRooms/actions";

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
import examRooms from "store/Exam/ExamRooms/reducer";
class ExamRoomsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      examRooms: [],
      examRoom: "",
      defineExamDates: [],
      defineExamDate: "",
      duplicateError: null,
      selectedLevel: null,
      verticalActiveTab: 0,
      currentExamId: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
      modal: false,
      languageState: "",
      selectedHallId: "",
      selectedEaxmId: "",
    };
    this.toggleVertical = this.toggleVertical.bind(this);
  }
  toggleVertical(defineExamDateId) {
    const { onGetExamRooms } = this.props;
    const { verticalActiveTab } = this.state;

    // Only update the state if the clicked tab is different from the current active tab
    if (verticalActiveTab !== defineExamDateId) {
      this.setState({
        verticalActiveTab: defineExamDateId,
        currentExamId: defineExamDateId,
      });
      onGetExamRooms(defineExamDateId);
    }
  }
  componentDidMount() {
    const lang = localStorage.getItem("I18N_LANGUAGE");
    const {
      studentManagements,
      examRooms,
      defineExamDates,
      onfetchSetting,

      levels,
      user_menu,
      i18n,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (examRooms && !examRooms.length) {
    }

    this.setState({ examRooms });
    this.setState({ defineExamDates });
    this.setState({ languageState: lang });
    onfetchSetting();

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

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  toggleLanguage = () => {
    this.setState(prevState => ({
      languageState: prevState.languageState === "ar" ? "en" : "ar",
    }));
  };

  // handleAddRow = () => {
  //   const { onAddNewExamRoom, examRooms } = this.props;
  //   const { currentExamId } = this.state;

  //   const newRow = {
  //     defineExamDatesId: currentExamId,
  //     examCapacity: 0,
  //   };
  //   this.setState({ duplicateError: null });
  //   onAddNewExamRoom(newRow);
  // };

  handleDeleteRow = rowId => {
    const { onDeleteExamRoom } = this.props;
    let onDelete = { Id: rowId };
    onDeleteExamRoom(onDelete);
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleExamRoomDataChange = (row, fieldName, fieldValue) => {
    const { examRooms, onUpdateExamRoom, onAddNewExamRoom, onGetExamRooms } =
      this.props;
    const { currentExamId } = this.state;
    console.log("flattenedHalls", row);
    this.setState({ duplicateError: null });
    const capacity = Number(fieldValue);
    if (!row.Id) {
      const newRow = {
        examDateId: currentExamId,
        hallId: row.hallId,
        examCapacity: capacity,
      };

      onAddNewExamRoom(newRow);
      onGetExamRooms(currentExamId);
    } else {
      let updatedRow = { Id: row.Id, examCapacity: capacity };
      onUpdateExamRoom(updatedRow);
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
      modal,
    } = this.state;
    const { t, studentManagements, examRooms, levels, defineExamDates } =
      this.props;
    const pageOptions = {
      sizePerPage: 20,
      totalSize: examRooms.length,
      custom: true,
    };
    console.log("examRooms", examRooms);

    const columns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: false },
      {
        dataField: "hallName",
        text: this.props.t("Room Name"),
        // formatter: (cell, row) => (
        //   <Select
        //     key={`level_select`}
        //     options={levels.filter(
        //       option => !examRooms.some(row => row.levelId === option.value)
        //     )}
        //     onChange={newValue => {
        //       this.handleSelectChange(row.Id, "levelId", newValue.value);
        //     }}
        //     defaultValue={levels.find(opt => opt.value == row.levelId)}
        //     isDisabled={!showEditButton}
        //   />
        // ),
        editable: false,
        // filter: textFilter({
        //   placeholder: this.props.t("Search..."),
        //   hidden: !showSearchButton,
        // }),
      },

      {
        key: "hallNum",
        dataField: "hallNum",
        text: this.props.t("Room No."),
        editable: false,
        // formatter: (cellContent, row, column) => (
        //   <Input
        //     type="checkbox"
        //     name="AllowRegister"
        //     className={`form-check-input input-mini warning}`}
        //     id="behaviorButton"
        //     disabled={row.levelId === null || !showEditButton}
        //     defaultChecked={cellContent == 1}
        //     onChange={event =>
        //       this.handleChangeCheckbox(row, event.target.checked, "AllLogin")
        //     }
        //   />
        // ),
      },
      {
        key: "buildingName",
        dataField: "buildingName",
        text: this.props.t("Building Name"),
        editable: false,
        // formatter: (cellContent, row, column) => (
        //   <Input
        //     type="checkbox"
        //     name="AllowRegister"
        //     className={`form-check-input input-mini warning}`}
        //     id="behaviorButton"
        //     disabled={row.levelId === null || !showEditButton}
        //     defaultChecked={cellContent == 1}
        //     onChange={event =>
        //       this.handleChangeCheckbox(
        //         row,
        //         event.target.checked,
        //         "AllowRegister"
        //       )
        //     }
        //   />
        // ),
      },
      {
        key: "examCapacity",
        dataField: "examCapacity",
        text: this.props.t("Exam Capacity"),
        editable: true,
      },
      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        hidden: !showDeleteButton,
        // formatter: (cellContent, examRoom) => (
        //   <IconButton
        //     color="secondary"
        //     onClick={() => this.handleDeleteRow(examRoom.Id)}
        //   >
        //     <DeleteIcon style={{ color: "red" }} />
        //   </IconButton>
        // ),
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
                              {/* {showAddButton && ( */}
                              {/* <div className="text-sm-end">
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
                              </div> */}
                              {/* )} */}
                              <BootstrapTable
                                keyField="key"
                                // data={defineExamDates.filter(
                                //   d => d.Id === defineExamDate.Id
                                // )}
                                data={examRooms}
                                columns={columns}
                                filter={filterFactory()}
                                cellEdit={cellEditFactory({
                                  mode: "dbclick",
                                  blurToSave: true,
                                  afterSaveCell: async (
                                    oldValue,
                                    newValue,
                                    row,
                                    column
                                  ) => {
                                    this.handleExamRoomDataChange(
                                      row,
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
  examRooms,
  studentManagements,
  defineExamDates,
  levels,
  menu_items,
}) => ({
  defineExamDates: defineExamDates.defineExamDates,
  examRooms: examRooms.examRooms,
  // studentManagements: studentManagements.studentManagements,
  // levels: levels.levels,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onfetchSetting: () => dispatch(fetchSettingExam()),
  onGetExamRooms: defineExamDates => dispatch(getExamRooms(defineExamDates)),
  onAddNewExamRoom: examRoom => dispatch(addNewExamRoom(examRoom)),
  onUpdateExamRoom: examRoom => dispatch(updateExamRoom(examRoom)),
  onDeleteExamRoom: examRoom => dispatch(deleteExamRoom(examRoom)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(ExamRoomsList));
