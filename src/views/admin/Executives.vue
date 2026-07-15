<template>
  <div class="flex flex-wrap mt-4">
    <div class="w-full mb-12 px-4">
      <CardExecutivesTable />
    </div>
  </div>
</template>

<script>
import CardExecutivesTable from "@/components/Cards/CardExecutivesTable.vue";

export default {
  components: {
    CardExecutivesTable,
  },
};
</script>
