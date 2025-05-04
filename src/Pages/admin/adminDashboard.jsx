import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard,  
  Utensils, 
  ShoppingCart, 
  Users, 
  Settings, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Truck, 
  CheckCircle, 
  Tag,
  ChevronUp,
  ChevronDown,
  Plus,
  Search,
  TrendingUp,
  User,
  PieChart
} from 'lucide-react';
import { categories } from '../../components/foodData';
import { supabase, supabaseStorage } from '../../supabase';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [foodItems, setFoodItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [revenueData, setRevenueData] = useState({ daily: 0, weekly: 0, monthly: 0 });
  const [orderStats, setOrderStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [activeUsers, setActiveUsers] = useState(0);
  const [menuStats, setMenuStats] = useState({ total: 0, popular: [] });
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Snacks',
    tags: '',
    image: '',
    imageFile: null
  });
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  const [chartPeriod, setChartPeriod] = useState('weekly');
  const [isCollapsed, setIsCollapsed] = useState({
    stats: false,
    chart: false
  });

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'menu', icon: Utensils, label: 'Menu Management' },
    { id: 'orders', icon: ShoppingCart, label: 'Order Management' },
    { id: 'users', icon: Users, label: 'User Management' },
    { id: 'offers', icon: Tag, label: 'Offers & Promotions' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  // Fetch food items from Firebase
  useEffect(() => {
    const fetchFoodItems = async () => {
      const { data, error } = await supabase
        .from('foodItems')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setFoodItems(data);
    };
    fetchFoodItems();
  }, []);


  // Fetch orders from Firebase
  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setOrders(data);
    };
    fetchOrders();
  }, []);

  // Calculate order stats
  useEffect(() => {
    const fetchOrderStats = () => {
      const pending = orders.filter(order => order.status === 'pending').length;
      const completed = orders.filter(order => order.status === 'completed').length;
      
      setOrderStats({
        total: orders.length,
        pending: pending,
        completed: completed
      });
      
      // Calculate revenue
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const dailyRevenue = orders
        .filter(order => new Date(order.createdAt?.toDate()) >= oneDayAgo)
        .reduce((sum, order) => sum + (order.total || 0), 0);
        
      const weeklyRevenue = orders
        .filter(order => new Date(order.createdAt?.toDate()) >= oneWeekAgo)
        .reduce((sum, order) => sum + (order.total || 0), 0);
        
      const monthlyRevenue = orders
        .filter(order => new Date(order.createdAt?.toDate()) >= oneMonthAgo)
        .reduce((sum, order) => sum + (order.total || 0), 0);
      
      setRevenueData({
        daily: dailyRevenue,
        weekly: weeklyRevenue,
        monthly: monthlyRevenue
      });
      
      // Calculate unique active users
      const uniqueUsers = new Set(orders.map(order => order.userId || order.customerEmail));
      setActiveUsers(uniqueUsers.size);
    };
    fetchOrderStats();
  }, [orders]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        imageFile: file,
        image: URL.createObjectURL(file)
      });
    }
  };

  // Upload image to Firebase Storage
  const uploadImage = async (file) => {
    if (!file) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabaseStorage
      .from('food-images')
      .upload(filePath, file);

    if (error) throw error;

    return supabaseStorage
      .from('food-images')
      .getPublicUrl(filePath).data.publicUrl;
  };


  // Food Item Management
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let imageUrl = formData.image;
    if (formData.imageFile) {
      imageUrl = await uploadImage(formData.imageFile);
    }
  
    // Remove ID from the data and preserve createdAt for updates
    const { id, createdAt, ...formDataWithoutId } = formData;
    const newItem = {
      ...formDataWithoutId,
      price: parseFloat(formData.price),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      image: imageUrl,
      // Only add createdAt for new items
      ...(!editItem && { createdAt: new Date() })
    };
  
    try {
      setLoading(true);
      // if (editItem) {
      //   // Use the document ID in the reference but exclude it from the data
      //   await updateDoc(doc(supabase, 'foodItems', editItem.id), newItem);
      // } else {
      //   await addDoc(collection(supabase, 'foodItems'), newItem);
      // }
      
      setFormData({
        name: '',
        price: '',
        description: '',
        category: 'Snacks',
        tags: '',
        image: '',
        imageFile: null
      });
      setEditItem(null);
    } catch (error) {
      console.error("Error saving item:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setFormData({
      ...item,
      tags: item.tags?.join(', ') || '',
      imageFile: null
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await supabase.from('foodItems').delete().eq('id', id);
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  // Order Management
  const updateOrderStatus = async (orderId, status) => {
    try {
      await supabase.from('orders').update({ status }).eq('id', orderId);
    } catch (error) {
      console.error("Error updating order:", error);
    }
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

  // Filter foodItems based on search and category
  const filteredFoodItems = foodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleCollapse = (section) => {
    setIsCollapsed({
      ...isCollapsed,
      [section]: !isCollapsed[section]
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar - Desktop */}
        <div className="hidden md:flex flex-col w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
          <div className="p-5 border-b border-gray-700">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6 text-orange-500" />
              <span>Admin Dashboard</span>
            </h1>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id 
                        ? 'bg-orange-500 text-white' 
                        : 'hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center mr-3 text-white font-medium">
               {/* {currentUser?.email?.charAt(0).toUpperCase()} */}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">
                  {/* {currentUser?.email} */}
                  </p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm text-center rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-900 text-white z-20 px-4 py-3 flex justify-between items-center">
          <h1 className="text-lg font-bold flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-orange-500" />
            <span>Admin Dashboard</span>
          </h1>
          <button 
            onClick={() => setShowMobileNav(!showMobileNav)}
            className="p-2 rounded-md hover:bg-gray-800"
          >
            {showMobileNav ? (
              <X className="w-6 h-6" />
            ) : (
              <div className="space-y-1">
                <div className="w-6 h-0.5 bg-white"></div>
                <div className="w-6 h-0.5 bg-white"></div>
                <div className="w-6 h-0.5 bg-white"></div>
              </div>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {showMobileNav && (
          <div className="md:hidden fixed inset-0 bg-gray-900 bg-opacity-95 z-10 pt-16">
            <nav className="p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveTab(item.id);
                        setShowMobileNav(false);
                      }}
                      className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                        activeTab === item.id 
                          ? 'bg-orange-500 text-white' 
                          : 'hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center mr-3 text-white font-medium">
                   {/* {currentUser?.email?.charAt(0).toUpperCase()} */}
                  </div>
                  <div>
                    <p className="text-sm font-medium truncate">
                      {/* {currentUser?.email} */}
                      </p>
                    <p className="text-xs text-gray-400">Administrator</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm text-center rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  Log Out
                </button>
              </div>
            </nav>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Main Content Header */}
          <div className="bg-white shadow-sm z-10 p-4 md:p-6">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h2>
              <div className="hidden md:block">
                <div className="relative text-gray-600">
                  <input 
                    type="search" 
                    name="search" 
                    placeholder="Search..." 
                    className="bg-gray-100 h-10 px-5 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute right-3 top-2.5 h-5 w-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Body */}
          <div className="flex-1 overflow-y-auto pt-4 md:pt-0">
            <div className="px-4 py-6 md:p-6 max-w-7xl mx-auto">
              {/* Mobile Search */}
              <div className="md:hidden mb-4">
                <div className="relative text-gray-600">
                  <input 
                    type="search" 
                    name="search" 
                    placeholder="Search..." 
                    className="bg-gray-100 w-full h-10 px-5 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute right-3 top-2.5 h-5 w-5" />
                </div>
              </div>

              {/* Dashboard Content */}
              {activeTab === 'dashboard' && (
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
                            {categories.length} categories available
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
                      {menuStats.popular.slice(0, 6).map(item => (
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
              )}

              {/* Menu Management */}
              {activeTab === 'menu' && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Form Section */}
                    <div className="bg-white p-6 rounded-xl shadow-sm md:w-1/3">
                      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                        {editItem ? (
                          <>
                            <Edit className="w-5 h-5 mr-2 text-orange-500" />
                            Edit Food Item
                          </>
                        ) : (
                          <>
                            <Plus className="w-5 h-5 mr-2 text-green-500" />
                            Add New Food Item
                          </>
                        )}
                      </h2>
                      
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                          <input
                            type="text"
                            placeholder="Item Name"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                          <input
                            type="number"
                            placeholder="Price"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            placeholder="Description"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                            rows="3"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                          <select
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                          >
                            {categories.map(category => (
                              <option key={category.name} value={category.name}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                          <input
                            type="text"
                            placeholder="Tags (comma separated)"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                            value={formData.tags}
                            onChange={(e) => setFormData({...formData, tags: e.target.value})}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Food Image</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full text-sm text-gray-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-md file:border-0
                              file:text-sm file:font-semibold
                              file:bg-orange-50 file:text-orange-700
                              hover:file:bg-orange-100"
                          />
                          {formData.image && (
                            <div className="mt-2">
                              <img 
                                src={formData.image} 
                                alt="Preview" 
                                className="h-24 w-full object-cover rounded"
                              />
                            </div>
                          )}
                        </div>
                        
                        <button
                          type="submit"
                          disabled={loading}
                          className={`w-full p-2 rounded text-white transition-colors ${
                            editItem 
                              ? 'bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400'
                              : 'bg-green-600 hover:bg-green-700 disabled:bg-green-400'
                          }`}
                        >
                          {loading ? 'Processing...' : editItem ? 'Update Item' : 'Add Item'}
                        </button>
                        
                        {editItem && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditItem(null);
                              setFormData({
                                name: '',
                                price: '',
                                description: '',
                                category: 'Snacks',
                                tags: '',
                                image: '',
                                imageFile: null
                              });
                            }}
                            className="w-full bg-gray-200 text-gray-800 p-2 rounded hover:bg-gray-300 transition-colors mt-2"
                          >
                            Cancel
                          </button>
                        )}
                      </form>
                    </div>

                    {/* Food Items List */}
                    <div className="md:flex-1">
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <h2 className="text-xl font-semibold text-gray-800 mb-2 md:mb-0">Food Items</h2>
                          <div className="flex items-center space-x-2">
                            <select
                              className="p-2 border rounded focus:ring-2 focus:ring-orange-500"
                              value={filterCategory}
                              onChange={(e) => setFilterCategory(e.target.value)}
                            >
                              <option value="All">All Categories</option>
                              {categories.map(category => (
                                <option key={category.name} value={category.name}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {filteredFoodItems.length > 0 ? (
                            filteredFoodItems.map(item => (
                              <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                <div className="relative">
                                  <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-full h-48 object-cover"
                                  />
                                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                                    ₹{item.price}
                                  </div>
                                </div>
                                <div className="p-4">
                                  <div className="flex justify-between items-start">
                                    <h3 className="font-semibold">{item.name}</h3>
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                      {item.category}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                                  <div className="flex gap-2 mt-3">
                                    <button
                                      onClick={() => handleEdit(item)}
                                      className="flex items-center gap-1 text-blue-600 text-sm hover:text-blue-800"
                                    >
                                      <Edit size={14} /> Edit
                                    </button>
                                    <button
                                      onClick={() => handleDelete(item.id)}
                                      className="flex items-center gap-1 text-red-600 text-sm hover:text-red-800"
                                    >
                                      <Trash2 size={14} /> Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="col-span-2 text-center py-8 text-gray-500">
                              No food items found matching your criteria
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Management */}
              {activeTab === 'orders' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Management</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map(order => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{order.id.slice(0, 8)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.customerName || 'Guest'}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {order.items?.length || 0} items
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ₹{order.total?.toFixed(2) || '0.00'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(order.status || 'pending')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.createdAt?.toDate().toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
                  </div>
                </div>
              )}

              {/* User Management */}
              {activeTab === 'users' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">User Management</h2>
                  <div className="text-center py-12 text-gray-500">
                    <User className="w-12 h-12 mx-auto text-gray-400" />
                    <p className="mt-2">User management features coming soon</p>
                  </div>
                </div>
              )}

              {/* Offers & Promotions */}
              {activeTab === 'offers' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Offers & Promotions</h2>
                  <div className="text-center py-12 text-gray-500">
                    <Tag className="w-12 h-12 mx-auto text-gray-400" />
                    <p className="mt-2">Promotion management features coming soon</p>
                  </div>
                </div>
              )}

              {/* Settings */}
              {activeTab === 'settings' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Settings</h2>
                  <div className="text-center py-12 text-gray-500">
                    <Settings className="w-12 h-12 mx-auto text-gray-400" />
                    <p className="mt-2">Settings management features coming soon</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;