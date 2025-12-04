import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const SOCKET_URL = 'http://localhost:8080/ws';

const websocketConfig = {
  socket: null,
  stompClient: null,
  
  connect: function(userId, callbacks) {
    this.socket = new SockJS(SOCKET_URL);
    this.stompClient = Stomp.over(this.socket);

    this.stompClient.connect({}, (frame) => {
      if (callbacks.onOrderReceived) {
        this.subscribeToOrders(userId, callbacks.onOrderReceived);
      }
      if (callbacks.onNotificationReceived) {
        this.subscribeToNotification(userId, callbacks.onNotificationReceived);
      }
    }, (error) => {
      console.error('STOMP error:', error);
    });
  },

  subscribeToOrders: function(userId, onOrderReceived) {
    this.stompClient.subscribe(`/topic/orders/${userId}`, (orderMessage) => {
      const order = JSON.parse(orderMessage.body);
      console.log('Received order:', order);
      if (onOrderReceived) {
        onOrderReceived(order);
      }
    });
  },

  subscribeToNotification: function(userId, onNotificationReceived) {
    this.stompClient.subscribe(`/topic/notification/${userId}`, (notificationMessage) => {
      const notification = JSON.parse(notificationMessage.body);
      console.log('Received notification:', notification);
      if (onNotificationReceived) {
        onNotificationReceived(notification);
      }
    });
  },

  disconnect: function() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log("Disconnected");
  }
};

export default websocketConfig;