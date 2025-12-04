$(document).ready(function () {
  $('#registroForm').on('submit', function (e) {
    e.preventDefault();
    console.log("📨 Enviando dados de cadastro...");

    const name = $('#name').val().trim();
    const email = $('#email').val().trim();
    const password = $('#password').val().trim();
    const password_confirmation = $('#password_confirmation').val().trim();

    if (!name || !email || !password || !password_confirmation) {
      showAlert('Por favor, preencha todos os campos!', 'danger');
      return;
    }

    if (password.length < 8) {
      showAlert('A senha deve ter pelo menos 8 caracteres.', 'danger');
      return;
    }

    if (password !== password_confirmation) {
      showAlert('As senhas não coincidem.', 'danger');
      return;
    }

    $.ajax({
      url: 'http://127.0.0.1:8000/api/register',
      method: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        name,
        email,
        password,
        password_confirmation
      }),
      success: function (response) {
        console.log("✅ Cadastro realizado com sucesso:", response);
        // Agora vamos fazer login automático
        fazerLogin(email, password);
      },
      error: function (xhr) {
        console.error("❌ Erro no cadastro:", xhr);
        if (xhr.status === 422) {
            const errors = xhr.responseJSON?.errors;
            if (errors?.email) {
            showAlert(errors.email[0], 'danger');  // Exibe "O campo email já está em uso."
            } else if (errors?.password) {
            showAlert(errors.password[0], 'danger');
            } else {
            showAlert('Erro de validação. Verifique os campos!', 'danger');
            }
        } else {
            const msg = xhr.responseJSON?.message || 'Erro ao se conectar com o servidor.';
            showAlert(msg, 'danger');
        }
        }

    });
  });

  function fazerLogin(email, password) {
    $.ajax({
      url: 'http://127.0.0.1:8000/api/login',
      method: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({ email, password }),
      success: function (response) {
        if (response.access_token) {
          sessionStorage.setItem('jwt', response.access_token);
          console.log("🔐 Token salvo após cadastro:", response.access_token);
          window.location.href = 'ranking.html';
        } else {
          showAlert('Login automático falhou. Faça login manualmente.', 'warning');
          console.warn("⚠️ Resposta sem token:", response);
        }
      },
      error: function (xhr) {
        console.error("❌ Erro ao fazer login automático:", xhr);
        showAlert('Um email foi enviado para confirmar o seu cadatro, verfique sua caixa de entrada ou spam', 'warning');
      }
    });
  }

  function showAlert(message, type) {
    let container = $('#alertContainer');
    if (!container.length) {
      container = $('<div id="alertContainer" class="mt-3"></div>').insertBefore('#registroForm');
    }

    const alertHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
    container.html(alertHTML);
  }
});
