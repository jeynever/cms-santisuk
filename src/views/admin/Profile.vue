<template>
  <div class="flex flex-wrap">
    <div class="w-full lg:w-8/12 px-4">
      <CardProfileEdit />
    </div>
    <div class="w-full lg:w-4/12 px-4">
      <CardProfilePreview />
    </div>
  </div>
</template>
<script>
import CardProfileEdit from "@/components/Cards/CardProfileEdit.vue";
import CardProfilePreview from "@/components/Cards/CardProfilePreview.vue";

export default {
  components: {
    CardProfileEdit,
    CardProfilePreview,
  },
};
</script>
