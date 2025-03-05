<template>
  <div id="container">
    <Form form="form" id="form" labelAlign="left">
      <FormItem name="company_name" label="Company name">
        <Input class="input" />
      </FormItem>
      <FormItem name="background" label="Background">
        <ColorPicker defaultValue="red" showText />
      </FormItem>
      <FormItem name="color" label="Color">
        <ColorPicker defaultValue="red" showText />
      </FormItem>
      <FormItem name="font" label="Font">
        <Input class="input" />
      </FormItem>
      <FormItem name="logo" label="Logo">
        <Upload showUploadList="{false}" {...props} accept="image/*">
          <Button>Upload logo</Button>
        </Upload>
      </FormItem>
      <FormItem>
        <Button type="primary" htmlType="submit"> Submit </Button>
      </FormItem>
    </Form>
  </div>
</template>

<script setup lang="ts">
  import { Form, FormItem, Input } from 'ant-design-vue';
</script>
