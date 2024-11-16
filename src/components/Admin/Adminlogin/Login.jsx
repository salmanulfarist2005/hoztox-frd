import React, { useState, useEffect } from "react";
// import logolight from "../../assets/images/logo-light.png";
// import logodark from "../../assets/images/logo-dark.png";
import axios from 'axios';
import { Container, Row, Col, Card, CardBody, Form } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from '../../../components/helpers/config';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('adminAuthToken');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BASE_URL}/products/login/`, {
                email,
                password,
            });


            const { access } = response.data;

            if (access) {
                localStorage.setItem('adminAuthToken', access);
                alert('Login successful!');
                console.log("access", access)
                navigate('/dashboard');
            }
        } catch (error) {
            console.error(error);
            alert('Invalid Credentials');
        }
    };





    return (
        <React.Fragment>
            <div className="bg-overlay"></div>
            <div className="account-pages my-5 pt-5">
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={6} md={8} xl={4}>
                            <Card>
                                <CardBody className="p-4">
                                    <div>
                                        <div className="text-center">
                                            <Link to="/">
                                                {/* <img
                                                    src={logodark}
                                                    alt="logo-dark"
                                                    height="24"
                                                    className="auth-logo logo-dark mx-auto"
                                                />
                                                <img
                                                    src={logolight}
                                                    alt="logo-light"
                                                    height="24"
                                                    className="auth-logo logo-light mx-auto"
                                                /> */}
                                            </Link>
                                        </div>
                                        <h4 className="font-size-18 text-muted mt-2 text-center">
                                            Welcome to Caratree
                                        </h4>
                                        <div className="centered-container">
                                            <img
                                                src="../assets/images/logo-2.svg"
                                                alt="logo"
                                                className="login-logo"
                                            />
                                        </div>



                                        <Form className="form-horizontal" onSubmit={handleSubmit}>
                                            <Row>
                                                <Col md={12}>
                                                    <div className="mb-4">
                                                        <label className="form-label" htmlFor="username">
                                                            Email
                                                        </label>
                                                        <input
                                                            type="email"
                                                            className="form-control"
                                                            id="username"
                                                            placeholder="Enter email"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="mb-4">
                                                        <label className="form-label" htmlFor="userpassword">
                                                            Password
                                                        </label>
                                                        <input
                                                            type="password"
                                                            className="form-control"
                                                            id="userpassword"
                                                            placeholder="Enter password"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                        />
                                                    </div>

                                                    <Row>
                                                        <Col>
                                                            <div className="form-check">
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    id="customControlInline"
                                                                />
                                                                <label
                                                                    className="form-label form-check-label"
                                                                    htmlFor="customControlInline"
                                                                >
                                                                    Remember me
                                                                </label>
                                                            </div>
                                                        </Col>

                                                    </Row>

                                                    <div className="d-grid mt-4">
                                                        <button
                                                            className="btn btn-primary waves-effect waves-light"
                                                            type="submit"
                                                            disabled={loading}
                                                        >
                                                            {loading ? 'Logging in...' : 'Log In'}
                                                        </button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Login;
