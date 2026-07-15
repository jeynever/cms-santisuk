---
name: crop_profile
description: Use this skill when you need to implement a profile image cropper using cropperjs in Vue components.
---

# Crop Profile Skill

This skill provides instructions on how to implement an image cropping feature for profile pictures using `cropperjs` in Vue 3 (Options API or Composition API).

## Dependencies
1. Install `cropperjs` (recommend v1.6.1 for CSS compatibility):
   `npm install cropperjs@1.6.1`

## Implementation Steps

### 1. Template Markup
Add the following crop modal markup to the Vue component's template (usually placed just before the closing `</div>` of the root element). Adjust styling as needed (Tailwind CSS is used here).

```html
<!-- Crop Modal -->
<div v-if="showCropModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
  <div class="relative bg-white w-full max-w-2xl mx-4 rounded-lg shadow-lg flex flex-col max-h-screen">
    <div class="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
      <h3 class="text-xl font-semibold">ปรับแต่งรูปภาพ</h3>
      <button class="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none" @click="closeCropModal">
        <span class="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
      </button>
    </div>
    <div class="relative p-6 flex-auto flex justify-center" style="max-height: 60vh;">
      <img ref="cropImage" :src="cropImageSrc" style="max-width: 100%; max-height: 50vh; display: block;" />
    </div>
    <div class="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
      <button class="text-blueGray-500 bg-transparent border border-solid border-blueGray-500 hover:bg-blueGray-500 hover:text-white font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" @click="closeCropModal">
        ยกเลิก
      </button>
      <button class="bg-emerald-500 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" @click="cropImage">
        ตัดรูปและยืนยัน
      </button>
    </div>
  </div>
</div>
```

Make sure the file input is referenced like this:
```html
<input type="file" ref="fileInput" @change="onFileChange" accept="image/*" />
```
And add a success message to display the file name:
```html
<div v-if="profileImageBase64" class="text-emerald-500 text-xs font-bold mt-2">
  <i class="fas fa-check-circle mr-1"></i> เลือกรูปและตัดแต่งสำเร็จแล้ว <span v-if="selectedFileName">({{ selectedFileName }})</span>
</div>
```

### 2. Script Import
Import the `Cropper` class and its CSS.

```javascript
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
```

### 3. Component Data
Add these state variables to the component's `data()`:

```javascript
data() {
  return {
    showCropModal: false,
    cropImageSrc: "",
    cropperInstance: null,
    profileImageBase64: "", // This will hold the final cropped Base64 image
    tempFileName: "",       // Temporarily hold the file name
    selectedFileName: "",   // Hold the file name after successful crop
  };
}
```

### 4. Component Methods
Implement these methods for handling the file selection and the cropping logic.

```javascript
methods: {
  async onFileChange(e) {
    const files = e.target.files;
    if (files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        alert("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น");
        return;
      }
      
      this.tempFileName = file.name;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        this.cropImageSrc = event.target.result;
        this.showCropModal = true;
    try {
      const files = e.target.files;
      if (files.length > 0) {
        const file = files[0];
        if (!file.type.startsWith('image/')) {
          alert("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น");
          return;
        }
        
        this.tempFileName = file.name;
        
        const reader = new FileReader();
        reader.onload = (event) => {
          this.cropImageSrc = event.target.result;
          this.showCropModal = true;
          // Wait for the modal and img to render before initializing Cropper
          this.$nextTick(() => {
            this.initCropper();
          });
        };
        reader.readAsDataURL(file);
      }
      // Note: Do NOT clear fileInput.value inside a finally block here!
      // In some browsers (like Safari), clearing the input synchronously
      // will silently abort the asynchronous FileReader.readAsDataURL.
      // Clear it inside closeCropModal() instead.
    } catch (err) {
      console.error("onFileChange error:", err);
    }
  },
  initCropper() {
    try {
      // Destroy existing instance if any
      if (this.cropperInstance) {
        this.cropperInstance.destroy();
      }
      if (!this.$refs.cropImage) return;
      // Initialize new Cropper instance targeting the <img> ref
      this.cropperInstance = new Cropper(this.$refs.cropImage, {
        aspectRatio: 1, // 1:1 for profile pictures (circles/squares)
        viewMode: 1,
        dragMode: 'move',
        background: true,
      });
    } catch (err) {
      console.error("initCropper error:", err);
    }
  },
  cropImage() {
    if (!this.cropperInstance) return;
    
    // Get cropped area as a canvas
    const canvas = this.cropperInstance.getCroppedCanvas({
      width: 512, // Resize to specific width
      height: 512, // Resize to specific height
    });

    // Convert canvas to Base64 JPEG with 0.8 quality
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
}
```

### 5. Final Step
Save the `profileImageBase64` string to Firestore or upload it to your storage system.
