$(document).ready(function () {
const canalId = localStorage.getItem('canalId');
console.log('ID do canal recuperado do localStorage:', canalId); // Debug 1

if (canalId && $('#nome').length) {
    console.log('Iniciando requisição para a API...'); // Debug 2
    
    $.getJSON(`http://127.0.0.1:8000/api/canal/1`, function(response) {
        console.log('Resposta completa da API:', response); // Debug 3 - Mostra toda a resposta
        
        if (response.success && response.data) {
            const canal = response.data;
            console.log('Dados do canal recebidos:', canal); // Debug 4 - Mostra os dados do canal
            
            // Preenche os dados na página
            $('#nome').text(canal.nome);
            $('.user-avatar').attr('src', canal.foto);
            $('#inscritos').text(formatarNumero(canal.inscritos));
            $('#visualizacoes').text(formatarNumero(canal.visualizacoes));
            // ... (restante do seu código de preenchimento)
            
            console.log('Dados do canal carregados com sucesso!'); // Debug 5
        } else {
            console.warn('Resposta da API sem dados válidos:', response); // Debug 6
        }
    })
    .fail(function(jqXHR, textStatus, error) {
        console.error('Erro na requisição:', textStatus, error); // Debug 7 - Mostra erros de requisição
        console.log('Detalhes do erro:', jqXHR.responseJSON); // Debug 8 - Mostra resposta de erro da API
    });
} else {
    if (!canalId) {
        console.error('Nenhum canalId encontrado no localStorage'); // Debug 9
    }
    if (!$('#nome').length) {
        console.error('Elemento #nome não encontrado no DOM'); // Debug 10
    }
}
});
