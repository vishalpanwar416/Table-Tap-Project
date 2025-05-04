import React from 'react';
import { Clock, CheckCircle, XCircle, Truck } from 'lucide-react';

const statusIcons = {
  pending: <Clock className="w-4 h-4 text-yellow-500" />,
  completed: <CheckCircle className="w-4 h-4 text-green-500" />,
  cancelled: <XCircle className="w-4 h-4 text-red-500" />,
  preparing: <Truck className="w-4 h-4 text-blue-500" />
};

const OrderCard = ({ order, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-4 rounded-lg shadow mb-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">Order #{order.id.slice(0, 8)}</h3>
        <div className="flex items-center">
          {statusIcons[order.status]}
          <span className="ml-2 text-sm capitalize">{order.status}</span>
        </div>
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>{order.items?.length || 0} items</span>
        <span>₹{order.total?.toFixed(2) || '0.00'}</span>
      </div>
    </div>
  );
};

export default OrderCard;