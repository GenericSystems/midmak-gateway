import React, { Component } from "react";
// import {Alert} from "reactstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Alert,
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
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import {
  getGovernorates,
  addNewGovernorate,
  updateGovernorate,
  deleteGovernorate,
  getGovernorateDeletedValue,
  importGovernorates
} from "store/governorate/actions";
import DeleteModal from "components/Common/DeleteModal";
import FileModal from "components/Common/FileModal";
import * as XLSX from "xlsx";
import { isEmpty, size, map } from "lodash";

const GOVERNORATE_STORAGE_KEY = "editableGovernorate";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../utils/menuUtils";
class GovernoratesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      governorates: [],
      governorate: "",
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
      fileModal: false,
      fileError: null,
    };
    this.state = {
      deleteModal: false,
      duplicateError: null,
      selectedRowId: null,
      showAlert: null,
    };
  }

  componentDidMount() {
    const { governorates, onGetGovernorates, deleted, user_menu } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (governorates && !governorates.length) {
      onGetGovernorates();
    }
    this.setState({ governorates, deleted });
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
  handleAddRow = () => {
    const { onAddNewGovernorate, governorates } = this.props;

    const newRow = {
      arTitle: "-----",
      enTitle: "",
    };

    // Check if the same value already exists in the table
    const emptyRowsExist = governorates.some(
      governorates => governorates.arTitle.trim() === "-----"
      // ||
      // governorate.enTitle.trim() === ""
    );

    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewGovernorate(newRow);
    }
  };

  handleDeleteRow = () => {
    const { onDeleteGovernorate } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteGovernorate(selectedRowId);

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };
  handleGovernorateDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateGovernorate, governorates } = this.props;
    const isDuplicate = governorates.some(
      governorate =>
        governorate.Id !== rowId &&
        (governorate.arTitle.trim() === fieldValue.trim() ||
          governorate.enTitle.trim() === fieldValue.trim())
    );

    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateGovernorate(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateGovernorate(onUpdate);
    }
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null, fileError: null, });
  };

  handleSuccessClose = () => {
    const { onGetGovernorateDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetGovernorateDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetGovernorateDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetGovernorateDeletedValue();
  };

  toggleFileModal = () => {
    this.setState(prevState => ({
      fileModal: !prevState.fileModal,
    }));
  };

  onClickFile = () => {
    this.setState({ fileModal: true });
  };
  
  handleChooseFile = event => {
    const file = event.target.files[0];
    const reader = new FileReader();

    const isCSV = file.type === "text/csv" || file.name.endsWith(".csv");

    reader.onload = e => {
      const data = e.target.result;

      if (isCSV) {
        const workbook = XLSX.read(data, { type: "string" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (
          jsonData[0] &&
          jsonData[0][0] === "arTitle" &&
          jsonData[0][1] === "enTitle"
        ) {
          const formattedData = XLSX.utils.sheet_to_json(worksheet);
          console.log("jsonData", formattedData);
          const { onImportGovernorates } = this.props;
          onImportGovernorates({ fileArray: formattedData });
        } else {
          const errorMessage = this.props.t("Column names are not valid");

          this.setState({ fileError: errorMessage });
        }
      } else {
        const errorMessage = this.props.t("File is not csv");

        this.setState({ fileError: errorMessage });
      }
    };

    if (isCSV) {
      reader.readAsText(file, "utf-8");
    } else {
      reader.readAsArrayBuffer(file);
    }

    this.setState({
      fileModal: false,
    });
  };


  render() {
    const { governorates, t, deleted } = this.props;
    const {
      duplicateError,
      deleteModal,
      showAlert,
      showSearchButton,
      showAddButton,
      showEditButton,
      showDeleteButton,
      fileModal,
      fileError,
    } = this.state;
    const { SearchBar } = Search;
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
    const columns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
      {
        dataField: "arTitle",
        text: this.props.t("Governorate(ar)"),
        sort: true,
        editable: showEditButton,
      },
      {
        dataField: "enTitle",
        text: "Governorate ",
        sort: true,
        editable: showEditButton,
      },
      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        hidden: !showDeleteButton,
        formatter: (cellContent, governorate) => (
          <Link className="text-danger" to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => this.onClickDelete(governorate)}
            ></i>
          </Link>
        ),
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: governorates.length,
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
        <FileModal
          show={fileModal}
          onCloseClick={() => this.setState({ fileModal: false })}
          onChooseFile={this.handleChooseFile}
        />
        <div className="page-content">
          <div className="container-fluid">
            <Breadcrumbs
              title={this.props.t("Governorates")}
              breadcrumbItem={this.props.t("Governorates List")}
            />
            <Row>
              <Col>
              <div>
                    {fileError && (
                    <Alert
                      color="danger"
                      className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                      role="alert"
                    >
                      {fileError}
                      <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={this.handleAlertClose}
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
                <Card>
                  <CardBody>
                   
                    <div className="table-responsive">
                      <PaginationProvider
                        pagination={paginationFactory(pageOptions)}
                        keyField="Id"
                        columns={columns}
                        data={governorates}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={governorates}
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
                                  <Col sm="8">
                                    {showAddButton && (
                                      <div className="text-sm-end">
                                              <Tooltip
                                          title={this.props.t("Import File")}
                                          placement="top"
                                        >
                                          <IconButton
                                            color="primary"
                                            onClick={() => this.onClickFile()}
                                          >
                                            <i className="mdi mdi-file-import blue-noti-icon" />
                                          </IconButton>
                                        </Tooltip>
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
                                  data={governorates}
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
                                      this.handleGovernorateDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    },
                                  })}
                                  noDataIndication={this.props.t(
                                    "No Governorates found"
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
              </Col>
            </Row>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ governorates, menu_items }) => ({
  governorates: governorates.governorates,
  deleted: governorates.deleted,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetGovernorates: () => dispatch(getGovernorates()),
  onAddNewGovernorate: governorate => dispatch(addNewGovernorate(governorate)),
  onImportGovernorates: governorate =>
    dispatch(importGovernorates(governorate)),
  onUpdateGovernorate: governorate => dispatch(updateGovernorate(governorate)),
  onDeleteGovernorate: governorate => dispatch(deleteGovernorate(governorate)),
  onGetGovernorateDeletedValue: () => dispatch(getGovernorateDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(GovernoratesList));
