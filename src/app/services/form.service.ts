import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Country} from "../common/country";
import {map} from "rxjs/operators";
import {State} from "../common/state";

interface GetResponseCounties {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}

@Injectable({
  providedIn: 'root'
})
export class FormService {

  private countriesUrl = 'http://localhost:8080/api/countries'
  private statesUrl = 'http://localhost:8080/api/states'

  constructor(private httpClient: HttpClient) {
  }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCounties>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStates(theCountryCode: string): Observable<State[]> {
    const getSearchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`
    return this.httpClient.get<GetResponseStates>(getSearchStatesUrl).pipe(
      map(response => response._embedded.states)
    );
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {

    let data: number[] = [];
    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }
    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {

    let data: number[] = [];
    let startYear = new Date().getFullYear()
    for (let theYear = new Date().getFullYear(); theYear < startYear + 10; theYear++) {
      data.push(theYear);
    }
    return of(data);
  }
}
