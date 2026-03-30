import { Component, OnInit, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { email, FormRoot,form,FormField, required, minLength, pattern,validateStandardSchema, disabled} from '@angular/forms/signals';
import { ChangeDetectionStrategy } from '@angular/core';
import { DataFlowService } from '../../shared-services/data-flow.service';
import { ValidationService } from '../../shared-services/validation.service';
import { AuthService } from '../services/auth.service';
import { RegisterModel,defaultRegisterModel, RegisterSchema } from './register.model';
import { APP_TEXT } from '../../app.constant';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FormField, FormRoot, Navbar, Footer],
  templateUrl: './register.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register implements OnInit {
  registerModel = signal<RegisterModel>(defaultRegisterModel);
  registerForm :any;
  readonly authText = APP_TEXT.AUTH;
  isSubmitting = signal(false);
  submitError = signal<string | null>(null);

  private router = inject(Router);
  private dataFlowService = inject(DataFlowService);
  private authService = inject(AuthService);

  constructor(private readonly validationService: ValidationService){
     this.registerForm = form(this.registerModel,(schemaPath)=> {
       validateStandardSchema(schemaPath,RegisterSchema);
       this.validationService.checkEmailAvailability(schemaPath);
       
     },
     {
       submission:{
          action : async (f) => {
             this.onSubmit();
             f().reset({...defaultRegisterModel});
          },
       }
     }
    );
  }
  ngOnInit(): void {
    if (this.dataFlowService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(){
    if(this.registerForm().valid()){
      const { name, email, password } = this.registerForm().value();
      this.isSubmitting.set(true);
      this.submitError.set(null);
      this.authService.register(name, email, password).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isSubmitting.set(false);
          if (error.error?.error) {
            this.submitError.set(error.error.error);
          } else {
            this.submitError.set('Registration failed. Please try again.');
          }
        },
      });
    }
  }
  
}
