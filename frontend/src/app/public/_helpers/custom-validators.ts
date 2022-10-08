import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  static passwordsMatching(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const passwordConfirm = control.get('passwordConfirm')?.value;
    if (
      password !== null &&
      passwordConfirm !== null &&
      password === passwordConfirm
    ) {
      console.log('密码一致');
      return null;
    } else {
      console.log('密码不一致');
      return { passwordsNotMatching: true };
    }
  }
}
