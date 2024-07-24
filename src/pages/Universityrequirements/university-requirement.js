import React, { Component } from "react";
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
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  Label,
} from "reactstrap";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";

import BootstrapTable from "react-bootstrap-table-next";

import images from "assets/images";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import {
  getUniversityrequirements,
  addNewUniversityrequirement,
  updateUniversityrequirement,
  deleteUniversityrequirement,
} from "store/universityrequirements/actions";

import { isEmpty, size, map } from "lodash";
import { universityrequirements } from "common/data";

class Universityrequirement extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      universityrequirements: [],
      universityrequirement: "",
      modal: false,
      deleteModal: false,
      universityrequirementListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, universityrequirements) => (
            <>{universityrequirements.id}</>
          ),
        },
        {
          text: this.props.t("Universityrequirement Type(ar)"),
          dataField: "aruniversityrequirement",
          sort: true,
          formatter: (cellContent, universityrequirements) => (
            <>
              <h5 className="font-size-14 mb-1">
                <Link to="#" className="text-dark">
                  {universityrequirements.aruniversityrequirement}
                </Link>
              </h5>
            </>
          ),
        },
        {
          text: "Universityrequirement Type",
          dataField: "enuniversityrequirement",
          sort: true,
          formatter: (cellContent, universityrequirements) => (
            <>
              <h5 className="font-size-14 mb-1">
                <Link to="#" className="text-dark">
                  {universityrequirements.enuniversityrequirement}
                </Link>
              </h5>
            </>
          ),
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: this.props.t("Action"),
          formatter: (cellContent, universityrequirement) => (
            <div className="d-flex gap-3">
              <Link className="text-success" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={() =>
                    this.handleUniversityrequirementClick(universityrequirement)
                  }
                ></i>
              </Link>
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(universityrequirement)}
                ></i>
              </Link>
            </div>
          ),
        },
      ],
    };
    this.handleUniversityrequirementClick =
      this.handleUniversityrequirementClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleUniversityrequirementClicks =
      this.handleUniversityrequirementClicks.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  componentDidMount() {
    const { universityrequirements, onGetUniversityrequirements } = this.props;
    if (universityrequirements && !universityrequirements.length) {
      onGetUniversityrequirements();
    }
    this.setState({ universityrequirements });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleUniversityrequirementClicks = () => {
    this.setState({ universityrequirement: "", isEdit: false });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { universityrequirements } = this.props;
    if (
      !isEmpty(universityrequirements) &&
      size(prevProps.universityrequirements) !== size(universityrequirements)
    ) {
      this.setState({ universityrequirements: {}, isEdit: false });
    }
  }

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

  /* Insert,Update Delete data */

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  onClickDelete = universityrequirements => {
    this.setState({ universityrequirements: universityrequirements });
    this.setState({ deleteModal: true });
  };

  handleDeleteUniversityrequirement = () => {
    const { onDeleteUniversityrequirement } = this.props;
    const { universityrequirements } = this.state;
    if (universityrequirements.id !== undefined) {
      onDeleteUniversityrequirement(universityrequirements);
      this.setState({ deleteModal: false });
    }
  };

  handleUniversityrequirementClick = arg => {
    const universityrequirement = arg;
    this.setState({
      universityrequirement: {
        id: universityrequirement.id,
        aruniversityrequirement: universityrequirement.aruniversityrequirement,
        enuniversityrequirement: universityrequirement.enuniversityrequirement,
      },
      isEdit: true,
    });
    this.toggle();
  };

  render() {
    //meta title
    document.title =
      "Universityrequirement List | keyInHands - React Admin & Dashboard Template";

    // const { universityrequirements } = this.state
    const { SearchBar } = Search;

    const { universityrequirements } = this.props;

    const { isEdit, deleteModal } = this.state;

    const { onAddNewUniversityrequirement, onUpdateUniversityrequirement } =
      this.props;
    const universityrequirement = this.state.universityrequirement;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: universityrequirements.length, // replace later with size(universityrequirements),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    const selectRow = {
      mode: "checkbox",
    };

    return <React.Fragment></React.Fragment>;
  }
}

Universityrequirement.propTypes = {
  universityrequirements: PropTypes.array,
  className: PropTypes.any,
  onGetUniversityrequirements: PropTypes.func,
  onAddNewUniversityrequirement: PropTypes.func,
  onDeleteUniversityrequirement: PropTypes.func,
  onUpdateUniversityrequirement: PropTypes.func,
};
/*
const mapStateToProps = ({ state }) => ({
  universityrequirements: state.universityrequirements,
});
*/

const mapStateToProps = ({ universityrequirements }) => ({
  universityrequirements: universityrequirements.universityrequirements,
});

const mapDispatchToProps = dispatch => ({
  onGetUniversityrequirements: () => dispatch(getUniversityrequirements()),
  onAddNewUniversityrequirement: universityrequirement =>
    dispatch(addNewUniversityrequirement(universityrequirement)),
  onUpdateUniversityrequirement: universityrequirement =>
    dispatch(updateUniversityrequirement(universityrequirement)),
  onDeleteUniversityrequirement: universityrequirement =>
    dispatch(deleteUniversityrequirement(universityrequirement)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(Universityrequirement)));
