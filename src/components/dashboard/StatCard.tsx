
import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  change?: {
    value: string;
    positive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  change,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className="h-12 w-12 rounded-full bg-helpdesk-100 flex items-center justify-center text-helpdesk-600">
          {icon}
        </div>
      </div>
      {(description || change) && (
        <div className="mt-4">
          {description && <p className="text-sm text-gray-600">{description}</p>}
          {change && (
            <p className={`text-sm ${change.positive ? 'text-green-600' : 'text-red-600'} flex items-center`}>
              {change.positive ? '↑' : '↓'} {change.value}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
