import {Component, OnInit} from '@angular/core';
import {MachineListService} from './machine-list.service';
import {Machine} from './machine';
import {Observable} from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'machine-list-component',
  templateUrl: 'machine-list.component.html',
  styleUrls: ['./machine-list.component.css'],
})

export class MachineListComponent implements OnInit {
  // These are public so that tests can reference them (.spec.ts)
  public machines: Machine[];
  public filteredMachines: Machine[];

  // These are the target values used in searching.
  // We should rename them to make that clearer.
  public machineType: string;
  public machineStatus: boolean;
  public machineRoom: string;

  // The ID of the
  private highlightedID: string = '';

  // Inject the UserListService into this component.
  constructor(public machineListService: MachineListService, public dialog: MatDialog) {

  }

  isHighlighted(machine: Machine): boolean {
    return machine._id['$oid'] === this.highlightedID;
  }

  // openDialog(): void {
  //   const newMachine: Machine = {_id: '', type: '', running: false, status: '', room_id: ''};
  //   const dialogRef = this.dialog.open(AddMachineComponent, {
  //     width: '500px',
  //     data: {machine: newMachine}
  //   });
  //
  //   dialogRef.afterClosed().subscribe(newUser => {
  //     if (newUser != null) {
  //       this.userListService.addNewUser(newUser).subscribe(
  //         result => {
  //           this.highlightedID = result;
  //           this.refreshUsers();
  //         },
  //         err => {
  //           // This should probably be turned into some sort of meaningful response.
  //           console.log('There was an error adding the user.');
  //           console.log('The newUser or dialogResult was ' + newUser);
  //           console.log('The error was ' + JSON.stringify(err));
  //         });
  //     }
  //   });
  // }

  public updateType(newType: string): void {
    this.machineType = newType;
    this.updateFilter();
  }

  public updateRoom(newRoom:string): void {
    this.machineRoom = newRoom;
    this.updateFilter();
  }

  public updateFilter() {
    this.filteredMachines =
      this.machineListService.filterMachines(
        this.machines,
        this.machineType,
        this.machineRoom
      );
  }

  /**
   * Starts an asynchronous operation to update the users list
   *
   */
  refreshMachines(): Observable<Machine[]> {
    // Get Users returns an Observable, basically a "promise" that
    // we will get the data from the server.
    //
    // Subscribe waits until the data is fully downloaded, then
    // performs an action on it (the first lambda)

    const machines: Observable<Machine[]> = this.machineListService.getMachines();
    machines.subscribe(
      machines => {
        this.machines = machines;
        this.updateFilter();
      },
      err => {
        console.log(err);
      });
    return machines;
  }

  loadService(): void {
    this.machineListService.getMachines(this.machineRoom).subscribe(
      machines => {
        this.machines = machines;
        this.filteredMachines = this.machines;
      },
      err => {
        console.log(err);
      }
    );
  }

  ngOnInit(): void {
    this.refreshMachines();
    this.loadService();
  }
}
