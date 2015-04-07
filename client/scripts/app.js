// YOUR CODE HERE:

$(document).ready(function(){
  $(".get").on('click',function(){app.fetch();})

  $(".post").on('click', function(){
    var text = $('.textBox').val();
    var user = $('#username').val();
    var room = $('#roomname').val();

    var message = {
      'username': user,
      'text': text,
      'roomname': room,
    };
    app.send(message);
  });

  $(".getRoom").on('click', function(){
    var text = $('.textBox').val();
    var user = $('#username').val();
    var room = $('#roomname').val();

    var message = {
      'username': user,
      'text': text,
      'roomname': room,
    };
    app.fetchRoom(user, room);
  });

  $("body").on('click', 'a', function(){
    var person = $(this).data("name");
    app.friends[person] = person

    console.log($(this).data("name"));
  })
});

var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox'

app.init = function(){};

app.friends = {};

app.clearMessages = function(){
  $(document).ready(function(){
    $('#chats').html('');

  })
}

app.addMessage = function(message){

      $(document).ready(function(){
        var $chats = $('#chats');
        var $newMessage = $('<div class="message"></div>');
        $newMessage.html("<p>"+ message.username + " : "+ message.text + "</p>");
        $newMessage.appendTo($chats);
      })
}

app.send = function(message){
  $.ajax({
    // always use this url
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
      app.addMessage(message);
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.fetch = function(){
    $.ajax({
      // always use this url
      url: app.server,
      data: {order: "-updatedAt", limit: 20},
      type: 'GET',
      // data: JSON.parse(message),
      contentType: 'application/json',
      success: function (data) {
        console.log(data);

        $(document).ready(function(){
            var $messages = $('#newMessages');
            $messages.html('');

            var index = data.results.length - 1;

            while(index >= 0){
              var message = data.results[index];
              var $message = $('<div class="message"></div>');

              // if this username (message.username) is our friend (in our app.friends object)
              // then give it's message a friends class

              if(app.friends[message.username]){
                $message.html("<p class= 'friends'>"+ "<a href='#' data-name="+_.escape(message.username)
                +" class='friends'>" + _.escape(message.username) + "</a>" + ":" + _.escape(message.text)
                + "(" + message.createdAt + ")" +  "</p>");
              } else {
              // if not, do not give it a friends class
                $message.html("<p>"+ "<a href='#' data-name="+_.escape(message.username)
                +">" + _.escape(message.username) + "</a>" + ":" + _.escape(message.text)
                + "(" + message.createdAt + ")" +  "</p>");
              }

              $message.appendTo($messages);
              index -= 1;
            }
        })

        console.log('chatterbox: Message received');
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to receive message');
      }
    });

};

app.fetchRoom = function(user, room){

    $.ajax({
      // always use this url
      url: app.server,
      data: 'where= {"roomname": "'+room+'", "username": "'+user+'"}', order: "-updatedAt",
      type: 'GET',
      // data: JSON.parse(message),
      contentType: 'application/json',
      success: function (data) {
        console.log(data);

        $(document).ready(function(){
            var $messages = $('#newMessages');
            $messages.html('');

            var index = data.results.length - 1;

            while(index >= 0){
              var message = data.results[index];
              var $message = $('<div class="message"></div>');

              $message.html("<p>"+ "<a href='#' data-name="+_.escape(message.username) +" class='friends'>"
              + _.escape(message.username) + "</a>" + ":" + _.escape(message.text) + "(" + message.createdAt + ")" +  "</p>");

              $message.appendTo($messages);
              index -= 1;
            }
        })

        console.log('chatterbox: Message received');
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to receive message');
      }
    });

};

// XSS notes: 3 ways to do it
// underscore escape / regex / or in html



