import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

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
  Input,
} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";

import Breadcrumbs from "components/Common/Breadcrumb";
import {
  getDocuments,
  addNewDocument,
  updateDocument,
} from "store/documents-types/actions";
//store/documents-types/actions";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import { isEmpty, size, map } from "lodash";
import {
  checkIsAddForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";
class DocumentsTypesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      documents: [],
      documentType: "",
      showAlert: null,
      showAddButton: false,
      showEditButton: false,
      showSearchButton: false,
    };
    this.state = {
      duplicateError: null,
      selectedRowId: null,
    };
  }

  componentDidMount() {
    const { documents, onGetDocuments, user_menu } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);

    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    // if (documentType && !documents.length) {
    //   onGetdocuments();
    // }
    onGetDocuments();

    this.setState({ documents });
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

  handleAddRow = () => {
    const { onAddNewDocumentType, documents } = this.props;
    console.log("documents", documents);

    const newRow = {
      arTitle: "-----",
    };

    // Check if the same value already exists in the table
    const emptyRowsExist = documents.some(
      documents => documents.arTitle.trim() === "-----"
      // ||
      // documentType.enTitle.trim() === ""
    );

    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewDocumentType(newRow);
    }
  };

  handledocumentTypeDataChange = (rowId, fieldName, fieldValue) => {
    const { documents, onUpdateDocumentType } = this.props;

    const isDuplicate = documents.some(documentType => {
      return (
        documentType.Id !== rowId &&
        documentType.arTitle.trim() === fieldValue.trim()
      );
    });

    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateDocumentType(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateDocumentType(onUpdate);
    }
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null });
  };

  handleSelectFaculty(rowId, fieldName, newValue) {
    const { onUpdateDocumentType } = this.props;
    const onUpdate = { Id: rowId, [fieldName]: newValue };
    onUpdateDocumentType(onUpdate);
  }

  render() {
    const { documents, t, deleted } = this.props;
    const {
      duplicateError,

      showAlert,
      showAddButton,

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

    const pageOptions = {
      sizePerPage: 10,
      totalSize: documents?.length || 0, // avoids crash if undefined
      custom: true,
      page: 1,
    };

    const columns = [
      { dataField: "Id", text: "ID", hidden: true },
      {
        dataField: "serial",
        text: "#",
        formatter: (cell, row, rowIndex, extraData) => {
          const currentPage = extraData?.currentPage || 1;
          const sizePerPage = extraData?.sizePerPage || pageOptions.sizePerPage;
          return rowIndex + 1 + (currentPage - 1) * sizePerPage;
        },
        editable: false,
      },
      {
        dataField: "arTitle",
        text: this.props.t("Name(ar)"),
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
      {
        dataField: "enTitle",
        text: this.props.t("Name(en)"),
        sort: true,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
        }),
      },
    ];

    return (
      <React.Fragment>
        <div className="page-content">
          <div className="container-fluid">
            <Breadcrumbs breadcrumbItem={this.props.t("documents")} />
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
                    </div>
                    <div className="table-responsive">
                      <PaginationProvider
                        pagination={paginationFactory(pageOptions)}
                        keyField="Id"
                        columns={columns}
                        data={documents}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={documents}
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
                                            placeholder={t("Search...")}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                  {showAddButton && (
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
                                  )}
                                </Row>

                                <BootstrapTable
                                  keyField="Id"
                                  {...toolkitprops.baseProps}
                                  {...paginationTableProps}
                                  data={documents}
                                  columns={columns.map(col => ({
                                    ...col,
                                    formatter:
                                      col.dataField === "serial"
                                        ? (cell, row, rowIndex) =>
                                            rowIndex +
                                            1 +
                                            (paginationProps.page - 1) *
                                              paginationProps.sizePerPage
                                        : col.formatter,
                                  }))}
                                  cellEdit={cellEditFactory({
                                    mode: "dbclick",
                                    blurToSave: true,
                                    afterSaveCell: (
                                      oldValue,
                                      newValue,
                                      row,
                                      column
                                    ) => {
                                      this.handledocumentTypeDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    },
                                  })}
                                  noDataIndication={this.props.t(
                                    "No documents found"
                                  )}
                                  defaultSorted={defaultSorting}
                                  filter={filterFactory()}
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

const mapStateToProps = ({ documents, menu_items }) => ({
  documents: documents.documents,

  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetDocuments: () => dispatch(getDocuments()),
  onAddNewDocumentType: documentType => dispatch(addNewDocument(documentType)),
  onUpdateDocumentType: documentType => dispatch(updateDocument(documentType)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(DocumentsTypesList));
