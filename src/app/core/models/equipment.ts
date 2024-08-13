import { EquipmentStatus } from "../enums/equipment-status";

export interface Equipment {
  id?: number;
  name: string;
  status: EquipmentStatus;
  userId: number;
}