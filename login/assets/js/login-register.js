
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
     $.ajax({
         type: "GET",
         datatype:"json",
         url: "https://run.mocky.io/v3/bf79a590-b73e-4e22-851d-090777336054",
         data:({
             email : $('#email').val(),
             password: $('#password').val()
         }),
         success: function(result)
         {
        //   window.localStorage.setItem("userDetail", result);
             $('#data').empty()
             if(result) // you should do your checking here
             {
               result.forEach( function( item ) {
                   $('#data').append('<li style="color:white;font-size:160%">' + item.username + '</li>')
                });

               //just to show that it went through
             }

         }
     });
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
    event.preventDefault();
   $.ajax({
       type: "GET",
       datatype:"json",
       url: "https://run.mocky.io/v3/bf79a590-b73e-4e22-851d-090777336054",
       data:({
           email : $('#email').val(),
           password: $('#password').val()
       }),
       success: function(result)
       {
      //   window.localStorage.setItem("userDetail", result);
           if(result) // you should do your checking here
           {
             var email = $('#email').val();
             var password = $('#password').val();
             let data = result.filter(user => user.useremail === email && user.password === password );
             if (data.length > 0 ){
                window.location = 'https://remoteservice1979.github.io/freeKidLearning/Study/Material/index.html';
             }else{

               alert('Wrong info');
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
