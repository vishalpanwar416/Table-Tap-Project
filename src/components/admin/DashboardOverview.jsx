import React, { useState, useEffect } from 'react';
import { TrendingUp, ShoppingCart, User, Utensils, PieChart, ChevronUp, ChevronDown, Check, X, Truck, CheckCircle } from 'lucide-react';

const DashboardOverview = ({ orders, foodItems, updateOrderStatus, setActiveTab }) => {
  const [revenueData, setRevenueData] = useState({ daily: 0, weekly: 0, monthly: 0 });
  const [orderStats, setOrderStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [activeUsers, setActiveUsers] = useState(0);
  const [menuStats, setMenuStats] = useState({ total: 0, popular: [] });
  const [chartPeriod, setChartPeriod] = useState('weekly');
  const [isCollapsed, setIsCollapsed] = useState({
    stats: false,
    chart: false
  });

  // Calculate order stats
  useEffect(() => {
    const calculateOrderStats = () => {
      try {
        const pending = orders.filter(order => order.status === 'pending').length;
        const completed = orders.filter(order => order.status === 'completed').length;
        
        setOrderStats({
          total: orders.length,
          pending: pending,
          completed: completed
        });
        
        // Simple placeholder calculations for revenue
        const totalRevenue = orders
          .filter(order => order.status === 'completed')
          .reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);
          
        const dailyRevenue = totalRevenue / 30; // Simplified calculation
        const weeklyRevenue = dailyRevenue * 7;
        const monthlyRevenue = dailyRevenue * 30;
        
        setRevenueData({
          daily: dailyRevenue,
          weekly: weeklyRevenue,
          monthly: monthlyRevenue
        });
        
        // Calculate unique active users
        const uniqueUsers = new Set(orders.map(order => order.userId || order.customerEmail || order.id));
        setActiveUsers(uniqueUsers.size);

        // Update menu stats
        setMenuStats({
          total: foodItems.length,
          popular: foodItems.slice(0, 6) // Simplified, in a real app this would be sorted by popularity
        });
      } catch (error) {
        console.error("Error calculating order stats:", error);
      }
    };
    calculateOrderStats();
  }, [orders, foodItems]);

  const toggleCollapse = (section) => {
    setIsCollapsed({
      ...isCollapsed,
      [section]: !isCollapsed[section]
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Overview</h3>
          <button 
            onClick={() => toggleCollapse('stats')}
            className="p-1 rounded hover:bg-gray-100"
          >
            {isCollapsed.stats ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
        </div>

        {!isCollapsed.stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-orange-50 to-white p-4 rounded-lg border border-orange-100">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">Today's Revenue</p>
                  <p className="text-2xl font-bold mt-1">₹{revenueData.daily.toFixed(2)}</p>
                </div>
                <div className="bg-orange-500/10 p-2 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-orange-500" />
                </div>
              </div>
              <div className="mt-2 text-xs text-green-600">
                +{((revenueData.daily / (revenueData.weekly / 7) - 1) * 100).toFixed(1)}% from yesterday
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-blue-100">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-2xl font-bold mt-1">{orderStats.total}</p>
                </div>
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <div className="flex mt-2 justify-between text-xs">
                <span className="text-blue-600">{orderStats.pending} pending</span>
                <span className="text-green-600">{orderStats.completed} completed</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-lg border border-green-100">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Users</p>
                  <p className="text-2xl font-bold mt-1">{activeUsers}</p>
                </div>
                <div className="bg-green-500/10 p-2 rounded-lg">
                  <User className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <div className="mt-2 text-xs text-green-600">
                {((activeUsers / 100) * 100).toFixed(1)}% returning customers
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-lg border border-purple-100">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">Menu Items</p>
                  <p className="text-2xl font-bold mt-1">{menuStats.total}</p>
                </div>
                <div className="bg-purple-500/10 p-2 rounded-lg">
                  <Utensils className="h-6 w-6 text-purple-500" />
                </div>
              </div>
              <div className="mt-2 text-xs text-purple-600">
                Categories available
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chart / Revenue Analysis */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Revenue Analysis</h3>
          <div className="flex items-center space-x-2">
            <select 
              className="text-sm border rounded p-1 focus:outline-none focus:ring-1 focus:ring-orange-500"
              value={chartPeriod}
              onChange={(e) => setChartPeriod(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <button 
              onClick={() => toggleCollapse('chart')}
              className="p-1 rounded hover:bg-gray-100"
            >
              {isCollapsed.chart ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </button>
          </div>
        </div>

        {!isCollapsed.chart && (
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <PieChart className="w-12 h-12 mx-auto text-gray-400" />
              <p className="text-gray-500 mt-2">Revenue chart will be displayed here</p>
            </div>
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
          {orders.slice(0, 5).map(order => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{order.id.slice(0, 8)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.customerName || 'Guest'}
              </td>
              <td className="px-4 py-4 text-sm text-gray-500">
                {order.items?.length || 0} items
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                ₹{order.total?.toFixed(2) || '0.00'}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                {getStatusBadge(order.status || 'pending')}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  {order.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'accepted')}
                        className="text-green-600 hover:text-green-900"
                        title="Accept Order"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'rejected')}
                        className="text-red-600 hover:text-red-900"
                        title="Reject Order"
                      >
                        <X size={18} />
                      </button>
                    </>
                  )}
                  {order.status === 'accepted' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className="text-blue-600 hover:text-blue-900"
                      title="Mark as Preparing"
                    >
                      <Truck size={18} />
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className="text-green-600 hover:text-green-900"
                      title="Mark as Completed"
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length > 5 && (
        <div className="mt-4 text-center">
          <button 
            onClick={() => setActiveTab('orders')}
            className="text-sm text-orange-500 hover:text-orange-600"
          >
            View all orders →
          </button>
        </div>
      )}
    </div>
  </div>

  {/* Popular Menu Items */}
  <div className="bg-white rounded-xl shadow-sm p-4">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Menu Items</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {menuStats.popular.map(item => (
        <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
          <div className="w-12 h-12 overflow-hidden rounded-md">
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
            <p className="text-sm text-gray-500">₹{item.price}</p>
          </div>
          <div className="text-xs font-semibold text-orange-500">
            {item.category}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
);
};

export default DashboardOverview;

