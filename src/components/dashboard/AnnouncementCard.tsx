
import { Announcement } from '@/types/helpdesk';
import { formatDistanceToNow } from 'date-fns';

interface AnnouncementCardProps {
  announcement: Announcement;
}

const AnnouncementCard = ({ announcement }: AnnouncementCardProps) => {
  return (
    <div className={`p-4 border rounded-lg shadow-sm ${announcement.important ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`}>
      <div className="flex justify-between items-start">
        <h3 className={`font-medium ${announcement.important ? 'text-red-800' : 'text-gray-900'}`}>
          {announcement.title}
        </h3>
        {announcement.important && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Important
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-gray-600">{announcement.content}</p>
      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <span>{announcement.createdBy}</span>
        <span>{formatDistanceToNow(new Date(announcement.createdAt), { addSuffix: true })}</span>
      </div>
    </div>
  );
};

export default AnnouncementCard;
