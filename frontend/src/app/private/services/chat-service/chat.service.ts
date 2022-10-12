import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { RoomI, RoomPaginateI } from 'src/app/model/room.interface';
import { UserI } from 'src/app/model/user.interface';
import { CustomSocket } from '../../sockets/custom-socket';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private socket: CustomSocket) {}

  sendMessage() {}
  getMessage() {
    return this.socket.fromEvent('message').pipe(map((data: any) => data));
  }

  getMyRooms() {
    return this.socket.fromEvent<RoomPaginateI>('rooms');
  }

  emitPaginateRooms(limit:number,page:number)
  {
    this.socket.emit('paginateRooms',{limit,page})
  }

  createRoom() {
    // const user2: UserI = {
    //   id: 2,
    // };

    // const room: RoomI = {
    //   name: 'TestRoom',
    //   users: [user2],
    // };

    // this.socket.emit('createRoom', room);
  }
}
