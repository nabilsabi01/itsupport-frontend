import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [PanelMenuModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  items: MenuItem[] = [];

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.initializeMenu();
  }

  initializeMenu() {
    if (this.authService.hasRole('ROLE_ADMIN')){
      this.items = [
        {
          label: 'Manage Accounts',
          icon: 'pi pi-users',
          command: () => this.router.navigate(['/accounts'])
        },
        {
          label: 'Manage Equipment',
          icon: 'pi pi-desktop',
          command: () => this.router.navigate(['/equipments'])
        },
        {
          label: 'Manage Failure',
          icon: 'pi pi-exclamation-triangle',
          command: () => this.router.navigate(['/failures'])
        }
      ];
    } else if (this.authService.hasRole('ROLE_ADMIN')) {
      this.items = [
        {
          label: 'My Tickets',
          icon: 'pi pi-ticket',
          command: () => this.router.navigate(['/dashboard/ticket/tickets'])
        },
        {
          label: 'Log out',
          icon: 'pi pi-sign-out',
          command: () => this.authService.logout()
        }
      ];
    } else if (this.authService.hasRole('ROLE_ADMIN')) {
      this.items = [
        {
          label: 'Tasks',
          icon: 'pi pi-check-square',
          command: () => this.router.navigate(['/task'])
        },
        {
          label: 'Log out',
          icon: 'pi pi-sign-out',
          command: () => this.authService.logout()
        }
      ];
    }
  }
}