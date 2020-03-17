import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  genders = ['male', 'female'];
  questions = ['Your Favourite Teacher', 'Name of your first Pet'];
  signUpForm: FormGroup;

  submitted = false;
  citiesList = [
    {name: 'Mumbai', checked: false},
    {name: 'New York', checked: false},
    {name: 'Vancouver', checked: false}
  ];

  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      'username': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'secret': new FormControl(null, Validators.required),
      'gender': new FormControl(null, Validators.required),
      'cities': new FormArray([], Validators.required),
    });
  }

  submitForm() {
    this.submitted = true;
    if (this.signUpForm.valid) {
      alert('Submitted');
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
}
