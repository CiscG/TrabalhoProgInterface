// ============================================================
// Loader: carrega components.js + <page>.js em sequência
// (sem Babel — os arquivos usam React.createElement)
// ============================================================

(async function () {
  var root = document.getElementById('root');
  var page = document.body.dataset.page;
  if (!page) return;

  try {
    if (typeof React === 'undefined') throw new Error('React não carregou (CDN)');
    if (typeof ReactDOM === 'undefined') throw new Error('ReactDOM não carregou (CDN)');

    var arquivos = ['js/components.js', 'js/' + page + '.js'];

    for (var i = 0; i < arquivos.length; i++) {
      var res = await fetch(arquivos[i]);
      if (!res.ok) throw new Error('Falha ao carregar ' + arquivos[i] + ' (HTTP ' + res.status + ')');
      var code = await res.text();
      var tag = document.createElement('script');
      tag.textContent = code;
      document.body.appendChild(tag);
    }
  } catch (err) {
    console.error('[Loader]', err);
    if (root) {
      root.innerHTML =
        '<div role="alert" style="padding:20px;color:#dc2626;font-family:sans-serif">' +
        '<strong>Erro ao carregar a página:</strong><br>' + err.message +
        '</div>';
    }
  }
})();