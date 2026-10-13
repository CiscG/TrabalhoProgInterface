var useState = React.useState;
var useEffect = React.useEffect;

function Lista() {
  var postsState = useState([]);
  var posts = postsState[0], setPosts = postsState[1];

  var buscaState = useState('');
  var busca = buscaState[0], setBusca = buscaState[1];

  var carregandoState = useState(true);
  var carregando = carregandoState[0], setCarregando = carregandoState[1];

  var erroState = useState('');
  var erro = erroState[0], setErro = erroState[1];

  var selecionadoState = useState(null);
  var selecionado = selecionadoState[0], setSelecionado = selecionadoState[1];

  useEffect(function () {
    api.getPosts()
      .then(setPosts)
      .catch(function (e) { setErro(e.message); })
      .finally(function () { setCarregando(false); });
  }, []);

  var filtrados = posts.filter(function (p) {
    return p.title.toLowerCase().indexOf(busca.toLowerCase()) !== -1;
  });

  var editar = async function (post) {
    var novoTitulo = window.prompt('Novo título:', post.title);
    if (!novoTitulo || novoTitulo === post.title) return;
    try {
      await api.updatePost(post.id, {
        title: novoTitulo,
        body: post.body,
        userId: post.userId,
      });
      setPosts(posts.map(function (p) {
        return p.id === post.id ? Object.assign({}, p, { title: novoTitulo }) : p;
      }));
    } catch (e) {
      setErro(e.message);
    }
  };

  var excluir = async function () {
    try {
      await api.deletePost(selecionado.id);
      setPosts(posts.filter(function (p) { return p.id !== selecionado.id; }));
      setSelecionado(null);
    } catch (e) {
      setErro(e.message);
      setSelecionado(null);
    }
  };

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Navbar, { current: 'lista' }),
    React.createElement(
      'main',
      { id: 'main', className: 'container' },
      React.createElement('h1', null, 'Lista de Posts'),

      React.createElement('label', { htmlFor: 'busca' }, 'Buscar por título:'),
      React.createElement('input', {
        id: 'busca',
        type: 'text',
        value: busca,
        onChange: function (e) { setBusca(e.target.value); },
        placeholder: 'Digite para filtrar...',
      }),

      carregando
        ? React.createElement('p', { 'aria-live': 'polite' }, 'Carregando...')
        : null,

      erro
        ? React.createElement(
            'div',
            {
              role: 'alert',
              style: {
                background: '#fee2e2',
                color: '#991b1b',
                padding: '12px',
                borderRadius: '6px',
                marginBottom: '16px',
                border: '1px solid #dc2626',
              },
            },
            React.createElement('strong', null, 'Erro: '),
            erro
          )
        : null,

      React.createElement(
        'div',
        { className: 'lista-itens' },
        !carregando && !erro && filtrados.length === 0
          ? React.createElement('p', null, 'Nenhum resultado encontrado.')
          : null,

        filtrados.map(function (p) {
          return React.createElement(
            Card,
            { key: p.id, title: p.title },
            React.createElement('p', null, p.body.slice(0, 80) + '...'),
            React.createElement(
              'div',
              { className: 'card-actions' },
              React.createElement(
                Button,
                {
                  onClick: function () { editar(p); },
                  ariaLabel: 'Editar post ' + p.id,
                },
                'Editar'
              ),
              React.createElement(
                Button,
                {
                  variant: 'danger',
                  onClick: function () { setSelecionado(p); },
                  ariaLabel: 'Excluir post ' + p.id,
                },
                'Excluir'
              )
            )
          );
        })
      ),

      selecionado
        ? React.createElement(
            'div',
            { className: 'modal-overlay', role: 'dialog', 'aria-modal': true, 'aria-labelledby': 'modal-titulo' },
            React.createElement(
              'div',
              { className: 'modal' },
              React.createElement('h2', { id: 'modal-titulo' }, 'Confirmar exclusão'),
              React.createElement('p', null, 'Excluir "' + selecionado.title + '"?'),
              React.createElement(
                'div',
                { className: 'modal-actions' },
                React.createElement(Button, { variant: 'danger', onClick: excluir }, 'Sim, excluir'),
                React.createElement(Button, { onClick: function () { setSelecionado(null); } }, 'Cancelar')
              )
            )
          )
        : null
    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(Lista)
);