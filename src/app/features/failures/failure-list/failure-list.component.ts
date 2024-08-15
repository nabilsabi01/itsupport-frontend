// failure-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Failure } from '../../../core/models/failure';
import { FailureService } from '../../../core/services/failure.service';

@Component({
  selector: 'app-failure-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, ToastModule, ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './failure-list.component.html',
  styleUrls: ['./failure-list.component.css']
})
export class FailureListComponent implements OnInit {
  failures: Failure[] = [];

  constructor(
    private failureService: FailureService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadFailures();
  }

  loadFailures() {
    this.failureService.getFailures().subscribe({
      next: (data) => {
        this.failures = data;
      },
      error: (error) => {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Failed to load failures'});
      }
    });
  }

  navigateToCreateFailure() {
    this.router.navigate(['/failures/new']);
  }

  editFailure(failure: Failure) {
    this.router.navigate(['/failures/edit', failure.id]);
  }

  deleteFailure(failure: Failure) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this failure?',
      accept: () => {
        this.failureService.deleteFailure(failure.id!).subscribe({
          next: () => {
            this.messageService.add({severity:'success', summary: 'Success', detail: 'Failure deleted successfully'});
            this.loadFailures();
          },
          error: (error) => {
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Failed to delete failure'});
          }
        });
      }
    });
  }
}