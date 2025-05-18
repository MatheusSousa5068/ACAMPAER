"use strict";
// Exemplo de interação com o DOM
document.addEventListener('DOMContentLoaded', async () => {
    const formEmbaixada = document.getElementById('form-registrar-embaixador');
    const formEmbaixador = document.getElementById('form-embaixador');
    const formBuscarEmbaixadores = document.getElementById('form-buscar-embaixadores');
    const listaEmbaixadores = document.getElementById('lista-embaixadores');
    const listaEmbaixadas = document.getElementById('lista-embaixadas');
    console.log("DOM carregado e elementos encontrados");
    // Função para carregar embaixadas
    const carregarEmbaixadas = async () => {
        if (!listaEmbaixadas)
            return; // Verifica se o elemento existe
        try {
            const embaixadas = await window.api.buscarEmbaixadas();
            listaEmbaixadas.innerHTML = ''; // Limpa a lista antes de adicionar novos itens
            embaixadas.forEach((embaixada) => {
                const li = document.createElement('li');
                li.textContent = embaixada.nome;
                li.dataset.id = embaixada.id.toString();
                li.addEventListener('click', () => {
                    window.location.href = `./pages/embaixadores.html?id=${embaixada.id}&nome=${encodeURIComponent(embaixada.nome)}`;
                });
                listaEmbaixadas.appendChild(li);
            });
        }
        catch (error) {
            console.error('Erro ao listar embaixadas:', error);
            alert('Erro ao listar embaixadas.');
        }
    };
    // Registrar nova embaixada
    if (formEmbaixada) {
        formEmbaixada.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("Formulário de embaixada enviado");
            const nome = document.getElementById('nome-embaixada').value;
            try {
                const result = await window.api.registrarEmbaixada(nome);
                if (result.success) {
                    alert('Embaixada registrada com sucesso!');
                    formEmbaixada.reset();
                    carregarEmbaixadas(); // Atualiza a lista de embaixadas
                }
                else {
                    alert('Erro ao registrar embaixada.');
                }
            }
            catch (error) {
                console.error('Erro ao registrar embaixada:', error);
                alert('Erro ao registrar embaixada.');
            }
        });
    }
    // Registrar novo embaixador
    if (formEmbaixador) {
        setTimeout(() => {
            console.log("esperandoo");
        }, 5000);
        formEmbaixador.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("Formulário de embaixador enviado");
            const nome = document.getElementById('nome-embaixador').value;
            const categoria = document.getElementById('categoria-embaixador').value;
            const embaixadaId = parseInt(document.getElementById('embaixada-id').value, 10);
            try {
                const result = await window.api.registrarEmbaixador(nome, categoria, embaixadaId);
                if (result.success) {
                    alert('Embaixador registrado com sucesso!');
                    formEmbaixador.reset();
                }
                else {
                    alert('Erro ao registrar embaixador.');
                }
            }
            catch (error) {
                console.error('Erro ao registrar embaixador:', error);
                alert('Erro ao registrar embaixador.');
            }
        });
    }
    // Buscar embaixadores por embaixada
    if (formBuscarEmbaixadores) {
        formBuscarEmbaixadores.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nomeEmbaixada = document.getElementById('nome-embaixada-busca').value;
            try {
                const embaixadores = await window.api.buscarEmbaixadores(nomeEmbaixada);
                listaEmbaixadores.innerHTML = ''; // Limpa a lista antes de adicionar novos itens
                embaixadores.forEach((embaixador) => {
                    const li = document.createElement('li');
                    li.textContent = `${embaixador.nome} - ${embaixador.categoria}`;
                    listaEmbaixadores.appendChild(li);
                });
            }
            catch (error) {
                console.error('Erro ao buscar embaixadores:', error);
                alert('Erro ao buscar embaixadores.');
            }
        });
    }
    // Carregar embaixadas ao iniciar
    if (listaEmbaixadas) {
        carregarEmbaixadas();
    }
});
