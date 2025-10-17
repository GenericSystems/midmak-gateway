import React, { Component } from "react";
import {
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Button,
} from "reactstrap";
import Tooltip from "@mui/material/Tooltip";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import Select from "react-select";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import {
  getRequestsFees,
  addNewRequestFees,
  updateRequestFees,
  deleteRequestFees,
  copyRequestFees,
  getRequestCriteria,
} from "store/requestsFees/actions";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import { withRouter, Link } from "react-router-dom";
import DeleteModal from "components/Common/DeleteModal";

import { getCurrentSemester } from "store/semesters/actions";
import { getFilteredPeriods } from "store/periods/actions";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";
class RequestsFeesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowId: null,
      selectedView: "",
      selectedCurrency: null,
      selectedContent: null,
      selectedPeriod: null,
      selectedSemester: null,
      defaultContent: null,
      selectedFaculty: null,
      errorMessage: null,
      sidebarOpen: true,
      deleteModal: false,
      selectedRowId: null,
    };
    this.toggleSidebar = this.toggleSidebar.bind(this);
  }
  componentDidMount() {
    const {
      requestsFees,
      currencies,
      yearSemesters,
      currentSemester,
      faculties,
      onGetRequestCriteria,
      semesters,
      yearContents,
      periods,
      filteredPeriods,
      requests,
      user_menu,
    } = this.props;
    this.updateShowAddButton(user_menu, "/fees-definition");
    this.updateShowDeleteButton(user_menu, "/fees-definition");
    this.updateShowEditButton(user_menu, "/fees-definition");
    this.updateShowSearchButton(user_menu, "/fees-definition");
    if (requestsFees && !requestsFees.length) {
      const obj = {
        courseId: 0,
      };

      onGetRequestCriteria();
      this.setState({ requestsFees });
      this.setState({ requests });
      this.setState({ currencies });
      this.setState({ faculties });
      this.setState({ yearSemesters });
      this.setState({ currentSemester });
      this.setState({ semesters });
      this.setState({ yearContents, periods, filteredPeriods });
    }
  }

  componentDidUpdate(prevProps) {
    const { currentSemester, yearSemesters } = this.props;
    if (
      (currentSemester &&
        currentSemester.cuYearSemesterId !==
          prevProps.currentSemester.cuYearSemesterId) ||
      yearSemesters !== prevProps.yearSemesters
    ) {
      this.initializeState();
    }
    if (this.props.user_menu !== prevProps.user_menu) {
      this.updateShowAddButton(this.props.user_menu, "/fees-definition");
      this.updateShowDeleteButton(this.props.user_menu, "/fees-definition");
      this.updateShowEditButton(this.props.user_menu, "/fees-definition");
      this.updateShowSearchButton(this.props.user_menu, "/fees-definition");
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

  initializeState() {
    const { currentSemester, yearSemesters, onGetSchedulingLectures } =
      this.props;
    const defaultContent =
      yearSemesters.find(
        opt => opt.value === currentSemester.cuYearSemesterId
      ) || "";
    this.setState({ defaultContent: defaultContent });
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

  handleButtonClick = (fieldName, selectedValue) => {
    const { selectedCurrency, selectedFaculty, selectedSemester } = this.state;
    const { onGetRequestsFees } = this.props;
    this.setState({ selectedView: selectedValue });
    if (selectedValue == "hours") {
      const obj = {
        courseId: selectedCourseId,
        CourseCode: selectedCourseCode,
        active: 1,
      };
      obj[
        "filter"
      ] = `courseId = ${obj.courseId} and code = ''''${obj.CourseCode}'''' and active = ${obj.active}`;
      onGetRequestsFees(obj);
    } else if (selectedValue == "semester") {
      const obj = {
        courseId: selectedCourseId,
        CourseCode: selectedCourseCode,
        active: 1,
      };
      obj[
        "filter"
      ] = `courseId = ${obj.courseId} and code = ''''${obj.CourseCode}'''' and active = ${obj.active} and (totalRequestFees = 0 OR totalRequestFees IS NULL)`;
      onGetRequestsFees(obj);
    }
  };

  handleSelectOption = (fieldName, selectedValue) => {
    const { onGetRequestsFees, onGetFilteredPeriods } = this.props;
    const { selectedCurrency, selectedPeriod } = this.state;
    if (fieldName == "currencyId") {
      this.setState({
        selectedCurrency: selectedValue,
      });
      let obj = {
        currencyId: selectedValue,
        periodId: selectedPeriod,
      };
      onGetRequestsFees(obj);
    }

    if (fieldName == "contentId") {
      this.setState({
        selectedContent: selectedValue,
      });
      let obj = {
        contentId: selectedValue,
      };
      onGetFilteredPeriods(obj);
    }

    if (fieldName == "periodId") {
      this.setState({
        selectedPeriod: selectedValue,
      });
      let obj = {
        currencyId: selectedCurrency,
        periodId: selectedValue,
      };
      onGetRequestsFees(obj);
    }
  };

  handleAddRow = () => {
    const { onAddNewRequestFees, requestsFees } = this.props;
    const { selectedCurrency, selectedPeriod } = this.state;

    if (selectedCurrency && selectedPeriod) {
      const newRow = {
        periodId: selectedPeriod,
        currencyId: selectedCurrency,
      };

      this.setState({ duplicateError: null });
      onAddNewRequestFees(newRow);
    }
  };

  handleCopyRequestFeess = () => {
    const { grantCond, currentFacultyId, selectedSemester } = this.state;
    const { onGetCopyRequestFees, admissionConditions, currentSemester } =
      this.props;

    if (selectedSemester != 0) {
      let ob = {
        facultyId: currentFacultyId,
        YearId: currentYear.value,
      };
      onGetCopyRequestFees(ob);
    } else {
      let ob = {
        facultyId: currentFacultyId,
        YearId: currentYear.value,
        isGrantCond: parseInt(grantCond, 10),
      };
      onGetCopyRequestFees(ob);
    }
  };

  handleRequestFeesDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateRequestFees, requestsFees } = this.props;

    if (fieldName == "requestFee" || fieldName == "requiredAmount") {
      const numericValue = parseFloat(fieldValue);

      if (isNaN(numericValue)) {
        console.error("Entered value is not a number");
        const errorNonNumeric = this.props.t(`Please enter a valid number`);
        this.setState({ errorMessage: errorNonNumeric });
      } else if (numericValue < 0) {
        console.error("Entered value is negative");
        const errorNegativeGrade = this.props.t("You Entered Negative Grade");
        this.setState({ errorMessage: errorNegativeGrade });
      } else {
        const onUpdate = { Id: rowId, [fieldName]: numericValue };
        this.setState({ errorMessage: null });
        onUpdateRequestFees(onUpdate);
      }
    }
  };

  handleSelectRequest = (rowId, fieldName, selectedValue) => {
    const { onUpdateRequestFees } = this.props;
    const { requestsFees } = this.state;

    this.setState({
      selectedRequest: selectedValue,
    });

    let onUpdate = { Id: rowId, [fieldName]: selectedValue };
    onUpdateRequestFees(onUpdate);
  };

  handleErrorClose = () => {
    this.setState({ errorMessage: null });
  };

  toggleSidebar() {
    this.setState(prevState => ({
      sidebarOpen: !prevState.sidebarOpen,
    }));
  }

  handleDeleteRow = () => {
    const { onDeleteRequestFees } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteRequestFees({ Id: selectedRowId.Id });

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  onClickDelete = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };

  handleDataListChange = (event, fieldName, rowId) => {
    const { semesters, onUpdateRequestFees } = this.props;
    const selectedValue = event.target.value;

    if (fieldName == "semesterId") {
      this.setState({
        selectedSemester: selectedValue,
      });

      const semesterObj = semesters.find(
        semester => semester.value === selectedValue
      );
      if (semesterObj) {
        let ob = { Id: rowId, semesterId: semesterObj.key };
        onUpdateRequestFees(ob);
      }
    }
  };

  handleInputFocus = fieldName => {
    const { selectedSemester } = this.state;

    if (fieldName == "semesterId") {
      this.setState({ selectedSemester });
    }
  };

  handleInputBlur = fieldName => {
    const { selectedSemester } = this.state;

    if (fieldName == "semesterId") {
      this.setState({ selectedSemester });
    }
  };

  handleCheckboxChange(isChecked, fieldName, rowId) {
    const { onUpdateRequestFees } = this.props;
    const newStatus = isChecked ? 1 : 0;

    if (fieldName == "isVerifiedAccount") {
      this.setState({
        isVerifiedAccount: newStatus,
      });
    }
    if (fieldName == "isCanceledReqCalc") {
      this.setState({
        isCanceledRequest: newStatus,
      });
    }

    let obj = { Id: rowId, [fieldName]: newStatus };
    onUpdateRequestFees(obj);
  }

  resetRequestFees = row => {
    const { onUpdateRequestFees } = this.props;
    let ob = {
      Id: row.Id,
      requestId: null,
      semesterId: null,
      requestFee: 0,
      requiredAmount: 0,
      isVerifiedAccount: null,
      isCanceledReqCalc: null,
    };

    onUpdateRequestFees(ob);
  };

  render() {
    const {
      requestsFees,
      currencies,
      semesters,
      yearContents,
      periods,
      filteredPeriods,
      requests,
      t,
    } = this.props;
    const {
      selectedCurrency,
      errorMessage,
      sidebarOpen,
      deleteModal,
      selectedContent,
      selectedPeriod,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
    } = this.state;
    const { SearchBar } = Search;

    const defaultSorting = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];

    const requestsFeesColumns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
      {
        dataField: "requestId",
        text: this.props.t("Request type"),
        sort: true,
        editable: false,
        formatter: (cellContent, row) => (
          <Select
            key={`${row.Id}_select`}
            options={requests}
            onChange={newValue => {
              this.handleSelectRequest(row.Id, "requestId", newValue.value);
            }}
            defaultValue={requests.find(opt => opt.value == row.requestId)}
            isDisabled={!showEditButton}
          />
        ),
        headerStyle: { width: "200px" },
        style: { width: "200px" },
      },
      {
        dataField: "semesterId",

        text: this.props.t("Semester"),
        sort: true,
        editable: false,
        formatter: (cell, row) => (
          <div>
            <Input
              type="text"
              name="semesterId"
              id="year-semester"
              list="semesterdatalistOptions"
              placeholder="Type to search..."
              className={"form-control"}
              onBlur={() => this.handleInputBlur("semesterId")}
              onFocus={() => this.handleInputFocus("semesterId")}
              onChange={event =>
                this.handleDataListChange(event, "semesterId", row.Id)
              }
              defaultValue={
                (
                  semesters.find(semester => semester.key === row.semesterId) ||
                  ""
                ).value
              }
              disabled={!showEditButton}
            />
            <datalist id="semesterdatalistOptions">
              {semesters.map(semester => (
                <option key={semester.key} value={semester.value} />
              ))}
            </datalist>
          </div>
        ),
      },
      {
        dataField: "requestFee",
        text: this.props.t("Request Fee"),
        sort: true,
        editable: showEditButton,
        editor: {
          type: "number",
        },
        validator: (newValue, row, column) => {
          if (newValue < 0) {
            return {
              valid: false,
              message: "request fee value must be greater than 0",
            };
          }
          return true;
        },
      },
      {
        dataField: "requiredAmount",
        text: this.props.t("Required Amount"),
        sort: true,
        editable: showEditButton,
        editor: {
          type: "number",
        },
        validator: (newValue, row, column) => {
          if (newValue < 0) {
            return {
              valid: false,
              message: "amount value must be greater than 0",
            };
          }
          return true;
        },
      },
      {
        dataField: "isVerifiedAccount",
        text: this.props.t("Verify the account"),
        editable: false,
        formatter: (cellContent, row, column) => (
          <div className="square-switch">
            <input
              type="checkbox"
              id="square-switch1"
              switch="none"
              checked={row.isVerifiedAccount}
              onChange={event =>
                this.handleCheckboxChange(
                  event.target.checked,
                  "isVerifiedAccount",
                  row.Id
                )
              }
              disabled={!showEditButton}
            />
            <label
              htmlFor="square-switch1"
              data-on-label="Yes"
              data-off-label="No"
            />
          </div>
        ),
      },
      {
        dataField: "isCanceledReqCalc",
        text: this.props.t("Canceled Request"),
        editable: false,
        formatter: (cellContent, row, column) => (
          <div className="square-switch">
            <input
              type="checkbox"
              id="square-switch2"
              switch="none"
              checked={row.isCanceledReqCalc}
              onChange={event =>
                this.handleCheckboxChange(
                  event.target.checked,
                  "isCanceledReqCalc",
                  row.Id
                )
              }
              disabled={!showEditButton}
            />
            <label
              htmlFor="square-switch2"
              data-on-label="Yes"
              data-off-label="No"
            />
          </div>
        ),
      },

      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        formatter: (cellContent, row) => (
          <div className="d-flex gap-3">
            {showDeleteButton && (
              <Tooltip
                title={this.props.t("Delete")}
                onClick={() => this.onClickDelete(row)}
                placement="top"
              >
                <IconButton color="error" id="deletetooltip">
                  <i className="mdi mdi-delete" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip
              title={this.props.t("Reset")}
              onClick={() => this.resetRequestFees(row)}
              placement="top"
            >
              <IconButton color="primary" id="TooltipTop">
                <i className="bx bx-reset" />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={this.props.t("Generalize")}
              //onClick={this.handleGeneralizeRequestFees}
              placement="top"
            >
              <IconButton color="primary">
                <i className="mdi mdi-content-copy blue-noti-icon" />
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
    ];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: requestsFees.length,
      custom: true,
    };

    return (
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
              <div style={{ width: sidebarOpen ? "23%" : "0" }}>
                <div className="mb-3">
                  <Row>
                    <Col lg="4">
                      <Label className="form-label">{t("Currency")}</Label>
                    </Col>
                    <Col lg="8" style={{ width: "37%" }}>
                      <Select
                        className="select-style"
                        name="currencyId"
                        key="currency_select"
                        options={currencies}
                        onChange={newValue =>
                          this.handleSelectOption("currencyId", newValue.value)
                        }
                        defaultValue={currencies.find(
                          opt => opt.label === selectedCurrency
                        )}
                      />
                    </Col>
                  </Row>
                </div>

                <div className="mb-3">
                  <Row>
                    <Col lg="4">
                      <Label className="form-label">
                        {this.props.t("Service Fees")}
                      </Label>
                    </Col>
                    <Col lg="8" style={{ width: "37%" }}>
                      <Select
                        className="select-style"
                        name="contentId"
                        key="semester_select"
                        options={yearContents}
                        onChange={newValue =>
                          this.handleSelectOption("contentId", newValue.value)
                        }
                        defaultValue={yearContents.find(
                          opt => opt.label === selectedContent
                        )}
                      />
                    </Col>
                  </Row>
                </div>

                <div className="mb-3">
                  <Row>
                    <Col lg="4">
                      <Label className="form-label">
                        {this.props.t("Period Fees Requests")}
                      </Label>
                    </Col>
                    <Col lg="8" style={{ width: "37%" }}>
                      <Select
                        className="select-style"
                        name="periodId"
                        key="semester_select"
                        options={filteredPeriods}
                        onChange={newValue =>
                          this.handleSelectOption("periodId", newValue.value)
                        }
                        defaultValue={periods.find(
                          opt => opt.label === selectedPeriod
                        )}
                        style={{ width: "100%" }}
                      />
                    </Col>
                  </Row>
                </div>
              </div>
            )}

            <Col lg="auto" className="p-0">
              <div className="collapse-course">
                <i onClick={this.toggleSidebar} className="bx bx-menu"></i>
              </div>
            </Col>

            <div style={{ width: sidebarOpen ? "74%" : "97%" }}>
              <Card>
                <CardTitle className="definition-tabPanes">
                  <>{this.props.t("Requests Fees")}</>
                </CardTitle>
                <CardBody>
                  <div className="table-responsive">
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="Id"
                      columns={requestsFeesColumns}
                      data={requestsFees}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="Id"
                          data={requestsFees}
                          columns={requestsFeesColumns}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row>
                                <Col sm="3">
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
                                <Col>
                                  <div className="text-sm-end">
                                    <Tooltip
                                      title={this.props.t("Copy")}
                                      onClick={this.handleCopyRequestFeess}
                                      placement="top"
                                    >
                                      <IconButton color="primary">
                                        <i className="mdi mdi-content-copy blue-noti-icon" />
                                      </IconButton>
                                    </Tooltip>
                                    {showAddButton &&
                                      selectedCurrency &&
                                      selectedPeriod && (
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
                                      )}
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <div>
                                  {errorMessage && (
                                    <Alert
                                      color="danger"
                                      className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                      role="alert"
                                    >
                                      {errorMessage}
                                      <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Close"
                                        onClick={this.handleErrorClose}
                                      ></button>
                                    </Alert>
                                  )}
                                </div>
                              </Row>
                              <BootstrapTable
                                keyField="Id"
                                {...toolkitprops.baseProps}
                                {...paginationTableProps}
                                data={requestsFees}
                                columns={requestsFeesColumns}
                                cellEdit={cellEditFactory({
                                  mode: "click",
                                  blurToSave: true,
                                  afterSaveCell: (
                                    oldValue,
                                    newValue,
                                    row,
                                    column
                                  ) => {
                                    if (
                                      column.dataField == "requestFee" ||
                                      "requiredAmount"
                                    ) {
                                      this.handleRequestFeesDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    }
                                  },
                                })}
                                noDataIndication={t("No Requests Fees found")}
                                defaultSorted={defaultSorting}
                              />
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
            </div>
          </Row>
        </CardBody>
      </Card>
    );
  }
}

const mapStateToProps = ({
  requestsFees,
  currencies,
  mobAppFacultyAccs,
  generalManagements,
  semesters,
  periods,
  requests,
  menu_items,
}) => ({
  requestsFees: requestsFees.requestsFees,
  faculties: mobAppFacultyAccs.faculties,
  currencies: currencies.currencies,
  yearSemesters: generalManagements.yearSemesters,
  currentSemester: semesters.currentSemester,
  semesters: semesters.semesters,
  yearContents: requestsFees.yearContents,
  periods: periods.periods,
  filteredPeriods: periods.filteredPeriods,
  requests: requests.requests,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetRequestsFees: requestsFees => dispatch(getRequestsFees(requestsFees)),
  onAddNewRequestFees: requestFees => dispatch(addNewRequestFees(requestFees)),
  onUpdateRequestFees: requestFees => dispatch(updateRequestFees(requestFees)),
  onDeleteRequestFees: requestFees => dispatch(deleteRequestFees(requestFees)),
  onGetRequestCriteria: () => dispatch(getRequestCriteria()),
  onCopyRequestFees: requestFees => dispatch(copyRequestFees(requestFees)),
  onGetCurrentSemester: () => dispatch(getCurrentSemester()),
  onGetFilteredPeriods: contentId => dispatch(getFilteredPeriods(contentId)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(RequestsFeesList));
