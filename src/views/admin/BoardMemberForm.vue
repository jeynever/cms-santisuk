<template>
  <div class="flex flex-wrap mt-4">
    <div class="w-full mb-12 px-4">
      <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div class="rounded-t bg-white mb-0 px-6 py-6">
          <div class="text-center flex justify-between">
            <h6 class="text-blueGray-700 text-xl font-bold">
              {{ isEditMode ? 'แก้ไขข้อมูลกรรมการสถานศึกษา' : 'เพิ่มข้อมูลกรรมการสถานศึกษา' }}
            </h6>
            <button
              @click="$router.push('/admin/board')"
              class="bg-blueGray-500 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
            >
              <i class="fas fa-arrow-left mr-2"></i>กลับหน้าหลัก
            </button>
          </div>
        </div>
        <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
          <form @submit.prevent="saveMember" v-if="!isLoading">
            <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              ข้อมูลทั่วไป
            </h6>
            <div class="flex flex-wrap">
              <div class="w-full lg:w-6/12 px-4">
                <div class="relative w-full mb-3">
                  <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">ชื่อ-สกุล</label>
                  <input type="text" v-model="form.name" required class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" placeholder="ชื่อและนามสกุล" />
                </div>
              </div>
              <div class="w-full lg:w-6/12 px-4">
                <div class="relative w-full mb-3">
                  <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">ตำแหน่ง</label>
                  <input type="text" v-model="form.position" required class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" placeholder="ตำแหน่ง" />
                </div>
              </div>
              <div class="w-full lg:w-6/12 px-4">
                <div class="relative w-full mb-3">
                  <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">สถานะ</label>
                  <select v-model="form.status" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive (แสดงชื่อเป็น "ว่าง")</option>
                  </select>
                </div>
              </div>
            </div>

            <hr class="mt-6 border-b-1 border-blueGray-300" />
            <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              รูปโปรไฟล์
            </h6>
            <div class="flex flex-wrap">
              <div class="w-full lg:w-6/12 px-4">
                <div class="relative w-full mb-3">
                  <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">อัปโหลดรูปภาพ (ขนาดไม่เกิน 2MB)</label>
                  <input type="file" ref="fileInput" @change="onFileChange" class="border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" accept="image/*" />
                </div>
                <div v-if="form.profileImageBase64" class="mt-4">
                  <img 
                    :src="form.status === 'Inactive' ? blankAvatar : form.profileImageBase64" 
                    class="object-cover rounded-full border shadow-sm mx-auto" 
                    style="width: 200px; height: 200px;" 
                  />
                  <div class="text-emerald-500 text-xs font-bold mt-3 text-center">
                    <i class="fas fa-check-circle mr-1"></i> มีรูปโปรไฟล์แล้ว
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-end mt-6">
              <button class="bg-emerald-500 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="submit" :disabled="isSaving">
                <i class="fas fa-spinner fa-spin mr-1" v-if="isSaving"></i> {{ isSaving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล' }}
              </button>
            </div>
          </form>
          
          <div v-if="isLoading" class="text-center py-20">
            <i class="fas fa-spinner fa-spin text-3xl text-emerald-500"></i>
            <p class="mt-3 text-blueGray-500">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Crop Modal -->
    <div v-if="showCropModal" style="position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; z-index: 999999 !important; background-color: rgba(0,0,0,0.85) !important; display: flex !important; justify-content: center !important; align-items: center !important; width: 100vw !important; height: 100vh !important;">
      <div style="position: relative !important; background-color: white !important; width: 100% !important; max-width: 42rem !important; margin: 0 1rem !important; border-radius: 0.5rem !important; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1) !important; display: flex !important; flex-direction: column !important; max-height: 100vh !important; z-index: 1000000 !important;">
        <div class="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
          <h3 class="text-xl font-semibold">ปรับแต่งรูปโปรไฟล์</h3>
          <button type="button" class="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none" @click="closeCropModal">
            <span class="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
          </button>
        </div>
        <div class="relative p-6 flex-auto flex justify-center" style="max-height: 60vh;">
          <img ref="cropImage" :src="cropImageSrc" style="max-width: 100%; max-height: 50vh; display: block;" />
        </div>
        <div class="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
          <button class="text-blueGray-500 bg-transparent border border-solid border-blueGray-500 hover:bg-blueGray-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" @click="closeCropModal">
            ยกเลิก
          </button>
          <button class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" @click="cropImage">
            ตัดรูปและยืนยัน
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { db } from "@/firebase";
import { doc, getDoc, addDoc, updateDoc, collection, serverTimestamp } from "firebase/firestore";
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

export default {
  data() {
    return {
      isEditMode: false,
      isLoading: false,
      isSaving: false,
      memberId: null,
      form: {
        name: "",
        position: "",
        status: "Active",
        profileImageBase64: "",
      },
      // Cropper state
      showCropModal: false,
      cropImageSrc: "",
      cropperInstance: null,
      blankAvatar: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiNiY2JjYmMiLz48cGF0aCBkPSJNMTIgMTNjLTIuNjcgMC04IDEuMzQtOCA0djNoMTZ2LTNjMC0yLjY2LTUuMzMtNC04LTR6IiBmaWxsPSIjZjJmMmYyIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSI4IiByPSI0IiBmaWxsPSIjZjJmMmYyIi8+PC9zdmc+",
    };
  },
  async mounted() {
    const id = this.$route.params.id;
    if (id) {
      this.isEditMode = true;
      this.memberId = id;
      await this.loadMemberData(id);
    }
  },
  methods: {
    async loadMemberData(id) {
      this.isLoading = true;
      try {
        const docRef = doc(db, "board_members", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          this.form = {
            name: data.name || "",
            position: data.position || "",
            status: data.status || "Active",
            profileImageBase64: data.profileImageBase64 || "",
          };
        } else {
          alert("ไม่พบข้อมูลกรรมการ");
          this.$router.push('/admin/board');
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async saveMember() {
      if (!this.form.name || !this.form.position) return;
      this.isSaving = true;
      try {
        const memberData = {
          name: this.form.name,
          position: this.form.position,
          status: this.form.status,
          profileImageBase64: this.form.profileImageBase64,
          updatedAt: serverTimestamp(),
        };

        if (this.isEditMode && this.memberId) {
          const docRef = doc(db, "board_members", this.memberId);
          await updateDoc(docRef, memberData);
        } else {
          memberData.createdAt = serverTimestamp();
          await addDoc(collection(db, "board_members"), memberData);
        }
        
        this.$router.push('/admin/board');
      } catch (error) {
        console.error("Error saving member:", error);
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      } finally {
        this.isSaving = false;
      }
    },
    async onFileChange(e) {
      try {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        
        const file = files[0];
        if (!file.type.startsWith('image/')) {
          alert("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น");
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
          this.cropImageSrc = event.target.result;
          this.showCropModal = true;
          this.$nextTick(() => {
            this.initCropper();
          });
        };
        reader.onerror = (err) => {
          console.error("FileReader error:", err);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.error("onFileChange error:", err);
      }
    },
    initCropper() {
      try {
        if (this.cropperInstance) {
          this.cropperInstance.destroy();
        }
        if (!this.$refs.cropImage) return;
        this.cropperInstance = new Cropper(this.$refs.cropImage, {
          aspectRatio: 1,
          viewMode: 1,
          dragMode: 'move',
          background: true,
        });
      } catch (err) {
        console.error("initCropper error:", err);
      }
    },
    cropImage() {
      if (!this.cropperInstance) return;
      
      const canvas = this.cropperInstance.getCroppedCanvas({
        width: 512,
        height: 512,
      });

      this.form.profileImageBase64 = canvas.toDataURL('image/jpeg', 0.8);
      this.closeCropModal();
    },
    closeCropModal() {
      if (this.cropperInstance) {
        this.cropperInstance.destroy();
        this.cropperInstance = null;
      }
      this.showCropModal = false;
      this.cropImageSrc = "";
      if(this.$refs.fileInput && !this.form.profileImageBase64) {
        this.$refs.fileInput.value = "";
      }
    },
  },
};
</script>
