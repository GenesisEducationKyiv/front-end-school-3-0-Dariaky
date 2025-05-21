import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function imageUrlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i;

    return urlPattern.test(value) ? null : { invalidImageUrl: true };
  };
}
