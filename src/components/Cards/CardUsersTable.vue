<template>
  <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
    <div class="rounded-t mb-0 px-4 py-3 border-0">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full px-4 max-w-full flex-grow flex-1">
          <h3 class="font-semibold text-lg text-blueGray-700">
            รายชื่อผู้ใช้งานระบบ
            <span v-if="isUpdatingOrder" class="ml-2 text-sm text-emerald-500 font-normal">
              <i class="fas fa-spinner fa-spin mr-1"></i> กำลังบันทึกลำดับ...
            </span>
          </h3>
        </div>
        <div class="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
          <router-link
            to="/auth/register"
            class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
          >
            <i class="fas fa-plus mr-2"></i>เพิ่มสมาชิก
          </router-link>
        </div>
      </div>
    </div>
    
    <div class="block w-full overflow-x-auto">
      <table class="items-center w-full bg-transparent border-collapse">
        <thead>
          <tr>
            <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100 w-10"></th>
            <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">ผู้ใช้งาน</th>
            <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">อีเมล</th>
            <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">ระดับสิทธิ์ / ตำแหน่ง</th>
            <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">สังกัด</th>
            <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">จัดการ</th>
          </tr>
        </thead>
        <tbody v-if="!isLoading">
          <tr v-for="(user, index) in users" :key="user.id"
              :draggable="canManage(user)"
              @dragstart="onDragStart($event, index)"
              @dragover.prevent
              @drop="onDrop($event, index)"
              @dragenter.prevent
              class="transition-all duration-200"
              :class="{ 'opacity-50 bg-blueGray-100': dragIndex === index, 'cursor-move': canManage(user) }">
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
              <i class="fas fa-grip-lines text-blueGray-400" v-if="canManage(user)"></i>
            </td>
            <th class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
              <img :src="user.profileImage || defaultImage" class="h-12 w-12 bg-white rounded-full border object-cover" alt="..." />
              <span class="ml-3 font-bold text-blueGray-600">
                {{ user.prefix }}{{ user.firstName }} {{ user.lastName }}
                <br/><span class="text-xs text-blueGray-400 font-normal">@{{ user.username }}</span>
              </span>
            </th>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
              {{ user.email }}
            </td>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
              <span class="px-2 py-1 text-xs font-bold rounded" :class="roleBadgeColor(user.role)">
                {{ user.role }}
              </span>
              <br/><span class="text-blueGray-500 text-xs mt-1 block">{{ user.position }}</span>
            </td>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
              {{ user.affiliation }}
            </td>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
              <router-link 
                v-if="canManage(user)"
                :to="'/admin/profile/' + user.id"
                class="text-blueGray-500 bg-transparent border border-solid border-blueGray-500 hover:bg-blueGray-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 inline-block text-center"
              >
                <i class="fas fa-edit"></i>
              </router-link>
              <button 
                v-else
                class="text-blueGray-500 bg-transparent border border-solid border-blueGray-500 font-bold uppercase text-xs px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 opacity-30 cursor-not-allowed inline-block text-center"
                disabled
              >
                <i class="fas fa-edit"></i>
              </button>
              <button 
                class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-xs px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                type="button"
                @click="openDeleteModal(user)"
                :disabled="!canDelete(user)"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
          <tr v-if="users.length === 0">
            <td colspan="6" class="text-center py-4 text-blueGray-500">ไม่พบข้อมูลผู้ใช้งาน</td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="6" class="text-center py-10">
              <i class="fas fa-spinner fa-spin text-3xl text-emerald-500"></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>


    <!-- Delete Modal -->
    <div v-if="showDeleteModal" class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
      <div class="relative w-auto my-6 mx-auto max-w-sm">
        <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          <div class="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
            <h3 class="text-xl font-semibold text-red-500">ยืนยันการลบ</h3>
            <button class="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none" @click="showDeleteModal = false">
              <span class="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
            </button>
          </div>
          <div class="relative p-6 flex-auto">
            <p class="my-4 text-blueGray-500 text-lg leading-relaxed">
              คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีของ <strong>{{ selectedUser.firstName }}</strong> ?<br/>การกระทำนี้ไม่สามารถย้อนกลับได้
            </p>
          </div>
          <div class="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
            <button class="text-blueGray-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" @click="showDeleteModal = false">
              ยกเลิก
            </button>
            <button class="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" @click="confirmDelete">
              ยืนยันการลบ
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showDeleteModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>

  </div>
</template>

<script>
import { db } from "@/firebase";
import { collection, getDocs, doc, deleteDoc, writeBatch } from "firebase/firestore";
import { decryptData } from "@/utils/crypto";
import team2 from "@/assets/img/team-2-800x800.jpg";

export default {
  props: {
    currentUserRole: {
      type: String,
      required: true
    },
    currentUserId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isLoading: true,
      users: [],
      defaultImage: team2,
      showDeleteModal: false,
      selectedUser: null,
      dragIndex: null,
      isUpdatingOrder: false,
    };
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      this.isLoading = true;
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const fetchedUsers = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedUsers.push({
            id: doc.id,
            username: data.username || "",
            prefix: data.prefix || "",
            firstName: decryptData(data.firstNameEncrypted) || "",
            lastName: decryptData(data.lastNameEncrypted) || "",
            email: decryptData(data.emailEncrypted) || "",
            role: data.role || "unknown",
            position: data.position || "",
            affiliation: data.affiliation || "",
            profileImage: decryptData(data.profileImageEncrypted) || "",
            order: data.order || 9999
          });
        });
        
        // If sorting failed because of missing fields or mixed types, enforce frontend sort
        fetchedUsers.sort((a, b) => a.order - b.order);
        
        this.users = fetchedUsers;
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        this.isLoading = false;
      }
    },
    roleBadgeColor(role) {
      if (role === 'super-admin') return 'bg-red-200 text-red-600';
      if (role === 'admin') return 'bg-orange-200 text-orange-600';
      if (role === 'director') return 'bg-teal-200 text-teal-600';
      return 'bg-lightBlue-200 text-lightBlue-600';
    },
    canManage(user) {
      // Cannot manage (edit/delete) oneself
      if (user.id === this.currentUserId) return false;
      
      if (this.currentUserRole === 'super-admin') return true;
      if (this.currentUserRole === 'admin' && user.role === 'super-admin') return false;
      return true;
    },
    canDelete(user) {
      // Cannot delete oneself
      if (user.id === this.currentUserId) return false;
      // Normal management rules apply
      return this.canManage(user);
    },
    openDeleteModal(user) {
      this.selectedUser = user;
      this.showDeleteModal = true;
    },
    async confirmDelete() {
      try {
        const userRef = doc(db, "users", this.selectedUser.id);
        await deleteDoc(userRef);
        this.showDeleteModal = false;
        this.fetchUsers(); // Refresh
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("เกิดข้อผิดพลาดในการลบข้อมูล");
      }
    },
    onDragStart(event, index) {
      this.dragIndex = index;
      event.dataTransfer.effectAllowed = 'move';
    },
    async onDrop(event, index) {
      if (this.dragIndex === null || this.dragIndex === index) return;
      
      const movedItem = this.users[this.dragIndex];
      this.users.splice(this.dragIndex, 1);
      this.users.splice(index, 0, movedItem);
      
      this.dragIndex = null;
      await this.saveOrder();
    },
    async saveOrder() {
      this.isUpdatingOrder = true;
      try {
        const batch = writeBatch(db);
        this.users.forEach((user, idx) => {
          user.order = idx + 1;
          const userRef = doc(db, "users", user.id);
          batch.update(userRef, { order: user.order });
        });
        await batch.commit();
      } catch (error) {
        console.error("Error updating order:", error);
        alert("เกิดข้อผิดพลาดในการบันทึกลำดับ อาจเนื่องจากยังไม่ได้สร้าง Index กรุณาตรวจสอบใน Console");
      } finally {
        this.isUpdatingOrder = false;
      }
    }
  }
};
</script>
