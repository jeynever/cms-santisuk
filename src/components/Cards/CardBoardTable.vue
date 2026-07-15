<template>
  <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
    <div class="rounded-t mb-0 px-4 py-3 border-0">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full px-4 max-w-full flex-grow flex-1">
          <h3 class="font-semibold text-lg text-blueGray-700">
            รายชื่อคณะกรรมการสถานศึกษา
          </h3>
        </div>
        <div class="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
          <router-link
            to="/admin/board/add"
            class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
          >
            <i class="fas fa-plus mr-2"></i>เพิ่มกรรมการ
          </router-link>
        </div>
      </div>
    </div>
    
    <div class="block w-full overflow-x-auto">
      <table class="items-center w-full bg-transparent border-collapse">
        <thead>
          <tr>
            <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">ชื่อ-สกุล</th>
            <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">ตำแหน่ง</th>
            <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">สถานะ</th>
            <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">จัดการ</th>
          </tr>
        </thead>
        <tbody v-if="!isLoading">
          <tr v-for="member in members" :key="member.id">
            <th class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
              <img 
                :src="member.status === 'Inactive' ? blankAvatar : (member.profileImageBase64 || defaultImage)" 
                class="h-12 w-12 bg-white rounded-full border object-cover" 
                alt="..." 
              />
              <span class="ml-3 font-bold text-blueGray-600">
                {{ member.status === 'Inactive' ? 'ว่าง' : member.name }}
              </span>
            </th>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
              {{ member.position }}
            </td>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
              <span 
                class="px-2 py-1 text-xs font-bold rounded" 
                :class="member.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'"
              >
                {{ member.status }}
              </span>
            </td>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
              <button @click="$router.push(`/admin/board/edit/${member.id}`)" class="text-lightBlue-500 bg-transparent border border-solid border-lightBlue-500 hover:bg-lightBlue-500 hover:text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
                <i class="fas fa-edit"></i> แก้ไข
              </button>
              <button @click="deleteMember(member.id)" class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-xs px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
                <i class="fas fa-trash"></i> ลบ
              </button>
            </td>
          </tr>
          <tr v-if="members.length === 0">
            <td colspan="4" class="text-center py-6 text-blueGray-500 text-sm">ไม่มีข้อมูลคณะกรรมการสถานศึกษา</td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="4" class="text-center py-10">
              <i class="fas fa-spinner fa-spin text-2xl text-emerald-500"></i>
              <p class="mt-2 text-sm text-blueGray-500">กำลังโหลดข้อมูล...</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
import { db } from "@/firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

export default {
  data() {
    return {
      members: [],
      isLoading: true,
      defaultImage: require("@/assets/img/team-1-800x800.jpg"),
      blankAvatar: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiNiY2JjYmMiLz48cGF0aCBkPSJNMTIgMTNjLTIuNjcgMC04IDEuMzQtOCA0djNoMTZ2LTNjMC0yLjY2LTUuMzMtNC04LTR6IiBmaWxsPSIjZjJmMmYyIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSI4IiByPSI0IiBmaWxsPSIjZjJmMmYyIi8+PC9zdmc+",
    };
  },
  async mounted() {
    await this.fetchMembers();
  },
  methods: {
    async fetchMembers() {
      this.isLoading = true;
      try {
        const querySnapshot = await getDocs(collection(db, "board_members"));
        const membersList = [];
        querySnapshot.forEach((doc) => {
          membersList.push({ id: doc.id, ...doc.data() });
        });
        // Sort if needed, currently no sort field so just display as fetched
        this.members = membersList;
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async deleteMember(id) {
      if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลกรรมการท่านนี้?")) {
        try {
          await deleteDoc(doc(db, "board_members", id));
          await this.fetchMembers();
        } catch (error) {
          console.error("Error deleting member:", error);
          alert("เกิดข้อผิดพลาดในการลบข้อมูล");
        }
      }
    },
  }
};
</script>
