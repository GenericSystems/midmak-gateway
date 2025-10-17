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
import TempStudentsChart from "../../generate-SIDs/TempStudentsChart";
import Accordion from "react-bootstrap/Accordion";

import {
  getFinesDefinition,
  addNewFineDefinition,
  updateFineDefinition,
  deleteFineDefinition,
  copyFine,
  getCriteria,
} from "store/finesDefinition/actions";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import { withRouter, Link } from "react-router-dom";
import DeleteModal from "components/Common/DeleteModal";
import OtherChart from "pages/generate-SIDs/OtherChart";
import fines from "pages/Setting/Finances/fines";

import { getCurrentSemester } from "store/semesters/actions";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";
class FinesDefinitionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowId: null,
      selectedView: "",
      selectedCurrency: null,
      selectedSemester: null,
      defaultSemester: null,
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
      finesDefinition,
      fines,
      currencies,
      yearSemesters,
      currentSemester,
      faculties,
      onGetCriteria,
      user_menu,
    } = this.props;
    this.updateShowAddButton(user_menu, "/fees-definition");
    this.updateShowDeleteButton(user_menu, "/fees-definition");
    this.updateShowEditButton(user_menu, "/fees-definition");
    this.updateShowSearchButton(user_menu, "/fees-definition");

    if (finesDefinition && !finesDefinition.length) {
      const obj = {
        courseId: 0,
      };

      onGetCriteria();
      this.setState({ finesDefinition });
      this.setState({ fines });
      this.setState({ currencies });
      this.setState({ faculties });
      this.setState({ yearSemesters });
      this.setState({ currentSemester });
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
    const defaultSemester =
      yearSemesters.find(
        opt => opt.value === currentSemester.cuYearSemesterId
      ) || "";
    this.setState({ defaultSemester: defaultSemester });
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
    const { onGetFinesDefinition } = this.props;
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
      onGetFinesDefinition(obj);
    } else if (selectedValue == "semester") {
      const obj = {
        courseId: selectedCourseId,
        CourseCode: selectedCourseCode,
        active: 1,
      };
      obj[
        "filter"
      ] = `courseId = ${obj.courseId} and code = ''''${obj.CourseCode}'''' and active = ${obj.active} and (totalFineDefinition = 0 OR totalFineDefinition IS NULL)`;
      onGetFinesDefinition(obj);
    }
  };

  handleSelectOption = (fieldName, selectedValue) => {
    const { onGetFinesDefinition, faculties } = this.props;
    const {
      selectedCurrency,
      selectedFaculty,
      selectedSemester,
      defaultSemester,
    } = this.state;
    if (fieldName == "currencyId") {
      this.setState({
        selectedCurrency: selectedValue,
      });
      let obj = {
        currencyId: selectedValue,
        facultyId: selectedFaculty,
        yearSemesterId: defaultSemester["value"],
      };
      onGetFinesDefinition(obj);
    }

    if (fieldName == "semesterId") {
      this.setState({
        defaultSemester: selectedValue,
      });
      let obj = {
        currencyId: selectedCurrency,
        facultyId: selectedFaculty,
        yearSemesterId: selectedValue["value"],
      };
      onGetFinesDefinition(obj);
    }

    if (fieldName == "facultyId") {
      const facultyObj = faculties.find(
        faculty => faculty.value === selectedValue
      );
      if (facultyObj) {
        this.setState({
          selectedFaculty: facultyObj.key,
        });
        let obj = {
          currencyId: selectedCurrency,
          facultyId: facultyObj.key,
          yearSemesterId: defaultSemester["value"],
        };
        onGetFinesDefinition(obj);
      } else if (!facultyObj) {
        this.setState({
          selectedFaculty: null,
        });
        let obj = {
          currencyId: selectedCurrency,
          facultyId: null,
          yearSemesterId: defaultSemester["value"],
        };
        onGetFinesDefinition(obj);
      }
    }
  };

  handleAddRow = () => {
    const { onAddNewFineDefinition, finesDefinition } = this.props;
    const {
      selectedCurrency,
      selectedFaculty,
      selectedSemester,
      defaultSemester,
    } = this.state;

    if (selectedFaculty) {
      const newRow = {
        facultyId: selectedFaculty,
        currencyId: selectedCurrency,
        yearSemesterId: defaultSemester["value"],
      };

      this.setState({ duplicateError: null });
      onAddNewFineDefinition(newRow);
    } else {
      const newRow = {
        currencyId: selectedCurrency,
        yearSemesterId: defaultSemester["value"],
      };

      this.setState({ duplicateError: null });
      onAddNewFineDefinition(newRow);
    }
  };

  handleCopyFines = () => {
    const { grantCond, currentFacultyId, selectedSemester } = this.state;
    const { onGetCopyFine, admissionConditions, currentSemester } = this.props;

    if (selectedSemester != 0) {
      let ob = {
        facultyId: currentFacultyId,
        YearId: currentYear.value,
      };
      onGetCopyFine(ob);
    } else {
      let ob = {
        facultyId: currentFacultyId,
        YearId: currentYear.value,
        isGrantCond: parseInt(grantCond, 10),
      };
      onGetCopyFine(ob);
    }
  };

  handleFineDefinitionDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateFineDefinition, finesDefinition } = this.props;

    if (fieldName == "percentage") {
      const numericValue = parseFloat(fieldValue);

      if (isNaN(numericValue)) {
        console.error("Entered value is not a number");
        const errorNonNumeric = this.props.t(`Please enter a valid number`);
        this.setState({ errorMessage: errorNonNumeric });
      } else if (numericValue > 100) {
        console.error("Entered value is greater than grade value");
        const errorGreaterGrade = this.props.t(`Enter Grade From 0 to 100`);
        this.setState({ errorMessage: errorGreaterGrade });
      } else if (numericValue < 0) {
        console.error("Entered value is negative");
        const errorNegativeGrade = this.props.t("You Entered Negative Grade");
        this.setState({ errorMessage: errorNegativeGrade });
      } else {
        const onUpdate = { Id: rowId, [fieldName]: numericValue };
        this.setState({ errorMessage: null });
        onUpdateFineDefinition(onUpdate);
      }
    }

    if (fieldName == "amount") {
      const onUpdate = { Id: rowId, [fieldName]: fieldValue };
      this.setState({ errorMessage: null });
      onUpdateFineDefinition(onUpdate);
    }

    if (fieldName == "fromdate") {
      const fromDate = new Date(fieldValue).toISOString().split("T")[0];
      const onUpdate = { Id: rowId, [fieldName]: fromDate };
      this.setState({ errorMessage: null });
      onUpdateFineDefinition(onUpdate);
    }

    if (fieldName == "toDate") {
      const fromDate = new Date(fieldValue).toISOString().split("T")[0];
      const onUpdate = { Id: rowId, [fieldName]: fromDate };
      this.setState({ errorMessage: null });
      onUpdateFineDefinition(onUpdate);
    }
  };

  handleSelectFine = (rowId, fieldName, selectedValue) => {
    const { onUpdateFineDefinition } = this.props;
    const { finesDefinition } = this.state;

    this.setState({
      selectedFine: selectedValue,
    });

    let onUpdate = { Id: rowId, [fieldName]: selectedValue };
    onUpdateFineDefinition(onUpdate);
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
    const { onDeleteFineDefinition } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteFineDefinition(selectedRowId);

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

  render() {
    const {
      finesDefinition,
      fines,
      currencies,
      yearSemesters,
      currentSemester,
      faculties,
      t,
    } = this.props;
    const {
      selectedView,
      selectedCurrency,
      selectedSemester,
      defaultSemester,
      selectedFaculty,
      errorMessage,
      sidebarOpen,
      deleteModal,
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

    const columns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
      { dataField: "currency", text: this.props.t("currency"), hidden: true },
      {
        dataField: "yearSemesterName",
        text: this.props.t("yearSemesterName"),
        hidden: true,
      },
      {
        dataField: "facultyName",
        text: this.props.t("facultyName"),
        hidden: true,
      },
      { dataField: "fineName", text: this.props.t("fineName"), hidden: true },
      {
        dataField: "fineId",
        text: this.props.t("Fine"),
        sort: true,
        editable: false,
        formatter: (cellContent, row) => (
          <Select
            key={`${row.Id}_select`}
            options={fines.filter(
              option =>
                !finesDefinition.some(row => row.fineId === option.value)
            )}
            onChange={newValue => {
              this.handleSelectFine(row.Id, "fineId", newValue.value);
            }}
            defaultValue={fines.find(opt => opt.value == row.fineId)}
            isDisabled={!showEditButton}
          />
        ),
        headerStyle: { width: "200px" },
        style: { width: "200px" },
      },
      {
        dataField: "fromdate",

        text: this.props.t("From Date"),
        sort: true,
        editable: false,
        formatter: (cellContent, row, column) => (
          <Input
            className="form-control"
            type="date"
            defaultValue={
              (row.fromdate
                ? new Date(row.fromdate).toISOString().split("T")[0]
                : "") || ""
            }
            onChange={newValue => {
              this.handleFineDefinitionDataChange(
                row.Id,
                "fromdate",
                newValue.target.value
              );
            }}
            disabled={!showEditButton}
          />
        ),
      },
      {
        dataField: "toDate",

        text: this.props.t("To Date"),
        sort: true,
        editable: false,
        formatter: (cellContent, row, column) => (
          <Input
            className="form-control"
            type="date"
            defaultValue={
              (row.toDate
                ? new Date(row.toDate).toISOString().split("T")[0]
                : "") || ""
            }
            onChange={newValue => {
              this.handleFineDefinitionDataChange(
                row.Id,
                "toDate",
                newValue.target.value
              );
            }}
            disabled={!showEditButton}
          />
        ),
      },
      {
        dataField: "percentage",

        text: this.props.t("Percentage"),
        sort: true,
        editable: showEditButton,
        editor: {
          type: "number",
        },
        validator: (newValue, row, column) => {
          if (newValue < 0 || newValue > 100) {
            return {
              valid: false,
              message: "percentage value must be between 0 and 100",
            };
          }
          return true;
        },
      },
      {
        dataField: "amount",
        editable: showEditButton,
        text: this.props.t("Fixed Amount"),
        sort: true,
        editor: {
          type: "number",
        },
      },
      {
        dataField: "delete",
        text: "",
        hidden: !showDeleteButton,
        isDummyField: true,
        editable: false,
        formatter: (cellContent, fine) => (
          <Link className="text-danger" to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => this.onClickDelete(fine)}
            ></i>
          </Link>
        ),
      },
    ];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: finesDefinition.length,
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
                      <Label className="form-label">{t("Semester")}</Label>
                    </Col>
                    <Col lg="8" style={{ width: "37%" }}>
                      <Select
                        className="select-style"
                        name="semesterId"
                        key="semester_select"
                        options={yearSemesters}
                        onChange={newValue =>
                          this.handleSelectOption("semesterId", newValue)
                        }
                        value={defaultSemester}
                      />
                    </Col>
                  </Row>
                </div>

                <div className="mb-3">
                  <Row>
                    <Col lg="4">
                      <Label className="form-label">{t("Faculty")}</Label>
                    </Col>
                    <Col lg="8" style={{ width: "37%" }}>
                      <Input
                        type="text"
                        id="facultyId"
                        key="faculty_select"
                        list="FacultydatalistOptions"
                        className="form-control"
                        placeholder="search.."
                        style={{ width: "200%" }}
                        defaultValue={
                          (
                            faculties.find(
                              faculty => faculty.key === selectedFaculty
                            ) || {}
                          ).value
                        }
                        onChange={event => {
                          this.handleSelectOption(
                            "facultyId",
                            event.target.value
                          );
                        }}
                        autoComplete="off"
                      />

                      <datalist id="FacultydatalistOptions">
                        {faculties.map(faculty => (
                          <option key={faculty.key} value={faculty.value} />
                        ))}
                      </datalist>
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
                  <>{this.props.t("Addition fines")}</>
                </CardTitle>
                <CardBody>
                  <div className="table-responsive">
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="Id"
                      columns={columns}
                      data={finesDefinition}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="Id"
                          data={finesDefinition}
                          columns={columns}
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
                                      onClick={this.handleCopyFines}
                                      placement="top"
                                    >
                                      <IconButton color="primary">
                                        <i className="mdi mdi-content-copy blue-noti-icon" />
                                      </IconButton>
                                    </Tooltip>
                                    {showAddButton && (
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
                                data={finesDefinition}
                                columns={columns}
                                cellEdit={cellEditFactory({
                                  mode: "click",
                                  blurToSave: true,
                                  afterSaveCell: (
                                    oldValue,
                                    newValue,
                                    row,
                                    column
                                  ) => {
                                    this.handleFineDefinitionDataChange(
                                      row.Id,
                                      column.dataField,
                                      newValue
                                    );
                                  },
                                })}
                                noDataIndication={t(
                                  "No Fines Definition found"
                                )}
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
  finesDefinition,
  fines,
  currencies,
  mobAppFacultyAccs,
  generalManagements,
  semesters,
  menu_items,
}) => ({
  finesDefinition: finesDefinition.finesDefinition,
  fines: fines.fines,
  faculties: mobAppFacultyAccs.faculties,
  currencies: currencies.currencies,
  yearSemesters: generalManagements.yearSemesters,
  currentSemester: semesters.currentSemester,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetFinesDefinition: finesDefinition =>
    dispatch(getFinesDefinition(finesDefinition)),
  onAddNewFineDefinition: fineDefinition =>
    dispatch(addNewFineDefinition(fineDefinition)),
  onUpdateFineDefinition: fineDefinition =>
    dispatch(updateFineDefinition(fineDefinition)),
  onDeleteFineDefinition: fineDefinition =>
    dispatch(deleteFineDefinition(fineDefinition)),
  onGetCriteria: () => dispatch(getCriteria()),
  onCopyFine: fineDefinition => dispatch(copyFine(fineDefinition)),
  onGetCurrentSemester: () => dispatch(getCurrentSemester()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(FinesDefinitionList));
