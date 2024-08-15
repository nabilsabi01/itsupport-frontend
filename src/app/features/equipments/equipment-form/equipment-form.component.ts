import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { EquipmentService } from '../../../core/services/equipment.service';
import { Equipment } from '../../../core/models/equipment';
import { EquipmentStatus } from '../../../core/enums/equipment-status';

@Component({
  selector: 'app-equipment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    InputNumberModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './equipment-form.component.html',
  styleUrls: ['./equipment-form.component.css']
})
export class EquipmentFormComponent implements OnInit {
  equipmentForm: FormGroup;
  isEditMode = false;
  equipmentId: number | null = null;
  statuses: { label: string; value: EquipmentStatus }[];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private equipmentService: EquipmentService,
    private messageService: MessageService
  ) {
    this.equipmentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      status: [null, Validators.required],
      userId: [null, [Validators.required, Validators.min(1)]]
    });

    this.statuses = Object.values(EquipmentStatus).map(status => ({
      label: this.formatStatusLabel(status),
      value: status
    }));
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.equipmentId = +params['id'];
        this.loadEquipment(this.equipmentId);
      }
    });
  }

  loadEquipment(id: number): void {
    this.equipmentService.getEquipment(id).subscribe({
      next: (equipment) => {
        this.equipmentForm.patchValue(equipment);
      },
      error: (error) => {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Failed to load equipment'});
      }
    });
  }

  onSubmit(): void {
    if (this.equipmentForm.valid) {
      const equipment: Equipment = this.equipmentForm.value;
      if (this.isEditMode && this.equipmentId) {
        this.equipmentService.updateEquipment(this.equipmentId, equipment).subscribe({
          next: () => {
            this.messageService.add({severity:'success', summary: 'Success', detail: 'Equipment updated successfully'});
            this.router.navigate(['/equipment']);
          },
          error: (error) => {
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Failed to update equipment'});
          }
        });
      } else {
        this.equipmentService.createEquipment(equipment).subscribe({
          next: () => {
            this.messageService.add({severity:'success', summary: 'Success', detail: 'Equipment created successfully'});
            this.router.navigate(['/equipment']);
          },
          error: (error) => {
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Failed to create equipment'});
          }
        });
      }
    } else {
      Object.keys(this.equipmentForm.controls).forEach(key => {
        const control = this.equipmentForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/equipments']);
  }

  getStatusLabel(status: EquipmentStatus): string {
    return this.formatStatusLabel(status);
  }

  private formatStatusLabel(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase().replace('_', ' ');
  }
}