export interface Machine {
  _id: string;
  name: string;
  type: string;
  running: boolean;
  status: string;
  // position: {
  //   x: number,
  //   y: number
  // };
  room_id: string;
}
