import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import "./UniversityInfo.scss";
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
  getUniversityOrgStructure,
  updateUniversityOrgStructure,
  addNewUniversityOrgStructure,
  deleteUniversityOrgStructure,
  getUniversityOrgStructureDeletedValue,
} from "store/universityOrgStructure/actions";
import {
  checkIsAddForPage,
  checkIsDeleteForPage,
  checkIsEditForPage,
} from "../../utils/menuUtils";
class UniversityTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      universityOrgStructures: [],
      universityOrgStructure: {},
      newFacultyArName: "",
      newFacultyEnName: "",
      newFacultyNum: "",
      newFacultyDean: "",
      newFacultyCode: "",
      editFacultyArName: "",
      editFacultyEnName: "",
      editFacultyNum: "",
      editFacultyDean: "",
      editFacultyCode: "",
      newDepartmentArName: "",
      newDepartmentEnName: "",
      newDepartmentNum: "",
      newDepartmentPresident: "",
      depFacultyId: "",
      editDepartmentArName: "",
      editDepartmentEnName: "",
      editDepartmentNum: "",
      editDepartmentPresident: "",
      addingDepartment: false,
      universityDefaultName: "Your University",
      expandedNodes: ["1"],
      editingUniversityName: false,
      openForm: null,
      errorMessage: null,
      successMessage: null,
      facultyBeingEdited: "",
      departmentBeingEdited: "",
      facultyNameError: false,
      facultyNumError: false,
      facultyCodeError: false,
      departmentNameError: false,
      departmentNumError: false,
      deleteFacultyModal: false,
      deleteDepartmentModal: false,
      selectedDepId: null,
      selectedFacultyId: null,
      selectedFaculty: null,
      showAlert: null,
      showAddButton: false,
      showDeleteButton: false,
      showEditButton: false,
    };
    this.handleEditFaculty = this.handleEditFaculty.bind(this);
    this.handleFacultyDataChange = this.handleFacultyDataChange.bind(this);
    this.handleSaveFaculty = this.handleSaveFaculty.bind(this);
  }

  componentDidMount() {
    const {
      universityOrgStructures,
      onGetUniversityOrgStructures,
      universityInfo,
      deleted,
      user_menu,
    } = this.props;
    this.updateShowAddButton(user_menu, this.props.location.pathname);
    this.updateShowDeleteButton(user_menu, this.props.location.pathname);
    this.updateShowEditButton(user_menu, this.props.location.pathname);
    if (universityOrgStructures && !universityOrgStructures.length) {
      onGetUniversityOrgStructures();
    }

    this.setState({ universityOrgStructures });
    this.setState({ universityInfo });
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

  handleAddFacultyForm = () => {
    this.setState({ openForm: "faculty" });
    this.setState({ newFacultyArName: "" });
    this.setState({ newFacultyEnName: "" });
    this.setState({ newFacultyNum: "" });
    this.setState({ newFacultyDean: "" });
    this.setState({ newFacultyCode: "" });
  };

  handleFacultyDataChange = (fieldName, value) => {
    const { openForm } = this.state;
    console.log("value",value)
    if (openForm == "faculty") {
      if (fieldName == "facultyArName") {
        this.setState({ newFacultyArName: value });
        if (value.trim() === "") {
          this.setState({ facultyNameError: true });
        } else {
          this.setState({ facultyNameError: false });
        }
      }

      if (fieldName == "facultyNum") {
        this.setState({ newFacultyNum: value });
        if (value.trim() === "") {
          this.setState({ facultyNumError: true });
        } else {
          this.setState({ facultyNumError: false });
        }
      }

      if (fieldName == "facultyEnName") {
        this.setState({ newFacultyEnName: value });
      }

      if (fieldName == "facultyDean") {
        this.setState({ newFacultyDean: value });
      }
      if (fieldName == "facultyCode") {
        this.setState({ newFacultyCode: value });
        if (value.trim() === "") {
          this.setState({ facultyCodeError: true });
        } else {
          this.setState({ facultyCodeError: false });
        }
      }
    } else if (openForm == "editFaculty") {
      if (fieldName == "facultyArName") {
        this.setState({ editFacultyArName: value });
      }

      if (fieldName == "facultyNum") {
        this.setState({ editFacultyNum: value });
      }

      if (fieldName == "facultyEnName") {
        this.setState({ editFacultyEnName: value });
      }

      if (fieldName == "facultyDean") {
        this.setState({ editFacultyDean: value });
      }

      if (fieldName == "facultyCode") {
        this.setState({ editFacultyCode: value });
      }
    }
  };

  handleEditFaculty = faculty => {
    this.setState({ openForm: "editFaculty" });
    this.setState({ facultyId: faculty.Id });
    this.setState({ editFacultyArName: faculty.facultyArName });
    this.setState({ editFacultyEnName: faculty.facultyEnName || "" });
    this.setState({ editFacultyNum: faculty.facultyNum });
    this.setState({ editFacultyDean: faculty.facultyDean || "" });
    this.setState({ editFacultyCode: faculty.facultyCode || "" });
  };

  handleSaveFaculty = () => {
    const { openForm, facultyId } = this.state;
    const { universityOrgStructures } = this.props;

    if (openForm == "faculty") {
      const { onAddUniversityOrgStructure } = this.props;
      const {
        newFacultyArName,
        newFacultyEnName,
        newFacultyNum,
        newFacultyDean,
        newFacultyCode,
      } = this.state;

      if (newFacultyArName.trim() === "" || newFacultyNum.trim() === "" || newFacultyCode.trim() === "") {
        this.setState({ facultyNameError: true, saveError: true });
        this.setState({ facultyNumError: true, saveError: true });
        this.setState({ facultyCodeError: true, saveError: true });
      } else {
        this.setState({ facultyNameError: false, saveError: false });
        this.setState({ facultyNumError: false, saveError: false });
        this.setState({ facultyCodeError: false, saveError: false });

        const isDuplicateFaculty = universityOrgStructures.some(
          faculty =>
            faculty.Id &&
            faculty.facultyArName &&
            faculty.facultyArName.trim() === newFacultyArName.trim()
        );

        const isDuplicateFacultyNumber = universityOrgStructures.some(
          faculty =>
            faculty.Id &&
            faculty.facultyNum &&
            faculty.facultyNum === parseInt(newFacultyNum, 10)
        );

        if (isDuplicateFaculty) {
          const duplicateErrorMessage = this.props.t(
            "Faculty Name already exists"
          );
          this.setState({ errorMessage: duplicateErrorMessage });
        } else if (isDuplicateFacultyNumber) {
          const duplicateNumberErrorMessage = this.props.t(
            "Faculty Number already exists"
          );
          this.setState({ errorMessage: duplicateNumberErrorMessage });
        } else {
          const successSavedMessage = this.props.t(
            "Faculty saved successfully"
          );
          this.setState({ successMessage: successSavedMessage });

          const payload = {
            arTitle: newFacultyArName,
            enTitle: newFacultyEnName,
            facultyNum: newFacultyNum,
            facultyDean: newFacultyDean,
            facultyCode: newFacultyCode,
          };
          (payload["tablename"] = "Common_Faculty"),
            onAddUniversityOrgStructure(payload);
        }
      }
    } else if (openForm == "editFaculty") {
      const { onUpdateUniversityOrgStructure } = this.props;
      const {
        editFacultyArName,
        editFacultyEnName,
        editFacultyNum,
        editFacultyDean,
        editFacultyCode,
        facultyNumError,
      } = this.state;

      const isDuplicateFaculty = universityOrgStructures
        .filter(faculty => faculty.Id !== facultyId)
        .some(
          faculty =>
            faculty.Id &&
            typeof faculty.facultyArName === "string" &&
            faculty.facultyArName.trim() === editFacultyArName.trim()
        );

      const isDuplicateFacultyNumber = universityOrgStructures.some(
        faculty =>
          faculty.Id !== facultyId &&
          faculty.facultyNum &&
          faculty.facultyNum === parseInt(editFacultyNum, 10) &&
          universityOrgStructures.some(
            otherFaculty =>
              otherFaculty.facultyNum === parseInt(editFacultyNum, 10) &&
              otherFaculty.Id !== facultyId
          )
      );

      if (isDuplicateFaculty) {
        const duplicateErrorMessage = this.props.t(
          "Faculty Name already exists"
        );
        this.setState({ errorMessage: duplicateErrorMessage });
      } else if (isDuplicateFacultyNumber) {
        const duplicateNumberErrorMessage = this.props.t(
          "Faculty Number already exists"
        );
        this.setState({ errorMessage: duplicateNumberErrorMessage });
      }
      if (!isDuplicateFaculty && !isDuplicateFacultyNumber) {
        if (editFacultyArName.trim() === "") {
          this.setState({ facultyNameError: true, saveError: true });
        }

        if (editFacultyNum === "") {
          this.setState({ facultyNumError: true, saveError: true });
        } else if (
          (editFacultyArName.trim() !== editFacultyArName.trim()) !==
          ""
        ) {
          this.setState({ facultyNameError: false, saveError: false });
        } else if (editFacultyNum !== "") {
          this.setState({ facultyNumError: false, saveError: false });
        }

        if (editFacultyCode === "") {
          this.setState({ facultyCodeError: true, saveError: true });
        
        } else if (editFacultyCode !== "") {
          this.setState({ facultyCodeError: false, saveError: false });
        }


        if (editFacultyArName.trim() !== "" || editFacultyNum !== "" || editFacultyCode.trim() !== "") {
          const successUpdatedMessage = this.props.t(
            "Faculty updated successfully"
          );
          this.setState({ successMessage: successUpdatedMessage });
          const payload = {
            Id: facultyId,
            arTitle: editFacultyArName,
            enTitle: editFacultyEnName,
            facultyNum: editFacultyNum,
            facultyDean: editFacultyDean,
            facultyCode: editFacultyCode,
          };
          (payload["tablename"] = "Common_Faculty"),
            onUpdateUniversityOrgStructure(payload);
        }
      }
    }
  };

  onClickDeleteFaculty = faculty => {
    this.setState({ selectedFacultyId: faculty.Id, deleteFacultyModal: true });
    this.setState({ selectedFaculty: faculty });
  };

  handleDeleteFaculty = () => {
    const { selectedFaculty } = this.state;
    const { onDeleteUniversityOrgStructure } = this.props;
    let payload = { Id: selectedFaculty.Id };
    payload["tablename"] = "Common_Faculty";
    this.setState({ deleteFacultyModal: null });

    if (selectedFaculty.departments[0].Id == null) {
      this.setState({ errorMessage: null, showAlert: true });
      onDeleteUniversityOrgStructure(payload);
    } else {
      const deleteErrorMessage = this.props.t(
        "Can't delete this Faculty! Delete it's departments first"
      );
      this.setState({ errorMessage: deleteErrorMessage });
    }
  };

  handleAddDepartmentForm = facultyId => {
    this.setState({ openForm: "department" });
    this.setState({ depFacultyId: facultyId });
    this.setState({ newDepartmentArName: "" });
    this.setState({ newDepartmentEnName: "" });
    this.setState({ newDepartmentNum: "" });
    this.setState({ newDepartmentPresident: "" });
  };

  handleDepartmentDataChange = (fieldName, value) => {
    const { openForm } = this.state;
    console.log("value",value)

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
        this.setState({ editDepartmentNum:  parseInt(value, 10) });
      }

      if (fieldName == "departmentEnName") {
        this.setState({ editDepartmentEnName: value });
      }

      if (fieldName == "departmentPresident") {
        this.setState({ editDepartmentPresident: value });
      }
    }
  };

  handleEditDepartment = (department, facultyId) => {
    this.setState({ openForm: "editDepartment" });
    this.setState({ departmentId: department.Id });
    this.setState({ depFacultyId: facultyId });
    this.setState({ editDepartmentArName: department.departmentArName });
    this.setState({ editDepartmentEnName: department.departmentEnName || "" });
    this.setState({ editDepartmentNum: department.departmentNum });
    this.setState({
      editDepartmentPresident: department.departmentPresident || "",
    });
  };

  handleSaveDepartment = () => {
    const { openForm, departmentId, depFacultyId } = this.state;
    const { universityOrgStructures } = this.props;
    console.log(" dep form ")
    if (openForm == "department") {

      const { onAddUniversityOrgStructure } = this.props;
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

        const isDuplicateDepartment = universityOrgStructures.some(
          faculty =>
            faculty.Id &&
            faculty.departments.some(
              department =>
                department.Id &&
                department.departmentArName &&
                department.departmentArName.trim() ===
                  newDepartmentArName.trim()
            )
        );


/* 
        const isDuplicateDepNumber = universityOrgStructures.some(
          faculty =>
            faculty.Id &&
            faculty.departments.some(
              department =>
                department.Id &&
                department.departmentNum &&
                department.departmentNum === parseInt(newDepartmentNum, 10)
            )
        );
        console.log("isDuplicateDepNumber",isDuplicateDepNumber) */


        const selectedFaculty = universityOrgStructures.find(faculty => faculty.Id === depFacultyId);

        console.log("selectedFaculty",selectedFaculty)
        if (!selectedFaculty) {
            console.log(`Faculty with facultyId ${depFacultyId} not found.`);
            return; // Exit function if selected faculty is not found
        }

        // Check if newDepartmentNum already exists in selectedFaculty's departments
        const isDuplicateDepNumber = selectedFaculty.departments.some(department => department.departmentNum === newDepartmentNum);
        console.log("isDuplicateDepNumber",isDuplicateDepNumber)

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
            facultyId: depFacultyId,
          };
          (payload["tablename"] = "Common_Department"),
            onAddUniversityOrgStructure(payload);
        }
      }
    } else if (openForm == "editDepartment") {
      console.log("open edit dep form ")

      const { onUpdateUniversityOrgStructure } = this.props;
      const {
        editDepartmentArName,
        editDepartmentEnName,
        editDepartmentNum,
        editDepartmentPresident,
      } = this.state;

      const isDuplicateDepartment = universityOrgStructures.some(
        faculty =>
          faculty.Id &&
          faculty.departments
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
    console.log(" dep isDuplicateDepartment ",isDuplicateDepartment)


      if (isDuplicateDepartment) {
    console.log(" dep duplicate")

        const duplicateErrorMessage = this.props.t("Department already exists");
        this.setState({ errorMessage: duplicateErrorMessage });
      } else {
    console.log(" dep not duplicate")

        if (editDepartmentArName.trim() === "") {
          this.setState({ departmentNameError: true, saveError: true });
    console.log(" editDepartmentArName = empty")

        }

      else if (
          
          editDepartmentArName.trim() !== "" ||
          editDepartmentEnName.trim() !== ""
        ) {
          const successUpdatedMessage = this.props.t(
            "Department updated successfully"
          );
          this.setState({ departmentNumError: false,  saveError: false,successMessage: successUpdatedMessage });

          const payload = {
            Id: departmentId,
            arTitle: editDepartmentArName,
            enTitle: editDepartmentEnName,
            departmentNum: editDepartmentNum,
            departmentPresident: editDepartmentPresident,
            facultyId: depFacultyId,
          };
          (payload["tablename"] = "Common_Department"),
            onUpdateUniversityOrgStructure(payload);
        }
      }
    }
  };

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteFacultyModal: !prevState.deleteFacultyModal,
    }));
  };

  onClickDeleteDepartment = depId => {
    this.setState({ selectedDepId: depId, deleteDepartmentModal: true });
  };

  handleDeleteDepartment = () => {
    const { selectedDepId } = this.state;
    if (selectedDepId !== null) {
      let payload = { Id: selectedDepId };
      payload["tablename"] = "Common_Department";
      const { onDeleteUniversityOrgStructure } = this.props;
      onDeleteUniversityOrgStructure(payload);

      this.setState({
        selectedDepId: null,
        deleteDepartmentModal: false,
        showAlert: true,
      });
    }
  };

  handleErrorClose = () => {
    this.setState({ errorMessage: null });
  };

  handleSuccessClose = () => {
    this.setState({ successMessage: null });
  };

  handleSuccessDeletedClose = () => {
    const { onGetUniversityOrgStructureDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetUniversityOrgStructureDeletedValue();
  };

  handleErrorDeletedClose = () => {
    const { onGetUniversityOrgStructureDeletedValue } = this.props;
    this.setState({ showAlert: null });
    onGetUniversityOrgStructureDeletedValue();
  };

  render() {
    const {
      newFacultyArName,
      newFacultyEnName,
      newFacultyNum,
      newFacultyDean,
      newFacultyCode,
      editFacultyArName,
      editFacultyEnName,
      editFacultyNum,
      editFacultyDean,
      editFacultyCode,
      newDepartmentArName,
      newDepartmentEnName,
      newDepartmentNum,
      newDepartmentPresident,
      depFacultyId,
      editDepartmentArName,
      editDepartmentEnName,
      editDepartmentNum,
      editDepartmentPresident,
      selectedFacultyId,
      universityDefaultName,
      expandedNodes,
      editingUniversityName,
      openForm,
      errorMessage,
      successMessage,
      facultyBeingEdited,
      departmentBeingEdited,
      facultyNameError,
      facultyNumError,
      facultyCodeError,
      departmentNameError,
      departmentNumError,
      deleteFacultyModal,
      deleteDepartmentModal,
      showAlert,
      showAddButton,
      showDeleteButton,
      showEditButton,
    } = this.state;
    const { t, universityOrgStructures, universityInfo, deleted } = this.props;

    const alertMessage =
      deleted == 0
        ? this.props.t("Can't Delete ")
        : this.props.t("Deleted Successfully");

    // Meta title
    document.title =
      "University | keyInHands - React Admin & Dashboard Template";

    return (
      <div className="page-content">
        <DeleteModal
          show={deleteFacultyModal}
          onDeleteClick={this.handleDeleteFaculty}
          onCloseClick={() => this.setState({ deleteFacultyModal: false })}
        />
        <DeleteModal
          show={deleteDepartmentModal}
          onDeleteClick={this.handleDeleteDepartment}
          onCloseClick={() => this.setState({ deleteDepartmentModal: false })}
        />
        <Row>
          <Breadcrumbs
            title={t("University")}
            breadcrumbItem={t("University Organizational Structure")}
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
                      editingUniversityName ? (
                        <Form className="university-name-form">
                          <Input
                            type="text"
                            value={universityInfo.universityName}
                            onChange={e =>
                              this.setState({
                                universityDefaultName: e.target.value,
                              })
                            }
                            onBlur={() =>
                              this.setState({ editingUniversityName: false })
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
                                  editingUniversityName: false,
                                })
                              }
                            >
                              {universityInfo.universityName}{" "}
                            </span>
                            {showAddButton && (
                              <IconButton
                                className="add-faculty-button"
                                onClick={this.handleAddFacultyForm}
                              >
                                <AddIcon className="zeButton" />
                              </IconButton>
                            )}
                          </div>
                        </div>
                      )
                    }
                  >
                    {universityOrgStructures
                      ? universityOrgStructures.map(universityOrgStructure => (
                          <TreeItem
                            key={universityOrgStructure.Id}
                            nodeId={`universityOrgStructure-${universityOrgStructure.Id}`}
                            label={
                              <div className="faculty-item">
                                <span>
                                  {t(universityOrgStructure.facultyArName)}
                                </span>
                                <div className="faculty-item-actions">
                                {showAddButton && (
                                  <IconButton
                                    className="add-faculty-button"
                                    onClick={() =>
                                      this.handleAddDepartmentForm(
                                        universityOrgStructure.Id
                                      )
                                    }
                                  >
                                    <AddIcon className="zeButton" />
                                  </IconButton>
                                )}
                                <IconButton
                                  className="edit-faculty-button"
                                  onClick={() =>
                                    this.handleEditFaculty(
                                      universityOrgStructure
                                    )
                                  }
                                >
                                  <EditIcon className="zeButton" />
                                </IconButton>
                                {showDeleteButton && (
                                  <div className="faculty-item-actions">
                                    <IconButton
                                      className="delete-faculty-button"
                                      onClick={() =>
                                        this.onClickDeleteFaculty(
                                          universityOrgStructure
                                        )
                                      }
                                    >
                                      <DeleteIcon className="zeButton" />
                                    </IconButton>
                                  </div>
                                )}
                                </div>
                              </div>
                            }
                          >
                            {universityOrgStructure.departments &&
                            universityOrgStructure.departments[0].Id != null
                              ? universityOrgStructure.departments.map(
                                  department => (
                                    <TreeItem
                                      key={department.Id}
                                      nodeId={`department-${department.Id}`}
                                      label={
                                        <div className="department-item">
                                          <span>
                                            {department.departmentArName}
                                          </span>
                                          <div className="faculty-item-actions">
                                          {showDeleteButton && (
                                          <IconButton
                                            className="delete-department-button"
                                            onClick={() =>
                                              this.handleEditDepartment(
                                                department,
                                                universityOrgStructure.Id
                                              )
                                            }
                                          >
                                            <EditIcon className="zeButton" />
                                          </IconButton>)}
                                          {showDeleteButton && (
                                            <div className="department-item-actions">
                                              <IconButton
                                                className="delete-department-button"
                                                onClick={() =>
                                                  this.onClickDeleteDepartment(
                                                    department.Id
                                                  )
                                                }
                                              >
                                                <DeleteIcon className="zeButton" />
                                              </IconButton>
                                            </div>
                                          )}
                                          </div>
                                        </div>
                                      }
                                    />
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
                {openForm == "faculty" && (
                  <div>
                    <Row>
                      <Typography variant="div">
                        <h5 className="header pt-2 mb-2" id="title">
                          {t("Add New Faculty")}
                        </h5>
                      </Typography>
                    </Row>
                    <Row className="mt-4">
                      <Col lg="2">
                        <label
                          htmlFor="facultyName(ar)"
                          className="col-form-label"
                        >
                          {t("Faculty Name(ar)")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="facultyName(ar)"
                          name="facultyArName"
                          autoComplete="off"
                          className={`form-control ${
                            facultyNameError ? "is-invalid" : ""
                          }`}
                          placeholder={t("Faculty Name(ar)")}
                          value={newFacultyArName}
                          onChange={e => {
                            this.handleFacultyDataChange(
                              "facultyArName",
                              e.target.value
                            );
                          }}
                        />
                        {facultyNameError && (
                          <div className="invalid-feedback">
                            {t("Faculty Name is required")}
                          </div>
                        )}
                      </Col>
                      <Col lg="2">
                        <label htmlFor="facultyName" className="col-form-label">
                          {"Faculty Name"}:
                        </label>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="facultyName"
                          name="facultyEnName"
                          autoComplete="off"
                          className="form-control mb-2"
                          placeholder={t("Faculty Name")}
                          value={newFacultyEnName}
                          onChange={e => {
                            this.handleFacultyDataChange(
                              "facultyEnName",
                              e.target.value
                            );
                          }}
                        />
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col lg="2">
                        <label htmlFor="facultyNum" className="col-form-label">
                          {t("Faculty Number")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="facultyNum"
                          name="facultyNum"
                          className={`form-control ${
                            facultyNumError ? "is-invalid" : ""
                          }`}
                          placeholder={t("Faculty Number")}
                          value={newFacultyNum}
                          onChange={e => {
                            this.handleFacultyDataChange(
                              "facultyNum",
                              e.target.value
                            );
                          }}
                        />
                        {facultyNumError && (
                          <div className="invalid-feedback">
                            {t("Faculty number is required")}
                          </div>
                        )}
                      </Col>
                      <Col lg="2">
                        <label htmlFor="facultyCode" className="col-form-label">
                          {t("Faculty Code")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="facultyCode"
                          name="facultyCode"
                          className={`form-control ${
                            facultyCodeError ? "is-invalid" : ""
                          }`}
                          placeholder={t("Faculty Code")}
                          value={newFacultyCode}
                          onChange={e => {
                            this.handleFacultyDataChange(
                              "facultyCode",
                              e.target.value
                            );
                          }}

                        />
                         {facultyCodeError && (
                          <div className="invalid-feedback">
                            {t("Faculty number is required")}
                          </div>
                        )}
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col lg="2">
                        <label htmlFor="facultyDean" className="col-form-label">
                          {t("Dean's Name")}:
                        </label>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="facultyDean"
                          name="facultyDean"
                          className="form-control mb-2"
                          placeholder={t("Dean's Name")}
                          value={newFacultyDean}
                          onChange={e => {
                            this.handleFacultyDataChange(
                              "facultyDean",
                              e.target.value
                            );
                          }}
                        />
                      </Col>
                    </Row>
                    <div className="d-flex justify-content-end mt-4">
                      <button
                        type="button"
                        className="btn btn-primary save-faculty-button"
                        onClick={this.handleSaveFaculty}
                      >
                        {t("Save Faculty")}
                      </button>
                    </div>
                  </div>
                )}
                {openForm === "department" && depFacultyId && (
                  <div>
                    <Row>
                      <Typography variant="div">
                        <h5 className="header pt-2 mb-2" id="title">
                          {this.props.t("Add New Department")}{" "}
                          {
                            universityOrgStructures.find(
                              faculty => faculty.Id === selectedFacultyId
                            )?.facultyArName
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
                          {"Department Name"}:
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
                          type="text"
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
                        className="btn btn-primary save-faculty-button"
                        onClick={this.handleSaveDepartment}
                      >
                        {t("Save Department")}
                      </button>
                    </div>
                  </div>
                )}
                {openForm === "editFaculty" && (
                  <div>
                    <Row>
                      <Typography variant="div">
                        <h5 className="header pt-2 mb-2" id="title">
                          {t("Edit Faculty")}
                        </h5>
                      </Typography>
                    </Row>
                    <Row className="mt-4">
                      <Col lg="2">
                        <label
                          htmlFor="facultyName(ar)"
                          className="col-form-label"
                        >
                          {t("Faculty Name(ar)")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="facultyName(ar)"
                          name="facultyArName"
                          autoComplete="off"
                          className={`form-control ${
                            facultyNameError ? "is-invalid" : ""
                          }`}
                          placeholder={t("Faculty Name(ar)")}
                          value={editFacultyArName}
                          onChange={e => {
                            this.handleFacultyDataChange(
                              "facultyArName",
                              e.target.value
                            );
                          }}
                          disabled={!showEditButton}
                        />
                        {facultyNameError && (
                          <div className="invalid-feedback">
                            {t("Faculty Name is required")}
                          </div>
                        )}
                      </Col>
                      <Col lg="2">
                        <label htmlFor="facultyName" className="col-form-label">
                          {"Faculty Name"}:
                        </label>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="facultyName"
                          name="facultyEnName"
                          autoComplete="off"
                          className="form-control mb-2"
                          placeholder={t("Faculty Name")}
                          value={editFacultyEnName}
                          onChange={e => {
                            this.handleFacultyDataChange(
                              "facultyEnName",
                              e.target.value
                            );
                          }}
                          disabled={!showEditButton}
                        />
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col lg="2">
                        <label htmlFor="facultyNum" className="col-form-label">
                          {t("Faculty Number")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="facultyNum"
                          name="facultyNum"
                          className={`form-control ${
                            facultyNumError ? "is-invalid" : ""
                          }`}
                          placeholder={t("Faculty Number")}
                          value={editFacultyNum}
                          onChange={e => {
                            this.handleFacultyDataChange(
                              "facultyNum",
                              e.target.value
                            );
                          }}
                          disabled={!showEditButton}
                        />
                        {facultyNumError && (
                          <div className="invalid-feedback">
                            {t("Faculty number is required")}
                          </div>
                        )}
                      </Col>
                      <Col lg="2">
                        <label htmlFor="facultyCode" className="col-form-label">
                          {t("Faculty Code")}:
                        </label>
                        <span className="text-danger">*</span>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="facultyCode"
                          name="facultyCode"
                          className="form-control mb-2"
                          placeholder={t("Faculty Code")}
                          value={editFacultyCode}
                          onChange={e => {
                            this.handleFacultyDataChange(
                              "facultyCode",
                              e.target.value
                            );
                          }}
                          disabled={!showEditButton}
                        />
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col lg="2">
                        <label htmlFor="facultyDean" className="col-form-label">
                          {t("Dean's Name")}:
                        </label>
                      </Col>
                      <Col md="4">
                        <input
                          type="text"
                          id="facultyDean"
                          name="facultyDean"
                          className="form-control mb-2"
                          placeholder={t("Dean's Name")}
                          value={editFacultyDean}
                          onChange={e => {
                            this.handleFacultyDataChange(
                              "facultyDean",
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
                        className="btn btn-primary save-faculty-button"
                        onClick={this.handleSaveFaculty}
                      >
                        {t("Save Faculty")}
                      </button>
                    </div>
                  </div>
                )}
                {openForm === "editDepartment" && (
                  <div>
                    <Row>
                      <Typography variant="div">
                        <h5 className="header pt-2 mb-2" id="title">
                          {t("Edit Department")} {facultyBeingEdited} -{" "}
                          {departmentBeingEdited}
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
                          {"Department Name"}:
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
                        className="btn btn-primary save-faculty-button"
                        onClick={this.handleSaveDepartment}
                      >
                        {t("Save Department")}
                      </button>
                    </div>
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
  universityOrgStructures,
  universityInfo,
  menu_items,
}) => ({
  universityOrgStructures: universityOrgStructures.universityOrgStructures,
  deleted: universityOrgStructures.deleted,
  universityInfo: universityInfo.universityInfo,
  user_menu: menu_items.user_menu || [],
});
const mapDispatchToProps = dispatch => ({
  onGetUniversityOrgStructures: () => dispatch(getUniversityOrgStructure()),
  onAddUniversityOrgStructure: universityOrgStructure =>
    dispatch(addNewUniversityOrgStructure(universityOrgStructure)),
  onUpdateUniversityOrgStructure: universityOrgStructure =>
    dispatch(updateUniversityOrgStructure(universityOrgStructure)),
  onDeleteUniversityOrgStructure: universityOrgStructure =>
    dispatch(deleteUniversityOrgStructure(universityOrgStructure)),
  onGetUniversityOrgStructureDeletedValue: () =>
    dispatch(getUniversityOrgStructureDeletedValue()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(UniversityTree));
