
function showRegisterForm(){
    $('.loginBox').fadeOut('fast',function(){
        $('.registerBox').fadeIn('fast');
        $('.login-footer').fadeOut('fast',function(){
            $('.register-footer').fadeIn('fast');
        });
        $('.modal-title').html('Register with');
    });
    $('.error').removeClass('alert alert-danger').html('');

}
function showLoginForm(){
    $('#loginModal .registerBox').fadeOut('fast',function(){
        $('.loginBox').fadeIn('fast');
        $('.register-footer').fadeOut('fast',function(){
            $('.login-footer').fadeIn('fast');
        });

        $('.modal-title').html('Login with');
    });
     $('.error').removeClass('alert alert-danger').html('');
}

function openLoginModal(){
    showLoginForm();
    setTimeout(function(){
        $('#loginModal').modal('show');
    }, 230);

}
function openRegisterModal(){
    showRegisterForm();
    setTimeout(function(){
        $('#loginModal').modal('show');
    }, 230);

}

function loginAjax(){
    /*   Remove this comments when moving to server
    $.post( "/login", function( data ) {
            if(data == 1){
                window.location.replace("/home");
            } else {
                 shakeModal();
            }
        });
    */
    event.preventDefault();
   $.ajax({
       type: "GET",
       datatype:"json",
       url: "https://run.mocky.io/v3/3c33d063-99f1-4cf7-ad31-d5f11652f15c",
       data:({
           email : $('#email').val(),
           password: $('#password').val()
       }),
       success: function(result)
       {
           if(result) // you should do your checking here
           {
             var email = $('#email').val();
             var password = $('#password').val();
             let data = result.filter(user => user.useremail === email && user.password === password );
             if (data.length > 0 ){
                window.location = 'http://www.google.com/';
             }else{
                window.location = 'http://www.yahoo.com/';
             }

               //just to show that it went through
           }
           else
           {
               $('#result').empty().addClass('error')
                   .append('Something is wrong.');
           }
       }
   });
   return false;

/*   Simulate error message from the server   */
     shakeModal();
}

function shakeModal(){
    $('#loginModal .modal-dialog').addClass('shake');
             $('.error').addClass('alert alert-danger').html("Invalid email/password combination");
             $('input[type="password"]').val('');
             setTimeout( function(){
                $('#loginModal .modal-dialog').removeClass('shake');
    }, 1000 );
}
