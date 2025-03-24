<template>
  <vue-particles id="tsparticles" @particles-loaded="particlesLoaded" :options="particlesOptions" />
</template>

<script setup lang="ts">
  import { reactive } from 'vue';

  const particlesLoaded = (container: unknown) => {
    console.log('Particles container loaded', container);
  };

  // Cấu hình ví dụ (bạn có thể tuỳ chỉnh thêm)
  const particlesOptions = reactive({
    background: {
      color: { value: '#0d47a1' },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: { enable: true, mode: 'push' },
        onHover: { enable: true, mode: 'repulse' },
      },
      modes: {
        push: { quantity: 4 },
        repulse: { distance: 200, duration: 0.4 },
      },
    },
    particles: {
      color: { value: '#ffffff' },
      links: {
        color: '#ffffff',
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      move: {
        direction: 'none',
        enable: true,
        outModes: 'bounce',
        speed: 6,
      },
      number: {
        value: 80,
        density: { enable: true },
      },
      opacity: { value: 0.5 },
      shape: { type: 'circle' },
      size: { value: { min: 1, max: 5 } },
    },
    detectRetina: true,
  });
</script>
