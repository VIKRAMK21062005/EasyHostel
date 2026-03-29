import React from 'react';
import { Clock, Truck, Check, XCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    Pending: {
      color: 'bg-yellow-100 text-yellow-700',
      icon: Clock,
    },
    Assigned: {
      color: 'bg-blue-100 text-blue-700',
      icon: Truck,
    },
    Delivered: {
      color: 'bg-green-100 text-green-700',
      icon: Check,
    },
    Cancelled: {
      color: 'bg-red-100 text-red-700',
      icon: XCircle,
    },
  };

  const config = statusConfig[status] || statusConfig.Pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
      <Icon size={16} />
      {status}
    </span>
  );
};

export default StatusBadge;