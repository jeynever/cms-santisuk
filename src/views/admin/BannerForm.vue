<template>
  <div class="flex flex-wrap mt-4">
    <div class="w-full mb-12 px-4">
      <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div class="rounded-t bg-white mb-0 px-6 py-6">
          <div class="text-center flex justify-between items-center">
            <h6 class="text-blueGray-700 text-xl font-bold">
              {{ isEditing ? 'แก้ไขข้อมูลแบนเนอร์เว็บไซต์' : 'เพิ่มข้อมูลแบนเนอร์เว็บไซต์' }}
            </h6>
            <div>
              <router-link
                to="/admin/banners"
                class="bg-orange-500 text-white active:bg-orange-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-2 ease-linear transition-all duration-150 inline-block"
              >
                ยกเลิก
              </router-link>
              <button
                class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150 inline-block"
                type="button"
                @click="saveData"
                :disabled="isSaving || isUploading"
              >
                <i class="fas fa-spinner fa-spin mr-1" v-if="isSaving || isUploading"></i>
                {{ isUploading ? 'กำลังอัปโหลด...' : 'บันทึกข้อมูล' }}
              </button>
            </div>
          </div>
        </div>
        <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
          <form>
            <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              ข้อมูลแบนเนอร์
            </h6>
            <div class="flex flex-wrap">
              <!-- Image Upload -->
              <div class="w-full lg:w-12/12 px-4">
                <div class="relative w-full mb-3">
                  <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                    รูปภาพแบนเนอร์ (1920x650 px, ไม่เกิน 5MB)
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

              <!-- Start Date & Time -->
              <div class="w-full lg:w-6/12 px-4">
                <div class="relative w-full mb-3">
                  <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                    วันที่เริ่ม
                  </label>
                  <input
                    type="date"
                    v-model="form.startDate"
                    class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  />
                </div>
              </div>
              <div class="w-full lg:w-6/12 px-4">
                <div class="relative w-full mb-3">
                  <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                    เวลาเริ่ม
                  </label>
                  <input
                    type="time"
                    v-model="form.startTime"
                    class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  />
                </div>
              </div>

              <!-- End Date & Time -->
              <div class="w-full lg:w-6/12 px-4">
                <div class="relative w-full mb-3">
                  <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                    วันที่สิ้นสุด
                  </label>
                  <input
                    type="date"
                    v-model="form.endDate"
                    class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  />
                </div>
              </div>
              <div class="w-full lg:w-6/12 px-4">
                <div class="relative w-full mb-3">
                  <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                    เวลาสิ้นสุด
                  </label>
                  <input
                    type="time"
                    v-model="form.endTime"
                    class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";

export default {
  data() {
    return {
      isSaving: false,
      isEditing: false,
      isUploading: false,
      docId: null,
      form: {
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        imageUrl: "",
      },
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
        const docRef = doc(db, "banners", this.docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          this.form = docSnap.data();
        } else {
          alert("ไม่พบข้อมูลแบนเนอร์นี้");
          this.$router.push("/admin/banners");
        }
      } catch (error) {
        console.error("Error fetching banner:", error);
      }
    },
    onFileChange(e) {
      const files = e.target.files;
      if (files.length > 0) {
        const file = files[0];

        // Check file size limit: 5MB (5 * 1024 * 1024 bytes)
        if (file.size > 5 * 1024 * 1024) {
          alert("ขนาดไฟล์ต้องไม่เกิน 5MB");
          this.$refs.fileInput.value = "";
          return;
        }

        const img = new Image();
        const reader = new FileReader();

        reader.onload = (event) => {
          img.src = event.target.result;
          img.onload = async () => {
            if (img.width !== 1920 || img.height !== 650) {
              alert(`รูปภาพของคุณมีขนาด ${img.width}x${img.height} px ซึ่งไม่ตรงกับที่กำหนด (1920x650 px)\nกรุณาทำรูปภาพมาใหม่ให้ได้ขนาดพอดีเป๊ะครับ`);
              this.$refs.fileInput.value = "";
            } else {
              // Upload to Cloudinary
              const base64Image = event.target.result;
              const cloudName = process.env.VUE_APP_CLOUDINARY_CLOUD_NAME;
              const uploadPreset = process.env.VUE_APP_CLOUDINARY_UPLOAD_PRESET;

              if (!cloudName || !uploadPreset) {
                alert("คำเตือน: ยังไม่ได้ตั้งค่า Cloudinary (VUE_APP_CLOUDINARY_CLOUD_NAME และ VUE_APP_CLOUDINARY_UPLOAD_PRESET ในไฟล์ .env) ระบบจะบันทึกเป็น Base64 แทนชั่วคราว");
                this.form.imageUrl = base64Image;
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
                } else {
                  console.error("Cloudinary upload failed:", data);
                  alert("เกิดข้อผิดพลาดในการอัปโหลดไปยัง Cloudinary: " + (data.error?.message || "Unknown error"));
                  this.$refs.fileInput.value = "";
                }
              } catch (error) {
                console.error("Upload error:", error);
                alert("ไม่สามารถอัปโหลดรูปภาพได้ กรุณาลองใหม่อีกครั้ง");
                this.$refs.fileInput.value = "";
              } finally {
                this.isUploading = false;
              }
            }
          };
        };
        reader.readAsDataURL(file);
      }
    },
    async saveData() {
      if (!this.form.imageUrl || !this.form.startDate || !this.form.startTime || !this.form.endDate || !this.form.endTime) {
        alert("กรุณากรอกข้อมูลให้ครบทุกช่อง และเลือกรูปภาพแบนเนอร์");
        return;
      }

      this.isSaving = true;

      try {
        if (this.isEditing) {
          await updateDoc(doc(db, "banners", this.docId), this.form);
        } else {
          await addDoc(collection(db, "banners"), this.form);
        }

        alert("บันทึกข้อมูลสำเร็จ!");
        this.$router.push("/admin/banners");
      } catch (error) {
        console.error("Error saving banner:", error);
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      } finally {
        this.isSaving = false;
      }
    },
  },
};
</script>
