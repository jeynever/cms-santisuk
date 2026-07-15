<template>
  <div class="flex flex-wrap mt-4">
    <div class="w-full mb-12 px-4">
      <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div class="rounded-t bg-white mb-0 px-6 py-6">
          <div class="text-center flex justify-between">
            <h6 class="text-blueGray-700 text-xl font-bold">
              {{ isEditing ? 'แก้ไขข้อมูลผู้บริหาร' : 'เพิ่มข้อมูลผู้บริหาร' }}
            </h6>
            <button
              class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
              type="button"
              @click="saveData"
              :disabled="isSaving"
            >
              <i class="fas fa-spinner fa-spin mr-1" v-if="isSaving"></i>
              บันทึกข้อมูล
            </button>
          </div>
        </div>
        <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
          <form>
            <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              ข้อมูลผู้บริหาร
            </h6>
            <div class="flex flex-wrap">
              <div class="w-full lg:w-6/12 px-4">
                <div class="relative w-full mb-3">
                  <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                    ลำดับที่
                  </label>
                  <input
                    type="number"
                    v-model.number="form.order"
                    class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="เช่น 1, 2, 3..."
                  />
                </div>
              </div>
              <div class="w-full lg:w-6/12 px-4">
                <div class="relative w-full mb-3">
                  <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                    ชื่อ-สกุล
                  </label>
                  <input
                    type="text"
                    v-model="form.name"
                    class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="ระบุชื่อ-สกุล"
                  />
                </div>
              </div>
              <div class="w-full lg:w-6/12 px-4">
                <div class="relative w-full mb-3">
                  <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                    ปี พ.ศ. (ดำรงตำแหน่ง)
                  </label>
                  <input
                    type="text"
                    v-model="form.years"
                    class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="เช่น 2556-2559"
                  />
                </div>
              </div>
              <div class="w-full lg:w-6/12 px-4">
                <div class="relative w-full mb-3">
                  <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                    ตำแหน่ง
                  </label>
                  <input
                    type="text"
                    v-model="form.position"
                    class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="ระบุตำแหน่ง"
                  />
                </div>
              </div>
            </div>
            
            <hr class="mt-6 border-b-1 border-blueGray-300" />
            
            <div class="flex flex-wrap mt-6">
              <div class="w-full px-4 text-right">
                <router-link
                  to="/admin/executives"
                  class="bg-blueGray-500 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-2 ease-linear transition-all duration-150"
                >
                  ยกเลิก
                </router-link>
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
      docId: null,
      form: {
        order: null,
        name: "",
        years: "",
        position: "",
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
        const docRef = doc(db, "executives", this.docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          this.form = docSnap.data();
        } else {
          alert("ไม่พบข้อมูลผู้บริหารนี้");
          this.$router.push("/admin/executives");
        }
      } catch (error) {
        console.error("Error fetching executive:", error);
      }
    },
    async saveData() {
      if (!this.form.name || !this.form.position) {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
      }
      this.isSaving = true;
      try {
        if (this.isEditing) {
          const docRef = doc(db, "executives", this.docId);
          await updateDoc(docRef, this.form);
        } else {
          await addDoc(collection(db, "executives"), this.form);
        }
        this.$router.push("/admin/executives");
      } catch (error) {
        console.error("Error saving executive:", error);
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      } finally {
        this.isSaving = false;
      }
    },
  },
};
</script>
