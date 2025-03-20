import React from 'react';
import { Order } from '../../../../types/product';

const OrdersSection: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      <div className="space-y-4">
        <p className="text-gray-600">No orders found.</p>
      </div>
    </div>
  );
};

export default OrdersSection;
