<template>
  <div class="flex flex-wrap mt-4">
    <div class="w-full mb-12 px-4">
      <CardNewsTable />
    </div>
  </div>
</template>

<script>
import CardNewsTable from "@/components/Cards/CardNewsTable.vue";

export default {
  components: {
    CardNewsTable,
  },
};
</script>
