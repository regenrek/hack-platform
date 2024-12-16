<template>
  <div>
    <ul>
      <li v-for="todo in todos" :key="todo.id">{{ todo.name }}</li>
    </ul>

    <Game />
  </div>
</template>

<script setup>
const todos = ref([]);
const supabase = useSupabase();

// Use supabase client
const { data, error } = await supabase.from("todo").select("*");
</script>
