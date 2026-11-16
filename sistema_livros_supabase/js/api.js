import { SUPABASE_URL, SUPABASE_ANON_KEY, TABELA } from "./config.js";

const endpoint = `${SUPABASE_URL}/rest/v1/${TABELA}`;

function cabecalhos(extra = {}) {
  return {
    "Content-Type": "application/json",
    "apikey": `${SUPABASE_ANON_KEY}`,
    ...extra
  };
}

async function requisicao(url, opcoes = {}) {
  const resposta = await fetch(url, {
    ...opcoes,
    headers: cabecalhos(opcoes.headers || {})
  });
  if (!resposta.ok) {
    const detalhe = await resposta.text();
    throw new Error(detalhe || `Erro HTTP ${resposta.status}`);
  }
  if (resposta.status === 204) return null;
  const texto = await resposta.text();
  return texto ? JSON.parse(texto) : null;
}

// 1. GET: consulta todos os livros.
export async function listarLivros() {
  return requisicao(`${endpoint}?select=*&order=id.desc`);
}

// 2. GET: consulta um livro pelo identificador.
export async function buscarLivro(id) {
  const dados = await requisicao(`${endpoint}?id=eq.${encodeURIComponent(id)}&select=*`);
  return dados[0] || null;
}

// 3. GET: pesquisa título usando filtro ilike.
export async function pesquisarLivros(termo) {
  return requisicao(`${endpoint}?select=*&titulo=ilike.*${encodeURIComponent(termo)}*&order=titulo.asc`);
}

// 4. POST: cria um novo registro.
export async function criarLivro(livro) {
  return requisicao(endpoint, {
    method: "POST",
    headers: { "Prefer": "return=representation" },
    body: JSON.stringify(livro)
  });
}

// 5. PATCH: atualiza um registro existente.
export async function atualizarLivro(id, livro) {
  return requisicao(`${endpoint}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Prefer": "return=representation" },
    body: JSON.stringify(livro)
  });
}

// 6. DELETE: remove um registro.
export async function excluirLivro(id) {
  return requisicao(`${endpoint}?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { "Prefer": "return=minimal" }
  });
}

// 7. GET: verifica se já existe um título igual (verificação auxiliar).
export async function verificarTitulo(titulo, idIgnorado = null) {
  let url = `${endpoint}?select=id&titulo=ilike.${encodeURIComponent(titulo)}`;
  if (idIgnorado !== null) url += `&id=neq.${encodeURIComponent(idIgnorado)}`;
  const dados = await requisicao(url);
  return dados.length > 0;
}
