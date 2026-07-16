<template>
  <div class="flex flex-wrap mt-4">
    <div class="w-full mb-12 px-4">
      <CardBannersTable />
    </div>
  </div>
</template>

<script>
import CardBannersTable from "@/components/Cards/CardBannersTable.vue";

export default {
  components: {
    CardBannersTable,
  },
};
</script>
