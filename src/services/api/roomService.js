import roomsData from "@/services/mockData/rooms.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let rooms = [...roomsData];

export const roomService = {
  async getAll() {
    await delay(300);
    return [...rooms];
  },

  async getById(id) {
    await delay(200);
    const room = rooms.find(r => r.Id === parseInt(id));
    if (!room) {
      throw new Error("Room not found");
    }
    return { ...room };
  },

  async create(roomData) {
    await delay(400);
    const newRoom = {
      ...roomData,
      Id: Math.max(...rooms.map(r => r.Id)) + 1,
      currentOccupancy: 0,
      status: "available"
    };
    rooms.push(newRoom);
    return { ...newRoom };
  },

  async update(id, roomData) {
    await delay(350);
    const index = rooms.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Room not found");
    }
    rooms[index] = { ...rooms[index], ...roomData };
    return { ...rooms[index] };
  },

  async delete(id) {
    await delay(300);
    const index = rooms.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Room not found");
    }
    const deletedRoom = rooms.splice(index, 1)[0];
    return { ...deletedRoom };
  },

  async getAvailableRooms() {
    await delay(250);
    return rooms.filter(room => room.status === "available");
  },

  async updateRoomStatus(id, status) {
    await delay(300);
    const index = rooms.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Room not found");
    }
rooms[index].status = status;
    return { ...rooms[index] };
  },

  async getMaintenanceAlerts() {
    await delay(200);
    return rooms.filter(room => 
      room.status === 'maintenance' || room.status === 'cleaning'
    );
  }
};