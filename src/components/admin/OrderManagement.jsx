import React from 'react';
import { Check, X, Truck, CheckCircle } from 'lucide-react';

const OrderManagement = ({ orders, updateOrderStatus }) => {
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
{new Date(order.created_at).toLocaleDateString()}
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
);
};

export default OrderManagement;