import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {Machine} from './machine';
import {MachineListService} from './machine-list.service';

describe('Machine list service: ', () => {
  // A small collection of test machines
  const testMachines: Machine[] = [
    {
      _id: 'Washer00_id',
      type: 'Washer',
      running: true,
      status: 'Available',
      room_id: 'Indy'
    },
    {
      _id: 'Washer01_id',
      type: 'Washer',
      running: false,
      status: 'Unavailable',
      room_id: 'Gay'
    },
    {
      _id: 'Dryer00_id',
      type: 'Dryer',
      running: true,
      status: 'Available',
      room_id: 'Pine'
    }
  ];
  const mMachines: Machine[] = testMachines.filter(machine =>
    machine.type.toLowerCase().indexOf('m') !== -1
  );

  // We will need some url information from the machineListService to meaningfully test type filtering;
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

  it('getMachines() calls api/machines', () => {
    // Assert that the machines we get from this call to getMachines()
    // should be our set of test machines. Because we're subscribing
    // to the result of getMachines(), this won't actually get
    // checked until the mocked HTTP request "returns" a response.
    // This happens when we call req.flush(testMachines) a few lines
    // down.
    machineListService.getMachines().subscribe(
      machines => expect(machines).toBe(testMachines)
    );

    // Specify that (exactly) one request will be made to the specified URL.
    const req = httpTestingController.expectOne(machineListService.baseUrl);
    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');
    // Specify the content of the response to that request. This
    // triggers the subscribe above, which leads to that check
    // actually being performed.
    req.flush(testMachines);
  });

  it('getMachines(machineType) adds appropriate param string to called URL', () => {
    machineListService.getMachines('m').subscribe(
      machines => expect(machines).toEqual(mMachines)
    );

    const req = httpTestingController.expectOne(machineListService.baseUrl + '?type=m&');
    expect(req.request.method).toEqual('GET');
    req.flush(mMachines);
  });

  it('filterByType(machineType) deals appropriately with a URL that already had a type', () => {
    currentlyImpossibleToGenerateSearchMachineUrl = machineListService.baseUrl + '?type=f&something=k&';
    machineListService['machineUrl'] = currentlyImpossibleToGenerateSearchMachineUrl;
    machineListService.filterByType('m');
    expect(machineListService['machineUrl']).toEqual(machineListService.baseUrl + '?something=k&type=m&');
  });

  it('filterByType(machineType) deals appropriately with a URL that already had some filtering, but no type', () => {
    currentlyImpossibleToGenerateSearchMachineUrl = machineListService.baseUrl + '?something=k&';
    machineListService['machineUrl'] = currentlyImpossibleToGenerateSearchMachineUrl;
    machineListService.filterByType('m');
    expect(machineListService['machineUrl']).toEqual(machineListService.baseUrl + '?something=k&type=m&');
  });

  it('filterByType(machineType) deals appropriately with a URL has the keyword type, but nothing after the =', () => {
    currentlyImpossibleToGenerateSearchMachineUrl = machineListService.baseUrl + '?type=&';
    machineListService['machineUrl'] = currentlyImpossibleToGenerateSearchMachineUrl;
    machineListService.filterByType('');
    expect(machineListService['machineUrl']).toEqual(machineListService.baseUrl + '');
  });

  it('getMachineById() calls api/machines/id', () => {
    const targetMachine: Machine = testMachines[1];
    const targetId: string = targetMachine._id;
    machineListService.getMachineById(targetId).subscribe(
      machine => expect(machine).toBe(targetMachine)
    );

    const expectedUrl: string = machineListService.baseUrl + '/' + targetId;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(targetMachine);
  });

  it('machine list filters by name', () => {
    expect(testMachines.length).toBe(3);
    let machineName = 'a';
    expect(machineListService.filterMachines(testMachines, machineName, null).length).toBe(2);
  });

  it('machine list filters by age', () => {
    expect(testMachines.length).toBe(3);
    let machineAge = 37;
    expect(machineListService.filterMachines(testMachines, null, machineAge).length).toBe(2);
  });

  it('machine list filters by name and age', () => {
    expect(testMachines.length).toBe(3);
    let machineAge = 37;
    let machineName = 'i';
    expect(machineListService.filterMachines(testMachines, machineName, machineAge).length).toBe(1);
  });

  it('contains a machine named \'Chris\'', () => {
    expect(testMachines.some((machine: Machine) => machine.name === 'Chris')).toBe(true);
  });

  it('contain a machine named \'Jamie\'', () => {
    expect(testMachines.some((machine: Machine) => machine.name === 'Jamie')).toBe(true);
  });

  it('doesn\'t contain a machine named \'Santa\'', () => {
    expect(testMachines.some((machine: Machine) => machine.name === 'Santa')).toBe(false);
  });

  it('has two machines that are 37 years old', () => {
    expect(testMachines.filter((machine: Machine) => machine.age === 37).length).toBe(2);
  });

  it('contains all the machines', () => {
    expect(testMachines.length).toBe(3);
  });

  it('adding a machine calls api/machines/new', () => {
    const jesse_id = 'jesse_id';
    const newMachine: Machine = {
      _id: '',
      type: 'Dryer',
      running: true,
      status: 'Available',
      room_id: 'Indy'
    };

    machineListService.addNewMachine(newMachine).subscribe(
      id => {
        expect(id).toBe(jesse_id);
      }
    );

    const expectedUrl: string = machineListService.baseUrl + '/new';
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('POST');
    req.flush(jesse_id);
  });


});
