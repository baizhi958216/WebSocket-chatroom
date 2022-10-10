import { UnauthorizedException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/service/auth.service';
import { UserI } from 'src/user/model/user.interface';
import { UserService } from 'src/user/service/user-service/user.service';
import { RoomI } from '../model/room.interface';
import { RoomService } from '../service/room-service/room/room.service';
@WebSocketGateway({
  cors: {
    origin: [
      'https://hoppscotch.io',
      'http://localhost:4200',
      'http://localhost:3000',
    ],
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  title: string[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private roomService: RoomService,
  ) {}

  async handleConnection(socket: Socket) {
    console.log('连接+1');

    try {
      const decodedToken = await this.authService.verifyJwt(
        socket.handshake.headers.authorization,
      );
      const user: UserI = await this.userService.getOne(decodedToken.user.id);
      if (!user) {
        return this.disConnect(socket);
      } else {
        socket.data.user = user;
        const rooms = await this.roomService.getRoomsForUser(user.id, {
          page: 1,
          limit: 10,
        });
        return this.server.to(socket.id).emit('rooms', rooms);
      }
    } catch {
      return this.disConnect(socket);
    }
  }
  handleDisconnect() {
    console.log('连接断开');
  }

  private disConnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: RoomI): Promise<RoomI> {
    console.log(socket.data.user);
    console.log(room.users);

    return this.roomService.createRoom(room, socket.data.user);
  }
}
