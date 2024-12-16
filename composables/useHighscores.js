export const useHighscores = () => {
  const supabase = useSupabaseClient();

  async function fetchTopHighscores(limit = 10) {
    let { data, error } = await supabase
      .from("player_highscores")
      .select("score, players!inner(name)")
      .order("score", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching highscores:", error);
      return [];
    }

    // Data is of shape [{ score: number, players: { name: string }}, ...]
    return data.map((row) => ({ name: row.players.name, score: row.score }));
  }

  async function saveHighscore(playerId, score) {
    const { data, error } = await supabase
      .from("player_highscores")
      .insert({ player_id: playerId, score })
      .select();

    if (error) {
      console.error("Error inserting highscore:", error);
    }
    return data;
  }

  return { fetchTopHighscores, saveHighscore };
};
