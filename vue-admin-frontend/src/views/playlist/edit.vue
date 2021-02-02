<template>
  <el-form
    :model="playList"
    ref="form"
    label-width="80px"
    :inline="false"
    size="normal"
  >
    <el-form-item label="歌单名称">
      <el-input v-model="playList.name"></el-input>
    </el-form-item>
    <el-form-item label="描述">
      <el-input v-model="playList.copywriter"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">更新</el-button>
      <el-button @click="onCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getListById,update } from "../../api/playlist";
export default {
  data() {
    return {
      playList: {},
    };
  },
  created() {
    getListById({
      id: this.$route.params.id,
    }).then((res) => {
      this.playList = res.data;
    });
  },
  methods: {
    onSubmit() {
      update(this.playList).then((res) => {
        if (res.data.modified > 0) {
          this.$message({
            message: "更新成功",
            type: "success",
          });
        } else {
          this.$message.error("err");
        }
      });
    },
    onCancel() {},
  },
};
</script>

<style>
</style>