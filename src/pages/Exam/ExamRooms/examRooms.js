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
  fetchSetting,
  getMobAppFacultyAccs,
  addNewMobAppFacultyAcc,
  updateMobAppFacultyAcc,
  deleteMobAppFacultyAcc,
} from "store/mob-app-faculty-accs/actions";
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
class MobAppFacultyAccsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      duplicateError: null,
      selectedLevel: null,
      verticalActiveTab: 0,
      currentFacultyId: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
    };
    this.toggleVertical = this.toggleVertical.bind(this);
  }
  toggleVertical(facultyId) {
    const { onGetMobAppFacultyAccs } = this.props;
    const { verticalActiveTab } = this.state;

    // Only update the state if the clicked tab is different from the current active tab
    if (verticalActiveTab !== facultyId) {
      this.setState({
        verticalActiveTab: facultyId,
        currentFacultyId: facultyId,
      });
      onGetMobAppFacultyAccs(facultyId);
    }
  }
  componentDidMount() {
    const {
      studentManagements,
      onfetchSetting,
      mobAppFacultyAccs,
      levels,
      faculties,
      user_menu,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (mobAppFacultyAccs && !mobAppFacultyAccs.length) {
    }
    this.setState({ studentManagements });
    this.setState({ levels });
    this.setState({ faculties });
    onfetchSetting();
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

  handleAddRow = () => {
    const { onAddNewMobAppFacultyAcc, mobAppFacultyAccs } = this.props;
    const { currentFacultyId } = this.state;
    const emptyLevelExists = mobAppFacultyAccs.some(
      row => row.levelId === null
    );
    if (emptyLevelExists) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
      return;
    } else {
      const newRow = {
        facultyId: currentFacultyId,
        AllLogin: 0,
        AllowRegister: 0,
        AllowPay: 0,
      };
      this.setState({ duplicateError: null });
      onAddNewMobAppFacultyAcc(newRow);
    }
  };

  handleDeleteRow = rowId => {
    const { onDeleteMobAppFacultyAcc } = this.props;
    let onDelete = { Id: rowId };
    onDeleteMobAppFacultyAcc(onDelete);
  };

  handleChangeCheckbox = (row, currentStatus, fieldName) => {
    const { onUpdateMobAppFacultyAcc } = this.props;
    const { currentFacultyId } = this.state;
    const newStatus = currentStatus ? 1 : 0;
    let rlogin = row.AllLogin == null ? 0 : row.AllLogin;
    let rAllowRegister = row.AllowRegister == null ? 0 : row.AllowRegister;
    let rAllowPay = row.AllowPay == null ? 0 : row.AllowPay;

    let ob = {
      Id: row.Id,
      levelId: row.levelId,
      facultyId: currentFacultyId,
      AllLogin: fieldName === "AllLogin" ? newStatus : rlogin,
      AllowRegister: fieldName === "AllowRegister" ? newStatus : rAllowRegister,
      AllowPay: fieldName === "AllowPay" ? newStatus : rAllowPay,
    };
    onUpdateMobAppFacultyAcc(ob);
  };
  resetMobAppFacultyAcc = row => {
    const { currentFacultyId } = this.state;
    const { onUpdateMobAppFacultyAcc } = this.props;
    let ob = {};
    ob["Id"] = row.Id;
    ob["levelId"] = row.levelId;
    (ob["facultyId"] = currentFacultyId), (ob["AllLogin"] = 0);
    ob["AllowRegister"] = 0;
    ob["AllowPay"] = 0;

    onUpdateMobAppFacultyAcc(ob);
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
    const { onUpdateMobAppFacultyAcc, mobAppFacultyAccs } = this.props;
    const levelExists = mobAppFacultyAccs.some(
      row => row.levelId === selectedValue
    );
    if (levelExists) {
      return;
    }
    let onUpdate = { Id: rowId, [fieldName]: selectedValue };
    onUpdateMobAppFacultyAcc(onUpdate);
  };
  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };
  render() {
    const {
      selectedLevel,
      duplicateError,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
    } = this.state;
    const { t, studentManagements, mobAppFacultyAccs, levels, faculties } =
      this.props;

    const pageOptions = {
      sizePerPage: 20,
      totalSize: mobAppFacultyAccs.length,
      custom: true,
    };

    const columns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
      {
        dataField: "facultyId",
        text: this.props.t("facultyId"),
        hidden: true,
      },

      {
        dataField: "levelId",
        text: this.props.t("Level"),
        formatter: (cell, row) => (
          <Select
            key={`level_select`}
            options={levels.filter(
              option =>
                !mobAppFacultyAccs.some(row => row.levelId === option.value)
            )}
            onChange={newValue => {
              this.handleSelectChange(row.Id, "levelId", newValue.value);
            }}
            defaultValue={levels.find(opt => opt.value == row.levelId)}
            isDisabled={!showEditButton}
          />
        ),
        editable: false,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },

      {
        key: "AllLogin",
        dataField: "AllLogin",
        text: this.props.t("Allow Login"),
        editable: false,
        formatter: (cellContent, row, column) => (
          <Input
            type="checkbox"
            name="AllowRegister"
            className={`form-check-input input-mini warning}`}
            id="behaviorButton"
            disabled={row.levelId === null || !showEditButton}
            defaultChecked={cellContent == 1}
            onChange={event =>
              this.handleChangeCheckbox(row, event.target.checked, "AllLogin")
            }
          />
        ),
      },
      {
        key: "AllowRegister",
        dataField: "AllowRegister",
        text: this.props.t("Allow Register"),
        editable: false,
        formatter: (cellContent, row, column) => (
          <Input
            type="checkbox"
            name="AllowRegister"
            className={`form-check-input input-mini warning}`}
            id="behaviorButton"
            disabled={row.levelId === null || !showEditButton}
            defaultChecked={cellContent == 1}
            onChange={event =>
              this.handleChangeCheckbox(
                row,
                event.target.checked,
                "AllowRegister"
              )
            }
          />
        ),
      },
      {
        key: "AllowPay",
        dataField: "AllowPay",
        text: this.props.t("Allow Pay"),
        editable: false,
        formatter: (cellContent, row, column) => (
          <Input
            type="checkbox"
            name="AllowRegister"
            className={`form-check-input input-mini warning}`}
            id="behaviorButton"
            disabled={row.levelId === null || !showEditButton}
            defaultChecked={cellContent == 1}
            onChange={event =>
              this.handleChangeCheckbox(row, event.target.checked, "AllowPay")
            }
          />
        ),
      },
      {
        dataField: "reset",
        text: "",
        isDummyField: true,
        editable: false,
        text: this.props.t("Reset"),
        formatter: (cellContent, mobAppFacultyAcc) => (
          <IconButton
            color="primary"
            onClick={() => this.resetMobAppFacultyAcc(mobAppFacultyAcc)}
            id="TooltipTop"
            disabled={mobAppFacultyAcc.levelId === null || !showEditButton}
          >
            <i
              className="bx bx-reset"
              style={{
                color: mobAppFacultyAcc.levelId === null ? "gray" : "",
                pointerEvents:
                  mobAppFacultyAcc.levelId === null ? "none" : "auto",
              }}
            />
          </IconButton>
        ),
      },
      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        hidden: !showDeleteButton,
        formatter: (cellContent, mobAppFacultyAcc) => (
          <IconButton
            color="secondary"
            onClick={() => this.handleDeleteRow(mobAppFacultyAcc.Id)}
          >
            <DeleteIcon style={{ color: "red" }} />
          </IconButton>
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
            <Breadcrumbs
              title={t("Mobile Application")}
              breadcrumbItem={t("Faculty Access Management")}
            />

            <div className="checkout-tabs">
              <Row>
                <Col lg="2">
                  <Nav pills className="flex-column">
                    {faculties.map(faculty => (
                      <NavItem
                        className="justify-content-center"
                        key={faculty.Id}
                        navlink={faculty.Id}
                      >
                        <NavLink
                          className={classnames({
                            active: this.state.verticalActiveTab === faculty.Id,
                          })}
                          onClick={() => {
                            this.toggleVertical(faculty.Id);
                          }}
                        >
                          <p className="font-weight-bold m-1 pt-2 ">
                            <span style={{ fontWeight: "bold" }}>
                              {faculty.title}
                            </span>
                          </p>
                        </NavLink>
                      </NavItem>
                    ))}
                  </Nav>
                </Col>

                <Col lg="10">
                  <TabContent
                    activeTab={this.state.verticalActiveTab}
                    className="text-muted mt-4 mt-md-0"
                  >
                    {faculties.map(faculty => (
                      <TabPane key={faculty.Id} tabId={faculty.Id}>
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
                                data={mobAppFacultyAccs}
                                columns={columns}
                                filter={filterFactory()}
                                cellEdit={cellEditFactory({
                                  mode: "click",
                                  blurToSave: true,
                                })}
                                noDataIndication={this.props.t(
                                  "No Students found"
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
  mobAppFacultyAccs,
  studentManagements,
  levels,
  menu_items,
}) => ({
  mobAppFacultyAccs: mobAppFacultyAccs.mobAppFacultyAccs,
  studentManagements: studentManagements.studentManagements,
  levels: levels.levels,
  faculties: mobAppFacultyAccs.faculties,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onfetchSetting: () => dispatch(fetchSetting()),

  onGetMobAppFacultyAccs: facultyId =>
    dispatch(getMobAppFacultyAccs(facultyId)),
  onAddNewMobAppFacultyAcc: mobAppFacultyAcc =>
    dispatch(addNewMobAppFacultyAcc(mobAppFacultyAcc)),
  onUpdateMobAppFacultyAcc: mobAppFacultyAcc =>
    dispatch(updateMobAppFacultyAcc(mobAppFacultyAcc)),
  onDeleteMobAppFacultyAcc: mobAppFacultyAcc =>
    dispatch(deleteMobAppFacultyAcc(mobAppFacultyAcc)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(MobAppFacultyAccsList));
