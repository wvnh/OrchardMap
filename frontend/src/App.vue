<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div class="flex items-center">
            <span class="text-h6">🌳 OrchardMap</span>
          </div>
        </q-toolbar-title>

        <q-space />

        <q-btn flat round dense icon="menu" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <RouterView />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div class="text-caption">OrchardMap - Boomgaard Management</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<style scoped>
/* Custom styles if needed */
</style>
