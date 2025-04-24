import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '../ui/Card';
import { FileTextIcon, ClipboardIcon, UsersIcon } from 'lucide-react';

type Activity = {
  id: string;
  type: 'invoice' | 'form' | 'client';
  title: string;
  description: string;
  timestamp: string;
};

interface RecentActivityCardProps {
  activities: Activity[];
}

const ActivityIcon: React.FC<{ type: Activity['type'] }> = ({ type }) => {
  switch (type) {
    case 'invoice':
      return <FileTextIcon size={16} className="text-blue-600" />;
    case 'form':
      return <ClipboardIcon size={16} className="text-purple-600" />;
    case 'client':
      return <UsersIcon size={16} className="text-teal-600" />;
    default:
      return null;
  }
};

const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ activities }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
          )}
          
          {activities.map((activity) => (
            <div key={activity.id} className="flex">
              <div className="mr-3 mt-0.5">
                <div className="p-2 rounded-full bg-gray-100">
                  <ActivityIcon type={activity.type} />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                  <span className="text-xs text-gray-500">{activity.timestamp}</span>
                </div>
                <p className="text-sm text-gray-600 mt-0.5">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;