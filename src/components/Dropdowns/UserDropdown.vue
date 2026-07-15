<template>
  <div>
    <a
      class="text-blueGray-500 block"
      href="#pablo"
      ref="btnDropdownRef"
      v-on:click="toggleDropdown($event)"
    >
      <div class="items-center flex">
        <span
          class="w-12 h-12 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full"
        >
          <img
            alt="..."
            class="w-full h-full object-cover rounded-full align-middle border-none shadow-lg"
            :src="image"
          />
        </span>
      </div>
    </a>
    <div
      ref="popoverDropdownRef"
      class="bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
      v-bind:class="{
        hidden: !dropdownPopoverShow,
        block: dropdownPopoverShow,
      }"
    >
      <a
        href="javascript:void(0);"
        class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
      >
        Action
      </a>
      <a
        href="javascript:void(0);"
        class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
      >
        Another action
      </a>
      <a
        href="javascript:void(0);"
        class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
      >
        Something else here
      </a>
      <div class="h-0 my-2 border border-solid border-blueGray-100" />
      <a
        href="javascript:void(0);"
        class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
      >
        Seprated link
      </a>
      <a
        href="javascript:void(0);"
        @click="logout"
        class="text-sm py-2 px-4 font-bold block w-full whitespace-nowrap bg-transparent text-red-500 hover:bg-red-50 transition-colors"
      >
        <i class="fas fa-sign-out-alt mr-2"></i> ออกจากระบบ
      </a>
    </div>
  </div>
</template>

<script>
import { createPopper } from "@popperjs/core";
import { auth, db } from "@/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { decryptData } from "@/utils/crypto";
import defaultImage from "@/assets/img/team-1-800x800.jpg";

export default {
  data() {
    return {
      dropdownPopoverShow: false,
      image: defaultImage,
      userId: null
    };
  },
  mounted() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.userId = user.uid;
        this.fetchProfileImage();
      }
    });

    window.addEventListener('profile-updated', this.fetchProfileImage);
  },
  beforeUnmount() {
    window.removeEventListener('profile-updated', this.fetchProfileImage);
  },
  methods: {
    async fetchProfileImage() {
      if (!this.userId) return;
      try {
        const docRef = doc(db, "users", this.userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const decryptedImage = decryptData(data.profileImageEncrypted);
          if (decryptedImage) {
            this.image = decryptedImage;
          }
        }
      } catch (error) {
        console.error("Error fetching user profile image", error);
      }
    },
    toggleDropdown: function (event) {
      event.preventDefault();
      if (this.dropdownPopoverShow) {
        this.dropdownPopoverShow = false;
      } else {
        this.dropdownPopoverShow = true;
        createPopper(this.$refs.btnDropdownRef, this.$refs.popoverDropdownRef, {
          placement: "bottom-start",
        });
      }
    },
    async logout() {
      try {
        await signOut(auth);
        this.$router.push('/auth/login');
      } catch (error) {
        console.error('Logout error', error);
      }
    }
  },
};
</script>
