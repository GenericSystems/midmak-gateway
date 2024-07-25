import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import DeleteModal from "components/Common/DeleteModal";
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
  CardTitle
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
import Tooltip from "@mui/material/Tooltip";
import {
  getSectors,
  addNewSector,
  updateSector,
  deleteSector,
  getSectorDeletedValue,
} from "store/sectors/actions";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import { isEmpty, size, map } from "lodash";

const SECTOR_STORAGE_KEY = "editableSector";

import Select from "react-select";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";
class SectorsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sectors: [],
      sector: "",
      showAlert: null,
      showAddButton: false,
      showEditButton: false,
      showSearchButton: false,
    };
    this.state = {
      duplicateError: null,
      deleteModal: false,
    };
  }

  componentDidMount() {
    const { sectors, onGetSectors, deleted, user_menu } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    if (sectors && !sectors.length) {
      onGetSectors();

    }
    this.setState({ sectors });
    this.setState({  deleted });
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
    const { onAddNewSector, sectors } = this.props;
    const newRow = {
      arTitle: "-----",

    };

    const emptyRowsExist = sectors.some(
      sector => sector.arTitle.trim() === "-----"
      // ||
      // sector.facultyId.trim() === ""
    );
    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewSector(newRow);
    }
  };

  handleDeleteRow = () => {
    const { onDeleteSector } = this.props;
    const { selectedRowId } = this.state;

    if (selectedRowId !== null) {
      onDeleteSector(selectedRowId);

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };
  handleSectorDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateSector, sectors } = this.props;

    const isDuplicate = sectors.some(
      sector => sector.Id !== rowId && sector.arTitle.trim() === fieldValue.trim()
      // sector.facultyId.trim() === fieldValue.trim())
    );

    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateSector(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateSector(onUpdate);
    }
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleSelectFaculty(rowId, fieldName, selectedValue) {
    const { onUpdateSector } = this.props;
    let onUpdate = { Id: rowId, [fieldName]: selectedValue };
    onUpdateSector(onUpdate);
  }

  handleSuccessClose = () => {
    const { onGetSectorDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetSectorDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetSectorDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetSectorDeletedValue();
  };
  render() {
    const { sectors, t, deleted } = this.props;
    const {
      duplicateError,
      deleteModal,
      showAlert,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
    } = this.state;
    const alertMessage =
      deleted == 0 ? "Can't Delete " : "Deleted Successfully";
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
        text: this.props.t("Sector (ar)"),
        sort: true,
       // editable: showEditButton,
      },
     
      {
        dataField: "enTitle",
        text: this.props.t("Sector"),
        sort: true,
       // editable: showEditButton,
      },
      {
        dataField: "code",
        text: this.props.t("Code"),
        sort: true,
       // editable: showEditButton,
      },
      {
        dataField: "delete",
        text: "",
        isDummyField: true,
        editable: false,
       // hidden: !showDeleteButton,
        formatter: (cellContent, sector) => (
          <Link className="text-danger" to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={() => this.onClickDelete(sector)}
            ></i>
          </Link>
        ),
      },
    ];
    const pageOptions = {
      sizePerPage: 10,
      totalSize: sectors.length,
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
            <Breadcrumbs
              title={this.props.t("Sectors")}
              breadcrumbItem={this.props.t("Sectors List")}
            />

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
                        data={sectors}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={sectors}
                            columns={columns}
                            search
                          >
                            {toolkitprops => (
                              <React.Fragment>
                                <Row>
                                  <Col sm="4">
                                    <div className="search-box ms-2 mb-2 d-inline-block">
                                
                                        <div className="position-relative">
                                          <SearchBar
                                            {...toolkitprops.searchProps}
                                          />
                                        </div>
                               
                                    </div>
                                  </Col>
                                
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
                                  data={sectors}
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
                                      this.handleSectorDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    },
                                  })}
                                  noDataIndication={this.props.t(
                                    "No Sectors found"
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

const mapStateToProps = ({ sectors, menu_items }) => ({
  sectors: sectors.sectors,
  deleted: sectors.deleted,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetSectors: sector => dispatch(getSectors(sector)),
  onAddNewSector: sector => dispatch(addNewSector(sector)),
  onUpdateSector: sector => dispatch(updateSector(sector)),
  onDeleteSector: sector => dispatch(deleteSector(sector)),
  onGetSectorDeletedValue: () => dispatch(getSectorDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(SectorsList));
