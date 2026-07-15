<template>
  <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded" :class="[color === 'light' ? 'bg-white' : 'bg-emerald-900 text-white']">
    <div class="rounded-t mb-0 px-4 py-3 border-0">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full px-4 max-w-full flex-grow flex-1">
          <h3 class="font-semibold text-lg" :class="[color === 'light' ? 'text-blueGray-700' : 'text-white']">
            ข่าวโรงเรียน
          </h3>
        </div>
        <div class="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
          <router-link
            to="/admin/pr/news/add"
            class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
          >
            <i class="fas fa-plus"></i> เพิ่มข้อมูล
          </router-link>
        </div>
      </div>
    </div>
    <div class="block w-full overflow-x-auto">
      <table class="items-center w-full bg-transparent border-collapse">
        <thead>
          <tr>
            <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left" :class="[color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-emerald-800 text-emerald-300 border-emerald-700']">
              รูปภาพข่าว
            </th>
            <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left" :class="[color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-emerald-800 text-emerald-300 border-emerald-700']">
              หัวข้อ / ชื่อเรื่อง
            </th>
            <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left" :class="[color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-emerald-800 text-emerald-300 border-emerald-700']">
              วันที่ลงข่าว
            </th>
            <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left w-1/3" :class="[color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-emerald-800 text-emerald-300 border-emerald-700']">
              รายละเอียด (ย่อ)
            </th>
            <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left" :class="[color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-emerald-800 text-emerald-300 border-emerald-700']">
              จัดการ
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="5" class="text-center py-4">
              <i class="fas fa-spinner fa-spin text-emerald-500 text-2xl"></i>
            </td>
          </tr>
          <tr v-else-if="news.length === 0">
            <td colspan="5" class="text-center py-4 text-blueGray-500">
              ไม่มีข้อมูลข่าว
            </td>
          </tr>
          <tr v-for="item in news" :key="item.id" v-else>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
              <img :src="item.imageUrl" alt="News Image" class="w-24 h-auto rounded shadow-sm" v-if="item.imageUrl" />
              <div v-else class="w-24 h-16 bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded">No Image</div>
            </td>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm p-4" :class="[color === 'light' ? 'text-blueGray-600' : 'text-white']">
              <p class="truncate font-bold" style="max-width: 250px;">{{ item.title }}</p>
            </td>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
              {{ item.publishDate }}
            </td>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm p-4">
              <p class="truncate text-blueGray-500" style="max-width: 250px;">{{ item.description }}</p>
            </td>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
              <router-link
                :to="`/admin/pr/news/edit/${item.id}`"
                class="text-blueGray-500 bg-transparent border border-solid border-blueGray-500 hover:bg-blueGray-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 inline-block"
              >
                <i class="fas fa-edit"></i> แก้ไข
              </router-link>
              <button
                @click="deleteNews(item)"
                class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-xs px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              >
                <i class="fas fa-trash"></i> ลบ
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase";
import { collection, getDocs, doc, deleteDoc, query, orderBy } from "firebase/firestore";

export default {
  props: {
    color: {
      default: "light",
      validator: function (value) {
        return ["light", "dark"].indexOf(value) !== -1;
      },
    },
  },
  data() {
    return {
      news: [],
      isLoading: true,
    };
  },
  async mounted() {
    await this.fetchNews();
  },
  methods: {
    async fetchNews() {
      this.isLoading = true;
      try {
        // Query by publishDate descending (newest first)
        const q = query(collection(db, "news"), orderBy("publishDate", "desc"));
        const querySnapshot = await getDocs(q);
        let fetched = [];
        querySnapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() });
        });
        // Sort descending by publishDate explicitly on the client side
        fetched.sort((a, b) => {
          const dateA = a.publishDate ? new Date(a.publishDate).getTime() : 0;
          const dateB = b.publishDate ? new Date(b.publishDate).getTime() : 0;
          return dateB - dateA;
        });
        this.news = fetched;
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async deleteNews(item) {
      if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบข่าว "${item.title}" ?`)) {
        try {
          await deleteDoc(doc(db, "news", item.id));
          await this.fetchNews();
        } catch (error) {
          console.error("Error deleting news:", error);
          alert("เกิดข้อผิดพลาดในการลบข้อมูล");
        }
      }
    },
  },
};
</script>
