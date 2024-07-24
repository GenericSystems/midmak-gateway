import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import { CardBody, Container, Form, Input } from "reactstrap";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Row, Col, Alert, Button } from "reactstrap";
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";
import { connect } from "react-redux";
import { isEmpty, size, map } from "lodash";
import { Card, CardContent, Typography, Stack, TextField } from "@mui/material";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import Select from "react-select";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import cellEditFactory from "react-bootstrap-table2-editor";
import Tooltip from "@mui/material/Tooltip";
import BootstrapTable from "react-bootstrap-table-next";
import {
  getTransportLines,
  getStdsTransportLine,
  addNewStdTransportLine,
  updateStdTransportLine,
  deleteStdTransportLine,
  getTransportLineDetails,
  getStdTransportLineDeletedValue,
  getUnivStdDataList
} from "store/transportLines/actions";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import { Height } from "@mui/icons-material";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../utils/menuUtils";

import { getCurrentSemester } from "store/semesters/actions";
import transportLines from "store/transportLines/reducer";

class StdsTransportLine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transportLines: [],
      transportLine: [],
      openForm: false,

      newTransportLine: "",

      addingTransportLine: false,

      editingTransportLine: false,

      expandedNodes: ["1"],

      deleteModal: false,
      deleteModalTable: false,
      selectedTransportLine: null,
      selectedTransportLineId: null,
      year1: "",
      year2: "",

      editTransportLine: "",
      editeYear1: "",
      editeYear2: "",

      Id: "",
      transportLineActive: 0,
      selectedRowId: null,
      transLineId: null,
      duplicateError: "",
      showAlert: null,
      transportLine: null,
      successMessageTable: "",
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
      selectedSemester: null,
    };
    this.handleEditTransportLine = this.handleEditTransportLine.bind(this);
    this.handleTransportLineDataChange =
      this.handleTransportLineDataChange.bind(this);
    this.handleSaveTransportLine = this.handleSaveTransportLine.bind(this);
  }

  componentDidMount() {
    const {
      transportLines,
      onGetTransportLines,
      onGetStdsTransportLine,
      stdsTransportLine,
      deleted,
      deletedDetail,
      user_menu,
      timeLines,
      univStds,
      currentSemester,
      onGetUnivStds
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);

    if (stdsTransportLine && !stdsTransportLine.length) {
      onGetTransportLines() && onGetUnivStds();
    }

    this.setState({
      transportLines,
      stdsTransportLine,
      deleted,
      deletedDetail,
      timeLines,
      currentSemester,
      univStds
    });
  }

  initializeState() {
    const { currentSemester, yearSemesters, onGetStdsTransportLine } =
      this.props;
    const { selectedSemester } = this.state;
    const yearsSemestersModified = yearSemesters.map(item => ({
      label: item.value,
      value: item.key,
      yearId: item.yearId,
      semesterId: item.semesterId,
    }));
    

    this.setState({
      selectedSemester: yearsSemestersModified.find(
        opt => opt.value === currentSemester.cuYearSemesterId
      ),
    });
    onGetStdsTransportLine({ semesterId: currentSemester.cuYearSemesterId });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { currentSemester, yearSemesters, onGetStdsTransportLine } =
      this.props;
    const { selectedSemester } = this.state;
    if (
      (currentSemester &&
        currentSemester.cuYearSemesterId !==
          prevProps.currentSemester.cuYearSemesterId) ||
      yearSemesters !== prevProps.yearSemesters
    ) {
      this.initializeState();
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

  updateShowSearchButton = (menu, pathname) => {
    const showSearchButton = checkIsSearchForPage(menu, pathname);
    this.setState({ showSearchButton });
  };

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

  handleAddTransportLine = () => {
    this.setState({
      addingTransportLine: true,
      transportLineActive: 0,
      editingTransportLine: false,
    });
  };

  handleTransportLineDataChange = (fieldName, value) => {
    const { addingTransportLine } = this.state;

    if (addingTransportLine) {
      this.setState({
        [fieldName]: value,
      });
    } else {
      this.setState({ editTransportLine: value });
    }
  };

 
  handleSelectChangeDetails = (rowId, fieldName, selectedValue) => {
    const { onUpdateTransportLineDetail } = this.props;

    let onUpdate = { Id: rowId, [fieldName]: selectedValue };
    onUpdateTransportLineDetail(onUpdate);
  };
  handleSaveTransportLine = () => {
    const { newTransportLine, year1, year2, transportLineActive } = this.state;
    const { onAddTransportLine, transportLines } = this.props;

    const newRow = {
      title: newTransportLine,
      // fromYearId: year1,
      //  toYearId: year2,
      // active: transportLineActive,
    };

    if (newTransportLine.trim() === "") {
      this.setState({ errorMessage: this.props.t("Field is empty") });
    } else {
      const isDuplicate = transportLines.some(
        item => item.title === newTransportLine
      );

      if (isDuplicate) {
        this.setState({ errorMessage: this.props.t("Duplicate entry found") });
      } else {
        const successSavedMessage = this.props.t("Line saved successfully");
        this.setState({ successMessage: successSavedMessage });

        onAddTransportLine(newRow);

        this.setState({
          newTransportLine: "",
          year1: "",
          year2: "",
        });
      }
      this.handleCloseAdd();
    }
  };

  handleEditTransportLine = letter => {
    const { transportLines } = this.props;

    this.setState({
      transportLine: letter,
      editingTransportLine: true,
      addingTransportLine: false,
      letterId: letter.Id,
      editTransportLine: letter.title,
      editeYear1: letter.fromYearId,
      editeYear2: letter.toYearId,
      //  transportLineActive: letter.active,
    });
  };

  handleSaveUpdate = () => {
    const { onUpdateTransportLine, transportLines } = this.props;

    const {
      letterId,
      editTransportLine,
      editeYear1,
      editeYear2,
      transportLineActive,
    } = this.state;

    const isDuplicateTransportLine = transportLines.some(
      letter =>
        letter.Id &&
        !letterId &&
        letter.title &&
        letter.title.trim() === editTransportLine.trim()
    );

    if (isDuplicateTransportLine) {
      this.setState({ errorMessage: "Duplicate entry found" });
    } else {
      const updatvariable = {
        Id: letterId,
        title: editTransportLine,
        //   fromYearId: editeYear1,
        //  toYearId: editeYear2,
        //   active: transportLineActive,
      };
      onUpdateTransportLine(updatvariable);
      this.handleCloseUpdate;
    }
  };

  onClickDeleteTransportLine = letter => {
    this.setState({ selectedTransportLineId: letter.Id, deleteModal: true });
    this.setState({ selectedTransportLine: letter });
  };

  handleDeleteTransportLine = () => {
    const { selectedTransportLine } = this.state;
    const { onDeleteTransportLine } = this.props;

    if (selectedTransportLine.Id != undefined) {
      onDeleteTransportLine(selectedTransportLine);
      this.setState({ deleteModal: false, showAlert: true });
    }
  };

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  toggleDeleteModalTable = () => {
    this.setState(prevState => ({
      deleteModalTable: !prevState.deleteModalTable,
    }));
  };
  handleErrorClose = () => {
    this.setState({
      errorMessage: null,
      duplicateError: null,
      errorMessage: null,
    });
  };

  handleSuccessClose = () => {
    this.setState({ successMessage: null });
  };

  handleCloseAdd = () => {
    this.setState({
      addingTransportLine: false,
      newTransportLine: "",
      year1: "",
      year2: "",
    });
  };

  handleOpentable = transLine => {
    const { onGetTransportLineDetails } = this.props;
    onGetTransportLineDetails(transLine.Id);
    this.setState({
      openForm: true,
      transLineId: transLine.Id,
      transportLine: transLine,
    });
  };

  handleCloseUpdate = () => {
    this.setState({ editingTransportLine: false, year1: "", year2: "" });
  };

  handleActiveToggle(transportLine) {
    const { onUpdateTransportLine } = this.props;
    let activeValue = transportLine.active === 1 ? 0 : 1;
    let obj = { Id: transportLine.Id, active: activeValue };
    onUpdateTransportLine(obj);
  }

  handleTransportLinesDetailsDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateTransportLineDetail, transportLineDetails } = this.props;

    const isDuplicate = transportLineDetails.some(
      transportLineDetail =>
        transportLineDetail.Id !== rowId &&
        ((transportLineDetail.letter && transportLineDetail.letter.trim()) ===
          fieldValue.trim() ||
          (transportLineDetail.enTitle &&
            transportLineDetail.enTitle.trim()) === fieldValue.trim())
    );

    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ errorMessage: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateTransportLineDetail(onUpdate);
    } else {
      this.setState({ errorMessage: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateTransportLineDetail(onUpdate);
    }
  };
  handleAddRow = () => {
    const { onAddStdTransportLine, stdsTransportLine, univStds } =
      this.props;
    const { transLineId, currentSemester } = this.state;
    const emptyLevelExists = stdsTransportLine.some(
      row => row.studentId === "" || row.studentId == null
    );

    if (emptyLevelExists) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ errorMessage: errorMessage });
    } else {
      const newRow = {
        semesterId: currentSemester.cuYearSemesterId,
      };

      this.setState({ errorMessage: null });
      onAddStdTransportLine(newRow);
    }
  };
  handleDeleteRow = () => {
    const { onDeleteStdTransportLine } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteStdTransportLine({ Id: selectedRowId });

      this.setState({ selectedRowId: null, deleteModalTable: false });
      this.setState({ showAlert: true });
    }
  };


  onClickDelete = row => {
    this.setState({ selectedRowId: row.Id, deleteModalTable: true });
  };

  handleDeleteSuccessClose = () => {
    const { onGetStdTransportLineDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetStdTransportLineDeletedValue();
  };
  handleDeleteDetailsClose = () => {
    const { onGetTransportLineDetailsDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetTransportLineDetailsDeletedValue();
  };

  handleDeleteErrorClose = () => {
    const { onGetStdTransportLineDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetStdTransportLineDeletedValue();
  };

  handleInputBlur = fieldName => {
    const { selectedStudent, selectedLine } = this.state;

    if (fieldName == "studentId") {
      this.setState({ selectedStudent });
    }

    if (fieldName == "lineId") {
      this.setState({ selectedLine });
    }

  };

  handleInputFocus = fieldName => {
    const { selectedStudent, selectedLine } = this.state;


    if (fieldName == "studentId") {
      this.setState({ selectedStudent });
    }

    if (fieldName == "lineId") {
      this.setState({ selectedLine });
    }
  };

  handleDataListChange = (event, fieldName, rowId) => {

    const { onUpdateStdTransportLine, univStds, transportLines } =
      this.props;
    const { selectedStudent, selectedLine } = this.state;
    const transportLineModified = transportLines.map(line => ({
      key: line.Id,
      value: line.title,
    }));

    const selectedStudentIds = transportLines
    .filter(line => line.studentId !== undefined)
    .map(line => line.studentId);


    const universityStdModified = univStds
      .filter(student => !selectedStudentIds.includes(parseInt(student.key)))
      .map(student => ({
        key: parseInt(student.key),
        value: `${student.value}${student.key}`,
      }));

    const selectedValue = event.target.value;

    let obj = {};
    if (fieldName == "studentId") {
      const studentObj = universityStdModified.find(
        student => student.value === selectedValue
      );

      if (studentObj) {
        obj = { Id: rowId, studentId: studentObj.key };
        onUpdateStdTransportLine(obj);
      }
      this.setState({
        selectedStudent: selectedValue,
        selectedStudentIds: selectedStudentIds
      });
    }

    if (fieldName == "lineId") {
      const lineObj = transportLineModified.find(
        line => line.value === selectedValue
      );

      if (lineObj) {
        obj = { Id: rowId, lineId: lineObj.key };
        onUpdateStdTransportLine(obj);
      }
      this.setState({
        selectedLine: selectedValue,
      });
    }

  };

  handleDataChange = (rowId, fieldName, fieldValue) => {
    if (fieldName == "notes") {
      const { onUpdateStdTransportLine, countries } = this.props;
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateStdTransportLine(onUpdate);
    }
  };

  handleSelectChange = (name, value) => {
    const { onGetStdsTransportLine } = this.props;
    this.setState({ selectedSemester: value });
    console.log("value",value)
    if(value){
      const semesterId = value.value;
      onGetStdsTransportLine({ semesterId: semesterId });
    }
   
  };

  render() {
    const {
      errorMessage,
      successMessage,
      deleteModal,
      deleteModalTable,
      duplicateError,
      showAlert,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
      selectedSemester
    } = this.state;

    const {
      t,
      transportLines,
      stdsTransportLine,
      transportLineDetails,
      deleted,
      deletedDetail,
      timeLines,
      currentSemester,
      yearSemesters,
      univStds
    } = this.props;

    
    const selectedStudentIds = stdsTransportLine
    .filter(line => line.studentId !== null)
    .map(line => line.studentId);


    const universityStdModified = univStds
    .filter(student => !selectedStudentIds.includes(parseInt(student.key)))
    .map(student => ({
      key: parseInt(student.key),
      value: `${student.value}${student.key}`,
    }));

    const universityStdOpt = univStds
      .map(student => ({
        key: parseInt(student.key),
        value: `${student.value}${student.key}`,
      }));
  
    console.log("universityStdModified",universityStdModified)
    console.log("univStds",univStds)

    const yearsSemestersModified = yearSemesters.map(item => ({
      label: item.value,
      value: item.key,
      yearId: item.yearId,
      semesterId: item.semesterId,
    }));

    const transportLineModified = transportLines.filter(line => line.active === 1)  
    .map(line => ({
      key: line.Id,
      value: line.title,
    }));

    const { SearchBar } = Search;

    const alertMessage =
      deleted == 0
        ? "Can't Delete (Delete data related to it)"
        : "Deleted Successfully";
    const alertMessageDetail =
      deletedDetail == 0
        ? "Can't Delete (Delete data related to it)"
        : "Deleted Successfully";
    const columns = [
      { dataField: "Id", text: t("ID"), hidden: true },
      {
        dataField: "studentId",
        text: t("Student Name"),
        sort: true,
        formatter: (cell, row) => (
          <div>
            <Input
              type="text"
              name="studentId"
              id="student"
              list="studentdatalistOptions"
              placeholder="Type to search..."
              className={"form-control"}
              onBlur={() => this.handleInputBlur("studentId")}
              onFocus={() => this.handleInputFocus("studentId")}
              onChange={event =>
                this.handleDataListChange(event, "studentId", row.Id)
              }
              defaultValue={
                (
                    universityStdOpt.find(
                    student => student.key === row.studentId
                  ) || ""
                ).value
              }
            />
            <datalist id="studentdatalistOptions">
              {universityStdModified.map(student => (
                <option key={student.key} value={student.value} />
              ))}
            </datalist>
          </div>
        ),
        editable: false,
      },
      {
        dataField: "lineId",
        text: t("Transport Line"),
        sort: true,
        formatter: (cell, row) => (
          <div>
            <Input
              type="text"
              name="lineId"
              id="line"
              list="linedatalistOptions"
              placeholder="Type to search..."
              className={"form-control"}
              onBlur={() => this.handleInputBlur("lineId")}
              onFocus={() => this.handleInputFocus("lineId")}
              onChange={event =>
                this.handleDataListChange(event, "lineId", row.Id)
              }
              defaultValue={
                (
                  transportLineModified.find(line => line.key === row.lineId) ||
                  ""
                ).value
              }
            />
            <datalist id="linedatalistOptions">
              {transportLineModified.map(line => (
                <option key={line.key} value={line.value} />
              ))}
            </datalist>
          </div>
        ),
        editable: false,
      },

      {
        dataField: "notes",
        text: "Notes",
        sort: true,
        editable: showEditButton,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },
      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        hidden: !showDeleteButton,
        formatter: (cellContent, country) => (
          <Link className="text-danger" to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => this.onClickDelete(country)}
            ></i>
          </Link>
        ),
      },
    ];

    const defaultSorting = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: stdsTransportLine.length,
      custom: true,
    };

    return (
      <div className="page-content">
        <Container fluid>
          <Row>
            <Breadcrumbs
              title={t("Grades")}
              breadcrumbItem={t("Transportation Lines")}
            />
            <div>
              <DeleteModal
                show={deleteModal}
                onDeleteClick={this.handleDeleteTransportLine}
                onCloseClick={() => this.setState({ deleteModal: false })}
              />
              <DeleteModal
                show={deleteModalTable}
                onDeleteClick={this.handleDeleteRow}
                onCloseClick={() =>
                  this.setState({
                    deleteModalTable: false,
                    selectedRowId: null,
                  })
                }
              />
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
                    onClick={this.handleErrorClose}
                  ></button>
                </Alert>
              )}
              {successMessage && (
                <Alert
                  color="success"
                  className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                  role="alert"
                >
                  {successMessage}
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={this.handleSuccessClose}
                  ></button>
                </Alert>
              )}
              {deleted == 0 && showAlert && (
                <Alert
                  color="danger"
                  className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                  role="alert"
                >
                  {alertMessage}
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={this.handleDeleteErrorClose}
                  ></button>
                </Alert>
              )}
              {deleted == 1 && showAlert && (
                <Alert
                  color="success"
                  className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                  role="alert"
                >
                  {alertMessage}
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={this.handleDeleteSuccessClose}
                  ></button>
                </Alert>
              )}
            </div>

            <Card>
              <CardBody>
                <div className="table-responsive">
                  <PaginationProvider
                    pagination={paginationFactory(pageOptions)}
                    keyField="Id"
                    columns={columns}
                    data={stdsTransportLine}
                  >
                    {({ paginationProps, paginationTableProps }) => (
                      <ToolkitProvider
                        keyField="Id"
                        data={stdsTransportLine}
                        columns={columns}
                        search
                      >
                        {toolkitprops => (
                          <React.Fragment>
                            <Row>
                              <Col sm="4">
                                <div className="search-box ms-2 mb-2 d-inline-block">
                                  <div className="position-relative">
                                    <SearchBar {...toolkitprops.searchProps} />
                                  </div>
                                </div>
                              </Col>
                              <Col lg="3">
                                <Select
                                  className="select-style-semesterId"
                                  name="semesterId"
                                  key={`semesterId`}
                                  options={yearsSemestersModified}
                                  onChange={newValue => {
                                    this.handleSelectChange(
                                      "semesterId",
                                      newValue
                                    );
                                  }}
                                  value={selectedSemester}
                                />
                                <br />
                              </Col>
                              <Col sm="4">
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
                              </Col>
                            </Row>

                            <BootstrapTable
                              keyField="Id"
                              {...toolkitprops.baseProps}
                              {...paginationTableProps}
                              data={stdsTransportLine}
                              columns={columns}
                              filter={filterFactory()}
                              filterPosition="top"
                              cellEdit={cellEditFactory({
                                mode: "click",
                                blurToSave: true,
                                afterSaveCell: (
                                  oldValue,
                                  newValue,
                                  row,
                                  column
                                ) => {
                                  this.handleDataChange(
                                    row.Id,
                                    column.dataField,
                                    newValue
                                  );
                                },
                              })}
                              noDataIndication={t("No stdsTransportLine found")}
                              defaultSorted={defaultSorting}
                            />
                            <Col className="pagination pagination-rounded justify-content-end mb-2">
                              <PaginationListStandalone {...paginationProps} />
                            </Col>
                          </React.Fragment>
                        )}
                      </ToolkitProvider>
                    )}
                  </PaginationProvider>
                </div>
              </CardBody>
            </Card>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = ({
  transportLines,
  menu_items,
  generalManagements,
  timeLines,
  semesters,
}) => ({
  transportLines: transportLines.transportLines,
  deleted: transportLines.deleted,
  stdsTransportLine: transportLines.stdsTransportLine,
  user_menu: menu_items.user_menu || [],
  timeLines: timeLines.timeLines,
  univStds: transportLines.univStds,
  currentSemester: semesters.currentSemester,
  yearSemesters: generalManagements.yearSemesters,
});
const mapDispatchToProps = dispatch => ({
  onGetTransportLines: () => dispatch(getTransportLines()),
  onGetUnivStds: () => dispatch(getUnivStdDataList()),
  onGetTransportLineDetails: lineId =>
    dispatch(getTransportLineDetails(lineId)),
  onGetStdsTransportLine: transportLine =>
    dispatch(getStdsTransportLine(transportLine)),
  onAddStdTransportLine: transportLine =>
    dispatch(addNewStdTransportLine(transportLine)),
  onUpdateStdTransportLine: transportLine =>
    dispatch(updateStdTransportLine(transportLine)),
  onDeleteStdTransportLine: transportLine =>
    dispatch(deleteStdTransportLine(transportLine)),
  onGetStdTransportLineDeletedValue: () =>
    dispatch(getStdTransportLineDeletedValue()),
  onGetCurrentSemester: () => dispatch(getCurrentSemester()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(StdsTransportLine));
