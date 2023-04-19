import { AbstractControl, ValidatorFn } from '@angular/forms';

export function fileValidator(allowedExtensions: string[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const file = control.value;
    if (file) {
      const extension = file.name.split('.')[1].toLowerCase();
      if (!allowedExtensions.includes(extension)) {
        return { invalidExtension: true };
      }
      return null;
    }
    return null;
  };
}

