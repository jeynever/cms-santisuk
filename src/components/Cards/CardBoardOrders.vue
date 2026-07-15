<template>
  <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
    <div class="rounded-t mb-0 px-4 py-3 border-0">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full px-4 max-w-full flex-grow flex-1">
          <h3 class="font-semibold text-lg text-blueGray-700">
            เอกสารคำสั่งแต่งตั้งคณะกรรมการสถานศึกษา
          </h3>
        </div>
      </div>
    </div>
    
    <div class="p-4 bg-blueGray-50 border-t border-b border-blueGray-200">
      <form @submit.prevent="uploadFile" class="flex flex-col md:flex-row items-end gap-4">
        <div class="w-full md:w-8/12">
          <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">อัปโหลดไฟล์ (PDF, JPG, PNG ขนาดไม่เกิน 750KB)</label>
          <input type="file" ref="fileInput" @change="onFileChange" accept=".pdf,image/*" required class="border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
        </div>
        <div class="w-full md:w-4/12 text-right">
          <button type="submit" :disabled="isUploading || !form.file" class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none w-full ease-linear transition-all duration-150 disabled:opacity-50">
            <i class="fas fa-spinner fa-spin mr-1" v-if="isUploading"></i>
            {{ isUploading ? 'อัปโหลด...' : 'เพิ่มเอกสาร' }}
          </button>
        </div>
      </form>
    </div>

    <div class="block w-full overflow-x-auto">
      <table class="items-center w-full bg-transparent border-collapse">
        <thead>
          <tr>
            <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
              ชื่อเอกสาร
            </th>
            <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
              วันที่อัปโหลด
            </th>
            <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
              จัดการ
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="3" class="text-center py-4">
              <i class="fas fa-spinner fa-spin text-emerald-500 text-2xl"></i>
            </td>
          </tr>
          <tr v-else-if="orders.length === 0">
            <td colspan="3" class="text-center py-4 text-blueGray-500">
              ยังไม่มีข้อมูลเอกสารคำสั่งแต่งตั้ง
            </td>
          </tr>
          <tr v-for="order in orders" :key="order.id" v-else>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
              <i class="fas" :class="order.fileType.includes('pdf') ? 'fa-file-pdf text-red-500' : 'fa-file-image text-blue-500'"></i>
              <span class="ml-2 font-bold text-blueGray-600">{{ order.title }}</span>
            </td>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
              {{ formatDate(order.createdAt) }}
            </td>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
              <a :href="order.fileBase64 || order.fileUrl" :download="order.fileName" class="text-emerald-500 bg-transparent border border-solid border-emerald-500 hover:bg-emerald-500 hover:text-white active:bg-emerald-600 font-bold uppercase text-xs px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 inline-block">
                <i class="fas fa-download"></i> ดาวน์โหลด
              </a>
              <button @click="deleteOrder(order)" class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-xs px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
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
import { collection, getDocs, addDoc, doc, deleteDoc, serverTimestamp, orderBy, query } from "firebase/firestore";

export default {
  data() {
    return {
      orders: [],
      isLoading: true,
      isUploading: false,
      form: {
        file: null,
      },
    };
  },
  async mounted() {
    await this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      this.isLoading = true;
      try {
        const q = query(collection(db, "board_orders"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedOrders = [];
        querySnapshot.forEach((doc) => {
          fetchedOrders.push({ id: doc.id, ...doc.data() });
        });
        this.orders = fetchedOrders;
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        this.isLoading = false;
      }
    },
    onFileChange(e) {
      const files = e.target.files;
      if (files.length > 0) {
        const file = files[0];
        // Check size (750KB limit to ensure Base64 < 1MB limit for Firestore)
        if (file.size > 750 * 1024) {
          alert("ไฟล์ใหญ่เกินไป! เนื่องจากข้อจำกัดของระบบฐานข้อมูล กรุณาอัปโหลดไฟล์ที่มีขนาดไม่เกิน 750 KB");
          this.$refs.fileInput.value = "";
          this.form.file = null;
          return;
        }
        this.form.file = file;
      }
    },
    async uploadFile() {
      if (!this.form.file) {
        alert("กรุณาเลือกไฟล์");
        return;
      }

      this.isUploading = true;
      try {
        const file = this.form.file;
        const safeName = file.name.replace(/\s+/g, '_');
        
        // Read file as Data URL (Base64)
        const reader = new FileReader();
        reader.onload = async (event) => {
          const base64String = event.target.result;
          
          try {
            // Save to Firestore
            await addDoc(collection(db, "board_orders"), {
              title: file.name,
              fileName: safeName,
              fileType: file.type,
              fileBase64: base64String,
              createdAt: serverTimestamp(),
            });

            // Reset form
            this.form.file = null;
            if (this.$refs.fileInput) {
              this.$refs.fileInput.value = "";
            }
            
            // Refresh list
            await this.fetchOrders();
          } catch (err) {
            console.error("Error saving doc:", err);
            if (err.code === 'resource-exhausted') {
              alert("อัปโหลดไม่สำเร็จ: ขนาดข้อมูลเกินขีดจำกัดของระบบ (ไฟล์ใหญ่เกินไป)");
            } else {
              alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล: " + err.message);
            }
          } finally {
            this.isUploading = false;
          }
        };
        
        reader.onerror = (err) => {
          console.error("Error reading file:", err);
          alert("เกิดข้อผิดพลาดในการอ่านไฟล์");
          this.isUploading = false;
        };
        
        reader.readAsDataURL(file);

      } catch (error) {
        console.error("Error uploading file:", error);
        alert("เกิดข้อผิดพลาด: " + error.message);
        this.isUploading = false;
      }
    },
    async deleteOrder(order) {
      if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบเอกสาร "${order.title}" ?`)) {
        try {
          // Delete from Firestore only
          await deleteDoc(doc(db, "board_orders", order.id));
          
          // Refresh list
          await this.fetchOrders();
        } catch (error) {
          console.error("Error deleting order:", error);
          alert("เกิดข้อผิดพลาดในการลบเอกสาร");
        }
      }
    },
    formatDate(timestamp) {
      if (!timestamp) return "";
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  }
};
</script>
