import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import Select from "react-select";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Button,
  Modal,
  ModalHeader,
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
  getGradesVersions,
  addNewGradeVersion,
  updateGradeVersion,
  deleteGradeVersion,
  getGradeVersionDeletedValue,
  addNewVersGrade,
  updateVersGrade,
  deleteVersGrade,
  getVersGrades,
  getRanks,
  getFinishStatuses,
} from "store/gradesVersions/actions";
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
} from "../../utils/menuUtils";
class GradesVersionsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedEstimateId: null,
      selectedFinishStatus: null,
      selectedGradeVersion: null,
      gradesVersions: [],
      VersGrades: [],
      grVersion: "",
      versGrades: "",
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
    };
    this.state = {
      deleteModal: false,
      deleteModal1: false,
      duplicateError: null,
      selectedRowId: null,
      selectedEstimateId: null,
      selectedFinishStatus: null,
      duplicateErrorGrd: null,
      modal: false,
      selectedGradeVersionId: null,
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const {
      gradesVersions,
      VersGrades,
      onGetGradesVersions,
      deleted,
      user_menu,
      ranks,
      statuses,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);

    // if (gradesVersion && !gradesVersions.length) {
    //   onGetGradesVersions();
    // }

    onGetGradesVersions();

    this.setState({ gradesVersions, ranks, statuses, VersGrades });
    console.log("gradesVersionssssssssssssss", gradesVersions);
    this.setState({ deleted });
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
  onClickDelete = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };
  onClickDelete1 = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal1: true });
  };
  handleAddRow = () => {
    console.log("shhhhhhhhhhhh");
    const { onAddNewGradeVersion, gradesVersions } = this.props;

    const newRow = {
      arTitle: "-----",
    };
    console.log("gradesVersionssssssssss", newRow);

    // Check if the same value already exists in the table
    const emptyRowsExist = gradesVersions.some(
      gradesVersions => gradesVersions.arTitle.trim() === "-----"
      // ||
    );

    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewGradeVersion(newRow);
    }
  };
  handleAddVersGradeRow = () => {
    const { onAddNewVersGrade, VersGrades } = this.props;
    const { selectedGradeVersionId } = this.state;
    console.log("Function selectedGradeVersionId");

    console.log("VersGradessssssss:", VersGrades);

    const newRow = {
      grade: "-----",
      gradeVersionId: selectedGradeVersionId,
    };
    console.log("New row to add:", newRow);

    // Safely check for duplicate empty rows
    const emptyRowsExists =
      Array.isArray(VersGrades) &&
      VersGrades.some(
        row =>
          row && typeof row.grade === "string" && row.grade.trim() === "-----"
      );
    console.log("emptyRowsExists:", emptyRowsExists);

    if (emptyRowsExists) {
      console.log(" 0");
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      console.log(" 1");
      this.setState({ duplicateError: null });
      console.log("neeeeeeeeeeeeeeeeeee", newRow);
      onAddNewVersGrade(newRow);
    }
  };
  handleOnClick = gradeVersionRow => {
    const { onGetVersGrades, onGetRanks, onGetFinishStatus } = this.props;

    console.log("Selected GradeVersion Row:", gradeVersionRow);

    this.setState({
      VersGrades: "",
      isOpen: true,
      selectedGradeVersionId: gradeVersionRow.Id,
    });
    console.log(2);
    let obj = { selectedGradeVersionId: gradeVersionRow.Id };
    onGetVersGrades(obj);
    onGetRanks();
    onGetFinishStatus();

    this.toggle();
  };

  handleDeleteRow = () => {
    const { onDeleteGradeVersion } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteGradeVersion(selectedRowId);

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };
  handleDeleteRow1 = () => {
    const { onDeleteVersGrade } = this.props;
    const { selectedRowId } = this.state;
    if (selectedRowId !== null) {
      onDeleteVersGrade(selectedRowId);
      this.setState({
        selectedRowId: null,
        deleteModal1: false,
        showAlert: true,
      });
    }
  };

  handleSelectRank= (rowId, fieldName, value) => {
    this.setState((prevState) => {
      const updatedRows = prevState.rows.map((row) =>
        row.id === rowId ? { ...row, [fieldName]: value } : row
      );
      return { rows: updatedRows };
    });
  };

  handleGradesVersionsDataChange = (rowId, fieldName, fieldValue) => {
    const { gradesVersions, onUpdateGradeVersion } = this.props;

    const isDuplicate = gradesVersions.some(grVersion => {
      return (
        grVersion.Id !== rowId && grVersion.arTitle.trim() === fieldValue.trim()
      );
    });

    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateGradeVersion(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      console.log("onupdateeee", onUpdate);
      onUpdateGradeVersion(onUpdate);
    }
  };

  handleVersGradeDataChange = (rowId, fieldName, fieldValue) => {
    const { VersGrades, onUpdateVersGrade } = this.props;

    const isDuplicate = VersGrades.some(versGrades => {
      return (
        versGrades.Id !== rowId && versGrades.grade.trim() === fieldValue.trim()
      );
    });

    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateVersGrade(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      console.log("onupdateeee", onUpdate);
      onUpdateVersGrade(onUpdate);
    }
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleSelectFaculty(rowId, fieldName, newValue) {
    // const { onUpdateGradesVersions } = this.props;
    const onUpdate = { Id: rowId, [fieldName]: newValue };
    // onUpdateGradesVersions(onUpdate);
  }

  handleSuccessClose = () => {
    const { onGetGradeVersionDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetGradeVersionDeletedValue();
  };

  handleErrorClose = () => {
    const { ongetGradeVersionDeletedValue } = this.props;
    this.setState({ showAlert: null });
    ongetGradeVersionDeletedValue();
  };

  render() {
    const { gradesVersions, t, deleted, VersGrades } = this.props;
    const {
      selectedEstimateId,
      selectedFinishStatus,
      duplicateError,
      duplicateErrorGrd,
      deleteModal,
      deleteModal1,
      showAlert,
      modal,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
    } = this.state;
    const { SearchBar } = Search;
    const { ranks, statuses } = this.props;
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
    const gradeRanks = ranks;
    const gradeStatus = statuses;
    const columns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
      {
        dataField: "arTitle",
        text: this.props.t("Version Title (ar)"),
        sort: true,
        //  editable: showEditButton,
      },
      {
        dataField: "enTitle",
        text: "Version Title (en)",
        sort: true,
        //  editable: showEditButton,
      },
      {
        key: "vers-num",
        dataField: "versionNumber",
        text: this.props.t("Version Number"),
        sort: true,
        editable: true,
      },
      {
        dataField: "versionDate",
        text: this.props.t("Version Date"),
        sort: true,
        editable: true,
        editorRenderer: (
          editorProps,
          value,
          row,
          column,
          rowIndex,
          columnIndex
        ) => {
          return (
            <input
              type="date"
              {...editorProps}
              value={value || ""}
              onChange={e => editorProps.onUpdate(e.target.value)}
              className="form-control"
            />
          );
        },
      },
      {
        dataField: "fromYear",
        text: this.props.t("From Year"),
        sort: true,
        editable: true,
      },
      {
        dataField: "toYear",
        text: this.props.t("To Year"),
        sort: true,
        editable: true,
      },
      {
        dataField: "minMark",
        text: this.props.t("Minimum Pass Mark"),
        sort: true,
        editable: true,
      },
      {
        dataField: "uploadFile",
        id: 8,
        key: "file",
        text: this.props.t("Upload Experience Certificate File"),
        editable: false,
        formatter: (cellContent, row) => (
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-primary"
              onClick={event => this.handleupload(row.Id, event)}
            >
              {this.props.t("Upload File")}
            </button>
          </div>
        ),
      },
      {
        dataField: "Add",
        text: "",
        isDummyField: true,
        editable: false,
        formatter: (cell, gradeVersionRow) => (
          <Tooltip title={this.props.t("Add")} placement="top">
            <Link to="#" className="text-secondary">
              <i
                className="mdi mdi-plus-circle blue-noti-icon"
                onClick={() => this.handleOnClick(gradeVersionRow)}
              ></i>
            </Link>
          </Tooltip>
        ),
      },

      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        //  hidden: !showDeleteButton,
        formatter: (cellContent, contractType) => (
          <Tooltip title={this.props.t("Delete")} placement="top">
            <Link className="text-danger" to="#">
              <i
                className="mdi mdi-delete font-size-18"
                id="deletetooltip"
                onClick={() => this.onClickDelete(contractType)}
              ></i>
            </Link>
          </Tooltip>
        ),
      },
    ];
    const columns2 = [
      { dataField: "Id", text: t("ID"), hidden: true },
      {
        dataField: "grade",
        text: t("Grade"),
        sort: true,
        editable: true,
      },
      {
        dataField: "fromPercent",
        text: t("From Percent"),
        sort: true,
        editable: true,
      },
      {
        dataField: "toPercent",
        text: t("To Percent"),
        sort: true,
        editable: true,
      },
      {
        dataField: "points",
        text: t("Points"),
        sort: true,
        editable: true,
      },

      {
        dataField: "estimateId",
        text: t("Rank"),
        formatter: (cell, row) => (
          <Select
            key={`rank_grade_${row.Id}`}
            options={gradeRanks}
            // onChange={newValue => {
            //   this.handleSelectRank(row.Id, "estimateId", newValue.value);
            // }}
            onChange={(e) =>
                  handleSelectChange(row.id, "estimateId", e.target.value)
                }
            value={gradeRanks.find(opt => opt.value == row.estimateId)}
          />
        ),
        editable: false,
      },
      {
        dataField: "finishStatusId",
        text: t("Finish Status"),
        formatter: (cell, row) => (
          <Select
            key={`status_grade_${row.Id}`}
            options={gradeStatus}
            onChange={newValue => {
              this.handleSelectData(row.Id, "finishStatusId", newValue.value);
            }}
            value={gradeStatus.find(opt => opt.value == row.finishStatusId)}
          />
        ),
        editable: false,
      },

      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        // hidden: !showDeleteButton,
        formatter: (cellContent, definePeriod) => (
          <Link className="text-danger" to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => this.onClickDelete1(definePeriod)}
            ></i>
          </Link>
        ),
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: gradesVersions.length,
      custom: true,
    };
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
            <Breadcrumbs breadcrumbItem={this.props.t("GradesVersions")} />
            <Row>
              <Col>
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
                            onClick={this.handleErrorClose}
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
                            onClick={this.handleSuccessClose}
                          ></button>
                        </Alert>
                      )}
                    </div>
                    <div className="table-responsive">
                      <PaginationProvider
                        pagination={paginationFactory(pageOptions)}
                        keyField="Id"
                        columns={columns}
                        data={gradesVersions}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={gradesVersions}
                            columns={columns}
                            search
                          >
                            {toolkitprops => (
                              <React.Fragment>
                                <Row>
                                  <Col sm="4">
                                    <div className="search-box ms-2 mb-2 d-inline-block">
                                      {/*   {showSearchButton && ( */}
                                      <div className="position-relative">
                                        <SearchBar
                                          {...toolkitprops.searchProps}
                                          placeholder={t("Search...")}
                                        />
                                      </div>
                                    </div>
                                  </Col>
                                  {/*    {showAddButton && ( */}
                                  <Col sm="8">
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
                                  </Col>
                                </Row>
                                <BootstrapTable
                                  keyField="Id"
                                  {...toolkitprops.baseProps}
                                  {...paginationTableProps}
                                  data={gradesVersions}
                                  columns={columns}
                                  cellEdit={cellEditFactory({
                                    mode: "dbclick",
                                    blurToSave: true,
                                    afterSaveCell: (
                                      oldValue,
                                      newValue,
                                      row,
                                      column
                                    ) => {
                                      this.handleGradesVersionsDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    },
                                  })}
                                  noDataIndication={this.props.t(
                                    "No GradesVersions found"
                                  )}
                                  defaultSorted={defaultSorting}
                                />
                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </Col>
                                <Modal
                                  isOpen={modal} // your modal state
                                  toggle={this.toggle} // your toggle function
                                  // gradeVersion={this.state.selectedGradeVersion} // now tied to clicked row
                                  // gradeVersionId={
                                  //   this.state.selectedGradeVersionId
                                  // } // FK
                                  size="lg"
                                >
                                  <ModalHeader toggle={this.toggle} tag="h4">
                                    {t("Add Grades Data")}
                                  </ModalHeader>

                                  <ModalBody>
                                    <div style={{ marginBottom: "10px" }}>
                                      <i
                                        className="mdi mdi-plus-circle font-size-24 text-primary"
                                        style={{ cursor: "pointer" }}
                                        onClick={this.handleAddVersGradeRow}
                                        title={t("Add Row")}
                                      ></i>
                                    </div>
                                    <BootstrapTable
                                      keyField="Id"
                                      data={VersGrades}
                                      columns={columns2}
                                      cellEdit={cellEditFactory({
                                        mode: "dbclick",
                                        blurToSave: true,
                                        afterSaveCell: (
                                          oldValue,
                                          newValue,
                                          row,
                                          column
                                        ) => {
                                          this.handleVersGradeDataChange(
                                            //
                                            row.Id,
                                            column.dataField,
                                            newValue
                                          );
                                        },
                                      })}
                                      defaultSorted={[
                                        { dataField: "grade", order: "asc" },
                                      ]}
                                      noDataIndication={this.props.t(
                                        "No Grades Versions found"
                                      )}
                                    />
                                    <DeleteModal
                                      show={deleteModal1}
                                      onDeleteClick={this.handleDeleteRow1}
                                      onCloseClick={() =>
                                        this.setState({
                                          deleteModal1: false,
                                          selectedRowId: null,
                                        })
                                      }
                                    />
                                  </ModalBody>
                                </Modal>
                              </React.Fragment>
                            )}
                          </ToolkitProvider>
                        )}
                      </PaginationProvider>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ gradesVersions, menu_items }) => ({
  gradesVersions: gradesVersions.gradesVersions,
  grVersions: gradesVersions.grVersions,
  ranks: gradesVersions.ranks,
  statuses: gradesVersions.statuses,
  deleted: gradesVersions.deleted,
  VersGrades: gradesVersions.VersGrades,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetGradesVersions: () => dispatch(getGradesVersions()),
  onAddNewGradeVersion: grVersion => dispatch(addNewGradeVersion(grVersion)),
  onUpdateGradeVersion: grVersion => dispatch(updateGradeVersion(grVersion)),
  onDeleteGradeVersion: grVersion => dispatch(deleteGradeVersion(grVersion)),
  onGetGradeVersionDeletedValue: () => dispatch(getGradeVersionDeletedValue()),

  onAddNewVersGrade: versGrade => dispatch(addNewVersGrade(versGrade)),
  onGetVersGrades: versGrade => dispatch(getVersGrades(versGrade)),
  onUpdateVersGrade: versGrade => dispatch(updateVersGrade(versGrade)),
  onDeleteVersGrade: versGrade => dispatch(deleteVersGrade(versGrade)),
  onGetVersGradeDeletedValue: () => dispatch(getVersGradeDeletedValue()),
  onGetRanks: () => dispatch(getRanks()),
  onGetFinishStatus: () => dispatch(getFinishStatuses()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(GradesVersionsList));
