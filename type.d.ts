interface AuthCredentials {
  email: string;
  password: string;
}

enum VehicleType {
  Cargo = "cargo",
  Passenger = "passenger",
}

enum VehicleStatus {
  Available = "avaliable",
  Maintenance = "maintenance",
  InUse = "in_use",
  ApprovalPending = "approval_pending",
}

enum BookingApprove {
  pending = "pending",
  ApprovedLv1 = "approved_lv1",
  Approved = "approved",
  Rejected = "rejected",
}

enum driverStatus {
  Available = "available",
  OnDuty = "on_duty",
  OnLeave = "on_leave",
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface JWT {
  id: string;
  role: string;
}

interface Destination {
  id: string;
  name: string;
  type: string;
}

interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  phoneNumber: string;
  status: driverStatus;
}

interface Vehicle {
  id: string;
  model: string;
  regNumber: string;
  type: VehicleType;
  fuelConsumption: number;
  status: VehicleStatus;
}

interface VehicleParams {
  model: string;
  regNumber: string;
  type: VehicleType;
  fuelConsumption: number;
}

interface Maintenance {
  id: string;
  vehicleId: string;
  scheduledDate: Date;
  notes: string;
  status: boolean;
}

interface MaintenanceParams {
  vehicleId: string;
  scheduledDate: Date;
  status: boolean;
  notes: string;
}

interface Booking {
  id: string;
  requesterId: string;
  approver1Id: string;
  approver2Id: string;
  driverId: string;
  vehicleId: string;
  destinationId: string;
  distance: number;
  startDate: Date;
  endDate: Date;
  status: BookingApprove;
  notes: string;
  createdAt: Date;
}

interface BookingParams {
  requesterId: string;
  approver1Id: string;
  approver2Id: string;
  driverId: string;
  vehicleId: string;
  destinationId: string;
  distance: number;
  startDate: Date;
  endDate: Date;
  status: BookingApprove;
  notes: string;
}
