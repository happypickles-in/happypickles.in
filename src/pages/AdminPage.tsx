import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { useSearchParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const COLORS = ['#E67E22', '#2ECC71', '#3498DB', '#9B59B6', '#E74C3C'];

export default function AdminPage() {
  const { orders, wishlist, addresses } = useUser();
  const [q] = useSearchParams();

  const key = q.get('key');
  const secret = import.meta.env.VITE_ADMIN_KEY || 'letmein';

  if (key !== secret) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold">Admin access restricted</h2>
          <p className="text-sm text-gray-500 mt-2">
            Append <code>?key=YOUR_SECRET</code> to the URL
          </p>
        </div>
      </div>
    );
  }

  /* ================== METRICS ================== */

  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.pricing?.total || 0),
    0
  );

  const statusData = Object.values(
    orders.reduce((acc: any, o) => {
      const s = o.status || 'PLACED';
      acc[s] = acc[s] || { name: s, value: 0 };
      acc[s].value++;
      return acc;
    }, {})
  );

  const ordersByDate = Object.values(
    orders.reduce((acc: any, o) => {
      const d = new Date(o.createdAt).toLocaleDateString();
      acc[d] = acc[d] || { date: d, orders: 0, revenue: 0 };
      acc[d].orders++;
      acc[d].revenue += o.pricing?.total || 0;
      return acc;
    }, {})
  );

  const locationData = Object.values(
    orders.reduce((acc: any, o) => {
      const pin = o.addressSnapshot?.pincode || 'Unknown';
      acc[pin] = acc[pin] || { location: pin, orders: 0 };
      acc[pin].orders++;
      return acc;
    }, {})
  ).slice(0, 5);

  /* ================== UI ================== */

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* ================= KPIs ================= */}
      <div className="grid md:grid-cols-4 gap-4">
        <KPI title="Total Orders" value={orders.length} />
        <KPI title="Revenue" value={`₹${totalRevenue}`} />
        <KPI title="Wishlist Items" value={wishlist.length} />
        <KPI title="Saved Addresses" value={addresses.length} />
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Orders Over Time */}
        <Card title="Orders & Revenue Over Time">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={ordersByDate}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="#E67E22" />
              <Line type="monotone" dataKey="revenue" stroke="#2ECC71" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Order Status */}
        <Card title="Order Status Distribution">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                // data={statusData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {statusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Locations */}
        <Card title="Top Delivery Locations">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={locationData}>
              <XAxis dataKey="location" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#3498DB" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Wishlist Insight */}
        <Card title="Wishlist vs Orders">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={[
                { name: 'Orders', value: orders.length },
                { name: 'Wishlist', value: wishlist.length }
              ]}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#9B59B6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function KPI({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-white p-4 rounded-xl border">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}

function Card({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white p-4 rounded-xl border space-y-3">
      <h3 className="font-semibold">{title}</h3>
      {children}
    </div>
  );
}
