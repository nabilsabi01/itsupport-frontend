
import { EquipmentStatus } from "../enums/equipment-status";

export interface Equipment {
  id: number;
  name: string;
  userId: number;
  status: EquipmentStatus;
}
