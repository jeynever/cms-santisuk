<template>
  <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16">
    <div v-if="!isFetchingData" class="px-6">
      <div class="flex flex-wrap justify-center">
        <div class="w-full px-4 flex justify-center">
          <div class="relative w-full flex justify-center">
            <img
              alt="Profile Picture"
              :src="profileImageBase64 || defaultImage"
              class="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 max-w-150-px"
              style="width: 150px; height: 150px; object-fit: cover;"
            />
          </div>
        </div>
        <div class="w-full px-4 text-center mt-24">
          <div class="flex justify-center py-4 lg:pt-4 pt-8">
            <div class="mr-4 p-3 text-center">
              <span class="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                {{ roleText }}
              </span>
              <span class="text-sm text-blueGray-400">สิทธิ์การใช้งาน</span>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center mt-4">
        <h3 class="text-xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
          {{ prefix }}{{ firstName }} {{ lastName }}
        </h3>
        <div class="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
          <i class="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
          {{ affiliation || 'ไม่มีสังกัด' }}
        </div>
        <div class="mb-2 text-blueGray-600 mt-10">
          <i class="fas fa-briefcase mr-2 text-lg text-blueGray-400"></i>
          {{ position || 'ไม่ระบุตำแหน่ง' }}
        </div>
        <div class="mb-2 text-blueGray-600">
          <i class="fas fa-university mr-2 text-lg text-blueGray-400"></i>
          {{ academicStanding || 'ไม่ระบุวิทยฐานะ' }}
        </div>
      </div>
      <div class="mt-10 py-10 border-t border-blueGray-200 text-center">
        <div class="flex flex-wrap justify-center">
          <div class="w-full lg:w-9/12 px-4">
            <p class="mb-4 text-lg leading-relaxed text-blueGray-700">
              Username: {{ username }}<br/>
              Email: {{ email }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-20">
      <i class="fas fa-spinner fa-spin text-3xl text-emerald-500"></i>
    </div>
  </div>
</template>

<script>
import team2 from "@/assets/img/team-2-800x800.jpg";
import { auth, db } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { decryptData } from "@/utils/crypto";

export default {
  data() {
    return {
      defaultImage: team2,
      isFetchingData: true,
      email: "",
      username: "",
      prefix: "",
      firstName: "",
      lastName: "",
      position: "",
      academicStanding: "",
      role: "",
      affiliation: "",
      profileImageBase64: "",
    };
  },
  computed: {
    roleText() {
      const roles = {
        'super-admin': 'Super Admin',
        'admin': 'Admin',
        'director': 'Director',
        'teacher': 'Teacher'
      };
      return roles[this.role] || this.role || 'Unknown';
    }
  },
  mounted() {
    this.setupAuth();
    
    // Listen for profile updates to refresh data
    window.addEventListener('profile-updated', this.refreshData);
  },
  watch: {
    '$route.params.id': {
      handler: function(newId) {
        const user = auth.currentUser;
        if (user) {
          const targetId = newId || user.uid;
          this.fetchUserData(targetId);
        }
      },
      immediate: false
    }
  },
  beforeUnmount() {
    window.removeEventListener('profile-updated', this.refreshData);
  },
  methods: {
    setupAuth() {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const targetId = this.$route.params.id || user.uid;
          await this.fetchUserData(targetId);
        }
      });
    },
    refreshData() {
      const user = auth.currentUser;
      if (user) {
        const targetId = this.$route.params.id || user.uid;
        this.fetchUserData(targetId);
      }
    },
    async fetchUserData(uid) {
      try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          this.email = decryptData(data.emailEncrypted) || "";
          this.username = data.username || "";
          this.prefix = data.prefix || "";
          this.firstName = decryptData(data.firstNameEncrypted) || "";
          this.lastName = decryptData(data.lastNameEncrypted) || "";
          this.position = data.position || "";
          this.academicStanding = data.academicStanding || "";
          this.role = data.role || "";
          this.affiliation = data.affiliation || "";
          this.profileImageBase64 = decryptData(data.profileImageEncrypted) || "";
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        this.isFetchingData = false;
      }
    }
  }
};
</script>
