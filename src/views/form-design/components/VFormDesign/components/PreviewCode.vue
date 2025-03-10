<template>
  <div>
    <div class="v-json-box">
      <CodeEditor :value="editorJson" ref="myEditor" :mode="MODE.JSON" />
    </div>
    <div class="copy-btn-box">
      <a-button
        @click="handleCopyJson"
        type="primary"
        class="copy-btn"
        data-clipboard-action="copy"
        :data-clipboard-text="editorJson"
      >
        Copy Data
      </a-button>
      <a-button @click="handleExportJson" type="primary">Export Code</a-button>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs } from 'vue';
  import { CodeEditor, MODE } from '@/components/CodeEditor';

  import { copyText } from '@/utils/copyTextToClipboard';
  import { useMessage } from '@/hooks/web/useMessage';

  export default defineComponent({
    name: 'PreviewCode',
    components: {
      CodeEditor,
    },
    props: {
      fileFormat: {
        type: String,
        default: 'json',
      },
      editorJson: {
        type: String,
        default: '',
      },
    },
    setup(props) {
      const state = reactive({
        visible: false,
      });

      const exportData = (data: string, fileName = `file.${props.fileFormat}`) => {
        let content = 'data:text/csv;charset=utf-8,';
        content += data;
        const encodedUri = encodeURI(content);
        const actions = document.createElement('a');
        actions.setAttribute('href', encodedUri);
        actions.setAttribute('download', fileName);
        actions.click();
      };

      const handleExportJson = () => {
        exportData(props.editorJson);
      };

      const { createMessage } = useMessage();

      const handleCopyJson = () => {
        // 复制数据
        const value = props.editorJson;
        if (!value) {
          createMessage.warning('Code is empty!');
          return;
        }
        copyText(value);
      };

      return {
        ...toRefs(state),
        exportData,
        handleCopyJson,
        handleExportJson,
        MODE,
      };
    },
  });
</script>

<style lang="less" scoped>
  // modal复制按钮样式
  .copy-btn-box {
    padding-top: 8px;
    text-align: center;

    .copy-btn {
      margin-right: 8px;
    }
  }
</style>
