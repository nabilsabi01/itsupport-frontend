import { Component } from '@angular/core';
import { SidebarComponent } from "./shared/components/sidebar/sidebar.component";
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from './features/layout/layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, LayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'itsupport-frontend';
}
