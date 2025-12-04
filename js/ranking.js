$(document).ready(function () {
    const token = sessionStorage.getItem('jwt');


    if (!token) {
        Swal.fire({
            icon: 'warning',
            title: 'Atenção',
            text: 'Você precisa estar logado.',
        }).then(() => {
            window.location.href = 'login.html';
        });

        return;
    }

    let canaisData = [];

    document.getElementById('logoutBtn').addEventListener('click', function() {
        // Limpa os dados da sessão
        sessionStorage.clear();

        // Redireciona para a página de login
        window.location.href = 'login.html';
    });
    
    // Função de formatação
    function formatarNumero(numero) {
        return new Intl.NumberFormat('pt-BR', {
            notation: 'compact',
            compactDisplay: 'short'
        }).format(numero);
    }

    function formatarData(dataISO) {
        const [ano, mes, dia] = dataISO.split('-');
        const data = new Date(ano, mes - 1, dia);
        return data.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    // Função principal para preencher tabela (reutilizável)
    function preencherTabela(canais, seletor = '#rankingTable tbody') {
        const tbody = $(seletor);
        tbody.empty();

        canais.forEach((canal, index) => {
            const row = $(`
                <tr class="cursor-pointer hover:bg-gray-50">
                    <th scope="row">${index + 1}</th>
                    <th><img src="${canal.foto || 'placeholder.jpg'}" alt="${canal.nome}" class="img-thumbnail" style="width: 60px; height: 60px; border-radius: 50%; border: none;"></th>
                    <td>${canal.nome || 'N/A'}</td>
                    <td>${canal.tipo || 'N/A'}</td>
                    <td>
                        ${canal.localidade || 'N/A'}
                    </td>
                    <td>${canal.visualizacoes ? formatarNumero(canal.visualizacoes) : 'N/A'}</td>
                    <td>${canal.inscritos ? formatarNumero(canal.inscritos) : 'N/A'}</td>
                    <td>${canal.quantidade_videos || 'N/A'}</td>
                </tr>
            `);

            row.on('click', () => {
                localStorage.setItem('canalId', canal.id_canal);
                window.location.href = `canal_infos.html`;
            });

            tbody.append(row);
        });
    }

    // Ordenação
    function configurarOrdenacao() {
        $('.dropdown-item').on('click', function (e) {
            e.preventDefault();
            const text = $(this).text().trim();

            $('.dropdown-item').removeClass('active');
            $(this).addClass('active');

            let dadosOrdenados = [...canaisData];

            switch (text) {
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
            }

            preencherTabela(dadosOrdenados);
            atualizarBotaoOrdenacao(text);
        });
    }

    function atualizarBotaoOrdenacao(texto) {
        const icone = {
            'Nome (A-Z)': 'fa-sort-alpha-down',
            'Nome (Z-A)': 'fa-sort-alpha-up',
            'Inscritos': 'fa-users',
            'Visualizações': 'fa-eye',
            'Vídeos': 'fa-video'
        }[texto] || 'fa-sort';

        $('#sortDropdown').html(`<i class="fas ${icone} me-2"></i> ${texto}`);
    }

    // Busca inicial de canais
    $.getJSON('http://127.0.0.1:8000/api/canais', function (response) {
        if (response.success && response.data) {
            canaisData = response.data;
            preencherTabela(canaisData);
            configurarOrdenacao();
        } else {
            console.error('Dados inválidos');
        }
    });

    // Página de detalhes do canal
    const canalId = localStorage.getItem('canalId');
    if (canalId && $('#nome').length) {
        $.getJSON(`http://127.0.0.1:8000/api/canal/${canalId}`, function (response) {
            if (response.success && response.data) {
                const canal = response.data;
                $('#nome').text(canal.nome);
                $('.user-avatar').attr('src', canal.foto);
                $('#inscritos').text(formatarNumero(canal.inscritos));
                $('#visualizacoes').text(formatarNumero(canal.visualizacoes));
                $('#quantidade_videos').text(canal.quantidade_videos);
                $('#localidade').text(canal.localidade);
                $('#tipo').text(canal.tipo);
                $('#data_criacao').text(formatarData(canal.data_criacao));
                $('#receita').text(canal.receita);
                $('#video').attr('src',"https://www.youtube.com/embed/" + canal.foto);

                $('#ranking_inscritos').text(canal.ranking_inscritos + "#");
                $('#ranking_views').text(canal.ranking_visualizacoes + "#");

                 console.log("Resposta completa da API:", response);
            } else {
                console.log('Canal não encontrado.');
            }
        });
    }

    // Pesquisa simples
    $('#seach-all').on('click', function () {
        const termo = $('#search-all-back').val().trim();
        if (termo) {
            localStorage.setItem('termoPesquisa', termo);
            window.location.href = 'pesquisar_todos.html';
        }
    });



    // Pesquisa ao carregar página de busca
    const termoPesquisa = localStorage.getItem('termoPesquisa');
    if (termoPesquisa && $('#searchTable').length) {
        $.ajax({
            url: 'http://127.0.0.1:8000/api/canal/filtrado',
            method: 'POST',
            contentType: 'application/json',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: JSON.stringify({ nome: termoPesquisa }),
            success: function (response) {
                const canais = response.canais || [];
                $('#contador-resultados').text(`${canais.length} resultado(s) encontrado(s).`);

                if (canais.length > 0) {
                    preencherTabela(canais, '#searchTable tbody');
                } else {
                    $('#searchTable tbody').html(`
                        <tr>
                            <td colspan="8" class="text-center text-muted">Nenhum resultado encontrado para a pesquisa.</td>
                        </tr>
                    `);
                }
            },
            error: function (xhr, status, error) {
                console.error('Erro ao pesquisar:', error);
            }
        });
    }
});
