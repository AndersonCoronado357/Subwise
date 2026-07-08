<script setup lang="ts">
import { CURRENCIES } from '~/composables/useDatos'

useHead({ title: 'Ajustes · Subwise' })

const { usuario, moneda, notifyDays, emailAlerts } = useDatos()
const { tema, aplicar } = useTema()
const push = usePush()

const drag = ref(false)
const fileRef = ref<HTMLInputElement | null>(null)
const cropFile = ref<File | null>(null)
const passActual = ref('')
const passNueva = ref('')
const passConfirma = ref('')
const passError = ref<string | null>(null)
const passGuardado = ref(false)

// Al elegir una imagen se abre el modal para encuadrarla antes de guardar.
function pedirRecorte(file: File | null | undefined) {
  if (!file || !file.type.startsWith('image/')) return
  cropFile.value = file
}
function onDrop(e: DragEvent) {
  e.preventDefault(); drag.value = false
  pedirRecorte(e.dataTransfer?.files[0])
}
function elegirArchivo() { fileRef.value?.click() }
function onFile(e: Event) {
  const input = e.target as HTMLInputElement
  pedirRecorte(input.files?.[0])
  input.value = '' // permite volver a elegir la misma foto
}
function fotoRecortada(dataUrl: string) {
  usuario.value.photo = dataUrl
  cropFile.value = null
}
function quitarFoto() { usuario.value.photo = '' }

function guardarPass() {
  passError.value = null
  passGuardado.value = false
  if (passActual.value.length < 4) {
    passError.value = 'Escribe tu contraseña actual.'
    return
  }
  if (passNueva.value.length < 6) {
    passError.value = 'La nueva contraseña debe tener al menos 6 caracteres.'
    return
  }
  if (passNueva.value !== passConfirma.value) {
    passError.value = 'Las contraseñas no coinciden.'
    return
  }
  passActual.value = ''
  passNueva.value = ''
  passConfirma.value = ''
  passGuardado.value = true
}

async function cerrarSesion() {
  try { await $fetch('/api/auth/logout', { method: 'POST' }) } catch { /* noop */ }
  window.location.href = '/login'
}

const monedaOpts = CURRENCIES.map(c => ({ value: c.code, label: `${c.label} (${c.code})` }))
const avisoOpts = [
  { value: 1, label: '1 día antes' },
  { value: 3, label: '3 días antes' },
  { value: 7, label: '7 días antes' },
]
</script>

<template>
  <div class="screen">
    <div class="page-head">
      <div class="col grow" style="gap: 2px; min-width: 0">
        <h1 class="sw-title page-title">Ajustes</h1>
      </div>
    </div>

    <div class="settings-col">
      <!-- Perfil -->
      <div class="card settings-card">
        <span class="panel-title" style="display: block; margin-bottom: 16px">Perfil</span>
        <div class="profile-row">
          <div class="col" style="align-items: center; gap: 10px; flex-shrink: 0">
            <div
              :class="['avatar-drop', 'round', drag ? 'drag' : '']"
              @click="elegirArchivo"
              @dragover.prevent="drag = true"
              @dragleave="drag = false"
              @drop="onDrop"
            >
              <img v-if="usuario.photo" :src="usuario.photo" alt="" />
              <div v-else class="avatar-ph">
                <SwIcon name="image" :size="28" />
                <span>Arrastra una foto</span>
              </div>
              <input ref="fileRef" type="file" accept="image/*" hidden @change="onFile" />
            </div>
            <button
              v-if="usuario.photo"
              type="button"
              class="quitar-foto-link"
              @click.stop="quitarFoto"
            >
              <SwIcon name="trash" :size="14" />Quitar foto
            </button>
          </div>
          <div class="col grow" style="gap: 13px; min-width: 0">
            <SwField v-model="usuario.name" label="Nombre" />
            <div class="col" style="gap: 7px">
              <span class="field-label" style="margin-bottom: 0">Correo</span>
              <div class="readonly-box">
                <SwIcon name="mail" :size="18" style="color: var(--text3)" />
                <span>{{ usuario.email }}</span>
                <span class="faint" style="margin-left: auto; font-size: .82rem">
                  No se puede cambiar
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Seguridad (contraseña aparte) -->
      <div class="card settings-card">
        <span class="panel-title" style="display: block; margin-bottom: 16px">Seguridad</span>
        <div class="col" style="gap: 13px">
          <SwPasswordField v-model="passActual" label="Contraseña actual" placeholder="········" autocomplete="current-password" />
          <SwPasswordField v-model="passNueva" label="Nueva contraseña" placeholder="Mínimo 6 caracteres" autocomplete="new-password" />
          <SwPasswordField v-model="passConfirma" label="Confirmar nueva contraseña" placeholder="········" autocomplete="new-password" />
          <p v-if="passError" class="faint" style="font-size: .85rem; color: var(--danger); margin: 0">{{ passError }}</p>
          <p v-else-if="passGuardado" class="faint" style="font-size: .85rem; color: color-mix(in srgb, var(--accent) 70%, var(--text)); margin: 0">
            Contraseña actualizada.
          </p>
          <div class="form-actions-full">
            <SwButton variant="primary" @click="guardarPass">Actualizar contraseña</SwButton>
          </div>
        </div>
      </div>

      <!-- Preferencias -->
      <div class="card settings-card">
        <span class="panel-title" style="display: block; margin-bottom: 4px">Preferencias</span>
        <div class="set-list">
          <div class="set-row">
            <div class="col" style="gap: 2px">
              <span style="font-weight: 500">Tema</span>
              <span class="faint" style="font-size: .82rem">{{ tema === 'dark' ? 'Oscuro' : 'Claro' }}</span>
            </div>
            <SwSegmented
              :model-value="tema"
              :options="[{ value: 'light', label: 'Claro' }, { value: 'dark', label: 'Oscuro' }]"
              @update:model-value="v => aplicar(v as 'light' | 'dark')"
            />
          </div>
          <hr class="hair" />
          <div class="set-row">
            <div class="col" style="gap: 2px">
              <span style="font-weight: 500">Moneda</span>
              <span class="faint" style="font-size: .82rem">Para totales y resúmenes</span>
            </div>
            <div style="width: min(280px, 60%)">
              <SwSelect v-model="moneda" :options="monedaOpts" />
            </div>
          </div>
        </div>
      </div>

      <!-- Avisos -->
      <div class="card settings-card">
        <span class="panel-title" style="display: block; margin-bottom: 4px">Avisos</span>
        <div class="set-list">
          <div class="set-row">
            <div class="col" style="gap: 2px">
              <span style="font-weight: 500">Avisarme antes del cobro</span>
              <span class="faint" style="font-size: .82rem">Recordatorio dentro de la app</span>
            </div>
            <div style="width: min(200px, 50%)">
              <SwSelect v-model="notifyDays" :options="avisoOpts" />
            </div>
          </div>
          <hr class="hair" />
          <div class="set-row">
            <div class="col" style="gap: 2px">
              <span style="font-weight: 500">Recordatorios en el dispositivo</span>
              <span class="faint" style="font-size: .82rem">
                {{ push.soportado.value ? 'Notificación push antes de cada cobro' : 'No disponible en este navegador' }}
              </span>
              <span v-if="push.error.value" class="faint" style="font-size: .8rem; color: var(--danger)">
                {{ push.error.value }}
              </span>
            </div>
            <SwSwitch
              :model-value="push.activo.value"
              :disabled="!push.soportado.value || push.ocupado.value"
              @update:model-value="v => push.alternar(v)"
            />
          </div>
          <hr class="hair" />
          <div class="set-row">
            <div class="col" style="gap: 2px">
              <span style="font-weight: 500">Aviso por correo</span>
              <span class="faint" style="font-size: .82rem">Además del aviso en la app</span>
            </div>
            <SwSwitch v-model="emailAlerts" />
          </div>
        </div>
      </div>

      <!-- Cerrar sesión: solo el botón, sin card -->
      <button class="btn btn-danger btn-block" style="width: 100%; padding: 15px 20px" @click="cerrarSesion">
        <SwIcon name="logout" :size="17" />Cerrar sesión
      </button>
    </div>

    <SwPhotoCrop
      v-if="cropFile"
      :file="cropFile"
      @done="fotoRecortada"
      @cancel="cropFile = null"
    />
  </div>
</template>

<style scoped>
.quitar-foto-link {
  display: inline-flex; align-items: center; gap: 6px;
  border: 0; background: transparent; cursor: pointer;
  font-family: var(--font-body); font-weight: 600; font-size: .8rem;
  color: var(--text3); padding: 4px 8px; border-radius: 8px;
  transition: color .15s, background .15s;
}
.quitar-foto-link:hover { color: var(--danger); background: var(--s2); }
</style>
