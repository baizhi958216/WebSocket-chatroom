import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';

@WebSocketGateway(3002)
export class ChatGateWay {
  @SubscribeMessage('findMessagesByUserId')
  findMessagesByUserId(@MessageBody() data: number): WsResponse<unknown> {
    const event = 'findMessagesByUserId';
    return {
      event,
      data: {
        msg: `Service accept ${data}`,
      },
    };
  }
}
