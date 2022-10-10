import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private socket: Socket) {}

  sendMessage() {}
  getMessage() {
    return this.socket.fromEvent('message').pipe(map((data: any) => data));
  }
}
