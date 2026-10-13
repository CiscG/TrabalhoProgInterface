// ============================================================
// Componentes reutilizáveis (sem JSX)
// ============================================================

window.Button = function Button(props) {
  return React.createElement(
    'button',
    {
      type: props.type || 'button',
      className: 'btn btn-' + (props.variant || 'primary'),
      onClick: props.onClick,
      'aria-label': props.ariaLabel || undefined,
    },
    props.children
  );
};

window.Card = function Card(props) {
  return React.createElement(
    'div',
    { className: 'card' },
    React.createElement('h3', { className: 'card-title' }, props.title),
    React.createElement('div', { className: 'card-body' }, props.children)
  );
};

window.Navbar = function Navbar(props) {
  var links = [
    { href: 'index.html',    label: 'Home',     key: 'home' },
    { href: 'lista.html',    label: 'Lista',    key: 'lista' },
    { href: 'cadastro.html', label: 'Cadastro', key: 'cadastro' },
  ];
  return React.createElement(
    'nav',
    { className: 'navbar', 'aria-label': 'Navegação principal' },
    links.map(function (l) {
      return React.createElement(
        'a',
        {
          key: l.key,
          href: l.href,
          className: props.current === l.key ? 'active' : '',
          'aria-current': props.current === l.key ? 'page' : undefined,
        },
        l.label
      );
    })
  );
};