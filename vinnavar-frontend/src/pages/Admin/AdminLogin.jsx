import React, { useState } from "react";
import { API_BASE_URL, getImageUrl } from "../../services/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AdminLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem("vinnavar_admin_token", data.token);
                localStorage.setItem("vinnavar_admin_user", data.username);

                Swal.fire({
                    icon: "success",
                    title: "Welcome Admin",
                    text: "Logged in successfully!",
                    timer: 1500,
                    showConfirmButton: false
                });

                navigate("/admin");
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Authentication Failed",
                    text: "Invalid username or password"
                });
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Server Error",
                text: "Unable to connect to backend server."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="d-flex align-items-center justify-content-center min-vh-100"
            style={{
                background: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)",
                width: "100vw",
                height: "100vh",
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 9999
            }}
        >
            <div className="card shadow-lg border-0 rounded-4" style={{ width: "100%", maxWidth: "420px" }}>
                <div className="card-body p-4 p-md-5">
                    <div className="text-center mb-4">
                        <img src={getImageUrl("/media/site/vinnavar_logo.png")} alt="Vinnavar Logo" style={{ height: "70px", objectFit: "contain" }} className="mb-2" />
                        <h4 className="fw-bold text-success mb-1">Vinnavar Organics</h4>
                        <p className="text-muted small">Admin Control Panel Login</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-bold text-dark">Username</label>
                            <input
                                type="text"
                                className="form-control form-control-lg fs-6"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label fw-bold text-dark">Password</label>
                            <input
                                type="password"
                                className="form-control form-control-lg fs-6"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-success btn-lg w-100 fw-bold fs-6 shadow-sm"
                            disabled={loading}
                            style={{ backgroundColor: "#2d6a4f", borderColor: "#2d6a4f" }}
                        >
                            {loading ? "Authenticating..." : "Login to Admin Portal"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
