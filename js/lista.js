var useState = React.useState;
var useEffect = React.useEffect;

var TITULOS_PT = [
  'Como aprender React em 2026: guia completo',
  'Os 10 melhores frameworks CSS para usar hoje',
  'Introdução ao JavaScript moderno (ES2024)',
  'Guia completo de acessibilidade web',
  'Boas práticas de HTML semântico',
  'Entendendo o Virtual DOM do React',
  'Diferenças entre let, const e var',
  'Como estruturar um projeto front-end profissional',
  'Padrões de projeto em JavaScript',
  'Consumindo APIs REST com Fetch',
  'Manipulação do DOM: JavaScript puro vs React',
  'CSS Grid vs Flexbox: quando usar cada um',
  'Introdução ao TypeScript para iniciantes',
  'Testes automatizados no front-end',
  'Otimização de performance em aplicações web',
  'Segurança em aplicações front-end',
  'Deploy de aplicações React: guia prático',
  'Estado global vs estado local em React',
  'Componentização: o que é e por que usar',
  'Mobile-first: design responsivo na prática',
];

var CORPOS_PT = [
  'React é uma biblioteca JavaScript criada pelo Facebook para construir interfaces de usuário interativas. Neste guia, você vai aprender desde os conceitos básicos até os recursos mais avançados, com exemplos práticos.',
  'Bootstrap, Tailwind CSS, Bulma, Foundation e Materialize são alguns dos frameworks CSS mais usados. Cada um tem características próprias e é ideal para diferentes tipos de projeto.',
  'O JavaScript moderno trouxe recursos poderosos como arrow functions, destructuring, spread operator, async/await, template literals e módulos ES6. Vamos explorar cada um deles.',
  'Acessibilidade web é essencial para garantir que todos os usuários, independentemente de suas limitações, possam navegar e interagir com sua aplicação. As diretrizes WCAG estabelecem os critérios mínimos.',
  'Usar tags semânticas como header, nav, main, article, section e footer melhora a acessibilidade, o SEO e a manutenção do código. É uma prática fundamental no desenvolvimento web moderno.',
  'O Virtual DOM é uma representação em memória da interface que permite ao React comparar versões e atualizar apenas o que mudou. Isso resulta em melhor performance e experiência do usuário.',
  'let permite reatribuição e tem escopo de bloco. const cria constantes com escopo de bloco. var tem escopo de função e foi o padrão antes do ES6. Prefira let e const no código moderno.',
  'Organizar um projeto front-end em pastas bem definidas (components, pages, services, styles, utils) facilita a manutenção, o reuso e o trabalho em equipe.',
  'Padrões como Module, Observer, Factory, Singleton e Strategy são muito utilizados em JavaScript. Conhecer e aplicar esses padrões deixa o código mais limpo e organizado.',
  'A Fetch API permite fazer requisições HTTP de forma nativa, sem bibliotecas externas. Os métodos GET, POST, PUT e DELETE são os mais comuns em APIs REST. Trate sempre os erros com try/catch.',
  'Manipular o DOM diretamente em JavaScript puro pode ser trabalhoso em aplicações grandes. O React abstrai essa manipulação, permitindo que você foque na lógica e na estrutura dos componentes.',
  'Flexbox é ideal para layouts unidimensionais (linha ou coluna). CSS Grid é perfeito para layouts bidimensionais (linhas e colunas). Combine ambos para obter o melhor resultado.',
  'TypeScript adiciona tipagem estática ao JavaScript, ajudando a evitar erros em tempo de desenvolvimento e melhorando a experiência em IDEs.',
  'Testes unitários, de integração e end-to-end ajudam a garantir a qualidade do código. Jest, Testing Library e Cypress são ferramentas populares no ecossistema JavaScript.',
  'Otimizar imagens, usar lazy loading, minificar arquivos, fazer code splitting e usar cache são algumas estratégias para melhorar a performance de aplicações web.',
  'XSS, CSRF e injeção de SQL são ameaças comuns em aplicações web. Sempre valide entradas, escape saídas e use HTTPS. Nunca confie em dados do usuário.',
  'Vercel, Netlify, GitHub Pages e Firebase Hosting são ótimas opções para publicar aplicações front-end. Cada uma tem vantagens específicas e diferentes planos gratuitos.',
  'Estado local é gerenciado dentro de um componente. Estado global é compartilhado entre vários componentes. Use Context API ou Redux quando precisar compartilhar dados entre telas.',
  'Componentizar é dividir a interface em partes reutilizáveis e independentes. Isso facilita a manutenção, os testes e o desenvolvimento em equipe.',
  'Design mobile-first significa projetar primeiro para telas pequenas e depois expandir para telas maiores. Isso resulta em layouts mais limpos, focados e responsivos.',
];

function traduzir(lista) {
  return lista.map(function (p, i) {
    return Object.assign({}, p, {
      title: TITULOS_PT[i % TITULOS_PT.length],
      body: CORPOS_PT[i % CORPOS_PT.length],
    });
  });
}

// ============================================================
// Componente Lista
// ============================================================

function Lista() {
  var postsState = useState([]);
  var posts = postsState[0], setPosts = postsState[1];

  var buscaState = useState('');
  var busca = buscaState[0], setBusca = buscaState[1];

  var carregandoState = useState(true);
  var carregando = carregandoState[0], setCarregando = carregandoState[1];

  var erroState = useState('');
  var erro = erroState[0], setErro = erroState[1];

  var avisoState = useState('');
  var aviso = avisoState[0], setAviso = avisoState[1];

  var selecionadoState = useState(null);
  var selecionado = selecionadoState[0], setSelecionado = selecionadoState[1];

  var editandoState = useState(null);
  var editando = editandoState[0], setEditando = editandoState[1];

  // -----------------------------------------------------------
  // Carregar: localStorage primeiro, senão busca da API
  // -----------------------------------------------------------
  useEffect(function () {
    var cache = storage.carregarDoStorage();
    if (cache && cache.length > 0) {
      setPosts(cache);
      setCarregando(false);
      setAviso('Mostrando dados salvos localmente. Alterações são persistidas no navegador.');
      return;
    }

    api.getPosts()
      .then(function (lista) {
        var traduzidos = traduzir(lista);
        setPosts(traduzidos);
        storage.salvarNoStorage(traduzidos);
      })
      .catch(function (e) { setErro(e.message); })
      .finally(function () { setCarregando(false); });
  }, []);

  // -----------------------------------------------------------
  // Persistir sempre que `posts` mudar
  // -----------------------------------------------------------
  useEffect(function () {
    if (!carregando && posts.length > 0) {
      storage.salvarNoStorage(posts);
    }
  }, [posts, carregando]);

  var filtrados = posts.filter(function (p) {
    return p.title.toLowerCase().indexOf(busca.toLowerCase()) !== -1;
  });

  // -----------------------------------------------------------
  // Ações
  // -----------------------------------------------------------
  var abrirEdicao = function (post, campo) {
    setEditando({ post: post, campo: campo, valor: post[campo] });
  };

  var salvarEdicao = async function () {
    var e = editando;
    var novosDados = {
      title: e.post.title,
      body: e.post.body,
      userId: e.post.userId,
    };
    novosDados[e.campo] = e.valor;

    try {
      // Chama a API (PUT) — mesmo retornando mock, cumpre o requisito
      await api.updatePost(e.post.id, novosDados);
    } catch (err) {
      // Se a API falhar, ainda assim atualizamos localmente
      console.warn('[API] Falha no PUT, mantendo alteração local:', err.message);
    }

    setPosts(posts.map(function (p) {
      if (p.id !== e.post.id) return p;
      var atualizado = Object.assign({}, p);
      atualizado[e.campo] = e.valor;
      return atualizado;
    }));
    setEditando(null);
  };

  var excluir = async function () {
    try {
      await api.deletePost(selecionado.id);
    } catch (e) {
      console.warn('[API] Falha no DELETE, removendo localmente:', e.message);
    }
    setPosts(posts.filter(function (p) { return p.id !== selecionado.id; }));
    setSelecionado(null);
  };

  var restaurar = async function () {
    if (!window.confirm('Restaurar a lista original? Suas alterações locais serão perdidas.')) return;

    setAviso('');
    setErro('');
    setCarregando(true);
    storage.limparStorage();

    try {
      var lista = await api.getPosts();
      var traduzidos = traduzir(lista);
      setPosts(traduzidos);
      storage.salvarNoStorage(traduzidos);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  };

  // -----------------------------------------------------------
  // Render
  // -----------------------------------------------------------
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Navbar, { current: 'lista' }),
    React.createElement(
      'main',
      { id: 'main', className: 'container' },
      React.createElement('h1', null, 'Lista de Posts'),
      React.createElement(
        'p',
        { className: 'subtitulo' },
        'Conteúdo consumido de uma API REST. Edite título, conteúdo ou exclua itens. As alterações ficam salvas no seu navegador.'
      ),

      aviso
        ? React.createElement(
            'div',
            {
              role: 'status',
              style: {
                background: '#dbeafe',
                color: '#1e3a8a',
                padding: '10px 14px',
                borderRadius: '6px',
                marginBottom: '16px',
                border: '1px solid #3b82f6',
                fontSize: '0.9rem',
              },
            },
            '💾 ', aviso
          )
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
        { className: 'filtro-linha' },
        React.createElement(
          'div',
          { style: { flex: 1 } },
          React.createElement('label', { htmlFor: 'busca' }, 'Buscar por título:'),
          React.createElement('input', {
            id: 'busca',
            type: 'text',
            value: busca,
            onChange: function (e) { setBusca(e.target.value); },
            placeholder: 'Digite para filtrar...',
          })
        ),
        React.createElement(
          'div',
          { style: { alignSelf: 'flex-end' } },
          React.createElement(
            Button,
            {
              variant: 'secondary',
              onClick: restaurar,
              ariaLabel: 'Restaurar lista original da API',
            },
            '↺ Restaurar lista'
          )
        )
      ),

      carregando
        ? React.createElement('p', { 'aria-live': 'polite' }, 'Carregando...')
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
            React.createElement('p', { className: 'card-body-text' }, p.body),
            React.createElement(
              'div',
              { className: 'card-actions' },
              React.createElement(
                Button,
                {
                  onClick: function () { abrirEdicao(p, 'title'); },
                  ariaLabel: 'Editar título do post ' + p.id,
                },
                'Editar título'
              ),
              React.createElement(
                Button,
                {
                  onClick: function () { abrirEdicao(p, 'body'); },
                  ariaLabel: 'Editar conteúdo do post ' + p.id,
                },
                'Editar conteúdo'
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

      // ---------- Modal edição ----------
      editando
        ? React.createElement(
            'div',
            {
              className: 'modal-overlay',
              role: 'dialog',
              'aria-modal': true,
              'aria-labelledby': 'modal-editar-titulo',
            },
            React.createElement(
              'div',
              { className: 'modal' },
              React.createElement(
                'h2',
                { id: 'modal-editar-titulo' },
                editando.campo === 'title' ? 'Editar título' : 'Editar conteúdo'
              ),
              editando.campo === 'title'
                ? React.createElement('input', {
                    type: 'text',
                    value: editando.valor,
                    onChange: function (e) {
                      setEditando(Object.assign({}, editando, { valor: e.target.value }));
                    },
                    'aria-label': 'Novo título',
                    autoFocus: true,
                  })
                : React.createElement('textarea', {
                    rows: 6,
                    value: editando.valor,
                    onChange: function (e) {
                      setEditando(Object.assign({}, editando, { valor: e.target.value }));
                    },
                    'aria-label': 'Novo conteúdo',
                    autoFocus: true,
                  }),
              React.createElement(
                'div',
                { className: 'modal-actions' },
                React.createElement(Button, { onClick: salvarEdicao }, 'Salvar'),
                React.createElement(
                  Button,
                  { variant: 'secondary', onClick: function () { setEditando(null); } },
                  'Cancelar'
                )
              )
            )
          )
        : null,

      // ---------- Modal exclusão ----------
      selecionado
        ? React.createElement(
            'div',
            {
              className: 'modal-overlay',
              role: 'dialog',
              'aria-modal': true,
              'aria-labelledby': 'modal-excluir-titulo',
            },
            React.createElement(
              'div',
              { className: 'modal' },
              React.createElement('h2', { id: 'modal-excluir-titulo' }, 'Confirmar exclusão'),
              React.createElement(
                'p',
                null,
                'Tem certeza que deseja excluir o post "' + selecionado.title + '"?'
              ),
              React.createElement(
                'div',
                { className: 'modal-actions' },
                React.createElement(Button, { variant: 'danger', onClick: excluir }, 'Sim, excluir'),
                React.createElement(
                  Button,
                  { variant: 'secondary', onClick: function () { setSelecionado(null); } },
                  'Cancelar'
                )
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