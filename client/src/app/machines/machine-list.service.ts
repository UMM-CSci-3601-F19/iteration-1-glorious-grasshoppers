import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs';

import {Machine} from './machine';
import {environment} from '../../environments/environment';


@Injectable()
export class MachineListService {
  readonly baseUrl: string = environment.API_URL + 'machines';
  private machineUrl: string = this.baseUrl;

  constructor(private http: HttpClient) {
  }

  getMachines(machineCompany?: string): Observable<Machine[]> {
    this.filterByCompany(machineCompany);
    return this.http.get<Machine[]>(this.machineUrl);
  }

  getMachineById(id: string): Observable<Machine> {
    return this.http.get<Machine>(this.machineUrl + '/' + id);
  }

  public filterMachines(machines: Machine[], searchName: string, searchAge: number): Machine[] {

    let filteredMachines = machines;

    // Filter by name
    if (searchName != null) {
      searchName = searchName.toLocaleLowerCase();

      filteredMachines = filteredMachines.filter(machine => {
        return !searchName || machine.name.toLowerCase().indexOf(searchName) !== -1;
      });
    }

    // Filter by age
    if (searchAge != null) {
      filteredMachines = filteredMachines.filter(machine => {
        return !searchAge || machine.age == searchAge;
      });
    }

    return filteredMachines;
  }

  /*
  //This method looks lovely and is more compact, but it does not clear previous searches appropriately.
  //It might be worth updating it, but it is currently commented out since it is not used (to make that clear)
  getMachinesByCompany(machineCompany?: string): Observable<Machine> {
      this.machineUrl = this.machineUrl + (!(machineCompany == null || machineCompany == "") ? "?company=" + machineCompany : "");
      console.log("The url is: " + this.machineUrl);
      return this.http.request(this.machineUrl).map(res => res.json());
  }
  */

  filterByCompany(machineCompany?: string): void {
    if (!(machineCompany == null || machineCompany === '')) {
      if (this.parameterPresent('company=')) {
        // there was a previous search by company that we need to clear
        this.removeParameter('company=');
      }
      if (this.machineUrl.indexOf('?') !== -1) {
        // there was already some information passed in this url
        this.machineUrl += 'company=' + machineCompany + '&';
      } else {
        // this was the first bit of information to pass in the url
        this.machineUrl += '?company=' + machineCompany + '&';
      }
    } else {
      // there was nothing in the box to put onto the URL... reset
      if (this.parameterPresent('company=')) {
        let start = this.machineUrl.indexOf('company=');
        const end = this.machineUrl.indexOf('&', start);
        if (this.machineUrl.substring(start - 1, start) === '?') {
          start = start - 1;
        }
        this.machineUrl = this.machineUrl.substring(0, start) + this.machineUrl.substring(end + 1);
      }
    }
  }

  private parameterPresent(searchParam: string) {
    return this.machineUrl.indexOf(searchParam) !== -1;
  }

  //remove the parameter and, if present, the &
  private removeParameter(searchParam: string) {
    let start = this.machineUrl.indexOf(searchParam);
    let end = 0;
    if (this.machineUrl.indexOf('&') !== -1) {
      end = this.machineUrl.indexOf('&', start) + 1;
    } else {
      end = this.machineUrl.indexOf('&', start);
    }
    this.machineUrl = this.machineUrl.substring(0, start) + this.machineUrl.substring(end);
  }

  addNewMachine(newMachine: Machine): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        // We're sending JSON
        'Content-Type': 'application/json'
      }),
      // But we're getting a simple (text) string in response
      // The server sends the hex version of the new machine back
      // so we know how to find/access that machine again later.
      responseType: 'text' as 'json'
    };

    // Send post request to add a new machine with the machine data as the body with specified headers.
    return this.http.post<string>(this.machineUrl + '/new', newMachine, httpOptions);
  }
}
