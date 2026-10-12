const form = document.getElementById('form-cadastro');
const sucessoEl = document.getElementById('msg-sucesso');
const geralEl = document.getElementById('msg-geral');

function setErro(campo, msg) {
  document.getElementById(`erro-${campo}`).textContent = msg || '';
}

function validar(dados) {
  let valido = true;

  if (!dados.nome) { setErro('nome', 'Nome obrigatório'); valido = false; }
  else setErro('nome', '');

  if (!dados.email) { setErro('email', 'E-mail obrigatório'); valido = false; }
  else if (!/\S+@\S+\.\S+/.test(dados.email)) { setErro('email', 'E-mail inválido'); valido = false; }
  else setErro('email', '');

  if (!dados.telefone) { setErro('telefone', 'Telefone obrigatório'); valido = false; }
  else setErro('telefone', '');

  if (!dados.data) { setErro('data', 'Data obrigatória'); valido = false; }
  else setErro('data', '');

  if (!dados.categoria) { setErro('categoria', 'Categoria obrigatória'); valido = false; }
  else setErro('categoria', '');

  if (!dados.descricao || dados.descricao.length < 10) {
    setErro('descricao', 'Descrição deve ter ao menos 10 caracteres');
    valido = false;
  } else setErro('descricao', '');

  return valido;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  sucessoEl.textContent = '';
  geralEl.textContent = '';

  const dados = {
    nome: document.getElementById('nome').value.trim(),
    email: document.getElementById('email').value.trim(),
    telefone: document.getElementById('telefone').value.trim(),
    data: document.getElementById('data').value,
    categoria: document.getElementById('categoria').value,
    descricao: document.getElementById('descricao').value.trim(),
  };

  if (!validar(dados)) return;

  try {
    await createPost({
      title: dados.nome,
      body: dados.descricao,
      userId: 1,
    });
    sucessoEl.textContent = 'Cadastro enviado com sucesso!';
    form.reset();
  } catch (err) {
    geralEl.textContent = 'Erro: ' + err.message;
  }
});