import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { Formik, Field, Form, ErrorMessage } from "formik";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import * as Yup from "yup";
import Select from "react-select";
import * as moment from "moment";
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
  Table,
  ModalBody,
  Label,
  Alert,
  Input,
  Spinner,
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
  getDefineExamDates,
  addNewDefineExamDate,
  updateDefineExamDate,
  deleteDefineExamDate,
  getDefineExamDateDeletedValue,
  getStudentsOrder,
  getDefinePeriods,
  addNewDefinePeriod,
  updateDefinePeriod,
  deleteDefinePeriod,
  getDefinePeriodDeletedValue,
} from "store/Exam/DefineExamDates/actions";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import { isEmpty, size, map, values } from "lodash";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";
import periods from "store/periods/reducer";
import defineExamDates from "store/Exam/DefineExamDates/reducer";
class DefineExamDatesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defineExamDates: [],
      selecteDefineExamDateId: 0,
      gradeTypes: [],
      allDaysArray: [],
      defineExamDate: "",
      selectConId: null,
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
    };
    this.state = {
      languageState: "",
      duplicateError: null,
      deleteModal: false,
      deleteModal1: false,
      duplicateErrorDePer: null,
      selectedRowId: null,
      modal: false,
      modal2: false,
      isEdit: false,
      isOpen: false,
      isAdd: false,
      selectedExamType: "",
      selectedDay: null,
      selectedStudentsOrder: "",
      startDateError: false,
      endDateError: false,
      examArError: false,
      examEnError: false,
      examTypeError: false,
      errorMessage: null,
      successMessage: null,
      values: "",
      isShowPreReq: false,
      examTypesOpt: [],
    };
  }

  componentDidMount() {
    const lang = localStorage.getItem("I18N_LANGUAGE");
    const {
      i18n,
      isLoading,
      defineExamDates,
      onGetDefineExamDates,
      onGetStudentsOrder,
      gradeTypes,
      deleted,
      studentsOrder,
      definePeriods,
      user_menu,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);
    onGetDefineExamDates(lang);
    onGetStudentsOrder();
    this.setState({
      defineExamDates,
      definePeriods,
      deleted,
      gradeTypes,
      studentsOrder,
      languageState: lang,
      isLoading,
    });
    i18n.on("languageChanged", this.handleLanguageChange);
  }

  handleLanguageChange = lng => {
    const { i18n, onGetDefineExamDates } = this.props;
    const lang = localStorage.getItem("I18N_LANGUAGE");

    if (lang != lng) {
      onGetDefineExamDates(lng);
      this.setState({ languageState: lng });
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.defineExamDates !== this.props.defineExamDates &&
      this.props.defineExamDates.length > 0
    ) {
      const lastItem =
        this.props.defineExamDates[this.props.defineExamDates.length - 1];
      if (lastItem.allDays) {
        try {
          const allDaysArray = JSON.parse(lastItem.allDays);
          this.setState({ allDaysArray });
        } catch (e) {
          console.error("Error parsing allDays JSON", e);
        }
      }
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

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };
  onClickDelete = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal: true });
  };

  onClickDelete1 = rowId => {
    this.setState({ selectedRowId: rowId, deleteModal1: true });
  };

  handleAddRow = () => {
    this.setState({
      defineExamDate: "",
      definePeriods: "",
      selectedStudentsOrder: null,
      isAdd: true,
      isEdit: false,
    });
    this.toggle();
  };

  handleAddDefinePeriod = () => {
    const {
      onAddNewDefinePeriod,
      definePeriods,
      lastAddedId,
      last_all_days,
      all_days,
    } = this.props;
    const { isAdd, selecteDefineExamDateId, selectedDay } = this.state;
    console.log("selectedDay", selectedDay);

    // const dayToSend = isAdd
    //   ? Array.isArray(selectedDay)
    //     ? selectedDay.map(day => day.value)
    //     : "all"
    //   : Array.isArray(selectedDay)
    //   ? selectedDay.map(day => day.value)
    //   : "all";

    const emptyRowExists = definePeriods.some(
      defPer => !defPer.startTime || defPer.startTime === "00:00:00"
    );

    console.log("emptyRowExists", emptyRowExists);

    if (emptyRowExists) {
      this.setState({
        duplicateErrorDePer: this.props.t("Fill in the empty row"),
      });
      return;
    }
    const newRow = {
      examId: isAdd ? lastAddedId : selecteDefineExamDateId,
      flag: selectedDay != null ? selectedDay : "all",
      startTime: "",
      endTime: "",
    };
    console.log("newRow", newRow);
    onAddNewDefinePeriod(newRow);

    this.setState({ duplicateErrorDePer: null });
  };

  handleDeleteRow = () => {
    const { onDeleteDefineExamDate } = this.props;
    const { selectedRowId } = this.state;
    console.log("selectedRowId", selectedRowId.Id);
    if (selectedRowId !== null) {
      onDeleteDefineExamDate({ Id: selectedRowId.Id });

      this.setState({
        selectedRowId: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  handleDeleteRow1 = () => {
    const { onDeleteDefinePeriod } = this.props;
    const { selectedRowId } = this.state;
    if (selectedRowId !== null) {
      onDeleteDefinePeriod(selectedRowId);
      this.setState({
        selectedRowId: null,
        deleteModal1: false,
        showAlert: true,
      });
    }
  };

  handleSubmit = values => {
    const { selectedExamType, selectedStudentsOrder, isAdd, isEdit } =
      this.state;
    const {
      onAddNewDefineExamDate,
      onUpdateDefineExamDate,
      onGetDefinePeriods,
    } = this.props;
    values["arTitle"] = values["arTitle"] || "";
    values["enTitle"] = values["enTitle"] || "";
    values["examTypeId"] = selectedExamType;
    values["studentOrderId"] = selectedStudentsOrder;
    console.log("valuesssssssssssssssssssss", values);

    let defineExamDateInfo = {};
    if (
      values.arTitle &&
      values.enTitle &&
      values.startDate &&
      values.endDate &&
      selectedExamType !== null &&
      selectedStudentsOrder !== null
    ) {
      Object.keys(values).forEach(function (key) {
        if (
          values[key] != undefined &&
          (values[key].length > 0 || values[key] != "")
        )
          console.log("9999999", defineExamDateInfo);
        defineExamDateInfo[key] = values[key];
      });
      delete defineExamDateInfo.dayId;
      if (isEdit) {
        console.log("9999999", defineExamDateInfo);
        onUpdateDefineExamDate(defineExamDateInfo);
        // onGetDefinePeriods(defineExamDateInfo);
        this.toggle();
      } else if (isAdd) {
        const response = onAddNewDefineExamDate(defineExamDateInfo);
        if (response?.allDays) {
          const parsedDays = JSON.parse(response.allDays);
          this.setState({ allDaysArray: parsedDays });
        }
        if (response?.Id) {
          this.setState({ examId: response.Id });
        }
        this.setState({ isShowPreReq: true });
      }
      this.setState({
        errorMessages: {},
      });
    } else {
      let emptyError = "";
      if (selectedExamType === undefined) {
        emptyError = "Fill the empty select";
      }

      this.setState({ emptyError: emptyError });
    }
  };

  handleSelect = (fieldName, selectedValue, values) => {
    if (fieldName == "examTypeId") {
      this.setState({
        selectedExamType: selectedValue,
        defineExamDate: values,
      });
    }
    if (fieldName == "dayId") {
      this.setState({
        selectedDay: selectedValue,
      });
    }
  };

  handleAlertClose = alertName => {
    this.setState({ [alertName]: null });
  };

  handleSuccessClose = () => {
    const { onGetDefineExamDateDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetDefineExamDateDeletedValue();
  };

  handleErrorClose = () => {
    const { onGetDefineExamDateDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetDefineExamDateDeletedValue();
  };

  handleExamDateEdit = arg => {
    console.log("arg", arg);
    const { definePeriods, onGetDefinePeriods } = this.props;
    console.log("1", arg.examPeriods);
    const filteredDefinePeriods = definePeriods.filter(
      defineExamDate => defineExamDate.key != arg.Id
    );
    const periodsForGrid = (arg.examPeriods || []).map(period => ({
      id: period.Id,
      flag: period.flag,
      startTime: period.startTime,
      endTime: period.endTime,
    }));
    this.setState({
      defineExamDate: arg,
      filteredDefinePeriods: filteredDefinePeriods,
      selecteDefineExamDateId: arg.Id,
      selectedExamType: arg.examTypeId,
      selectedStudentsOrder: arg.studentOrderId,
      // selectedDay: arg.all_days,
      allDaysArray: arg.all_days,
      // periodId: periods.Id,
      // startTime: periods.startTime,
      // endTime: periods.endTime,
      // flag: periods.flag,
      // examPeriodsGridData: periodsForGrid,
      isEdit: true,
    }),
      // console.log("definePeriods in state:", this.state.definePeriods);
      onGetDefinePeriods(arg.Id);
    // this.setState({
    //   examPeriodsGridData: periodsForGrid,
    // });
    this.toggle();
  };

  // handleDefinePeriodDataChange = (id, fieldName, value) => {
  //   const updatedItem = {
  //     Id: id,
  //     [fieldName]: value,
  //   };
  //   const { onUpdateDefinePeriod } = this.props;

  //   onUpdateDefinePeriod(updatedItem);
  // };

  handleValidDate = date => {
    const date1 = moment(new Date(date)).format("DD /MM/ Y");
    return date1;
  };

  handleExamPeriodDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateDefinePeriod, definePeriods } = this.props;

    const updatedTimeParts = fieldValue.split(":");
    const updatedHours = parseInt(updatedTimeParts[0], 10);

    const isConflict = definePeriods.some(period => {
      const existingTimeParts = period.startTime.split(":");
      const existingHours = parseInt(existingTimeParts[0], 10);

      return rowId !== period.Id && updatedHours === existingHours;
    });

    if (isConflict) {
      const errorMessage = this.props.t("Value already exists");
      this.setState({ duplicateError: errorMessage });
    } else {
      this.setState({ duplicateError: null });
      let onUpdate = { Id: rowId, [fieldName]: fieldValue };
      onUpdateDefinePeriod(onUpdate);
    }
  };

  render() {
    const defineExamDate = this.state.defineExamDate;

    const {
      definePeriods,
      defineExamDates,
      studentsOrder,
      gradeTypes,
      t,
      deleted,
      isLoading,
    } = this.props;
    const {
      languageState,
      duplicateError,
      duplicateErrorDePer,
      allDaysArray,
      deleteModal,
      deleteModal1,
      modal,
      modal2,
      isEdit,
      isOpen,
      isAdd,
      emptyError,
      showAlert,
      showAddButton,
      showDeleteButton,
      showEditButton,
      showSearchButton,
      selectedDay,
      selectedExamType,
      selectedStudentsOrder,
      isShowPreReq,
    } = this.state;
    console.log("allDaysArray", allDaysArray);
    console.log("definePeriods", definePeriods);
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
    const examTypesOpt = gradeTypes;
    const columns = [
      { dataField: "Id", text: this.props.t("ID"), hidden: true },
      {
        dataField: languageState === "ar" ? "arTitle" : "enTitle",
        text:
          languageState === "ar"
            ? this.props.t("Exam (ar)")
            : this.props.t("Exam (en)"),
        sort: true,
        editable: false,
      },
      {
        dataField: "startDate",
        text: this.props.t("Start Date"),
        sort: true,
        editable: false,
        formatter: (cellContent, row) => this.handleValidDate(row.startDate),
      },
      {
        dataField: "endDate",
        text: this.props.t("End Date"),
        sort: true,
        editable: false,
        formatter: (cellContent, row) => this.handleValidDate(row.endDate),
      },
      {
        dataField: "position",
        text: this.props.t("Days Count"),
        sort: true,
        editable: false,
      },
      {
        dataField: "examType",
        text: this.props.t("Exam Type"),
        sort: true,
        editable: false,
      },
      {
        dataField: "menu",
        text: "",
        isDummyField: true,
        editable: false,
        //  hidden: !showDeleteButton,
        formatter: (cellContent, defineExamDate) => (
          <div className="d-flex gap-4">
            <Tooltip title={this.props.t("Exam Date Settings")} placement="top">
              <Link
                className="d-flex align-items-center justify-content-center"
                to="#"
              >
                <i
                  className="dripicons-document-edit font-size-16 mt=-5"
                  id="viewEdittooltip"
                  onClick={() => this.handleExamDateDetailEdit(defineExamDate)}
                ></i>
              </Link>
            </Tooltip>
            <Tooltip title={this.props.t("Edit")} placement="top">
              <Link className="text-sm-end" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={() => this.handleExamDateEdit(defineExamDate)}
                ></i>
              </Link>
            </Tooltip>
            <Tooltip title={this.props.t("Delete")} placement="top">
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(defineExamDate)}
                ></i>
              </Link>
            </Tooltip>
          </div>
        ),
      },
    ];

    const columns2 = [
      { dataField: "Id", text: t("ID"), hidden: true },
      {
        dataField: "flag",
        text: t("Flag"),
        sort: true,
        editable: false,
      },
      {
        dataField: "startTime",
        text: t("Start Time"),
        sort: true,
        // editable: true,
        formatter: (cellContent, row, column) => (
          <Input
            className="form-control"
            type="time"
            value={row.startTime}
            onChange={newValue => {
              this.handleExamPeriodDataChange(
                row.Id,
                "startTime",
                newValue.target.value
              );
            }}
            // disabled={!showEditButton}
          />
        ),
      },
      {
        dataField: "endTime",
        text: t("End Time"),
        sort: true,
        // editable: true,
        formatter: (cellContent, row, column) => (
          <Input
            className="form-control"
            type="time"
            value={row.endTime}
            onChange={newValue => {
              this.handleExamPeriodDataChange(
                row.Id,
                "endTime",
                newValue.target.value
              );
            }}
            // disabled={!showEditButton}
          />
        ),
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
      totalSize: defineExamDates.length,
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
            <Breadcrumbs breadcrumbItem={this.props.t("Define Exam Dates")} />
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
                            onClick={this.handleAlertClose("duplicateError")}
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
                    {isLoading ? (
                      <div className="d-flex justify-content-center align-items-center m-13">
                        <Spinner color="info" className="my-4" />
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <PaginationProvider
                          pagination={paginationFactory(pageOptions)}
                          keyField="Id"
                          columns={columns}
                          data={defineExamDates}
                        >
                          {({ paginationProps, paginationTableProps }) => (
                            <ToolkitProvider
                              keyField="Id"
                              data={defineExamDates}
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
                                    data={defineExamDates}
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
                                        row.Id, column.dataField, newValue;
                                      },
                                    })}
                                    noDataIndication={this.props.t(
                                      "No Exam Dates found"
                                    )}
                                    defaultSorted={defaultSorting}
                                  />
                                  <Col className="pagination pagination-rounded justify-content-end mb-2">
                                    <PaginationListStandalone
                                      {...paginationProps}
                                    />
                                  </Col>
                                  <Modal
                                    isOpen={modal}
                                    toggle={this.toggle}
                                    // className={"modal-fullscreen"}
                                    size="lg"
                                  >
                                    <ModalHeader toggle={this.toggle} tag="h4">
                                      {!!isEdit
                                        ? t("Edit Exam Date")
                                        : t("Add Exam Date")}
                                    </ModalHeader>
                                    <ModalBody>
                                      <Formik
                                        enableReinitialize={true}
                                        initialValues={{
                                          ...(isEdit &&
                                            defineExamDate && {
                                              Id: defineExamDate.Id,
                                            }),
                                          arTitle:
                                            (defineExamDate &&
                                              defineExamDate.arTitle) ||
                                            "",
                                          enTitle:
                                            (defineExamDate &&
                                              defineExamDate.enTitle) ||
                                            "",
                                          examTypeId:
                                            (defineExamDate &&
                                              defineExamDate.examTypeId) ||
                                            selectedExamType,
                                          dayId:
                                            (defineExamDate &&
                                              defineExamDate.dayId) ||
                                            selectedDay,

                                          startDate: defineExamDate?.startDate
                                            ? moment
                                                .utc(defineExamDate.startDate)
                                                .local()
                                                .format("YYYY-MM-DD")
                                            : "",

                                          endDate: defineExamDate?.endDate
                                            ? moment
                                                .utc(defineExamDate.endDate)
                                                .local()
                                                .format("YYYY-MM-DD")
                                            : "",
                                          studentOrderId:
                                            (defineExamDate &&
                                              defineExamDate.studentOrderId) ||
                                            "",
                                          // startTime:
                                          //   (defineExamDate &&
                                          //     defineExamDate.startTime) ||
                                          //   "",
                                          // endTime:
                                          //   (defineExamDate &&
                                          //     defineExamDate.endTime) ||
                                          //   "",
                                        }}
                                        validationSchema={Yup.object().shape({
                                          arTitle: Yup.string()
                                            .matches(
                                              /^[أ-ي]+$/,
                                              "Only Arabic letters are allowed"
                                            )
                                            .required(
                                              "Please Enter Your Exam Name In Arabic"
                                            ),
                                          enTitle: Yup.string()
                                            .matches(
                                              /^[A-Za-z]+$/,
                                              "Only English letters are allowed"
                                            )
                                            .required(
                                              "Please Enter Exam Name In English"
                                            ),
                                          startDate: Yup.date().required(
                                            "Please Enter Your Start Date"
                                          ),
                                          endDate: Yup.date()
                                            .required(
                                              "Please Enter Your End Date"
                                            )
                                            .min(
                                              Yup.ref("startDate"),
                                              "End date must be after start date"
                                            ),
                                        })}
                                      >
                                        {({
                                          errors,
                                          status,
                                          touched,
                                          values,
                                          handleChange,
                                          handleBlur,
                                          setFieldValue,
                                        }) => (
                                          <Form>
                                            <Card id="employee-card">
                                              <CardTitle id="course_header">
                                                {t("Add Exam Name")}
                                              </CardTitle>
                                              <CardBody className="cardBody">
                                                {emptyError && (
                                                  <Alert
                                                    color="danger"
                                                    className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                    role="alert"
                                                  >
                                                    {emptyError}
                                                    <button
                                                      type="button"
                                                      className="btn-close"
                                                      aria-label="Close"
                                                      onClick={this.handleAlertClose(
                                                        "emptyError"
                                                      )}
                                                    ></button>
                                                  </Alert>
                                                )}

                                                <Row>
                                                  <Col lg="12">
                                                    <div className="bordered">
                                                      <Col lg="12">
                                                        <Row>
                                                          <Col lg="12">
                                                            <div className="mb-3">
                                                              <Row>
                                                                <Col className="col-4">
                                                                  <Label for="arTitle">
                                                                    {this.props.t(
                                                                      "Exam (ar)"
                                                                    )}
                                                                  </Label>
                                                                  <span className="text-danger">
                                                                    *
                                                                  </span>
                                                                </Col>
                                                                <Col className="col-8">
                                                                  <Field
                                                                    name="arTitle"
                                                                    type="text"
                                                                    id="arTitle"
                                                                    className={`form-control ${
                                                                      errors.arTitle &&
                                                                      touched.arTitle
                                                                        ? "is-invalid"
                                                                        : ""
                                                                    }`}
                                                                  />
                                                                  <ErrorMessage
                                                                    name="arTitle"
                                                                    component="div"
                                                                    className="invalid-feedback"
                                                                  />
                                                                </Col>
                                                              </Row>
                                                            </div>
                                                            <div className="mb-3">
                                                              <Row>
                                                                <Col className="col-4">
                                                                  <Label for="enTitle">
                                                                    {this.props.t(
                                                                      "Exam (en)"
                                                                    )}
                                                                  </Label>
                                                                  <span className="text-danger">
                                                                    *
                                                                  </span>
                                                                </Col>
                                                                <Col className="col-8">
                                                                  <Field
                                                                    name="enTitle"
                                                                    type="text"
                                                                    id="enTitle"
                                                                    className={`form-control ${
                                                                      errors.enTitle &&
                                                                      touched.enTitle
                                                                        ? "is-invalid"
                                                                        : ""
                                                                    }`}
                                                                  />
                                                                  <ErrorMessage
                                                                    name="enTitle"
                                                                    component="div"
                                                                    className="invalid-feedback"
                                                                  />
                                                                </Col>
                                                              </Row>
                                                            </div>
                                                            <div className="mb-3">
                                                              <Row>
                                                                <Col className="col-4">
                                                                  <Label for="startDate">
                                                                    {this.props.t(
                                                                      "Start Date"
                                                                    )}
                                                                  </Label>
                                                                  <span className="text-danger">
                                                                    *
                                                                  </span>
                                                                </Col>
                                                                <Col className="col-8">
                                                                  <Field
                                                                    name="startDate"
                                                                    className={`form-control ${
                                                                      errors.startDate &&
                                                                      touched.startDate
                                                                        ? "is-invalid"
                                                                        : ""
                                                                    }`}
                                                                    type="date"
                                                                    value={
                                                                      values.startDate
                                                                        ? new Date(
                                                                            values.startDate
                                                                          )
                                                                            .toISOString()
                                                                            .split(
                                                                              "T"
                                                                            )[0]
                                                                        : ""
                                                                    }
                                                                    onChange={
                                                                      handleChange
                                                                    }
                                                                    onBlur={
                                                                      handleBlur
                                                                    }
                                                                    id="startDate-date-input"
                                                                  />
                                                                  <ErrorMessage
                                                                    name="startDate"
                                                                    component="div"
                                                                    className="invalid-feedback"
                                                                  />
                                                                </Col>
                                                              </Row>
                                                            </div>
                                                            <div className="mb-3">
                                                              <Row>
                                                                <Col className="col-4">
                                                                  <Label for="endDate">
                                                                    {this.props.t(
                                                                      "End Date"
                                                                    )}
                                                                  </Label>
                                                                  <span className="text-danger">
                                                                    *
                                                                  </span>
                                                                </Col>
                                                                <Col className="col-8">
                                                                  <Field
                                                                    className={`form-control ${
                                                                      errors.endDate &&
                                                                      touched.endDate
                                                                        ? "is-invalid"
                                                                        : ""
                                                                    }`}
                                                                    name="endDate"
                                                                    type="date"
                                                                    value={
                                                                      values.endDate
                                                                        ? new Date(
                                                                            values.endDate
                                                                          )
                                                                            .toISOString()
                                                                            .split(
                                                                              "T"
                                                                            )[0]
                                                                        : ""
                                                                    }
                                                                    onChange={
                                                                      handleChange
                                                                    }
                                                                    onBlur={
                                                                      handleBlur
                                                                    }
                                                                    id="endDate-date-input"
                                                                  />
                                                                  <ErrorMessage
                                                                    name="endDate"
                                                                    component="div"
                                                                    className="invalid-feedback"
                                                                  />
                                                                </Col>
                                                              </Row>
                                                            </div>
                                                            <div className="mb-3">
                                                              <Row>
                                                                <Col className="col-4">
                                                                  <Label for="examTypeId">
                                                                    {this.props.t(
                                                                      "Exam Type"
                                                                    )}
                                                                  </Label>
                                                                  <span className="text-danger">
                                                                    *
                                                                  </span>
                                                                </Col>
                                                                <Col className="col-8">
                                                                  <Select
                                                                    name="examTypeId"
                                                                    options={
                                                                      examTypesOpt
                                                                    }
                                                                    className={`form-control`}
                                                                    onChange={newValue => {
                                                                      this.handleSelect(
                                                                        "examTypeId",
                                                                        newValue.value,
                                                                        values
                                                                      );
                                                                    }}
                                                                    defaultValue={examTypesOpt.find(
                                                                      opt =>
                                                                        opt.value ===
                                                                        defineExamDate?.examTypeId
                                                                    )}
                                                                  />
                                                                </Col>
                                                              </Row>
                                                            </div>
                                                            <Row>
                                                              <Col lg="4">
                                                                <Label
                                                                  for="studentOrder-Id"
                                                                  className="form-label d-flex"
                                                                >
                                                                  {this.props.t(
                                                                    "Students Order"
                                                                  )}
                                                                  <span className="text-danger">
                                                                    *
                                                                  </span>
                                                                </Label>
                                                              </Col>
                                                              <Col lg="8">
                                                                <div className="d-flex flex-wrap gap-3">
                                                                  <div
                                                                    className="btn-group button-or"
                                                                    role="group"
                                                                  >
                                                                    {studentsOrder.map(
                                                                      (
                                                                        status,
                                                                        index
                                                                      ) => (
                                                                        <React.Fragment
                                                                          key={
                                                                            index
                                                                          }
                                                                        >
                                                                          <input
                                                                            type="radio"
                                                                            className={`btn-check button-or ${
                                                                              selectedStudentsOrder ===
                                                                              status.value
                                                                                ? "active"
                                                                                : ""
                                                                            }`}
                                                                            name="studentOrderId"
                                                                            id={`btnradio${index}`}
                                                                            autoComplete="off"
                                                                            checked={
                                                                              selectedStudentsOrder ===
                                                                              status.value
                                                                            }
                                                                            onChange={() => {
                                                                              setFieldValue(
                                                                                "studentOrderId",
                                                                                status.value
                                                                              );

                                                                              this.setState(
                                                                                {
                                                                                  selectedStudentsOrder:
                                                                                    status.value,
                                                                                }
                                                                              );
                                                                            }}
                                                                          />
                                                                          <Label
                                                                            className="btn btn-outline-primary smallButton w-sm"
                                                                            for={`btnradio${index}`}
                                                                          >
                                                                            {
                                                                              status.label
                                                                            }
                                                                          </Label>
                                                                        </React.Fragment>
                                                                      )
                                                                    )}
                                                                  </div>
                                                                </div>
                                                              </Col>
                                                            </Row>
                                                          </Col>
                                                        </Row>
                                                      </Col>
                                                    </div>
                                                  </Col>
                                                </Row>
                                                <Row>
                                                  <Col>
                                                    <div className="text-center">
                                                      <Link
                                                        to="#"
                                                        className="btn btn-primary me-2"
                                                        onClick={() => {
                                                          this.handleSubmit(
                                                            values
                                                          );
                                                        }}
                                                      >
                                                        {t("Save")}
                                                      </Link>
                                                    </div>
                                                  </Col>
                                                </Row>
                                              </CardBody>
                                            </Card>
                                            {(isEdit || isShowPreReq) && (
                                              <Row>
                                                <Col lg="12 mt-6">
                                                  <div>
                                                    <Col lg="12">
                                                      <Card id="employee-card">
                                                        <CardTitle id="course_header">
                                                          {t("Define Period")}
                                                        </CardTitle>
                                                        <CardBody className="cardBody">
                                                          <Row className="mt-10">
                                                            <div>
                                                              {duplicateErrorDePer && (
                                                                <Alert
                                                                  color="danger"
                                                                  className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                                  role="alert"
                                                                >
                                                                  {
                                                                    duplicateErrorDePer
                                                                  }
                                                                  <button
                                                                    type="button"
                                                                    className="btn-close"
                                                                    aria-label="Close"
                                                                    onClick={() =>
                                                                      this.handleAlertClose(
                                                                        "duplicateErrorDePer"
                                                                      )
                                                                    }
                                                                  ></button>
                                                                </Alert>
                                                              )}
                                                              {deleted == 0 &&
                                                                showAlert && (
                                                                  <Alert
                                                                    color="danger"
                                                                    className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                                    role="alert"
                                                                  >
                                                                    {
                                                                      alertMessage
                                                                    }
                                                                    <button
                                                                      type="button"
                                                                      className="btn-close"
                                                                      aria-label="Close"
                                                                      onClick={
                                                                        this
                                                                          .handleErrorClose
                                                                      }
                                                                    ></button>
                                                                  </Alert>
                                                                )}
                                                              {deleted == 1 &&
                                                                showAlert && (
                                                                  <Alert
                                                                    color="success"
                                                                    className="d-flex justify-content-center align-items-center alert-dismissible fade show"
                                                                    role="alert"
                                                                  >
                                                                    {
                                                                      alertMessage
                                                                    }
                                                                    <button
                                                                      type="button"
                                                                      className="btn-close"
                                                                      aria-label="Close"
                                                                      onClick={
                                                                        this
                                                                          .handleSuccessClose
                                                                      }
                                                                    ></button>
                                                                  </Alert>
                                                                )}
                                                            </div>
                                                            <Row>
                                                              <Col className="col-3">
                                                                <Label for="dayId">
                                                                  {this.props.t(
                                                                    "Define Period"
                                                                  )}
                                                                </Label>
                                                              </Col>
                                                              <Col className="col-5">
                                                                <Select
                                                                  name="dayId"
                                                                  key={`select_dayId`}
                                                                  options={
                                                                    allDaysArray
                                                                  }
                                                                  className={`form-control`}
                                                                  onChange={newValue => {
                                                                    this.handleSelect(
                                                                      "dayId",
                                                                      newValue.value,
                                                                      values
                                                                    );
                                                                  }}
                                                                  value={
                                                                    Array.isArray(
                                                                      allDaysArray
                                                                    )
                                                                      ? allDaysArray.find(
                                                                          opt =>
                                                                            opt.value ===
                                                                            values.dayId
                                                                        )
                                                                      : null
                                                                  }
                                                                />
                                                              </Col>
                                                              <Col className="col-4">
                                                                <div className="text-sm-end">
                                                                  <Tooltip
                                                                    title={this.props.t(
                                                                      "Add"
                                                                    )}
                                                                    placement="top"
                                                                  >
                                                                    <IconButton
                                                                      color="primary"
                                                                      onClick={
                                                                        this
                                                                          .handleAddDefinePeriod
                                                                      }
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
                                                              data={
                                                                definePeriods
                                                              }
                                                              columns={columns2}
                                                              cellEdit={cellEditFactory(
                                                                {
                                                                  mode: "dbclick",
                                                                  blurToSave: true,
                                                                  afterSaveCell:
                                                                    (
                                                                      oldValue,
                                                                      newValue,
                                                                      row,
                                                                      column
                                                                    ) => {
                                                                      this.handleExamPeriodDataChange(
                                                                        row.Id,
                                                                        column.dataField,
                                                                        newValue
                                                                      );
                                                                    },
                                                                }
                                                              )}
                                                              defaultSorted={
                                                                defaultSorting
                                                              }
                                                            />
                                                            <DeleteModal
                                                              show={
                                                                deleteModal1
                                                              }
                                                              onDeleteClick={
                                                                this
                                                                  .handleDeleteRow1
                                                              }
                                                              onCloseClick={() =>
                                                                this.setState({
                                                                  deleteModal1: false,
                                                                  selectedRowId:
                                                                    null,
                                                                })
                                                              }
                                                            />
                                                          </Row>
                                                        </CardBody>
                                                      </Card>
                                                    </Col>
                                                  </div>
                                                </Col>
                                              </Row>
                                            )}
                                          </Form>
                                        )}
                                      </Formik>
                                    </ModalBody>
                                  </Modal>
                                </React.Fragment>
                              )}
                            </ToolkitProvider>
                          )}
                        </PaginationProvider>
                      </div>
                    )}
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

const mapStateToProps = ({ menu_items, gradeTypes, defineExamDates }) => ({
  defineExamDates: defineExamDates.defineExamDates,
  studentsOrder: defineExamDates.studentsOrder,
  definePeriods: defineExamDates.definePeriods,
  lastAddedId: defineExamDates.lastAddedId,
  isLoading: defineExamDates.isLoading,
  last_all_days: defineExamDates.last_all_days,
  deleted: defineExamDates.deleted,
  gradeTypes: gradeTypes.gradeTypes,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetDefineExamDates: () => dispatch(getDefineExamDates()),
  onGetStudentsOrder: () => dispatch(getStudentsOrder()),
  onAddNewDefineExamDate: defineExamDate =>
    dispatch(addNewDefineExamDate(defineExamDate)),
  onUpdateDefineExamDate: defineExamDate =>
    dispatch(updateDefineExamDate(defineExamDate)),
  onDeleteDefineExamDate: defineExamDate =>
    dispatch(deleteDefineExamDate(defineExamDate)),
  onGetDefineExamDateDeletedValue: () =>
    dispatch(getDefineExamDateDeletedValue()),
  onGetDefinePeriods: defineExamDateId =>
    dispatch(getDefinePeriods(defineExamDateId)),
  onAddNewDefinePeriod: definePeriod =>
    dispatch(addNewDefinePeriod(definePeriod)),
  onUpdateDefinePeriod: definePeriod =>
    dispatch(updateDefinePeriod(definePeriod)),
  onDeleteDefinePeriod: definePeriod =>
    dispatch(deleteDefinePeriod(definePeriod)),
  onGetDefinePeriodDeletedValue: () => dispatch(getDefinePeriodDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(DefineExamDatesList)));
