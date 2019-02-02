import {  ValidatorFn, AbstractControl } from "@angular/forms";
import * as _moment from 'moment';

export const myValidator = (field1, field2): ValidatorFn => (control: AbstractControl) => {
	if(control.parent) {
		const momentA = _moment(control.get(field1).value);
	    const momentB = _moment(control.get(field2).value);
	    if ((momentA < momentB) || (!control.parent.controls['checkme'].value)) {
	    	return null;
	    }
	    else if((control.get(field1).value==null || control.get(field2).value==null) && (control.parent.controls['checkme'].value)) {
	    	return { empty: { valid: false } };
	    }
	    else {
	    	return { myValidator: { valid: false } };
	    }
    }
}
