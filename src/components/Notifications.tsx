
import React, { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Mock notifications data
const mockNotifications = [
  {
    id: "notif-1",
    title: "Order Confirmed",
    message: "Your order #ord-456 has been confirmed",
    time: "5 minutes ago",
    isRead: false,
    type: "order",
  },
  {
    id: "notif-2",
    title: "Payment Received",
    message: "Payment of $28.50 received for order #ord-456",
    time: "2 hours ago",
    isRead: false,
    type: "payment",
  },
  {
    id: "notif-3",
    title: "New Message",
    message: "You have a new message from John regarding Organic Rice",
    time: "Yesterday",
    isRead: true,
    type: "message",
  },
  {
    id: "notif-4",
    title: "Price Update",
    message: "Price of Sweet Corn has been updated to $0.85/ear",
    time: "2 days ago",
    isRead: true,
    type: "price",
  },
];

interface NotificationsProps {
  className?: string;
}

const Notifications = ({ className }: NotificationsProps) => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);
  
  const unreadCount = notifications.filter(notif => !notif.isRead).length;
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
  };
  
  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("relative", className)}>
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-primary text-xs"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <Separator />
        
        <div className="max-h-[300px] overflow-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={cn(
                  "p-4 hover:bg-muted/50 cursor-pointer", 
                  !notification.isRead && "bg-primary/5"
                )}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="grid gap-1">
                  <div className="flex items-start justify-between">
                    <p className={cn("text-sm font-medium", !notification.isRead && "text-primary")}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                  <p className="text-sm">
                    {notification.message}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          )}
        </div>
        
        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Button variant="ghost" size="sm" className="w-full text-center text-xs">
                View all notifications
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;
