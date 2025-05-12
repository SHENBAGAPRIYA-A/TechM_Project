
import React from 'react';
import { HelpdeskRequest } from '@/types/helpdesk';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { CalendarDays, Clock } from 'lucide-react';

interface RequestCardProps {
  request: HelpdeskRequest;
  showStudentInfo?: boolean;
  isDetailView?: boolean;
}

const RequestCard: React.FC<RequestCardProps> = ({ 
  request, 
  showStudentInfo = false,
  isDetailView = false
}) => {
  // Status badge styles
  const statusStyles = {
    open: 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    resolved: 'bg-purple-100 text-purple-800',
    closed: 'bg-green-100 text-green-800',
  };

  // Priority badge styles
  const priorityStyles = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-orange-100 text-orange-800',
    high: 'bg-red-100 text-red-800',
  };

  // Request type label mapping
  const requestTypeLabels = {
    maintenance: 'Maintenance',
    it: 'IT Support',
    'id-card': 'ID Card',
    financial: 'Financial',
    academic: 'Academic',
    other: 'Other',
  };

  // Format the title or use a default based on type
  const requestTitle = request.title || `${requestTypeLabels[request.type]} Request`;
  
  // Show urgency badge if request is marked as urgent
  const isUrgent = request.isUrgent === true;

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${isDetailView ? 'p-6' : 'p-4'}`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[request.status]}`}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityStyles[request.priority]}`}>
              {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
            </span>
            {isUrgent && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Urgent
              </span>
            )}
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            {requestTitle}
          </h3>
          {showStudentInfo && (
            <p className="mt-1 text-sm text-gray-600">
              By: {request.studentName} ({request.studentId})
              {request.department && ` - ${request.department}`}
            </p>
          )}
        </div>
        <div className="text-xs text-gray-500 flex flex-col items-end">
          <span>{formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}</span>
          {request.deadline && (
            <div className="flex items-center mt-1 text-amber-700">
              <Clock className="h-3 w-3 mr-1" />
              <span>Due: {formatDistanceToNow(new Date(request.deadline), { addSuffix: true })}</span>
            </div>
          )}
        </div>
      </div>

      <p className="mt-2 text-sm text-gray-600">
        {request.description}
      </p>

      {/* Timeline view for status updates */}
      {isDetailView && request.statusUpdates.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-sm text-gray-900 mb-2">Status Timeline</h4>
          <div className="space-y-3">
            {request.statusUpdates.map((update, index) => (
              <div key={update.id} className={`border-l-2 ${index === 0 ? 'border-gray-400' : 'border-gray-200'} pl-3`}>
                <p className="text-sm font-medium text-gray-900">
                  {update.status.charAt(0).toUpperCase() + update.status.slice(1)}
                  <span className="font-normal text-gray-500 ml-2">
                    by {update.updatedBy} • {formatDistanceToNow(new Date(update.updatedAt), { addSuffix: true })}
                  </span>
                </p>
                <p className="text-sm text-gray-600 mt-1">{update.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Supporting documents */}
      {isDetailView && request.supportingDocuments && request.supportingDocuments.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-sm text-gray-900 mb-2">Supporting Documents</h4>
          <div className="flex flex-wrap gap-2">
            {request.supportingDocuments.map((doc, index) => (
              <a 
                key={index} 
                href={doc} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200"
              >
                Document {index + 1}
              </a>
            ))}
          </div>
        </div>
      )}

      {!isDetailView && (
        <div className="mt-4">
          <Link
            to={`/requests/${request.id}`}
            className="text-sm font-medium text-helpdesk-600 hover:text-helpdesk-800"
          >
            View details →
          </Link>
        </div>
      )}
    </div>
  );
};

export default RequestCard;
