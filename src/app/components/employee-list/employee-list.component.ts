import { CommonModule, UpperCasePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { error } from 'console';
@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule,UpperCasePipe, ReactiveFormsModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  http =inject(HttpClient);
  formBuilder = inject(FormBuilder);

  empList:any[]=[];
  departmentList: any[] = [];
  employeeForm: FormGroup;
  showModal = false;
  employeeIdToDelete: number | null = null;
  employeeIdToUpdate: number | null = null;
  isDeleteAction = true;

  constructor() {
    this.employeeForm = this.formBuilder.group({
      name: [''],
      email: [''],
      departmentId: [''],
      salary: ['']
    });
  }
  ngOnInit() {
    this.getAllEmp();
    this.getAllDepartment();
  }

  getAllEmp() {
    this.http.get("https://localhost:7196/api/Employees").subscribe((res: any) => {
      this.empList = res;
    }, (error) => {
      console.error('Error fetching employee list:', error);
    });
  }

  getAllDepartment() {
    this.http.get("https://localhost:7196/api/Department").subscribe((res: any) => {
      this.departmentList = res;
    }, (error) => {
      console.error('Error fetching department list:', error);
    });
  }

  openModalForDelete(id: number) {
    this.isDeleteAction = true;
    this.employeeIdToDelete = id;
    this.showModal = true;
  }

  openModalForUpdate(employee: any) {
    this.isDeleteAction = false;
    this.employeeForm.patchValue({
      name: employee.name,
      email: employee.email,
      departmentId: employee.departmentId,
      salary: employee.salary
    });

    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.employeeIdToDelete = null;
    this.employeeIdToUpdate = null;
  }

  addOrUpdateEmployee() {
    const employeeData = this.employeeForm.value;

    if (this.employeeIdToUpdate) {
      this.openModalForUpdate(employeeData)

    }
    else {

      this.http.post("https://localhost:7196/api/Employees", employeeData).subscribe(() => {
        this.getAllEmp();
        this.employeeForm.reset();
      }, (error) => {
        console.error('Error adding employee:', error);
      });
    }
  }

  editEmployee(employee: any) {
    this.employeeIdToUpdate = employee.id;
    this.employeeForm.patchValue({
      name: employee.name,
      email: employee.email,
      departmentId: employee.departmentId,
      salary: employee.salary
    });

  }

  confirmUpdate() {
    if (this.employeeIdToUpdate !== null) {
      const updatedEmployee = this.employeeForm.value;
      this.http.put(`https://localhost:7196/api/Employees/${this.employeeIdToUpdate}`, updatedEmployee).subscribe(() => {
        this.getAllEmp();
        this.closeModal();
        this.employeeForm.reset();
      }, (error) => {
        console.error('Error updating employee:', error);
      });
    }
  }

  confirmDelete() {
    if (this.employeeIdToDelete !== null) {
      this.http.delete(`https://localhost:7196/api/Employees/${this.employeeIdToDelete}`).subscribe(() => {
        this.getAllEmp();
        this.getAllDepartment();
        this.closeModal();
      }, (error) => {
        console.error('Error deleting employee:', error);
      });
    }
  }
}
