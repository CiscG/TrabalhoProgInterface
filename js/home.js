function Home() {
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Navbar, { current: 'home' }),
    React.createElement(
      'main',
      { id: 'main', className: 'container' },
      React.createElement('h1', null, 'Bem-vindo ao Meu Site'),
      React.createElement('p', null, 'Este é um parágrafo de exemplo.'),
      React.createElement(
        Card,
        { title: 'Seção Importante' },
        React.createElement('p', null, 'Esta é uma seção com conteúdo relevante.')
      )
    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(Home)
);