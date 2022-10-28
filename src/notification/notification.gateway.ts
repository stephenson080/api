import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
// import {Socket, Server} from 'socket.io'

@WebSocketGateway()
export class NotificationGateway {
  @WebSocketServer()
  server: any;
  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any): string {
    
  // }
}
