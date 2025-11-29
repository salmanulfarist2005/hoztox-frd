import React, { useState } from "react";
import {
    Card,
    CardBody,
    Col,
    Row,
    Container,
} from "reactstrap";
import Breadcrumbs from "../../../components/Admin/Breadcrumb";
import axios from "axios";
import { BASE_URL } from '../../helpers/config';

const ChangePassword = () => {
    document.title = "Caratree Diamonds-Dashboard";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const adminToken = localStorage.getItem('adminAuthToken');

            console.log("Admin Token:", adminToken);
            console.log("Request Data:", {
                new_password: newPassword,
                confirm_password: confirmPassword,
            });

            const response = await axios.put(`${BASE_URL}/products/change-password/`, {
                new_password: newPassword,
                confirm_password: confirmPassword,
            }, {
                headers: {
                    Authorization: `Token ${adminToken}`,
                }
            });

            alert("Password updated successfully.");
            setError("");

            setNewPassword('');
            setConfirmPassword('');
            setSuccess("");

        } catch (err) {
            alert("Failed to update password. " + (err.response?.data?.detail || "An error occurred."));
            setSuccess("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <React.Fragment>
            <div className="main-content">
                <div className="page-content ">
                    <Container fluid={true}>
                        <Breadcrumbs title="Management" breadcrumbItem="Admin Change Password" />

                        <Row>
                            <Col>
                                <Card>
                                    <CardBody>
                                        <form onSubmit={handleSubmit}>
                                            <Row className="mb-3">
                                                <label htmlFor="new-password" className="col-md-2 col-form-label">
                                                    New Password
                                                </label>
                                                <div className="col-md-10">
                                                    <div className="input-group">
                                                        <input
                                                            id="new-password"
                                                            className="form-control"
                                                            type={showNewPassword ? "text" : "password"}
                                                            placeholder="New Password"
                                                            value={newPassword}
                                                            onChange={(e) => setNewPassword(e.target.value)}
                                                            required
                                                        />
                                                        <button
                                                            className="btn btn-outline-secondary"
                                                            type="button"
                                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                                        >
                                                            <i className={showNewPassword ? "mdi mdi-eye-off" : "mdi mdi-eye"}></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </Row>

                                            <Row className="mb-3">
                                                <label htmlFor="confirm-password" className="col-md-2 col-form-label">
                                                    Confirm Password
                                                </label>
                                                <div className="col-md-10">
                                                    <div className="input-group">
                                                        <input
                                                            id="confirm-password"
                                                            className="form-control"
                                                            type={showConfirmPassword ? "text" : "password"}
                                                            placeholder="Confirm Password"
                                                            value={confirmPassword}
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                            required
                                                        />
                                                        <button
                                                            className="btn btn-outline-secondary"
                                                            type="button"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        >
                                                            <i className={showConfirmPassword ? "mdi mdi-eye-off" : "mdi mdi-eye"}></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </Row>

                                            {error && <div className="text-danger">{error}</div>}
                                            {success && <div className="text-success">{success}</div>}

                                            <div className="col-12">
                                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                                    {loading ? "Updating..." : "Submit"}
                                                </button>
                                            </div>
                                        </form>
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

export default ChangePassword;