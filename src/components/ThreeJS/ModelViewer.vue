<template>
  <div ref="canvasContainer" class="canvas-container"></div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import * as THREE from 'three';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

  // Khai báo module cho TypeScript
  declare module 'three/examples/jsm/loaders/GLTFLoader.js';
  declare module 'three/examples/jsm/controls/OrbitControls.js';

  const canvasContainer = ref<HTMLDivElement | null>(null);

  // Biến lưu trữ các đối tượng Three.js
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let model: THREE.Group;
  let raycaster: THREE.Raycaster;
  let mouse: THREE.Vector2;
  let animationId: number;
  let controls: OrbitControls;

  const initThreeJS = () => {
    if (!canvasContainer.value) return;

    // Khởi tạo scene, camera và renderer
    scene = new THREE.Scene();

    // Thiết lập màu nền nếu cần
    scene.background = new THREE.Color(0xf0f0f0); // Màu xám nhạt

    const width = canvasContainer.value.clientWidth;
    const height = canvasContainer.value.clientHeight;

    // Điều chỉnh góc nhìn của camera
    camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    // Vị trí ban đầu của camera (sẽ được cập nhật sau khi tải mô hình)
    camera.position.set(0, 2, 5);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.outputEncoding = THREE.sRGBEncoding;

    // Kích hoạt bóng đổ cho renderer
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    canvasContainer.value.appendChild(renderer.domElement);

    // Khởi tạo OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Thêm ánh sáng môi trường (AmbientLight)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Cường độ 0.5
    scene.add(ambientLight);

    // Thêm ánh sáng định hướng mạnh để mô phỏng ánh sáng mặt trời
    const sunLight = new THREE.DirectionalLight(0xffffff, 2); // Cường độ 2
    sunLight.position.set(10, 20, 10); // Vị trí của ánh sáng
    sunLight.castShadow = true; // Cho phép ánh sáng tạo bóng đổ

    // Cấu hình bóng đổ cho ánh sáng định hướng
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 500;
    scene.add(sunLight);

    // Thêm lưới màu xám
    const gridHelper = new THREE.GridHelper(100, 100, 0x888888, 0x888888);
    gridHelper.position.y = -11.5;
    scene.add(gridHelper);

    // Khởi tạo raycaster và vector chuột
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Tải mô hình GLTF/GLB
    const loader = new GLTFLoader();
    loader.load(
      '/models/demo.glb',
      (gltf) => {
        model = gltf.scene;

        // Kích hoạt bóng đổ cho mô hình
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true; // Cho phép đối tượng đổ bóng
            mesh.receiveShadow = true; // Cho phép đối tượng nhận bóng
          }
        });

        // Tính toán bounding box và kích thước của mô hình
        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        const size = new THREE.Vector3();
        box.getCenter(center);
        box.getSize(size);

        // Căn giữa mô hình trong cảnh
        model.position.x += model.position.x - center.x;
        model.position.y += model.position.y - center.y;
        model.position.z += model.position.z - center.z;

        // Thêm mô hình vào cảnh
        scene.add(model);

        // Điều chỉnh camera để bao quát mô hình
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

        cameraZ *= 1.5; // Tùy chỉnh hệ số này để có khoảng cách mong muốn

        camera.position.z = center.z + cameraZ;
        camera.position.y = center.y + cameraZ / 2; // Điều chỉnh vị trí Y nếu cần
        camera.lookAt(center);

        // Cập nhật điều khiển OrbitControls
        controls.maxDistance = cameraZ * 10;
        controls.target.copy(center);
        controls.update();
      },
      undefined,
      (error) => {
        console.error('Lỗi khi tải mô hình:', error);
      },
    );

    // Thêm sự kiện click và resize
    window.addEventListener('click', onClick, false);
    window.addEventListener('resize', onWindowResize, false);

    // Bắt đầu vòng lặp render
    animate();
  };

  const onClick = (event: MouseEvent) => {
    if (!model) return;

    // Tính toán vị trí chuột trong NDC
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(model, true);

    if (intersects.length > 0) {
      console.log('Mô hình đã được click:', intersects[0].object);
      // Thực hiện hành động khi click vào mô hình
    }
  };

  const onWindowResize = () => {
    if (!canvasContainer.value) return;

    const width = canvasContainer.value.clientWidth;
    const height = canvasContainer.value.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  };

  const animate = () => {
    animationId = requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
  };

  onMounted(() => {
    initThreeJS();
  });

  onBeforeUnmount(() => {
    // Hủy vòng lặp animation khi component bị hủy
    cancelAnimationFrame(animationId);

    // Xóa các sự kiện
    window.removeEventListener('click', onClick);
    window.removeEventListener('resize', onWindowResize);

    // Dọn dẹp renderer và scene
    renderer.dispose();
    scene.clear();
  });
</script>

<style scoped>
  .canvas-container {
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
</style>
