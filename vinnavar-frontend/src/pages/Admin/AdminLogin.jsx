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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 p-4 font-sans">
            {/* Background Decorative Glow Blobs */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-10 shadow-2xl shadow-emerald-950/40 border border-white/20 relative z-10">
                {/* Brand Header */}
                <div className="text-center mb-8">
                    <img
                        src={getImageUrl("/logo_vinnavar.webp")}
                        alt="Vinnavar Logo"
                        className="h-20 w-auto mx-auto object-contain mb-3 drop-shadow-md"
                    />
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Vinnavar Organics</h1>
                    <p className="text-xs text-slate-500 font-semibold mt-1 uppercase tracking-wider font-mono">
                        Admin Control Panel
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all duration-200"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all duration-200"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Authenticating...</span>
                            </>
                        ) : (
                            <span>Login to Admin Portal &rarr;</span>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-slate-100 pt-4">
                    <p className="text-[11px] text-slate-400 font-medium">Vinnavar Organic E-Commerce &copy; {new Date().getFullYear()}</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
