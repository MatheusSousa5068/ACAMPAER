// Exemplo de interação com o DOM
document.addEventListener('DOMContentLoaded', async () => {
  const isEmbaixadoresPage = window.location.pathname.includes('embaixadores.html');
  console.log(`Página carregada: ${isEmbaixadoresPage ? 'Embaixadores' : 'Principal'}`);

  const formEmbaixada = document.getElementById('form-embaixada') as HTMLFormElement;
  const formEmbaixador = document.getElementById('form-embaixador') as HTMLFormElement;
  const formBuscarEmbaixadores = document.getElementById('form-buscar-embaixadores') as HTMLFormElement;
  const listaEmbaixadores = document.getElementById('lista-embaixadores') as HTMLUListElement;
  const listaEmbaixadas = document.getElementById('lista-embaixadas') as HTMLUListElement;

  console.log("DOM carregado e elementos encontrados");

  const carregarEmbaixadas = async () => {
    if (!listaEmbaixadas) return; // Verifica se o elemento existe
    try {
      const embaixadas = await window.api.buscarEmbaixadas();
      listaEmbaixadas.innerHTML = ''; // Limpa a lista antes de adicionar novos itens
      
      if (embaixadas.length === 0) {
        const li = document.createElement('li');
        li.textContent = "Nenhuma embaixada encontrada";
        listaEmbaixadas.appendChild(li);
        return;
      }
      
      embaixadas.forEach((embaixada: { id: number; nome: string }) => {
        const li = document.createElement('li');
        li.textContent = embaixada.nome;
        li.dataset.id = embaixada.id.toString();
        li.addEventListener('click', () => {
          window.location.href = `pages/embaixadores.html?id=${embaixada.id}&nome=${encodeURIComponent(embaixada.nome)}`;
        });
        listaEmbaixadas.appendChild(li);
      });
    } catch (error) {
      console.error('Erro ao listar embaixadas:', error);
      alert('Erro ao listar embaixadas.');
    }
  };


  // Registrar nova embaixada
  if (formEmbaixada) {
    formEmbaixada.addEventListener('submit', async (e) => {
      
      console.log("Formulário de embaixada encontrado");
      e.preventDefault();
      console.log("Formulário de embaixada enviado");

      const nome = (document.getElementById('nome-embaixada') as HTMLInputElement).value.trim();
      
      if (!nome) {
        alert('O nome da embaixada é obrigatório.');
        return;
      }

      try {
        const result = await window.api.registrarEmbaixada(nome);
        if (result.success) {
          alert('Embaixada registrada com sucesso!');
          formEmbaixada.reset();
          carregarEmbaixadas(); // Atualiza a lista de embaixadas
        } else {
          alert('Erro ao registrar embaixada.');
        }
      } catch (error) {
        console.error('Erro ao registrar embaixada:', error);
        alert('Erro ao registrar embaixada.');
      }
    });
  }

  // Registrar novo embaixador (na página de embaixadores)
  if (formEmbaixador) {
    formEmbaixador.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log("Formulário de embaixador enviado");
      
      const nome = (document.getElementById('nome-embaixador') as HTMLInputElement).value.trim();
      const categoria = (document.getElementById('categoria-embaixador') as HTMLInputElement).value.trim();
      const embaixadaId = parseInt((document.getElementById('embaixada-id') as HTMLInputElement).value, 10);

      if (!nome || !categoria) {
        alert('Todos os campos são obrigatórios.');
        return;
      }

      if (isNaN(embaixadaId)) {
        alert('ID da embaixada inválido.');
        return;
      }

      console.log(`Enviando: nome=${nome}, categoria=${categoria}, embaixadaId=${embaixadaId}`);

      try {
        const result = await window.api.registrarEmbaixador(nome, categoria, embaixadaId);
        if (result.success) {
          alert('Embaixador registrado com sucesso!');
          formEmbaixador.reset();
          
          // Recarregar a lista de embaixadores
          const urlParams = new URLSearchParams(window.location.search);
          const embaixadaNome = urlParams.get('nome');
          if (embaixadaNome) {
            // Colocar o ID da embaixada de volta no campo oculto
            const embaixadaIdInput = document.getElementById('embaixada-id') as HTMLInputElement;
            if (embaixadaIdInput) {
              embaixadaIdInput.value = urlParams.get('id') || '';
            }
            
            carregarEmbaixadores(decodeURIComponent(embaixadaNome));
          }
        } else {
          alert(`Erro ao registrar embaixador: ${result.error || ''}`);
        }
      } catch (error) {
        console.error('Erro ao registrar embaixador:', error);
        alert('Erro ao registrar embaixador.');
      }
    });
  }

  // Buscar embaixadores por embaixada
  if (formBuscarEmbaixadores) {
    formBuscarEmbaixadores.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nomeEmbaixada = (document.getElementById('nome-embaixada-busca') as HTMLInputElement).value.trim();
      
      if (!nomeEmbaixada) {
        alert('O nome da embaixada é obrigatório para a busca.');
        return;
      }

      carregarEmbaixadores(nomeEmbaixada);
    });
  }

  const carregarEmbaixadores = async (nomeEmbaixada: string) => {
    if (!listaEmbaixadores) return; // Verifica se o elemento existe
    try {
      const embaixadores = await window.api.buscarEmbaixadores(nomeEmbaixada);
      listaEmbaixadores.innerHTML = ''; // Limpa a lista antes de adicionar novos itens
      
      if (embaixadores.length === 0) {
        const li = document.createElement('li');
        li.textContent = "Nenhum embaixador encontrado";
        listaEmbaixadores.appendChild(li);
        return;
      }
      
      embaixadores.forEach((embaixador: { nome: string; categoria: string }) => {
        const li = document.createElement('li');
        li.textContent = `${embaixador.nome} - ${embaixador.categoria}`;
        listaEmbaixadores.appendChild(li);
      });
    } catch (error) {
      console.error('Erro ao listar embaixadores:', error);
      alert('Erro ao listar embaixadores.');
    }
  }

   if (isEmbaixadoresPage) {
    const urlParams = new URLSearchParams(window.location.search);
    const embaixadaId = urlParams.get('id');
    const embaixadaNome = urlParams.get('nome');
    
    console.log(`Parâmetros da URL: id=${embaixadaId}, nome=${embaixadaNome}`);
    
    const tituloEmbaixada = document.getElementById('titulo-embaixada');
    if (tituloEmbaixada && embaixadaNome) {
      tituloEmbaixada.textContent = `Embaixada: ${decodeURIComponent(embaixadaNome)}`;
    }
    
    const embaixadaIdInput = document.getElementById('embaixada-id') as HTMLInputElement;
    if (embaixadaIdInput && embaixadaId) {
      embaixadaIdInput.value = embaixadaId;
      console.log(`Campo embaixada-id definido com valor: ${embaixadaId}`);
    }
    
    if (embaixadaNome) {
      carregarEmbaixadores(decodeURIComponent(embaixadaNome));
    }
  } else {
    carregarEmbaixadas();
  }
});