// api.js

async function buscarQuests() {
  try {
    const response = await fetch("http://localhost:3000/quests");
    const data = await response.json();
    return data; // Retorna a lista de quests
  } catch (error) {
    console.error("Erro ao buscar quests:", error);
    return [];
  }
}
