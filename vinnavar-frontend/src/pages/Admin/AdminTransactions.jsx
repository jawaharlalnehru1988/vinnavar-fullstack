import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../services/api";

const AdminTransactions = ({ orders = [], loadData }) => {
    const [viewMode, setViewMode] = useState("STORE_ORDERS"); // "STORE_ORDERS" or "RAZORPAY_GATEWAY"
    const [searchTerm, setSearchTerm] = useState("");
    const [paymentFilter, setPaymentFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");

    // Live Razorpay Payments state
    const [livePayments, setLivePayments] = useState([]);
    const [loadingLive, setLoadingLive] = useState(false);
    const [liveError, setLiveError] = useState("");

    const fetchLiveRazorpayTransactions = async () => {
        setLoadingLive(true);
        setLiveError("");
        try {
            const res = await fetch(`${API_BASE_URL}/admin/orders/razorpay-transactions`);
            if (res.ok) {
                const data = await res.json();
                setLivePayments(data || []);
            } else {
                setLiveError("Failed to fetch live Razorpay transactions from Gateway.");
            }
        } catch (err) {
            console.error("Error fetching live Razorpay payments", err);
            setLiveError("Network error fetching live Razorpay transactions.");
        } finally {
            setLoadingLive(false);
        }
    };

    useEffect(() => {
        if (viewMode === "RAZORPAY_GATEWAY") {
            fetchLiveRazorpayTransactions();
        }
    }, [viewMode]);

    // Store Orders filtering
    const filteredOrders = orders.filter((o) => {
        const matchesSearch =
            (o.orderNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (o.customerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (o.customerEmail || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (o.customerPhone || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (o.razorpayPaymentId || "").toLowerCase().includes(searchTerm.toLowerCase());

        const matchesPayment =
            paymentFilter === "ALL" ||
            (paymentFilter === "ONLINE" && o.paymentMethod === "ONLINE") ||
            (paymentFilter === "COD" && o.paymentMethod === "COD");

        const pStatus = (o.paymentStatus || "").toUpperCase();
        const matchesStatus =
            statusFilter === "ALL" ||
            (statusFilter === "PAID" && (pStatus.includes("PAID") || pStatus.includes("SUCCESS"))) ||
            (statusFilter === "PARTIAL" && pStatus.includes("PARTIAL")) ||
            (statusFilter === "REFUNDED" && pStatus.includes("REFUND") && !pStatus.includes("PARTIAL")) ||
            (statusFilter === "FAILED" && (pStatus.includes("FAIL") || pStatus.includes("CANCEL"))) ||
            (statusFilter === "PENDING" && (pStatus.includes("PENDING") || pStatus.includes("INITIATED")));

        return matchesSearch && matchesPayment && matchesStatus;
    });

    // Live Razorpay Payments filtering
    const filteredLivePayments = livePayments.filter((p) => {
        const pId = p.id || "";
        const pOrder = p.order_id || "";
        const pEmail = p.email || "";
        const pContact = p.contact || "";
        const pMethod = p.method || "";

        const matchesSearch =
            pId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pOrder.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pContact.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pMethod.toLowerCase().includes(searchTerm.toLowerCase());

        const status = (p.status || "").toLowerCase();
        const matchesStatus =
            statusFilter === "ALL" ||
            (statusFilter === "PAID" && status === "captured") ||
            (statusFilter === "PARTIAL" && status === "partially_refunded") ||
            (statusFilter === "REFUNDED" && status === "refunded") ||
            (statusFilter === "FAILED" && status === "failed") ||
            (statusFilter === "PENDING" && (status === "authorized" || status === "created"));

        return matchesSearch && matchesStatus;
    });

    // Metric Calculations for Store Orders
    const totalTransactions = orders.length;
    const razorpayOrders = orders.filter((o) => o.paymentMethod === "ONLINE");
    const razorpayRevenue = razorpayOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
    const codOrders = orders.filter((o) => o.paymentMethod === "COD");
    const codRevenue = codOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);

    // Export Store Orders to CSV/Excel
    const handleExportStoreOrders = () => {
        if (filteredOrders.length === 0) {
            alert("No store transaction records available to export.");
            return;
        }

        const headers = [
            "Order Number",
            "Date & Time",
            "Customer Name",
            "Customer Email",
            "Customer Phone",
            "Products Purchased",
            "Payment Method",
            "Razorpay Payment ID",
            "Payment Status",
            "Order Status",
            "Shipping Fee (INR)",
            "GST Tax (INR)",
            "Total Amount (INR)"
        ];

        const rows = filteredOrders.map((o) => {
            const dateStr = o.createdAt
                ? new Date(o.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
                : "N/A";

            const itemsStr = (o.items || [])
                .map((i) => `${i.productName} (${i.variantName || "Std"}) x${i.quantity}`)
                .join(" | ");

            return [
                o.orderNumber || "",
                dateStr,
                o.customerName || "",
                o.customerEmail || "",
                o.customerPhone || "",
                itemsStr,
                o.paymentMethod || "",
                o.razorpayPaymentId || "N/A",
                o.paymentStatus || "",
                o.orderStatus || "",
                (o.shippingFee != null ? o.shippingFee : 0).toFixed(2),
                (o.gstTax != null ? o.gstTax : 0).toFixed(2),
                (o.totalAmount != null ? o.totalAmount : 0).toFixed(2)
            ];
        });

        let csvContent = "\uFEFF";
        csvContent += headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(",") + "\n";
        rows.forEach((row) => {
            csvContent += row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",") + "\n";
        });

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const today = new Date().toISOString().slice(0, 10);

        link.setAttribute("href", url);
        link.setAttribute("download", `vinnavar_store_transactions_${today}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Export Live Razorpay Payments to CSV/Excel
    const handleExportLivePayments = () => {
        if (filteredLivePayments.length === 0) {
            alert("No live Razorpay gateway transactions available to export.");
            return;
        }

        const headers = [
            "Payment ID",
            "Razorpay Order ID",
            "Amount (INR)",
            "Status",
            "Method",
            "Customer Email",
            "Customer Phone",
            "Card/UPI Details",
            "Fee (Paise)",
            "Tax (Paise)",
            "Error Description",
            "Created At"
        ];

        const rows = filteredLivePayments.map((p) => {
            const dateStr = p.created_at
                ? new Date(p.created_at * 1000).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
                : "N/A";
            const amtInRupees = (p.amount ? p.amount / 100 : 0).toFixed(2);

            return [
                p.id || "",
                p.order_id || "N/A",
                amtInRupees,
                p.status || "",
                p.method || "",
                p.email || "",
                p.contact || "",
                p.card_id || p.vpa || p.wallet || "N/A",
                p.fee || 0,
                p.tax || 0,
                p.error_description || "N/A",
                dateStr
            ];
        });

        let csvContent = "\uFEFF";
        csvContent += headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(",") + "\n";
        rows.forEach((row) => {
            csvContent += row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",") + "\n";
        });

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const today = new Date().toISOString().slice(0, 10);

        link.setAttribute("href", url);
        link.setAttribute("download", `razorpay_gateway_all_transactions_${today}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            {/* Top Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        <span>💳</span> Payment Transactions Audit Log
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Complete payment ledger: successful, failed, refunded, and partial payments
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => {
                            if (viewMode === "RAZORPAY_GATEWAY") fetchLiveRazorpayTransactions();
                            else loadData();
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 transition-all flex items-center gap-1.5"
                    >
                        <span>🔄</span> Refresh Data
                    </button>
                    <button
                        type="button"
                        onClick={viewMode === "RAZORPAY_GATEWAY" ? handleExportLivePayments : handleExportStoreOrders}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-emerald-950/20 transition-all flex items-center gap-2 active:scale-95"
                    >
                        <span>📥</span> Export to Excel (.csv)
                    </button>
                </div>
            </div>

            {/* View Mode Toggle Sub-Nav */}
            <div className="flex items-center gap-3 bg-slate-200/60 p-1.5 rounded-2xl w-fit border border-slate-300/60">
                <button
                    type="button"
                    onClick={() => setViewMode("STORE_ORDERS")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                        viewMode === "STORE_ORDERS"
                            ? "bg-white text-emerald-800 shadow-sm border border-slate-200"
                            : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                    <span>📦</span> Store Orders & Audit
                </button>
                <button
                    type="button"
                    onClick={() => setViewMode("RAZORPAY_GATEWAY")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                        viewMode === "RAZORPAY_GATEWAY"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                    <span>⚡</span> Live Razorpay Gateway API (All Payments)
                </button>
            </div>

            {/* Metric Overview Cards */}
            {viewMode === "STORE_ORDERS" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-bold font-mono">
                            <span>RAZORPAY REVENUE</span>
                            <span>💳</span>
                        </div>
                        <div className="text-2xl font-black text-emerald-600 mt-2 font-mono">
                            ₹{razorpayRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">{razorpayOrders.length} online transaction(s)</div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-bold font-mono">
                            <span>COD REVENUE</span>
                            <span>💵</span>
                        </div>
                        <div className="text-2xl font-black text-amber-600 mt-2 font-mono">
                            ₹{codRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">{codOrders.length} cash on delivery order(s)</div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-bold font-mono">
                            <span>TOTAL TRANSACTIONS</span>
                            <span>📊</span>
                        </div>
                        <div className="text-2xl font-black text-slate-900 mt-2 font-mono">{totalTransactions}</div>
                        <div className="text-[11px] text-slate-500 mt-1">All processed payments</div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-bold font-mono">
                            <span>FILTERED RESULTS</span>
                            <span>🔍</span>
                        </div>
                        <div className="text-2xl font-black text-indigo-600 mt-2 font-mono">{filteredOrders.length}</div>
                        <div className="text-[11px] text-slate-500 mt-1">Matching current filters</div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white rounded-2xl p-5 shadow-sm">
                        <div className="text-xs font-mono font-bold uppercase tracking-wider text-blue-200">
                            TOTAL GATEWAY ATTEMPTS
                        </div>
                        <div className="text-3xl font-black mt-2 font-mono text-blue-300">
                            {livePayments.length}
                        </div>
                        <div className="text-[11px] text-blue-200 mt-1">All Razorpay transactions</div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                        <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600">
                            CAPTURED / SUCCESSFUL
                        </div>
                        <div className="text-3xl font-black mt-2 font-mono text-emerald-600">
                            {livePayments.filter((p) => p.status === "captured").length}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">Successfully collected payments</div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                        <div className="text-xs font-mono font-bold uppercase tracking-wider text-red-600">
                            FAILED PAYMENTS
                        </div>
                        <div className="text-3xl font-black mt-2 font-mono text-red-600">
                            {livePayments.filter((p) => p.status === "failed").length}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">Failed/Rejected payment attempts</div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                        <div className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600">
                            REFUNDED / PARTIAL
                        </div>
                        <div className="text-3xl font-black mt-2 font-mono text-rose-600">
                            {livePayments.filter((p) => p.status === "refunded" || p.status === "partially_refunded").length}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">Returned payments</div>
                    </div>
                </div>
            )}

            {/* Search & Filter Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-80">
                    <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">🔍</span>
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                        placeholder={
                            viewMode === "RAZORPAY_GATEWAY"
                                ? "Search Payment ID, Email, Phone..."
                                : "Search Razorpay ID, Order #, Name..."
                        }
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                        >
                            ✕
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {viewMode === "STORE_ORDERS" && (
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-600">Payment Mode:</span>
                            <select
                                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                                value={paymentFilter}
                                onChange={(e) => setPaymentFilter(e.target.value)}
                            >
                                <option value="ALL">All Modes</option>
                                <option value="ONLINE">Razorpay (Online)</option>
                                <option value="COD">Cash on Delivery (COD)</option>
                            </select>
                        </div>
                    )}

                    <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-600">Payment Status:</span>
                        <select
                            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="ALL">All Statuses (Everything)</option>
                            <option value="PAID">✓ Captured / Paid</option>
                            <option value="FAILED">✕ Failed Payments</option>
                            <option value="REFUNDED">↩ Fully Refunded</option>
                            <option value="PARTIAL">↩ Partial Refund</option>
                            <option value="PENDING">⌛ Authorized / Pending</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* VIEW 1: STORE ORDERS TABLE */}
            {viewMode === "STORE_ORDERS" && (
                <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[1100px]">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs font-bold font-mono uppercase tracking-wider whitespace-nowrap">
                                    <th className="py-3.5 px-4">Order #</th>
                                    <th className="py-3.5 px-4">Date & Time</th>
                                    <th className="py-3.5 px-4">Customer Details</th>
                                    <th className="py-3.5 px-4">Products Purchased</th>
                                    <th className="py-3.5 px-4">Payment Mode</th>
                                    <th className="py-3.5 px-4">Razorpay Payment ID</th>
                                    <th className="py-3.5 px-4">Payment Status</th>
                                    <th className="py-3.5 px-4 text-right">Total Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="py-10 text-center text-slate-400 font-medium">
                                            No transaction records found matching your query.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((o) => {
                                        const dateStr = o.createdAt
                                            ? new Date(o.createdAt).toLocaleString("en-IN", {
                                                  dateStyle: "medium",
                                                  timeStyle: "short"
                                              })
                                            : "—";

                                        const pStatus = (o.paymentStatus || "").toUpperCase();

                                        return (
                                            <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="py-3 px-4 font-mono font-bold text-emerald-700 whitespace-nowrap">
                                                    {o.orderNumber}
                                                </td>
                                                <td className="py-3 px-4 text-xs font-medium text-slate-600 whitespace-nowrap">
                                                    {dateStr}
                                                </td>
                                                <td className="py-3 px-4 min-w-[200px]">
                                                    <div className="font-bold text-slate-900">{o.customerName}</div>
                                                    <div className="text-xs text-slate-500 font-medium">
                                                        {o.customerPhone} {o.customerEmail ? `| ${o.customerEmail}` : ""}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 min-w-[220px] text-xs">
                                                    {(o.items || []).map((item, idx) => (
                                                        <div key={idx} className="text-slate-700">
                                                            • <span className="font-semibold">{item.productName}</span>{" "}
                                                            <span className="text-slate-400">
                                                                ({item.variantName || "Std"})
                                                            </span>{" "}
                                                            x{item.quantity}
                                                        </div>
                                                    ))}
                                                </td>
                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    {o.paymentMethod === "ONLINE" ? (
                                                        <span className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-full text-xs font-bold">
                                                            💳 Razorpay (Online)
                                                        </span>
                                                    ) : (
                                                        <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-bold">
                                                            💵 Cash on Delivery
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    {o.razorpayPaymentId ? (
                                                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                                                            {o.razorpayPaymentId}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400 text-xs italic">—</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    {pStatus.includes("PAID") || pStatus.includes("SUCCESS") ? (
                                                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-extrabold">
                                                            ✓ Paid
                                                        </span>
                                                    ) : pStatus.includes("PARTIAL") ? (
                                                        <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-extrabold">
                                                            ↩ Partial Refund
                                                        </span>
                                                    ) : pStatus.includes("REFUND") ? (
                                                        <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-extrabold">
                                                            ↩ Refunded
                                                        </span>
                                                    ) : pStatus.includes("FAIL") ? (
                                                        <span className="px-2.5 py-1 bg-red-100 text-red-800 rounded-full text-xs font-extrabold">
                                                            ✕ Failed
                                                        </span>
                                                    ) : (
                                                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                                                            {o.paymentStatus || "Pending"}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 text-right font-black text-slate-900 font-mono text-base whitespace-nowrap">
                                                    ₹{(o.totalAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* VIEW 2: LIVE RAZORPAY GATEWAY API PAYMENTS */}
            {viewMode === "RAZORPAY_GATEWAY" && (
                <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
                    {loadingLive ? (
                        <div className="py-12 flex flex-col items-center justify-center text-slate-500">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                            <span className="text-xs font-bold">Fetching live transactions directly from Razorpay Gateway API...</span>
                        </div>
                    ) : liveError ? (
                        <div className="p-8 text-center text-rose-600 text-xs font-bold">
                            ⚠️ {liveError}
                            <button
                                onClick={fetchLiveRazorpayTransactions}
                                className="block mx-auto mt-3 px-4 py-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[1100px]">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs font-bold font-mono uppercase tracking-wider whitespace-nowrap">
                                        <th className="py-3.5 px-4">Payment ID</th>
                                        <th className="py-3.5 px-4">Razorpay Order ID</th>
                                        <th className="py-3.5 px-4">Date & Time</th>
                                        <th className="py-3.5 px-4">Customer Contact</th>
                                        <th className="py-3.5 px-4">Method</th>
                                        <th className="py-3.5 px-4">Status</th>
                                        <th className="py-3.5 px-4">Error / Notes</th>
                                        <th className="py-3.5 px-4 text-right">Amount (INR)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {filteredLivePayments.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="py-10 text-center text-slate-400 font-medium">
                                                No live Razorpay gateway transactions found matching your criteria.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredLivePayments.map((p) => {
                                            const dateStr = p.created_at
                                                ? new Date(p.created_at * 1000).toLocaleString("en-IN", {
                                                      dateStyle: "medium",
                                                      timeStyle: "short"
                                                  })
                                                : "—";

                                            return (
                                                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                                                    <td className="py-3 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                                                        {p.id}
                                                    </td>
                                                    <td className="py-3 px-4 font-mono text-xs text-slate-600 whitespace-nowrap">
                                                        {p.order_id || "—"}
                                                    </td>
                                                    <td className="py-3 px-4 text-xs font-medium text-slate-600 whitespace-nowrap">
                                                        {dateStr}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="font-semibold text-slate-900 text-xs">{p.email || "N/A"}</div>
                                                        <div className="text-[11px] text-slate-500 font-mono">{p.contact || ""}</div>
                                                    </td>
                                                    <td className="py-3 px-4 whitespace-nowrap">
                                                        <span className="uppercase text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                                            {p.method}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 whitespace-nowrap">
                                                        {p.status === "captured" ? (
                                                            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-extrabold uppercase">
                                                                ✓ Captured
                                                            </span>
                                                        ) : p.status === "authorized" ? (
                                                            <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-extrabold uppercase">
                                                                ⏳ Authorized
                                                            </span>
                                                        ) : p.status === "partially_refunded" ? (
                                                            <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-extrabold uppercase">
                                                                ↩ Partial Refund
                                                            </span>
                                                        ) : p.status === "refunded" ? (
                                                            <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-extrabold uppercase">
                                                                ↩ Refunded
                                                            </span>
                                                        ) : p.status === "failed" ? (
                                                            <span className="px-2.5 py-1 bg-red-100 text-red-800 rounded-full text-xs font-extrabold uppercase">
                                                                ✕ Failed
                                                            </span>
                                                        ) : (
                                                            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold uppercase">
                                                                {p.status}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4 text-xs max-w-xs truncate">
                                                        {p.error_description ? (
                                                            <span className="text-red-600 font-medium" title={p.error_description}>
                                                                {p.error_description}
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-400 italic">—</span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4 text-right font-black text-slate-900 font-mono text-base whitespace-nowrap">
                                                        ₹{(p.amount ? p.amount / 100 : 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
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
            )}
        </div>
    );
};

export default AdminTransactions;
