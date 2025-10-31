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
  Modal,
  ModalHeader,
  ModalBody,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Collapse,
  Container,
  CardText,
} from "reactstrap";
import classnames from "classnames";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
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
  getFeesDefinition,
  addNewFeesDefinition,
  updateFeesDefinition,
  deleteFeesDefinition,
  getFeesDefinitionDeletedValue,
  copyFees,
  getFeesConditions,
  addNewFeesCondition,
  updateFeesCondition,
  deleteFeesCondition,
  getFeesPrices,
  addNewFeesPrice,
  updateFeesPrice,
  deleteFeesPrice,
  copyFeesPrice,
  getFeesServices,
  addNewFeesService,
  updateFeesService,
  deleteFeesService,
  copyFeesService,
  getFiscalYearDetails,
} from "store/feesDefinition/actions";

import { getFilteredAcademicCertificates } from "store/academicvertificates/actions";

import { getFiscalYears } from "store/periods/actions";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import { withRouter, Link } from "react-router-dom";
import DeleteModal from "components/Common/DeleteModal";

import { getCurrentSemester } from "store/semesters/actions";

import FinesDefinitionList from "./fines-definition";
import RequestsFeesList from "./requests-fees";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
  checkIsSearchForPage,
} from "../../../utils/menuUtils";
class FeesDefinitionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRow: null,
      selectedView: "",
      selectedSemester: null,
      defaultSemester: null,
      errorMessage: null,
      deleteModal: false,
      deleteModal2: false,
      selectedRow: null,
      isEdit: false,
      modal: false,
      selectedFromSemester: null,
      selectedToSemester: null,
      selectedFiscalYear: null,
      contentName: "",
      fiscalYearName: "",
      verticalActiveTab1: "0",
      verticalActiveTab2: "0",
      verticalActiveTab: "0",
      sidebarOpen: true,
      showCondTable: false,
      selectedFaculty: null,
      currencyName: null,
      selectedPeriod: null,
      defaultPeriod: null,
      filteredPeriod: [],
      selectedSemester: null,
      activeTab: "1",
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      showSearchButton: false,
    };
  }
  componentDidMount() {
    const {
      feesDefinition,
      fiscalYears,
      currencies,
      yearSemesters,
      semesters,
      currentSemester,
      faculties,
      onGetFiscalYears,
      fiscalYearContents,
      feesConditions,
      last_created_fees,
      feesPrices,
      feesServices,
      nationalities,
      requests,
      countries,
      fiscalYearDetails,
      executeMethods,
      academiccertificates,
      filteredAcademicCertificates,
      deleted,
      user_menu,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    this.updateShowSearchButton(user_menu, this.props.location.pathname);

    if (feesDefinition && !feesDefinition.length) {
      const obj = {
        courseId: 0,
      };
      onGetFiscalYears();

      this.setState({
        feesDefinition,
        feesConditions,
        feesPrices,
        feesServices,
        deleted,
        last_created_fees,
        academiccertificates,
        filteredAcademicCertificates,
      });
      this.setState({ fiscalYears, fiscalYearContents });
      this.setState({ currencies });
      this.setState({ faculties, fiscalYearDetails });
      this.setState({ yearSemesters });
      this.setState({ currentSemester });
      this.setState({
        nationalities,
        countries,
        requests,
        semesters,
        executeMethods,
      });
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

  initializeState() {
    const { currentSemester, yearSemesters, onGetSchedulingLectures } =
      this.props;
    const defaultSemester =
      yearSemesters.find(
        opt => opt.value === currentSemester.cuYearSemesterId
      ) || "";
    this.setState({ defaultSemester: defaultSemester });
  }

  toggleSidebar = () => {
    this.setState(prevState => ({
      sidebarOpen: !prevState.sidebarOpen,
    }));
  };

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  handleButtonClick = (fieldName, selectedValue) => {
    const { currencyName, selectedFaculty, selectedSemester } = this.state;
    const { onGetFeesDefinition } = this.props;
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
      onGetFeesDefinition(obj);
    } else if (selectedValue == "semester") {
      const obj = {
        courseId: selectedCourseId,
        CourseCode: selectedCourseCode,
        active: 1,
      };
      obj[
        "filter"
      ] = `courseId = ${obj.courseId} and code = ''''${obj.CourseCode}'''' and active = ${obj.active} and (totalFeesDefinition = 0 OR totalFeesDefinition IS NULL)`;
      onGetFeesDefinition(obj);
    }
  };

  handleSelectCondOption = (rowId, fieldName, selectedValue) => {
    const { onUpdateFeesCondition } = this.props;
    let onUpdate = { Id: rowId, [fieldName]: selectedValue };
    onUpdateFeesCondition(onUpdate);
  };

  handleSelectPriceOption = (rowId, fieldName, selectedValue) => {
    const { onUpdateFeesPrice, onGetFilteredAcademicCertificates } = this.props;
    if (fieldName == "facultyId") {
      this.setState({
        selectedFacultyId: selectedValue,
      });
      onGetFilteredAcademicCertificates(selectedValue);
    }
    let onUpdate = { Id: rowId, [fieldName]: selectedValue };
    onUpdateFeesPrice(onUpdate);
  };

  handleSelectPeriod = (fieldName, selectedValue) => {
    const { onGetFeesPrices, fiscalYearDetails } = this.props;
    const { filteredPeriod } = this.state;

    if (fieldName === "periodId") {
      if (selectedValue) {
        const periodObj = filteredPeriod.find(
          period => period.value == selectedValue.value
        );
        this.setState({
          defaultPeriod: selectedValue,
        });

        const periodId = periodObj.value;

        let obj = { periodId: periodId, contentId: null };

        onGetFeesPrices(obj);
      }
    }
  };

  handleSelectServiceOption = (rowId, fieldName, selectedValue) => {
    const { onUpdateFeesService, yearSemesters } = this.props;

    let onUpdate = { Id: rowId, [fieldName]: selectedValue };

    onUpdateFeesService(onUpdate);

    if (fieldName == "totalAmount") {
      const numericValue = parseFloat(selectedValue);

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
        onUpdateFeesService(onUpdate);
      }
    }
  };

  handleSemesterDataListChange = (event, fieldName, rowId) => {
    const { onUpdateFeesService, semesters } = this.props;
    const selectedValue = event.target.value;
    if (fieldName == "semesterId") {
      const semesterObj = semesters.find(year => year.value === selectedValue);

      if (semesterObj) {
        let obj = { Id: rowId, semesterId: semesterObj.key };
        onUpdateFeesService(obj);
      }
      this.setState({
        selectedSemester: selectedValue,
      });
    }
  };

  handleCopyFees = () => {
    const { grantCond, currentFacultyId, selectedSemester } = this.state;
    const { onGetCopyFees, admissionConditions, currentSemester } = this.props;

    if (selectedSemester != 0) {
      let ob = {
        facultyId: currentFacultyId,
        YearId: currentYear.value,
      };
      onGetCopyFees(ob);
    } else {
      let ob = {
        facultyId: currentFacultyId,
        YearId: currentYear.value,
        isGrantCond: parseInt(grantCond, 10),
      };
      onGetCopyFees(ob);
    }
  };

  handleFeesDefinitionDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateFeesDefinition, feesDefinition } = this.props;

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
        onUpdateFeesDefinition(onUpdate);
      }
    }

    if (fieldName == "amount") {
      const onUpdate = { Id: rowId, [fieldName]: fieldValue };
      this.setState({ errorMessage: null });
      onUpdateFeesDefinition(onUpdate);
    }

    if (fieldName == "fromdate") {
      const fromDate = new Date(fieldValue).toISOString().split("T")[0];
      const onUpdate = { Id: rowId, [fieldName]: fromDate };
      this.setState({ errorMessage: null });
      onUpdateFeesDefinition(onUpdate);
    }

    if (fieldName == "toDate") {
      const fromDate = new Date(fieldValue).toISOString().split("T")[0];
      const onUpdate = { Id: rowId, [fieldName]: fromDate };
      this.setState({ errorMessage: null });
      onUpdateFeesDefinition(onUpdate);
    }
  };

  handleSelectFees = (rowId, fieldName, selectedValue) => {
    const { onUpdateFeesDefinition } = this.props;
    const { feesDefinition } = this.state;

    this.setState({
      selectedFees: selectedValue,
    });

    let onUpdate = { Id: rowId, [fieldName]: selectedValue };
    onUpdateFeesDefinition(onUpdate);
  };

  handleSelectCurrencyOption = (fieldName, selectedValue) => {
    if (fieldName === "currencyId") {
      this.setState({
        selectedCurrencyId: selectedValue,
      });
    }
  };

  handleErrorClose = () => {
    this.setState({ errorMessage: null });
  };

  handleDeleteFeesRow = () => {
    const { onDeleteFeesDefinition } = this.props;
    const { selectedRow } = this.state;

    if (selectedRow !== null) {
      let obj = { Id: selectedRow.Id, fiscalYearId: selectedRow.fiscalYearId };
      onDeleteFeesDefinition(obj);

      this.setState({
        selectedRow: null,
        deleteModal: false,
        showAlert: true,
      });
    }
  };

  handleDeleteCondRow = () => {
    const { onDeleteFeesCondition } = this.props;
    const { selectedRow } = this.state;

    if (selectedRow !== null) {
      let obj = { Id: selectedRow.Id };
      onDeleteFeesCondition(obj);

      this.setState({
        selectedRow: null,
        deleteModal2: false,
        showAlertCond: true,
      });
    }
  };

  handleDeletePriceRow = () => {
    const { onDeleteFeesPrice } = this.props;
    const { selectedRow } = this.state;

    if (selectedRow !== null) {
      let obj = { Id: selectedRow.Id };
      onDeleteFeesPrice(obj);

      this.setState({
        selectedRow: null,
        deleteModal3: false,
        showAlertPrice: true,
      });
    }
  };

  handleDeleteServiceRow = () => {
    const { onDeleteFeesService } = this.props;
    const { selectedRow } = this.state;

    if (selectedRow !== null) {
      let obj = { Id: selectedRow.Id };
      onDeleteFeesService(obj);

      this.setState({
        selectedRow: null,
        deleteModal4: false,
        showAlertService: true,
      });
    }
  };

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  toggleDeleteModalCond = () => {
    this.setState(prevState => ({
      deleteModal2: !prevState.deleteModal2,
    }));
  };

  onClickDelete = rowId => {
    this.setState({ selectedRow: rowId, deleteModal: true });
  };

  onClickDeleteCond = rowId => {
    this.setState({ selectedRow: rowId, deleteModal2: true });
  };

  onClickDeletePrice = rowId => {
    this.setState({ selectedRow: rowId, deleteModal3: true });
  };

  onClickDeleteService = rowId => {
    this.setState({ selectedRow: rowId, deleteModal4: true });
  };

  handleDataListChange = (event, fieldName) => {
    const { fiscalYears, onGetFeesDefinition } = this.props;
    const selectedValue = event.target.value;

    const { selectedFromSemester, selectedToSemester, selectedFinanceYear } =
      this.state;

    if (fieldName == "fromSemesterId") {
      this.setState({
        selectedFromSemester: selectedValue,
      });
    }

    if (fieldName == "toSemesterId") {
      this.setState({
        selectedToSemester: selectedValue,
      });
    }

    if (fieldName == "fiscalYearId") {
      const fiscalYearObj = fiscalYears.find(
        year => year.value === selectedValue
      );
      if (fiscalYearObj) {
        let obj = { fiscalYearId: fiscalYearObj.key };
        onGetFeesDefinition(obj);
      }

      this.setState({
        selectedFiscalYear: selectedValue,
      });
    }

    if (fieldName == "facultyId") {
      this.setState({
        selectedFaculty: selectedValue,
      });
    }
  };

  handleInputFocus = fieldName => {
    const {
      selectedFromSemester,
      selectedToSemester,
      selectedFiscalYear,
      selectedFaculty,
      selectedPeriod,
      selectedSemester,
    } = this.state;

    if (fieldName == "fromSemesterId") {
      this.setState({ selectedFromSemester });
    }

    if (fieldName == "toSemesterId") {
      this.setState({ selectedToSemester });
    }

    if (fieldName == "fiscalYearId") {
      this.setState({ selectedFiscalYear });
    }

    if (fieldName == "facultyId") {
      this.setState({
        selectedFaculty,
      });
    }

    if (fieldName == "periodId") {
      this.setState({
        selectedPeriod,
      });
    }

    if (fieldName == "semesterId") {
      this.setState({ selectedSemester });
    }
  };

  handleInputBlur = fieldName => {
    const {
      selectedFromSemester,
      selectedToSemester,
      selectedFiscalYear,
      selectedPeriod,
      selectedFaculty,
      selectedSemester,
    } = this.state;

    if (fieldName == "fromSemesterId") {
      this.setState({ selectedFromSemester });
    }

    if (fieldName == "toSemesterId") {
      this.setState({ selectedToSemester });
    }

    if (fieldName == "fiscalYearId") {
      this.setState({ selectedFiscalYear });
    }

    if (fieldName == "facultyId") {
      this.setState({
        selectedFaculty,
      });
    }
    if (fieldName == "periodId") {
      this.setState({
        selectedPeriod,
      });
    }
    if (fieldName == "semesterId") {
      this.setState({ selectedSemester });
    }
  };

  handleFeesClicks = () => {
    this.setState({
      feesId: "",
      arFees: "",
      enFees: "",
      selectedFromSemesterId: null,
      selectedToSemesterId: null,
      selectedFromSemester: "",
      selectedToSemester: "",
      arNoteFees: "",
      enNoteFees: "",
      showCondTable: false,
      isEdit: false,
    });
    this.toggle();
  };

  handleSave = values => {
    const {
      onAddNewFeesDefinition,
      yearSemesters,
      fiscalYears,
      onGetFeesConditions,
      last_created_fees,
    } = this.props;
    const {
      selectedToSemester,
      selectedFromSemester,
      selectedFiscalYear,
      selectedCurrencyId,
    } = this.state;

    // const fromSemesterObj = yearSemesters.find(
    //   semes => semes.value === selectedFromSemester
    // );

    // const toSemesterObj = yearSemesters.find(
    //   semes => semes.value === selectedToSemester
    // );

    const fiscalYearObj = fiscalYears.find(
      year => year.value === selectedFiscalYear
    );

    const obj = {
      arTitle: values["arTitle"],
      enTitle: values["enTitle"],
      fiscalYearId: fiscalYearObj.key,
      // fromSemesterId: fromSemesterObj.key,
      // toSemesterId: toSemesterObj.key,
      currencyId: selectedCurrencyId,
      arNote: values["arNote"],
      enNote: values["enNote"],
    };
    onAddNewFeesDefinition(obj);
    this.setState({ showCondTable: true });
  };

  handleEditFees = arg => {
    const fees = arg;

    this.setState({
      feesId: fees.Id,
      arFees: fees.arTitle,
      enFees: fees.enTitle,
      selectedFiscalYearId: fees.fiscalYearId,
      // selectedFromSemesterId: fees.fromSemesterId,
      // selectedToSemesterId: fees.toSemesterId,
      selectedCurrencyId: fees.currencyId,
      arNoteFees: fees.arNote,
      enNoteFees: fees.enNote,

      isEdit: true,
    });

    this.toggle();
    const { fiscalYears, yearSemesters, onGetFeesConditions, currencies } =
      this.props;
    let obj = { Id: fees.Id };
    onGetFeesConditions(obj);

    if (fees.currencyId) {
      const currencyObj = currencies.find(
        currencyObj => currencyObj.value === fees.currencyId
      );
      this.setState({
        currencyName: currencyObj.label,
      });
    }

    if (fees.fiscalYearId) {
      const fiscalYear = fiscalYears.find(
        fiscalYear => fiscalYear.key === fees.fiscalYearId
      );
      this.setState({
        selectedFiscalYear: fiscalYear.value,
      });
    }

    // if (fees.fromSemesterId) {
    //   const fromSemes = yearSemesters.find(
    //     yearSemester => yearSemester.key === fees.fromSemesterId
    //   );
    //   this.setState({
    //     selectedFromSemester: fromSemes.value,
    //   });
    // }

    // if (fees.toSemesterId) {
    //   const toSemes = yearSemesters.find(
    //     yearSemester => yearSemester.key === fees.toSemesterId
    //   );
    //   this.setState({
    //     selectedToSemester: toSemes.value,
    //   });
    // }
  };

  handleUpdate = values => {
    const { onUpdateFeesDefinition, yearSemesters, fiscalYears } = this.props;
    const {
      selectedFromSemester,
      selectedToSemester,
      selectedFiscalYear,
      feesId,
      selectedCurrencyId,
    } = this.state;

    const fromSemesterObj = yearSemesters.find(
      semes => semes.value === selectedFromSemester
    );

    const toSemesterObj = yearSemesters.find(
      semes => semes.value === selectedToSemester
    );

    const fiscalYearObj = fiscalYears.find(
      year => year.value === selectedFiscalYear
    );

    const obj = {
      Id: feesId,
      arTitle: values["arTitle"],
      enTitle: values["enTitle"],
      fiscalYearId: fiscalYearObj.key,
      fromSemesterId: fromSemesterObj.key,
      toSemesterId: toSemesterObj.key,
      currencyId: selectedCurrencyId,
      arNote: values["arNote"],
      enNote: values["enNote"],
    };

    onUpdateFeesDefinition(obj);
    this.toggle();
  };

  handleClickCell = row => {
    const { onGetFiscalYearDetails, fiscalYearDetails } = this.props;
    let obj = { Id: row.Id };
    onGetFiscalYearDetails(obj);
  };

  toggleFeesStudy(tab) {
    const { onGetFeesPrices, fiscalYearDetails, onGetFeesServices } =
      this.props;
    console.log("fiscalYearDetailsfiscalYearDetails", fiscalYearDetails);
    if (fiscalYearDetails.length > 0) {
      const filteredPeriod = fiscalYearDetails
        .filter(item => item.contentId === tab)
        .map(({ periodId, periodName, isDefault }) => ({
          value: periodId,
          label: periodName,
          isDefault,
        }));
      const defaultPeriod = filteredPeriod.find(
        period => period.isDefault === 1
      );
      const currencyId = fiscalYearDetails[0].currencyId;

      this.setState({
        filteredPeriod: filteredPeriod,
        defaultPeriod: defaultPeriod,
        selectedCurrencyId: currencyId,
      });
    }

    if (tab == fiscalYearDetails[0].contentId) {
      let obj = { periodId: null, contentId: tab };

      onGetFeesPrices(obj);
    }

    if (tab == fiscalYearDetails[1].contentId) {
      let obj = { periodId: null, contentId: tab };

      onGetFeesServices(obj);
    }

    if (this.state.studyFeesTab !== tab) {
      this.setState({
        studyFeesTab: tab,
        grantCond: tab,
      });
    }
  }

  handleAddFeesCond = () => {
    const { onAddNewFeesCondition, feesConditions, last_created_fees } =
      this.props;
    const {
      currencyName,
      selectedFaculty,
      selectedSemester,
      defaultSemester,
      feesId,
      isEdit,
    } = this.state;

    if (!isEdit) {
      const newRow = {
        studyFeesId: last_created_fees,
      };

      this.setState({ duplicateError: null });
      onAddNewFeesCondition(newRow);
    } else if (isEdit) {
      const newRow = {
        studyFeesId: feesId,
      };

      this.setState({ duplicateError: null });
      onAddNewFeesCondition(newRow);
    }
  };

  handleSuccessFeesDefinitionClose = () => {
    const { onGetFeesDefinitionDeletedValue } = this.props;
    this.setState({
      showAlert: null,
      showAlertPrice: null,
      showAlertService: null,
    });
    onGetFeesDefinitionDeletedValue();
  };

  handleErrorFeesDefinitionClose = () => {
    const { onGetFeesDefinitionDeletedValue } = this.props;
    this.setState({
      showAlert: null,
      showAlertPrice: null,
      showAlertService: null,
    });
    onGetFeesDefinitionDeletedValue();
  };

  handleAddPriceRow = () => {
    const {
      onAddNewFeesPrice,
      feesDefinition,
      fiscalYearDetails,
      fiscalYearContents,
    } = this.props;
    const { currencyName, selectedPeriod, selectedCurrencyId } = this.state;
    if (selectedPeriod) {
      const periodObj = fiscalYearDetails.find(
        period => period.value === selectedPeriod
      );

      const newRow = {
        periodId: periodObj.key,
        contentId: fiscalYearContents[0].Id,
        currencyId: selectedCurrencyId,
      };

      this.setState({ duplicateError: null });
      onAddNewFeesPrice(newRow);
    } else {
      const newRow = {
        periodId: fiscalYearDetails[0].periodId,
        contentId: fiscalYearDetails[0].contentId,
        currencyId: selectedCurrencyId,
      };

      this.setState({ duplicateError: null });
      onAddNewFeesPrice(newRow);
    }
  };

  handleFeesPriceDataChange = (rowId, fieldName, fieldValue) => {
    const { onUpdateFeesPrice } = this.props;

    if (fieldName == "yearlyPrice" || fieldName == "hourPrice") {
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
        onUpdateFeesPrice(onUpdate);
      }
    }
  };

  handleAddServiceRow = () => {
    const {
      onAddNewFeesService,
      feesDefinition,
      fiscalYearDetails,
      fiscalYearContents,
    } = this.props;
    const { currencyName, selectedPeriod, selectedCurrencyId } = this.state;
    if (selectedPeriod) {
      const periodObj = fiscalYearDetails.find(
        period => period.value === selectedPeriod
      );

      const newRow = {
        periodId: periodObj.key,
        contentId: fiscalYearContents[1].Id,
        currencyId: selectedCurrencyId,
      };

      this.setState({ duplicateError: null });
      onAddNewFeesService(newRow);
    } else {
      const newRow = {
        periodId: fiscalYearDetails[1].periodId,
        contentId: fiscalYearDetails[1].contentId,
        currencyId: selectedCurrencyId,
      };
      this.setState({ duplicateError: null });
      onAddNewFeesService(newRow);
    }
  };

  toggleTab(tab) {
    const { onGetSchedulingLectures } = this.props;
    const { ifUpdateSchedule, selectedSchedule } = this.state;
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  render() {
    const {
      feesDefinition,
      fiscalYears,
      yearSemesters,
      fiscalYearContents,
      feesConditions,
      feesPrices,
      feesServices,
      last_created_fees,
      nationalities,
      requests,
      semesters,
      executeMethods,
      currencies,
      countries,
      faculties,
      fiscalYearDetails,
      filteredAcademicCertificates,
      academiccertificates,
      deleted,
      t,
    } = this.props;
    const {
      errorMessage,
      deleteModal,
      deleteModal2,
      deleteModal3,
      deleteModal4,
      showAlertPrice,
      showAlertService,
      modal,
      isEdit,
      fiscalYearName,
      selectedFromSemesterId,
      selectedToSemesterId,
      selectedFiscalYearId,
      selectedFromSemester,
      selectedToSemester,
      selectedFiscalYear,
      selectedFaculty,
      selectedPeriod,
      currencyName,
      feesId,
      arFees,
      enFees,
      arNoteFees,
      enNoteFees,
      fees,
      sidebarOpen,
      showCondTable,
      verticalActiveTab,
      showAlert,
      defaultPeriod,
      filteredPeriod,
      selectedCurrencyId,
      selectedCurrency,
      currencyId,
      activeTab,
      showAddButton,
      showEditButton,
      showDeleteButton,
      showSearchButton,
    } = this.state;
    const { SearchBar } = Search;

    const currency =
      fiscalYearDetails.length > 0
        ? currencies.find(
            opt => opt.label === fiscalYearDetails[0].currencyName
          )
        : "";

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

    const defaultCondSorting = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];

    const defaultServiceSorting = [
      {
        dataField: "Id",
        order: "desc",
      },
    ];

    const pageOptions = {
      sizePerPage: 10,
      totalSize: feesDefinition.length,
      custom: true,
    };

    const studyFeesColumns = [
      { dataField: "Id", text: t("ID"), hidden: true },

      {
        dataField: "arTitle",
        text: t("Fees title"),
        sort: true,
        editable: false,
      },
      {
        dataField: "delete",
        text: "",
        style: { width: "3rem" },
        isDummyField: true,
        editable: false,
        formatter: (cellContent, fees) => (
          <div className="d-flex" style={{ width: "fit-content" }}>
            {showEditButton && (
              <Tooltip title={this.props.t("Edit")} placement="top">
                <Link className="text-secondary" to="#">
                  <i
                    className="mdi mdi-pencil font-size-18"
                    id="edittooltip"
                    onClick={() => this.handleEditFees(fees)}
                  ></i>
                </Link>
              </Tooltip>
            )}
            {showDeleteButton && (
              <Tooltip title={this.props.t("Delete")} placement="top">
                <Link className="text-danger" to="#">
                  <i
                    className="mdi mdi-delete font-size-18"
                    id="deletetooltip"
                    onClick={() => this.onClickDelete(fees)}
                  ></i>
                </Link>
              </Tooltip>
            )}
          </div>
        ),
      },
    ];

    const studyFeesCondColumns = [
      { dataField: "Id", text: t("ID"), hidden: true },

      {
        dataField: "nationalityId ",
        text: t("Nationality"),
        sort: true,
        editable: false,
        formatter: (cellContent, row) => (
          <Select
            key={`${row.Id}_select`}
            options={nationalities.filter(
              option =>
                !feesConditions.some(row => row.nationalityId === option.value)
            )}
            onChange={newValue => {
              this.handleSelectCondOption(
                row.Id,
                "nationalityId",
                newValue.value
              );
            }}
            defaultValue={nationalities.find(
              opt => opt.value == row.nationalityId
            )}
          />
        ),
      },
      {
        dataField: "countryId ",
        text: t("Country"),
        sort: true,
        editable: false,
        formatter: (cellContent, row) => (
          <Select
            key={`${row.Id}_select`}
            options={countries.filter(
              option =>
                !feesConditions.some(row => row.countryId === option.value)
            )}
            onChange={newValue => {
              this.handleSelectCondOption(row.Id, "countryId", newValue.value);
            }}
            defaultValue={countries.find(opt => opt.value == row.countryId)}
          />
        ),
      },
      {
        dataField: "nonNationalityId ",
        text: t("non Nationality"),
        sort: true,
        editable: false,
        formatter: (cellContent, row) => (
          <Select
            key={`${row.Id}_select`}
            options={nationalities.filter(
              option =>
                !feesConditions.some(
                  row => row.nonNationalityId === option.value
                )
            )}
            onChange={newValue => {
              this.handleSelectCondOption(
                row.Id,
                "nonNationalityId",
                newValue.value
              );
            }}
            defaultValue={nationalities.find(
              opt => opt.value == row.nonNationalityId
            )}
          />
        ),
      },
      {
        dataField: "nonCountryId ",
        text: t("non Country"),
        sort: true,
        editable: false,
        formatter: (cellContent, row) => (
          <Select
            key={`${row.Id}_select`}
            options={countries.filter(
              option =>
                !feesConditions.some(row => row.nonCountryId === option.value)
            )}
            onChange={newValue => {
              this.handleSelectCondOption(
                row.Id,
                "nonCountryId",
                newValue.value
              );
            }}
            defaultValue={countries.find(opt => opt.value == row.nonCountryId)}
          />
        ),
      },

      {
        dataField: "delete",
        text: "",
        style: { width: "3rem" },
        isDummyField: true,
        editable: false,
        formatter: (cellContent, fees) => (
          <div className="d-flex" style={{ width: "fit-content" }}>
            <Tooltip title={this.props.t("Delete")} placement="top">
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDeleteCond(fees)}
                ></i>
              </Link>
            </Tooltip>
          </div>
        ),
      },
    ];

    const studyFeesPriceColumns = [
      { dataField: "Id", text: t("ID"), hidden: true },
      {
        dataField: "facultyId ",
        text: t("Faculty"),
        sort: true,
        editable: false,
        formatter: (cellContent, row) => (
          <Select
            key={`${row.Id}_select`}
            options={faculties}
            onChange={newValue => {
              this.handleSelectPriceOption(row.Id, "facultyId", newValue.value);
            }}
            defaultValue={faculties.find(opt => opt.value == row.facultyId)}
            isDisabled={!showEditButton}
          />
        ),
      },

      {
        dataField: "planStudyId ",
        text: this.props.t("Plan Study"),
        sort: true,
        editable: false,
        formatter: (cellContent, row) => (
          <Select
            key={`${row.Id}_select`}
            options={filteredAcademicCertificates}
            onChange={newValue => {
              this.handleSelectPriceOption(
                row.Id,
                "planStudyId",
                newValue.value
              );
            }}
            defaultValue={academiccertificates.find(
              opt => opt.value == row.planStudyId
            )}
            isDisabled={!showEditButton}
          />
        ),
      },

      {
        dataField: "hourPrice",
        text: t("Hour Price"),
        sort: true,
        editor: {
          type: "number",
        },
        validator: (newValue, row, column) => {
          if (newValue < 0) {
            return {
              valid: false,
              message: this.props.t("Hour Price value must be > 0"),
            };
          }
          return true;
        },
        editable: showEditButton,
      },
      {
        dataField: "yearlyPrice",
        text: t("Yearly Price"),
        sort: true,
        editor: {
          type: "number",
        },
        validator: (newValue, row, column) => {
          if (newValue < 0) {
            return {
              valid: false,
              message: this.props.t("Year Price value must be > 0"),
            };
          }
          return true;
        },
        editable: showEditButton,
      },

      {
        dataField: "delete",
        text: "",
        style: { width: "3rem" },
        isDummyField: true,
        editable: false,
        formatter: (cellContent, fees) => (
          <div className="d-flex" style={{ width: "fit-content" }}>
            {showDeleteButton && (
              <Tooltip title={this.props.t("Delete")} placement="top">
                <Link className="text-danger" to="#">
                  <i
                    className="mdi mdi-delete font-size-18"
                    id="deletetooltip"
                    onClick={() => this.onClickDeletePrice(fees)}
                  ></i>
                </Link>
              </Tooltip>
            )}
          </div>
        ),
      },
    ];

    const studyFeesServiceColumns = [
      { dataField: "Id", text: t("ID"), hidden: true, sort: true },
      {
        dataField: "requestId",
        text: t("Request Type"),
        formatter: (cellContent, row) => (
          <Select
            key={`${row.Id}_select`}
            options={requests}
            onChange={newValue => {
              this.handleSelectServiceOption(
                row.Id,
                "requestId",
                newValue.value
              );
            }}
            defaultValue={requests.find(opt => opt.value == row.requestId)}
          />
        ),
        editable: false,
      },
      {
        dataField: "semesterId",
        text: t("Semester"),

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
                this.handleSemesterDataListChange(event, "semesterId", row.Id)
              }
              defaultValue={
                (
                  semesters.find(semester => semester.key === row.semesterId) ||
                  ""
                ).value
              }
            />
            <datalist id="semesterdatalistOptions">
              {semesters.map(semester => (
                <option key={semester.key} value={semester.value} />
              ))}
            </datalist>
          </div>
        ),
        editable: false,
      },

      {
        dataField: "executeMethodId ",
        text: t("execute Method"),
        editable: false,
        formatter: (cellContent, row) => (
          <Select
            key={`${row.Id}_select`}
            options={executeMethods}
            onChange={newValue => {
              this.handleSelectServiceOption(
                row.Id,
                "executeMethodId",
                newValue.value
              );
            }}
            defaultValue={executeMethods.find(
              opt => opt.value == row.executeMethodId
            )}
          />
        ),
      },
      {
        dataField: "totalAmount",
        text: t("Total Amount "),
        editor: {
          type: "number",
        },
        validator: (newValue, row, column) => {
          if (newValue < 0) {
            return {
              valid: false,
              message: this.props.t("Total Amount value must be > 0"),
            };
          }
          return true;
        },
      },

      {
        dataField: "delete",
        text: "",
        style: { width: "3rem" },
        isDummyField: true,
        editable: false,
        formatter: (cellContent, fees) => (
          <div className="d-flex" style={{ width: "fit-content" }}>
            <Tooltip title={this.props.t("Delete")} placement="top">
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDeleteService(fees)}
                ></i>
              </Link>
            </Tooltip>
          </div>
        ),
      },
    ];

    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteFeesRow}
          onCloseClick={() =>
            this.setState({ deleteModal: false, selectedRow: null })
          }
        />

        <DeleteModal
          show={deleteModal2}
          onDeleteClick={this.handleDeleteCondRow}
          onCloseClick={() =>
            this.setState({ deleteModal2: false, selectedRow: null })
          }
        />

        <DeleteModal
          show={deleteModal3}
          onDeleteClick={this.handleDeletePriceRow}
          onCloseClick={() =>
            this.setState({ deleteModal: false, selectedRow: null })
          }
        />
        <DeleteModal
          show={deleteModal4}
          onDeleteClick={this.handleDeleteServiceRow}
          onCloseClick={() =>
            this.setState({ deleteModal: false, selectedRow: null })
          }
        />

        <div className="page-content">
          <div className="container-fluid">
            <Breadcrumbs
              title={this.props.t("Fees Definition")}
              breadcrumbItem={this.props.t("Fees Definition")}
            />

            <Card>
              <CardBody>
                <Nav className="icon-tab nav-justified">
                  <NavItem>
                    <NavLink
                      id="horizontal-home-link"
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: this.state.activeTab === "1",
                      })}
                      onClick={() => {
                        this.toggleTab("1");
                      }}
                    >
                      <span className="d-none d-sm-block">
                        {this.props.t("Fees Definition")}
                      </span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      id="horizontal-home-link"
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: this.state.activeTab === "2",
                      })}
                      onClick={() => {
                        this.toggleTab("2");
                      }}
                    >
                      <span className="d-none d-sm-block">
                        {this.props.t("Requests Fees")}
                      </span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      id="horizontal-home-link"
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: this.state.activeTab === "3",
                      })}
                      onClick={() => {
                        this.toggleTab("3");
                      }}
                    >
                      <span className="d-none d-sm-block">
                        {this.props.t("Services Definition")}
                      </span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      id="horizontal-home-link"
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: this.state.activeTab === "4",
                      })}
                      onClick={() => {
                        this.toggleTab("4");
                      }}
                    >
                      <span className="d-none d-sm-block">
                        {this.props.t("Fines Definition")}
                      </span>
                    </NavLink>
                  </NavItem>
                </Nav>

                <TabContent
                  activeTab={this.state.activeTab}
                  className="p-3 text-muted"
                >
                  <TabPane tabId="1">
                    <Modal
                      isOpen={this.state.modal}
                      className={this.props.className}
                      centered={true}
                      size="xl"
                    >
                      <ModalHeader toggle={this.toggle} tag="h4">
                        {!!isEdit
                          ? this.props.t("Edit Fees")
                          : this.props.t("Add Fees")}
                      </ModalHeader>
                      <ModalBody className="py-3 px-5">
                        <Formik
                          initialValues={
                            (isEdit && {
                              arTitle: arFees,
                              enTitle: enFees,
                              fiscalYearId: fees && fees.fiscalYearId,
                              fromSemesterId: fees && fees.fromSemesterId,
                              toSemesterId: fees && fees.toSemesterId,
                              currencyId: fees && fees.currencyId,
                              arNote: arNoteFees,
                              enNote: enNoteFees,
                            }) ||
                            (!isEdit && {
                              arTitle: "",
                              enTitle: "",
                              fiscalYearId: null,
                              fromSemesterId: null,
                              toSemesterId: null,
                              currencyId: null,
                              arNote: "",
                              enNote: "",
                            })
                          }
                          enableReinitialize={true}
                          validationSchema={
                            (!isEdit &&
                              Yup.object().shape({
                                arTitle: Yup.string()
                                  .required("arTitle is required")
                                  .notOneOf(
                                    feesDefinition.map(user => user.arTitle),
                                    this.props.t("arTitle already taken")
                                  ),

                                enTitle: Yup.string().required(
                                  "enTitle is required"
                                ),
                              })) ||
                            (isEdit &&
                              Yup.object().shape({
                                arTitle: Yup.string().required(
                                  this.props.t("arTitle is required")
                                ),

                                enTitle: Yup.string().required(
                                  this.props.t("enTitle is required")
                                ),
                              }))
                          }
                          onSubmit={(values, { setSubmitting }) => {
                            if (isEdit) {
                              const updateFees = {
                                Id: feesId,
                                arTitle: values.arTitle,
                                enTitle: values.enTitle,
                                fiscalYearId: values.fiscalYearId,
                                fromSemesterId: values.fromSemesterId,
                                toSemesterId: values.toSemesterId,
                                currencyId: values.currencyId,
                                arNote: values.arNote,
                                enNote: values.enNote,
                              };
                              this.handleUpdate(updateFees);
                            } else {
                              this.handleSave(values);
                            }
                            setSubmitting(false);
                          }}
                        >
                          {({
                            errors,
                            status,
                            touched,
                            values,
                            handleSubmit,
                          }) => (
                            <Form onSubmit={handleSubmit}>
                              <Row>
                                <Col className="col-12">
                                  <div className="mb-3">
                                    <Row>
                                      <Label className="form-label">
                                        {this.props.t("Title (ar)")}
                                        <span className="text-danger ms-2">
                                          *
                                        </span>
                                      </Label>
                                    </Row>
                                    <Field
                                      name="arTitle"
                                      type="text"
                                      className={
                                        "form-control" +
                                        (errors.arTitle && touched.arTitle
                                          ? " is-invalid"
                                          : "")
                                      }
                                    />
                                    <ErrorMessage
                                      name="arTitle"
                                      component="div"
                                      className="invalid-feedback"
                                    />
                                  </div>

                                  <div className="mb-3">
                                    <Row>
                                      <Col>
                                        <Row>
                                          <Label className="form-label">
                                            {t("Title (en)")}
                                            <span className="text-danger ms-2">
                                              *
                                            </span>
                                          </Label>
                                        </Row>
                                        <Field
                                          name="enTitle"
                                          type="text"
                                          className={
                                            "form-control" +
                                            (errors.enTitle && touched.enTitle
                                              ? " is-invalid"
                                              : "")
                                          }
                                        />
                                        <ErrorMessage
                                          name="enTitle"
                                          component="div"
                                          className="invalid-feedback"
                                        />
                                      </Col>

                                      <Col>
                                        <Row>
                                          <Label className="form-label">
                                            {t("Currency")}
                                            <span className="text-danger ms-2">
                                              *
                                            </span>
                                          </Label>
                                        </Row>
                                        <Select
                                          className={`select-style-std `}
                                          name="currencyId"
                                          key={`currency_select`}
                                          options={currencies}
                                          onChange={newValue => {
                                            this.handleSelectCurrencyOption(
                                              "currencyId",
                                              newValue.value
                                            );
                                          }}
                                          defaultValue={currencies.find(
                                            opt => opt.label == currencyName
                                          )}
                                        />
                                        <ErrorMessage
                                          name="currencyId"
                                          component="div"
                                          className="invalid-feedback"
                                        />
                                      </Col>
                                    </Row>
                                  </div>

                                  <div className="mb-3">
                                    <Row>
                                      <Col>
                                        <Row>
                                          <Label className="form-label">
                                            {t("from Semester")}
                                          </Label>
                                        </Row>
                                        <Field
                                          type="text"
                                          name="fromSemesterId"
                                          id="year-semester"
                                          list="yearSemesterdatalistOptions"
                                          placeholder="Type to search..."
                                          className={"form-control"}
                                          onBlur={() =>
                                            this.handleInputBlur(
                                              "fromSemesterId"
                                            )
                                          }
                                          onFocus={() =>
                                            this.handleInputFocus(
                                              "fromSemesterId"
                                            )
                                          }
                                          onChange={event =>
                                            this.handleDataListChange(
                                              event,
                                              "fromSemesterId"
                                            )
                                          }
                                          value={
                                            (
                                              yearSemesters.find(
                                                yearSemester =>
                                                  yearSemester.value ===
                                                  selectedFromSemester
                                              ) || ""
                                            ).value
                                          }
                                        />
                                        <datalist id="yearSemesterdatalistOptions">
                                          {yearSemesters.map(yearSemester => (
                                            <option
                                              key={yearSemester.key}
                                              value={yearSemester.value}
                                            />
                                          ))}
                                        </datalist>
                                      </Col>
                                      <Col>
                                        <Row>
                                          <Label className="form-label">
                                            {t("to Semester")}
                                          </Label>
                                        </Row>
                                        <Field
                                          type="text"
                                          name="toSemesterId"
                                          id="year-semester"
                                          list="toSemesterdatalistOptions"
                                          placeholder="Type to search..."
                                          className={"form-control"}
                                          onBlur={() =>
                                            this.handleInputBlur("toSemesterId")
                                          }
                                          onFocus={() =>
                                            this.handleInputFocus(
                                              "toSemesterId"
                                            )
                                          }
                                          onChange={event =>
                                            this.handleDataListChange(
                                              event,
                                              "toSemesterId"
                                            )
                                          }
                                          value={
                                            (
                                              yearSemesters.find(
                                                yearSemester =>
                                                  yearSemester.value ===
                                                  selectedToSemester
                                              ) || ""
                                            ).value
                                          }
                                        />
                                        <datalist id="toSemesterdatalistOptions">
                                          {yearSemesters.map(yearSemester => (
                                            <option
                                              key={yearSemester.key}
                                              value={yearSemester.value}
                                            />
                                          ))}
                                        </datalist>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="mb-3">
                                    <Row>
                                      <Col>
                                        <Row>
                                          <Label className="form-label">
                                            {t("Arabic Note")}
                                          </Label>
                                        </Row>
                                        <Field
                                          name="arNote"
                                          type="textarea"
                                          className={"form-control"}
                                        />
                                      </Col>
                                      <Col>
                                        <Row>
                                          <Label className="form-label">
                                            {t("English Note")}
                                          </Label>
                                        </Row>
                                        <Field
                                          name="enNote"
                                          type="textarea"
                                          className={"form-control"}
                                        />
                                      </Col>
                                    </Row>
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                {(showCondTable || isEdit) && (
                                  <div>
                                    <Row>
                                      <Col>
                                        <div className="text-sm-start">
                                          {showAddButton && (
                                            <Tooltip
                                              title={this.props.t("Add")}
                                              placement="top"
                                            >
                                              <IconButton
                                                color="primary"
                                                onClick={this.handleAddFeesCond}
                                              >
                                                <i className="mdi mdi-plus-circle blue-noti-icon" />
                                              </IconButton>
                                            </Tooltip>
                                          )}
                                        </div>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <BootstrapTable
                                        keyField="Id"
                                        data={feesConditions}
                                        columns={studyFeesCondColumns}
                                        cellEdit={cellEditFactory({
                                          mode: "click",
                                          blurToSave: true,
                                        })}
                                        noDataIndication={t(
                                          "No Study Fees found"
                                        )}
                                        defaultSorted={defaultCondSorting}
                                        rowEvents={{
                                          onClick: (
                                            e,
                                            row,
                                            rowIndex,
                                            cellName
                                          ) => this.handleClickCell(row),
                                        }}
                                      />
                                    </Row>
                                  </div>
                                )}
                              </Row>
                              <Row>
                                <Col>
                                  <div className="text-end">
                                    <Button type="submit" className="primary">
                                      {t("Save")}
                                    </Button>
                                  </div>
                                </Col>
                              </Row>

                              <Row></Row>
                            </Form>
                          )}
                        </Formik>
                      </ModalBody>
                    </Modal>
                    <Row>
                      {sidebarOpen && (
                        <div style={{ width: sidebarOpen ? "24%" : "0" }}>
                          <div className="mb-1">
                            <Row>
                              <Col lg="5" className="pl-lg-0">
                                <Label className="form-label text-center">
                                  {t("Finance Year")}
                                </Label>
                              </Col>
                              <Col lg="7" className="pl-lg-0">
                                <Input
                                  type="text"
                                  name="fiscalYearId"
                                  id="year-semester"
                                  list="fiscalYeardatalistOptions"
                                  placeholder="Type to search..."
                                  className={"form-control"}
                                  onBlur={() =>
                                    this.handleInputBlur("fiscalYearId")
                                  }
                                  onFocus={() =>
                                    this.handleInputFocus("fiscalYearId")
                                  }
                                  onChange={event =>
                                    this.handleDataListChange(
                                      event,
                                      "fiscalYearId"
                                    )
                                  }
                                  defaultValue={
                                    selectedFiscalYear !== undefined
                                      ? selectedFiscalYear
                                      : fiscalYears.length > 0
                                      ? fiscalYears[0].value
                                      : ""
                                  }
                                />
                                <datalist id="fiscalYeardatalistOptions">
                                  {fiscalYears.map(fiscalYear => (
                                    <option
                                      key={fiscalYear.key}
                                      value={fiscalYear.value}
                                    />
                                  ))}
                                </datalist>
                              </Col>
                            </Row>
                          </div>

                          <Row>
                            <div>
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
                                    onClick={
                                      this.handleErrorFeesDefinitionClose
                                    }
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
                                    onClick={
                                      this.handleSuccessFeesDefinitionClose
                                    }
                                  ></button>
                                </Alert>
                              )}
                            </div>
                          </Row>

                          <BootstrapTable
                            keyField="Id"
                            data={feesDefinition}
                            columns={studyFeesColumns}
                            cellEdit={cellEditFactory({
                              mode: "click",
                              blurToSave: true,
                            })}
                            noDataIndication={t("No Study Fees found")}
                            defaultSorted={defaultSorting}
                            rowEvents={{
                              onClick: (e, row, rowIndex, cellName) =>
                                this.handleClickCell(row),
                            }}
                          />
                          {selectedFiscalYear != "" &&
                            selectedFiscalYear != null && (
                              <Row>
                                <Col>
                                  <div className="text-sm-end">
                                    {showAddButton && (
                                      <Tooltip
                                        title={this.props.t("Add")}
                                        placement="top"
                                      >
                                        <IconButton
                                          color="primary"
                                          onClick={this.handleFeesClicks}
                                        >
                                          <i className="mdi mdi-plus-circle blue-noti-icon" />
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                  </div>
                                </Col>
                              </Row>
                            )}
                        </div>
                      )}

                      <Col lg="auto" className="p-0">
                        <div className="collapse-course">
                          <i
                            onClick={this.toggleSidebar}
                            className="bx bx-menu"
                          ></i>
                        </div>
                      </Col>

                      <div style={{ width: sidebarOpen ? "73%" : "97%" }}>
                        {fiscalYearContents.length >= 2 && (
                          <Nav
                            pills
                            className="navtab-bg nav-justified"
                            key={"2"}
                          >
                            <NavItem>
                              <NavLink
                                id="vertical-tabPane"
                                style={{ cursor: "pointer" }}
                                className={classnames({
                                  active:
                                    this.state.studyFeesTab ===
                                    fiscalYearContents[0].Id,
                                })}
                                onClick={() => {
                                  this.toggleFeesStudy(
                                    fiscalYearContents[0].Id
                                  );
                                }}
                              >
                                {fiscalYearContents[0].arTitle}
                              </NavLink>
                            </NavItem>
                            <NavItem>
                              <NavLink
                                id="vertical-tabPane"
                                style={{ cursor: "pointer" }}
                                className={classnames({
                                  active:
                                    this.state.studyFeesTab ===
                                    fiscalYearContents[1].Id,
                                })}
                                onClick={() => {
                                  this.toggleFeesStudy(
                                    fiscalYearContents[1].Id
                                  );
                                }}
                              >
                                {fiscalYearContents[1].arTitle}
                              </NavLink>
                            </NavItem>
                          </Nav>
                        )}
                        <TabContent
                          activeTab={this.state.studyFeesTab}
                          className="p-3 text-muted"
                        >
                          <TabPane
                            tabId={
                              fiscalYearContents.length > 0
                                ? fiscalYearContents[0].Id
                                : "85"
                            }
                          >
                            <div>
                              {deleted == 0 && showAlertPrice && (
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
                                    onClick={
                                      this.handleErrorFeesDefinitionClose
                                    }
                                  ></button>
                                </Alert>
                              )}
                              {deleted == 1 && showAlertPrice && (
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
                                    onClick={
                                      this.handleSuccessFeesDefinitionClose
                                    }
                                  ></button>
                                </Alert>
                              )}
                            </div>
                            <div className="table-responsive">
                              <PaginationProvider
                                pagination={paginationFactory(pageOptions)}
                                keyField="Id"
                                columns={studyFeesPriceColumns}
                                data={feesPrices}
                              >
                                {({
                                  paginationProps,
                                  paginationTableProps,
                                }) => (
                                  <ToolkitProvider
                                    keyField="Id"
                                    data={feesPrices}
                                    columns={studyFeesPriceColumns}
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

                                          {/* Period Select */}
                                          <Col sm="4">
                                            <Row>
                                              <Col sm="3">
                                                <Label className="form-label">
                                                  {t("Period")}
                                                </Label>
                                              </Col>
                                              <Col
                                                style={{
                                                  padding: "0 0 0 15px",
                                                }}
                                              >
                                                <Select
                                                  style={{
                                                    borderColor: "",
                                                    borderWidth: 3,
                                                  }}
                                                  name="periodId"
                                                  key={`year_select`}
                                                  options={filteredPeriod}
                                                  onChange={newValue => {
                                                    this.handleSelectPeriod(
                                                      "periodId",
                                                      newValue
                                                    );
                                                  }}
                                                  value={defaultPeriod}
                                                />
                                              </Col>
                                            </Row>
                                          </Col>

                                          {/* Currency Select */}
                                          <Col sm="3">
                                            <div className="text-start">
                                              <Row>
                                                <Col sm="3">
                                                  <Label className="form-label">
                                                    {t("Currency") + ":"}
                                                  </Label>
                                                </Col>
                                                <Col className="ms-1">
                                                  <Label>
                                                    {currency != undefined
                                                      ? currency.label
                                                      : ""}
                                                  </Label>
                                                </Col>
                                              </Row>
                                            </div>
                                          </Col>

                                          {/* Tooltips */}
                                          <Col sm="2">
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
                                                    onClick={
                                                      this.handleAddPriceRow
                                                    }
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
                                                  onClick={
                                                    this.handleErrorClose
                                                  }
                                                ></button>
                                              </Alert>
                                            )}
                                          </div>
                                        </Row>
                                        <BootstrapTable
                                          keyField="Id"
                                          {...toolkitprops.baseProps}
                                          {...paginationTableProps}
                                          data={feesPrices}
                                          columns={studyFeesPriceColumns}
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
                                                column.dataField ==
                                                  "yearlyPrice" ||
                                                "hourPrice"
                                              ) {
                                                this.handleFeesPriceDataChange(
                                                  row.Id,
                                                  column.dataField,
                                                  newValue
                                                );
                                              }
                                            },
                                          })}
                                          noDataIndication={t(
                                            "No Study Fees Price found"
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
                          </TabPane>
                          <TabPane
                            tabId={
                              fiscalYearContents.length > 0
                                ? fiscalYearContents[1].Id
                                : "86"
                            }
                          >
                            <div>
                              {deleted == 0 && showAlertService && (
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
                                    onClick={
                                      this.handleErrorFeesDefinitionClose
                                    }
                                  ></button>
                                </Alert>
                              )}
                              {deleted == 1 && showAlertService && (
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
                                    onClick={
                                      this.handleSuccessFeesDefinitionClose
                                    }
                                  ></button>
                                </Alert>
                              )}
                            </div>
                            <div className="table-responsive">
                              <PaginationProvider
                                pagination={paginationFactory(pageOptions)}
                                keyField="Id"
                                columns={studyFeesServiceColumns}
                                data={feesServices}
                              >
                                {({
                                  paginationProps,
                                  paginationTableProps,
                                }) => (
                                  <ToolkitProvider
                                    keyField="Id"
                                    data={feesServices}
                                    columns={studyFeesServiceColumns}
                                    search
                                  >
                                    {toolkitprops => (
                                      <React.Fragment>
                                        <Row>
                                          {/* Search Box */}
                                          <Col sm="3">
                                            <div className="search-box ms-2 mb-2 d-inline-block">
                                              <div className="position-relative">
                                                <SearchBar
                                                  {...toolkitprops.searchProps}
                                                />
                                              </div>
                                            </div>
                                          </Col>

                                          {/* Period Select */}
                                          <Col sm="4">
                                            <Row>
                                              <Col sm="3">
                                                <Label className="form-label">
                                                  {t("Period")}
                                                </Label>
                                              </Col>
                                              <Col
                                                style={{
                                                  padding: "0 0 0 15px",
                                                }}
                                              >
                                                <Select
                                                  style={{
                                                    borderColor: "",
                                                    borderWidth: 3,
                                                  }}
                                                  name="periodId"
                                                  key={`year_select`}
                                                  options={filteredPeriod}
                                                  onChange={newValue => {
                                                    this.handleSelectPeriod(
                                                      "periodId",
                                                      newValue
                                                    );
                                                  }}
                                                  value={defaultPeriod}
                                                />
                                              </Col>
                                            </Row>
                                          </Col>

                                          {/* Currency Select */}
                                          <Col sm="3">
                                            <div className="text-start">
                                              <Row>
                                                <Col sm="3">
                                                  <Label className="form-label">
                                                    {t("Currency") + ":"}
                                                  </Label>
                                                </Col>
                                                <Col className="ms-1">
                                                  <Label>
                                                    {currency != undefined
                                                      ? currency.label
                                                      : ""}
                                                  </Label>
                                                </Col>
                                              </Row>
                                            </div>
                                          </Col>

                                          {/* Tooltips */}
                                          <Col sm="2">
                                            <div className="text-sm-end">
                                              <Tooltip
                                                title={this.props.t("Copy")}
                                                onClick={this.handleCopySevice}
                                                placement="top"
                                              >
                                                <IconButton color="primary">
                                                  <i className="mdi mdi-content-copy blue-noti-icon" />
                                                </IconButton>
                                              </Tooltip>
                                              <Tooltip
                                                title={this.props.t("Add")}
                                                placement="top"
                                              >
                                                <IconButton
                                                  color="primary"
                                                  onClick={
                                                    this.handleAddServiceRow
                                                  }
                                                >
                                                  <i className="mdi mdi-plus-circle blue-noti-icon" />
                                                </IconButton>
                                              </Tooltip>
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
                                                  onClick={
                                                    this.handleErrorClose
                                                  }
                                                ></button>
                                              </Alert>
                                            )}
                                          </div>
                                        </Row>
                                        <BootstrapTable
                                          defaultSorted={defaultServiceSorting}
                                          keyField="Id"
                                          {...toolkitprops.baseProps}
                                          {...paginationTableProps}
                                          data={feesServices}
                                          columns={studyFeesServiceColumns}
                                          cellEdit={cellEditFactory({
                                            mode: "click",
                                            blurToSave: true,
                                            afterSaveCell: (
                                              oldValue,
                                              newValue,
                                              row,
                                              column
                                            ) => {
                                              this.handleSelectServiceOption(
                                                row.Id,
                                                column.dataField,
                                                newValue
                                              );
                                            },
                                          })}
                                          noDataIndication={t(
                                            "No Study Fees Price found"
                                          )}
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
                          </TabPane>
                        </TabContent>
                      </div>
                    </Row>
                  </TabPane>
                  <TabPane tabId="2">
                    <RequestsFeesList />
                  </TabPane>
                  <TabPane tabId="3"></TabPane>
                  <TabPane tabId="4">
                    <FinesDefinitionList />
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({
  feesDefinition,
  currencies,
  mobAppFacultyAccs,
  generalManagements,
  semesters,
  periods,
  nationalities,
  countries,
  academiccertificates,
  requests,
  menu_items,
}) => ({
  feesDefinition: feesDefinition.feesDefinition,
  deleted: feesDefinition.deleted,
  feesConditions: feesDefinition.feesConditions,
  last_created_fees: feesDefinition.last_created_fees,
  feesPrices: feesDefinition.feesPrices,
  feesServices: feesDefinition.feesServices,
  fiscalYears: periods.fiscalYears,
  fiscalYearContents: periods.fiscalYearContents,
  faculties: mobAppFacultyAccs.faculties,
  currencies: currencies.currencies,
  yearSemesters: generalManagements.yearSemesters,
  currentSemester: semesters.currentSemester,
  nationalities: nationalities.nationalities,
  requests: requests.requests,
  semesters: semesters.semesters,
  countries: countries.countries,
  fiscalYearDetails: feesDefinition.fiscalYearDetails,
  executeMethods: feesDefinition.executeMethods,
  academiccertificates: academiccertificates.academiccertificates,
  filteredAcademicCertificates:
    academiccertificates.filteredAcademicCertificates,
  user_menu: menu_items.user_menu || [],
});

const mapDispatchToProps = dispatch => ({
  onGetFeesDefinition: feesDefinition =>
    dispatch(getFeesDefinition(feesDefinition)),
  onAddNewFeesDefinition: feesDefinition =>
    dispatch(addNewFeesDefinition(feesDefinition)),
  onUpdateFeesDefinition: feesDefinition =>
    dispatch(updateFeesDefinition(feesDefinition)),
  onDeleteFeesDefinition: feesDefinition =>
    dispatch(deleteFeesDefinition(feesDefinition)),
  onGetFeesDefinitionDeletedValue: () =>
    dispatch(getFeesDefinitionDeletedValue()),
  onCopyFees: feesDefinition => dispatch(copyFees(feesDefinition)),
  onGetCurrentSemester: () => dispatch(getCurrentSemester()),
  onGetFiscalYears: () => dispatch(getFiscalYears()),
  onGetFeesConditions: feesConditions =>
    dispatch(getFeesConditions(feesConditions)),
  onAddNewFeesCondition: feesCondition =>
    dispatch(addNewFeesCondition(feesCondition)),
  onUpdateFeesCondition: feesCondition =>
    dispatch(updateFeesCondition(feesCondition)),
  onDeleteFeesCondition: feesCondition =>
    dispatch(deleteFeesCondition(feesCondition)),
  onGetFeesPrices: feesPrices => dispatch(getFeesPrices(feesPrices)),
  onAddNewFeesPrice: feesPrice => dispatch(addNewFeesPrice(feesPrice)),
  onUpdateFeesPrice: feesPrice => dispatch(updateFeesPrice(feesPrice)),
  onDeleteFeesPrice: feesPrice => dispatch(deleteFeesPrice(feesPrice)),
  onCopyFeesPrice: feesPrice => dispatch(copyFeesPrice(feesPrice)),
  onGetFeesServices: feesServices => dispatch(getFeesServices(feesServices)),
  onAddNewFeesService: feesService => dispatch(addNewFeesService(feesService)),
  onUpdateFeesService: feesService => dispatch(updateFeesService(feesService)),
  onDeleteFeesService: feesService => dispatch(deleteFeesService(feesService)),
  onCopyFeesService: feesService => dispatch(copyFeesService(feesService)),
  onGetFiscalYearDetails: fiscalYearDetails =>
    dispatch(getFiscalYearDetails(fiscalYearDetails)),
  onGetFilteredAcademicCertificates: academicCer =>
    dispatch(getFilteredAcademicCertificates(academicCer)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(FeesDefinitionList));
