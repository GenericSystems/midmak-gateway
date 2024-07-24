import React, { Component } from "react";
import { Row, Col, Card, Alert, CardBody } from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import {
  getCountries,
  addNewCountry,
  updateCountry,
  deleteCountry,
  getCountryDeletedValue,
  importCountries
} from "store/country/actions";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import { withRouter, Link } from "react-router-dom";
import DeleteModal from "components/Common/DeleteModal";
import { ro } from "date-fns/locale";
const COUNTRY_STORAGE_KEY = "editableCountry";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
  getPageFromMenu
} from "../../utils/menuUtils";
import * as XLSX from "xlsx";

import FileModal from "components/Common/FileModal";

class CountriesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteModal: false,
      duplicateError: null,
      selectedRowId: null,
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
      fileModal: false,
      fileError: null,
    };
  }
  componentDidMount() {
    const { countries, onGetCountries, deleted, user_menu } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    this.getAllObject(user_menu, this.props.location.pathname);
    if (countries && !countries.length) {
      onGetCountries();
      this.setState({ countries });
      this.setState({ deleted });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { countries } = this.props;
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
      this.getAllObject(
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

  getAllObject = (menu, pathname) => {
    const menuObject =   getPageFromMenu(menu, pathname);
    this.setState({ menuObject });
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
    const { onAddNewCountry, countries } = this.props;

    const newRow = {
      arTitle: "-----",
      enTitle: "",
    };

    const emptyRowsExist = countries.some(
      country => country.arTitle.trim() === "-----"
    );

    if (emptyRowsExist) {
      const errorMessage = this.props.t("Fill in the empty row");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      onAddNewCountry(newRow);
    }
  };

  handleDeleteRow = () => {
    const { onDeleteCountry } = this.props;
    const { selectedRowId } = this.state;
console.log("selectedRowId,",selectedRowId)
    if (selectedRowId !== null) {
      onDeleteCountry(selectedRowId);

      this.setState({ deleteModal: false, showAlert: true });
    }
  };

  handleCountryDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateCountry, countries } = this.props;

    const isDuplicate = countries.some(
      country =>
        country.Id !== rowId &&
        ((country.arTitle &&
          country.arTitle.trim() === fieldValue.trim()) ||
          (country.enTitle && country.enTitle.trim() === fieldValue.trim()))
    );

    if (isDuplicate) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
      let onUpdate = { Id: rowId, [fieldName]: "-----" };
      onUpdateCountry(onUpdate);
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateCountry(onUpdate);
    }
  };

  handleAlertClose = () => {
    this.setState({ duplicateError: null, fileError: null });
  };

  handleSuccessClose = () => {
    const { onGetCountryDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetCountryDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetCountryDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetCountryDeletedValue();
  };

  toggleFileModal = () => {
    this.setState(prevState => ({
      fileModal: !prevState.fileModal,
    }));
  };

  onClickFile = () => {
    this.setState({ fileModal: true });
  };

  handleChooseFile = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    const isCSV = file.type === "text/csv" || file.name.endsWith(".csv");

    reader.onload = (e) => {
      const data = e.target.result;
  
      if (isCSV) {
        const workbook = XLSX.read(data, { type: "string" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
        if (jsonData[0] && jsonData[0][0] === 'arTitle' && jsonData[0][1] === 'enTitle') {
          const formattedData = XLSX.utils.sheet_to_json(worksheet); 
          console.log("jsonData", formattedData); 
          const {onImportCountries} = this.props
          onImportCountries({fileArray: formattedData})
        } else {

          const errorMessage = this.props.t(
           "Column names are not valid"
          );
  
          this.setState({ fileError: errorMessage });

        }
      } else {

        const errorMessage = this.props.t(
          "File is not csv"
        );

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
    const { countries, deleted, t ,user_menu} = this.props;

    console.log("user_menu",user_menu)
    const {
      duplicateError,
      deleteModal,
      showAlert,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
      menuObject,
      fileError,
      fileModal
      
    } = this.state;
    console.log("menuObject",menuObject)


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
    console.log("in render countries",this.props.countries)

    const columns = [
      { dataField: "Id", text: t("ID"), hidden: true },
      {
        dataField: "arTitle",
        text: t("Country(ar)"),
        sort: true,
        editable: showEditButton,
        filter: textFilter({
          placeholder: this.props.t("Search..."),
          hidden: !showSearchButton,
        }),
      },
      {
        dataField: "enTitle",
        text: "Country",
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
    const pageOptions = {
      sizePerPage: 10,
      totalSize: countries.length,
      custom: true,
    };

    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteRow}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        
      <FileModal
          show={fileModal}
          onCloseClick={() => this.setState({ fileModal: false })}
          onChooseFile={this.handleChooseFile}
        />
        <div className="page-content">
          <div className="container-fluid">
            <Breadcrumbs
              title={t("Countries")}
              breadcrumbItem={t("Countries List")}
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
                        data={countries}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="Id"
                            data={countries}
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
                                  data={countries}
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
                                      this.handleCountryDataChange(
                                        row.Id,
                                        column.dataField,
                                        newValue
                                      );
                                    },
                                  })}
                                  noDataIndication={t("No Countries found")}
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

const mapStateToProps = ({ countries, menu_items }) => ({
  countries: countries.countries,
  deleted: countries.deleted,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetCountries: () => dispatch(getCountries()),
  onAddNewCountry: country => dispatch(addNewCountry(country)),
  onImportCountries: country =>
    dispatch(importCountries(country)),
  onUpdateCountry: country => dispatch(updateCountry(country)),
  onDeleteCountry: country => dispatch(deleteCountry(country)),
  onGetCountryDeletedValue: () => dispatch(getCountryDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(CountriesList));
