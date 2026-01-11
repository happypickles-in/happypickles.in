import { Link, useSearchParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { format } from 'date-fns';
import { PackageSearch } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ACTIVE_STATUSES = ['PLACED', 'PACKED', 'OUT_FOR_DELIVERY'];

export default function OrdersPage() {

  const navigate = useNavigate();
  const { orders } = useUser();
  const [params] = useSearchParams();

  const type = params.get('type'); // active | null

  const filteredOrders =
    type === 'active'
      ? orders.filter(o => ACTIVE_STATUSES.includes(o.status || 'PLACED'))
      : orders;

  if (!filteredOrders.length) {
    return (

      <div className="flex flex-col items-center justify-center text-center py-20">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-[#E67E22]/10 flex items-center justify-center animate-pulse">
            <PackageSearch className="w-12 h-12 text-[#E67E22]" />
          </div>
          <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#E67E22] text-white text-xs flex items-center justify-center animate-bounce">
            0
          </span>
        </div>

        <h3 className="text-xl font-bold text-[#2D1F14] mb-2">
          No orders yet 📦
        </h3>

        <p className="text-sm text-[#6B5A4A] max-w-xs mb-2">
          Looks like you haven’t placed your first order.
        </p>
        <p className="text-sm text-[#6B5A4A] max-w-xs mb-6">
          Your cravings deserve some attention 😋
        </p>

        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 rounded-full bg-[#E67E22] text-white font-semibold text-sm hover:scale-105 transition shadow-md"
        >
          Start Ordering
        </button>

        <p className="text-xs text-[#6B5A4A]/70 mt-4">
          Tip: Orders get delivered faster than you expect 🚀
        </p>
      </div>

    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {type === 'active' ? 'Active Orders' : 'Your Orders'}
        </h1>

        {type !== 'active' && (
          <Link
            to="/orders?type=active"
            className="text-sm font-medium text-[#E67E22]"
          >
            View Active Orders →
          </Link>
        )}
      </div>

      <div className="grid gap-3">
        {filteredOrders.map(order => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            state={{ order }}
            className="block bg-white rounded-2xl p-4 border hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-[#6B5A4A]">
                  {format(new Date(order.createdAt), 'dd MMM yyyy, hh:mm a')}
                </div>

                <div className="font-semibold mt-1">
                  Order #{order.id}
                </div>

                <div className="text-xs text-[#6B5A4A] mt-1">
                  {order.items.length} item
                  {order.items.length > 1 ? 's' : ''}
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`text-sm font-medium ${order.status === 'DELIVERED'
                    ? 'text-gray-500'
                    : 'text-green-600'
                    }`}
                >
                  {order.status || 'PLACED'}
                </div>

                <div className="font-bold text-lg mt-2">
                  ₹{order.pricing?.total ?? 0}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
