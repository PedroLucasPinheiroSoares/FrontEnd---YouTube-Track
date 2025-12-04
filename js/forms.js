// Validação do formulário
document.getElementById('canalForm').addEventListener('submit', function(event) {
    const form = event.target;
    if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
});

// Cálculo automático da receita
document.getElementById('visualizacoes').addEventListener('input', function() {
    const visualizacoes = parseFloat(this.value) || 0;
    const receita = (visualizacoes / 1000) * 2.5;
    document.getElementById('receita').value = receita.toFixed(2);
});

// Bloqueia a edição manual do campo receita
document.getElementById('receita').addEventListener('keydown', function(e) {
    e.preventDefault();
});

// Envio via AJAX
document.getElementById('canalForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = this;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    // Adiciona loading no botão
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
    submitButton.disabled = true;
    
    try {
        // Configuração do cabeçalho
        const headers = {
            'Accept': 'application/json'
        };
        
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: headers
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            // Tratamento de erros de validação do Laravel
            if (data.errors) {
                const errorMessages = Object.values(data.errors).flat();
                showAlert('error', errorMessages.join('<br>'));
            } else {
                throw new Error(data.message || 'Erro ao cadastrar canal');
            }
        } else {
            showAlert('success', 'Canal cadastrado com sucesso!');
            form.reset();
            // Redireciona ou atualiza a lista conforme necessário
            setTimeout(() => window.location.href = 'gerenciador_canais', 1500);
        }
    } catch (error) {
        console.error('Erro:', error);
        showAlert('error', error.message || 'Erro na comunicação com o servidor');
    } finally {
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
    }
});

// Função para exibir alertas estilizados
function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} fixed-top mx-auto mt-3 d-inline-block`;
    alertDiv.style.maxWidth = '500px';
    alertDiv.style.left = '0';
    alertDiv.style.right = '0';
    alertDiv.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2"></i>
            <div>${message}</div>
        </div>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.classList.add('fade');
        setTimeout(() => alertDiv.remove(), 300);
    }, 5000);
}