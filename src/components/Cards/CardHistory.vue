<template>
  <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
    <div class="rounded-t bg-white mb-0 px-6 py-6">
      <div class="text-center flex justify-between">
        <h6 class="text-blueGray-700 text-xl font-bold">ประวัติโรงเรียน</h6>
      </div>
    </div>
    <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
      <form>
        <!-- รายละเอียดประวัติโรงเรียน -->
        <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">รายละเอียดประวัติโรงเรียน</h6>
        <div class="flex flex-wrap">
          <div class="w-full px-4">
            <div class="relative w-full mb-3">
              <textarea v-model="form.historyDetails" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" rows="6"></textarea>
            </div>
          </div>
        </div>

        <hr class="mt-6 border-b-1 border-blueGray-300" />

        <!-- ลำดับเหตุการณ์สำคัญ (Timeline) -->
        <div class="flex justify-between items-center mt-3 mb-6">
          <h6 class="text-blueGray-400 text-sm font-bold uppercase mb-0">ลำดับเหตุการณ์สำคัญ (Timeline)</h6>
          <button type="button" @click="addTimelineEvent" class="bg-emerald-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150">
            + เพิ่มเหตุการณ์
          </button>
        </div>
        <div class="flex flex-wrap">
          <div class="w-full px-4">
            <div v-for="(event, index) in form.timeline" :key="'timeline-'+index" class="mb-6 p-4 border border-blueGray-200 rounded-lg bg-blueGray-50">
              <div class="mb-3">
                <input type="text" v-model="event.year" placeholder="วัน/เดือน/ปี (เช่น พ.ศ. 2510)" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
              </div>
              <div class="mb-3">
                <textarea v-model="event.details" placeholder="รายละเอียดเหตุการณ์ *" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" rows="3"></textarea>
              </div>
              <div class="flex justify-end">
                <button type="button" @click="removeTimelineEvent(index)" class="bg-red-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150">
                  <i class="fas fa-trash mr-1"></i> ลบข้อมูล
                </button>
              </div>
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
        historyDetails: "",
        timeline: [
          { year: "", details: "" }
        ]
      }
    };
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    addTimelineEvent() {
      this.form.timeline.unshift({ year: "", details: "" });
    },
    removeTimelineEvent(index) {
      this.form.timeline.splice(index, 1);
      if (this.form.timeline.length === 0) {
        this.form.timeline.unshift({ year: "", details: "" });
      }
    },
    async loadData() {
      try {
        const docRef = doc(db, "settings", "school_history");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          this.form.historyDetails = data.historyDetails || "";
          this.form.timeline = (data.timeline && data.timeline.length > 0) ? data.timeline : [{ year: "", details: "" }];
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    },
    async saveData() {
      this.isSaving = true;
      this.saveMessage = "กำลังบันทึก...";
      try {
        const docRef = doc(db, "settings", "school_history");
        // Clean empty timeline events
        const cleanTimeline = this.form.timeline.filter(t => t.year.trim() !== "" || t.details.trim() !== "");
        
        await setDoc(docRef, {
          historyDetails: this.form.historyDetails,
          timeline: cleanTimeline,
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
