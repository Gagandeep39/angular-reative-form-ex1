import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  genders = ['male', 'female'];
  questions = ['Your Favourite Teacher', 'Name of your first Pet'];
  signUpForm: FormGroup;
  forbiddenNames = ['Gagan', 'Gaga'];
  forbiddenEmails = ['test@email.com', 'test@mail.com'];
  valueSubscription: Subscription;
  statusSubscription: Subscription;

  submitted = false;
  citiesList = [
    {name: 'Mumbai', checked: false},
    {name: 'New York', checked: false},
    {name: 'Vancouver', checked: false}
  ];

  // .bind(this) wont be required when using custom validator class
  // Async Validators are stored in separate array
  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      'userData': new FormGroup({
        'username': new FormControl(null, [Validators.required, this.forbiddenNameValidator.bind(this)]),
        'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmailAsync.bind(this)),
      }),
      'secret': new FormControl(null, Validators.required),
      'gender': new FormControl(null, Validators.required),
      'cities': new FormArray([], Validators.required),
      'hobbies': new FormArray([])
    });

    this.signUpForm.valueChanges.subscribe(value => {
      this.valueSubscription = value;
    });
    this.signUpForm.statusChanges.subscribe(value => {
      this.statusSubscription = value;
    });
  }

  submitForm() {
    this.submitted = true;
    if (this.signUpForm.valid) {
      alert('Submitted');
      this.submitted = false;
      this.signUpForm.reset();
      this.signUpForm.get('cities').reset({});
    }
    console.log(this.signUpForm);
  }

  // console.log(this.signupForm) can be used to find varios info about form values
  // We use Validator.required(i.e create reference to validator method) and not Validators.required()
  // This is because, angular will call the .required() method everytime it detect change instead of doing it once
  // we can write single validator or pass an array of validators
  // {{signupForm.controls.username.errors | json}} can be ised in html to see validators and their status
  // console.log(this.signupForm.controls) in typescript does the same thing
  onCheckboxChange(e: EventTarget, item: { name: string; checked: boolean }) {
    const checkArray: FormArray = this.signUpForm.get('cities') as FormArray;
    console.log((<HTMLInputElement>e).checked);
    if ((<HTMLInputElement>e).checked) {
      checkArray.push(new FormControl(item.name));
    } else {
      const index = checkArray.controls.findIndex((element: FormControl) => element.value.toString() === item.name);
      checkArray.removeAt(index);
    }
  }

  onAddHobby() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.signUpForm.get('hobbies')).push(control);
  }


  // Checks if value exists in array
  // If it does then value is forbidden and hence invalid
  forbiddenNameValidator(control: FormControl): { [s: string]: boolean } {
    if (this.forbiddenNames.indexOf(control.value) !== -1) {
      return {'nameIsForbidded': true};
    }
    return null;
    // return {'nameIsForbidded': false};  // Wwill still be considered as true, error
  }

  // Perform Async Validation
  // We return a promise using resolve()
  // Dont use (reject) as we are not throwing an exception
  forbiddenEmailAsync(control: FormControl): Promise<any> | Observable<any> | any {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.forbiddenEmails.indexOf(control.value) !== -1) {
          resolve({'emailIsForbidden': true});
        } else {
          resolve(null);
        }
      }, 1000);
    });
    return promise;
  }

  dummyValues() {
    this.signUpForm.setValue({
      'userData': {
        'username': 'Gagandeep',
        'email': 'singh.gagandeep3911@gmail.com'
      },
      'secret': 'Name of your first Pet',
      'gender': 'male',
      'cities': [],
      'hobbies': []
    });
  }

  dummyUsername() {
    this.signUpForm.patchValue({
      'userData': {
        'username': 'Gagandeep',
        'email': 'singh.gagandeep3911@gmail.com'
      }
    });

  }
}

// Reactive Form provides 2 observables
// 1. Status changes
// 2. Value Changes
// We can subscribe to them via ng On INit
