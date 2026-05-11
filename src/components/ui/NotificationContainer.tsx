import { useNotifications } from '../../contexts/NotificationContext';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export default function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    // UPDATED: Moved to bottom-right and added pointer-events-none
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm pointer-events-none">
      {notifications.map((notification) => (
        // UPDATED: Added pointer-events-auto to specific items
        <div key={notification.id} className="pointer-events-auto">
          <NotificationItem
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        </div>
      ))}
    </div>
  );
}

function NotificationItem({ notification, onClose }: { notification: Notification; onClose: () => void }) {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-[#4ecca3]" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-[#f0b15b]" />;
      default:
        return <Info className="w-5 h-5 text-[#5b6af0]" />;
    }
  };

  const getStyles = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-[#4ecca3]/10 border-[#4ecca3]/50 text-[#4ecca3]';
      case 'error':
        return 'bg-red-500/10 border-red-500/50 text-red-400';
      case 'warning':
        return 'bg-[#f0b15b]/10 border-[#f0b15b]/50 text-[#f0b15b]';
      default:
        return 'bg-[#5b6af0]/10 border-[#5b6af0]/50 text-[#5b6af0]';
    }
  };

  return (
    <div
      className={`flex items-start space-x-3 p-4 rounded-lg border shadow-lg animate-fadeIn ${getStyles()}`}
    >
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{notification.message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 hover:bg-black/10 rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}