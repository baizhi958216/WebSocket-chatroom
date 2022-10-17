import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { combineLatest, map, Observable, startWith, tap } from 'rxjs';
import { MessagePaginateI } from 'src/app/model/message.interface';
import { RoomI } from 'src/app/model/room.interface';
import { ChatService } from '../../services/chat-service/chat.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
})
export class ChatRoomComponent implements OnInit, AfterViewInit {
  @Input() chatRoom: RoomI;
  @ViewChild('messages') private messagesScoller: ElementRef;

  messagesPaginate$: Observable<MessagePaginateI> = combineLatest([
    this.chatService.getMessages(),
    this.chatService.getAddedMessage().pipe(startWith(null)),
  ]).pipe(
    map(([messagePaginate, message]) => {
      if (
        message &&
        message.room.id === this.chatRoom.id &&
        !messagePaginate.items.some((m) => m.id === message.id)
      ) {
        messagePaginate.items.push(message);
      }
      const items = messagePaginate.items.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      messagePaginate.items = items;
      return messagePaginate;
    }),
    tap(() => this.scrollToBottom())
  );

  chatMessage: FormControl = new FormControl(null, [Validators.required]);

  constructor(private chatService: ChatService) {}

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.chatService.leaveRoom(changes['chatRoom'].previousValue);
    console.log('Let it Send', changes['chatRoom'].previousValue);
    if (this.chatRoom) {
      this.chatService.joinRoom(this.chatRoom);
    }
  }

  ngOnDestory(): void {
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

  scrollToBottom(): void {
    setTimeout(() => {
      this.messagesScoller.nativeElement.scrollTop =
        this.messagesScoller.nativeElement.scrollHeight;
    }, 1);
  }
}
