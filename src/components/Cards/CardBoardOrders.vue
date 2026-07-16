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
      <form @submit.prevent="submitForm">
        <!-- Row 1: Name and Date -->
        <div class="flex flex-wrap -mx-3">
          <!-- Order Name (75%) -->
          <div class="w-full md:w-9/12 px-3 mb-4">
            <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">ชื่อคำสั่ง</label>
            <input type="text" v-model="form.orderName" required placeholder="เช่น แต่งตั้งคณะกรรมการฯ ปี 2567" class="border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
          </div>
          
          <!-- Order Date (25%) -->
          <div class="w-full md:w-3/12 px-3 mb-4">
            <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">วันที่คำสั่ง</label>
            <input type="date" v-model="form.orderDate" required class="border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
          </div>
        </div>

        <!-- Row 2: File Upload -->
        <div class="flex flex-wrap -mx-3">
          <div class="w-full px-3">
            <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">อัปโหลดไฟล์ (PDF, JPG, PNG)</label>
            <input type="file" ref="fileInput" @change="onFileChange" accept=".pdf,image/*" :required="!isEditMode" class="border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
            <p v-if="isEditMode" class="text-xs text-lightBlue-500 mt-1">*เลือกไฟล์ใหม่หากต้องการเปลี่ยนเอกสาร</p>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex flex-wrap mt-4">
          <div class="w-full flex justify-end gap-2">
            <button v-if="isEditMode" type="button" @click="cancelEdit" class="text-blueGray-500 bg-transparent border border-solid border-blueGray-500 hover:bg-blueGray-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded outline-none focus:outline-none ease-linear transition-all duration-150">
              ยกเลิก
            </button>
            <button type="submit" :disabled="isUploading" class="text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150 disabled:opacity-50" :class="isEditMode ? 'bg-lightBlue-500 hover:bg-lightBlue-600' : 'bg-emerald-500 hover:bg-emerald-600'">
              <i class="fas fa-spinner fa-spin mr-1" v-if="isUploading"></i>
              {{ isUploading ? 'กำลังบันทึก...' : (isEditMode ? 'บันทึกการแก้ไข' : 'เพิ่มเอกสาร') }}
            </button>
          </div>
        </div>
      </form>
    </div>

    <div class="block w-full overflow-x-auto">
      <table class="items-center w-full bg-transparent border-collapse">
        <thead>
          <tr>
            <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
              ชื่อคำสั่ง
            </th>
            <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
              วันที่คำสั่ง
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
              <span class="ml-2 font-bold text-blueGray-600">{{ order.orderName || order.title }}</span>
            </td>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
              {{ formatDate(order.orderDate) }}
            </td>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
              <a :href="order.fileBase64 || order.fileUrl" :download="order.fileName" class="text-emerald-500 bg-transparent border border-solid border-emerald-500 hover:bg-emerald-500 hover:text-white active:bg-emerald-600 font-bold uppercase text-xs px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 inline-block">
                <i class="fas fa-download"></i> ดาวน์โหลด
              </a>
              <button @click="editOrder(order)" class="text-lightBlue-500 bg-transparent border border-solid border-lightBlue-500 hover:bg-lightBlue-500 hover:text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
                <i class="fas fa-edit"></i> แก้ไข
              </button>
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
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc, serverTimestamp } from "firebase/firestore";

export default {
  data() {
    return {
      orders: [],
      isLoading: true,
      isUploading: false,
      isEditMode: false,
      editId: null,
      form: {
        orderName: "",
        orderDate: "",
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
        const querySnapshot = await getDocs(collection(db, "board_orders"));
        const fetchedOrders = [];
        querySnapshot.forEach((doc) => {
          fetchedOrders.push({ id: doc.id, ...doc.data() });
        });
        
        // Sort in JavaScript to handle documents missing orderDate safely
        fetchedOrders.sort((a, b) => {
          const dateA = a.orderDate || (a.createdAt && a.createdAt.toDate ? a.createdAt.toDate().toISOString() : "");
          const dateB = b.orderDate || (b.createdAt && b.createdAt.toDate ? b.createdAt.toDate().toISOString() : "");
          return dateB.localeCompare(dateA); // Descending order
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
    async submitForm() {
      if (!this.form.orderName || !this.form.orderDate) {
        alert("กรุณากรอกชื่อคำสั่งและวันที่คำสั่ง");
        return;
      }

      if (!this.isEditMode && !this.form.file) {
        alert("กรุณาเลือกไฟล์เอกสาร");
        return;
      }

      this.isUploading = true;

      try {
        if (this.form.file) {
          // If there's a new file, read it as Base64 and then save/update
          const file = this.form.file;
          const safeName = file.name.replace(/\s+/g, '_');
          
          const reader = new FileReader();
          reader.onload = async (event) => {
            const base64String = event.target.result;
            await this.saveToFirestore(base64String, file.type, safeName, file.name);
          };
          reader.onerror = (err) => {
            console.error("Error reading file:", err);
            alert("เกิดข้อผิดพลาดในการอ่านไฟล์");
            this.isUploading = false;
          };
          reader.readAsDataURL(file);
        } else {
          // If edit mode and no new file, just update text fields
          await this.saveToFirestore(null, null, null, null);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("เกิดข้อผิดพลาด: " + error.message);
        this.isUploading = false;
      }
    },
    async saveToFirestore(base64String, fileType, safeName, originalName) {
      try {
        const dataObj = {
          orderName: this.form.orderName,
          orderDate: this.form.orderDate,
          updatedAt: serverTimestamp(),
        };

        if (base64String) {
          dataObj.title = originalName;
          dataObj.fileName = safeName;
          dataObj.fileType = fileType;
          dataObj.fileBase64 = base64String;
        }

        if (this.isEditMode) {
          await updateDoc(doc(db, "board_orders", this.editId), dataObj);
        } else {
          dataObj.createdAt = serverTimestamp();
          await addDoc(collection(db, "board_orders"), dataObj);
        }

        this.cancelEdit();
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
    },
    editOrder(order) {
      this.isEditMode = true;
      this.editId = order.id;
      this.form.orderName = order.orderName || order.title || "";
      this.form.orderDate = order.orderDate || "";
      this.form.file = null;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = "";
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    cancelEdit() {
      this.isEditMode = false;
      this.editId = null;
      this.form.orderName = "";
      this.form.orderDate = "";
      this.form.file = null;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = "";
      }
    },
    async deleteOrder(order) {
      if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบเอกสาร "${order.orderName || order.title}" ?`)) {
        try {
          await deleteDoc(doc(db, "board_orders", order.id));
          await this.fetchOrders();
        } catch (error) {
          console.error("Error deleting order:", error);
          alert("เกิดข้อผิดพลาดในการลบเอกสาร");
        }
      }
    },
    formatDate(dateString) {
      if (!dateString) return "";
      // dateString is typically YYYY-MM-DD from input[type="date"]
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  }
};
</script>
