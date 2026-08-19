import React, { useState } from "react";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../../services/api";

const getOrderStatusBadge = (status) => {
    switch (status) {
        case "PENDING":
            return <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-800 border border-amber-500/20 px-2.5 py-1 text-xs font-bold rounded-full shadow-xs">⏳ PENDING</span>;
        case "CONFIRMED":
            return <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-800 border border-blue-500/20 px-2.5 py-1 text-xs font-bold rounded-full shadow-xs">✅ CONFIRMED</span>;
        case "PROCESSING":
            return <span className="inline-flex items-center gap-1 bg-cyan-500/10 text-cyan-800 border border-cyan-500/20 px-2.5 py-1 text-xs font-bold rounded-full shadow-xs">⚙️ PROCESSING</span>;
        case "SHIPPED":
            return <span className="inline-flex items-center gap-1 bg-purple-500/10 text-purple-800 border border-purple-500/20 px-2.5 py-1 text-xs font-bold rounded-full shadow-xs">🚚 SHIPPED</span>;
        case "OUT_FOR_DELIVERY":
            return <span className="inline-flex items-center gap-1 bg-orange-500/10 text-orange-800 border border-orange-500/20 px-2.5 py-1 text-xs font-bold rounded-full shadow-xs">🛵 OUT FOR DELIVERY</span>;
        case "DELIVERED":
            return <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 px-2.5 py-1 text-xs font-bold rounded-full shadow-xs">🎉 DELIVERED</span>;
        case "CANCELLATION_REQUESTED":
            return <span className="inline-flex items-center gap-1 bg-fuchsia-500/10 text-fuchsia-800 border border-fuchsia-500/20 px-2.5 py-1 text-xs font-bold rounded-full shadow-xs">🛑 CANCEL REQUESTED</span>;
        case "CANCELLED":
        case "FAILED":
            return <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-800 border border-rose-500/20 px-2.5 py-1 text-xs font-bold rounded-full shadow-xs">❌ CANCELLED</span>;
        case "REFUNDED":
            return <span className="inline-flex items-center gap-1 bg-teal-500/10 text-teal-800 border border-teal-500/20 px-2.5 py-1 text-xs font-bold rounded-full shadow-xs">💸 REFUNDED</span>;
        default:
            return <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 text-xs font-bold rounded-full">{status}</span>;
    }
};

const getPaymentBadge = (method) => {
    switch (method) {
        case "ONLINE":
        case "CARD":
        case "NETBANKING":
            return <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 font-mono border border-indigo-200 px-2.5 py-0.5 text-xs font-bold rounded-lg">💳 ONLINE</span>;
        case "COD":
            return <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 font-mono border border-amber-200 px-2.5 py-0.5 text-xs font-bold rounded-lg">💵 COD</span>;
        case "UPI":
            return <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 font-mono border border-emerald-200 px-2.5 py-0.5 text-xs font-bold rounded-lg">📱 UPI</span>;
        default:
            return <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 font-mono border border-slate-200 px-2.5 py-0.5 text-xs font-bold rounded-lg">{method || "ONLINE"}</span>;
    }
};

const AdminOrders = ({ orders, loadData }) => {
    const [selectedOrderModal, setSelectedOrderModal] = useState(null);
    const [editOrderModal, setEditOrderModal] = useState(null);
    const [shippingFeeInputs, setShippingFeeInputs] = useState({});

    const [editOrderForm, setEditOrderForm] = useState({
        orderStatus: "CONFIRMED",
        paymentMethod: "COD",
        paymentStatus: "PENDING",
        courierName: "",
        trackingNumber: "",
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        totalAmount: "",
        shippingFee: "",
        streetAddress: "",
        city: "",
        state: "",
        pincode: "",
        gstin: ""
    });

    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [sameAsShippingEdit, setSameAsShippingEdit] = useState(true);
    const [editShippingAddress, setEditShippingAddress] = useState({ fullName: "", phone: "", streetAddress: "", city: "", state: "Tamil Nadu", pincode: "" });
    const [editBillingAddress, setEditBillingAddress] = useState({ fullName: "", phone: "", streetAddress: "", city: "", state: "Tamil Nadu", pincode: "" });
    const [editGstin, setEditGstin] = useState("");

    const handleOrderStatusChange = async (orderId, newStatus) => {
        try {
            const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status?status=${newStatus}`, {
                method: "PUT"
            });
            if (res.ok) {
                Swal.fire({ icon: "success", title: "Order Status Updated", timer: 1500, showConfirmButton: false });
                loadData();
            }
        } catch (err) {
            Swal.fire("Error", "Failed to update order status", "error");
        }
    };

    const handleOrderTrackingUpdate = async (orderId, courierName, trackingNumber) => {
        try {
            const params = new URLSearchParams();
            if (courierName) params.append("courierName", courierName);
            if (trackingNumber) params.append("trackingNumber", trackingNumber);
            const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/tracking?${params.toString()}`, {
                method: "PUT"
            });
            if (res.ok) {
                Swal.fire({ icon: "success", title: "Logistics & Tracking Updated", timer: 1500, showConfirmButton: false });
                loadData();
            }
        } catch (err) {
            Swal.fire("Error", "Failed to update tracking info", "error");
        }
    };

    const handleOrderShippingFeeUpdate = async (orderId, feeVal) => {
        if (feeVal === undefined || feeVal === null || feeVal === "") return;
        try {
            const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/shipping-fee?shippingFee=${feeVal}`, {
                method: "PUT"
            });
            if (res.ok) {
                Swal.fire({ icon: "success", title: "Shipping Charges Saved 🚚", timer: 1500, showConfirmButton: false });
                loadData();
            } else {
                Swal.fire("Error", "Failed to save shipping charges", "error");
            }
        } catch (err) {
            Swal.fire("Error", "Failed to connect to backend", "error");
        }
    };

    const handleOpenEditOrder = (order) => {
        setEditOrderModal(order);
        setEditOrderForm({
            orderStatus: order.orderStatus || "CONFIRMED",
            paymentMethod: order.paymentMethod || "COD",
            paymentStatus: order.paymentStatus || "PENDING",
            courierName: order.courierName || "",
            trackingNumber: order.trackingNumber || "",
            customerName: order.customerName || "",
            customerPhone: order.customerPhone || "",
            customerEmail: order.customerEmail || "",
            totalAmount: order.totalAmount || "",
            shippingFee: order.shippingFee != null ? order.shippingFee : "",
            streetAddress: order.shippingAddress?.streetAddress || "",
            city: order.shippingAddress?.city || "",
            state: order.shippingAddress?.state || "",
            pincode: order.shippingAddress?.pincode || "",
            gstin: order.gstin || ""
        });
    };

    const handleSaveOrderEdits = async (e) => {
        e.preventDefault();
        if (!editOrderModal) return;

        const payload = {
            orderStatus: editOrderForm.orderStatus,
            paymentMethod: editOrderForm.paymentMethod,
            paymentStatus: editOrderForm.paymentStatus,
            courierName: editOrderForm.courierName,
            trackingNumber: editOrderForm.trackingNumber,
            customerName: editOrderForm.customerName,
            customerPhone: editOrderForm.customerPhone,
            customerEmail: editOrderForm.customerEmail,
            totalAmount: editOrderForm.totalAmount ? parseFloat(editOrderForm.totalAmount) : null,
            shippingFee: editOrderForm.shippingFee ? parseFloat(editOrderForm.shippingFee) : null,
            shippingAddress: {
                fullName: editOrderForm.customerName,
                phone: editOrderForm.customerPhone,
                streetAddress: editOrderForm.streetAddress,
                city: editOrderForm.city,
                state: editOrderForm.state,
                pincode: editOrderForm.pincode
            },
            gstin: editOrderForm.gstin
        };

        try {
            const res = await fetch(`${API_BASE_URL}/admin/orders/${editOrderModal.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                Swal.fire({ icon: "success", title: "Order Details Updated!", timer: 1500, showConfirmButton: false });
                setEditOrderModal(null);
                loadData();
            } else {
                Swal.fire({ icon: "error", title: "Update Failed", text: "Could not update order details." });
            }
        } catch (err) {
            Swal.fire({ icon: "error", title: "Server Error", text: "Failed to connect to server." });
        }
    };

    const handleDownloadBill = async (orderNumber) => {
        try {
            const res = await fetch(`${API_BASE_URL}/orders/download-pdf?orderNumber=${encodeURIComponent(orderNumber)}`);
            if (!res.ok) {
                Swal.fire("Error", "Failed to generate PDF invoice", "error");
                return;
            }
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Bill-${orderNumber}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Error downloading bill PDF", err);
            Swal.fire("Error", "Failed to download bill PDF", "error");
        }
    };

    const handleDeleteOrder = async (orderId, orderNumber) => {
        const result = await Swal.fire({
            title: `Delete Order ${orderNumber}?`,
            text: "Are you sure you want to delete this order? This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e11d48",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
                    method: "DELETE"
                });
                if (res.ok) {
                    Swal.fire("Deleted!", `Order ${orderNumber} has been deleted.`, "success");
                    loadData();
                } else {
                    Swal.fire("Error", "Failed to delete order.", "error");
                }
            } catch (err) {
                console.error("Error deleting order:", err);
                Swal.fire("Error", "Failed to connect to server.", "error");
            }
        }
    };

    const handleRefundOrder = async (orderId, totalAmount) => {
        const result = await Swal.fire({
            title: `Refund Order?`,
            text: `Are you sure you want to issue a refund via Razorpay? Total order amount is ₹${totalAmount}.`,
            icon: "warning",
            input: "number",
            inputLabel: "Refund Amount (Leave empty for full refund)",
            inputPlaceholder: "e.g. 500",
            inputAttributes: { step: "0.01", min: "1", max: totalAmount },
            showCancelButton: true,
            confirmButtonColor: "#e11d48",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Issue Refund"
        });

        if (result.isConfirmed) {
            try {
                const amount = result.value ? parseFloat(result.value) : null;
                const url = new URL(`${API_BASE_URL}/admin/orders/${orderId}/refund`);
                if (amount) {
                    url.searchParams.append("amount", amount);
                }
                const res = await fetch(url.toString(), { method: "POST" });
                if (res.ok) {
                    Swal.fire("Refunded!", "Refund processed successfully via Razorpay.", "success");
                    loadData();
                } else {
                    Swal.fire("Error", "Failed to issue refund. Check backend logs.", "error");
                }
            } catch (err) {
                console.error("Error refunding order:", err);
                Swal.fire("Error", "Failed to connect to server.", "error");
            }
        }
    };

    const openAddressEdit = (order) => {
        const ship = order.shippingAddress || {};
        const bill = order.billingAddress || {};
        setEditShippingAddress({
            fullName: ship.fullName || order.customerName || "",
            phone: ship.phone || order.customerPhone || "",
            streetAddress: ship.streetAddress || "",
            city: ship.city || "",
            state: ship.state || "Tamil Nadu",
            pincode: ship.pincode || ""
        });
        setEditBillingAddress({
            fullName: bill.fullName || ship.fullName || order.customerName || "",
            phone: bill.phone || ship.phone || order.customerPhone || "",
            streetAddress: bill.streetAddress || ship.streetAddress || "",
            city: bill.city || ship.city || "",
            state: bill.state || ship.state || "Tamil Nadu",
            pincode: bill.pincode || ship.pincode || ""
        });
        setEditGstin(order.gstin || "");
        setSameAsShippingEdit(true);
        setIsEditingAddress(true);
    };

    const handleSaveOrderAddress = async () => {
        if (!selectedOrderModal) return;
        const activeBilling = sameAsShippingEdit ? editShippingAddress : editBillingAddress;
        try {
            const res = await fetch(`${API_BASE_URL}/admin/orders/${selectedOrderModal.id}/address`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    shippingAddress: editShippingAddress,
                    billingAddress: activeBilling,
                    gstin: editGstin
                })
            });
            if (res.ok) {
                const updatedOrder = await res.json();
                setSelectedOrderModal(updatedOrder);
                setIsEditingAddress(false);
                Swal.fire({ icon: "success", title: "Address Details Saved 🎉", timer: 1500, showConfirmButton: false });
                loadData();
            } else {
                Swal.fire("Error", "Failed to save address details", "error");
            }
        } catch (err) {
            Swal.fire("Error", "Failed to update address", "error");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        <span>🚚</span> Customer Order Processing
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Manage customer orders, shipping fees, logistics & PDF invoices</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1200px]">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs font-bold font-mono uppercase tracking-wider whitespace-nowrap">
                                <th className="py-3.5 px-4">Order #</th>
                                <th className="py-3.5 px-4">Customer</th>
                                <th className="py-3.5 px-4">Items</th>
                                <th className="py-3.5 px-4">Logistics & Tracking</th>
                                <th className="py-3.5 px-4">Shipping Fee</th>
                                <th className="py-3.5 px-4">Total Amount</th>
                                <th className="py-3.5 px-4">Payment</th>
                                <th className="py-3.5 px-4">Razorpay ID</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-4">Update Status</th>
                                <th className="py-3.5 px-4">Full Details</th>
                                <th className="py-3.5 px-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="11" className="py-8 text-center text-slate-500 font-medium">
                                        No customer orders placed yet.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((o) => (
                                    <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="py-3 px-4 font-mono font-bold text-emerald-700 whitespace-nowrap">{o.orderNumber}</td>
                                        <td className="py-3 px-4 min-w-[200px]">
                                            <div className="font-bold text-slate-900">{o.customerName}</div>
                                            <div className="text-xs text-slate-500 font-medium">{o.customerPhone} | {o.customerEmail}</div>
                                            <div className="text-xs text-slate-400 truncate max-w-xs">{o.shippingAddress?.streetAddress}, {o.shippingAddress?.city}</div>
                                        </td>
                                        <td className="py-3 px-4 min-w-[200px] text-xs">
                                            {o.items?.map((item, idx) => (
                                                <div key={idx} className="text-slate-600">
                                                    • <span className="font-semibold text-slate-800">{item.productName}</span> ({item.variantName}) x{item.quantity} = ₹{item.totalPrice}
                                                </div>
                                            ))}
                                        </td>
                                        <td className="py-3 px-4 min-w-[160px]">
                                            {o.courierName ? (
                                                <div>
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md mb-1">
                                                        📦 {o.courierName}
                                                    </span>
                                                    {o.trackingNumber && (
                                                        <div className="text-xs font-mono font-bold text-slate-700">
                                                            AWB: {o.trackingNumber}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 text-xs italic">Not assigned</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs text-slate-400 font-bold">₹</span>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className="w-20 px-2 py-1 bg-slate-50 border border-emerald-300 rounded-lg text-xs font-mono font-bold text-emerald-700 focus:ring-2 focus:ring-emerald-500"
                                                    value={shippingFeeInputs[o.id] !== undefined ? shippingFeeInputs[o.id] : (o.shippingFee != null ? o.shippingFee : "")}
                                                    onChange={(e) => setShippingFeeInputs({ ...shippingFeeInputs, [o.id]: e.target.value })}
                                                    placeholder="0.00"
                                                />
                                                <button
                                                    type="button"
                                                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 p-1 rounded-lg border border-emerald-200 font-bold text-xs"
                                                    onClick={() => handleOrderShippingFeeUpdate(o.id, shippingFeeInputs[o.id] !== undefined ? shippingFeeInputs[o.id] : o.shippingFee)}
                                                    title="Save Shipping Charge"
                                                >
                                                    💾
                                                </button>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">₹{o.totalAmount}</td>
                                        <td className="py-3 px-4 whitespace-nowrap">{getPaymentBadge(o.paymentMethod)}</td>
                                        <td className="py-3 px-4 font-mono text-xs text-slate-600 whitespace-nowrap">{o.razorpayPaymentId || '-'}</td>
                                        <td className="py-3 px-4 whitespace-nowrap">{getOrderStatusBadge(o.orderStatus)}</td>
                                        <td className="py-3 px-4 whitespace-nowrap">
                                            <select
                                                className="px-2.5 py-1 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                                                value={o.orderStatus}
                                                onChange={(e) => handleOrderStatusChange(o.id, e.target.value)}
                                            >
                                                <option value="CONFIRMED">CONFIRMED</option>
                                                <option value="PROCESSING">PROCESSING</option>
                                                <option value="SHIPPED">SHIPPED</option>
                                                <option value="DELIVERED">DELIVERED</option>
                                                <option value="CANCELLATION_REQUESTED">CANCEL REQUESTED</option>
                                                <option value="CANCELLED">CANCELLED</option>
                                                <option value="REFUNDED">REFUNDED</option>
                                            </select>
                                        </td>
                                        <td className="py-3 px-4 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    type="button"
                                                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-2.5 py-1 rounded-lg border border-slate-300 transition-all"
                                                    onClick={() => setSelectedOrderModal(o)}
                                                >
                                                    👁️ View Details
                                                </button>
                                                <button
                                                    type="button"
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-2.5 py-1 rounded-lg shadow-xs transition-all"
                                                    onClick={() => handleDownloadBill(o.orderNumber)}
                                                >
                                                    📄 Bill PDF
                                                </button>
                                                {o.paymentMethod === "ONLINE" && (!o.paymentStatus || !o.paymentStatus.includes("REFUND")) && (
                                                    <button
                                                        type="button"
                                                        className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-2.5 py-1 rounded-lg shadow-xs transition-all"
                                                        onClick={() => handleRefundOrder(o.id, o.totalAmount)}
                                                        title="Refund Payment via Razorpay"
                                                    >
                                                        💸 Refund
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-center whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <button
                                                    type="button"
                                                    className="w-8 h-8 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center font-bold text-xs transition-all"
                                                    onClick={() => handleOpenEditOrder(o)}
                                                    title="Edit Order Details"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    type="button"
                                                    className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-center font-bold text-xs transition-all"
                                                    onClick={() => handleDeleteOrder(o.id, o.orderNumber)}
                                                    title="Delete Order"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL: VIEW ORDER & CUSTOMER FULL DETAILS */}
            {selectedOrderModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full border border-slate-100 my-8 overflow-hidden">
                        <div className="bg-emerald-700 text-white px-6 py-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-extrabold flex items-center gap-2">
                                    <span>📄</span> Order Details: <span className="font-mono text-amber-300">{selectedOrderModal.orderNumber}</span>
                                </h3>
                                <p className="text-xs text-emerald-100 font-medium mt-0.5">
                                    Placed on: {selectedOrderModal.createdAt ? new Date(selectedOrderModal.createdAt).toLocaleString("en-IN") : "N/A"}
                                </p>
                            </div>
                            <button
                                type="button"
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white font-bold transition-all"
                                onClick={() => setSelectedOrderModal(null)}
                            >
                                &times;
                            </button>
                        </div>

                        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto bg-slate-50 custom-scrollbar">
                            {/* Banner Card */}
                            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Order Status</span>
                                    {getOrderStatusBadge(selectedOrderModal.orderStatus)}
                                </div>
                                <div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Payment Method</span>
                                    {getPaymentBadge(selectedOrderModal.paymentMethod)}
                                </div>
                                <div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Amount</span>
                                    <span className="text-2xl font-black text-emerald-700 font-mono">₹{selectedOrderModal.totalAmount}</span>
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Update Status</label>
                                    <select
                                        className="px-3 py-1.5 bg-slate-50 border border-emerald-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                                        value={selectedOrderModal.orderStatus}
                                        onChange={(e) => {
                                            handleOrderStatusChange(selectedOrderModal.id, e.target.value);
                                            setSelectedOrderModal({ ...selectedOrderModal, orderStatus: e.target.value });
                                        }}
                                    >
                                        <option value="CONFIRMED">CONFIRMED</option>
                                        <option value="PROCESSING">PROCESSING</option>
                                        <option value="SHIPPED">SHIPPED</option>
                                        <option value="DELIVERED">DELIVERED</option>
                                        <option value="CANCELLED">CANCELLED</option>
                                    </select>
                                </div>
                            </div>

                            {/* Logistics Card */}
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                                <h4 className="font-bold text-emerald-800 text-sm flex items-center justify-between">
                                    <span>🚚 Logistics & Shipment Tracking</span>
                                    {selectedOrderModal.courierName && (
                                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-bold">
                                            {selectedOrderModal.courierName}
                                        </span>
                                    )}
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                                    <div className="sm:col-span-5">
                                        <label className="block text-xs font-bold text-slate-600 mb-1">Logistics / Courier Partner</label>
                                        <select
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                                            value={selectedOrderModal.courierName || ""}
                                            onChange={(e) => setSelectedOrderModal({ ...selectedOrderModal, courierName: e.target.value })}
                                        >
                                            <option value="">Select Logistics Partner</option>
                                            <option value="Amazon Shipping">Amazon Shipping</option>
                                            <option value="Xpressbees Courier">Xpressbees Courier</option>
                                            <option value="Delhivery Express">Delhivery Express</option>
                                            <option value="DTDC Express">DTDC Express</option>
                                            <option value="India Post">India Post</option>
                                            <option value="Blue Dart">Blue Dart</option>
                                            <option value="Other Courier">Other Courier</option>
                                        </select>
                                    </div>
                                    <div className="sm:col-span-5">
                                        <label className="block text-xs font-bold text-slate-600 mb-1">AWB / Tracking Number</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium focus:ring-2 focus:ring-emerald-500"
                                            placeholder="e.g. SF123456789IN"
                                            value={selectedOrderModal.trackingNumber || ""}
                                            onChange={(e) => setSelectedOrderModal({ ...selectedOrderModal, trackingNumber: e.target.value })}
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <button
                                            type="button"
                                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
                                            onClick={() => handleOrderTrackingUpdate(selectedOrderModal.id, selectedOrderModal.courierName, selectedOrderModal.trackingNumber)}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Profile Card */}
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                                <h4 className="font-bold text-emerald-800 text-sm">👤 Customer Profile Details</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                                    <div>
                                        <span className="text-slate-400 font-bold block mb-0.5">Customer Name</span>
                                        <span className="font-bold text-slate-900 text-sm">{selectedOrderModal.customerName}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 font-bold block mb-0.5">Mobile Phone</span>
                                        <span className="font-bold text-slate-800">📞 {selectedOrderModal.customerPhone}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 font-bold block mb-0.5">Email Address</span>
                                        <span className="font-bold text-slate-800">✉️ {selectedOrderModal.customerEmail || "N/A"}</span>
                                    </div>
                                    {selectedOrderModal.gstin && (
                                        <div className="sm:col-span-3 pt-2">
                                            <span className="text-slate-400 font-bold block mb-0.5">GSTIN Number</span>
                                            <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 inline-block">
                                                🏢 {selectedOrderModal.gstin}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Address Card */}
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-emerald-800 text-sm">📍 Order Shipping & Billing Addresses</h4>
                                    {!isEditingAddress ? (
                                        <button
                                            type="button"
                                            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg"
                                            onClick={() => openAddressEdit(selectedOrderModal)}
                                        >
                                            ✏️ Edit Addresses
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg"
                                            onClick={() => setIsEditingAddress(false)}
                                        >
                                            ❌ Cancel Edit
                                        </button>
                                    )}
                                </div>

                                {isEditingAddress ? (
                                    <form onSubmit={(e) => { e.preventDefault(); handleSaveOrderAddress(); }} className="space-y-4 text-xs">
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                                            <h5 className="font-bold text-emerald-800">🚚 Shipping Address</h5>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block font-bold text-slate-600 mb-1">Recipient Name *</label>
                                                    <input
                                                        type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg" required
                                                        value={editShippingAddress.fullName}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            setEditShippingAddress(prev => ({ ...prev, fullName: val }));
                                                            if (sameAsShippingEdit) setEditBillingAddress(prev => ({ ...prev, fullName: val }));
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block font-bold text-slate-600 mb-1">Phone Number *</label>
                                                    <input
                                                        type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg" required
                                                        value={editShippingAddress.phone}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            setEditShippingAddress(prev => ({ ...prev, phone: val }));
                                                            if (sameAsShippingEdit) setEditBillingAddress(prev => ({ ...prev, phone: val }));
                                                        }}
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label className="block font-bold text-slate-600 mb-1">Street Address *</label>
                                                    <textarea
                                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg" rows="2" required
                                                        value={editShippingAddress.streetAddress}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            setEditShippingAddress(prev => ({ ...prev, streetAddress: val }));
                                                            if (sameAsShippingEdit) setEditBillingAddress(prev => ({ ...prev, streetAddress: val }));
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block font-bold text-slate-600 mb-1">City *</label>
                                                    <input
                                                        type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg" required
                                                        value={editShippingAddress.city}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            setEditShippingAddress(prev => ({ ...prev, city: val }));
                                                            if (sameAsShippingEdit) setEditBillingAddress(prev => ({ ...prev, city: val }));
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block font-bold text-slate-600 mb-1">State *</label>
                                                    <input
                                                        type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg" required
                                                        value={editShippingAddress.state}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            setEditShippingAddress(prev => ({ ...prev, state: val }));
                                                            if (sameAsShippingEdit) setEditBillingAddress(prev => ({ ...prev, state: val }));
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block font-bold text-slate-600 mb-1">Pincode *</label>
                                                    <input
                                                        type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg" required
                                                        value={editShippingAddress.pincode}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            setEditShippingAddress(prev => ({ ...prev, pincode: val }));
                                                            if (sameAsShippingEdit) setEditBillingAddress(prev => ({ ...prev, pincode: val }));
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <label className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                                                checked={sameAsShippingEdit}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    setSameAsShippingEdit(checked);
                                                    if (checked) {
                                                        setEditBillingAddress({ ...editShippingAddress });
                                                    }
                                                }}
                                            />
                                            <span className="font-bold text-emerald-900 text-xs">
                                                ☑️ Billing address is same as shipping address (Autofilled)
                                            </span>
                                        </label>

                                        {!sameAsShippingEdit && (
                                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                                                <h5 className="font-bold text-emerald-800">💳 Billing Address</h5>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block font-bold text-slate-600 mb-1">Billing Name *</label>
                                                        <input
                                                            type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg" required
                                                            value={editBillingAddress.fullName}
                                                            onChange={(e) => setEditBillingAddress(prev => ({ ...prev, fullName: e.target.value }))}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block font-bold text-slate-600 mb-1">Billing Phone *</label>
                                                        <input
                                                            type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg" required
                                                            value={editBillingAddress.phone}
                                                            onChange={(e) => setEditBillingAddress(prev => ({ ...prev, phone: e.target.value }))}
                                                        />
                                                    </div>
                                                    <div className="sm:col-span-2">
                                                        <label className="block font-bold text-slate-600 mb-1">Billing Address *</label>
                                                        <textarea
                                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg" rows="2" required
                                                            value={editBillingAddress.streetAddress}
                                                            onChange={(e) => setEditBillingAddress(prev => ({ ...prev, streetAddress: e.target.value }))}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block font-bold text-slate-600 mb-1">City *</label>
                                                        <input
                                                            type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg" required
                                                            value={editBillingAddress.city}
                                                            onChange={(e) => setEditBillingAddress(prev => ({ ...prev, city: e.target.value }))}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block font-bold text-slate-600 mb-1">State *</label>
                                                        <input
                                                            type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg" required
                                                            value={editBillingAddress.state}
                                                            onChange={(e) => setEditBillingAddress(prev => ({ ...prev, state: e.target.value }))}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block font-bold text-slate-600 mb-1">Pincode *</label>
                                                        <input
                                                            type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg" required
                                                            value={editBillingAddress.pincode}
                                                            onChange={(e) => setEditBillingAddress(prev => ({ ...prev, pincode: e.target.value }))}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block font-bold text-slate-600 mb-1">GSTIN Number (Optional)</label>
                                            <input
                                                type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono" placeholder="e.g. 33AAAAA0000A1Z5"
                                                value={editGstin}
                                                onChange={(e) => setEditGstin(e.target.value)}
                                            />
                                        </div>

                                        <div className="flex items-center justify-end gap-2 pt-2">
                                            <button type="button" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl" onClick={() => setIsEditingAddress(false)}>
                                                Cancel
                                            </button>
                                            <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs">
                                                💾 Save Address Details
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                            <div className="font-bold text-emerald-800 mb-2">🚚 Shipping Address</div>
                                            {selectedOrderModal.shippingAddress && selectedOrderModal.shippingAddress.streetAddress ? (
                                                <div className="space-y-1">
                                                    <div className="font-bold text-slate-900">{selectedOrderModal.shippingAddress.fullName || selectedOrderModal.customerName}</div>
                                                    <div className="text-slate-600">{selectedOrderModal.shippingAddress.streetAddress}</div>
                                                    <div className="text-slate-600">{selectedOrderModal.shippingAddress.city}, {selectedOrderModal.shippingAddress.state} - {selectedOrderModal.shippingAddress.pincode}</div>
                                                    <div className="text-slate-500 font-medium">📞 {selectedOrderModal.shippingAddress.phone || selectedOrderModal.customerPhone}</div>
                                                </div>
                                            ) : (
                                                <div className="text-slate-400 italic">
                                                    No shipping address recorded.
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                            <div className="font-bold text-emerald-800 mb-2">💳 Billing Address</div>
                                            {selectedOrderModal.billingAddress && selectedOrderModal.billingAddress.streetAddress ? (
                                                <div className="space-y-1">
                                                    <div className="font-bold text-slate-900">{selectedOrderModal.billingAddress.fullName || selectedOrderModal.customerName}</div>
                                                    <div className="text-slate-600">{selectedOrderModal.billingAddress.streetAddress}</div>
                                                    <div className="text-slate-600">{selectedOrderModal.billingAddress.city}, {selectedOrderModal.billingAddress.state} - {selectedOrderModal.billingAddress.pincode}</div>
                                                    <div className="text-slate-500 font-medium">📞 {selectedOrderModal.billingAddress.phone || selectedOrderModal.customerPhone}</div>
                                                </div>
                                            ) : (
                                                <div className="text-slate-400 italic">
                                                    Same as Shipping Address
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-200">
                                {selectedOrderModal.paymentMethod === "ONLINE" && (!selectedOrderModal.paymentStatus || !selectedOrderModal.paymentStatus.includes("REFUND")) ? (
                                    <button
                                        type="button"
                                        className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-2"
                                        onClick={() => handleRefundOrder(selectedOrderModal.id, selectedOrderModal.totalAmount)}
                                    >
                                        <span>💸</span> Issue Refund via Razorpay
                                    </button>
                                ) : (
                                    <div></div>
                                )}
                                <button
                                    type="button"
                                    className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-sm px-4 py-2 rounded-xl transition-all"
                                    onClick={() => setSelectedOrderModal(null)}
                                >
                                    Close Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: EDIT ORDER DETAILS */}
            {editOrderModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-100 my-8 overflow-hidden">
                        <div className="bg-emerald-700 text-white px-6 py-4 flex items-center justify-between">
                            <h3 className="text-base font-extrabold flex items-center gap-2">
                                <span>✏️</span> Edit Order: <span className="font-mono text-amber-300">{editOrderModal.orderNumber}</span>
                            </h3>
                            <button
                                type="button"
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white font-bold transition-all"
                                onClick={() => setEditOrderModal(null)}
                            >
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleSaveOrderEdits} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Order Status</label>
                                    <select
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                                        value={editOrderForm.orderStatus}
                                        onChange={(e) => setEditOrderForm({ ...editOrderForm, orderStatus: e.target.value })}
                                    >
                                        <option value="PENDING">PENDING</option>
                                        <option value="CONFIRMED">CONFIRMED</option>
                                        <option value="PROCESSING">PROCESSING</option>
                                        <option value="SHIPPED">SHIPPED</option>
                                        <option value="DELIVERED">DELIVERED</option>
                                        <option value="CANCELLED">CANCELLED</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Payment Method</label>
                                    <select
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-medium focus:ring-2 focus:ring-emerald-500"
                                        value={editOrderForm.paymentMethod}
                                        onChange={(e) => setEditOrderForm({ ...editOrderForm, paymentMethod: e.target.value })}
                                    >
                                        <option value="COD">COD</option>
                                        <option value="ONLINE">ONLINE</option>
                                        <option value="UPI">UPI</option>
                                        <option value="CARD">CARD</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Payment Status</label>
                                    <select
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-medium focus:ring-2 focus:ring-emerald-500"
                                        value={editOrderForm.paymentStatus}
                                        onChange={(e) => setEditOrderForm({ ...editOrderForm, paymentStatus: e.target.value })}
                                    >
                                        <option value="PENDING">PENDING</option>
                                        <option value="PAID">PAID</option>
                                        <option value="FAILED">FAILED</option>
                                    </select>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Logistics Partner</label>
                                    <input
                                        type="text"
                                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                                        value={editOrderForm.courierName}
                                        onChange={(e) => setEditOrderForm({ ...editOrderForm, courierName: e.target.value })}
                                        placeholder="e.g. Amazon Shipping"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Tracking / AWB #</label>
                                    <input
                                        type="text"
                                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-medium"
                                        value={editOrderForm.trackingNumber}
                                        onChange={(e) => setEditOrderForm({ ...editOrderForm, trackingNumber: e.target.value })}
                                        placeholder="e.g. AWB1029384"
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Customer Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                                        value={editOrderForm.customerName}
                                        onChange={(e) => setEditOrderForm({ ...editOrderForm, customerName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Customer Phone</label>
                                    <input
                                        type="text"
                                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                                        value={editOrderForm.customerPhone}
                                        onChange={(e) => setEditOrderForm({ ...editOrderForm, customerPhone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Customer Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                                        value={editOrderForm.customerEmail}
                                        onChange={(e) => setEditOrderForm({ ...editOrderForm, customerEmail: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Total Amount (₹)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-emerald-700"
                                        value={editOrderForm.totalAmount}
                                        onChange={(e) => setEditOrderForm({ ...editOrderForm, totalAmount: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Shipping Fee (₹)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                                        value={editOrderForm.shippingFee}
                                        onChange={(e) => setEditOrderForm({ ...editOrderForm, shippingFee: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">GSTIN (Optional)</label>
                                    <input
                                        type="text"
                                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                                        value={editOrderForm.gstin}
                                        onChange={(e) => setEditOrderForm({ ...editOrderForm, gstin: e.target.value })}
                                    />
                                </div>

                                <div className="sm:col-span-3">
                                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Street Address</label>
                                    <input
                                        type="text"
                                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                                        value={editOrderForm.streetAddress}
                                        onChange={(e) => setEditOrderForm({ ...editOrderForm, streetAddress: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">City</label>
                                    <input
                                        type="text"
                                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                                        value={editOrderForm.city}
                                        onChange={(e) => setEditOrderForm({ ...editOrderForm, city: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">State</label>
                                    <input
                                        type="text"
                                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                                        value={editOrderForm.state}
                                        onChange={(e) => setEditOrderForm({ ...editOrderForm, state: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Pincode</label>
                                    <input
                                        type="text"
                                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                                        value={editOrderForm.pincode}
                                        onChange={(e) => setEditOrderForm({ ...editOrderForm, pincode: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl"
                                    onClick={() => setEditOrderModal(null)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm">
                                    💾 Save Order Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
