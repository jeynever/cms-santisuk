<template>
  <div class="flex flex-wrap mt-4">
    <div class="w-full mb-12 px-4">
      <CardBoardTable />
    </div>
    <div class="w-full mb-12 px-4">
      <CardBoardOrders />
    </div>
  </div>
</template>

<script>
import CardBoardTable from "@/components/Cards/CardBoardTable.vue";
import CardBoardOrders from "@/components/Cards/CardBoardOrders.vue";

export default {
  components: {
    CardBoardTable,
    CardBoardOrders,
  },
};
</script>
