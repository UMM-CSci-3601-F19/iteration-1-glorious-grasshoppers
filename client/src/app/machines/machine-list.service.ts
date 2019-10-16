import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs';

import {Machine} from './machine';
import {environment} from '../../environments/environment';


@Injectable()
export class MachineListService {
  readonly baseUrl: string = environment.API_URL;
  private machineUrl: string = this.baseUrl + 'machines';
  private roomUrl: string = this.baseUrl + 'rooms';

  constructor(private http: HttpClient) {
  }

  getMachines(machineRoom?: string): Observable<Machine[]> {
    this.filterByRoom(machineRoom);
    return this.http.get<Machine[]>(this.machineUrl);
  }

  getMachineById(id: string): Observable<Machine> {
    return this.http.get<Machine>(this.machineUrl + '/' + id);
  }

  public filterMachines(machines: Machine[], searchName: string, searchType: string, searchRoom: string): Machine[] {

    let filteredMachines = machines;

    if (searchName != null) {
      searchName = searchName.toLocaleLowerCase();

      filteredMachines = filteredMachines.filter(machine => {
        return !searchName || machine.name.toLowerCase().indexOf(searchName) !== -1;
      });
    }

    // Filter by machine type
    if (searchType != null) {
      searchType = searchType.toLocaleLowerCase();

      filteredMachines = filteredMachines.filter(machine => {
        return !searchType || machine.type.toLowerCase().indexOf(searchType) !== -1;
      });
    }

    // if (searchRoom != null) {
    //   searchRoom = searchRoom.toLocaleLowerCase();
    //
    //   filteredMachines = filteredMachines.filter(machine => {
    //     return !searchRoom || machine.room_id.toLowerCase().indexOf(searchRoom) !== -1;
    //   });
    // }
    //Filter by room id
      if (searchRoom != null) {
        filteredMachines = filteredMachines.filter(machine => {
          return !searchRoom || machine.room_id == searchRoom;
        });
      }

      return filteredMachines;
    }

    filterByRoom(machineRoom?: string): void {
      if (!(machineRoom == null || machineRoom === '')) {
        if (this.parameterPresent('room_id=')) {
          // there was a previous search by room that we need to clear
          this.removeParameter('room_id=');
        }
        if (this.machineUrl.indexOf('?') !== -1) {
          // there was already some information passed in this url
          this.machineUrl += 'room_id=' + machineRoom + '&';
        } else {
          // this was the first bit of information to pass in the url
          this.machineUrl += '?room_id=' + machineRoom + '&';
        }
      } else {
        // there was nothing in the box to put onto the URL... reset
        if (this.parameterPresent('room_id=')) {
          let start = this.machineUrl.indexOf('room_id=');
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
      // The server sends the hex version of the new user back
      // so we know how to find/access that user again later.
      responseType: 'text' as 'json'
    };

    // Send post request to add a new user with the user data as the body with specified headers.
    return this.http.post<string>(this.machineUrl + '/new', newMachine, httpOptions);
  }
}
