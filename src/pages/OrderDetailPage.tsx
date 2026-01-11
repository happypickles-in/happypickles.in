import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { format } from 'date-fns';
import {
    Copy,
    Pen,
    Phone,
    Star,
    Camera,
    Check,
    Package,
    PackageCheck,
    Truck,
    XCircle,
    Repeat,
    X
} from 'lucide-react';
import AdressModal from '../components/AdressModal'; // existing modal in your project

/* ================= STATUS CONFIG =================
   - STATUS_STEPS defines the delivery timeline (unchanged)
   - STATUS_RULES extended to include terminal and special statuses
*/
const STATUS_STEPS = [
    { key: 'PLACED', label: 'Placed', Icon: Check },
    { key: 'PACKED', label: 'Packed', Icon: Package },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for delivery', Icon: Truck },
    { key: 'DELIVERED', label: 'Delivered', Icon: PackageCheck },
];

const STATUS_RULES: Record<string, any> = {
    PLACED: {
        canCancel: true,
        canReview: false,
        canRefund: false,
        canExchange: false,
        invoice: false,
        micro: 'We have received your order',
        eta: 'Packing your items',
        addressEditable: true,
        badge: { text: 'PLACED', tone: 'green' },
    },
    PACKED: {
        canCancel: true,
        canReview: false,
        canRefund: false,
        canExchange: false,
        invoice: false,
        micro: 'Packed — Expected pickup in 2–4 hrs',
        eta: 'Delivery today',
        addressEditable: true,
        badge: { text: 'PACKED', tone: 'green' },
    },
    OUT_FOR_DELIVERY: {
        canCancel: false,
        canReview: false,
        canRefund: false,
        canExchange: false,
        invoice: true,
        micro: 'Delivery partner assigned',
        eta: 'Arriving shortly',
        addressEditable: false,
        badge: { text: 'OUT FOR DELIVERY', tone: 'blue' },
    },
    DELIVERED: {
        canCancel: false,
        canReview: true,
        canRefund: true,
        canExchange: true,
        invoice: true,
        micro: 'Delivered successfully',
        eta: 'Completed',
        addressEditable: false,
        badge: { text: 'DELIVERED', tone: 'gray' },
    },

    // Terminal / special states
    CANCELLED: {
        canCancel: false,
        canReview: false,
        canRefund: false,
        canExchange: false,
        invoice: false,
        micro: 'Order cancelled',
        eta: '—',
        addressEditable: false,
        badge: { text: 'CANCELLED', tone: 'red' },
    },
    RETURNED: {
        canCancel: false,
        canReview: false,
        canRefund: false,
        canExchange: false,
        invoice: false,
        micro: 'Returned to seller',
        eta: '—',
        addressEditable: false,
        badge: { text: 'RETURNED', tone: 'orange' },
    },
    EXCHANGE_REQUESTED: {
        canCancel: false,
        canReview: false,
        canRefund: false,
        canExchange: false,
        invoice: false,
        micro: 'Exchange requested',
        eta: 'We will pick up the item',
        addressEditable: false,
        badge: { text: 'EXCHANGE REQUESTED', tone: 'orange' },
    },
    EXCHANGED: {
        canCancel: false,
        canReview: true,
        canRefund: false,
        canExchange: false,
        invoice: true,
        micro: 'Item exchanged',
        eta: 'Completed',
        addressEditable: false,
        badge: { text: 'EXCHANGED', tone: 'gray' },
    },
};

/* ================= Helper utilities ================= */
const isTerminalStatus = (s: string) =>
    ['CANCELLED', 'RETURNED', 'EXCHANGE_REQUESTED', 'EXCHANGED'].includes(s);

const badgeToneClass = (tone: string) => {
    switch (tone) {
        case 'red':
            return 'bg-red-50 text-red-700 border-red-100';
        case 'orange':
            return 'bg-orange-50 text-orange-700 border-orange-100';
        case 'blue':
            return 'bg-blue-50 text-blue-700 border-blue-100';
        case 'gray':
            return 'bg-gray-50 text-gray-700 border-gray-100';
        default:
            return 'bg-green-50 text-green-700 border-green-100';
    }
};

/* ================= ConfirmModal (small, non-blocking) ================= */
function ConfirmModal({
    open,
    title,
    description,
    onConfirm,
    onCancel,
    confirmLabel = 'Confirm',
    busy = false,
}: {
    open: boolean;
    title: string;
    description?: string;
    confirmLabel?: string;
    busy?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
            <div className="relative max-w-md w-full bg-white rounded-lg shadow-lg p-4 z-10">
                <h3 className="font-semibold text-lg">{title}</h3>
                {description && <p className="text-sm text-gray-600 mt-2">{description}</p>}
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={onCancel} className="px-3 py-2 rounded-md border">
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={busy}
                        className={`px-3 py-2 rounded-md ${busy ? 'opacity-60 cursor-wait' : 'bg-[#E67E22] text-white'}`}
                    >
                        {busy ? 'Processing...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ================= Main Component ================= */
export default function OrderDetailPage() {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { orders, updateOrder, addresses, addOrUpdateAddress } = useUser();

    const stateOrder = (location.state as any)?.order;
    const order = stateOrder || orders.find((o) => o.id === orderId);

    if (!order) {
        return <div className="p-6 text-center">Order not found</div>;
    }

    /* ========== STATUS DERIVATION ========== */

    const status = (order.status || 'PLACED').toString();
    // const status = 'PLACED';
    // const status = 'PACKED';
    // const status = 'OUT_FOR_DELIVERY';
    // const status = 'DELIVERED';


    const rules = STATUS_RULES[status] || STATUS_RULES.PLACED;
    // timeline index (if not part of the timeline, fallback to last step for visuals)
    const timelineIndex = STATUS_STEPS.findIndex((s) => s.key === status);
    const currentStepIndex = timelineIndex >= 0 ? timelineIndex : STATUS_STEPS.length - 1;
    const progressPercent = ((currentStepIndex + 1) / STATUS_STEPS.length) * 75;

    /* ========== PAYMENT FLAGS ========== */
    const isCOD = (order.payment?.method || '').toLowerCase() === 'cod';
    const isPaid = order.payment?.status === 'PAID';
    const showPayNow = isCOD && !isPaid;
    const invoiceVisible = rules.invoice || isPaid;

    /* ========== ITEM REVIEW ========== */
    const [selectedItemId, setSelectedItemId] = useState<string>(order.items?.[0]?.id);
    useEffect(() => {
        if (!order.items?.find((it: any) => it.id === selectedItemId)) {
            setSelectedItemId(order.items?.[0]?.id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order.items]);

    const selectedItem = order.items.find((i: any) => i.id === selectedItemId);

    type ItemReview = {
        rating: number;
        review: string;
        photo?: File;
        photoPreview?: string;
    };
    const [itemReviews, setItemReviews] = useState<Record<string, ItemReview>>({});

    /* ========== ADDRESS MODAL ========== */
    const [addrOpen, setAddrOpen] = useState(false);

    const onAddressModalClose = () => {
        setAddrOpen(false);
        // after modal closes, take current default address (if any) and update order snapshot
        const defaultAddr = addresses.find((a: any) => a.isDefault) || addresses[0];
        if (defaultAddr) {
            const snapshot = {
                name: defaultAddr.name,
                phone: defaultAddr.phone,
                house: defaultAddr.house,
                mandal: defaultAddr.mandal,
                district: defaultAddr.district,
                state: defaultAddr.state,
                pincode: defaultAddr.pincode,
            };
            updateOrder(order.id, { addressSnapshot: snapshot });
        }
    };

    /* ========== CANCEL / REFUND / EXCHANGE UI ========== */
    const [showCancelPanel, setShowCancelPanel] = useState(false);
    const [actionInProgress, setActionInProgress] = useState(false);
    const [actionMessage, setActionMessage] = useState<string | null>(null);

    // confirmation modal
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmPayload, setConfirmPayload] = useState<{ choice: 'refund' | 'exchange' | 'cancel'; meta?: any } | null>(null);

    const openConfirm = (choice: 'refund' | 'exchange' | 'cancel', meta?: any) => {
        setConfirmPayload({ choice, meta });
        setConfirmOpen(true);
    };

    const closeConfirm = () => {
        setConfirmPayload(null);
        setConfirmOpen(false);
    };

    const performConfirmedAction = async () => {
        if (!confirmPayload) return;
        const { choice } = confirmPayload;
        setConfirmOpen(false);
        await handleCancelChoice(choice === 'cancel' ? 'refund' : choice); // map cancel -> refund behavior
    };

    const handleCancelChoice = async (choice: 'refund' | 'exchange') => {
        // prevent duplicate or invalid transitions
        if (actionInProgress) return;
        if (isTerminalStatus(status)) {
            setActionMessage('Action not allowed for the current order status.');
            setTimeout(() => setActionMessage(null), 2500);
            return;
        }

        setActionInProgress(true);
        setActionMessage(`Processing ${choice} request...`);

        // optimistic patch (frontend-only): mark status and note
        const patch: any = { notes: `User requested ${choice.toUpperCase()}` };
        if (choice === 'refund') {
            patch.status = 'CANCELLED';
            patch.payment = { ...(order.payment || {}), status: 'REFUND_REQUESTED' };
        } else {
            // exchange requested path
            patch.status = 'EXCHANGE_REQUESTED';
        }

        try {
            // updateOrder should persist in app context / localStorage / backend integration (unchanged contract)
            await updateOrder(order.id, patch);
            setActionMessage(
                choice === 'refund'
                    ? 'Refund requested — we will process it in 3–5 business days.'
                    : 'Exchange requested — we will contact you for pickup.'
            );
            setShowCancelPanel(false);
        } catch (e) {
            console.error('update order failed', e);
            setActionMessage('Failed to submit request. Try again.');
        } finally {
            setActionInProgress(false);
            window.setTimeout(() => setActionMessage(null), 3500);
        }
    };

    /* ========== INVOICE (simple HTML download) ========== */
    const downloadInvoice = () => {
        const html = `
          <html>
            <head>
              <meta charset="utf-8" />
              <title>Invoice - ${order.id}</title>
              <style>
                body { font-family: Arial, Helvetica, sans-serif; color: #222; padding: 24px; }
                .header { display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; }
                .items { margin-top: 12px; border-collapse: collapse; width: 100%; }
                .items th, .items td { border-bottom:1px solid #eee; padding:8px 6px; text-align:left; }
                .total { font-weight:700; font-size:18px; margin-top:12px;}
              </style>
            </head>
            <body>
              <div class="header">
                <div>
                  <h2>Invoice</h2>
                  <div>Order: ${order.id}</div>
                  <div>Date: ${format(new Date(order.createdAt), 'dd MMM yyyy, hh:mm a')}</div>
                </div>
                <div>
                  <div>${order.addressSnapshot ? order.addressSnapshot.name : ''}</div>
                  <div>${order.addressSnapshot ? order.addressSnapshot.phone : ''}</div>
                  <div>${order.addressSnapshot ? order.addressSnapshot.house : ''}</div>
                  <div>${order.addressSnapshot ? order.addressSnapshot.district : ''} - ${order.addressSnapshot?.pincode || ''}</div>
                </div>
              </div>
    
              <table class="items">
                <thead>
                  <tr>
                    <th>Item</th><th>Qty</th><th>Price</th><th>Line</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.items.map((it: any) => `
                    <tr>
                      <td>${it.name}</td>
                      <td>${it.quantity}</td>
                      <td>₹${it.price}</td>
                      <td>₹${it.price * it.quantity}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
    
              <div class="total">
                Subtotal: ₹${order.pricing.subtotal} <br/>
                Delivery: ₹${order.pricing.delivery} <br/>
                Discount: -₹${order.pricing.discount} <br/>
                GST: ₹${order.pricing.gst} <br/>
                <strong>Total: ₹${order.pricing.total}</strong>
              </div>
    
              <div style="margin-top:18px;">
                Payment: ${order.payment?.method || 'N/A'} — ${order.payment?.status || 'N/A'}
                ${order.payment?.gatewayRef ? `<div>Txn: ${order.payment.gatewayRef}</div>` : ''}
              </div>
            </body>
          </html>
        `.trim();

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${order.id}.html`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    /* ========== Cancel Button UI (aesthetic) ========== */
    const CancelButton = () => {
        const disabled = !rules.canCancel || isTerminalStatus(status);
        return (
            <button
                onClick={() => {
                    // open the choice panel only when allowed
                    if (disabled) {
                        setActionMessage('Cancellation not allowed at this stage.');
                        setTimeout(() => setActionMessage(null), 2000);
                        return;
                    }
                    setShowCancelPanel((s) => !s);
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 ${disabled ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-red-100 text-red-600 hover:bg-red-50'
                    } transition shadow-sm`}
                title="Cancel / Refund / Exchange"
            >
                Cancel / Return
            </button>
        );
    };

    /* ========== RENDER HELPERS ========== */
    const renderStatusBadge = () => {
        const badge = rules?.badge || { text: status, tone: 'green' };
        return (
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${badgeToneClass(badge.tone)}`}>
                {badge.tone === 'red' ? <XCircle className="w-4 h-4" /> : badge.tone === 'orange' ? <Repeat className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                <span>{badge.text}</span>
            </div>
        );
    };

    /* ========== Render ================= */
    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            {/* HEADER */}
            <div className="flex justify-between items-end gap-4">
                <div>
                    <p className="text-xs text-gray-500">{format(new Date(order.createdAt), 'dd MMM yyyy, hh:mm a')}</p>

                    <div className="flex items-center gap-3 mt-1">
                        <h1 className="text-sm font-bold">Order #{order.id}</h1>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(order.id);
                            }}
                            className="text-gray-500"
                            title="Copy order id"
                            aria-label="Copy order id"
                        >
                            <Copy size={14} />
                        </button>

                    </div>
                </div>

                <div className="text-right">
                    <p className="text-xs text-gray-400 ml-3 text-center">Last updated</p>
                    <p className="text-xs text-gray-400 ml-3 text-center">just now</p>
                </div>
            </div>

            {/* STATUS BAR */}
            <div className="relative pt-6">
                {/* background track */}
                <div className="absolute top-[34px] left-[12%] w-[75%] h-3 bg-green-100 rounded-full" />
                <div
                    className="absolute top-[34px] left-[12%] h-3 bg-green-500 rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                />

                <div className="flex justify-between relative">
                    {STATUS_STEPS.map((s, idx) => {
                        const done = idx < timelineIndex;
                        const active = idx === timelineIndex;
                        const Icon = s.Icon;
                        return (
                            <div key={s.key} className="w-1/4 text-center">
                                <div
                                    className={`mx-auto w-8 h-8 rounded-full border-2 flex items-center justify-center ${done || active ? 'bg-green-500 border-green-500' : 'bg-white border-dashed border-green-300'
                                        }`}
                                >
                                    <Icon className={`${done || active ? 'text-white' : 'text-green-300'} w-4 h-4`} />
                                </div>
                                <p className={`mt-2 text-xs font-medium ${active ? 'text-green-700' : 'text-gray-400'}`}>{s.label}</p>
                            </div>
                        );
                    })}
                </div>
                <div className="text-xs text-gray-500 mt-2 text-center">
                    <p>{rules.micro}</p>
                    <p>{rules.eta}</p>
                </div>
            </div>

            {/* ITEMS */}
            <div>
                <h3 className="font-semibold">Items</h3>
                <div className="flex overflow-x-auto overflow-y-visible p-2 gap-1">
                    {order.items.map((i: any) => (
                        <div
                            key={i.id}
                            onClick={() => setSelectedItemId(i.id)}
                            className={`flex justify-between w-24 p-2 rounded-lg cursor-pointer transition ${selectedItemId === i.id ? 'scale-[1.03] shadow-lg border-2 border-[#E67E22] bg-orange-50' : 'border bg-white'
                                }`}
                            role="button"
                            aria-pressed={selectedItemId === i.id}
                        >
                            <div className="flex flex-col gap-2">
                                <img src={i.image} className="min-w-20 max-w-20 aspect-square rounded" />
                                <div>
                                    <p className="text-xs">{i.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {i.weight} × {i.quantity}
                                    </p>
                                </div>
                                <p className="text-xs">₹{i.price * i.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RATE & REVIEW (enabled after delivery) */}
            <div className="bg-white p-4 rounded-xl space-y-3">
                <div className="flex items-start justify-between">
                    <h3 className="font-semibold">Rate & Review ({selectedItem?.name})</h3>
                </div>

                {/* review explanation */}
                {!rules.canReview && <p className="text-sm text-gray-400">You can review this item after delivery</p>}

                <div className={`space-y-3 ${!rules.canReview ? 'opacity-40 pointer-events-none' : ''}`}>
                    {/* Stars */}
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                            <Star
                                key={n}
                                onClick={() =>
                                    setItemReviews((p) => ({
                                        ...p,
                                        [selectedItemId]: {
                                            ...p[selectedItemId],
                                            rating: n,
                                        },
                                    }))
                                }
                                className={`cursor-pointer ${n <= (itemReviews[selectedItemId]?.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                            />
                        ))}
                    </div>

                    {/* image preview */}
                    {itemReviews[selectedItemId]?.photoPreview && <img src={itemReviews[selectedItemId].photoPreview} alt="preview" className="w-28 rounded-lg border" />}

                    {/* image upload + textarea */}
                    <div className="flex gap-3">
                        <label className="relative h-24 aspect-[10/16] border rounded-lg flex items-center justify-center cursor-pointer">
                            <Camera className="w-6 h-6 text-gray-500" />
                            <span className='absolute -top-1 -right-1 bg-green-500 rounded-full text-base text-white w-5 h-5 flex items-center justify-center'>+</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const preview = URL.createObjectURL(file);
                                    setItemReviews((p) => ({
                                        ...p,
                                        [selectedItemId]: {
                                            ...p[selectedItemId],
                                            photo: file,
                                            photoPreview: preview,
                                        },
                                    }));
                                }}
                            />
                        </label>

                        <textarea
                            value={itemReviews[selectedItemId]?.review || ''}
                            onChange={(e) =>
                                setItemReviews((p) => ({
                                    ...p,
                                    [selectedItemId]: {
                                        ...p[selectedItemId],
                                        review: e.target.value,
                                    },
                                }))
                            }
                            className="w-full border rounded p-2"
                            placeholder="Write your review for this item"
                        />
                    </div>

                    {/* Exchange / Refund quick links (delivered only) */}
                    <div className="flex gap-4 text-sm">
                        <button
                            disabled={!rules.canExchange}
                            onClick={() => openConfirm('exchange')}
                            className={`px-3 py-2 rounded-md ${rules.canExchange ? 'border hover:bg-gray-50' : 'text-gray-300 cursor-not-allowed'}`}
                        >
                            Exchange Item
                        </button>
                        <button
                            disabled={!rules.canRefund}
                            onClick={() => openConfirm('refund')}
                            className={`px-3 py-2 rounded-md ${rules.canRefund ? 'border hover:bg-gray-50' : 'text-gray-300 cursor-not-allowed'}`}
                        >
                            Request Refund
                        </button>
                    </div>
                </div>
            </div>

            {/* BILL */}
            <div className="bg-white p-4 rounded-xl space-y-2">
                <div className='flex flex-row justify-between items-center'>
                    <h3 className="font-semibold">Bill</h3>
                    {invoiceVisible && (
                        <button onClick={downloadInvoice} className="text-green-700">
                            Download Invoice
                        </button>
                    )}
                </div>
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{order.pricing.subtotal}</span>
                </div>
                <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>₹{order.pricing.delivery}</span>
                </div>
                <div className="flex justify-between text-green-700">
                    <span>Discount</span>
                    <span>-₹{order.pricing.discount}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-xs text-gray-500">GST (5%)</span>
                    <span>₹{order.pricing.gst}</span>
                </div>
                <div className="h-px bg-gray-100 my-2" />
                <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{order.pricing.total}</span>
                </div>

                {/* savings highlight */}
                {order.pricing.discount > 0 && <p className="text-sm text-green-700">You saved ₹{order.pricing.discount} on this order 🎉</p>}

            </div>

            {/* DELIVERY ADDRESS + EDIT */}
            <div className="bg-white p-4 rounded-xl flex justify-between items-start">
                <div>
                    <h3 className="font-semibold">Delivered to</h3>
                    {order.addressSnapshot ? (
                        <p className="text-sm mt-1">
                            <strong>{order.addressSnapshot.name}</strong> • {order.addressSnapshot.phone}
                            <br />
                            {order.addressSnapshot.house}, {order.addressSnapshot.mandal ? order.addressSnapshot.mandal + ', ' : ''}{order.addressSnapshot.district}, {order.addressSnapshot.state} - {order.addressSnapshot.pincode}
                        </p>
                    ) : (
                        <p className="text-sm text-gray-500">No address</p>
                    )}

                    {/* small helper (map / validation) */}
                    <p className="text-xs text-gray-400 mt-2">Tip: Double-check your address to prevent delivery issues.</p>
                </div>

                <div className="flex flex-col gap-2 items-end">
                    {/* editable only while addressEditable is true */}
                    {rules.addressEditable && (
                        <button onClick={() => setAddrOpen(true)} className="text-sm">
                            <Pen size={16} />
                        </button>
                    )}

                    {/* <button className="flex gap-2 items-center border px-3 py-1.5 rounded-md text-sm" onClick={() => navigate('/profile/orders')}>
                        View Orders
                    </button> */}
                </div>
            </div>

            {/* PAYMENT & ACTIONS */}
            <div className="bg-white p-4 rounded-xl flex justify-between items-start">
                <div className='w-full'>
                    <h3 className="font-semibold">Payment</h3>
                    <div className='flex flex-row justify-between w-full items-end'>
                        <div>

                            <p className="text-sm text-gray-600 mt-2">
                                Method: {order.payment?.method?.toUpperCase() || 'N/A'}
                                {order.payment?.gatewayRef && (
                                    <>
                                        <br />Txn: <strong>{order.payment.gatewayRef}</strong>
                                    </>
                                )}
                            </p>
                            <p className={`text-sm ${isPaid ? 'text-green-600' : 'text-orange-500'}`}>{isPaid ? 'Payment received successfully' : 'Payment pending'}</p>
                        </div>
                        <div className="flex flex-col gap-2 items-end justify-end h-full">
                            {showPayNow && (
                                <button onClick={() => navigate('/payment', { state: { orderToPay: order } })} className="px-4 py-2 bg-[#E67E22] text-white rounded-md mt-auto">
                                    Pay Now
                                </button>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            <div className='flex flex-row justify-end gap-2 w-full'>
                <button className="flex items-center gap-2 px-3 py-2 border rounded-md bg-red-500 text-white">
                    <X size={16} /> Cancel Order
                </button>

                <button className="flex items-center gap-2 px-3 py-2 border rounded-md">
                    <Phone size={16} /> Contact Support
                </button>
            </div>

            <AdressModal open={addrOpen} onClose={onAddressModalClose} />

            {/* Confirm Modal for destructive actions */}
            <ConfirmModal
                open={confirmOpen}
                title={confirmPayload ? (confirmPayload.choice === 'refund' ? 'Confirm refund request' : 'Confirm exchange request') : ''}
                description={
                    confirmPayload
                        ? confirmPayload.choice === 'refund'
                            ? 'Are you sure you want to cancel this order and request a refund? This action will submit a refund request to our team.'
                            : 'Are you sure you want to request an exchange? We will schedule a pickup and contact you for details.'
                        : ''
                }
                onConfirm={performConfirmedAction}
                onCancel={closeConfirm}
                confirmLabel={actionInProgress ? 'Processing...' : 'Confirm'}
                busy={actionInProgress}
            />
        </div>
    );
}
