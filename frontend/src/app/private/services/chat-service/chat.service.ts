import { Injectable } from '@angular/core';
import { map } from 'rxjs';
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
}
