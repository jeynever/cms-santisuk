<template>
  <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
    <div class="rounded-t bg-white mb-0 px-6 py-6">
      <div class="text-center flex justify-between">
        <h6 class="text-blueGray-700 text-xl font-bold">ข้อมูลติดต่อเรา</h6>
      </div>
    </div>
    <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
      <form>
        <!-- ที่อยู่โรงเรียน -->
        <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">ที่อยู่โรงเรียน</h6>
        <div class="flex flex-wrap">
          <div class="w-full px-4">
            <div class="relative w-full mb-3">
              <textarea v-model="form.address" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" rows="3"></textarea>
            </div>
          </div>
        </div>

        <hr class="mt-6 border-b-1 border-blueGray-300" />

        <!-- เบอร์โทรศัพท์ และ อีเมล -->
        <div class="flex flex-wrap mt-6">
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">เบอร์โทรศัพท์ติดต่อ</label>
              <input type="text" v-model="form.phone" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
            </div>
          </div>
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">อีเมลติดต่อ</label>
              <input type="email" v-model="form.email" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
            </div>
          </div>
        </div>

        <!-- Facebook และ Website -->
        <div class="flex flex-wrap mt-4">
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">FACEBOOK FANPAGE</label>
              <input type="text" v-model="form.facebook" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
            </div>
          </div>
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">YOUTUBE</label>
              <input type="text" v-model="form.youtube" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
            </div>
          </div>
        </div>

        <!-- Latitude และ Longitude -->
        <div class="flex flex-wrap mt-4">
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">พิกัด LATITUDE</label>
              <input type="text" v-model="form.latitude" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
            </div>
          </div>
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">พิกัด LONGITUDE</label>
              <input type="text" v-model="form.longitude" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
            </div>
          </div>
        </div>

        <hr class="mt-6 border-b-1 border-blueGray-300" />
        
        <div class="flex items-center justify-end mt-6">
          <span v-if="saveMessage" class="mr-4 text-sm font-bold" :class="isSaving ? 'text-blueGray-500' : (saveMessage.includes('สำเร็จ') ? 'text-emerald-500' : 'text-red-500')">
            {{ saveMessage }}
          </span>
          <button type="button" @click="saveData" :disabled="isSaving" class="bg-blueGray-800 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-6 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150" :class="{'opacity-50 cursor-not-allowed': isSaving}">
            <i class="fas fa-save mr-2" :class="{'fa-spinner fa-spin': isSaving}"></i> {{ isSaving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { db } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default {
  data() {
    return {
      isSaving: false,
      saveMessage: "",
      form: {
        address: "",
        phone: "",
        email: "",
        facebook: "",
        youtube: "",
        latitude: "",
        longitude: ""
      }
    };
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      try {
        const docRef = doc(db, "settings", "contact");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          this.form.address = data.address || "";
          this.form.phone = data.phone || "";
          this.form.email = data.email || "";
          this.form.facebook = data.facebook || "";
          this.form.youtube = data.youtube || "";
          this.form.latitude = data.latitude || "";
          this.form.longitude = data.longitude || "";
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    },
    async saveData() {
      this.isSaving = true;
      this.saveMessage = "กำลังบันทึก...";
      try {
        const docRef = doc(db, "settings", "contact");
        
        await setDoc(docRef, {
          address: this.form.address,
          phone: this.form.phone,
          email: this.form.email,
          facebook: this.form.facebook,
          youtube: this.form.youtube,
          latitude: this.form.latitude,
          longitude: this.form.longitude,
          updatedAt: new Date()
        }, { merge: true });
        
        this.saveMessage = "บันทึกข้อมูลสำเร็จ!";
        setTimeout(() => {
          this.saveMessage = "";
        }, 3000);
      } catch (error) {
        console.error("Error saving data:", error);
        this.saveMessage = "เกิดข้อผิดพลาดในการบันทึก";
      } finally {
        this.isSaving = false;
      }
    }
  }
}
</script>
