<template>
  <div class="container mx-auto px-4 h-full">
    <div class="flex content-center items-center justify-center h-full">
      <div class="w-full lg:w-8/12 px-4">
        <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
          <div class="rounded-t mb-0 px-6 py-6">
            <div class="text-center mb-3">
              <h6 class="text-blueGray-500 text-sm font-bold">
                ลงทะเบียนบัญชีใหม่
              </h6>
            </div>
            <hr class="mt-6 border-b-1 border-blueGray-300" />
          </div>
          <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
            <form v-if="!isPageLoading && hasPermission">
              <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                ข้อมูลการเข้าระบบ
              </h6>
              <div class="flex flex-wrap">
                <div class="w-full lg:w-6/12 px-4">
                  <div class="relative w-full mb-3">
                    <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">Email</label>
                    <input type="email" v-model="form.email" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" placeholder="อีเมล" />
                  </div>
                </div>
                <div class="w-full lg:w-6/12 px-4">
                  <div class="relative w-full mb-3">
                    <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">Username</label>
                    <input type="text" v-model="form.username" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" placeholder="ชื่อผู้ใช้งาน" />
                  </div>
                </div>
                <div class="w-full lg:w-6/12 px-4">
                  <div class="relative w-full mb-3">
                    <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">Password</label>
                    <input type="password" v-model="form.password" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" placeholder="รหัสผ่าน" />
                  </div>
                </div>
                <div class="w-full lg:w-6/12 px-4">
                  <div class="relative w-full mb-3">
                    <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">Confirm Password</label>
                    <input type="password" v-model="form.confirmPassword" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" placeholder="ยืนยันรหัสผ่าน" />
                    <p v-if="passwordMatchStatus" :class="[passwordMatchStatus.color, 'text-xs', 'mt-1', 'font-semibold']">
                      {{ passwordMatchStatus.text }}
                    </p>
                  </div>
                </div>
              </div>

              <hr class="mt-6 border-b-1 border-blueGray-300" />
              <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                ข้อมูลส่วนตัว (เข้ารหัส)
              </h6>
              <div class="flex flex-wrap">
                <div class="w-full lg:w-4/12 px-4">
                  <div class="relative w-full mb-3">
                    <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">คำนำหน้า</label>
                    <select v-model="form.prefix" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                      <option value="">เลือกคำนำหน้า</option>
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
                    <input type="text" v-model="form.firstName" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" placeholder="ชื่อ" />
                  </div>
                </div>
                <div class="w-full lg:w-4/12 px-4">
                  <div class="relative w-full mb-3">
                    <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">นามสกุล</label>
                    <input type="text" v-model="form.lastName" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" placeholder="นามสกุล" />
                  </div>
                </div>
                <div class="w-full lg:w-6/12 px-4">
                  <div class="relative w-full mb-3">
                    <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">เลขบัตรประชาชน</label>
                    <input type="text" v-model="form.nationalId" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" placeholder="เลขบัตรประจำตัวประชาชน" />
                  </div>
                </div>
                <div class="w-full lg:w-6/12 px-4">
                  <div class="relative w-full mb-3">
                    <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">วันเดือนปีเกิด (พ.ศ.)</label>
                    <input type="text" v-model="form.dob" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" placeholder="เช่น 01/01/2530" />
                  </div>
                </div>
                <div class="w-full lg:w-6/12 px-4">
                  <div class="relative w-full mb-3">
                    <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">เบอร์โทรศัพท์</label>
                    <input type="text" v-model="form.phone" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" placeholder="เบอร์โทรศัพท์" />
                  </div>
                </div>
                <div class="w-full lg:w-6/12 px-4">
                  <div class="relative w-full mb-3">
                    <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">รูปโปรไฟล์</label>
                    <input type="file" ref="fileInput" @change="onFileChange" class="border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" accept="image/*" />
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
                    <input type="text" v-model="form.position" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" placeholder="ตำแหน่ง" />
                  </div>
                </div>
                <div class="w-full lg:w-6/12 px-4">
                  <div class="relative w-full mb-3">
                    <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">วิทยฐานะ</label>
                    <input type="text" v-model="form.academicStanding" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" placeholder="วิทยฐานะ" />
                  </div>
                </div>
                <div class="w-full lg:w-6/12 px-4">
                  <div class="relative w-full mb-3">
                    <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">ระดับสิทธิ์การใช้งาน</label>
                    <select v-model="form.role" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                      <option value="teacher">Teacher</option>
                      <option value="director">Director</option>
                      <option value="admin">Admin</option>
                    </select>
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

              <div v-if="errorMessage" class="text-red-500 text-center mb-3 text-sm font-bold">
                {{ errorMessage }}
              </div>
              <div v-if="isLoading" class="text-blueGray-500 text-center mb-3 text-sm font-bold">
                {{ loadingStatus }}
              </div>
              <div v-if="isSuccess" class="text-emerald-500 text-center mb-3 text-sm font-bold">
                สมัครสมาชิกสำเร็จ! จะพาไปยังหน้ารายชื่อผู้ใช้งานในอีก {{ countdown }} วินาที...
              </div>

              <div class="text-center mt-6">
                <button
                  class="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150 disabled:opacity-50"
                  type="button"
                  @click="register"
                  :disabled="isLoading || isSuccess"
                >
                  Create Account
                </button>
              </div>
            </form>
            <div v-if="isPageLoading" class="text-center py-20">
              <i class="fas fa-spinner fa-spin text-3xl text-emerald-500"></i>
              <p class="mt-3 text-blueGray-500">กำลังตรวจสอบสิทธิ์...</p>
            </div>
            <div v-if="!isPageLoading && !hasPermission" class="text-center py-20">
              <i class="fas fa-lock text-3xl text-red-500"></i>
              <p class="mt-3 text-red-500 font-bold">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Crop Modal (Nuclear CSS) -->
    <div v-if="showCropModal" style="position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; z-index: 999999 !important; background-color: rgba(0,0,0,0.85) !important; display: flex !important; justify-content: center !important; align-items: center !important; width: 100vw !important; height: 100vh !important;">
      <div style="position: relative !important; background-color: white !important; width: 100% !important; max-width: 42rem !important; margin: 0 1rem !important; border-radius: 0.5rem !important; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1) !important; display: flex !important; flex-direction: column !important; max-height: 100vh !important; z-index: 1000000 !important;">
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
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";
import { auth, db, firebaseConfig } from "@/firebase";
import { encryptData, hashData } from "@/utils/crypto";
// eslint-disable-next-line no-unused-vars
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

export default {
  data() {
    return {
      form: {
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        prefix: "",
        firstName: "",
        lastName: "",
        nationalId: "",
        dob: "",
        phone: "",
        position: "",
        academicStanding: "",
        role: "teacher",
        affiliation: "โรงเรียน",
        accountStatus: "Active",
      },
      profileImageBase64: "",
      errorMessage: "",
      isLoading: false,
      isPageLoading: true,
      hasPermission: false,
      loadingStatus: "",
      isSuccess: false,
      countdown: 3,
      showCropModal: false,
      cropImageSrc: "",
      cropperInstance: null,
      tempFileName: "",
      selectedFileName: "",
    };
  },
  computed: {
    passwordMatchStatus() {
      if (!this.form.password || !this.form.confirmPassword) return null;
      if (this.form.password === this.form.confirmPassword) {
        return { text: "รหัสผ่านตรงกัน", color: "text-emerald-500" };
      }
      return { text: "รหัสผ่านไม่ตรงกัน", color: "text-red-500" };
    }
  },
  mounted() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.role === 'admin' || data.role === 'super-admin') {
              this.hasPermission = true;
            } else {
              this.$router.push('/admin/dashboard');
            }
          } else {
            this.$router.push('/admin/dashboard');
          }
        } catch (error) {
          this.$router.push('/admin/dashboard');
        }
      } else {
        this.$router.push('/auth/login');
      }
      this.isPageLoading = false;
    });
  },
  methods: {
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
      try {
        if (this.cropperInstance) {
          this.cropperInstance.destroy();
        }
        if (!this.$refs.cropImage) {
          return;
        }
        this.cropperInstance = new Cropper(this.$refs.cropImage, {
          aspectRatio: 1,
          viewMode: 1,
          dragMode: 'move',
          background: true,
        });
      } catch (err) {
        console.error("initCropper error:", err);
        alert("เกิดข้อผิดพลาดในการเปิดตัวตัดรูปภาพ");
      }
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
    async register() {
      try {
        this.errorMessage = "";
        
        if (this.form.password !== this.form.confirmPassword) {
          this.errorMessage = "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน";
          return;
        }

        this.isLoading = true;
        this.loadingStatus = "1/4 กำลังตรวจสอบข้อมูลซ้ำ (Connecting to Firestore)...";
        
        // 0. Check for duplicates in Firestore
        const usersRef = collection(db, "users");

        // Check Username
        const userQ = query(usersRef, where("username", "==", this.form.username));
        const userSnap = await getDocs(userQ);
        if (!userSnap.empty) {
          this.errorMessage = "มี Username นี้ในระบบแล้ว โปรดใช้ชื่ออื่น";
          this.isLoading = false;
          return;
        }

        // Check National ID (using Hash)
        const nationalIdHash = hashData(this.form.nationalId);
        const idQ = query(usersRef, where("nationalIdHash", "==", nationalIdHash));
        const idSnap = await getDocs(idQ);
        if (!idSnap.empty) {
          this.errorMessage = "มีเลขบัตรประชาชนนี้ในระบบแล้ว";
          this.isLoading = false;
          return;
        }

        this.loadingStatus = "2/4 กำลังสร้างบัญชีผู้ใช้ (Connecting to Auth)...";
        // 1. Create Auth User using Secondary App
        const secondaryApp = getApps().find(app => app.name === "SecondaryApp") || initializeApp(firebaseConfig, "SecondaryApp");
        const secondaryAuth = getAuth(secondaryApp);
        
        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, this.form.email, this.form.password);
        const user = userCredential.user;
        
        await secondaryAuth.signOut(); // Keep it clean

        this.loadingStatus = "3/4 กำลังจัดเตรียมรูปโปรไฟล์...";
        // 2. Profile Image (Now using Base64 string directly)
        let profileImageUrl = this.profileImageBase64 || "";

        this.loadingStatus = "4/4 กำลังเข้ารหัสและบันทึกข้อมูลส่วนตัว (Writing to Firestore)...";
        // 3. Encrypt required fields
        const encryptedData = {
          emailEncrypted: encryptData(this.form.email), // Kept original email in Auth, but store encrypted in Firestore per request
          username: this.form.username,
          prefix: this.form.prefix,
          firstNameEncrypted: encryptData(this.form.firstName),
          lastNameEncrypted: encryptData(this.form.lastName),
          nationalIdEncrypted: encryptData(this.form.nationalId),
          nationalIdHash: nationalIdHash,
          dobEncrypted: encryptData(this.form.dob),
          phoneEncrypted: encryptData(this.form.phone),
          profileImageEncrypted: encryptData(profileImageUrl),
          position: this.form.position,
          academicStanding: this.form.academicStanding,
          role: this.form.role,
          affiliation: this.form.affiliation,
          accountStatus: this.form.accountStatus,
          createdAt: new Date().toISOString()
        };

        // 4. Save to Firestore
        await setDoc(doc(db, "users", user.uid), encryptedData);

        // Success -> Show alert and countdown
        this.isSuccess = true;
        this.isLoading = false; // Hide loading state
        
        let timer = setInterval(() => {
          this.countdown -= 1;
          if (this.countdown <= 0) {
            clearInterval(timer);
            this.$router.push("/admin/all-users");
          }
        }, 1000);

      } catch (error) {
        console.error(error);
        this.errorMessage = error.message;
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
