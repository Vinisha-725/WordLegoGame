const BASE_URL = "http://127.0.0.1:8000";

export const createGame = async (player1, player2, theme) => {

  const response = await fetch(
    `${BASE_URL}/create_game?player1=${player1}&player2=${player2}&theme=${theme}`,
    {
      method: "POST"
    }
  );

  return await response.json();
};

export const submitWord = async (gameId, player, word) => {

  const response = await fetch(
    `${BASE_URL}/submit_word?game_id=${gameId}&player=${player}&word=${word}`,
    {
      method: "POST"
    }
  );

  return await response.json();
};