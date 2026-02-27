<template>
    <footer class="bg-white backdrop-blur border-t border-sky-100">
        <div class="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

            <!-- Left -->
             <div class="text-sm text-gray-600">
                &copy; {{currentYear }} Note Spark. All rights reserved.
             </div>

             <!-- Center -->
              <div class="text-sm text-gray-500">
                Built with ❤️ by Elisha.
              </div>

              <!-- Right -->
               <div class="flex gap-4 text-gray-500">
                    <a href="#" class="text-sky-600 hover:text-sky-800 transition">
                        Privacy
                    </a>
                    <a href="#" class="text-sky-600 hover:text-sky-800 transition">
                        Terms
                    </a>
                    <a href="#" class="text-sky-600 hover:text-sky-800 transition">
                        Contact
                    </a>
               </div>
        </div>
    </footer>
</template>

<script setup>
    const currentYear = new Date().getFullYear();
</script>