import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TaskService } from '../services/task.service';
import { IRegisterUser } from '../interface/IRegisterUser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule
  ],
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(TaskService);

  registerForm = this.fb.group({
    name: ['', Validators.required],
    role: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  onRegister() {
    if (this.registerForm.valid) {
      this.userService.getUsers().subscribe({
        next: (users) => {
          const nextId = users.length > 0 ? Math.max(...users.map(u => u.id!)) + 1 : 1;

          const newUser: IRegisterUser = {
            id: nextId,
            name: this.registerForm.value.name as string,
            role: this.registerForm.value.role as string,
            email: this.registerForm.value.email as string,
          };

          // Save new user
          this.userService.registerUser(newUser).subscribe({
            next: (response) => {
              alert('Registration successful!');
              this.registerForm.reset();
            },
            error: (err) => console.error('Error:', err),
          });
        },
        error: (err) => console.error('Error fetching users:', err),
      });
    } else {
      console.log('Form is invalid!');
    }
  }
}
