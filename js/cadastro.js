var useState = React.useState;

function Cadastro() {
  var formState = useState({ nome: '', email: '', telefone: '', data: '', categoria: '', descricao: '' });
  var form = formState[0], setForm = formState[1];

  var errosState = useState({});
  var erros = errosState[0], setErros = errosState[1];

  var sucessoState = useState('');
  var sucesso = sucessoState[0], setSucesso = sucessoState[1];

  var handle = function (e) {
    var novo = Object.assign({}, form);
    novo[e.target.name] = e.target.value;
    setForm(novo);
  };

  var validar = function () {
    var er = {};
    if (!form.nome) er.nome = 'Nome obrigatório';
    if (!form.email) er.email = 'E-mail obrigatório';
    else if (!/\S+@\S+\.\S+/.test(form.email)) er.email = 'E-mail inválido';
    if (!form.telefone) er.telefone = 'Telefone obrigatório';
    if (!form.data) er.data = 'Data obrigatória';
    if (!form.categoria) er.categoria = 'Categoria obrigatória';
    if (!form.descricao || form.descricao.length < 10)
      er.descricao = 'Descrição deve ter ao menos 10 caracteres';
    return er;
  };

  var enviar = async function (e) {
    e.preventDefault();
    setSucesso('');
    var er = validar();
    setErros(er);
    if (Object.keys(er).length > 0) return;

    try {
      await api.createPost({
        title: form.nome,
        body: form.descricao,
        userId: 1,
      });
      setSucesso('Cadastro enviado com sucesso!');
      setForm({ nome: '', email: '', telefone: '', data: '', categoria: '', descricao: '' });
    } catch (err) {
      setErros({ geral: err.message });
    }
  };

  var campo = function (nome, label, tipo) {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement('label', { htmlFor: nome }, label + ' *'),
      React.createElement('input', {
        id: nome,
        name: nome,
        type: tipo || 'text',
        value: form[nome],
        onChange: handle,
        'aria-invalid': erros[nome] ? 'true' : 'false',
        'aria-describedby': erros[nome] ? 'erro-' + nome : undefined,
      }),
      erros[nome]
        ? React.createElement(
            'span',
            { className: 'error', id: 'erro-' + nome, role: 'alert' },
            erros[nome]
          )
        : null
    );
  };

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Navbar, { current: 'cadastro' }),
    React.createElement(
      'main',
      { id: 'main', className: 'container' },
      React.createElement('h1', null, 'Cadastro'),
      React.createElement(
        'form',
        { onSubmit: enviar, noValidate: true },
        campo('nome', 'Nome'),
        campo('email', 'E-mail', 'email'),
        campo('telefone', 'Telefone', 'tel'),
        campo('data', 'Data', 'date'),

        React.createElement('label', { htmlFor: 'categoria' }, 'Categoria *'),
        React.createElement(
          'select',
          {
            id: 'categoria',
            name: 'categoria',
            value: form.categoria,
            onChange: handle,
            'aria-invalid': erros.categoria ? 'true' : 'false',
            'aria-describedby': erros.categoria ? 'erro-categoria' : undefined,
          },
          React.createElement('option', { value: '' }, 'Selecione...'),
          React.createElement('option', { value: 'A' }, 'Categoria A'),
          React.createElement('option', { value: 'B' }, 'Categoria B'),
          React.createElement('option', { value: 'C' }, 'Categoria C')
        ),
        erros.categoria
          ? React.createElement('span', { className: 'error', id: 'erro-categoria', role: 'alert' }, erros.categoria)
          : null,

        React.createElement('label', { htmlFor: 'descricao' }, 'Descrição *'),
        React.createElement('textarea', {
          id: 'descricao',
          name: 'descricao',
          rows: 4,
          value: form.descricao,
          onChange: handle,
          'aria-invalid': erros.descricao ? 'true' : 'false',
          'aria-describedby': erros.descricao ? 'erro-descricao' : undefined,
        }),
        erros.descricao
          ? React.createElement('span', { className: 'error', id: 'erro-descricao', role: 'alert' }, erros.descricao)
          : null,

        React.createElement(
          'div',
          { className: 'form-actions' },
          React.createElement(Button, { type: 'submit' }, 'Enviar')
        ),

        erros.geral
          ? React.createElement(
              'div',
              {
                role: 'alert',
                style: {
                  background: '#fee2e2',
                  color: '#991b1b',
                  padding: '12px',
                  borderRadius: '6px',
                  marginTop: '16px',
                  border: '1px solid #dc2626',
                },
              },
              React.createElement('strong', null, 'Erro: '),
              erros.geral
            )
          : null,

        sucesso
          ? React.createElement(
              'p',
              { className: 'success', role: 'status', 'aria-live': 'polite' },
              sucesso
            )
          : null
      )
    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(Cadastro)
);