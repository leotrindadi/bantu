// Tipos relacionados ao módulo Hotelaria

export interface Room {
  id: string;
  number: string;
  type: 'single' | 'double' | 'suite' | 'deluxe';
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning' | 'cleaning-in-progress';
  price: number;
  capacity: number;
  amenities: string[];
  consumables?: string[]; // IDs dos consumíveis
  consumablesDisplay?: string[]; // Nomes dos consumíveis para exibição
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  nationality: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  guestId: string;
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'completed' | 'cancelled';
  totalAmount: number;
  guests: number;
  specialRequests?: string;
  paymentMethod?: string;
  consumablesCost?: number;
  createdAt: Date;
  updatedAt: Date;
  // Relacionamentos
  guest?: Guest;
  room?: Room;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'room-service' | 'laundry' | 'spa' | 'restaurant' | 'transport';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  document: string;
  position: string;
  department?: string;
  salary?: number;
  hire_date: Date;
  status: 'active' | 'inactive' | 'on-leave';
  created_at: Date;
  updated_at: Date;
}

export interface RoomCleaningLog {
  id: string;
  room_id: string;
  employee_id: string;
  started_at: Date;
  completed_at?: Date;
  notes?: string;
  created_at: Date;
  // Relacionamentos
  employee?: Employee;
  room?: Room;
}