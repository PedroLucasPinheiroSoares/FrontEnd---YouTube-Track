$(document).ready(function () {
  $('#loginForm').on('submit', function (e) {
    e.preventDefault();
    console.log("🔐 Enviando formulário de login...");

    // Limpa mensagens e classes
    $('#emailGroup, #passwordGroup').removeClass('error');
    $('#emailError, #passwordError, #successMessage').hide();

    const email = $('#email').val().trim();
    const password = $('#password').val().trim();

    console.log("📧 Email:", email);
    console.log("🔑 Senha:", password);

    if (!email) {
      $('#emailGroup').addClass('error');
      $('#emailError').show();
      return;
    }

    if (!password || password.length < 8) {
      $('#passwordGroup').addClass('error');
      $('#passwordError').show();
      return;
    }

    $.ajax({
      url: 'http://127.0.0.1:8000/api/login',
      method: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({ email, password }),
      success: function (response) {
        console.log("✅ Resposta da API:", response);

        if (response.access_token) {
          try {
            sessionStorage.setItem('jwt', response.access_token);
            console.log("🧠 Token salvo no sessionStorage:", sessionStorage.getItem('jwt'));
          } catch (e) {
            console.error("❌ Erro ao salvar token:", e);
          }

          $('#successMessage')
            .text('Login bem-sucedido! Redirecionando...')
            .css('display', 'block');

          setTimeout(function () {
            console.log("➡️ Redirecionando para ranking.html...");
            window.location.href = 'ranking.html';
          }, 2000);
        } else {
          console.warn("⚠️ Token ausente na resposta.");
          alert('Token não recebido. Verifique o backend.');
        }
      },
      error: function (xhr) {
        console.error("❌ Erro na requisição AJAX:", xhr);
        const res = xhr.responseJSON;
        
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: res?.message || 'Erro ao fazer login.',
        });
      }
    });
  });

  $('#forgot-password-link').click(function(e) {
    e.preventDefault();
    
    Swal.fire({
        title: 'Redefinir senha',
        input: 'email',
        inputLabel: 'Digite seu e-mail cadastrado',
        inputPlaceholder: 'seu@email.com',
        inputValidator: (value) => {
            if (!value) {
                return 'Você precisa digitar um e-mail!';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/esqueceu-senha',
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                data: { email: result.value },
                success: (response) => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Sucesso!',
                        text: response.message
                    });
                },
                error: (xhr) => {
                  console.error("Erro completo:", xhr.responseJSON);
                  Swal.fire({
                      icon: 'error',
                      title: 'Erro',
                      text: xhr.responseJSON?.message || 'Falha ao enviar e-mail'
                  });
                }
            });
          }
      });
  });

});