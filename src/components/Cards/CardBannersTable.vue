<template>
  <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded" :class="[color === 'light' ? 'bg-white' : 'bg-emerald-900 text-white']">
    <div class="rounded-t mb-0 px-4 py-3 border-0">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full px-4 max-w-full flex-grow flex-1">
          <h3 class="font-semibold text-lg" :class="[color === 'light' ? 'text-blueGray-700' : 'text-white']">
            แบนเนอร์เว็บไซต์
          </h3>
        </div>
        <div class="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
          <router-link
            to="/admin/banners/add"
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
              รูปภาพแบนเนอร์
            </th>
            <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left" :class="[color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-emerald-800 text-emerald-300 border-emerald-700']">
              ระยะเวลาแสดงผล
            </th>
            <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left" :class="[color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-emerald-800 text-emerald-300 border-emerald-700']">
              สถานะ
            </th>
            <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left" :class="[color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-emerald-800 text-emerald-300 border-emerald-700']">
              จัดการ
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="4" class="text-center py-4">
              <i class="fas fa-spinner fa-spin text-emerald-500 text-2xl"></i>
            </td>
          </tr>
          <tr v-else-if="banners.length === 0">
            <td colspan="4" class="text-center py-4 text-blueGray-500">
              ไม่มีข้อมูลแบนเนอร์
            </td>
          </tr>
          <tr v-for="item in banners" :key="item.id" v-else>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
              <img :src="item.imageUrl" alt="Banner Image" class="rounded shadow-sm" style="width: 100px; max-width: 100px; height: auto; object-fit: contain;" v-if="item.imageUrl" />
              <div v-else class="w-24 h-16 bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded">No Image</div>
            </td>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
              <div><strong>เริ่ม:</strong> {{ item.startDate }} {{ item.startTime }}</div>
              <div><strong>สิ้นสุด:</strong> {{ item.endDate }} {{ item.endTime }}</div>
            </td>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
              <span :class="getBannerStatus(item).class">
                <i class="fas fa-circle mr-1 text-xs"></i>
                {{ getBannerStatus(item).text }}
              </span>
            </td>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
              <router-link
                :to="`/admin/banners/edit/${item.id}`"
                class="text-blueGray-500 bg-transparent border border-solid border-blueGray-500 hover:bg-blueGray-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 inline-block"
              >
                <i class="fas fa-edit"></i> แก้ไข
              </router-link>
              <button
                @click="deleteBanner(item)"
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
      banners: [],
      isLoading: true,
    };
  },
  async mounted() {
    await this.fetchBanners();
  },
  methods: {
    getBannerStatus(item) {
      if (!item.startDate || !item.endDate) return { text: 'ไม่ได้ระบุ', class: 'text-blueGray-400' };
      
      const now = new Date();
      // Ensure we have time, default to 00:00 and 23:59 respectively if missing
      const startString = `${item.startDate}T${item.startTime || '00:00'}`;
      const endString = `${item.endDate}T${item.endTime || '23:59'}`;
      
      const start = new Date(startString);
      const end = new Date(endString);
      
      if (now >= start && now <= end) {
        return { text: 'กำลังใช้งาน', class: 'text-emerald-500 font-bold' };
      } else {
        return { text: 'ไม่ได้ใช้งาน', class: 'text-blueGray-400' };
      }
    },
    async fetchBanners() {
      this.isLoading = true;
      try {
        const q = query(collection(db, "banners"), orderBy("startDate", "desc"));
        const querySnapshot = await getDocs(q);
        let fetched = [];
        querySnapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() });
        });
        fetched.sort((a, b) => {
          const dateA = a.startDate ? new Date(a.startDate + "T" + (a.startTime || "00:00")).getTime() : 0;
          const dateB = b.startDate ? new Date(b.startDate + "T" + (b.startTime || "00:00")).getTime() : 0;
          return dateB - dateA;
        });
        this.banners = fetched;
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async deleteBanner(item) {
      if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบแบนเนอร์นี้ ?`)) {
        try {
          await deleteDoc(doc(db, "banners", item.id));
          await this.fetchBanners();
        } catch (error) {
          console.error("Error deleting banner:", error);
          alert("เกิดข้อผิดพลาดในการลบข้อมูล");
        }
      }
    },
  },
};
</script>
