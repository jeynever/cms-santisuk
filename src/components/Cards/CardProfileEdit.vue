<template>
  <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
    <div class="rounded-t bg-white mb-0 px-6 py-6">
      <div class="text-center flex justify-between">
        <h6 class="text-blueGray-700 text-xl font-bold">
          {{ isEditingSelf ? 'บัญชีผู้ใช้' : 'แก้ไขข้อมูลบัญชีผู้ใช้' }}
        </h6>
        <button
          class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 disabled:opacity-50"
          type="button"
          @click="updateProfile"
          :disabled="isLoading"
        >
          {{ isLoading ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข' }}
        </button>
      </div>
      <div v-if="successMessage" class="text-emerald-500 text-sm font-bold mt-3">{{ successMessage }}</div>
      <div v-if="errorMessage" class="text-red-500 text-sm font-bold mt-3">{{ errorMessage }}</div>
    </div>
    <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
      <form v-if="!isFetchingData">
        <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
          ข้อมูลการเข้าระบบ
        </h6>
        <div class="flex flex-wrap">
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">Email (ห้ามแก้ไข)</label>
              <input type="email" v-model="form.email" readonly class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-blueGray-200 rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150 cursor-not-allowed" />
            </div>
          </div>
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">Username (ห้ามแก้ไข)</label>
              <input type="text" v-model="form.username" readonly class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-blueGray-200 rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150 cursor-not-allowed" />
            </div>
          </div>
        </div>

        <hr class="mt-6 border-b-1 border-blueGray-300" />
        <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
          ข้อมูลส่วนตัว
        </h6>
        <div class="flex flex-wrap">
          <div class="w-full lg:w-4/12 px-4">
            <div class="relative w-full mb-3">
              <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">คำนำหน้า</label>
              <select v-model="form.prefix" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                <option value="นาย">นาย</option>
                <option value="นาง">นาง</option>
                <option value="นางสาว">นางสาว</option>
                <option value="ดร.">ดร.</option>
              </select>
            </div>
          </div>
          <div class="w-full lg:w-4/12 px-4">
            <div class="relative w-full mb-3">
              <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">ชื่อ</label>
              <input type="text" v-model="form.firstName" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
            </div>
          </div>
          <div class="w-full lg:w-4/12 px-4">
            <div class="relative w-full mb-3">
              <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">นามสกุล</label>
              <input type="text" v-model="form.lastName" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
            </div>
          </div>
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">เลขบัตรประชาชน (ห้ามแก้ไข)</label>
              <input type="text" v-model="form.nationalId" readonly class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-blueGray-200 rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150 cursor-not-allowed" />
            </div>
          </div>
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">วันเดือนปีเกิด (พ.ศ.)</label>
              <input type="text" v-model="form.dob" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
            </div>
          </div>
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">เบอร์โทรศัพท์</label>
              <input type="text" v-model="form.phone" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
            </div>
          </div>
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">รูปโปรไฟล์ (เลือกเพื่อเปลี่ยน)</label>
              <input type="file" ref="fileInput" @change="onFileChange" accept="image/*" class="border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
            </div>
            <div v-if="profileImageBase64" class="mt-2 text-emerald-500 text-xs font-bold">
              <i class="fas fa-check-circle mr-1"></i> เลือกรูปและตัดแต่งสำเร็จแล้ว <span v-if="selectedFileName">({{ selectedFileName }})</span>
            </div>
          </div>
        </div>

        <hr class="mt-6 border-b-1 border-blueGray-300" />
        <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
          ข้อมูลการทำงาน
        </h6>
        <div class="flex flex-wrap">
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">ตำแหน่ง</label>
              <input type="text" v-model="form.position" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
            </div>
          </div>
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">วิทยฐานะ</label>
              <input type="text" v-model="form.academicStanding" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
            </div>
          </div>
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">ระดับสิทธิ์การใช้งาน</label>
              <select v-if="canEditRole" v-model="form.role" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                <option value="teacher">Teacher</option>
                <option value="director">Director</option>
                <option value="admin">Admin</option>
              </select>
              <input v-else type="text" v-model="form.role" readonly class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-blueGray-200 rounded text-sm shadow focus:outline-none w-full ease-linear transition-all duration-150 cursor-not-allowed" />
            </div>
          </div>
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">สังกัด</label>
              <select v-model="form.affiliation" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                <option value="โรงเรียน">โรงเรียน</option>
                <option value="กองการศึกษา">กองการศึกษา</option>
              </select>
            </div>
          </div>
        </div>
      </form>
      <div v-else class="text-center py-10">
        <i class="fas fa-spinner fa-spin text-3xl text-emerald-500"></i>
        <p class="mt-3 text-blueGray-500">กำลังโหลดข้อมูล...</p>
      </div>
    </div>

    <!-- Crop Modal -->
    <div v-if="showCropModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div class="relative bg-white w-full max-w-2xl mx-4 rounded-lg shadow-lg flex flex-col max-h-screen">
        <div class="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
          <h3 class="text-xl font-semibold">ปรับแต่งรูปโปรไฟล์</h3>
          <button class="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none" @click="closeCropModal">
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
import { auth, db } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { encryptData, decryptData } from "@/utils/crypto";
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

export default {
  data() {
    return {
      currentUserId: null,
      currentUserRole: null,
      targetUserId: null,
      isFetchingData: true,
      isLoading: false,
      successMessage: "",
      errorMessage: "",
      form: {
        email: "",
        username: "",
        prefix: "",
        firstName: "",
        lastName: "",
        nationalId: "",
        dob: "",
        phone: "",
        position: "",
        academicStanding: "",
        role: "",
        affiliation: "",
      },
      profileImageBase64: "",
      showCropModal: false,
      cropImageSrc: "",
      cropperInstance: null,
      tempFileName: "",
      selectedFileName: "",
    };
  },
  computed: {
    isEditingSelf() {
      return this.currentUserId === this.targetUserId;
    },
    canEditRole() {
      if (this.isEditingSelf) return false;
      return this.currentUserRole === 'admin' || this.currentUserRole === 'super-admin';
    }
  },
  mounted() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.currentUserId = user.uid;
        
        // Fetch current user's role for permission check
        const currentUserRef = doc(db, "users", user.uid);
        const currentUserSnap = await getDoc(currentUserRef);
        if (currentUserSnap.exists()) {
          this.currentUserRole = currentUserSnap.data().role;
        }

        // Determine target user to edit
        this.targetUserId = this.$route.params.id || user.uid;
        
        await this.fetchUserData(this.targetUserId);
      } else {
        this.$router.push("/auth/login");
      }
    });
  },
  methods: {
    async fetchUserData(uid) {
      try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          this.form.email = decryptData(data.emailEncrypted) || "";
          this.form.username = data.username || "";
          this.form.prefix = data.prefix || "";
          this.form.firstName = decryptData(data.firstNameEncrypted) || "";
          this.form.lastName = decryptData(data.lastNameEncrypted) || "";
          this.form.nationalId = decryptData(data.nationalIdEncrypted) || "";
          this.form.dob = decryptData(data.dobEncrypted) || "";
          this.form.phone = decryptData(data.phoneEncrypted) || "";
          this.form.position = data.position || "";
          this.form.academicStanding = data.academicStanding || "";
          this.form.role = data.role || "";
          this.form.affiliation = data.affiliation || "";
          this.profileImageBase64 = decryptData(data.profileImageEncrypted) || "";
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        this.errorMessage = "ไม่สามารถโหลดข้อมูลได้";
      } finally {
        this.isFetchingData = false;
      }
    },
    async onFileChange(e) {
      try {
        this.errorMessage = "";
        const files = e.target.files;
        if (!files || files.length === 0) return;
        
        const file = files[0];
        if (!file.type.startsWith('image/')) {
          this.errorMessage = "กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น (เช่น JPG, PNG)";
          alert(this.errorMessage);
          return;
        }
        
        this.tempFileName = file.name || "profile_image";
        
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
          alert("เกิดข้อผิดพลาดในการอ่านไฟล์");
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.error("onFileChange error:", err);
        alert("เกิดข้อผิดพลาด: " + err.message);
      }
    },
    initCropper() {
      if (this.cropperInstance) {
        this.cropperInstance.destroy();
      }
      this.cropperInstance = new Cropper(this.$refs.cropImage, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: 'move',
        background: true,
      });
    },
    cropImage() {
      if (!this.cropperInstance) return;
      
      const canvas = this.cropperInstance.getCroppedCanvas({
        width: 512,
        height: 512,
      });

      this.profileImageBase64 = canvas.toDataURL('image/jpeg', 0.8);
      this.selectedFileName = this.tempFileName;
      this.closeCropModal();
    },
    closeCropModal() {
      if (this.cropperInstance) {
        this.cropperInstance.destroy();
        this.cropperInstance = null;
      }
      this.showCropModal = false;
      this.cropImageSrc = "";
      this.tempFileName = "";
      if(this.$refs.fileInput) {
        this.$refs.fileInput.value = "";
      }
    },
    async updateProfile() {
      if (!this.targetUserId) return;
      
      this.isLoading = true;
      this.errorMessage = "";
      this.successMessage = "";

      try {
        const docRef = doc(db, "users", this.targetUserId);
        
        const updateData = {
          prefix: this.form.prefix,
          firstNameEncrypted: encryptData(this.form.firstName),
          lastNameEncrypted: encryptData(this.form.lastName),
          dobEncrypted: encryptData(this.form.dob),
          phoneEncrypted: encryptData(this.form.phone),
          position: this.form.position,
          academicStanding: this.form.academicStanding,
          affiliation: this.form.affiliation,
        };

        if (this.canEditRole) {
          updateData.role = this.form.role;
        }

        if (this.profileImageBase64) {
          updateData.profileImageEncrypted = encryptData(this.profileImageBase64);
        }

        await updateDoc(docRef, updateData);
        
        this.successMessage = "อัปเดตข้อมูลส่วนตัวสำเร็จ";
        
        // Notify other components (like CardProfilePreview) that profile was updated
        window.dispatchEvent(new Event('profile-updated'));

        setTimeout(() => {
          this.successMessage = "";
        }, 3000);
      } catch (error) {
        console.error("Error updating profile:", error);
        this.errorMessage = "เกิดข้อผิดพลาดในการอัปเดตข้อมูล";
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>
