import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import Tooltip from "@mui/material/Tooltip";
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
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";

import Breadcrumbs from "components/Common/Breadcrumb";

import {
  getRelatives,
  addNewRelative,
  updateRelative,
  deleteRelative,
  getRelativeDeletedValue,
  importRelatives,
} from "store/relatives/actions";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import DeleteModal from "components/Common/DeleteModal";
import FileModal from "components/Common/FileModal";
import * as XLSX from "xlsx";
import { isEmpty, size, map } from "lodash";

const RELATIVE_STORAGE_KEY = "editableRelative";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../utils/menuUtils";
class RelativesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      relatives: [],
      relative: "",
      deleteModal: false,
      duplicateError: null,
      fileModal: false,
      fileError: null,
      selectedRowId: null,
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
    };
  }

  componentDidMount() {
    const { relatives, onGetRelatives, deleted, user_menu } =
      this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (relatives && !relatives.length) {
      onGetRelatives();
    }
    this.setState({ relatives });
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



  handleAddRow = () => {
    const { onAddNewRelative, relatives } = this.props;

    const newRow = {
      arTitle: "-----",
      enTitle: "",
    };

    const emptyRowsExist = relatives.some(
      relative => relative.arTitle.trim() === "-----"
    );
    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewRelative(newRow);
    }
  };
  handleDeleteRow = () => {
    const { onDeleteRelative, deleted, errorMessage } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteRelative(selectedRowId);

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  handleRelativeDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateRelative, relatives } = this.props;

    const isDuplicate = relatives.some(
      relative =>
        relative.Id !== rowId &&
        (relative.arTitle.trim() === fieldValue.trim() ||
          relative.enTitle.trim() === fieldValue.trim())
    );

    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateRelative(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateRelative(onUpdate);
    }
  };

  handleAlertClose = () => {
    this.setState({
      duplicateError: null,
      fileError: null,
      deleteAlertSucc: null,
    });
  };

  handleSuccessClose = () => {
    const { onGetRelativeDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetRelativeDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetRelativeDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetRelativeDeletedValue();
  };

  /*   handleChooseFile = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = e => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet); // Default behavior uses first row as keys
      console.log("jsonData", jsonData); // Log the data as array of objects
    };

    reader.readAsArrayBuffer(file);

    this.setState({
      fileModal: false,
    });
  }; */

  /*   handleChooseFile = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData[0] && jsonData[0][0] === 'arTitle' && jsonData[0][1] === 'enTitle') {
        const formattedData = XLSX.utils.sheet_to_json(worksheet); 
        console.log("jsonData", formattedData); 
      } else {
        alert("The first column must be named 'arTitle' and the second column must be named 'enTitle'.");
      }
    };

    reader.readAsArrayBuffer(file);

    this.setState({
      fileModal: false,
    });
  }; */
  
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
          const { onImportRelatives } = this.props;
          onImportRelatives({ fileArray: formattedData });
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
    const { relatives, deleted, t } = this.props;
    const alertMessage =
      deleted == 0
        ? this.props.t("Can't Delete")
        : this.props.t("Deleted Successfully");
    const {
      duplicateError,
      deleteModal,
      showAlert,
      showEditButton,
      showSearchButton,
      showAddButton,
      showDeleteButton,
      fileModal,
      fileError,
    } = this.state;

    console.log("relatives", relatives);

    const { SearchBar } = Search;
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
        text: this.props.t("Relative(ar)"),
        sort: true,
        editable: showEditButton,
      },
      {
        dataField: "enTitle",
        text: "Relative",
        sort: true,
        editable: showEditButton,
      },
      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
        hidden: !showDeleteButton,
        formatter: (cellContent, relative) => (
          <Link className="text-danger" to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => this.onClickDelete(relative)}
            ></i>
          </Link>
        ),
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: relatives.length,
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
              title={this.props.t("Relatives")}
              breadcrumbItem={this.props.t("Relatives List")}
            />

            <Row>
              <Col>
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
                </div>{" "}
                <Card>
                  <CardBody>
                    <div className="table-responsive">
                      <PaginationProvider
                        pagination={paginationFactory(pageOptions)}
                        keyField="Id"
                        columns={columns}
                        data={relatives}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={relatives}
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
                                  data={relatives}
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
                                      this.handleRelativeDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    },
                                  })}
                                  noDataIndication={this.props.t(
                                    "No Relatives found"
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

const mapStateToProps = ({ relatives, menu_items }) => ({
  relatives: relatives.relatives,
  deleted: relatives.deleted,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetRelatives: () => dispatch(getRelatives()),
  onAddNewRelative: relative => dispatch(addNewRelative(relative)),
  onImportRelatives: relative =>
    dispatch(importRelatives(relative)),
  onUpdateRelative: relative => dispatch(updateRelative(relative)),
  onDeleteRelative: relative => dispatch(deleteRelative(relative)),
  onGetRelativeDeletedValue: () => dispatch(getRelativeDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(RelativesList));
