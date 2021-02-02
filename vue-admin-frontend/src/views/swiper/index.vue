<template>
  <div>
    <el-table :data="swiperList" border stripe v-loading="loading">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="封面" width="150">
        <template slot-scope="scope">
          <img :src="scope.row.download_url" height="50" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="default" @click="onEdit(scope.row)"
            >编辑</el-button
          >
          <el-button type="primary" size="default" @click="onDelect(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-upload
        action="http://localhost:3001/swiper/upload"
        ref="upload"
        :auto-upload="true"
        multiple
        :limit="5"
        :on-success="uploadSuccess"
      >
        <el-button slot="trigger" size="small" type="primary"
          >select file</el-button
        >
      </el-upload>
    </div>
  </div>
</template>

<script>
import { getList } from "../../api/swiper";
export default {
  data() {
    return {
      swiperList: [],
      loading: false,
    };
  },
  created() {
    this._getlist();
  },
  methods: {
    _getlist() {
      this.swiperList = [];
      this.loading = true;
      getList().then((res) => {
        console.log(res);
        this.loading = false;
        this.swiperList = res.returnData;
      });
    },
    uploadSuccess(res) {
      console.log(res)
      if (res.id_list.length > 0) {
        this._getlist();
        this.$message({
          type: "success",
          message: "成功",
        });
      }
    },
  },
};
</script>

<style>
</style>