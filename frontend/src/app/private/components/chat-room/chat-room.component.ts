import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { MessagePaginateI } from 'src/app/model/message.interface';
import { RoomI } from 'src/app/model/room.interface';
import { ChatService } from '../../services/chat-service/chat.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
})
export class ChatRoomComponent implements OnInit {
  @Input() chatRoom: RoomI;

  message$: Observable<MessagePaginateI> = this.chatService.getMessages().pipe(
    map((messagePaginate: MessagePaginateI) => {
      const items = messagePaginate.items.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      messagePaginate.items = items;
      return messagePaginate;
    })
  );

  chatMessage: FormControl = new FormControl(null, [Validators.required]);

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    this.chatService.leaveRoom(changes['chatRoom'].previousValue);
    console.log('Let it Send', changes['chatRoom'].previousValue);
    if (this.chatRoom) {
      this.chatService.joinRoom(this.chatRoom);
    }
  }

  ngOnDestory() {
    this.chatService.leaveRoom(this.chatRoom);
  }

  sendMessage() {
    console.log(this.chatMessage.value, this.chatRoom);
    this.chatService.sendMessage({
      text: this.chatMessage.value,
      room: this.chatRoom,
    });
    this.chatMessage.reset();
  }
}
