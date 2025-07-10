import notificationsData from "@/services/mockData/notifications.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let notifications = [...notificationsData];
let nextId = Math.max(...notifications.map(n => n.Id)) + 1;

export const notificationService = {
  async getAll() {
    await delay(300);
    return [...notifications];
  },

  async getById(id) {
    await delay(200);
    const notification = notifications.find(n => n.Id === parseInt(id));
    if (!notification) {
      throw new Error("Notification not found");
    }
    return { ...notification };
  },

  async create(notificationData) {
    await delay(400);
    const newNotification = {
      ...notificationData,
      Id: nextId++,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    notifications.push(newNotification);
    return { ...newNotification };
  },

  async update(id, notificationData) {
    await delay(350);
    const index = notifications.findIndex(n => n.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Notification not found");
    }
    notifications[index] = { ...notifications[index], ...notificationData };
    return { ...notifications[index] };
  },

  async delete(id) {
    await delay(300);
    const index = notifications.findIndex(n => n.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Notification not found");
    }
    const deletedNotification = notifications.splice(index, 1)[0];
    return { ...deletedNotification };
  },

  async markAsRead(id) {
    await delay(200);
    const index = notifications.findIndex(n => n.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Notification not found");
    }
    notifications[index].isRead = true;
    return { ...notifications[index] };
  },

  async markAllAsRead() {
    await delay(300);
    notifications = notifications.map(n => ({ ...n, isRead: true }));
    return [...notifications];
  },

  async getUnreadCount() {
    await delay(150);
    return notifications.filter(n => !n.isRead).length;
  },

  async getByType(type) {
    await delay(250);
    return notifications.filter(n => n.type === type);
  },

  async generateSystemNotifications() {
    await delay(400);
    // This would integrate with booking and room services
    // For now, return existing notifications
    return [...notifications];
  }
};