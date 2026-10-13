// ============================================================
// API REST - JSONPlaceholder
// Operações: GET, POST, PUT, DELETE
// ============================================================

const BASE_URL = 'https://jsonplaceholder.typicode.com';

// ---------- GET ----------
async function getPosts() {
  const res = await fetch(`${BASE_URL}/posts?_limit=20`);
  if (!res.ok) throw new Error('Erro ao buscar posts (HTTP ' + res.status + ')');
  return res.json();
}

// ---------- POST ----------
async function createPost(data) {
  const res = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erro ao criar post (HTTP ' + res.status + ')');
  return res.json();
}

// ---------- PUT ----------
async function updatePost(id, data) {
  const res = await fetch(`${BASE_URL}/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erro ao atualizar post (HTTP ' + res.status + ')');
  return res.json();
}

// ---------- DELETE ----------
async function deletePost(id) {
  const res = await fetch(`${BASE_URL}/posts/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Erro ao excluir post (HTTP ' + res.status + ')');
  return true;
}

// Expor globalmente para os scripts de página
window.api = { getPosts, createPost, updatePost, deletePost };