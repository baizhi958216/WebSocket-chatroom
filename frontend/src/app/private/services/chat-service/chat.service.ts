import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs';
import { RoomI, RoomPaginateI } from 'src/app/model/room.interface';
import { CustomSocket } from '../../sockets/custom-socket';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private socket: CustomSocket,private snackbar:MatSnackBar) {}

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

  createRoom(room:RoomI) {
    this.socket.emit('createRoom',room)
    this.snackbar.open(`Room ${room.name} created successfully`,'close',{
      duration:2000,horizontalPosition:'right',verticalPosition:'top'
    })
  }
}
