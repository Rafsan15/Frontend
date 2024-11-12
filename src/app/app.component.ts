import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import { EmployeeListComponent } from "./components/employee-list/employee-list.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [EmployeeListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Frontend';
}
