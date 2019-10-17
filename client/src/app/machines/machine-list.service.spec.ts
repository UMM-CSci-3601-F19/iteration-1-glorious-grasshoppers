import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {Machine} from './machine';
import {MachineListService} from './machine-list.service';

describe('Machine list service: ', () => {
  // A small collection of test machines
  const testMachines: Machine[] = [
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
  ];
  const mMachines: Machine[] = testMachines.filter(machine =>
    machine.room_id.toLowerCase().indexOf('m') !== -1
  );

  // We will need some url information from the machineListService to meaningfully test room_id filtering;
  // https://stackoverflow.com/questions/35987055/how-to-write-unit-testing-for-angular-2-typescript-for-private-methods-with-ja
  let machineListService: MachineListService;
  let currentlyImpossibleToGenerateSearchMachineUrl: string;

  // These are used to mock the HTTP requests so that we (a) don't have to
  // have the server running and (b) we can check exactly which HTTP
  // requests were made to ensure that we're making the correct requests.
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    machineListService = new MachineListService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('contains a machine named \'Frog\'', () => {
    expect(testMachines.some((machine: Machine) => machine.name === 'Frog')).toBe(true);
  });

  it('contain a machine named \'Fish\'', () => {
    expect(testMachines.some((machine: Machine) => machine.name === 'Fish')).toBe(true);
  });

  it('doesn\'t contain a machine named \'Dog\'', () => {
    expect(testMachines.some((machine: Machine) => machine.name === 'Dog')).toBe(false);
  });

  it('contains all the machines', () => {
    expect(testMachines.length).toBe(3);
  });

});
