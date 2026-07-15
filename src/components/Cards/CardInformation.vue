<template>
  <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
    <div class="rounded-t bg-white mb-0 px-6 py-6">
      <div class="text-center flex justify-between">
        <h6 class="text-blueGray-700 text-xl font-bold">ข้อมูลทั่วไป</h6>
      </div>
    </div>
    <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
      <form>
        <!-- วิสัยทัศน์ (Vision) -->
        <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">วิสัยทัศน์</h6>
        <div class="flex flex-wrap">
          <div class="w-full px-4">
            <div class="relative w-full mb-3">
              <textarea v-model="form.vision" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" rows="4"></textarea>
            </div>
          </div>
        </div>

        <hr class="mt-6 border-b-1 border-blueGray-300" />

        <!-- พันธกิจ (Mission) -->
        <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">พันธกิจ</h6>
        <div class="flex flex-wrap">
          <div class="w-full px-4">
            <div v-for="(mission, index) in form.missions" :key="'mission-'+index" class="flex items-center mb-3">
              <input type="text" v-model="form.missions[index]" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 flex-1" />
              <button type="button" @click="removeMission(index)" class="ml-2 bg-red-500 text-white font-bold uppercase text-xs px-3 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150">
                <i class="fas fa-trash"></i>
              </button>
            </div>
            <button type="button" @click="addMission" class="mt-2 bg-emerald-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150">
              + เพิ่มพันธกิจ
            </button>
          </div>
        </div>

        <hr class="mt-6 border-b-1 border-blueGray-300" />

        <!-- ปรัชญา (Philosophy) -->
        <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">ปรัชญา</h6>
        <div class="flex flex-wrap">
          <div class="w-full px-4">
            <div class="relative w-full mb-3">
              <textarea v-model="form.philosophy" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" rows="3"></textarea>
            </div>
          </div>
        </div>

        <hr class="mt-6 border-b-1 border-blueGray-300" />

        <!-- อัตลักษณ์ (Identity) -->
        <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">อัตลักษณ์</h6>
        <div class="flex flex-wrap">
          <div class="w-full px-4">
            <div class="relative w-full mb-3">
              <textarea v-model="form.identity" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" rows="3"></textarea>
            </div>
          </div>
        </div>

        <hr class="mt-6 border-b-1 border-blueGray-300" />

        <!-- คติพจน์ (Motto) -->
        <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">คติพจน์</h6>
        <div class="flex flex-wrap">
          <div class="w-full px-4">
            <div class="relative w-full mb-3">
              <textarea v-model="form.motto" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" rows="2"></textarea>
            </div>
          </div>
        </div>

        <hr class="mt-6 border-b-1 border-blueGray-300" />

        <!-- คำขวัญ (Slogan) -->
        <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">คำขวัญ</h6>
        <div class="flex flex-wrap">
          <div class="w-full px-4">
            <div class="relative w-full mb-3">
              <textarea v-model="form.slogan" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" rows="2"></textarea>
            </div>
          </div>
        </div>

        <hr class="mt-6 border-b-1 border-blueGray-300" />

        <!-- เป้าประสงค์ (Goals) -->
        <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">เป้าประสงค์</h6>
        <div class="flex flex-wrap">
          <div class="w-full px-4">
            <div v-for="(goal, index) in form.goals" :key="'goal-'+index" class="flex items-center mb-3">
              <input type="text" v-model="form.goals[index]" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 flex-1" />
              <button type="button" @click="removeGoal(index)" class="ml-2 bg-red-500 text-white font-bold uppercase text-xs px-3 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150">
                <i class="fas fa-trash"></i>
              </button>
            </div>
            <button type="button" @click="addGoal" class="mt-2 bg-emerald-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150">
              + เพิ่มเป้าประสงค์
            </button>
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
        vision: "",
        missions: [""],
        philosophy: "",
        identity: "",
        motto: "",
        slogan: "",
        goals: [""],
      }
    };
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    addMission() {
      this.form.missions.push("");
    },
    removeMission(index) {
      this.form.missions.splice(index, 1);
      if (this.form.missions.length === 0) {
        this.form.missions.push("");
      }
    },
    addGoal() {
      this.form.goals.push("");
    },
    removeGoal(index) {
      this.form.goals.splice(index, 1);
      if (this.form.goals.length === 0) {
        this.form.goals.push("");
      }
    },
    async loadData() {
      try {
        const docRef = doc(db, "settings", "information");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          this.form.vision = data.vision || "";
          this.form.missions = (data.missions && data.missions.length > 0) ? data.missions : [""];
          this.form.philosophy = data.philosophy || "";
          this.form.identity = data.identity || "";
          this.form.motto = data.motto || "";
          this.form.slogan = data.slogan || "";
          this.form.goals = (data.goals && data.goals.length > 0) ? data.goals : [""];
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    },
    async saveData() {
      this.isSaving = true;
      this.saveMessage = "กำลังบันทึก...";
      try {
        const docRef = doc(db, "settings", "information");
        // Remove empty strings from arrays before saving
        const cleanMissions = this.form.missions.filter(m => m.trim() !== "");
        const cleanGoals = this.form.goals.filter(g => g.trim() !== "");
        
        await setDoc(docRef, {
          vision: this.form.vision,
          missions: cleanMissions,
          philosophy: this.form.philosophy,
          identity: this.form.identity,
          motto: this.form.motto,
          slogan: this.form.slogan,
          goals: cleanGoals,
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
