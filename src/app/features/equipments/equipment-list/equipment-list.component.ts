import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EquipmentService } from '../../../core/services/equipment.service';
import { Equipment } from '../../../core/models/equipment';

@Component({
  selector: 'app-equipment-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './equipment-list.component.html',
  styleUrls: ['./equipment-list.component.css']
})
export class EquipmentListComponent implements OnInit {
  equipments: Equipment[] = [];

  @ViewChild('dt') dt: any;

  constructor(
    private equipmentService: EquipmentService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadEquipments();
  }

  loadEquipments(): void {
    this.equipmentService.getAllEquipments().subscribe({
      next: (data) => {
        this.equipments = data;
      },
      error: (error) => {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Failed to load equipments'});
      }
    });
  }

  navigateToCreate(): void {
    this.router.navigate(['/equipment/new']);
  }

  editEquipment(equipment: Equipment): void {
    this.router.navigate(['/equipment/edit', equipment.id]);
  }

  deleteEquipment(equipment: Equipment): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this equipment?',
      accept: () => {
        this.equipmentService.deleteEquipment(equipment.id!).subscribe({
          next: () => {
            this.messageService.add({severity:'success', summary: 'Success', detail: 'Equipment deleted'});
            this.loadEquipments();
          },
          error: (error) => {
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Failed to delete equipment'});
          }
        });
      }
    });
  }
}