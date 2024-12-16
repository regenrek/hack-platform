export const usePlayersDb = () => {
  const supabase = useSupabaseClient();

  async function createPlayer(name) {
    const { data, error } = await supabase
      .from("players")
      .insert({ name })
      .select();
    if (error) {
      console.error("Error inserting player:", error);
      return null;
    }
    // data is an array of inserted rows, return the first one
    return data ? data[0] : null;
  }

  return { createPlayer };
};
