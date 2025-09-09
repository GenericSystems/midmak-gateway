import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import "./Academy.scss";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import { Container, Form, Input } from "reactstrap";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Row, Col, Alert } from "reactstrap";
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";
import { connect } from "react-redux";
import { isEmpty, size, map } from "lodash";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  TextField,
} from "@mui/material";

import {
  getAcademyOrgStructure,
  addNewAcademyOrgStructure,
  updateAcademyOrgStructure,
  deleteAcademyOrgStructure,
  getAcademyOrgStructureDeletedValue,
} from "store/academyOrgStructure/actions";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
} from "../../utils/menuUtils";
class AcademyTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      academyOrgStructures: [],
      academyOrgStructure: {},
      newDirectorateArName: "",
      newDirectorateEnName: "",
      newDirectorateNum: "",
      newDirectorateDean: "",
      newDirectorateCode: "",
      editDirectorateArName: "",
      editDirectorateEnName: "",
      editDirectorateNum: "",
      editDirectorateDean: "",
      editDirectorateCode: "",
      newDepartmentArName: "",
      newDepartmentEnName: "",
      newDepartmentNum: "",
      newDepartmentPresident: "",
      depaDirectorateId: "",
      editDepartmentArName: "",
      editDepartmentEnName: "",
      editDepartmentNum: "",
      editDepartmentPresident: "",
      addingDepartment: false,
      academyDefaultName: "Your Academy",
      expandedNodes: ["1"],
      editingAcademyName: false,
      openForm: null,
      errorMessage: null,
      successMessage: null,
      DirectorateBeingEdited: "",
      departmentBeingEdited: "",
      directorateNameError: false,
      directorateNumError: false,
      directorateCodeError: false,
      departmentNameError: false,
      departmentNumError: false,
      deleteDirectorateModal: false,
      deleteDepartmentModal: false,
      selectedDepId: null,
      selectedDirectorateId: null,
      selectedDirectorate: null,
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
      departmentId: "",

      NewOrganismArName: "",
      NewOrganismEnName: "",
      NewOrganismNum: "",
      NewOrganismPresident: "",

      editOrganismArName: "",
      editOrganismEnName: "",
      editOrganismNum: "",
      editOrganismPresident: "",

      OrganisArnameError: false,
      OrganisEnnameError: false,
      OrganisNumError: false,
      organismId: "",
      depaorganismId: "",
      selectedDepartment: null,
      selectedOrganismId: null,
      deleteOrganismModal: false,

      isShowDirectorateInfo: false,
      isShowDepartmentInfo: false,
      isShowOrganismInfo: false,
      languageState: "",
    };
    this.handleEditDirectorate = this.handleEditDirectorate.bind(this);
    this.handleDirectorateDataChange =
      this.handleDirectorateDataChange.bind(this);
    this.handleSaveDirectorate = this.handleSaveDirectorate.bind(this);
  }

  componentDidMount() {
    const lang = localStorage.getItem("I18N_LANGUAGE");
    const {
      i18n,
      academyOrgStructures,
      onGetAcademyOrgStructures,
      academyInfo,
      deleted,
      user_menu,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);

    onGetAcademyOrgStructures();

    this.setState({ academyOrgStructures });
    this.setState({ academyInfo });
    this.setState({ deleted, languageState: lang });
    i18n.on("languageChanged", this.handleLanguageChange);
  }

  handleLanguageChange = lng => {
    const { i18n, onGetAcademyOrgStructures } = this.props;
    const lang = localStorage.getItem("I18N_LANGUAGE");

    // if (lang != lng) {
    // onGetAcademyOrgStructures();
    this.setState({ languageState: lng });
    // }
  };

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
    }
  }

  updateShowDeleteButton = (menu, pathname) => {
    const showDeleteButton = checkIsDeleteForPage(menu, pathname);
    this.setState({ showDeleteButton });
  };

  updateShowAddButton = (menu, pathname) => {
    const showAddButton = checkIsAddForPage(menu, pathname);
    this.setState({ showAddButton });
  };

  updateShowEditButton = (menu, pathname) => {
    const showEditButton = checkIsEditForPage(menu, pathname);
    this.setState({ showEditButton });
  };

  handleAddDirectorateForm = () => {
    this.setState({ openForm: "directorate" });
    this.setState({ newDirectorateArName: "" });
    this.setState({ newDirectorateEnName: "" });
    this.setState({ newDirectorateNum: "" });
    this.setState({ newDirectorateDean: "" });
    this.setState({ newDirectorateCode: "" });

    this.setState({ isShowDirectorateInfo: false });
    this.setState({ isShowDepartmentInfo: false });
    this.setState({ isShowOrganismInfo: false });
  };

  handleDirectorateDataChange = (fieldName, value) => {
    const { openForm } = this.state;
    console.log("value", value);
    if (openForm == "directorate") {
      if (fieldName == "arTitle") {
        this.setState({ newDirectorateArName: value });
        if (value.trim() === "") {
          this.setState({ directorateNameError: true });
        } else {
          this.setState({ directorateNameError: false });
        }
      }

      if (fieldName == "directorateNum") {
        this.setState({ newDirectorateNum: value });
        if (value.trim() === "") {
          this.setState({ directorateNumError: true });
        } else {
          this.setState({ directorateNumError: false });
        }
      }

      if (fieldName == "enTitle") {
        this.setState({ newDirectorateEnName: value });
      }

      if (fieldName == "directorateDean") {
        this.setState({ newDirectorateDean: value });
      }
      if (fieldName == "directorateCode") {
        this.setState({ newDirectorateCode: value });
        if (value.trim() === "") {
          this.setState({ directorateCodeError: true });
        } else {
          this.setState({ directorateCodeError: false });
        }
      }
    } else if (openForm == "editDirectorate") {
      if (fieldName == "arTitle") {
        this.setState({ editDirectorateArName: value });
      }

      if (fieldName == "directorateNum") {
        this.setState({ editDirectorateNum: value });
      }

      if (fieldName == "enTitle") {
        this.setState({ editDirectorateEnName: value });
      }

      if (fieldName == "directorateDean") {
        this.setState({ editDirectorateDean: value });
      }

      if (fieldName == "directorateCode") {
        this.setState({ editDirectorateCode: value });
      }
    }
  };

  handleEditDirectorate = directorate => {
    this.setState({ openForm: "editDirectorate" });
    this.setState({ directorateId: directorate.Id });
    this.setState({ editDirectorateArName: directorate.directorateArName });
    this.setState({
      editDirectorateEnName: directorate.directorateEnName || "",
    });
    this.setState({ editDirectorateNum: directorate.directorateNum });
    this.setState({ editDirectorateDean: directorate.directorateDean || "" });
    this.setState({ editDirectorateCode: directorate.directorateCode || "" });

    this.setState({ isShowDirectorateInfo: false });
    this.setState({ isShowDepartmentInfo: false });
    this.setState({ isShowOrganismInfo: false });
  };

  handleSaveDirectorate = () => {
    const { openForm, directorateId } = this.state;
    const { academyOrgStructures } = this.props;

    if (openForm == "directorate") {
      const { onAddAcademyOrgStructure } = this.props;
      const {
        newDirectorateArName,
        newDirectorateEnName,
        newDirectorateNum,
        newDirectorateDean,
        newDirectorateCode,
      } = this.state;

      if (
        newDirectorateArName.trim() === "" ||
        newDirectorateNum.trim() === "" ||
        newDirectorateCode.trim() === ""
      ) {
        this.setState({ directorateNameError: true, saveError: true });
        this.setState({ directorateNumError: true, saveError: true });
        this.setState({ directorateCodeError: true, saveError: true });
      } else {
        this.setState({ directorateNameError: false, saveError: false });
        this.setState({ directorateNumError: false, saveError: false });
        this.setState({ directorateCodeError: false, saveError: false });

        const isDuplicateDirectorate = academyOrgStructures.some(
          directorate =>
            directorate.Id &&
            directorate.directorateArName &&
            directorate.directorateArName.trim() === newDirectorateArName.trim()
        );

        const isDuplicateDirectorateNumber = academyOrgStructures.some(
          directorate =>
            directorate.Id &&
            directorate.directorateNum &&
            directorate.directorateNum === parseInt(newDirectorateNum, 10)
        );

        if (isDuplicateDirectorate) {
          const duplicateErrorMessage = this.props.t(
            "Directorate Name already exists"
          );
          this.setState({ errorMessage: duplicateErrorMessage });
        } else if (isDuplicateDirectorateNumber) {
          const duplicateNumberErrorMessage = this.props.t(
            "Directorate Number already exists"
          );
          this.setState({ errorMessage: duplicateNumberErrorMessage });
        } else {
          const successSavedMessage = this.props.t(
            "Directorate saved successfully"
          );
          this.setState({ successMessage: successSavedMessage });

          const payload = {
            arTitle: newDirectorateArName,
            enTitle: newDirectorateEnName,
            directorateNum: newDirectorateNum,
            directorateDean: newDirectorateDean,
            directorateCode: newDirectorateCode,
          };
          (payload["tablename"] = "Common_Directorate"),
            onAddAcademyOrgStructure(payload);
        }
      }
    } else if (openForm == "editDirectorate") {
      const { onUpdateAcademyOrgStructure } = this.props;
      const {
        editDirectorateArName,
        editDirectorateEnName,
        editDirectorateNum,
        editDirectorateDean,
        editDirectorateCode,
        directorateNumError,
      } = this.state;

      const isDuplicateDirectorate = academyOrgStructures
        .filter(directorate => directorate.Id !== directorateId)
        .some(
          directorate =>
            directorate.Id &&
            typeof directorate.arTitle === "string" &&
            directorate.arTitle.trim() === editDirectorateArName.trim()
        );

      const isDuplicateDirectorateNumber = academyOrgStructures.some(
        directorate =>
          directorate.Id !== directorateId &&
          directorate.directorateNum &&
          directorate.directorateNum === parseInt(editDirectorateNum, 10) &&
          academyOrgStructures.some(
            otherDirectorate =>
              otherDirectorate.directorateNum ===
                parseInt(editDirectorateNum, 10) &&
              otherDirectorate.Id !== directorateId
          )
      );

      if (isDuplicateDirectorate) {
        const duplicateErrorMessage = this.props.t(
          "Directorate Name already exists"
        );
        this.setState({ errorMessage: duplicateErrorMessage });
      } else if (isDuplicateDirectorateNumber) {
        const duplicateNumberErrorMessage = this.props.t(
          "Directorate Number already exists"
        );
        this.setState({ errorMessage: duplicateNumberErrorMessage });
      }
      if (!isDuplicateDirectorate && !isDuplicateDirectorateNumber) {
        if (editDirectorateArName.trim() === "") {
          this.setState({ directorateNameError: true, saveError: true });
        }

        if (editDirectorateNum === "") {
          this.setState({ directorateNumError: true, saveError: true });
        } else if (
          (editDirectorateArName.trim() !== editDirectorateArName.trim()) !==
          ""
        ) {
          this.setState({ directorateNameError: false, saveError: false });
        } else if (editDirectorateNum !== "") {
          this.setState({ directorateNumError: false, saveError: false });
        }

        if (editDirectorateCode === "") {
          this.setState({ directorateCodeError: true, saveError: true });
        } else if (editDirectorateCode !== "") {
          this.setState({ directorateCodeError: false, saveError: false });
        }

        if (
          editDirectorateArName.trim() !== "" ||
          editDirectorateNum !== "" ||
          editDirectorateCode.trim() !== ""
        ) {
          const successUpdatedMessage = this.props.t(
            "Directorate updated successfully"
          );
          this.setState({ successMessage: successUpdatedMessage });
          const payload = {
            Id: directorateId,
            arTitle: editDirectorateArName,
            enTitle: editDirectorateEnName,
            directorateNum: editDirectorateNum,
            directorateDean: editDirectorateDean,
            directorateCode: editDirectorateCode,
          };
          (payload["tablename"] = "Common_Directorate"),
            onUpdateAcademyOrgStructure(payload);
        }
      }
    }
  };

  onClickDeleteDirectorate = directorate => {
    this.setState({
      selectedDirectorateId: directorate.Id,
      deleteDirectorateModal: true,
    });
    this.setState({ selectedDirectorate: directorate });
  };

  handleDeleteDirectorate = () => {
    const { selectedDirectorate } = this.state;
    const { onDeleteAcademyOrgStructure } = this.props;
    let payload = { Id: selectedDirectorate.Id };
    payload["tablename"] = "Common_Directorate";
    this.setState({ deleteDirectorateModal: null });

    if (selectedDirectorate.departments[0].Id == null) {
      this.setState({ errorMessage: null, showAlert: true });
      onDeleteAcademyOrgStructure(payload);
    } else {
      const deleteErrorMessage = this.props.t(
        "Can't delete this Directorate! Delete it's departments first"
      );
      this.setState({ errorMessage: deleteErrorMessage });
    }
  };

  handleAddDepartmentForm = Directorate => {
    this.setState({ openForm: "department" });
    this.setState({ depaDirectorateId: Directorate });
    this.setState({ newDepartmentArName: "" });
    this.setState({ newDepartmentEnName: "" });
    this.setState({ newDepartmentNum: "" });
    this.setState({ newDepartmentPresident: "" });

    this.setState({ isShowDirectorateInfo: false });
    this.setState({ isShowDepartmentInfo: false });
    this.setState({ isShowOrganismInfo: false });
  };

  handelAddOrganismForm = departmentId => {
    this.setState({ openForm: "organism" });
    this.setState({ depaorganismId: departmentId });
    this.setState({ NewOrganismArName: "" });
    this.setState({ NewOrganismEnName: "" });
    this.setState({ NewOrganismNum: "" });
    this.setState({ NewOrganismPresident: "" });

    this.setState({ isShowDirectorateInfo: false });
    this.setState({ isShowDepartmentInfo: false });
    this.setState({ isShowOrganismInfo: false });
  };

  handelEditOrganism = (organism, departmentId) => {
    this.setState({ openForm: "editOrganism" });
    this.setState({ organismId: organism.Id });
    this.setState({ depaorganismId: departmentId });
    this.setState({ editOrganismArName: organism.organismArName });
    this.setState({ editOrganismEnName: organism.organismEnName || "" });
    this.setState({ editOrganismNum: organism.organismNum });
    this.setState({
      editOrganismPresident: organism.organismPresident || "",
    });

    this.setState({ isShowDirectorateInfo: false });
    this.setState({ isShowDepartmentInfo: false });
    this.setState({ isShowOrganismInfo: false });
  };

  handleOrganismDataChange = (fieldName, value) => {
    const { openForm } = this.state;
    console.log("value", value);

    if (openForm === "organism") {
      if (fieldName === "organismArName") {
        this.setState({ NewOrganismArName: value });
        this.setState({ OrganisArnameError: value.trim() === "" });
      }

      if (fieldName === "organismEnName") {
        this.setState({ NewOrganismEnName: value });
        this.setState({ OrganisEnnameError: value.trim() === "" });
      }

      if (fieldName === "organismNum") {
        this.setState({ NewOrganismNum: value });
        this.setState({ OrganisNumError: value.trim() === "" });
      }

      if (fieldName === "organismPresident") {
        this.setState({ NewOrganismPresident: value });
      }
    } else if (openForm === "editOrganism") {
      if (fieldName === "organismArName") {
        this.setState({ editOrganismArName: value });
      }

      if (fieldName === "organismEnName") {
        this.setState({ editOrganismEnName: value });
      }

      if (fieldName === "organismNum") {
        this.setState({ editOrganismNum: parseInt(value, 10) });
      }

      if (fieldName === "organismPresident") {
        this.setState({ editOrganismPresident: value });
      }
    }
  };

  handleSaveOrganism = () => {
    const { openForm, organismId, depaorganismId } = this.state;
    const {
      academyOrgStructures,
      onAddAcademyOrgStructure,
      onUpdateAcademyOrgStructure,
      t,
    } = this.props;

    if (openForm === "organism") {
      const {
        NewOrganismArName,
        NewOrganismEnName,
        NewOrganismNum,
        NewOrganismPresident,
      } = this.state;

      // Validation
      if (NewOrganismArName.trim() === "" || NewOrganismNum.trim() === "") {
        this.setState({
          OrganisArnameError: NewOrganismArName.trim() === "",
          OrganisNumError: NewOrganismNum.trim() === "",
          saveError: true,
        });
        return;
      }

      const selectedDepartment = academyOrgStructures
        .flatMap(directorate => directorate.departments)
        .find(department => department.Id === depaorganismId);

      if (!selectedDepartment) {
        console.log(`Department with ID ${depaorganismId} not found.`);
        return;
      }

      const isDuplicateOrganism = selectedDepartment.organisms?.some(
        organism => organism.organismArName === NewOrganismArName
      );

      const isDuplicateOrganismNum = selectedDepartment.organisms?.some(
        organism => organism.organismNum?.toString() === NewOrganismNum.trim()
      );

      if (isDuplicateOrganism) {
        const duplicateErrorMessage = t("Organism Name already exists");
        this.setState({ errorMessage: duplicateErrorMessage });
      } else if (isDuplicateOrganismNum) {
        const duplicateNumberErrorMessage = t("Organism Number already exists");
        this.setState({ errorMessage: duplicateNumberErrorMessage });
      } else {
        const payload = {
          arTitle: NewOrganismArName,
          enTitle: NewOrganismEnName,
          organismNum: parseInt(NewOrganismNum, 10),
          organismPresident: NewOrganismPresident,
          departmentId: depaorganismId,
          tablename: "Common_Organism",
        };

        const successSavedMessage = t("Organism saved successfully");
        this.setState({
          successMessage: successSavedMessage,
          saveError: false,
        });

        onAddAcademyOrgStructure(payload);
      }
    } else if (openForm === "editOrganism") {
      const {
        editOrganismArName,
        editOrganismEnName,
        editOrganismNum,
        editOrganismPresident,
      } = this.state;

      const selectedDepartment = academyOrgStructures
        .flatMap(directorate => directorate.departments)
        .find(department => department.Id === depaorganismId);

      const isDuplicateOrganism = selectedDepartment?.organisms?.some(
        organism =>
          organism.Id !== organismId &&
          (organism.organismArName === editOrganismArName ||
            organism.organismNum === parseInt(editOrganismNum, 10))
      );

      console.log(editOrganismArName, "hhhh");

      if (isDuplicateOrganism) {
        const duplicateErrorMessage = t("Organism already exists");
        this.setState({ errorMessage: duplicateErrorMessage });
      } else {
        if (editOrganismArName.trim() === "") {
          this.setState({ OrganisArnameError: true, saveError: true });
          return;
        }

        const payload = {
          Id: organismId,
          arTitle: editOrganismArName,
          enTitle: editOrganismEnName,
          organismNum: parseInt(editOrganismNum, 10),
          organismPresident: editOrganismPresident,
          departmentId: depaorganismId,
          tablename: "Common_Organism",
        };

        const successUpdatedMessage = t("Organism updated successfully");
        this.setState({
          OrganisArnameError: false,
          OrganisNumError: false,
          saveError: false,
          successMessage: successUpdatedMessage,
        });

        onUpdateAcademyOrgStructure(payload);
      }
    }
  };

  handleDepartmentDataChange = (fieldName, value) => {
    const { openForm } = this.state;
    console.log("value", value);

    if (openForm == "department") {
      if (fieldName == "departmentArName") {
        this.setState({ newDepartmentArName: value });
        if (value.trim() === "") {
          this.setState({ departmentNameError: true });
        } else {
          this.setState({ departmentNameError: false });
        }
      }

      if (fieldName == "departmentNum") {
        this.setState({ newDepartmentNum: value });
        if (value.trim() === "") {
          this.setState({ departmentNumError: true });
        } else {
          this.setState({ departmentNumError: false });
        }
      }

      if (fieldName == "departmentEnName") {
        this.setState({ newDepartmentEnName: value });
      }

      if (fieldName == "departmentPresident") {
        this.setState({ newDepartmentPresident: value });
      }
    } else if (openForm == "editDepartment") {
      if (fieldName == "departmentArName") {
        this.setState({ editDepartmentArName: value });
      }

      if (fieldName == "departmentNum") {
        this.setState({ editDepartmentNum: parseInt(value, 10) });
      }

      if (fieldName == "departmentEnName") {
        this.setState({ editDepartmentEnName: value });
      }

      if (fieldName == "departmentPresident") {
        this.setState({ editDepartmentPresident: value });
      }
    }
  };

  handleEditDepartment = (department, directorateId) => {
    this.setState({ openForm: "editDepartment" });
    this.setState({ departmentId: department.Id });
    this.setState({ depaDirectorateId: directorateId });
    this.setState({ editDepartmentArName: department.departmentArName });
    this.setState({ editDepartmentEnName: department.departmentEnName || "" });
    this.setState({ editDepartmentNum: department.departmentNum });
    this.setState({
      editDepartmentPresident: department.departmentPresident || "",
    });

    this.setState({ isShowDirectorateInfo: false });
    this.setState({ isShowDepartmentInfo: false });
    this.setState({ isShowOrganismInfo: false });
  };

  handleSaveDepartment = () => {
    const { openForm, departmentId, depaDirectorateId } = this.state;
    const { academyOrgStructures } = this.props;
    console.log(" dep form ");
    if (openForm == "department") {
      const { onAddAcademyOrgStructure } = this.props;
      const {
        newDepartmentArName,
        newDepartmentEnName,
        newDepartmentNum,
        newDepartmentPresident,
      } = this.state;

      if (newDepartmentArName.trim() === "" || newDepartmentNum.trim() === "") {
        this.setState({ departmentNameError: true, saveError: true });
        this.setState({ departmentNumError: true, saveError: true });
      } else {
        this.setState({ departmentNameError: false, saveError: false });
        this.setState({ departmentNumError: false, saveError: false });

        const isDuplicateDepartment = academyOrgStructures.some(
          directorate =>
            directorate.Id &&
            directorate.departments.some(
              department =>
                department.Id &&
                department.departmentArName &&
                department.departmentArName.trim() ===
                  newDepartmentArName.trim()
            )
        );

        const selectedDirectorate = academyOrgStructures.find(
          directorate => directorate.Id === depaDirectorateId
        );

        console.log("selectedDirectorate", selectedDirectorate);
        if (!selectedDirectorate) {
          console.log(
            `Directorate with directorateId ${depaDirectorateId} not found.`
          );
          return;
        }

        const isDuplicateDepNumber = selectedDirectorate.departments.some(
          department => department.departmentNum === newDepartmentNum
        );
        console.log("isDuplicateDepNumber", isDuplicateDepNumber);

        if (isDuplicateDepartment) {
          const duplicateErrorMessage = this.props.t(
            "Department Name already exists"
          );
          this.setState({ errorMessage: duplicateErrorMessage });
        } else if (isDuplicateDepNumber) {
          const duplicateNumberErrorMessage = this.props.t(
            "Department Number already exists"
          );
          this.setState({ errorMessage: duplicateNumberErrorMessage });
        } else {
          const successSavedMessage = this.props.t(
            "Department saved successfully"
          );
          this.setState({ successMessage: successSavedMessage });
          const payload = {
            arTitle: newDepartmentArName,
            enTitle: newDepartmentEnName,
            departmentNum: newDepartmentNum,
            departmentPresident: newDepartmentPresident,
            directorateId: depaDirectorateId,
          };
          (payload["tablename"] = "Common_Department"),
            //console.log(payload, "ppppppppppppppp");
            onAddAcademyOrgStructure(payload);
        }
      }
    } else if (openForm == "editDepartment") {
      console.log("open edit dep form ");

      const { onUpdateAcademyOrgStructure } = this.props;
      const {
        editDepartmentArName,
        editDepartmentEnName,
        editDepartmentNum,
        editDepartmentPresident,
      } = this.state;

      const isDuplicateDepartment = academyOrgStructures.some(
        directorate =>
          directorate.Id &&
          directorate.departments
            .filter(department => department.Id !== departmentId)
            .some(
              department =>
                (department.Id &&
                  typeof department.departmentArName === "string" &&
                  department.departmentArName.trim() ===
                    editDepartmentArName.trim()) ||
                (department.departmentNum &&
                  department.departmentNum === parseInt(editDepartmentNum, 10))
            )
      );
      console.log(" dep isDuplicateDepartment ", isDuplicateDepartment);

      if (isDuplicateDepartment) {
        console.log(" dep duplicate");

        const duplicateErrorMessage = this.props.t("Department already exists");
        this.setState({ errorMessage: duplicateErrorMessage });
      } else {
        console.log(" dep not duplicate");

        if (editDepartmentArName.trim() === "") {
          this.setState({ departmentNameError: true, saveError: true });
          console.log(" editDepartmentArName = empty");
        } else if (
          editDepartmentArName.trim() !== "" ||
          editDepartmentEnName.trim() !== ""
        ) {
          const successUpdatedMessage = this.props.t(
            "Department updated successfully"
          );
          this.setState({
            departmentNumError: false,
            saveError: false,
            successMessage: successUpdatedMessage,
          });

          const payload = {
            Id: departmentId,
            arTitle: editDepartmentArName,
            enTitle: editDepartmentEnName,
            departmentNum: editDepartmentNum,
            departmentPresident: editDepartmentPresident,
            directorateId: depaDirectorateId,
          };
          (payload["tablename"] = "Common_Department"),
            onUpdateAcademyOrgStructure(payload);
        }
      }
    }
  };

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteDirectorateModal: !prevState.deleteDirectorateModal,
    }));
  };

  onClickDeleteDepartment = (depId, department) => {
    this.setState({
      selectedDepId: depId,
      deleteDepartmentModal: true,
      selectedDepartment: department,
    });
  };

  handleDeleteDepartment = () => {
    const { selectedDepId, selectedDepartment } = this.state;

    if (selectedDepartment.organisms.Id == null) {
      let payload = { Id: selectedDepId };
      payload["tablename"] = "Common_Department";
      const { onDeleteAcademyOrgStructure } = this.props;
      onDeleteAcademyOrgStructure(payload);
      this.setState({
        selectedDepId: null,
        deleteDepartmentModal: false,
        showAlert: true,
      });
    } else {
      const deleteErrorMessage = this.props.t(
        "Can't delete this Department! Delete it's organisms first"
      );
      this.setState({
        errorMessage: deleteErrorMessage,
        deleteDepartmentModal: false,
      });
    }
  };

  onClickDeleteOrganism = orgId => {
    this.setState({ selectedOrganismId: orgId, deleteOrganismModal: true });
  };
  handelDeleteOraganism = () => {
    const { selectedOrganismId, deleteOrganismModal } = this.state;
    const { onDeleteAcademyOrgStructure } = this.props;

    let payload = {
      Id: selectedOrganismId,
      tablename: "Common_Organism",
    };
    onDeleteAcademyOrgStructure(payload);
    this.setState({
      selectedOrganismId: null,
      deleteOrganismModal: false,
      showAlert: true,
    });
  };

  handleErrorClose = () => {
    this.setState({ errorMessage: null });
  };

  handleSuccessClose = () => {
    this.setState({ successMessage: null });
  };

  handleSuccessDeletedClose = () => {
    const { onGetAcademyOrgStructureDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetAcademyOrgStructureDeletedValue();
  };

  handleErrorDeletedClose = () => {
    const { onGetAcademyOrgStructureDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetAcademyOrgStructureDeletedValue();
  };

  showDirectorateInfo = directorate => {
    const { openForm } = this.state;

    if (openForm != null || openForm != "") {
      this.setState({ openForm: "" });
    }

    this.setState({ isShowDirectorateInfo: true });
    this.setState({ isShowDepartmentInfo: false });
    this.setState({ isShowOrganismInfo: false });

    this.setState({ directorateId: directorate.Id });
    this.setState({ editDirectorateArName: directorate.directorateArName });
    this.setState({
      editDirectorateEnName: directorate.directorateEnName || "",
    });
    this.setState({ editDirectorateNum: directorate.directorateNum });
    this.setState({ editDirectorateDean: directorate.directorateDean || "" });
    this.setState({ editDirectorateCode: directorate.directorateCode || "" });
  };

  showDepartmentInfo = department => {
    const { openForm } = this.state;

    if (openForm != null || openForm != "") {
      this.setState({ openForm: "" });
    }
    this.setState({ isShowDepartmentInfo: true });
    this.setState({ isShowDirectorateInfo: false });
    this.setState({ isShowOrganismInfo: false });

    this.setState({ departmentId: department.Id });
    this.setState({ editDepartmentArName: department.departmentArName });
    this.setState({ editDepartmentEnName: department.departmentEnName || "" });
    this.setState({ editDepartmentNum: department.departmentNum });
    this.setState({
      editDepartmentPresident: department.departmentPresident || "",
    });
  };

  showOrganismInfo = organism => {
    const { openForm } = this.state;

    if (openForm != null || openForm != "") {
      this.setState({ openForm: "" });
    }
    this.setState({ isShowOrganismInfo: true });
    this.setState({ isShowDepartmentInfo: false });
    this.setState({ isShowDirectorateInfo: false });
    this.setState({ organismId: organism.Id });
    this.setState({ editOrganismArName: organism.organismArName });
    this.setState({ editOrganismEnName: organism.organismEnName || "" });
    this.setState({ editOrganismNum: organism.organismNum });
    this.setState({
      editOrganismPresident: organism.organismPresident || "",
    });
  };

  render() {
    const {
      newDirectorateArName,
      newDirectorateEnName,
      newDirectorateNum,
      newDirectorateDean,
      newDirectorateCode,
      editDirectorateArName,
      editDirectorateEnName,
      editDirectorateNum,
      editDirectorateDean,
      editDirectorateCode,
      newDepartmentArName,
      newDepartmentEnName,
      newDepartmentNum,
      newDepartmentPresident,
      depaDirectorateId,
      editDepartmentArName,
      editDepartmentEnName,
      editDepartmentNum,
      editDepartmentPresident,
      selectedDirectorateId,
      academyDefaultName,
      expandedNodes,
      editingAcademyName,
      openForm,
      errorMessage,
      successMessage,
      DirectorateBeingEdited,
      departmentBeingEdited,
      directorateNameError,
      directorateNumError,
      directorateCodeError,
      departmentNameError,
      departmentNumError,
      deleteDirectorateModal,
      deleteDepartmentModal,
      showAlert,
      showAddButton,
      showDeleteButton,
      showEditButton,
      depaorganismId,
      NewOrganismArName,
      NewOrganismEnName,
      NewOrganismNum,
      NewOrganismPresident,
      OrganisArnameError,
      OrganisNumError,
      OrganisEnnameError,
      editOrganismArName,
      editOrganismEnName,
      editOrganismNum,
      editOrganismPresident,
      deleteOrganismModal,
      isShowDirectorateInfo,
      isShowDepartmentInfo,
      isShowOrganismInfo,
      languageState,
    } = this.state;

    console.log(
      "showAddButton",
      showAddButton,
      "showDeleteButton",
      showDeleteButton,
      "showEditButton",
      showEditButton
    );

    const { t, academyOrgStructures, academyInfo, deleted } = this.props;
    console.log("1111111111111111", academyInfo);
    const alertMessage =
      deleted == 0
        ? this.props.t("Can't Delete")
        : this.props.t("Deleted Successfully");

    // Meta title
    document.title = "Academy | keyInHands - React Admin & Dashboard Template";

    return (
      <div className="page-content">
        <DeleteModal
          show={deleteDirectorateModal}
          onDeleteClick={this.handleDeleteDirectorate}
          onCloseClick={() => this.setState({ deleteDirectorateModal: false })}
        />
        <DeleteModal
          show={deleteDepartmentModal}
          onDeleteClick={this.handleDeleteDepartment}
          onCloseClick={() => this.setState({ deleteDepartmentModal: false })}
        />
        <DeleteModal
          show={deleteOrganismModal}
          onDeleteClick={this.handelDeleteOraganism}
          onCloseClick={() => this.setState({ deleteOrganismModal: false })}
        />
        <Row>
          <Breadcrumbs
            title={t("Academy")}
            breadcrumbItem={t("Academy Organizational Structure")}
          />
          <Col lg="4">
            <Container fluid>
              <Card>
                <TreeView
                  key={"univeristy-tree"}
                  aria-label="multi-select"
                  defaultCollapseIcon={<ExpandMoreIcon />}
                  defaultExpandIcon={<ChevronRightIcon />}
                  multiSelect
                  expanded={expandedNodes}
                  onNodeToggle={(event, nodeIds) =>
                    this.setState({ expandedNodes: nodeIds })
                  }
                  sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    "& .MuiTreeItem-label": {
                      padding: "0px",
                    },
                    "& .MuiTreeItem-content": {
                      padding: "0px",
                    },
                    "& .MuiTreeItem-root": {
                      padding: "0px",
                      borderBottom: "1px solid #ddd",
                    },
                    "& .MuiTreeItem-content.Mui-expanded": {
                      padding: "0px",
                    },
                    "& .MuiTreeItem-content .MuiTreeItem-label": {
                      padding: "0px",
                    },
                  }}
                >
                  <TreeItem
                    nodeId="1"
                    key="1"
                    label={
                      editingAcademyName ? (
                        <Form className="university-name-form">
                          <Input
                            type="text"
                            value={academyInfo.AcademyName}
                            onChange={e =>
                              this.setState({
                                academyDefaultName: e.target.value,
                              })
                            }
                            onBlur={() =>
                              this.setState({ editingAcademyName: false })
                            }
                            autoFocus
                          />
                        </Form>
                      ) : (
                        <div className="university-name-container">
                          <div className="university-name-border">
                            <span
                              className="university-name"
                              onClick={() =>
                                this.setState({
                                  editingAcademyName: false,
                                })
                              }
                            >
                              {languageState === "ar"
                                ? academyInfo.AcademyName + " "
                                : academyInfo.AcademyNameEn + " "}
                            </span>
                            {showAddButton && (
                              <IconButton
                                className="add-directorate-button"
                                onClick={this.handleAddDirectorateForm}
                              >
                                <AddIcon className="zeButton" />
                              </IconButton>
                            )}
                          </div>
                        </div>
                      )
                    }
                  >
                    {academyOrgStructures
                      ? academyOrgStructures.map(academyOrgStructure => (
                          <TreeItem
                            key={academyOrgStructure.Id}
                            nodeId={`academyOrgStructure-${academyOrgStructure.Id}`}
                            label={
                              <div
                                className="directorate-item"
                                onClick={() =>
                                  this.showDirectorateInfo(academyOrgStructure)
                                }
                              >
                                <span>
                                  {t(academyOrgStructure.directorateArName)}
                                </span>
                                <div className="directorate-item-actions">
                                  {showAddButton && (
                                    <IconButton
                                      className="add-directorate-button"
                                      onClick={e => {
                                        e.stopPropagation();
                                        this.handleAddDepartmentForm(
                                          academyOrgStructure.Id
                                        );
                                      }}
                                    >
                                      <AddIcon className="zeButton" />
                                    </IconButton>
                                  )}
                                  {showEditButton && (
                                    <IconButton
                                      className="edit-directorate-button"
                                      onClick={e => {
                                        e.stopPropagation();
                                        this.handleEditDirectorate(
                                          academyOrgStructure
                                        );
                                      }}
                                    >
                                      <EditIcon className="zeButton" />
                                    </IconButton>
                                  )}

                                  {showDeleteButton && (
                                    <div className="directorate-item-actions">
                                      <IconButton
                                        className="delete-directorate-button"
                                        onClick={e => {
                                          e.stopPropagation();
                                          this.onClickDeleteDirectorate(
                                            academyOrgStructure
                                          );
                                        }}
                                      >
                                        <DeleteIcon className="zeButton" />
                                      </IconButton>
                                    </div>
                                  )}
                                </div>
                              </div>
                            }
                          >
                            {academyOrgStructure.departments &&
                            academyOrgStructure.departments[0].Id != null
                              ? academyOrgStructure.departments.map(
                                  department => (
                                    <TreeItem
                                      key={department.Id}
                                      nodeId={`department-${department.Id}`}
                                      label={
                                        <div
                                          className="department-item"
                                          onClick={() =>
                                            this.showDepartmentInfo(department)
                                          }
                                        >
                                          <span>
                                            {department.departmentArName}
                                          </span>
                                          <div className="directorate-item-actions">
                                            {showAddButton && (
                                              <IconButton
                                                className="add-directorate-button"
                                                onClick={e => {
                                                  e.stopPropagation();
                                                  this.handelAddOrganismForm(
                                                    department.Id
                                                  );
                                                }}
                                              >
                                                <AddIcon className="zeButton" />
                                              </IconButton>
                                            )}
                                            {showEditButton && (
                                              <IconButton
                                                className="delete-department-button"
                                                onClick={e => {
                                                  e.stopPropagation();
                                                  this.handleEditDepartment(
                                                    department,
                                                    academyOrgStructure.Id
                                                  );
                                                }}
                                              >
                                                <EditIcon className="zeButton" />
                                              </IconButton>
                                            )}
                                            {showDeleteButton && (
                                              <div className="department-item-actions">
                                                <IconButton
                                                  className="delete-department-button"
                                                  onClick={e => {
                                                    e.stopPropagation();
                                                    this.onClickDeleteDepartment(
                                                      department.Id,
                                                      department
                                                    );
                                                  }}
                                                >
                                                  <DeleteIcon className="zeButton" />
                                                </IconButton>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      }
                                    >
                                      {department.organisms &&
                                        department.organisms.length > 0 &&
                                        department.organisms.map(organism => (
                                          <TreeItem
                                            key={organism.Id}
                                            nodeId={`organism-${organism.Id}`}
                                            label={
                                              <div
                                                className="organism-item"
                                                onClick={() =>
                                                  this.showOrganismInfo(
                                                    organism
                                                  )
                                                }
                                              >
                                                <span>
                                                  {organism.organismArName}
                                                </span>
                                                <div className="directorate-item-actions">
                                                  {showEditButton && (
                                                    <IconButton
                                                      className="edit-organism-button"
                                                      onClick={e => {
                                                        e.stopPropagation();
                                                        this.handelEditOrganism(
                                                          organism,
                                                          department.Id
                                                        );
                                                      }}
                                                    >
                                                      <EditIcon className="zeButton" />
                                                    </IconButton>
                                                  )}
                                                  {showDeleteButton && (
                                                    <IconButton
                                                      className="delete-organism-button"
                                                      onClick={e => {
                                                        e.stopPropagation();
                                                        this.onClickDeleteOrganism(
                                                          organism.Id
                                                        );
                                                      }}
                                                    >
                                                      <DeleteIcon className="zeButton" />
                                                    </IconButton>
                                                  )}
                                                </div>
                                              </div>
                                            }
                                          />
                                        ))}
                                    </TreeItem>
                                  )
                                )
                              : null}
                          </TreeItem>
                        ))
                      : null}
                  </TreeItem>
                </TreeView>
              </Card>
            </Container>
          </Col>
          <Col lg="8">
            <Card>
              <CardContent>
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
                        onClick={this.handleErrorDeletedClose}
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
                        onClick={this.handleSuccessDeletedClose}
                      ></button>
                    </Alert>
                  )}
                </div>
                {openForm == "directorate" && (
                  <div>
                    <Row>
                      <Typography variant="div">
                        <h5 className="header pt-2 mb-2" id="title">
                          {t("Add New Directorate")}
                        </h5>
                      </Typography>
                    </Row>
                    <Row className="mt-4">
                      <Col lg="2">
                        <label
                          htmlFor="DirectorateName(ar)"
                          className="col-form-label"
                        >
                          {t("Directorate Name(ar)")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="DirectorateName(ar)"
                          name="arTitle"
                          autoComplete="off"
                          className={`form-control ${
                            directorateNameError ? "is-invalid" : ""
                          }`}
                          placeholder={t("Directorate Name(ar)")}
                          value={newDirectorateArName}
                          onChange={e => {
                            this.handleDirectorateDataChange(
                              "arTitle",
                              e.target.value
                            );
                          }}
                        />
                        {directorateNameError && (
                          <div className="invalid-feedback">
                            {t("Directorate Name is required")}
                          </div>
                        )}
                      </Col>
                      <Col lg="2">
                        <label
                          htmlFor="DirectorateName"
                          className="col-form-label"
                        >
                          {t("Directorate Name(en)")}:
                        </label>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="DirectorateName"
                          name="enTitle"
                          autoComplete="off"
                          className="form-control mb-2"
                          placeholder={t("Directorate Name")}
                          value={newDirectorateEnName}
                          onChange={e => {
                            this.handleDirectorateDataChange(
                              "enTitle",
                              e.target.value
                            );
                          }}
                        />
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col lg="2">
                        <label
                          htmlFor="directorateNum"
                          className="col-form-label"
                        >
                          {t("Directorate Number")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col md="4">
                        <input
                          type="number"
                          id="directorateNum"
                          name="directorateNum"
                          className={`form-control ${
                            directorateNumError ? "is-invalid" : ""
                          }`}
                          placeholder={t("Directorate Number")}
                          value={newDirectorateNum}
                          onChange={e => {
                            this.handleDirectorateDataChange(
                              "directorateNum",
                              e.target.value
                            );
                          }}
                        />
                        {directorateNumError && (
                          <div className="invalid-feedback">
                            {t("Directorate Number is required")}
                          </div>
                        )}
                      </Col>
                      <Col lg="2">
                        <label
                          htmlFor="directorateCode"
                          className="col-form-label"
                        >
                          {t("Directorate Code")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="directorateCode"
                          name="directorateCode"
                          className={`form-control ${
                            directorateCodeError ? "is-invalid" : ""
                          }`}
                          placeholder={t("Directorate Code")}
                          value={newDirectorateCode}
                          onChange={e => {
                            this.handleDirectorateDataChange(
                              "directorateCode",
                              e.target.value
                            );
                          }}
                        />
                        {directorateCodeError && (
                          <div className="invalid-feedback">
                            {t("Directorate Code is required")}
                          </div>
                        )}
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col lg="2">
                        <label
                          htmlFor="directorateDean"
                          className="col-form-label"
                        >
                          {t("Dean's Name")}:
                        </label>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="directorateDean"
                          name="directorateDean"
                          className="form-control mb-2"
                          placeholder={t("Dean's Name")}
                          value={newDirectorateDean}
                          onChange={e => {
                            this.handleDirectorateDataChange(
                              "directorateDean",
                              e.target.value
                            );
                          }}
                        />
                      </Col>
                    </Row>
                    <div className="d-flex justify-content-end mt-4">
                      <button
                        type="button"
                        className="btn btn-primary save-directorate-button"
                        onClick={this.handleSaveDirectorate}
                      >
                        {t("Save Directorate")}
                      </button>
                    </div>
                  </div>
                )}
                {openForm === "department" && depaDirectorateId && (
                  <div>
                    <Row>
                      <Typography variant="div">
                        <h5 className="header pt-2 mb-2" id="title">
                          {this.props.t("Add New Department")}{" "}
                          {
                            academyOrgStructures.find(
                              directorate =>
                                directorate.Id === selectedDirectorateId
                            )?.arTitle
                          }
                        </h5>
                      </Typography>
                    </Row>

                    <Row className="mt-4">
                      <Col lg="2">
                        <label
                          htmlFor="departmentName(ar)"
                          className="col-form-label"
                        >
                          {t("Department Name(ar)")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col lg="4">
                        <input
                          type="text"
                          id="departmentName(ar)"
                          name="departmentArName"
                          autoComplete="off"
                          className={`form-control ${
                            departmentNameError ? "is-invalid" : ""
                          }`}
                          placeholder={"Department Name(ar)"}
                          value={newDepartmentArName}
                          onChange={e => {
                            this.handleDepartmentDataChange(
                              "departmentArName",
                              e.target.value
                            );
                          }}
                        />
                        {departmentNameError && (
                          <div className="invalid-feedback">
                            {t("Department Name is required")}
                          </div>
                        )}
                      </Col>
                      <Col lg="2">
                        <label
                          htmlFor="departmentName"
                          className="col-form-label"
                        >
                          {t("Department Name")}:
                        </label>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="departmentName"
                          name="departmentEnName"
                          className="form-control mb-2"
                          placeholder={t("Department Name")}
                          value={newDepartmentEnName}
                          onChange={e => {
                            this.handleDepartmentDataChange(
                              "departmentEnName",
                              e.target.value
                            );
                          }}
                        />
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col lg="2">
                        <label
                          htmlFor="departmentNumber"
                          className="col-form-label"
                        >
                          {t("Department Number")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col md="4">
                        <input
                          type="number"
                          id="departmentNumber"
                          name="departmentNum"
                          className={`form-control ${
                            departmentNumError ? "is-invalid" : ""
                          }`}
                          placeholder={t("Department Number")}
                          value={newDepartmentNum}
                          onChange={e => {
                            this.handleDepartmentDataChange(
                              "departmentNum",
                              e.target.value
                            );
                          }}
                        />
                        {departmentNumError && (
                          <div className="invalid-feedback">
                            {t("Department Number is required")}
                          </div>
                        )}
                      </Col>
                      <Col lg="2">
                        <label
                          htmlFor="departmentPresident"
                          className="col-form-label"
                        >
                          {t("Department President")}:
                        </label>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="departmentPresident"
                          name="departmentPresident"
                          className="form-control mb-2"
                          placeholder={t("Department President")}
                          value={newDepartmentPresident}
                          onChange={e => {
                            this.handleDepartmentDataChange(
                              "departmentPresident",
                              e.target.value
                            );
                          }}
                        />
                      </Col>
                    </Row>
                    <div className="d-flex justify-content-end mt-4">
                      <button
                        type="button"
                        className="btn btn-primary save-directorate-button"
                        onClick={this.handleSaveDepartment}
                      >
                        {t("Save Department")}
                      </button>
                    </div>
                  </div>
                )}
                {openForm === "editDirectorate" && (
                  <div>
                    <Row>
                      <Typography variant="div">
                        <h5 className="header pt-2 mb-2" id="title">
                          {t("Edit Directorate")} - {editDirectorateArName}
                        </h5>
                      </Typography>
                    </Row>
                    <Row className="mt-4">
                      <Col lg="2">
                        <label
                          htmlFor="DirectorateName(ar)"
                          className="col-form-label"
                        >
                          {t("Directorate Name(ar)")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="DirectorateName(ar)"
                          name="arTitle"
                          autoComplete="off"
                          className={`form-control ${
                            directorateNameError ? "is-invalid" : ""
                          }`}
                          placeholder={t("Directorate Name(ar)")}
                          value={editDirectorateArName}
                          onChange={e => {
                            this.handleDirectorateDataChange(
                              "arTitle",
                              e.target.value
                            );
                          }}
                          disabled={!showEditButton}
                        />
                        {directorateNameError && (
                          <div className="invalid-feedback">
                            {t("Directorate Name is required")}
                          </div>
                        )}
                      </Col>
                      <Col lg="2">
                        <label
                          htmlFor="DirectorateName"
                          className="col-form-label"
                        >
                          {t("Directorate Name(en)")}:
                        </label>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="DirectorateName"
                          name="enTitle"
                          autoComplete="off"
                          className="form-control mb-2"
                          placeholder={t("Directorate Name")}
                          value={editDirectorateEnName}
                          onChange={e => {
                            this.handleDirectorateDataChange(
                              "enTitle",
                              e.target.value
                            );
                          }}
                          disabled={!showEditButton}
                        />
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col lg="2">
                        <label
                          htmlFor="directorateNum"
                          className="col-form-label"
                        >
                          {t("Directorate Number")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col md="4">
                        <input
                          type="number"
                          id="directorateNum"
                          name="directorateNum"
                          className={`form-control ${
                            directorateNumError ? "is-invalid" : ""
                          }`}
                          placeholder={t("Directorate Number")}
                          value={editDirectorateNum}
                          onChange={e => {
                            this.handleDirectorateDataChange(
                              "directorateNum",
                              e.target.value
                            );
                          }}
                          disabled={!showEditButton}
                        />
                        {directorateNumError && (
                          <div className="invalid-feedback">
                            {t("Directorate Number is required")}
                          </div>
                        )}
                      </Col>
                      <Col lg="2">
                        <label
                          htmlFor="directorateCode"
                          className="col-form-label"
                        >
                          {t("Directorate Code")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="directorateCode"
                          name="directorateCode"
                          className="form-control mb-2"
                          placeholder={t("Directorate Code")}
                          value={editDirectorateCode}
                          onChange={e => {
                            this.handleDirectorateDataChange(
                              "directorateCode",
                              e.target.value
                            );
                          }}
                          disabled={!showEditButton}
                        />
                        {directorateCodeError && (
                          <div className="invalid-feedback">
                            {t("Directorate Code is required")}
                          </div>
                        )}
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col lg="2">
                        <label
                          htmlFor="directorateDean"
                          className="col-form-label"
                        >
                          {t("Dean's Name")}:
                        </label>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="directorateDean"
                          name="directorateDean"
                          className="form-control mb-2"
                          placeholder={t("Dean's Name")}
                          value={editDirectorateDean}
                          onChange={e => {
                            this.handleDirectorateDataChange(
                              "directorateDean",
                              e.target.value
                            );
                          }}
                          disabled={!showEditButton}
                        />
                      </Col>
                    </Row>
                    <div className="d-flex justify-content-end mt-4">
                      <button
                        type="button"
                        className="btn btn-primary save-directorate-button"
                        onClick={this.handleSaveDirectorate}
                      >
                        {t("Save Directorate")}
                      </button>
                    </div>
                  </div>
                )}
                {openForm === "editDepartment" && (
                  <div>
                    <Row>
                      <Typography variant="div">
                        <h5 className="header pt-2 mb-2" id="title">
                          {t("Edit Department")} - {""}
                          {editDirectorateArName}
                        </h5>
                      </Typography>
                    </Row>
                    <Row className="mt-4">
                      <Col lg="2">
                        <label
                          htmlFor="departmentNameAr"
                          className="col-form-label"
                        >
                          {t("Department Name(ar)")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="departmentNameAr"
                          name="departmentArName"
                          className="form-control mb-2"
                          placeholder={t("Department Name(ar)")}
                          value={editDepartmentArName}
                          onChange={e => {
                            this.handleDepartmentDataChange(
                              "departmentArName",
                              e.target.value
                            );
                          }}
                          disabled={!showEditButton}
                        />
                      </Col>
                      <Col lg="2">
                        <label
                          htmlFor="departmentNameEn"
                          className="col-form-label"
                        >
                          {t("Department Name")}:
                        </label>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="departmentNameEn"
                          name="departmentEnName"
                          className="form-control mb-2"
                          placeholder={t("Department Name")}
                          value={editDepartmentEnName}
                          onChange={e => {
                            this.handleDepartmentDataChange(
                              "departmentEnName",
                              e.target.value
                            );
                          }}
                          disabled={!showEditButton}
                        />
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col lg="2">
                        <label
                          htmlFor="departmentNumber"
                          className="col-form-label"
                        >
                          {t("Department Number")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="departmentNumber"
                          name="departmentNum"
                          className="form-control mb-2"
                          placeholder={t("Department Number")}
                          value={editDepartmentNum}
                          onChange={e => {
                            this.handleDepartmentDataChange(
                              "departmentNum",
                              e.target.value
                            );
                          }}
                          disabled={!showEditButton}
                        />
                      </Col>
                      <Col lg="2">
                        <label
                          htmlFor="departmentPresident"
                          className="col-form-label"
                        >
                          {t("Department President")}:
                        </label>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="departmentPresident"
                          name="departmentPresident"
                          className="form-control mb-2"
                          placeholder={t("Department President")}
                          value={editDepartmentPresident}
                          onChange={e => {
                            this.handleDepartmentDataChange(
                              "departmentPresident",
                              e.target.value
                            );
                          }}
                          disabled={!showEditButton}
                        />
                      </Col>
                    </Row>
                    <div className="d-flex justify-content-end mt-4">
                      <button
                        type="button"
                        className="btn btn-primary save-directorate-button"
                        onClick={this.handleSaveDepartment}
                      >
                        {t("Save Department")}
                      </button>
                    </div>
                  </div>
                )}
                {openForm === "organism" && depaorganismId && (
                  <div>
                    <Row>
                      <Typography variant="div">
                        <h5 className="header pt-2 mb-2" id="title">
                          {this.props.t("Add New Organism")}{" "}
                          {
                            academyOrgStructures
                              .flatMap(directorate => directorate.departments)
                              .find(dept => dept.Id === depaorganismId)?.arTitle
                          }
                        </h5>
                      </Typography>
                    </Row>

                    <Row className="mt-4">
                      <Col lg="2">
                        <label
                          htmlFor="organismNameAr"
                          className="col-form-label"
                        >
                          {t("Organism Name(ar)")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col lg="4">
                        <input
                          type="text"
                          id="organismNameAr"
                          name="organismArName"
                          autoComplete="off"
                          className={`form-control ${
                            OrganisArnameError ? "is-invalid" : ""
                          }`}
                          placeholder={t("Organism Name(ar)")}
                          value={NewOrganismArName}
                          onChange={e =>
                            this.handleOrganismDataChange(
                              "organismArName",
                              e.target.value
                            )
                          }
                        />
                        {OrganisArnameError && (
                          <div className="invalid-feedback">
                            {t("Organism Name is required")}
                          </div>
                        )}
                      </Col>

                      <Col lg="2">
                        <label
                          htmlFor="organismNameEn"
                          className="col-form-label"
                        >
                          {t("Organism Name")}:
                        </label>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="organismNameEn"
                          name="organismEnName"
                          className="form-control mb-2"
                          placeholder={t("Organism Name")}
                          value={NewOrganismEnName}
                          onChange={e =>
                            this.handleOrganismDataChange(
                              "organismEnName",
                              e.target.value
                            )
                          }
                        />
                      </Col>
                    </Row>

                    <Row className="mt-4">
                      <Col lg="2">
                        <label
                          htmlFor="organismNumber"
                          className="col-form-label"
                        >
                          {t("Organism Number")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col md="4">
                        <input
                          type="number"
                          id="organismNumber"
                          name="organismNum"
                          className={`form-control ${
                            OrganisNumError ? "is-invalid" : ""
                          }`}
                          placeholder={t("Organism Number")}
                          value={NewOrganismNum}
                          onChange={e =>
                            this.handleOrganismDataChange(
                              "organismNum",
                              e.target.value
                            )
                          }
                        />
                        {OrganisNumError && (
                          <div className="invalid-feedback">
                            {t("Organism Number is required")}
                          </div>
                        )}
                      </Col>

                      <Col lg="2">
                        <label
                          htmlFor="organismPresident"
                          className="col-form-label"
                        >
                          {t("Organism President")}:
                        </label>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="organismPresident"
                          name="organismPresident"
                          className="form-control mb-2"
                          placeholder={t("Organism President")}
                          value={NewOrganismPresident}
                          onChange={e =>
                            this.handleOrganismDataChange(
                              "organismPresident",
                              e.target.value
                            )
                          }
                        />
                      </Col>
                    </Row>

                    <div className="d-flex justify-content-end mt-4">
                      <button
                        type="button"
                        className="btn btn-primary save-directorate-button"
                        onClick={this.handleSaveOrganism}
                      >
                        {t("Save Organism")}
                      </button>
                    </div>
                  </div>
                )}
                {openForm === "editOrganism" && (
                  <div>
                    <Row>
                      <Typography variant="div">
                        <h5 className="header pt-2 mb-2" id="title">
                          {t("Edit Organism")} - {editOrganismArName}
                        </h5>
                      </Typography>
                    </Row>

                    <Row className="mt-4">
                      <Col lg="2">
                        <label
                          htmlFor="organismNameAr"
                          className="col-form-label"
                        >
                          {t("Organism Name(ar)")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="organismNameAr"
                          name="organismArName"
                          className={`form-control mb-2 ${
                            OrganisArnameError ? "is-invalid" : ""
                          }`}
                          placeholder={t("Organism Name(ar)")}
                          value={editOrganismArName}
                          onChange={e =>
                            this.handleOrganismDataChange(
                              "organismArName",
                              e.target.value
                            )
                          }
                          disabled={!showEditButton}
                        />
                        {OrganisArnameError && (
                          <div className="invalid-feedback">
                            {t("Organism Name is required")}
                          </div>
                        )}
                      </Col>

                      <Col lg="2">
                        <label
                          htmlFor="organismNameEn"
                          className="col-form-label"
                        >
                          {t("Organism Name")}:
                        </label>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="organismNameEn"
                          name="organismEnName"
                          className="form-control mb-2"
                          placeholder={t("Organism Name")}
                          value={editOrganismEnName}
                          onChange={e =>
                            this.handleOrganismDataChange(
                              "organismEnName",
                              e.target.value
                            )
                          }
                          disabled={!showEditButton}
                        />
                      </Col>
                    </Row>

                    <Row className="mt-4">
                      <Col lg="2">
                        <label
                          htmlFor="organismNumber"
                          className="col-form-label"
                        >
                          {t("Organism Number")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col md="4">
                        <input
                          type="number"
                          id="organismNumber"
                          name="organismNum"
                          className={`form-control mb-2 ${
                            OrganisNumError ? "is-invalid" : ""
                          }`}
                          placeholder={t("Organism Number")}
                          value={editOrganismNum}
                          onChange={e =>
                            this.handleOrganismDataChange(
                              "organismNum",
                              e.target.value
                            )
                          }
                          disabled={!showEditButton}
                        />
                        {OrganisNumError && (
                          <div className="invalid-feedback">
                            {t("Organism Number is required")}
                          </div>
                        )}
                      </Col>

                      <Col lg="2">
                        <label
                          htmlFor="organismPresident"
                          className="col-form-label"
                        >
                          {t("Organism President")}:
                        </label>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="organismPresident"
                          name="organismPresident"
                          className="form-control mb-2"
                          placeholder={t("Organism President")}
                          value={editOrganismPresident}
                          onChange={e =>
                            this.handleOrganismDataChange(
                              "organismPresident",
                              e.target.value
                            )
                          }
                          disabled={!showEditButton}
                        />
                      </Col>
                    </Row>

                    <div className="d-flex justify-content-end mt-4">
                      <button
                        type="button"
                        className="btn btn-primary save-directorate-button"
                        onClick={this.handleSaveOrganism}
                      >
                        {t("Save Organism")}
                      </button>
                    </div>
                  </div>
                )}

                {isShowDirectorateInfo && (
                  <div>
                    <Row>
                      <Typography variant="div">
                        <h5 className="header pt-2 mb-2" id="title">
                          {t("Show Directorate")} - {editDirectorateArName}
                        </h5>
                      </Typography>
                    </Row>
                    <Row className="mt-4">
                      <Col lg="2">
                        <label
                          htmlFor="DirectorateName(ar)"
                          className="col-form-label"
                        >
                          {t("Directorate Name(ar)")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="DirectorateName(ar)"
                          name="arTitle"
                          autoComplete="off"
                          className={`form-control ${
                            directorateNameError ? "is-invalid" : ""
                          }`}
                          placeholder={t("Directorate Name(ar)")}
                          value={editDirectorateArName}
                          onChange={e => {
                            this.handleDirectorateDataChange(
                              "arTitle",
                              e.target.value
                            );
                          }}
                          disabled={true}
                        />
                        {directorateNameError && (
                          <div className="invalid-feedback">
                            {t("Directorate Name is required")}
                          </div>
                        )}
                      </Col>
                      <Col lg="2">
                        <label
                          htmlFor="DirectorateName"
                          className="col-form-label"
                        >
                          {t("Directorate Name(en)")}:
                        </label>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="DirectorateName"
                          name="enTitle"
                          autoComplete="off"
                          className="form-control mb-2"
                          placeholder={t("Directorate Name")}
                          value={editDirectorateEnName}
                          onChange={e => {
                            this.handleDirectorateDataChange(
                              "enTitle",
                              e.target.value
                            );
                          }}
                          disabled={true}
                        />
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col lg="2">
                        <label
                          htmlFor="directorateNum"
                          className="col-form-label"
                        >
                          {t("Directorate Number")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col md="4">
                        <input
                          type="number"
                          id="directorateNum"
                          name="directorateNum"
                          className={`form-control ${
                            directorateNumError ? "is-invalid" : ""
                          }`}
                          placeholder={t("Directorate Number")}
                          value={editDirectorateNum}
                          onChange={e => {
                            this.handleDirectorateDataChange(
                              "directorateNum",
                              e.target.value
                            );
                          }}
                          disabled={true}
                        />
                        {directorateNumError && (
                          <div className="invalid-feedback">
                            {t("Directorate Number is required")}
                          </div>
                        )}
                      </Col>
                      <Col lg="2">
                        <label
                          htmlFor="directorateCode"
                          className="col-form-label"
                        >
                          {t("Directorate Code")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="directorateCode"
                          name="directorateCode"
                          className="form-control mb-2"
                          placeholder={t("Directorate Code")}
                          value={editDirectorateCode}
                          onChange={e => {
                            this.handleDirectorateDataChange(
                              "directorateCode",
                              e.target.value
                            );
                          }}
                          disabled={!showEditButton}
                        />
                        {directorateCodeError && (
                          <div className="invalid-feedback">
                            {t("Directorate Code is required")}
                          </div>
                        )}
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col lg="2">
                        <label
                          htmlFor="directorateDean"
                          className="col-form-label"
                        >
                          {t("Dean's Name")}:
                        </label>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="directorateDean"
                          name="directorateDean"
                          className="form-control mb-2"
                          placeholder={t("Dean's Name")}
                          value={editDirectorateDean}
                          onChange={e => {
                            this.handleDirectorateDataChange(
                              "directorateDean",
                              e.target.value
                            );
                          }}
                          disabled={true}
                        />
                      </Col>
                    </Row>
                  </div>
                )}

                {isShowDepartmentInfo && (
                  <div>
                    <Row>
                      <Typography variant="div">
                        <h5 className="header pt-2 mb-2" id="title">
                          {t("Show Department")} - {editDepartmentArName}
                        </h5>
                      </Typography>
                    </Row>
                    <Row className="mt-4">
                      <Col lg="2">
                        <label
                          htmlFor="departmentNameAr"
                          className="col-form-label"
                        >
                          {t("Department Name(ar)")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="departmentNameAr"
                          name="departmentArName"
                          className="form-control mb-2"
                          placeholder={t("Department Name(ar)")}
                          value={editDepartmentArName}
                          onChange={e => {
                            this.handleDepartmentDataChange(
                              "departmentArName",
                              e.target.value
                            );
                          }}
                          disabled={true}
                        />
                      </Col>
                      <Col lg="2">
                        <label
                          htmlFor="departmentNameEn"
                          className="col-form-label"
                        >
                          {t("Department Name")}:
                        </label>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="departmentNameEn"
                          name="departmentEnName"
                          className="form-control mb-2"
                          placeholder={t("Department Name")}
                          value={editDepartmentEnName}
                          onChange={e => {
                            this.handleDepartmentDataChange(
                              "departmentEnName",
                              e.target.value
                            );
                          }}
                          disabled={true}
                        />
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col lg="2">
                        <label
                          htmlFor="departmentNumber"
                          className="col-form-label"
                        >
                          {t("Department Number")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="departmentNumber"
                          name="departmentNum"
                          className="form-control mb-2"
                          placeholder={t("Department Number")}
                          value={editDepartmentNum}
                          onChange={e => {
                            this.handleDepartmentDataChange(
                              "departmentNum",
                              e.target.value
                            );
                          }}
                          disabled={true}
                        />
                      </Col>
                      <Col lg="2">
                        <label
                          htmlFor="departmentPresident"
                          className="col-form-label"
                        >
                          {t("Department President")}:
                        </label>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="departmentPresident"
                          name="departmentPresident"
                          className="form-control mb-2"
                          placeholder={t("Department President")}
                          value={editDepartmentPresident}
                          onChange={e => {
                            this.handleDepartmentDataChange(
                              "departmentPresident",
                              e.target.value
                            );
                          }}
                          disabled={true}
                        />
                      </Col>
                    </Row>
                  </div>
                )}

                {isShowOrganismInfo && (
                  <div>
                    <Row>
                      <Typography variant="div">
                        <h5 className="header pt-2 mb-2" id="title">
                          {t("Show Organism")} - {editOrganismArName}
                        </h5>
                      </Typography>
                    </Row>

                    <Row className="mt-4">
                      <Col lg="2">
                        <label
                          htmlFor="organismNameAr"
                          className="col-form-label"
                        >
                          {t("Organism Name(ar)")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="organismNameAr"
                          name="organismArName"
                          className={`form-control mb-2 ${
                            OrganisArnameError ? "is-invalid" : ""
                          }`}
                          placeholder={t("Organism Name(ar)")}
                          value={editOrganismArName}
                          onChange={e =>
                            this.handleOrganismDataChange(
                              "organismArName",
                              e.target.value
                            )
                          }
                          disabled={true}
                        />
                        {OrganisArnameError && (
                          <div className="invalid-feedback">
                            {t("Organism Name is required")}
                          </div>
                        )}
                      </Col>

                      <Col lg="2">
                        <label
                          htmlFor="organismNameEn"
                          className="col-form-label"
                        >
                          {t("Organism Name")}:
                        </label>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="organismNameEn"
                          name="organismEnName"
                          className="form-control mb-2"
                          placeholder={t("Organism Name")}
                          value={editOrganismEnName}
                          onChange={e =>
                            this.handleOrganismDataChange(
                              "organismEnName",
                              e.target.value
                            )
                          }
                          disabled={true}
                        />
                      </Col>
                    </Row>

                    <Row className="mt-4">
                      <Col lg="2">
                        <label
                          htmlFor="organismNumber"
                          className="col-form-label"
                        >
                          {t("Organism Number")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col md="4">
                        <input
                          type="number"
                          id="organismNumber"
                          name="organismNum"
                          className={`form-control mb-2 ${
                            OrganisNumError ? "is-invalid" : ""
                          }`}
                          placeholder={t("Organism Number")}
                          value={editOrganismNum}
                          onChange={e =>
                            this.handleOrganismDataChange(
                              "organismNum",
                              e.target.value
                            )
                          }
                          disabled={true}
                        />
                        {OrganisNumError && (
                          <div className="invalid-feedback">
                            {t("Organism Number is required")}
                          </div>
                        )}
                      </Col>

                      <Col lg="2">
                        <label
                          htmlFor="organismPresident"
                          className="col-form-label"
                        >
                          {t("Organism President")}:
                        </label>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="organismPresident"
                          name="organismPresident"
                          className="form-control mb-2"
                          placeholder={t("Organism President")}
                          value={editOrganismPresident}
                          onChange={e =>
                            this.handleOrganismDataChange(
                              "organismPresident",
                              e.target.value
                            )
                          }
                          disabled={true}
                        />
                      </Col>
                    </Row>
                  </div>
                )}
              </CardContent>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = ({
  academyOrgStructures,
  academyInfo,
  menu_items,
}) => ({
  academyOrgStructures: academyOrgStructures.academyOrgStructures,
  deleted: academyOrgStructures.deleted,
  academyInfo: academyInfo.academyInfo,
  user_menu: menu_items.user_menu || [],
});
const mapDispatchToProps = dispatch => ({
  onGetAcademyOrgStructures: () => dispatch(getAcademyOrgStructure()),
  onAddAcademyOrgStructure: academyOrgStructure =>
    dispatch(addNewAcademyOrgStructure(academyOrgStructure)),

  onUpdateAcademyOrgStructure: academyOrgStructure =>
    dispatch(updateAcademyOrgStructure(academyOrgStructure)),

  onDeleteAcademyOrgStructure: academyOrgStructure =>
    dispatch(deleteAcademyOrgStructure(academyOrgStructure)),
  onGetAcademyOrgStructureDeletedValue: () =>
    dispatch(getAcademyOrgStructureDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(AcademyTree));
