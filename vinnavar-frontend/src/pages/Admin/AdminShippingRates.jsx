import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../services/api";
import Swal from "sweetalert2";

const AdminShippingRates = () => {
    const [rateType, setRateType] = useState("FORWARD");
    const [rates, setRates] = useState([]);
    const [, setConfigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchWeight, setSearchWeight] = useState("");
    const [editingRate, setEditingRate] = useState(null);

    const [codFixed, setCodFixed] = useState("30.0");
    const [codVar, setCodVar] = useState("1.5");
    const [isSavingConfig, setIsSavingConfig] = useState(false);

    const fetchRates = async (type) => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/admin/shipping/rates?type=${type}`);
            if (res.ok) {
                const data = await res.json();
                setRates(data);
            }
        } catch (err) {
            console.error("Error loading shipping rates", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchConfigs = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/admin/shipping/configs`);
            if (res.ok) {
                const data = await res.json();
                setConfigs(data);
                const fixedObj = data.find(c => c.configKey === "COD Fixed");
                if (fixedObj) setCodFixed(fixedObj.configValue);
                const varObj = data.find(c => c.configKey === "COD Variable (%)");
                if (varObj) setCodVar(varObj.configValue);
            }
        } catch (err) {
            console.error("Error loading shipping configs", err);
        }
    };

    useEffect(() => {
        fetchRates(rateType);
        fetchConfigs();
    }, [rateType]);

    const handleSaveRate = async (rateObj) => {
        try {
            const res = await fetch(`${API_BASE_URL}/admin/shipping/rates/${rateObj.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(rateObj)
            });
            if (res.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Rate Updated",
                    text: `Updated shipping rate for ${rateObj.weightKg} kg slab!`,
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 2000
                });
                setEditingRate(null);
                fetchRates(rateType);
            } else {
                Swal.fire("Error", "Failed to update shipping rate.", "error");
            }
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };

    const handleSaveCodConfigs = async () => {
        try {
            setIsSavingConfig(true);
            await fetch(`${API_BASE_URL}/admin/shipping/configs`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ configKey: "COD Fixed", configValue: codFixed })
            });
            await fetch(`${API_BASE_URL}/admin/shipping/configs`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ configKey: "COD Variable (%)", configValue: codVar })
            });

            Swal.fire("Success", "COD Shipping settings updated successfully!", "success");
            fetchConfigs();
        } catch (err) {
            Swal.fire("Error", "Failed to update COD settings", "error");
        } finally {
            setIsSavingConfig(false);
        }
    };

    const handleReseedExcel = async () => {
        const confirm = await Swal.fire({
            title: "Reseed Rate Cards?",
            text: "This will re-import and overwrite shipping rates from SWA-IN-OA.xlsx file.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Reseed Rates",
            confirmButtonColor: "#047857"
        });

        if (confirm.isConfirmed) {
            try {
                const res = await fetch(`${API_BASE_URL}/admin/shipping/reseed`, { method: "POST" });
                if (res.ok) {
                    Swal.fire("Reseeded!", "Rates and configurations successfully updated from Excel file.", "success");
                    fetchRates(rateType);
                    fetchConfigs();
                }
            } catch (err) {
                Swal.fire("Error", "Reseed failed", "error");
            }
        }
    };

    const filteredRates = rates.filter(r => {
        if (!searchWeight) return true;
        return String(r.weightKg).includes(searchWeight.trim());
    });

    return (
        <div className="container-fluid p-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                <div>
                    <h3 className="fw-bold text-dark mb-1">🚚 Shipping Rates & Zone Management</h3>
                    <p className="text-muted mb-0">View, search, and adjust weight-based shipping rate cards and COD fees.</p>
                </div>
                <button className="btn btn-outline-success fw-bold d-flex align-items-center gap-2" onClick={handleReseedExcel}>
                    <span>📊</span> Re-import from Excel
                </button>
            </div>

            {/* COD Config Card */}
            <div className="card shadow-sm border-0 mb-4 rounded-4" style={{ backgroundColor: "#f8fafc" }}>
                <div className="card-body p-4">
                    <h5 className="fw-bold text-success mb-3 d-flex align-items-center gap-2">
                        <span>💵</span> Cash On Delivery (COD) Fee Configuration
                    </h5>
                    <div className="row g-3 align-items-end">
                        <div className="col-md-4">
                            <label className="form-label fw-bold text-secondary">Fixed COD Fee (₹)</label>
                            <div className="input-group">
                                <span className="input-group-text bg-white">₹</span>
                                <input
                                    type="number"
                                    step="0.5"
                                    className="form-control"
                                    value={codFixed}
                                    onChange={(e) => setCodFixed(e.target.value)}
                                    placeholder="30.0"
                                />
                            </div>
                            <small className="text-muted">Applied on every COD order</small>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-bold text-secondary">Variable COD Fee (%)</label>
                            <div className="input-group">
                                <input
                                    type="number"
                                    step="0.1"
                                    className="form-control"
                                    value={codVar}
                                    onChange={(e) => setCodVar(e.target.value)}
                                    placeholder="1.5"
                                />
                                <span className="input-group-text bg-white">%</span>
                            </div>
                            <small className="text-muted">Calculated on subtotal (optional)</small>
                        </div>
                        <div className="col-md-4">
                            <button
                                className="btn btn-success fw-bold w-100 py-2"
                                onClick={handleSaveCodConfigs}
                                disabled={isSavingConfig}
                            >
                                {isSavingConfig ? "Saving Settings..." : "Save COD Settings"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rate Card Tabs & Filter */}
            <div className="card shadow-sm border-0 rounded-4">
                <div className="card-header bg-white p-3 border-0 d-flex flex-wrap justify-content-between align-items-center gap-3">
                    <div className="btn-group p-1 bg-light rounded-3" role="group">
                        <button
                            type="button"
                            className={`btn fw-bold rounded-2 px-4 ${rateType === "FORWARD" ? "btn-success shadow-sm" : "btn-light text-secondary"}`}
                            onClick={() => setRateType("FORWARD")}
                        >
                            Forward Shipping Rates
                        </button>
                        <button
                            type="button"
                            className={`btn fw-bold rounded-2 px-4 ${rateType === "REVERSE" ? "btn-success shadow-sm" : "btn-light text-secondary"}`}
                            onClick={() => setRateType("REVERSE")}
                        >
                            Reverse (Return) Rates
                        </button>
                    </div>

                    <div style={{ maxWidth: "250px" }}>
                        <input
                            type="text"
                            className="form-control form-control-sm rounded-3 px-3"
                            placeholder="🔍 Search weight (e.g. 4.0)..."
                            value={searchWeight}
                            onChange={(e) => setSearchWeight(e.target.value)}
                        />
                    </div>
                </div>

                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-success" role="status"></div>
                            <p className="text-muted mt-2">Loading shipping rate slabs...</p>
                        </div>
                    ) : (
                        <div className="table-responsive" style={{ maxHeight: "600px" }}>
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light sticky-top shadow-sm">
                                    <tr>
                                        <th className="px-3">Weight (kg)</th>
                                        <th>Local (TN)</th>
                                        <th>Regional (South)</th>
                                        <th>Metro</th>
                                        <th>National</th>
                                        <th>Remote</th>
                                        <th className="text-center px-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRates.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center py-4 text-muted">
                                                No rate slabs found for "{searchWeight}".
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredRates.map((rate) => {
                                            const isEditing = editingRate && editingRate.id === rate.id;
                                            const activeRow = isEditing ? editingRate : rate;

                                            return (
                                                <tr key={rate.id}>
                                                    <td className="px-3 fw-bold text-dark">
                                                        {rate.weightKg} {rate.unit}
                                                    </td>
                                                    <td>
                                                        {isEditing ? (
                                                            <input
                                                                type="number"
                                                                step="0.5"
                                                                className="form-control form-control-sm"
                                                                value={activeRow.localRate}
                                                                onChange={(e) => setEditingRate({ ...activeRow, localRate: e.target.value })}
                                                            />
                                                        ) : (
                                                            `₹${rate.localRate}`
                                                        )}
                                                    </td>
                                                    <td>
                                                        {isEditing ? (
                                                            <input
                                                                type="number"
                                                                step="0.5"
                                                                className="form-control form-control-sm"
                                                                value={activeRow.regionalRate}
                                                                onChange={(e) => setEditingRate({ ...activeRow, regionalRate: e.target.value })}
                                                            />
                                                        ) : (
                                                            `₹${rate.regionalRate}`
                                                        )}
                                                    </td>
                                                    <td>
                                                        {isEditing ? (
                                                            <input
                                                                type="number"
                                                                step="0.5"
                                                                className="form-control form-control-sm"
                                                                value={activeRow.metroRate}
                                                                onChange={(e) => setEditingRate({ ...activeRow, metroRate: e.target.value })}
                                                            />
                                                        ) : (
                                                            `₹${rate.metroRate}`
                                                        )}
                                                    </td>
                                                    <td>
                                                        {isEditing ? (
                                                            <input
                                                                type="number"
                                                                step="0.5"
                                                                className="form-control form-control-sm"
                                                                value={activeRow.nationalRate}
                                                                onChange={(e) => setEditingRate({ ...activeRow, nationalRate: e.target.value })}
                                                            />
                                                        ) : (
                                                            `₹${rate.nationalRate}`
                                                        )}
                                                    </td>
                                                    <td>
                                                        {isEditing ? (
                                                            <input
                                                                type="number"
                                                                step="0.5"
                                                                className="form-control form-control-sm"
                                                                value={activeRow.remoteRate}
                                                                onChange={(e) => setEditingRate({ ...activeRow, remoteRate: e.target.value })}
                                                            />
                                                        ) : (
                                                            `₹${rate.remoteRate}`
                                                        )}
                                                    </td>
                                                    <td className="text-center px-3">
                                                        {isEditing ? (
                                                            <div className="btn-group btn-group-sm">
                                                                <button
                                                                    className="btn btn-success"
                                                                    onClick={() => handleSaveRate(editingRate)}
                                                                >
                                                                    Save
                                                                </button>
                                                                <button
                                                                    className="btn btn-secondary"
                                                                    onClick={() => setEditingRate(null)}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                className="btn btn-sm btn-outline-primary fw-bold"
                                                                onClick={() => setEditingRate({ ...rate })}
                                                            >
                                                                ✏️ Edit
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminShippingRates;
