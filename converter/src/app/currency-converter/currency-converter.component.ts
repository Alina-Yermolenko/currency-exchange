import { Component, OnInit } from '@angular/core';

import { DataService } from './../data-service.service';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.css'],
  providers: [DataService]
})
export class CurrencyConverterComponent implements OnInit {
  currenciesNames = [];
  listOfCurrencies = ['usd']

  firstCurrencyValue: any;
  firstCurrencySelect = ''

  secondCurrencyValue: any;
  secondCurrencySelect = ''
  rate: number = 0;
  disabled: boolean = true;
  euroRate: number = 0;
  dollarRate: number = 0;
  response: any;
  constructor(private service: DataService) { }

  async ngOnInit(): Promise<void> {
    this.getHrivniaRate()
    this.currenciesNames = await this.service.getInitialData();

    for (const [key, obj] of Object.entries(this.currenciesNames)) {
      this.listOfCurrencies.push(key);
    }
  }

  async getHrivniaRate() {
    const result = await fetch(`http://www.floatrates.com/daily/uah.json`)
    const response = await result.json();
    this.euroRate = +(1 / response.eur.rate).toFixed(2) ;
    this.dollarRate = +(1 / response.usd.rate).toFixed(2) ;
  }

  setSelect(number: number, value: string) {
    if (number === 1) {
      this.firstCurrencySelect = value
      this.changeCurrency(1)
    }
    if (number === 2) {
      this.secondCurrencySelect = value
      this.changeCurrency(2)
    }
  }

  setValue(number: number, event: any) {
    if (number === 1) {
      this.firstCurrencyValue = +event.target.value;
      console.log(this.firstCurrencyValue)
      this.changeCurrency()
    }
    if (number === 2) {
      this.secondCurrencyValue = +event.target.value;
      this.changeCurrency()
    }
    let calculateValue = number === 2 ? 1 : 2;
    this.calculate(calculateValue);
  }

  async changeCurrency(value?: any) {

    if (!this.secondCurrencySelect || !this.firstCurrencySelect) {
      this.disabled = true
      return;
    }
    this.disabled = false;

    if (this.secondCurrencySelect === this.firstCurrencySelect) {
      this.firstCurrencyValue = this.secondCurrencyValue
      return;
    }

    if (this.firstCurrencySelect) {
      const result = await fetch(`http://www.floatrates.com/daily/${this.firstCurrencySelect}.json`)
      this.response = await result.json();
    }
    if (this.response && this.secondCurrencySelect) {
      this.rate = this.response[this.secondCurrencySelect].rate;
    }

    if (value === 1) {
      this.calculate(2)
    }
    if (value === 2) {
      this.calculate(1)
    }

    return;
  }

  calculate(value: number) {
    if (value === 2) {
      this.secondCurrencyValue = (+this.firstCurrencyValue * this.rate).toFixed(2)
    }
    if (value === 1) {
      this.firstCurrencyValue = (+this.secondCurrencyValue / this.rate).toFixed(2)
    }
  }
}
