import residentsData from "@/services/mockData/residents.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let residents = [...residentsData];

export const residentService = {
  async getAll() {
    await delay(300);
    return [...residents];
  },

  async getById(id) {
    await delay(200);
    const resident = residents.find(r => r.Id === parseInt(id));
    if (!resident) {
      throw new Error("Resident not found");
    }
    return { ...resident };
  },

  async create(residentData) {
    await delay(400);
    const newResident = {
      ...residentData,
      Id: Math.max(...residents.map(r => r.Id)) + 1
    };
    residents.push(newResident);
    return { ...newResident };
  },

  async update(id, residentData) {
    await delay(350);
    const index = residents.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Resident not found");
    }
    residents[index] = { ...residents[index], ...residentData };
    return { ...residents[index] };
  },

  async delete(id) {
    await delay(300);
    const index = residents.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Resident not found");
    }
    const deletedResident = residents.splice(index, 1)[0];
    return { ...deletedResident };
  },

  async getCurrentResidents() {
    await delay(250);
    const today = new Date();
    return residents.filter(resident => {
      const checkOut = new Date(resident.checkOutDate);
      return checkOut >= today;
    });
  },

  async getResidentsByRoom(roomId) {
    await delay(200);
    return residents.filter(resident => resident.roomId === roomId);
  },

  async checkOut(id) {
    await delay(300);
    const index = residents.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Resident not found");
    }
    residents[index].checkOutDate = new Date().toISOString().split("T")[0];
    return { ...residents[index] };
  }
};