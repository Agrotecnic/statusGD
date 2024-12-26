import { getDatabase, ref, push, set, onValue, off, get, query, orderByChild, limitToLast } from 'firebase/database';
import { toast } from 'react-toastify';

class NotificationService {
  constructor() {
    this.db = getDatabase();
    this.listeners = new Map();
    this.notificationsRef = ref(this.db, 'notifications');
  }

  // Adicionar nova notificação
  async addNotification(notification) {
    try {
      const newNotificationRef = push(this.notificationsRef);
      await set(newNotificationRef, {
        ...notification,
        timestamp: Date.now(),
        read: false
      });
      return newNotificationRef.key;
    } catch (error) {
      console.error('Erro ao adicionar notificação:', error);
      throw error;
    }
  }

  // Marcar notificação como lida
  async markAsRead(notificationId) {
    try {
      const notificationRef = ref(this.db, `notifications/${notificationId}`);
      const snapshot = await get(notificationRef);
      
      if (snapshot.exists()) {
        await set(notificationRef, {
          ...snapshot.val(),
          read: true,
          readAt: Date.now()
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      throw error;
    }
  }

  // Buscar notificações não lidas
  async getUnreadNotifications() {
    try {
      const unreadQuery = query(
        this.notificationsRef,
        orderByChild('read'),
        limitToLast(20)
      );
      
      const snapshot = await get(unreadQuery);
      if (!snapshot.exists()) return [];

      const notifications = [];
      snapshot.forEach((child) => {
        if (!child.val().read) {
          notifications.push({
            id: child.key,
            ...child.val()
          });
        }
      });

      return notifications;
    } catch (error) {
      console.error('Erro ao buscar notificações não lidas:', error);
      throw error;
    }
  }

  // Escutar por novas notificações
  subscribeToNotifications(userId, callback) {
    if (this.listeners.has(userId)) {
      console.warn('Listener já existe para este usuário');
      return;
    }

    const userNotificationsRef = query(
      this.notificationsRef,
      orderByChild('userId'),
      limitToLast(20)
    );

    const listener = onValue(userNotificationsRef, (snapshot) => {
      const notifications = [];
      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          if (child.val().userId === userId) {
            notifications.push({
              id: child.key,
              ...child.val()
            });
          }
        });
      }
      callback(notifications);
    });

    this.listeners.set(userId, {
      ref: userNotificationsRef,
      listener
    });

    return () => this.unsubscribeFromNotifications(userId);
  }

  // Cancelar inscrição de notificações
  unsubscribeFromNotifications(userId) {
    const subscription = this.listeners.get(userId);
    if (subscription) {
      const { ref, listener } = subscription;
      off(ref, 'value', listener);
      this.listeners.delete(userId);
    }
  }

  // Mostrar notificação na interface
  showNotification(message, type = 'info', options = {}) {
    const defaultOptions = {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    };

    const finalOptions = { ...defaultOptions, ...options };

    switch (type) {
      case 'success':
        toast.success(message, finalOptions);
        break;
      case 'error':
        toast.error(message, finalOptions);
        break;
      case 'warning':
        toast.warning(message, finalOptions);
        break;
      default:
        toast.info(message, finalOptions);
    }
  }

  // Limpar todas as notificações
  async clearAllNotifications(userId) {
    try {
      const snapshot = await get(this.notificationsRef);
      if (!snapshot.exists()) return;

      const updates = {};
      snapshot.forEach((child) => {
        if (child.val().userId === userId) {
          updates[child.key] = {
            ...child.val(),
            read: true,
            readAt: Date.now()
          };
        }
      });

      await set(this.notificationsRef, updates);
      return true;
    } catch (error) {
      console.error('Erro ao limpar notificações:', error);
      throw error;
    }
  }
}

export default new NotificationService();