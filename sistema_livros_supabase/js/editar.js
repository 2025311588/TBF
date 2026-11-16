import "./components.js";
import { buscarLivro, atualizarLivro, verificarTitulo } from "./api.js";

const id = new URLSearchParams(location.search).get("id");
const formulario = document.querySelector("#form-livro");
const mensagem = document.querySelector("#mensagem");
const campo = nome => formulario.elements[nome];

if (!id) {
  mensagem.textContent = "Nenhum livro foi selecionado. Volte à página de consulta e escolha um registro.";
  mensagem.className = "message error";
  formulario.querySelector("button[type=submit]").disabled = true;
} else {
  carregar();
}
async function carregar() {
  try {
    const livro = await buscarLivro(id);
    if (!livro) throw new Error("Registro não encontrado.");
    campo("titulo").value = livro.titulo || "";
    campo("autor").value = livro.autor || "";
    campo("ano").value = livro.ano ?? "";
    campo("genero").value = livro.genero || "";
    campo("descricao").value = livro.descricao || "";
  } catch (erro) {
    mensagem.textContent = `Não foi possível abrir o registro: ${erro.message}`;
    mensagem.className = "message error";
  }
}
formulario.addEventListener("submit", async evento => {
  evento.preventDefault();
  const livro = {
    titulo: campo("titulo").value.trim(),
    autor: campo("autor").value.trim(),
    ano: campo("ano").value ? Number(campo("ano").value) : null,
    genero: campo("genero").value.trim() || null,
    descricao: campo("descricao").value.trim() || null
  };
  try {
    if (await verificarTitulo(livro.titulo, id)) throw new Error("Outro livro já utiliza esse título.");
    await atualizarLivro(id, livro);
    mensagem.textContent = "Alterações salvas com sucesso!";
    mensagem.className = "message success";
  } catch (erro) {
    mensagem.textContent = `Não foi possível atualizar: ${erro.message}`;
    mensagem.className = "message error";
  }
});
