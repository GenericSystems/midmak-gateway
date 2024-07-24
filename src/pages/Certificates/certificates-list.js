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
  getCertificates,
  addNewCertificate,
  updateCertificate,
  deleteCertificate,
} from "store/certificates/actions";

import { isEmpty, size, map } from "lodash";

class CertificatesList2 extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      certificates: [],
      certificate: "",
      modal: false,
      deleteModal: false,
      certificateListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, certificate) => <>{certificate.id}</>,
        },

        {
          text: this.props.t("Certification(ar)"),
          dataField: "artitle",
          sort: true,
          formatter: (cellContent, certificate) => (
            <>
              <h5 className="font-size-14 mb-1">
                <Link to="#" className="text-dark">
                  {certificate.artitle}
                </Link>
              </h5>
            </>
          ),
        },

        {
          text: "Certification",
          dataField: "entitle",
          sort: true,
          formatter: (cellContent, certificate) => (
            <>
              <h5 className="font-size-14 mb-1">
                <Link to="#" className="text-dark">
                  {certificate.entitle}
                </Link>
              </h5>
            </>
          ),
        },
        {
          text: this.props.t("Certificate Level"),
          dataField: "encertificatelevel",
          sort: true,
          formatter: (cellContent, certificate) => (
            <>
              <h5 className="font-size-14 mb-1">
                <Link to="#" className="text-dark">
                  {certificate.encertificatelevel}
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
          formatter: (cellContent, certificate) => (
            <div className="d-flex gap-3">
              <Link className="text-secondary" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={() => this.handleCertificateClick(certificate)}
                ></i>
              </Link>
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(certificate)}
                ></i>
              </Link>
            </div>
          ),
        },
      ],
    };
    this.handleCertificateClick = this.handleCertificateClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleCertificateClicks = this.handleCertificateClicks.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  componentDidMount() {
    const { certificates, onGetCertificates } = this.props;
    if (certificates && !certificates.length) {
      onGetCertificates();
    }
    this.setState({ certificates });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleCertificateClicks = () => {
    this.setState({ certificate: "", isEdit: false });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { certificates } = this.props;
    if (
      !isEmpty(certificates) &&
      size(prevProps.certificates) !== size(certificates)
    ) {
      this.setState({ certificates: {}, isEdit: false });
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

  onClickDelete = certificates => {
    this.setState({ certificates: certificates });
    this.setState({ deleteModal: true });
  };

  handleDeleteCertificate = () => {
    const { onDeleteCertificate } = this.props;
    const { certificates } = this.state;
    if (certificates.id !== undefined) {
      onDeleteCertificate(certificates);
      this.setState({ deleteModal: false });
    }
  };

  handleCertificateClick = arg => {
    const certificate = arg;
    this.setState({
      certificate: {
        id: certificate.id,
        entitle: certificate.entitle,
        artitle: certificate.artitle,
      },
      isEdit: true,
    });
    this.toggle();
  };
  render() {
    //meta title
    document.title =
      "Certificate List | keyInHands - React Admin & Dashboard Template";

    // const { certificates } = this.state
    const { SearchBar } = Search;
    const { certificates, certificatelevel } = this.props;

    const { isEdit, deleteModal } = this.state;

    const { onAddNewCertificate, onUpdateCertificate } = this.props;
    const certificate = this.state.certificate;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: certificates.length, // replace later with size(certificates),
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

    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteCertificate}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title={this.props.t("Certificates")}
              breadcrumbItem={this.props.t("Certificates List")}
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.certificateListColumns}
                      data={certificates}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.certificateListColumns}
                          data={certificates}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="4">
                                  <div className="search-box ms-2 mb-2 d-inline-block">
                                    <div className="position-relative">
                                      <SearchBar
                                        {...toolkitprops.searchProps}
                                      />
                                      <i className="bx bx-search-alt search-icon" />
                                    </div>
                                  </div>
                                </Col>
                                <Col sm="8">
                                  <div className="text-sm-end">
                                    <Button
                                      color="primary"
                                      className="font-16 btn-block btn btn-primary"
                                      onClick={this.handleCertificateClicks}
                                    >
                                      <i className="mdi mdi-plus-circle-outline me-1" />
                                      {this.props.t("Create New Certificate")}
                                    </Button>
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      selectRow={selectRow}
                                      defaultSorted={defaultSorted}
                                      classes={
                                        "table align-middle table-nowrap table-hover"
                                      }
                                      bordered={false}
                                      striped={false}
                                      responsive
                                      ref={this.node}
                                    />

                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.toggle}
                                        tag="h4"
                                      >
                                        {!!isEdit
                                          ? this.props.t("Edit Certificate")
                                          : this.props.t("Add Certificate")}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            artitle:
                                              (certificate &&
                                                certificate.artitle) ||
                                              "",
                                            entitle:
                                              (certificate &&
                                                certificate.entitle) ||
                                              "",
                                            encertificatelevel:
                                              (certificatelevel &&
                                                certificatelevel.encertificatelevel) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            artitle: Yup.string().required(
                                              "Please Enter Your Certificate(Ar) "
                                            ),
                                            entitle: Yup.string().required(
                                              "Please Enter The Certificate(Eng) "
                                            ),
                                          })}
                                          onSubmit={values => {
                                            if (isEdit) {
                                              const updateCertificate = {
                                                id: certificate.id,
                                                artitle: certificate.artitle,
                                                entitle: certificate.entitle,
                                              };
                                              onUpdateCertificate(
                                                updateCertificate
                                              );
                                            } else {
                                              const newCertificate = {
                                                id:
                                                  Math.floor(
                                                    Math.random() * (30 - 20)
                                                  ) + 20,
                                                entitle:
                                                  values["Certification"],
                                                artitle:
                                                  values["Certification(ar)"],
                                              };
                                              // save new certificate
                                              onAddNewCertificate(
                                                newCertificate
                                              );
                                            }
                                            this.setState({
                                              selectedCertificate: null,
                                            });
                                            this.toggle();
                                          }}
                                        >
                                          {({ errors, status, touched }) => (
                                            <Form>
                                              <Row>
                                                <Col className="col-12">
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      {this.props.t(
                                                        "Certification(ar)"
                                                      )}
                                                    </Label>
                                                    <Field
                                                      name="artitle"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        (errors.artitle &&
                                                        touched.artitle
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="artitle"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Certification
                                                    </Label>
                                                    <Field
                                                      name="entitle"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        (errors.entitle &&
                                                        touched.entitle
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="entitle"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      {this.props.t(
                                                        "Certificate Level"
                                                      )}
                                                    </Label>
                                                    <select className="form-select">
                                                      <option>Select</option>
                                                      <option>
                                                        Large select
                                                      </option>
                                                      <option>
                                                        Small select
                                                      </option>
                                                    </select>
                                                  </div>
                                                </Col>
                                              </Row>
                                              <Row>
                                                <Col>
                                                  <div className="text-end">
                                                    <button
                                                      type="submit"
                                                      className="btn btn-success save-certificate"
                                                    >
                                                      {this.props.t("Save")}
                                                    </button>
                                                  </div>
                                                </Col>
                                              </Row>
                                            </Form>
                                          )}
                                        </Formik>
                                      </ModalBody>
                                    </Modal>
                                  </div>
                                </Col>
                              </Row>
                              <Row className="align-items-md-center mt-30">
                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </Col>
                              </Row>
                            </React.Fragment>
                          )}
                        </ToolkitProvider>
                      )}
                    </PaginationProvider>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

CertificatesList2.propTypes = {
  certificates: PropTypes.array,
  className: PropTypes.any,
  onGetCertificates: PropTypes.func,
  onAddNewCertificate: PropTypes.func,
  onDeleteCertificate: PropTypes.func,
  onUpdateCertificate: PropTypes.func,
};
/*
const mapStateToProps = ({ state }) => ({
  certificates: state.certificates,
});
*/

const mapStateToProps = ({ config }) => ({
  certificates: config.certificates,
});

const mapDispatchToProps = dispatch => ({
  onGetCertificates: () => dispatch(getCertificates()),
  onAddNewCertificate: certificate => dispatch(addNewCertificate(certificate)),
  onUpdateCertificate: certificate => dispatch(updateCertificate(certificate)),
  onDeleteCertificate: certificate => dispatch(deleteCertificate(certificate)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(CertificatesList2)));
