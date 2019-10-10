import {Component, OnInit} from '@angular/core';
import {MachineListService} from './machine-list.service';
import {User} from './machine';
import {Observable} from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {AddMachineComponent} from './add-machine.component';

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
  public machineName: string;
  public machineAge: number;
  public machineCompany: string;

  // The ID of the
  private highlightedID: string = '';

  // Inject the UserListService into this component.
  constructor(public machineListService: MachineListService, public dialog: MatDialog) {

  }

  isHighlighted(machine: Machine): boolean {
    return machine._id['$oid'] === this.highlightedID;
  }

  openDialog(): void {
    const newMachine: Machine = {_id: '', name: '', age: -1, company: '', email: ''};
    const dialogRef = this.dialog.open(AddMachineComponent, {
      width: '500px',
      data: {machine: newMachine}
    });

    dialogRef.afterClosed().subscribe(newMachine => {
      if (newMachine != null) {
        this.machineListService.addNewMachine(newMachine).subscribe(
          result => {
            this.highlightedID = result;
            this.refreshMachines();
          },
          err => {
            // This should probably be turned into some sort of meaningful response.
            console.log('There was an error adding the machine.');
            console.log('The newMachine or dialogResult was ' + newMachine);
            console.log('The error was ' + JSON.stringify(err));
          });
      }
    });
  }

  public updateName(newName: string): void {
    this.machineName = newName;
    this.updateFilter();
  }

  public updateAge(newAge:number): void {
    this.machineAge = newAge;
    this.updateFilter();
  }

  public updateFilter() {
    this.filteredMachines =
      this.machineListService.filterMachines(
        this.machines,
        this.machineName,
        this.machineAge
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
    this.userListService.getMachines(this.machineCompany).subscribe(
      users => {
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
