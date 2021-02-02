<template>
  <div>
    <el-table :data="playlist" border stripe v-loading="loading">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="封面" width="150">
        <template slot-scope="scope">
          <img :src="scope.row.picUrl" height="50" />
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="描述" prop="copywriter"></el-table-column>
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

    <!--  -->
    <el-dialog title="提示" :visible.sync="delDialogShow" width="30%">
      <span>删除歌单信息</span>
      <span slot="footer">
        <el-button @click="delDialogShow = false">Cancel</el-button>
        <el-button type="primary" @click="sureDel">OK</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getList, del } from "../../api/playlist";
export default {
  data() {
    return {
      playlist: [],
      count: 50,
       delDialogShow: false,
          info: {},
            loading: false,
     
    };
  },
  created() {
    this._getList();
  },
  methods: {
    _getList() {
      this.loading = true;
      getList({
        start: this.playlist.length,
        count: this.count,
      }).then((res) => {
        this.playlist = res.data;
        this.loading = false;
      });
    },
    onEdit(row) {
      this.$router.push(`/playlist/edit/${row._id}`);
    },
    onDelect(row) {
      this.delDialogShow = true;
      this.info.id = row._id;
    },
    sureDel() {
      del({ id: this.info.id }).then((res) => {
        if (res.data.deleted > 0) {
          this.playlist = [];
          this._getList();
          this.delDialogShow = false;
          this.$message({
            type: 'success',
            message: "成功",
          });
        }else{
          this.$message.error('删除失败');
           this.delDialogShow = false;
        }
      });
    },
  },
};
</script>

<style>
</style>