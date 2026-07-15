<template>
  <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded" :class="[color === 'light' ? 'bg-white' : 'bg-emerald-900 text-white']">
    <div class="rounded-t mb-0 px-4 py-3 border-0">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full px-4 max-w-full flex-grow flex-1">
          <h3 class="font-semibold text-lg" :class="[color === 'light' ? 'text-blueGray-700' : 'text-white']">
            ทำเนียบผู้บริหาร
          </h3>
        </div>
        <div class="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
          <router-link
            to="/admin/executives/add"
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
              ลำดับ
            </th>
            <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left" :class="[color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-emerald-800 text-emerald-300 border-emerald-700']">
              ชื่อ-สกุล
            </th>
            <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left" :class="[color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-emerald-800 text-emerald-300 border-emerald-700']">
              ปี พ.ศ.
            </th>
            <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left" :class="[color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-emerald-800 text-emerald-300 border-emerald-700']">
              ตำแหน่ง
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
          <tr v-else-if="executives.length === 0">
            <td colspan="5" class="text-center py-4 text-blueGray-500">
              ไม่มีข้อมูลผู้บริหาร
            </td>
          </tr>
          <tr v-for="exe in executives" :key="exe.id" v-else>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
              {{ exe.order }}
            </td>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4 font-bold" :class="[color === 'light' ? 'text-blueGray-600' : 'text-white']">
              {{ exe.name }}
            </td>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
              {{ exe.years }}
            </td>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
              {{ exe.position }}
            </td>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
              <router-link
                :to="`/admin/executives/edit/${exe.id}`"
                class="text-blueGray-500 bg-transparent border border-solid border-blueGray-500 hover:bg-blueGray-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 inline-block"
              >
                <i class="fas fa-edit"></i> แก้ไข
              </router-link>
              <button
                @click="deleteExecutive(exe)"
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
import { collection, getDocs, doc, deleteDoc, query, orderBy, addDoc } from "firebase/firestore";

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
      executives: [],
      isLoading: true,
    };
  },
  async mounted() {
    await this.fetchExecutives();
  },
  methods: {
    async fetchExecutives() {
      this.isLoading = true;
      try {
        const q = query(collection(db, "executives"), orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);
        let fetched = [];
        querySnapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() });
        });
        
        // Seed initial data if empty
        if (fetched.length === 0) {
          console.log("Seeding initial executives data...");
          const initialData = [
            { order: 1, name: "นายแสวง กองแก้ว", years: "2556-2559", position: "รักษาราชการแทนผู้อำนวยการสถานศึกษา โรงเรียนเทศบาล ๑ (สันติสุข)" },
            { order: 2, name: "นายทวี ใจปิน", years: "2559-2550", position: "รักษาราชการแทนผู้อำนวยการสถานศึกษา โรงเรียนเทศบาล ๑ (สันติสุข)" },
            { order: 3, name: "นายสมยศ ภูเขียว", years: "2550-2551", position: "รักษาราชการแทนผู้อำนวยการสถานศึกษา โรงเรียนเทศบาล ๑ (สันติสุข)" },
            { order: 4, name: "นายสง่า ธรรมศิริ", years: "2551-2555", position: "รักษาราชการแทนผู้อำนวยการสถานศึกษา โรงเรียนเทศบาล ๑ (สันติสุข)" },
            { order: 5, name: "นายสุทธิชัย ใจอุด", years: "2555-2556", position: "รักษาราชการแทนผู้อำนวยการสถานศึกษา โรงเรียนเทศบาล ๑ (สันติสุข)" },
            { order: 6, name: "นางอรชร เมฆอากาศ", years: "2556-2560", position: "ผู้อำนวยการสถานศึกษา โรงเรียนเทศบาล ๑ (สันติสุข)" },
            { order: 7, name: "นายประสาร สมประสงค์", years: "2560-2564", position: "ผู้อำนวยการสถานศึกษา โรงเรียนเทศบาล ๑ (สันติสุข)" },
            { order: 8, name: "นางรัตนา ภาคภูมิ", years: "2564-2565", position: "รักษาราชการแทนผู้อำนวยการสถานศึกษา โรงเรียนเทศบาล ๑ (สันติสุข)" },
            { order: 9, name: "นางสมพร อาจนนท์ลา", years: "2565-2566", position: "ผู้อำนวยการสถานศึกษา โรงเรียนเทศบาล ๑ (สันติสุข)" },
            { order: 10, name: "นางศุธธันย์ ไชยสองวรัชญ์", years: "2566-ปัจจุบัน", position: "ผู้อำนวยการสถานศึกษา โรงเรียนเทศบาล ๑ (สันติสุข)" }
          ];
          for (const item of initialData) {
            await addDoc(collection(db, "executives"), item);
          }
          
          // Refetch
          const q2 = query(collection(db, "executives"), orderBy("order", "asc"));
          const querySnapshot2 = await getDocs(q2);
          fetched = [];
          querySnapshot2.forEach((doc) => {
            fetched.push({ id: doc.id, ...doc.data() });
          });
        }

        this.executives = fetched;
      } catch (error) {
        console.error("Error fetching executives:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async deleteExecutive(exe) {
      if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลของ "${exe.name}" ?`)) {
        try {
          await deleteDoc(doc(db, "executives", exe.id));
          await this.fetchExecutives();
        } catch (error) {
          console.error("Error deleting executive:", error);
          alert("เกิดข้อผิดพลาดในการลบข้อมูล");
        }
      }
    },
  },
};
</script>
