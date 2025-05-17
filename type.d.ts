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