import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {FormService} from "../../services/form.service";
import {Country} from "../../common/country";
import {State} from "../../common/state";
import {MyValidators} from "../../validators/my-validators";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  totalPrice: number = 0;
  totalQuantity: number = 0;

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
              private formService: FormService) {
  }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), MyValidators.notOnlyWhitespace]),
        lastName:  new FormControl('', [Validators.required, Validators.minLength(2), MyValidators.notOnlyWhitespace]),
        email: new FormControl('',
          [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        country:  new FormControl('', [Validators.required]),
        street:  new FormControl('', [Validators.required, Validators.minLength(2), MyValidators.notOnlyWhitespace]),
        city:  new FormControl('', [Validators.required, Validators.minLength(2), MyValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        zipCode:  new FormControl('', [Validators.required, Validators.minLength(2), MyValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        country:  new FormControl('', [Validators.required]),
        street:  new FormControl('', [Validators.required, Validators.minLength(2), MyValidators.notOnlyWhitespace]),
        city:  new FormControl('', [Validators.required, Validators.minLength(2), MyValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        zipCode:  new FormControl('', [Validators.required, Validators.minLength(2), MyValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: [''],
      })
    })

    const startMonth: number = new Date().getMonth() + 1;
    console.log('Start month ' + startMonth);

    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
        console.log('Retrieved months ' + JSON.stringify(data))
      }
    )

    this.formService.getCreditCardYears().subscribe(
      data => {
        this.creditCardYears = data;
        console.log('Retrieved years ' + JSON.stringify(data))
      }
    )

    this.formService.getCountries().subscribe(
      data => {
        this.countries = data
      }
    )
  }

  onSubmit() {
    console.log('Handling the submit button');
    if (this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    }
    console.log(this.checkoutFormGroup.get('customer').value);
    console.log(this.checkoutFormGroup.get('customer').value.email);
  }

  get firstName() {return this.checkoutFormGroup.get('customer.firstName');}
  get lastName() {return this.checkoutFormGroup.get('customer.lastName');}
  get email() {return this.checkoutFormGroup.get('customer.email');}

  get shippingAddressStreet() {return this.checkoutFormGroup.get('shippingAddress.street');}
  get shippingAddressCity() {return this.checkoutFormGroup.get('shippingAddress.city');}
  get shippingAddressState() {return this.checkoutFormGroup.get('shippingAddress.state');}
  get shippingAddressCountry() {return this.checkoutFormGroup.get('shippingAddress.country');}
  get shippingAddressZipCode() {return this.checkoutFormGroup.get('shippingAddress.zipCode');}

  get billingAddressStreet() {return this.checkoutFormGroup.get('billingAddress.street');}
  get billingAddressCity() {return this.checkoutFormGroup.get('billingAddress.city');}
  get billingAddressState() {return this.checkoutFormGroup.get('billingAddress.state');}
  get billingAddressCountry() {return this.checkoutFormGroup.get('billingAddress.country');}
  get billingAddressZipCode() {return this.checkoutFormGroup.get('billingAddress.zipCode');}

  copyShippingAddressToBillingAddress(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
        .setValue(this.checkoutFormGroup.controls.shippingAddress.value);
      this.billingAddressStates = this.shippingAddressStates
    } else {
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingAddressStates = [];
    }
  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.formService.getStates(countryCode).subscribe(
      data => {

        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }

        // select first item by default
        formGroup.get('state').setValue(data[0]);
      }
    );
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    // console.log('creditCardFormGroup:', creditCardFormGroup);

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);
    // console.log('selectedYear:', selectedYear)

    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else startMonth = 1;

    this.formService.getCreditCardMonths(startMonth)
      .subscribe(data => {
        this.creditCardMonths = data
      });
  }

}
