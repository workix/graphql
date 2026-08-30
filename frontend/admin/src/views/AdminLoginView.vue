<template>
  <v-app>
    <v-main class="d-flex align-center justify-center">
      <v-card class="pa-6" width="400">
        <v-card-title class="text-center">Painel Admin - Login</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field label="E-mail Admin" prepend-inner-icon="mdi-email" type="email"></v-text-field>
            <v-text-field label="Senha" prepend-inner-icon="mdi-lock" type="password"></v-text-field>
            <v-btn block color="primary" class="mt-4">Entrar</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
</script>
