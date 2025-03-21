// vite.config.ts
import { defineApplicationConfig } from "file:///D:/laragon/www/stda-master/internal/vite-config/dist/index.mjs";
import { loadEnv } from "file:///D:/laragon/www/stda-master/node_modules/.pnpm/vite@5.4.14_@types+node@20.17.24_less@4.2.2_sass@1.86.0_terser@5.39.0/node_modules/vite/dist/node/index.js";
function apiTarget() {
  const root = process.cwd();
  const { VITE_BACKEND_URL } = loadEnv("development", root);
  return VITE_BACKEND_URL || "http://127.0.0.1:8000";
}
var vite_config_default = defineApplicationConfig({
  overrides: {
    optimizeDeps: {
      include: [
        "echarts/core",
        "echarts/charts",
        "echarts/components",
        "echarts/renderers",
        "qrcode",
        "@iconify/iconify",
        "ant-design-vue/es/locale/en_US",
        "three",
        "@infectoone/vue-ganttastic"
      ]
    },
    server: {
      proxy: {
        "/v1": {
          target: apiTarget(),
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/v1`), "api/v1")
          // only https
          // secure: false
        },
        "/sample-file": {
          target: apiTarget(),
          changeOrigin: true,
          ws: false,
          rewrite: (path) => path.replace(new RegExp(`^/sample-file`), "")
        }
      },
      open: true,
      warmup: {
        clientFiles: ["./index.html", "./src/{views,components}/*"]
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxsYXJhZ29uXFxcXHd3d1xcXFxzdGRhLW1hc3RlclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcbGFyYWdvblxcXFx3d3dcXFxcc3RkYS1tYXN0ZXJcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2xhcmFnb24vd3d3L3N0ZGEtbWFzdGVyL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQXBwbGljYXRpb25Db25maWcgfSBmcm9tICdAdmJlbi92aXRlLWNvbmZpZyc7XG5pbXBvcnQgeyBsb2FkRW52IH0gZnJvbSAndml0ZSc7XG5cbmZ1bmN0aW9uIGFwaVRhcmdldCgpOiBzdHJpbmcge1xuICBjb25zdCByb290ID0gcHJvY2Vzcy5jd2QoKTtcbiAgY29uc3QgeyBWSVRFX0JBQ0tFTkRfVVJMIH0gPSBsb2FkRW52KCdkZXZlbG9wbWVudCcsIHJvb3QpO1xuICByZXR1cm4gVklURV9CQUNLRU5EX1VSTCB8fCAnaHR0cDovLzEyNy4wLjAuMTo4MDAwJztcbn1cblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQXBwbGljYXRpb25Db25maWcoe1xuICBvdmVycmlkZXM6IHtcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIGluY2x1ZGU6IFtcbiAgICAgICAgJ2VjaGFydHMvY29yZScsXG4gICAgICAgICdlY2hhcnRzL2NoYXJ0cycsXG4gICAgICAgICdlY2hhcnRzL2NvbXBvbmVudHMnLFxuICAgICAgICAnZWNoYXJ0cy9yZW5kZXJlcnMnLFxuICAgICAgICAncXJjb2RlJyxcbiAgICAgICAgJ0BpY29uaWZ5L2ljb25pZnknLFxuICAgICAgICAnYW50LWRlc2lnbi12dWUvZXMvbG9jYWxlL2VuX1VTJyxcbiAgICAgICAgJ3RocmVlJyxcbiAgICAgICAgJ0BpbmZlY3Rvb25lL3Z1ZS1nYW50dGFzdGljJyxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIHByb3h5OiB7XG4gICAgICAgICcvdjEnOiB7XG4gICAgICAgICAgdGFyZ2V0OiBhcGlUYXJnZXQoKSxcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgICAgd3M6IHRydWUsXG4gICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZShuZXcgUmVnRXhwKGBeL3YxYCksICdhcGkvdjEnKSxcbiAgICAgICAgICAvLyBvbmx5IGh0dHBzXG4gICAgICAgICAgLy8gc2VjdXJlOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICAnL3NhbXBsZS1maWxlJzoge1xuICAgICAgICAgIHRhcmdldDogYXBpVGFyZ2V0KCksXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgIHdzOiBmYWxzZSxcbiAgICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKG5ldyBSZWdFeHAoYF4vc2FtcGxlLWZpbGVgKSwgJycpLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIG9wZW46IHRydWUsXG4gICAgICB3YXJtdXA6IHtcbiAgICAgICAgY2xpZW50RmlsZXM6IFsnLi9pbmRleC5odG1sJywgJy4vc3JjL3t2aWV3cyxjb21wb25lbnRzfS8qJ10sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBd1EsU0FBUywrQkFBK0I7QUFDaFQsU0FBUyxlQUFlO0FBRXhCLFNBQVMsWUFBb0I7QUFDM0IsUUFBTSxPQUFPLFFBQVEsSUFBSTtBQUN6QixRQUFNLEVBQUUsaUJBQWlCLElBQUksUUFBUSxlQUFlLElBQUk7QUFDeEQsU0FBTyxvQkFBb0I7QUFDN0I7QUFFQSxJQUFPLHNCQUFRLHdCQUF3QjtBQUFBLEVBQ3JDLFdBQVc7QUFBQSxJQUNULGNBQWM7QUFBQSxNQUNaLFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sT0FBTztBQUFBLFFBQ0wsT0FBTztBQUFBLFVBQ0wsUUFBUSxVQUFVO0FBQUEsVUFDbEIsY0FBYztBQUFBLFVBQ2QsSUFBSTtBQUFBLFVBQ0osU0FBUyxDQUFDLFNBQVMsS0FBSyxRQUFRLElBQUksT0FBTyxNQUFNLEdBQUcsUUFBUTtBQUFBO0FBQUE7QUFBQSxRQUc5RDtBQUFBLFFBQ0EsZ0JBQWdCO0FBQUEsVUFDZCxRQUFRLFVBQVU7QUFBQSxVQUNsQixjQUFjO0FBQUEsVUFDZCxJQUFJO0FBQUEsVUFDSixTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEsSUFBSSxPQUFPLGVBQWUsR0FBRyxFQUFFO0FBQUEsUUFDakU7QUFBQSxNQUNGO0FBQUEsTUFDQSxNQUFNO0FBQUEsTUFDTixRQUFRO0FBQUEsUUFDTixhQUFhLENBQUMsZ0JBQWdCLDRCQUE0QjtBQUFBLE1BQzVEO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
