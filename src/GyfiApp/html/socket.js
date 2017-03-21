export default () => {
  return `
  <html>
  <head>
    <script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
    <script src="https://cdn.socket.io/socket.io-1.4.5.js"></script>
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel='stylesheet'>
  </head>
  <body>
  <div class = 'row'>
    <div class = 'col-md-6'>
      <h3>Токен</h3>
      <input class = 'token-input form-control' placeholder='Токен' token='1'>
      <input class = 'userId-input form-control' placeholder='id собеседника' userId='1'>
      <div class = 'chat-1'>
        <div>Текст</div>
        <div>Текст</div>
        <div>Текст</div>
        <div>Текст</div>
      </div>
      <input class = 'text-input form-control' placeholder='Текст' socket='1'>
    </div>
    <div class = 'col-md-6'>
      <h3>Токен</h3>
      <input class = 'token-input form-control' placeholder='Токен' token='2'>
      <input class = 'userId-input form-control' placeholder='id собеседника' userId='2'>
      <div class = 'chat-2'>
        <div>Текст</div>
        <div>Текст</div>
      </div>
      <input class = 'text-input form-control' placeholder='Текст' socket='2'>
    </div>
  </div>
  <script>
    var url = location.protocol + '//' + location.hostname
    if (location.port) {
      url += ':' + location.port
    }
    url += '/chat'
    console.log(url)
    // url = '/chat';
    var userId_1 = '';
    var userId_2 = '';
    $('.userId-input').change(function(event) {
      const number = $(this).attr('userId')
      const userId = $(this).val()
      if (number == 1) {
        userId_1 = userId
        socket_1.emit('getStory', { userId: userId_1 },function(err, story) {
          console.log(err, story)
          $('.chat-1').html('')
          story.forEach(function(message) {
            $('.chat-1').append('<div>' + message.text + '</div>')
          })
        })
      }
      if (number == 2) {
        userId_2 = userId
        socket_2.emit('getStory', { userId: userId_2 },function(err, story) {
          console.log(err, story)
          $('.chat-2').html('')
          story.forEach(function(message) {
            $('.chat-2').append('<div>' + message.text + '</div>')
          })
        })
      }
    })
    console.log(location)
    function initSocket(token, id) {
      console.log(url)
      console.log({ token, token })
      const socket = io.connect(url, {
        query: {
          token: token,
        },
        transports: ['websocket'],
      })
      socket.on('message', function(message) {
        console.log(message)
        $('.chat-'+id).append('<div>' + message.text + '</div>')
      })
      return socket
    }
    var socket_1 = initSocket('123', 1)
    var socket_2 = initSocket('456', 2)
    $('.token-input').change(function(event){
      const element = $(this)
      const tokenId = element.attr('token')
      const token = element.val()
      console.log(tokenId, token)
      if (tokenId == 1) {
        socket_1.disconnect()
        socket_1 = initSocket(token, 1)
      }
      if (tokenId == 2) {
        socket_2.disconnect()
        socket_2 = initSocket(token, 2)
      }
    })
    $('.text-input').keypress(function(e){
      const keyCode = e.keyCode
      const element = $(this)
      const text = element.val()
      const socketId = $(this).attr('socket')
      if (keyCode === 13) {
        console.log(text)
        const _socket = socketId == 1 ? socket_1 : socket_2
        const userId = socketId == 1 ? userId_1 : userId_2
        console.log(_socket)
        sendMessage(text, _socket, userId)
        element.val('')
      }
    })
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
  </script>
  </body>
  </html>`
}
