// failure-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FailureType } from '../../../core/enums/failure-type';
import { Failure } from '../../../core/models/failure';
import { FailureService } from '../../../core/services/failure.service';

@Component({
  selector: 'app-failure-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './failure-form.component.html',
  styleUrls: ['./failure-form.component.css']
})
export class FailureFormComponent implements OnInit {
  failureForm: FormGroup;
  failureTypes: { label: string, value: FailureType }[];
  isEditMode = false;
  failureId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private failureService: FailureService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.failureForm = this.fb.group({
      description: ['', Validators.required],
      type: [null, Validators.required]
    });

    this.failureTypes = Object.values(FailureType).map(type => ({
      label: type,
      value: type
    }));
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.failureId = +id;
      this.loadFailure(this.failureId);
    }
  }

  loadFailure(id: number) {
    this.failureService.getFailure(id).subscribe({
      next: (failure) => {
        this.failureForm.patchValue(failure);
      },
      error: (error) => {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Failed to load failure'});
      }
    });
  }

  onSubmit() {
    if (this.failureForm.valid) {
      const failureData: Failure = this.failureForm.value;
      
      const operation = this.isEditMode
        ? this.failureService.updateFailure(this.failureId!, failureData)
        : this.failureService.createFailure(failureData);

      operation.subscribe({
        next: () => {
          this.messageService.add({severity:'success', summary: 'Success', detail: `Failure ${this.isEditMode ? 'updated' : 'created'} successfully`});
          this.navigateToFailures();
        },
        error: (error) => {
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Failed to save failure'});
        }
      });
    } else {
      this.failureForm.markAllAsTouched();
    }
  }

  navigateToFailures() {
    this.router.navigate(['/failures']);
  }

  cancel() {
    this.navigateToFailures();
  }
}