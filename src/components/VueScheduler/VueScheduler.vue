<template>
  <div
    id="vue3-scheduler"
    class="grid h-full rounded overflow-hidden overscroll-none bg-gray-100 p-3"
    style="grid-template-areas: 'grid1 grid2 grid2 grid2 grid2 '"
  >
    <!-- Headers + Identifiers (first column) -->
    <div id="first-column" class="w-[250px] border-r rounded-l bg-gray-300 mr-px overscroll-x-auto">
      <!-- Headers -->
      <div id="headers" class="flex border-b">
        <div
          v-for="(header, index) in headers"
          :key="index"
          class="grid w-full text-left items-center relative p-2.5 mr-px text-xs text-gray-100 bg-slate-500"
          :style="
            'min-width: ' +
            cellWidth +
            'px; ' +
            'min-height: ' +
            rowHeight +
            'px; ' +
            'max-height: ' +
            rowHeight +
            'px; '
          "
        >
          {{ header }}
        </div>
      </div>
      <!-- Identifiers -->
      <div id="identifiers" class="relative">
        <div v-for="(identifier, index) in identifiers" :key="index" class="flex flex-row w-full">
          <div
            v-for="col in identifier"
            :key="col"
            class="grid w-full text-left relative border-b p-2.5 mr-px bg-white text-xs text-gray-400 leading-10 text-medium"
            :style="
              'min-width: ' +
              cellWidth +
              'px; ' +
              'min-height: ' +
              rowHeight +
              'px; ' +
              'max-height: ' +
              rowHeight +
              'px; '
            "
          >
            {{ col }}
          </div>
        </div>
      </div>
    </div>
    <!-- Timeline + Events (second column) -->
    <!-- @wheel="onWheel" -->
    <div id="second-column" class="flex flex-col overflow-auto rounded-r">
      <!-- Timeline -->
      <div id="timeline" class="flex border-b">
        <div
          v-for="time in getTimeline"
          :key="time.id"
          class="overflow-hidden text-center items-center relative p-2.5 border-r bg-slate-500 text-xs text-gray-100"
          :style="
            'min-width: ' +
            cellWidth +
            'px; ' +
            'max-width: ' +
            cellWidth +
            'px; ' +
            'min-height: ' +
            rowHeight +
            'px; ' +
            'max-height: ' +
            rowHeight +
            'px; '
          "
        >
          <span>
            {{ time.formattedDate }}
            {{ time.formattedTime }}
          </span>
        </div>
      </div>
      <!-- Events -->
      <div id="events" class="relative" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
        <!-- Events -->
        <div
          v-for="(event, index) in events"
          :key="index"
          :data-index="index"
          :data-x="getEventLeft(event.start)"
          :data-y="getEventRow(event.identiferIdx)"
          :class="event.meta?.class || 'bg-blue-500'"
          :style="{
            height: `${rowHeight}px`,
            width: `${getEventWidth(event.start, event.end)}px`,
            left: `${getEventLeft(event.start)}px`,
            top: `${getEventRow(event.identiferIdx)}px`,
          }"
          class="z-10 draggable flex absolute select-none"
        >
          <slot name="event" :event="event"></slot>
          <!-- Resize Handle -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 192 512"
            class="absolute right-0 h-4 w-4 resize-handle"
            :style="{
              top: `${rowHeight / 3}px`,
            }"
          >
            <path
              class="opacity-40 fill-white"
              d="M0 64C0 46.33 14.33 32 32 32C49.67 32 64 46.33 64 64V448C64 465.7 49.67 480 32 480C14.33 480 0 465.7 0 448V64z"
            />
            <path
              class="opacity-40 fill-white"
              d="M128 64C128 46.33 142.3 32 160 32C177.7 32 192 46.33 192 64V448C192 465.7 177.7 480 160 480C142.3 480 128 465.7 128 448V64z"
            />
          </svg>
        </div>
        <!-- Empty Event Grid -->
        <div v-for="(_row, index) in identifiers" :key="index" class="flex dropzone">
          <div
            v-for="(_time, timeIdx) in getTimeline"
            :key="timeIdx"
            class="text-center relative p-2.5 border-b border-r border-gray-300 bg-white text-xs text-white leading-10 text-medium"
            :style="
              'min-width: ' +
              cellWidth +
              'px; ' +
              'max-width: ' +
              cellWidth +
              'px; ' +
              'min-height: ' +
              rowHeight +
              'px; ' +
              'max-height: ' +
              rowHeight +
              'px; '
            "
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch, nextTick } from 'vue';
  import interact from 'interactjs';

  declare global {
    interface Window {
      dragMoveListener: (event: DragEvent) => void;
    }
  }

  // Define Event Interface
  interface Event {
    identiferIdx: number;
    start: Date;
    end: Date;
    meta?: {
      class?: string;
      description?: string;
      title?: string;
    };
  }

  // Define Options Interface
  interface Options {
    cellWidth?: number;
    rowHeight?: number;
    scaleUnit?: string;
    scaleCustom?: number;
    scrollSpeed?: number;
    timeFormat?: string;
  }

  // Default Options
  const DEFAULT_OPTIONS: Options = {
    cellWidth: 100,
    rowHeight: 50,
    scaleUnit: 'minutes',
    scrollSpeed: 5,
    timeFormat: 'HH:mm',
  };

  // Define Props
  const props = defineProps<{
    end: Date;
    events: Event[];
    headers: string[];
    identifiers: string[][];
    options?: Options;
    start: Date;
  }>();

  // Reactive References
  const cellWidth = ref<number>(props.options?.cellWidth || DEFAULT_OPTIONS.cellWidth!);
  const rowHeight = ref<number>(props.options?.rowHeight || DEFAULT_OPTIONS.rowHeight!);
  const scale = ref<number>(0.5);
  const scaleIncrement = ref<number>(0.5);
  // const scrollDown = ref<number>(0);
  // const scrollUp = ref<number>(0);
  const propData = ref<Event[]>(props.events);
  const verticalLineX = ref(0);
  const showVerticalLine = ref(false);

  // Generate Timeline Based on Scale
  function generateTimeline() {
    const timeSlots: Array<{
      id: number;
      date: Date;
      formattedDate: string;
      formattedTime: string;
    }> = [];
    const start = new Date(props.start);
    const end = new Date(props.end);

    // Convert scale from decimal to minutes
    const scaleInMinutes = scale.value * 60;

    const current = new Date(start);
    while (current < end) {
      timeSlots.push({
        id: current.getTime(),
        date: new Date(current),
        formattedDate: `${current.getDate()}/${current.getMonth() + 1}`,
        formattedTime: current.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        }),
      });
      current.setMinutes(current.getMinutes() + scaleInMinutes);
    }

    return timeSlots;
  }

  // Computed Timeline
  const getTimeline = computed(() => generateTimeline());

  // Calculate Event Width
  function getEventWidth(start: Date, end: Date): number {
    const duration = (end.getTime() - start.getTime()) / 60000; // duration in minutes
    if (!cellWidth.value) return 0;

    return (duration / 60 / scale.value) * cellWidth.value;
  }

  // Calculate Event Left Position
  function getEventLeft(eventStart: Date): number {
    if (!cellWidth.value) return 0;
    const start = new Date(props.start);
    const timeDifference = (eventStart.getTime() - start.getTime()) / 60000; // difference in minutes
    const left = (timeDifference / 60 / scale.value) * cellWidth.value;

    return left;
  }

  // Calculate Event Row Position
  function getEventRow(identiferIdx: number): number {
    return identiferIdx * rowHeight.value;
  }

  // Handle Wheel Event for Zooming
  // const onWheel = (event: WheelEvent) => {
  //   if (event.deltaY < 0) {
  //     scrollUp.value++;
  //     if (scrollUp.value === (props.options?.scrollSpeed || DEFAULT_OPTIONS.scrollSpeed)) {
  //       scale.value = Math.min(scale.value + scaleIncrement.value, 5); // Limit scale to 5
  //       scrollUp.value = 0;
  //     }
  //   }
  //   if (event.deltaY > 0) {
  //     scrollDown.value++;
  //     if (scrollDown.value === (props.options?.scrollSpeed || DEFAULT_OPTIONS.scrollSpeed)) {
  //       scale.value = Math.max(scale.value - scaleIncrement.value, 0.5); // Limit scale to 0.5
  //       scrollDown.value = 0;
  //     }
  //   }
  // };

  // Set Initial Scale Based on Options
  const setScale = () => {
    // Check if custom scale is set
    if (props.options?.scaleCustom) {
      scale.value = props.options.scaleCustom;
      return;
    }

    switch (props.options?.scaleUnit) {
      case 'minutes':
        scale.value = 0.5;
        scaleIncrement.value = 0.5;
        break;
      case 'hours':
        scale.value = 1.0;
        scaleIncrement.value = 1.0;
        break;
      case 'days':
        scale.value = 24.0;
        scaleIncrement.value = 24.0;
        break;
      default:
        scale.value = 0.5;
        scaleIncrement.value = 0.5;
    }
  };

  /**
   * Drag move listener
   * @param event
   * @returns {void}
   */
  function dragMoveListener(event: MouseEvent) {
    const target = event.target as HTMLElement; // Cast event.target to HTMLElement

    // keep the dragged position in the data-x/data-y attributes
    const x = parseFloat(target.getAttribute('data-x') ?? '0') || 0;
    const y = parseFloat(target.getAttribute('data-y') ?? '0') || 0;

    // translate the element
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x.toString());
    target.setAttribute('data-y', y.toString());
  }

  // Initialize Draggable and Resizable Elements
  const initDraggable = (element: HTMLDivElement) => {
    if (!element || !cellWidth.value) return;
    window.dragMoveListener = dragMoveListener;

    let x = 0;
    let y = 0;

    interact(element)
      .resizable({
        // Resize from the right edge only
        edges: { left: false, right: true, bottom: false, top: false },
        listeners: {
          move(event) {
            const dataIndex: number = parseInt(element.getAttribute('data-index') ?? '0');
            const selectedEvent = propData.value[dataIndex];
            const width = event.rect.width;
            const minutes = Math.round((width / cellWidth.value) * scale.value * 60); // Convert width to time based on scale

            // Update the end time of the event
            const newEnd = new Date(selectedEvent.start);
            newEnd.setMinutes(newEnd.getMinutes() + minutes);
            selectedEvent.end = newEnd;
          },
        },
        modifiers: [
          // Keep the edges inside the parent
          interact.modifiers.restrictEdges({
            outer: 'parent',
          }),
          // Minimum size
          interact.modifiers.restrictSize({
            min: { width: 100, height: rowHeight.value },
          }),
        ],
        inertia: false,
      })
      .draggable({
        listeners: { move: window.dragMoveListener },
        modifiers: [
          interact.modifiers.snap({
            targets: [interact.snappers.grid({ x: 10, y: rowHeight.value })],
            range: Infinity,
            relativePoints: [{ x: 0, y: 0 }],
            offset: '#events',
          }),
          interact.modifiers.restrict({
            restriction: 'parent',
            elementRect: { top: 0, left: 0, bottom: 1, right: 0 },
            endOnly: false,
          }),
        ],
        inertia: true,
      })
      .on('dragmove', function (event) {
        x += event.dx;
        y += event.dy;
        event.target.setAttribute('data-x', x.toString());
        event.target.setAttribute('data-y', y.toString());
        // You can implement additional logic to update the event's position here
      });
  };

  /**
   * Show the vertical line on mouse move
   * @param event
   * @returns {void}
   */
  function handleMouseMove(event: MouseEvent) {
    const bodyRect = document.getElementById('body')?.getBoundingClientRect();
    if (!bodyRect) return;
    const mouseX = event.clientX - bodyRect.left;
    verticalLineX.value = mouseX - 250;
    showVerticalLine.value = true;
  }

  /**
   * Hide the vertical line on mouse leave
   * @returns {void}
   */
  function handleMouseLeave() {
    showVerticalLine.value = false;
  }

  // Initialize on Mounted
  onMounted(() => {
    setScale();
    // Initialize draggable for existing events
    // Delay to ensure the DOM is rendered
    nextTick(() => {
      document.querySelectorAll('.draggable').forEach((element: Element) => {
        initDraggable(element as HTMLDivElement);
      });
    });
  });

  // Watch for changes in events prop to re-initialize draggable
  watch(
    () => props.events,
    () => {
      nextTick(() => {
        document.querySelectorAll('.draggable').forEach((element: Element) => {
          initDraggable(element as HTMLDivElement);
        });
      });
    },
  );
</script>

<style scoped>
  /* Add your component-specific styles here */
</style>
