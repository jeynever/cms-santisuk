<template>
  <div class="flex flex-wrap mt-4">
    <div class="w-full mb-12 px-4">
      <CardAchievementsTable />
    </div>
  </div>
</template>

<script>
import CardAchievementsTable from "@/components/Cards/CardAchievementsTable.vue";

export default {
  components: {
    CardAchievementsTable,
  },
};
</script>
