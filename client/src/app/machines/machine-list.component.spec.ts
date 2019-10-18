import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Machine } from './machine';
import { MachineListComponent } from './machine-list.component';
import {Observable} from 'rxjs';
import {CustomModule} from '../custom.module';
import {MachineListService} from './machine-list.service';
import {FormsModule} from '@angular/forms';
import 'rxjs-compat/add/observable/of';

describe('MachineListComponent', () => {

  let machineList: MachineListComponent;
  let fixture: ComponentFixture<MachineListComponent>;

  let machineListServiceStub: {
    getMachines: () => Observable<Machine[]>
  };

  beforeEach(() => {
    // MachineService for test purposes

    machineListServiceStub = {
      getMachines: () => Observable.of( [
        {
          _id: 'frog_id',
          name: 'Frog',
          type: 'washer',
          running: true,
          status: 'normal',
          room_id: 'pond'
        },
        {
          _id: 'fish_id',
          name: 'Fish',
          type: 'washer',
          running: false,
          status: 'normal',
          room_id: 'pond'
        },
        {
          _id: 'cactus_id',
          name: 'Cactus',
          type: 'dryer',
          running: false,
          status: 'broken',
          room_id: 'desert'
        }
      ])
    };


    TestBed.configureTestingModule({
      imports: [CustomModule],
      declarations: [MachineListComponent],
      // Don't provide the real service!!!
      providers: [{provide: MachineListService, useValue: machineListServiceStub}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(MachineListComponent);
      machineList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

});

describe('Misbehaving Machine List', () => {
  let machineList: MachineListComponent;
  let fixture: ComponentFixture<MachineListComponent>;

  let machineListServiceStub: {
    getMachines: () => Observable<Machine[]>
  };

  beforeEach(() => {
    // stub UserService for test purposes
    machineListServiceStub = {
      getMachines: () => Observable.create(observer => {
        observer.error('Error-prone observable');
      })
    };

    TestBed.configureTestingModule({
      imports: [FormsModule, CustomModule],
      declarations: [MachineListComponent],
      providers: [{provide: MachineListService, useValue: machineListServiceStub}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(MachineListComponent);
      machineList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('generates an error if we don\'t set up a MachineListService', () => {
    // Since the observer throws an error, we don't expect users to be defined.
    expect(machineList.machines).toBeUndefined();
  });
});
