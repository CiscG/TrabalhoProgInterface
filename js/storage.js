// ============================================================
// Persistência local com localStorage
// Mantém as alterações entre recarregamentos e sessões
// ============================================================

const STORAGE_KEY = 'meu-projeto-posts-v1';

function carregarDoStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('[Storage] Erro ao ler:', e);
    return null;
  }
}

function salvarNoStorage(posts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (e) {
    console.error('[Storage] Erro ao salvar:', e);
  }
}

function limparStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('[Storage] Erro ao limpar:', e);
  }
}

window.storage = { carregarDoStorage, salvarNoStorage, limparStorage };