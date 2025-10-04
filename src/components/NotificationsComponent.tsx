import { Bell, CheckCircle, DollarSign, FileText, MessageCircleQuestionMark, ShoppingCart, Tag, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { handleError } from "../utils/handleError";
import Modal from "./Modal";
import clsx from "clsx";
import type { Notification } from "../types/user";
import { deleteUserNotification, getUserNotificationCount, getUserNotifications } from "../services/notificationService";

export default function NotificationsComponent() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsCount, setNotificationsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<Notification | null>(null);

  const { user } = useContext(UserContext);

  const fetchNotificationsCount = async () => {
    try {
      setLoading(true);
      const data = await getUserNotificationCount(user.id);
      setNotificationsCount(data);
    }
    catch (err) {
      handleError(err);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotificationsCount();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getUserNotifications(user.id);
      setNotifications(data);
    }
    catch (err) {
      handleError(err);
    }
    finally {
      setLoading(false);
    }
  };

  const handleBellClick = async () => {
    setIsDropdownOpen(prev => !prev);
    if (!isDropdownOpen) {
      await fetchNotifications();
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setNotifications(prev => prev.filter(n => n.id !== id));
      setNotificationsCount(notificationsCount - 1);
      await deleteUserNotification(id);
    }
    catch (err) {
      handleError(err);
    }
  };

  const getLabelStyles = (label: string) => {
    switch (label) {
      case "Novo":
        return "bg-blue-100 text-blue-800";
      case "Plaćanje":
        return "bg-green-100 text-green-800";
      case "Popust":
        return "bg-purple-100 text-purple-800";
      case "Kupovina":
        return "bg-orange-100 text-orange-800";
      case "Zahtev":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLabelIcon = (label: string) => {
    switch (label) {
      case "Novo":
        return <FileText size={16} />;
      case "Plaćanje":
        return <DollarSign size={16} />;
      case "Popust":
        return <Tag size={16} />;
      case "Kupovina":
        return <ShoppingCart size={16} />;
      case "Zahtev":
        return <CheckCircle size={16} />;
      case "Obaveštenje":
        return <MessageCircleQuestionMark size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  return (
    <div className="relative">
      <div
        className="w-10 h-10 rounded-full hover:bg-gray-300 flex items-center justify-center transition duration-300 mr-2 cursor-pointer relative"
        onClick={handleBellClick}
      >
        <Bell size={20} />

        {(notificationsCount !== 0 && !isDropdownOpen) && <div className="absolute -top-1 -right-1 bg-red-600 rounded-full text-white text-xs w-6 h-6 flex items-center justify-center">{notificationsCount > 9 ? "9+" : notificationsCount}</div>}
      </div>

      {isDropdownOpen && (
        <div className="absolute right-4 mt-12 w-70 sm:w-80 -top-6 bg-white border border-gray-200 rounded-md shadow-lg max-h-96 overflow-y-auto z-50">
          {loading
            ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                </div>
              )
            : notifications.length === 0
              ? (
                  <div className="p-4 text-sm text-gray-500">Nema novih notifikacija</div>
                )
              : (
                  notifications.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer transition duration-200"
                      onClick={() => setSelected(item)}
                    >
                      <div className="flex items-center space-x-2">
                        {getLabelIcon(item.label)}
                        <span className="text-sm font-medium">{item.title}</span>
                      </div>
                      <button
                        className="text-gray-400 hover:text-red-500 transition duration-200 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))
                )}
        </div>
      )}

      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title ?? "Notifikacija"}
        closeText="Zatvori"
      >
        {selected && (
          <div className="space-y-2">
            <span
              className={clsx(
                getLabelStyles(selected.label),
                "text-xs font-medium px-2.5 py-0.5 rounded-sm",
              )}
            >
              {selected.label}
            </span>

            <div
              className="prose text-sm max-w-none mt-5"
              dangerouslySetInnerHTML={{ __html: selected.message }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
