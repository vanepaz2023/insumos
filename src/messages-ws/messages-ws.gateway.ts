import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { MessagesWsService } from './messages-ws.service';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces';
//el servidor va ser la aplicacion nest
//y el cliente va a ser la aplicacion mobil o una plicacion web que se va conectar al servidor
@WebSocketGateway({cors: true})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() wss: Server;
  
  constructor(private readonly messagesWsService: MessagesWsService,
    private readonly jwtService : JwtService) {}
  
  async  handleConnection(client: Socket) {
  const token= client.handshake.headers.authentication as string;
  let payload: JwtPayload;
try {
  payload = this.jwtService.verify(token);
      
  //  console.log('Cliente conectado',client.id);
  await this.messagesWsService.registerClient(client, payload.id);
} catch (error) {
   client.disconnect();
   return;
}

  console.log({conectados: this.messagesWsService.getConnectedClients()});
  //notifico a todos los clientes conectados que tal persona se conecto
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())
  }
  handleDisconnect(client:  Socket) {
    this.messagesWsService.removeClient(client.id)
    //console.log('Cliente desconectado',client.id);
  }
//!Emite unicamente el cliente
  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto){
/*   //message from server
  client.emit('message-from-server',{
    fullNAme: 'Soy Yo!',

    message: payload.message || 'no message!!'
  })
    
  } */
//! Emitir a todos Menos , al cliente inicial
  /* @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto){
  //message from server
  client.broadcast.emit('message-from-server',{
    fullNAme: 'Soy Yo!',

    message: payload.message || 'no message!!'
  })
    
  } */

  this.wss.emit('message-from-server',{
    fullName: this.messagesWsService.getUserFullName(client.id),

    message: payload.message || 'no message!!'
  })
  }
}
