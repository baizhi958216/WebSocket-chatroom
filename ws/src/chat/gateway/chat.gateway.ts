import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';

@WebSocketGateway(1146)
export class ChatGateWay {
  @SubscribeMessage('hello')
  hello(@MessageBody() data: any): any {
    const msg = [
      {
        id: 1,
        name: '刻晴',
        newestmessage: '卖牛杂',
        m_time: new Date().toLocaleTimeString(),
        m_unread: 5,
      },
      {
        id: 2,
        name: '纳西妲',
        newestmessage: '打羽毛球',
        m_time: new Date().toLocaleTimeString(),
        m_unread: 1,
      },
      {
        id: 1,
        name: '可莉',
        newestmessage: '炸鱼',
        m_time: new Date().toLocaleTimeString(),
        m_unread: 4,
      },
    ];
    return {
      event: 'hello',
      data: data,
      msg: msg,
    };
  }

  @SubscribeMessage('findMessagesByUserId')
  findMessagesByUserId(@MessageBody() data: number): any {
    const message = [
      {
        pos: 'oppo',
        msg: '你好',
      },
      {
        pos: 'own',
        msg: '你好',
      },
      {
        pos: 'own',
        msg: '请问有什么问题吗',
      },
      {
        pos: 'own',
        msg: '我在上课',
      },
      {
        pos: 'oppo',
        msg: '我本是显赫世家的少爷，却被诡计多端的奸人所害！家人弃我！师\
      门逐我！甚至断我灵脉！重来一生，今天肯德基疯狂星期四！谁请我吃？',
      },
      {
        pos: 'own',
        msg: '?',
      },
      {
        pos: 'oppo',
        msg: 'V我50',
      },
    ];
    const event = 'findMessagesByUserId';
    console.log(data);

    return {
      event,
      data: message,
    };
  }

  @SubscribeMessage('findNewestMessagesByUserId')
  findNewestMessagesByUserId(@MessageBody() data: number): WsResponse<unknown> {
    const event = 'findNewestMessagesByUserId';
    console.log('User Id: ', data);
    return {
      event,
      data: {},
    };
  }

  @SubscribeMessage('emitMessageWithUserid')
  emitMessageWithUserid(@MessageBody() data: any): any {
    const event = 'emitMessageWithUserid';
    console.log(data);
    return {
      event,
      data: data,
      message: data.msg,
    };
  }
}
