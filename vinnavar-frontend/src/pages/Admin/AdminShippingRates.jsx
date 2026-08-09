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
            confirmButtonColor: "#059669"
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        <span>🚚</span> Shipping Rates & Zone Management
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">View, search, and adjust weight-based shipping rate cards and COD fees</p>
                </div>
                <button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all flex items-center gap-2"
                    onClick={handleReseedExcel}
                >
                    <span>📊</span> Re-import from Excel
                </button>
            </div>

            {/* COD Config Card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <h3 className="font-extrabold text-emerald-800 text-sm flex items-center gap-2">
                    <span>💵</span> Cash On Delivery (COD) Fee Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Fixed COD Fee (₹)</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-slate-400">₹</span>
                            <input
                                type="number"
                                step="0.5"
                                className="w-full pl-7 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                                value={codFixed}
                                onChange={(e) => setCodFixed(e.target.value)}
                                placeholder="30.0"
                            />
                        </div>
                        <span className="text-[11px] text-slate-400 mt-1 block">Applied on every COD order</span>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Variable COD Fee (%)</label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.1"
                                className="w-full pl-3.5 pr-7 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                                value={codVar}
                                onChange={(e) => setCodVar(e.target.value)}
                                placeholder="1.5"
                            />
                            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-bold text-slate-400">%</span>
                        </div>
                        <span className="text-[11px] text-slate-400 mt-1 block">Calculated on subtotal (optional)</span>
                    </div>
                    <div>
                        <button
                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all disabled:opacity-50"
                            onClick={handleSaveCodConfigs}
                            disabled={isSavingConfig}
                        >
                            {isSavingConfig ? "Saving Settings..." : "Save COD Settings"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Rate Card Tabs & Filter */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden space-y-4">
                <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="bg-slate-200/80 p-1 rounded-xl flex items-center gap-1 shadow-inner">
                        <button
                            type="button"
                            className={`text-xs font-bold px-4 py-1.5 rounded-lg transition-all ${
                                rateType === "FORWARD"
                                    ? "bg-white text-emerald-800 shadow-sm"
                                    : "text-slate-600 hover:text-slate-900"
                            }`}
                            onClick={() => setRateType("FORWARD")}
                        >
                            Forward Shipping Rates
                        </button>
                        <button
                            type="button"
                            className={`text-xs font-bold px-4 py-1.5 rounded-lg transition-all ${
                                rateType === "REVERSE"
                                    ? "bg-white text-emerald-800 shadow-sm"
                                    : "text-slate-600 hover:text-slate-900"
                            }`}
                            onClick={() => setRateType("REVERSE")}
                        >
                            Reverse (Return) Rates
                        </button>
                    </div>

                    <div className="w-56">
                        <input
                            type="text"
                            className="w-full px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                            placeholder="🔍 Search weight (e.g. 4.0)..."
                            value={searchWeight}
                            onChange={(e) => setSearchWeight(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-xs text-slate-500 font-bold mt-2">Loading shipping rate slabs...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs font-bold font-mono uppercase tracking-wider">
                                    <th className="py-3.5 px-4">Weight (kg)</th>
                                    <th className="py-3.5 px-4">Local (TN)</th>
                                    <th className="py-3.5 px-4">Regional (South)</th>
                                    <th className="py-3.5 px-4">Metro</th>
                                    <th className="py-3.5 px-4">National</th>
                                    <th className="py-3.5 px-4">Remote</th>
                                    <th className="py-3.5 px-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {filteredRates.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="py-8 text-center text-slate-500 font-medium">
                                            No rate slabs found for "{searchWeight}".
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRates.map((rate) => {
                                        const isEditing = editingRate && editingRate.id === rate.id;
                                        const activeRow = isEditing ? editingRate : rate;

                                        return (
                                            <tr key={rate.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="py-3 px-4 font-mono font-bold text-slate-900">
                                                    {rate.weightKg} {rate.unit}
                                                </td>
                                                <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                                                    {isEditing ? (
                                                        <input
                                                            type="number"
                                                            step="0.5"
                                                            className="w-20 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold"
                                                            value={activeRow.localRate}
                                                            onChange={(e) => setEditingRate({ ...activeRow, localRate: e.target.value })}
                                                        />
                                                    ) : (
                                                        `₹${rate.localRate}`
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                                                    {isEditing ? (
                                                        <input
                                                            type="number"
                                                            step="0.5"
                                                            className="w-20 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold"
                                                            value={activeRow.regionalRate}
                                                            onChange={(e) => setEditingRate({ ...activeRow, regionalRate: e.target.value })}
                                                        />
                                                    ) : (
                                                        `₹${rate.regionalRate}`
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                                                    {isEditing ? (
                                                        <input
                                                            type="number"
                                                            step="0.5"
                                                            className="w-20 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold"
                                                            value={activeRow.metroRate}
                                                            onChange={(e) => setEditingRate({ ...activeRow, metroRate: e.target.value })}
                                                        />
                                                    ) : (
                                                        `₹${rate.metroRate}`
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                                                    {isEditing ? (
                                                        <input
                                                            type="number"
                                                            step="0.5"
                                                            className="w-20 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold"
                                                            value={activeRow.nationalRate}
                                                            onChange={(e) => setEditingRate({ ...activeRow, nationalRate: e.target.value })}
                                                        />
                                                    ) : (
                                                        `₹${rate.nationalRate}`
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                                                    {isEditing ? (
                                                        <input
                                                            type="number"
                                                            step="0.5"
                                                            className="w-20 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold"
                                                            value={activeRow.remoteRate}
                                                            onChange={(e) => setEditingRate({ ...activeRow, remoteRate: e.target.value })}
                                                        />
                                                    ) : (
                                                        `₹${rate.remoteRate}`
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    {isEditing ? (
                                                        <div className="flex items-center justify-center gap-1.5">
                                                            <button
                                                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-2.5 py-1 rounded-lg"
                                                                onClick={() => handleSaveRate(editingRate)}
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-2.5 py-1 rounded-lg border border-slate-200"
                                                                onClick={() => setEditingRate(null)}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-300 transition-all shadow-xs"
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminShippingRates;
