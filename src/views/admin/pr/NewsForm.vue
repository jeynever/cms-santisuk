<template>
  <div class="flex flex-wrap mt-4">
    <div class="w-full mb-12 px-4">
      <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div class="rounded-t bg-white mb-0 px-6 py-6">
          <div class="text-center flex justify-between items-center">
            <h6 class="text-blueGray-700 text-xl font-bold">
              {{ isEditing ? 'แก้ไขข้อมูลข่าวโรงเรียน' : 'เพิ่มข้อมูลข่าวโรงเรียน' }}
            </h6>
            <div>
              <router-link
                to="/admin/pr/news"
                class="bg-orange-500 text-white active:bg-orange-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-2 ease-linear transition-all duration-150 inline-block"
              >
                ยกเลิก
              </router-link>
              <button
                class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150 inline-block"
                type="button"
                @click="saveData"
                :disabled="isSaving"
              >
                <i class="fas fa-spinner fa-spin mr-1" v-if="isSaving"></i>
                บันทึกข้อมูล
              </button>
            </div>
          </div>
        </div>
        <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
          <form>
            <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              ข้อมูลข่าว
            </h6>
            <div class="flex flex-wrap">
              <div class="w-full lg:w-12/12 px-4">
                <div class="relative w-full mb-3">
                  <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                    หัวข้อ / ชื่อเรื่อง
                  </label>
                  <input
                    type="text"
                    v-model="form.title"
                    class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="ระบุหัวข้อข่าว"
                  />
                </div>
              </div>
              <div class="w-full lg:w-4/12 px-4">
                <div class="relative w-full mb-3">
                  <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                    รูปภาพข่าว (16:9, ไม่เกิน 2MB)
                  </label>
                  <input
                    type="file"
                    ref="fileInput"
                    @change="onFileChange"
                    accept="image/*"
                    class="border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  />
                  <div v-if="form.imageUrl" class="mt-4">
                    <img :src="form.imageUrl" class="w-full rounded shadow" />
                  </div>
                </div>
              </div>

              <div class="w-full lg:w-8/12 px-4 flex flex-col">
                <div class="relative w-full mb-3">
                  <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                    วันที่ลงข่าว
                  </label>
                  <input
                    type="date"
                    v-model="form.publishDate"
                    class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  />
                </div>

                <div class="relative w-full mb-3 mt-2 flex-grow">
                  <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                    รายละเอียดเนื้อหา
                  </label>
                  <textarea
                    v-model="form.description"
                    rows="6"
                    class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full h-[calc(100%-28px)] ease-linear transition-all duration-150"
                    placeholder="ระบุรายละเอียดเนื้อหา..."
                  ></textarea>
                </div>
              </div>
            </div>
            
            <!-- Removed bottom buttons -->
          </form>
        </div>
      </div>
    </div>
    
    <!-- Crop Modal -->
    <div v-if="showCropModal" class="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-75 pt-10">
      <div class="relative bg-white w-full max-w-4xl mx-4 rounded-lg shadow-lg flex flex-col max-h-screen">
        <div class="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
          <h3 class="text-xl font-semibold">ครอบตัดรูปภาพข่าว (16:9)</h3>
          <button class="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none" @click="closeCropModal">
            <span class="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
          </button>
        </div>
        <div class="relative p-6 flex-auto flex justify-center bg-gray-100" style="max-height: 60vh;">
          <img ref="cropImage" :src="cropImageSrc" style="max-width: 100%; max-height: 50vh; display: block;" />
        </div>
        <div class="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
          <button class="text-blueGray-500 bg-transparent border border-solid border-blueGray-500 hover:bg-blueGray-500 hover:text-white font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" @click="closeCropModal">
            ยกเลิก
          </button>
          <button class="bg-emerald-500 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" @click="cropImage">
            <i class="fas fa-spinner fa-spin mr-1" v-if="isUploading"></i>
            {{ isUploading ? 'กำลังอัปโหลด...' : 'ตัดรูปและยืนยัน' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { db } from "@/firebase";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

export default {
  data() {
    return {
      isSaving: false,
      isEditing: false,
      docId: null,
      form: {
        title: "",
        publishDate: "",
        description: "",
        imageUrl: "",
      },
      // Cropper states
      showCropModal: false,
      cropImageSrc: "",
      cropperInstance: null,
      tempFileName: "",
      isUploading: false,
    };
  },
  async mounted() {
    this.docId = this.$route.params.id;
    if (this.docId) {
      this.isEditing = true;
      await this.fetchData();
    }
  },
  methods: {
    async fetchData() {
      try {
        const docRef = doc(db, "news", this.docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          this.form = docSnap.data();
        } else {
          alert("ไม่พบข้อมูลข่าวนี้");
          this.$router.push("/admin/pr/news");
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    },
    async onFileChange(e) {
      try {
        const files = e.target.files;
        if (files.length > 0) {
          const file = files[0];
          
          if (!file.type.startsWith('image/')) {
            alert("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น");
            this.$refs.fileInput.value = "";
            return;
          }

          // Check file size limit: 2MB (2 * 1024 * 1024 bytes)
          if (file.size > 2 * 1024 * 1024) {
            alert("ขนาดไฟล์ต้องไม่เกิน 2MB");
            this.$refs.fileInput.value = "";
            return;
          }
          
          this.tempFileName = file.name;
          
          const reader = new FileReader();
          reader.onload = (event) => {
            this.cropImageSrc = event.target.result;
            this.showCropModal = true;
            this.$nextTick(() => {
              this.initCropper();
            });
          };
          reader.readAsDataURL(file);
        }
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
          aspectRatio: 16 / 9, // For news images
          viewMode: 1,
          dragMode: 'move',
          background: true,
        });
      } catch (err) {
        console.error("initCropper error:", err);
      }
    },
    async cropImage() {
      if (!this.cropperInstance) return;
      
      const canvas = this.cropperInstance.getCroppedCanvas({
        width: 1280, // standardized width for 16:9
        height: 720,
      });

      const base64Image = canvas.toDataURL('image/jpeg', 0.85);
      
      // Attempt to upload to Cloudinary
      const cloudName = process.env.VUE_APP_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.VUE_APP_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        alert("คำเตือน: ยังไม่ได้ตั้งค่า Cloudinary (VUE_APP_CLOUDINARY_CLOUD_NAME และ VUE_APP_CLOUDINARY_UPLOAD_PRESET ในไฟล์ .env) ระบบจะบันทึกเป็น Base64 แทนชั่วคราว");
        this.form.imageUrl = base64Image;
        this.closeCropModal();
        return;
      }

      this.isUploading = true;
      try {
        const formData = new FormData();
        formData.append('file', base64Image);
        formData.append('upload_preset', uploadPreset);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData
        });

        const data = await response.json();
        
        if (response.ok && data.secure_url) {
          this.form.imageUrl = data.secure_url;
          this.closeCropModal();
        } else {
          console.error("Cloudinary upload failed:", data);
          alert("เกิดข้อผิดพลาดในการอัปโหลดไปยัง Cloudinary: " + (data.error?.message || "Unknown error"));
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("ไม่สามารถอัปโหลดรูปภาพได้ กรุณาลองใหม่อีกครั้ง");
      } finally {
        this.isUploading = false;
      }
    },
    closeCropModal() {
      if (this.cropperInstance) {
        this.cropperInstance.destroy();
        this.cropperInstance = null;
      }
      this.showCropModal = false;
      this.cropImageSrc = "";
      this.tempFileName = "";
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = "";
      }
    },
    async saveData() {
      if (!this.form.title || !this.form.publishDate || !this.form.description || !this.form.imageUrl) {
        alert("กรุณากรอกข้อมูลและอัปโหลดรูปภาพให้ครบถ้วน");
        return;
      }
      this.isSaving = true;
      try {
        if (this.isEditing) {
          const docRef = doc(db, "news", this.docId);
          await updateDoc(docRef, this.form);
        } else {
          await addDoc(collection(db, "news"), this.form);
        }
        this.$router.push("/admin/pr/news");
      } catch (error) {
        console.error("Error saving news:", error);
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      } finally {
        this.isSaving = false;
      }
    },
  },
};
</script>
