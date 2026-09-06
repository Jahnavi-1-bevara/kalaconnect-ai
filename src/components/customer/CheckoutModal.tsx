import React, { useState } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import { useApp } from '../../store/AppContext';
import { ShippingAddress, Order } from '../../types';
import { X, CheckCircle2, ShieldCheck, CreditCard, Banknote, Smartphone } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { currentUser, cartTotal, createOrder, setActiveView } = useApp();

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: currentUser.name || 'Ananya Sharma',
    phone: currentUser.phone || '+91 98450 67890',
    street: '42 Indiranagar, 12th Main Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
  });

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const order = createOrder(address, paymentMethod);
    setCreatedOrder(order);

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.55 },
      });
    } catch {
      // Ignore
    }
  };

  const handleFinish = () => {
    setCreatedOrder(null);
    onClose();
    setActiveView('customer-dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-craft-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="relative bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-craft-xl border border-craft-sand my-8 p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-craft-muted hover:text-craft-charcoal hover:bg-craft-stone transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {createdOrder ? (
          <div className="text-center space-y-6 py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-craft-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-serif font-bold text-craft-charcoal">
                {t('checkout.success_title', 'Order Placed Successfully!')}
              </h3>
              <p className="text-xs sm:text-sm text-craft-muted max-w-md mx-auto">
                {t(
                  'checkout.success_desc',
                  'Your order has been routed directly to the artisan workshop for handcrafted fulfillment.'
                )}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-craft-stone/40 border border-craft-sand text-left space-y-2 text-xs">
              <div className="flex justify-between font-bold text-craft-charcoal border-b border-craft-sand/70 pb-2">
                <span>Order Reference:</span>
                <span className="text-craft-terracotta">{createdOrder.id}</span>
              </div>
              <div className="flex justify-between text-craft-muted">
                <span>Total Paid:</span>
                <span className="font-bold text-craft-charcoal">
                  ₹{createdOrder.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-craft-muted">
                <span>Recipient:</span>
                <span>{createdOrder.shippingAddress.fullName}</span>
              </div>
              <div className="flex justify-between text-craft-muted">
                <span>Delivery To:</span>
                <span className="text-right truncate max-w-[240px]">
                  {createdOrder.shippingAddress.city}, {createdOrder.shippingAddress.state}
                </span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3.5 px-4 rounded-xl bg-craft-terracotta hover:bg-craft-terracotta-dark text-white font-semibold text-xs shadow-craft-md transition-colors"
            >
              View Order in Dashboard →
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="space-y-6">
            <div>
              <h3 className="text-xl font-serif font-bold text-craft-charcoal">
                {t('checkout.title', 'Secure Checkout')}
              </h3>
              <p className="text-xs text-craft-muted mt-0.5">
                Total Payable: <strong className="text-craft-charcoal font-bold">₹{cartTotal.toLocaleString('en-IN')}</strong> (Free Shipping)
              </p>
            </div>

            {/* Shipping Address */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-craft-charcoal uppercase tracking-wider">
                {t('checkout.delivery_address', 'Shipping Address')}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-craft-muted block mb-1">
                    {t('checkout.full_name', 'Full Name')}
                  </label>
                  <input
                    type="text"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-craft-sand text-xs focus:outline-none focus:border-craft-terracotta"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-craft-muted block mb-1">
                    {t('checkout.phone', 'Mobile Number')}
                  </label>
                  <input
                    type="text"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-craft-sand text-xs focus:outline-none focus:border-craft-terracotta"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-craft-muted block mb-1">
                    {t('checkout.street', 'Street Address / House No')}
                  </label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-craft-sand text-xs focus:outline-none focus:border-craft-terracotta"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-craft-muted block mb-1">
                    {t('checkout.city', 'City')}
                  </label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-craft-sand text-xs focus:outline-none focus:border-craft-terracotta"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-craft-muted block mb-1">
                    {t('checkout.pincode', 'Postal Pincode')}
                  </label>
                  <input
                    type="text"
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-craft-sand text-xs focus:outline-none focus:border-craft-terracotta"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-craft-charcoal uppercase tracking-wider">
                {t('checkout.payment_method', 'Payment Method')}
              </h4>

              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-craft-terracotta bg-craft-terracotta/5 ring-1 ring-craft-terracotta'
                      : 'border-craft-sand bg-craft-stone/20'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-craft-terracotta mb-1" />
                  <div className="text-xs font-bold text-craft-charcoal">UPI / QR</div>
                  <div className="text-[10px] text-craft-muted">GooglePay, PhonePe</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === 'card'
                      ? 'border-craft-terracotta bg-craft-terracotta/5 ring-1 ring-craft-terracotta'
                      : 'border-craft-sand bg-craft-stone/20'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-craft-brass mb-1" />
                  <div className="text-xs font-bold text-craft-charcoal">Cards</div>
                  <div className="text-[10px] text-craft-muted">Visa, Mastercard</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-craft-terracotta bg-craft-terracotta/5 ring-1 ring-craft-terracotta'
                      : 'border-craft-sand bg-craft-stone/20'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-craft-forest mb-1" />
                  <div className="text-xs font-bold text-craft-charcoal">COD</div>
                  <div className="text-[10px] text-craft-muted">Pay at delivery</div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-craft-terracotta hover:bg-craft-terracotta-dark text-white font-semibold text-xs shadow-craft-md transition-colors"
            >
              {t('checkout.place_order', 'Place Order')} (₹{cartTotal.toLocaleString('en-IN')})
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
