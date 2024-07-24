import React, { Component } from "react";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import { connect } from "react-redux";
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
  Tooltip,
} from "reactstrap";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import classnames from "classnames";
import Editable from "react-bootstrap-editable";
import { withTranslation } from "react-i18next";
//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import {
  fetchStudentSetting,
  getStudentManagements,
  addNewStudentManagement,
  updateStudentManagement,
  deleteStudentManagement,
} from "store/studentManagements/actions";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";
class StudentManagementsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentManagements: [],
      studentManagement: "",
      verticalActiveTab: 0,
      currentFacultyId: null,
      showEditButton: false,
      showSearchButton: false,
    };
    this.toggleVertical = this.toggleVertical.bind(this);
  }
  componentDidMount() {
    const {
      studentManagements,
      onGetStudentManagements,
      onfetchStudentSetting,
      faculties,
      currentFacultyId,
      user_menu,
    } = this.props;
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (studentManagements && !studentManagements.length) {
      onfetchStudentSetting();
      this.setState({ studentManagements });
      this.setState({ faculties });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      this.props.user_menu !== prevProps.user_menu ||
      this.props.location.pathname !== prevProps.location.pathname
    ) {
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

  updateShowEditButton = (menu, pathname) => {
    const showEditButton = checkIsEditForPage(menu, pathname);
    this.setState({ showEditButton });
  };

  updateShowSearchButton = (menu, pathname) => {
    const showSearchButton = checkIsSearchForPage(menu, pathname);
    this.setState({ showSearchButton });
  };

  toggleVertical(facultyId) {
    const { onGetStudentManagements } = this.props;

    const { verticalActiveTab, currentFacultyId } = this.state;

    // Only update the state if the clicked tab is different from the current active tab
    if (verticalActiveTab !== facultyId) {
      this.setState({
        verticalActiveTab: facultyId,
        currentFacultyId: facultyId,
      });

      onGetStudentManagements(facultyId);
    }
  }
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

  handleChangeCheckbox = (rowId, currentStatus, fieldName) => {
    const { onUpdateStudentManagement } = this.props;
    const newStatus = currentStatus ? 1 : 0;
    let ob = {};
    ob["Id"] = rowId;
    ob[fieldName] = newStatus;
    onUpdateStudentManagement(ob);
  };

  resetStudentManagement = rowId => {
    const { onUpdateStudentManagement } = this.props;
    let ob = {};
    ob["Id"] = rowId;
    ob["Active"] = 0;
    ob["AllowRegister"] = 0;
    ob["AllowPay"] = 0;
    ob["isException"] = 0;

    onUpdateStudentManagement(ob);
  };

  toggleCheckboxEditMode = () => {
    this.setState(prevState => ({
      checkboxEditable: !prevState.checkboxEditable,
    }));
  };

  render() {
    const { t, studentManagements, faculties } = this.props;
    const { showEditButton, showSearchButton } = this.state;
    const { SearchBar } = Search;
    const columns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
      { dataField: "studentId", text: this.props.t("SID") },
      { dataField: "studentName", text: this.props.t("Name") },
      { dataField: "levelName", text: this.props.t("Level") },

      {
        key: "Active",
        dataField: "Active",
        text: this.props.t("Allow Login"),
        editable: false,
        formatter: (cellContent, row, column) => (
          <Input
            type="checkbox"
            name="Active"
            className={`form-check-input input-mini warning}`}
            id="behaviorButton"
            defaultChecked={cellContent == 1}
            onChange={event =>
              this.handleChangeCheckbox(row.Id, event.target.checked, "Active")
            }
            disabled={!showEditButton}
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
            defaultChecked={cellContent == 1}
            onChange={event =>
              this.handleChangeCheckbox(
                row.Id,
                event.target.checked,
                "AllowRegister"
              )
            }
            disabled={!showEditButton}
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
            name="AllowPay"
            className={`form-check-input input-mini warning}`}
            id="behaviorButton"
            defaultChecked={cellContent == 1}
            onChange={event =>
              this.handleChangeCheckbox(
                row.Id,
                event.target.checked,
                "AllowPay"
              )
            }
            disabled={!showEditButton}
          />
        ),
      },
      {
        key: "isException",
        dataField: "isException",
        text: this.props.t("Exception"),
        editable: false,
        formatter: (cellContent, row, column) => (
          <Input
            type="checkbox"
            name="isException"
            className={`form-check-input1 input-mini warning}`}
            id="behaviorButton"
            defaultChecked={cellContent == 1}
            onChange={event =>
              this.handleChangeCheckbox(
                row.Id,
                event.target.checked,
                "isException"
              )
            }
            disabled={!showEditButton}
          />
        ),
      },
      {
        dataField: "reset",
        text: "",
        isDummyField: true,
        editable: false,
        text: this.props.t("Reset"),
        formatter: (cellContent, studentManagement) => (
          <IconButton
            color="primary"
            onClick={() => this.resetStudentManagement(studentManagement.Id)}
            id="TooltipTop"
            disabled={!showEditButton}
          >
            <i className="bx bx-reset" style={{ color: "red" }} />
          </IconButton>
        ),
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: studentManagements.length,
      custom: true,
    };

    return (
      <React.Fragment>
        <div className="page-content">
          <div className="container-fluid">
            <Breadcrumbs
              title={t("Mobile Application")}
              breadcrumbItem={t("Student Access Management")}
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
                            <PaginationProvider
                              pagination={paginationFactory(pageOptions)}
                              keyField="Id"
                              columns={columns}
                              data={studentManagements}
                            >
                              {({ paginationProps, paginationTableProps }) => (
                                <ToolkitProvider
                                  keyField="Id"
                                  data={studentManagements}
                                  columns={columns}
                                  search
                                >
                                  {toolkitprops => (
                                    <React.Fragment>
                                      <Row>
                                        <Col sm="4">
                                          <div className="search-box ms-2 mb-2 d-inline-block">
                                            {showSearchButton && (
                                              <div className="position-relative">
                                                <SearchBar
                                                  {...toolkitprops.searchProps}
                                                />
                                              </div>
                                            )}
                                          </div>
                                        </Col>
                                      </Row>
                                      <br />
                                      <br />
                                      <BootstrapTable
                                        keyField="Id"
                                        {...toolkitprops.baseProps}
                                        {...paginationTableProps}
                                        data={studentManagements}
                                        columns={columns}
                                        noDataIndication={this.props.t(
                                          "No Students found"
                                        )}
                                      />
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
                      </TabPane>
                    ))}
                  </TabContent>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = ({ studentManagements, menu_items }) => ({
  studentManagements: studentManagements.studentManagements,
  faculties: studentManagements.faculties,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onfetchStudentSetting: () => dispatch(fetchStudentSetting()),

  onGetStudentManagements: facultyNum =>
    dispatch(getStudentManagements(facultyNum)),
  onAddNewStudentManagement: studentManagements =>
    dispatch(addNewStudentManagement(studentManagements)),
  onUpdateStudentManagement: studentManagements =>
    dispatch(updateStudentManagement(studentManagements)),
  onDeleteStudentManagement: studentManagements =>
    dispatch(deleteStudentManagement(studentManagements)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(StudentManagementsList));
