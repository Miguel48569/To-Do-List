const buttonAddQuest = document.querySelector(".button-add-quest"); //const button
const inputQuest = document.querySelector(".input-quest"); //const input
const listQuest = document.querySelector(".list-quest");

let minhaListaDeQuest = [];

function adicionarNovaQuest() {
  if (inputQuest.value.trim() === "") {
    return;
  }

  minhaListaDeQuest.push({
    tarefa: inputQuest.value,
    concluida: false,
  });

  inputQuest.value = "";

  mostrarQuest();
}

function mostrarQuest() {
  let novaLi = "";

  minhaListaDeQuest.forEach((quest, index) => {
    novaLi =
      novaLi +
      `
        
    
    <li class="quest ${quest.concluida && "done"}">
        <img  src="img/checked.png" alt="quest-completada" onclick="concluirQuest(${index})" />
        <p>${quest.tarefa}</p>
        <img src="img/excluir.png" alt="excluir-quest" onclick="deletarQuest(${index})" />
    </li>
  `;
  });

  listQuest.innerHTML = novaLi;

  localStorage.setItem("list", JSON.stringify(minhaListaDeQuest));
}

function concluirQuest(index) {
  minhaListaDeQuest[index].concluida = !minhaListaDeQuest[index].concluida;

  mostrarQuest();
}

function deletarQuest(index) {
  minhaListaDeQuest.splice(index, 1);
  mostrarQuest();
}

function recarregarQuest() {
  const questDoLocalStorage = localStorage.getItem("list");
  if (questDoLocalStorage) {
    minhaListaDeQuest = JSON.parse(questDoLocalStorage);
  }
  mostrarQuest();
}
recarregarQuest();
buttonAddQuest.addEventListener("click", adicionarNovaQuest);
