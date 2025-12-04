$(document).ready(function() {
    let canaisData = []; // Armazena os dados originalmente carregados
    
    // Carrega os dados iniciais
    $.ajax({
        url: 'http://127.0.0.1:8000/api/canais',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success && response.data) {
                canaisData = response.data;
                preencherTabela(canaisData);
                configurarOrdenacao();
            } else {
                console.error('Dados não encontrados ou formato inválido');
            }
        },
        error: function(xhr, status, error) {
            console.error('Erro ao buscar canais:', error);
        }
    });

    function preencherTabela(canais) {
        const tbody = $('#rankingTable tbody');
        tbody.empty();
    
        canais.forEach((canal, index) => {
            const row = $(`
                <tr class="cursor-pointer hover:bg-gray-50">
                    <th scope="row">${index + 1}</th>
                    <td><img src="${canal.foto || 'placeholder.jpg'}" alt="${canal.nome}" class="img-thumbnail" style="width: 60px; height: 60px;"></td>
                    <td>${canal.nome || 'N/A'}</td>
                    <td>${canal.tipo || 'N/A'}</td>
                    <td>
                        <img src="https://flagcdn.com/w20/${canal.localidade?.toLowerCase() || ''}.png" 
                             style="height: 15px; margin-right: 5px;"
                             alt="${canal.localidade || 'N/A'}">
                        ${canal.localidade || 'N/A'}
                    </td>
                    <td>${canal.visualizacoes ? formatarNumero(canal.visualizacoes) : 'N/A'}</td>
                    <td>${canal.inscritos ? formatarNumero(canal.inscritos) : 'N/A'}</td>
                    <td>${canal.quantidade_videos || 'N/A'}</td>
                </tr>
            `);
    
            // Adiciona o evento de clique diretamente na linha
            row.on('click', () => {
                localStorage.setItem('canalId', canal.id_canal); // Armazena o ID corretamente
                console.log('ID salvo:', canal.id_canal); // Verifica se está salvando
                window.location.href = 'editar_formulario.html'; // Redireciona
            });            
    
            tbody.append(row);
        });
    }

    function formatarNumero(numero) {
        return new Intl.NumberFormat('pt-BR', {
            notation: 'compact',
            compactDisplay: 'short'
        }).format(numero);
    }

    function configurarOrdenacao() {
        $('.dropdown-item').on('click', function(e) {
            e.preventDefault();
            const text = $(this).text().trim();
            
            // Atualiza a aparência do dropdown
            $('.dropdown-item').removeClass('active');
            $(this).addClass('active');
            
            // Ordena os dados conforme a opção selecionada
            let dadosOrdenados = [...canaisData];
            
            switch(text) {
                case 'Nome (A-Z)':
                    dadosOrdenados.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
                    break;
                case 'Nome (Z-A)':
                    dadosOrdenados.sort((a, b) => (b.nome || '').localeCompare(a.nome || ''));
                    break;
                case 'Inscritos':
                    dadosOrdenados.sort((a, b) => (b.inscritos || 0) - (a.inscritos || 0));
                    break;
                case 'Visualizações':
                    dadosOrdenados.sort((a, b) => (b.visualizacoes || 0) - (a.visualizacoes || 0));
                    break;
                case 'Vídeos':
                    dadosOrdenados.sort((a, b) => (b.quantidade_videos || 0) - (a.quantidade_videos || 0));
                    break;
                default:
                    // Mantém a ordenação original
                    break;
            }
            
            preencherTabela(dadosOrdenados);
            atualizarBotaoOrdenacao(text);
        });
    }

    function atualizarBotaoOrdenacao(textoOrdenacao) {
        const icone = getIconeOrdenacao(textoOrdenacao);
        const textoCurto = getTextoCurtoOrdenacao(textoOrdenacao);
        
        $('#sortDropdown').html(`
            <i class="fas ${icone} me-2"></i> ${textoCurto}
        `);
    }

    function getIconeOrdenacao(text) {
        switch(text) {
            case 'Nome (A-Z)': return 'fa-sort-alpha-down';
            case 'Nome (Z-A)': return 'fa-sort-alpha-up';
            case 'Inscritos': return 'fa-users';
            case 'Visualizações': return 'fa-eye';
            case 'Vídeos': return 'fa-video';
            default: return 'fa-sort';
        }
    }
    
    function getTextoCurtoOrdenacao(text) {
        // Pode personalizar os textos curtos aqui se desejar
        return text;
    }

        const canalId = localStorage.getItem('canalId');
    
        if (canalId) {
            $.ajax({
                url: `http://127.0.0.1:8000/api/canal/${canalId}`,
                type: 'GET',
                dataType: 'json',
                success: function (response) {
                    if (response.success && response.data) {
                        const canal = response.data;
    
                        // Preenche os campos do formulário com os dados do canal
                        $('#nome').val(canal.nome);
                        $('#foto').val(canal.foto);
                        $('#inscritos').val(canal.inscritos);
                        $('#visualizacoes').val(canal.visualizacoes);
                        $('#quantidade_videos').val(canal.quantidade_videos);
                        $('#localidade').val(canal.localidade);
                        $('#tipo').val(canal.tipo);
                        $('#data_criacao').val(canal.data_criacao);
                        $('#receita').val(canal.receita);
                        $('#video_famoso').val(canal.video_famoso);
                    } else {
                        console.warn('Canal não encontrado.');
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Erro ao carregar dados do canal:', error);
                }
            });
        } else {
            console.warn('ID do canal não encontrado no localStorage');
        }
    

        $('#canalForm').on('submit', function (e) {
            e.preventDefault();
    
            if (!canalId) {
                alert('ID do canal não encontrado.');
                return;
            }
    
            const formData = {
                nome: $('#nome').val(),
                foto: $('#foto').val(),
                inscritos: $('#inscritos').val(),
                visualizacoes: $('#visualizacoes').val(),
                quantidade_videos: $('#quantidade_videos').val(),
                localidade: $('#localidade').val(),
                tipo: $('#tipo').val(),
                data_criacao: $('#data_criacao').val(),
                receita: $('#receita').val(),
                video_famoso: $('#video_famoso').val()
            };
    
            $.ajax({
                url: `http://127.0.0.1:8000/api/atualizar/canal/${canalId}`,
                type: 'PUT',
                data: formData,
                success: function (response) {
                    if (response.success) {
                        alert('Canal atualizado com sucesso!');
                        localStorage.removeItem('canalId'); // limpa o id salvo
                        window.location.href = 'gerenciador_canais.html'; // redireciona após salvar (ou personalize)
                    } else {
                        alert('Erro ao atualizar canal.');
                    }
                },
                error: function (xhr) {
                    console.error(xhr.responseText);
                    alert('Erro ao enviar os dados.');
                }
            });
        });

        $('#excluir').on('click', function () {
            const canalId = localStorage.getItem('canalId');
        
            if (!canalId) {
                alert('ID do canal não encontrado.');
                return;
            }
        
            $.ajax({
                url: `http://127.0.0.1:8000/api/deletar/canal/${canalId}`,
                type: 'DELETE',
                success: function (response) {
                    if (response.success) {
                        alert('Canal excluído com sucesso!');
                        localStorage.removeItem('canalId');
                        window.location.href = 'gerenciador_canais.html'; // Redirecionar após exclusão
                    } else {
                        alert('Erro ao excluir canal.');
                    }
                },
                error: function (xhr) {
                    console.error(xhr.responseText);
                    alert('Erro ao enviar a requisição de exclusão.');
                }
            });
        });
    
});