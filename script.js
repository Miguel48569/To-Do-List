const buttonAddQuest = document.querySelector(".button-add-quest");
const inputQuest = document.querySelector(".input-quest");
const listQuest = document.querySelector(".list-quest");

let minhaListaDeQuest = [];

const API_URL = "http://localhost:3000/quests"; // seu backend rodando

async function buscarQuests() {
  try {
    const resposta = await fetch(API_URL);
    const quests = await resposta.json();
    minhaListaDeQuest = quests;
    mostrarQuest();
  } catch (error) {
    console.error("Erro ao buscar quests:", error);
  }
}

async function adicionarNovaQuest() {
  if (inputQuest.value.trim() === "") {
    return;
  }

  try {
    const resposta = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: inputQuest.value }),
    });

    const novaQuest = await resposta.json();
    minhaListaDeQuest.push(novaQuest);
    inputQuest.value = "";
    mostrarQuest();
  } catch (error) {
    console.error("Erro ao adicionar quest:", error);
  }
}

function mostrarQuest() {
  let novaLi = "";

  minhaListaDeQuest.forEach((quest) => {
    novaLi += `
      <li class="quest ${quest.done ? "done" : ""}">
          <img src="img/checked.png" alt="quest-completada" onclick="concluirQuest(${
            quest.id
          })" />
          <p>${quest.text}</p>
          <img src="img/excluir.png" alt="excluir-quest" onclick="deletarQuest(${
            quest.id
          })" />
      </li>
    `;
  });

  listQuest.innerHTML = novaLi;
}

async function concluirQuest(id) {
  const quest = minhaListaDeQuest.find((q) => q.id === id);
  if (!quest) return;

  try {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !quest.done }),
    });

    quest.done = !quest.done;
    mostrarQuest();
  } catch (error) {
    console.error("Erro ao concluir quest:", error);
  }
}

async function deletarQuest(id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });

    minhaListaDeQuest = minhaListaDeQuest.filter((quest) => quest.id !== id);
    mostrarQuest();
  } catch (error) {
    console.error("Erro ao deletar quest:", error);
  }
}

buttonAddQuest.addEventListener("click", adicionarNovaQuest);

// Quando carregar a página, busca as quests do servidor:
buscarQuests();
