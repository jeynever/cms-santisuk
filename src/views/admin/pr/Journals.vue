<template>
  <div class="flex flex-wrap mt-4">
    <div class="w-full mb-12 px-4">
      <CardJournalsTable />
    </div>
  </div>
</template>

<script>
import CardJournalsTable from "@/components/Cards/CardJournalsTable.vue";

export default {
  components: {
    CardJournalsTable,
  },
};
</script>
