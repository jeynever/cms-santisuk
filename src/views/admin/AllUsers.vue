<template>
  <div class="flex flex-wrap mt-4">
    <div class="w-full mb-12 px-4">
      <card-users-table v-if="currentUserRole" :current-user-role="currentUserRole" :current-user-id="currentUserId" />
      <div v-else class="text-center py-20">
        <i class="fas fa-spinner fa-spin text-3xl text-emerald-500"></i>
        <p class="mt-3 text-blueGray-500">กำลังตรวจสอบสิทธิ์...</p>
      </div>
    </div>
  </div>
</template>

<script>
import CardUsersTable from "@/components/Cards/CardUsersTable.vue";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";

export default {
  components: {
    CardUsersTable,
  },
  data() {
    return {
      currentUserRole: null,
      currentUserId: null,
    };
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
              this.currentUserRole = data.role;
              this.currentUserId = user.uid;
            } else {
              this.$router.push('/admin/dashboard');
            }
          } else {
            this.$router.push('/admin/dashboard');
          }
        } catch (error) {
          console.error(error);
          this.$router.push('/admin/dashboard');
        }
      } else {
        this.$router.push('/auth/login');
      }
    });
  }
};
</script>
