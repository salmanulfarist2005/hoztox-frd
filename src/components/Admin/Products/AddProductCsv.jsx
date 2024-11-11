import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Form,
  CardBody,
  Container,
} from "reactstrap";
import Dropzone from "react-dropzone";
import { Link } from "react-router-dom";
import axios from "axios";
import Breadcrumbs from "../../../components/Admin/Breadcrumb";

import { BASE_URL } from '../../helpers/config';

const ProductCSVUpload = () => {
  document.title = "Upload CSV | Upzet - React Admin & Dashboard Template";
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  function handleAcceptedFiles(files) {

    const csvFiles = files.filter((file) => file.type === "text/csv");


    csvFiles.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );

    setSelectedFiles(csvFiles);
    setCsvFile(csvFiles[0]);
  }


  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }


  const handleCSVUpload = async () => {
    if (!csvFile) {
      alert("Please upload a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", csvFile);

    try {
      const response = await axios.post(`${BASE_URL}/products/upload-csv/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Data saved successfully:', response);
      setSuccessMessage('CSV uploaded successfully!');
      setErrorMessage('');
      setCsvFile(null);

    } catch (error) {
      console.error('Error uploading CSV:', error);

      if (error.response) {
        console.error('Error response data:', error.response.data);

        const errorMessage = error.response.data.error || 'An unknown error occurred.';
        setErrorMessage(errorMessage);
      } else if (error.request) {
        console.error('No response received:', error.request);
        setErrorMessage('No response received from server. Please check your connection.');
      } else {
        console.error('Error message:', error.message);
        setErrorMessage('Error uploading CSV file. Please try again.');
      }

      setSuccessMessage('');
    }
  };







  return (
    <React.Fragment>
      <div className="main-content">
        <div className="page-content ">
          <Container fluid={true}>
            <Breadcrumbs title="Products" breadcrumbItem="Upload Products CSV" />

            <Row>
              <Col className="col-12">
                <Card>
                  <CardBody>
                    <Form className="dropzone mt-2">
                      <Dropzone
                        onDrop={acceptedFiles => {
                          handleAcceptedFiles(acceptedFiles);
                        }}
                        accept=".csv" // Accept only CSV files
                      >
                        {({ getRootProps, getInputProps }) => (
                          <div style={{ textAlign: "center" }}>
                            <div className="dz-message needsclick" {...getRootProps()}>
                              <input {...getInputProps()} />
                              <div className="mb-3">
                                <i className="display-4 text-muted mdi mdi-cloud-upload-outline"></i>
                              </div>
                              <h4>Drop CSV file here to upload</h4>
                            </div>
                          </div>
                        )}
                      </Dropzone>

                      <div className="dropzone-previews mt-3" id="file-previews">
                        {selectedFiles.map((f, i) => {
                          return (
                            <Card
                              className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                              key={i + "-file"}
                            >
                              <div className="p-2">
                                <Row className="align-items-center">
                                  <Col className="col-auto">
                                    <img
                                      data-dz-thumbnail=""
                                      height="80"
                                      className="avatar-sm rounded bg-light"
                                      alt={f.name}
                                      src={f.preview}
                                    />
                                  </Col>
                                  <Col>
                                    <Link to="#" className="text-muted font-weight-bold">
                                      {f.name}
                                    </Link>
                                    <p className="mb-0">
                                      <strong>{f.formattedSize}</strong>
                                    </p>
                                  </Col>
                                </Row>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    </Form>

                    <div className="text-center mt-4">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleCSVUpload}
                      >
                        Upload CSV
                      </button>
                    </div>


                    {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
        </div>
    </React.Fragment>
  );
};

export default ProductCSVUpload;
