import bookingsData from "@/services/mockData/bookings.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let bookings = [...bookingsData];

export const bookingService = {
  async getAll() {
    await delay(300);
    return [...bookings];
  },

  async getById(id) {
    await delay(200);
    const booking = bookings.find(b => b.Id === parseInt(id));
    if (!booking) {
      throw new Error("Booking not found");
    }
    return { ...booking };
  },

  async create(bookingData) {
    await delay(400);
    const newBooking = {
      ...bookingData,
      Id: Math.max(...bookings.map(b => b.Id)) + 1,
      createdAt: new Date().toISOString().split("T")[0]
    };
    bookings.push(newBooking);
    return { ...newBooking };
  },

  async update(id, bookingData) {
    await delay(350);
    const index = bookings.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Booking not found");
    }
    bookings[index] = { ...bookings[index], ...bookingData };
    return { ...bookings[index] };
  },

  async delete(id) {
    await delay(300);
    const index = bookings.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Booking not found");
    }
    const deletedBooking = bookings.splice(index, 1)[0];
    return { ...deletedBooking };
  },

  async getUpcomingBookings() {
    await delay(250);
    const today = new Date();
    return bookings.filter(booking => {
      const checkIn = new Date(booking.checkInDate);
      return checkIn >= today && booking.status === "confirmed";
    });
  },

  async getTodayCheckIns() {
    await delay(200);
    const today = new Date().toISOString().split("T")[0];
    return bookings.filter(booking => 
      booking.checkInDate === today && booking.status === "confirmed"
    );
  },

  async getTodayCheckOuts() {
    await delay(200);
    const today = new Date().toISOString().split("T")[0];
    return bookings.filter(booking => 
booking.checkOutDate === today && booking.status === "confirmed"
    );
  },

  async getNotificationAlerts() {
    await delay(200);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    return bookings.filter(booking => 
      (booking.checkInDate === todayStr || booking.checkInDate === tomorrowStr ||
       booking.checkOutDate === todayStr || booking.checkOutDate === tomorrowStr) &&
      booking.status === 'confirmed'
    );
  }
};