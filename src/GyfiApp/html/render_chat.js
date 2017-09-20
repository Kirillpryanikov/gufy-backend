export default (ctx) => {
  return `
  <html>
  <head>
    <script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
    <script src="https://cdn.socket.io/socket.io-1.4.5.js"></script>
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel='stylesheet'>
  </head>
  <body>
  
  <div class="container">
    
    <!--<button class="receiver">Pick #1</button>-->
    <!--<button class="receiver">Pick #2</button>-->
    <!--<button class="receiver">Pick #3</button>-->
  
    <div class="form-group">
      <input id="text-message" class="form-control" type="text" placeholder="Message...">
      <button id="send-message" class="btn btn-primary" type="button">Send</button>
    </div>
    
    <div class="chat"></div>
  </div>
  
  <script>
    // Определяем адрес URL для подключения к сокету (серверу)
    let url = location.protocol + '//' + location.hostname;
    if (location.port) {
      url += ':' + location.port
    }
    url += '/chat';
    
    // необходимо получить токен и определить id получателя
    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6' +
     'IjIwNCIsImZpcnN0TmFtZSI6IkFETUlOIFVTRVIiLCJpYXQiO' +
      'jE1MDIyNzgzMDd9.BhY7vGh1kCI6GcROVVsHEqC4NeVWDRPg1PDECu8YacY';
    
    let fromUser = 204;
    let toUser = 1;
    /**
     * Инициализирует сокеты по кастомному namespace '/chat'
     * @param token Токен пользователя, который генерируется при регистрации
     * @param id Идентификатор пользователя
     */
    function initSocket(token, id) {

      console.log({ token, token });
      const socket = io.connect(url, {
        query: {
          token: token,
        },
        transports: ['websocket'],
      });
      socket.on('message', function(message) {
        console.log(message);
        $('.chat').append('<div>' + message.text + '</div>');
      });
      return socket;
    }
    
    /**
    * Обработчик отправки сообщения
    * @param text Текст сообщения
    * @param socket Сокет
    * @param userId Идентификатор получателя
    */
    function sendMessage(text, socket, userId) {
      socket.emit('message', {
        text: text,
        to: userId,
        files: [
          {
            type: 'png',
            name: 'cover',
            url: '/storage/cover_1479728490295.png',
          }
        ],
      })
    }
    
//    $('.receiver').on('click', (e) => {
//      let id = e.target.innerText;
//      toUser = id[id.length - 1];
//      console.log(toUser);
//    })
//    
    
    let socket = initSocket(token, fromUser );

    $('#send-message').on('click', (e) => {
      const text = $('#text-message').val();
      _socket = socket;
      userId = fromUser;
      sendMessage(text, _socket, userId);
      $('#text-message').val('');
    });
    
    
    
  </script>
  </body>
  </html>
  `
}
