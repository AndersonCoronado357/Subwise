<script setup lang="ts">
definePageMeta({ layout: 'auth' })
useHead({ title: 'Entrar · Subwise' })

type Modo = 'iniciar' | 'crear' | 'recuperar'

const AUTH_COPY: Record<Modo, {
  h: string[], sub: string,
  cardTitle: string, cardSub: string, submit: string,
  footerPre: string, footerLink: string, footerTarget: Modo,
}> = {
  iniciar: {
    h: ['Tus suscripciones,', 'bajo control.'],
    sub: 'Entra para ver cuánto pagas al mes y qué se renueva pronto.',
    cardTitle: 'Iniciar sesión',
    cardSub: 'Bienvenido de vuelta.',
    submit: 'Entrar',
    footerPre: '¿No tienes cuenta?',
    footerLink: 'Regístrate',
    footerTarget: 'crear',
  },
  crear: {
    h: ['Empieza a gastar', 'con cabeza.'],
    sub: 'Reúne en un solo lugar todo lo que pagas cada mes.',
    cardTitle: 'Crear cuenta',
    cardSub: 'Toma menos de un minuto.',
    submit: 'Crear cuenta',
    footerPre: '¿Ya tienes cuenta?',
    footerLink: 'Inicia sesión',
    footerTarget: 'iniciar',
  },
  recuperar: {
    h: ['Recupera', 'el acceso.'],
    sub: 'Te ayudamos a volver a tu cuenta.',
    cardTitle: 'Recuperar contraseña',
    cardSub: 'Te enviaremos un enlace a tu correo para restablecer la contraseña.',
    submit: 'Enviar enlace',
    footerPre: '¿Recordaste tu contraseña?',
    footerLink: 'Volver a iniciar sesión',
    footerTarget: 'iniciar',
  },
}

const modo = ref<Modo>('iniciar')
const reverse = computed(() => modo.value === 'crear')
const c = computed(() => AUTH_COPY[modo.value])

const nombre = ref('')
const correo = ref('')
const pass = ref('')
const error = ref('')
const cargando = ref(false)

onMounted(() => {
  const e = new URLSearchParams(window.location.search).get('error')
  if (e === 'google-nc')
    error.value = 'El acceso con Google aún no está configurado aquí. Entra con correo y contraseña.'
  else if (e === 'google')
    error.value = 'No pudimos completar el acceso con Google. Intenta de nuevo.'
})

async function enviar() {
  if (cargando.value) return
  error.value = ''
  if (modo.value === 'recuperar') {
    error.value = 'La recuperación por correo estará disponible pronto.'
    return
  }
  cargando.value = true
  try {
    if (modo.value === 'crear') {
      await $fetch('/api/auth/register', {
        method: 'POST',
        body: { name: nombre.value, email: correo.value, password: pass.value },
      })
    } else {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: { login: correo.value, password: pass.value },
      })
    }
    window.location.href = '/'
  } catch (e: any) {
    error.value = e?.data?.message || e?.data?.statusMessage || e?.statusMessage || 'Algo salió mal'
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <div :class="['login-stage', reverse ? 'rev' : '']">
    <!-- Titular -->
    <div class="login-hero" :key="`h-${modo}`">
      <h1 class="sw-title login-h">
        <span v-for="(l, i) in c.h" :key="i" style="display: block">{{ l }}</span>
      </h1>
      <p class="login-hsub">{{ c.sub }}</p>
      <div class="login-hero-meta">
        <span class="row" style="gap: 8px">
          <span style="color: var(--leaf); display: flex">
            <SwSprig :size="20" />
          </span>
          <span class="faint" style="font-size: .86rem">
            Hecho para llevar la cuenta sin estrés
          </span>
        </span>
      </div>
    </div>

    <!-- Tarjeta de formulario -->
    <div class="login-card-wrap">
      <form class="login-card" :key="`c-${modo}`" @submit.prevent="enviar">
        <div class="col" style="gap: 4px; margin-bottom: 18px">
          <span class="sw-title" style="font-weight: 600; font-size: 1.5rem; letter-spacing: -.02em; color: var(--text)">
            {{ c.cardTitle }}
          </span>
          <span class="muted" style="font-size: .92rem">{{ c.cardSub }}</span>
        </div>

        <div v-if="error" class="login-error">{{ error }}</div>

        <div class="col" style="gap: 13px">
          <SwField
            v-if="modo === 'crear'"
            v-model="nombre"
            label="Nombre"
            icon="user"
            placeholder="Tu nombre"
          />
          <SwField
            v-model="correo"
            label="Correo"
            icon="mail"
            type="email"
            placeholder="tucorreo@ejemplo.com"
          />
          <div v-if="modo !== 'recuperar'" class="col" style="gap: 7px">
            <SwPasswordField
              v-model="pass"
              label="Contraseña"
              placeholder="········"
            />
            <button
              v-if="modo === 'iniciar'"
              type="button"
              class="login-link"
              style="align-self: flex-end"
              @click="modo = 'recuperar'"
            >¿Olvidaste tu contraseña?</button>
          </div>
        </div>

        <SwButton type="submit" variant="primary" block size="lg" style="margin-top: 18px">
          {{ cargando ? 'Un momento…' : c.submit }}
        </SwButton>

        <template v-if="modo !== 'recuperar'">
          <div class="login-or"><span>o</span></div>
          <a href="/auth/google" class="login-google">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.5 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.9a5 5 0 0 1-2.2 3.3v2.7h3.5c2-1.9 3.3-4.7 3.3-7.9Z" />
              <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7c-1 .7-2.3 1-3.8 1-2.9 0-5.4-2-6.3-4.6H2v2.8A11 11 0 0 0 12 23Z" />
              <path fill="#FBBC05" d="M5.7 14c-.2-.7-.4-1.4-.4-2.1s.2-1.4.4-2.1V7H2a11 11 0 0 0 0 9.9L5.7 14Z" />
              <path fill="#EA4335" d="M12 4.8c1.6 0 3 .6 4.2 1.7l3.1-3.1A11 11 0 0 0 2 7l3.7 2.8C6.6 6.8 9.1 4.8 12 4.8Z" />
            </svg>
            Continuar con Google
          </a>
        </template>

        <div class="login-foot">
          <span class="faint">{{ c.footerPre }}</span>
          <button type="button" class="login-link" style="margin-left: 5px" @click="modo = c.footerTarget">
            {{ c.footerLink }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-error {
  background: rgba(216, 88, 78, 0.12);
  color: #c0392b;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 0.86rem;
  font-weight: 600;
  margin-bottom: 14px;
}
.login-or {
  display: flex;
  align-items: center;
  text-align: center;
  color: var(--faint, #9a958c);
  font-size: 0.82rem;
  margin: 16px 0 4px;
}
.login-or::before,
.login-or::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--line, #e7e2d6);
}
.login-or span { padding: 0 12px; }
.login-google {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 12px 16px;
  border-radius: 14px;
  border: 1px solid var(--line, #e7e2d6);
  background: #fff;
  color: var(--text, #2b2b2b);
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.15s ease;
}
.login-google:hover { background: #f7f5ef; }
</style>
