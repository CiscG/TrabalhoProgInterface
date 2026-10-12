let posts = [];
let busca = '';
let postSelecionado = null;

const statusEl = document.getElementById('status');
const listaEl = document.getElementById('lista');
const buscaEl = document.getElementById('busca');
const modalEl = document.getElementById('modal');
const modalTexto = document.getElementById('modal-texto');
const btnConfirmar = document.getElementById('btn-confirmar');
const btnCancelar = document.getElementById('btn-cancelar');

async function carregar() {
  statusEl.textContent = 'Carregando...';
  try {
    posts = await getPosts();
    statusEl.textContent = '';
    renderizar();
  } catch (e) {
    statusEl.innerHTML = `<span class="error">Erro: ${e.message}</span>`;
  }
}

function renderizar() {
  const filtrados = posts.filter((p) =>
    p.title.toLowerCase().includes(busca.toLowerCase())
  );

  if (filtrados.length === 0) {
    listaEl.innerHTML = '<p>Nenhum resultado encontrado.</p>';
    return;
  }

  listaEl.innerHTML = filtrados.map((p) => `
    <div class="card">
      <h3>${p.title}</h3>
      <p>${p.body.slice(0, 80)}...</p>
      <button class="btn btn-danger" data-id="${p.id}">Excluir</button>
    </div>
  `).join('');

  // Eventos de exclusão
  listaEl.querySelectorAll('button[data-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      postSelecionado = posts.find((p) => p.id === id);
      modalTexto.textContent = `Excluir "${postSelecionado.title}"?`;
      modalEl.classList.remove('hidden');
    });
  });
}

buscaEl.addEventListener('input', (e) => {
  busca = e.target.value;
  renderizar();
});

btnCancelar.addEventListener('click', () => {
  modalEl.classList.add('hidden');
  postSelecionado = null;
});

btnConfirmar.addEventListener('click', async () => {
  try {
    await deletePost(postSelecionado.id);
    posts = posts.filter((p) => p.id !== postSelecionado.id);
    modalEl.classList.add('hidden');
    postSelecionado = null;
    renderizar();
  } catch (e) {
    alert('Erro ao excluir: ' + e.message);
  }
});

carregar();