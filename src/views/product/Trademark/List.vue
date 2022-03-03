<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showAddDialog"
      >添加</el-button
    >

    <!-- 数据显示 -->
    <el-table :data="trademarkList" border style="width: 100%; margin: 20px 0">
      <el-table-column label="序号" width="80" align="center" type="index">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column label="品牌LOGO" width="width">
        <template v-slot="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="width: 80px; height: 60px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template v-slot="{ row, $index }">
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-edit"
            @click="showUpdateDialog(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeTrademarkList(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      style="text-align: center; margin: 20px 0 0 -10px"
      background
      :total="total"
      :current-page="page"
      :page-size="limit"
      :pager-count="5"
      :page-sizes="[3, 5, 10]"
      @current-change="getTeademarkList"
      @size-change="handleSizeChange"
      layout="prev, pager, next, jumper,->,sizes,total"
    >
    </el-pagination>

    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="tmForm">
        <!-- :model="form"表单验证后期写 -->
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "Trademark",
  data() {
    let validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error("品牌名称长度必须在2-10之间"));
      } else {
        callback();
      }
    };

    return {
      page: 1,
      limit: 3,
      total: 0,
      trademarkList: [],
      dialogFormVisible: false,

      tmForm: {
        tmName: "",
        logoUrl: "",
      },

      //表单验证
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          { validator: validateTmName, trigger: "change" },
        ],
        logoUrl: [{ required: true, message: "请选择LOGO图片" }],
      },
    };
  },
  mounted() {
    this.getTeademarkList();
  },
  methods: {
    //初始化请求 切换页码
    async getTeademarkList(page = 1) {
      this.page = page;
      try {
        const re = await this.$API.trademark.getPageList(this.page, this.limit);
        if (re.code === 20000 || re.code === 200) {
          this.trademarkList = re.data.records;
          this.total = re.data.total;
        } else {
          this.$message.error("获取列表失败");
        }
      } catch (error) {
        this.$message.error("请求获取列表失败");
      }
    },

    //切换每页显示数量
    handleSizeChange(limit) {
      this.limit = limit;
      this.getTeademarkList();
    },

    //点击添加按钮添加对话框
    showAddDialog() {
      this.dialogFormVisible = true;
      this.tmForm = {
        tmName: "",
        logoUrl: "",
      };
    },

    //点击修改对话框
    showUpdateDialog(row) {
      this.dialogFormVisible = true;
      this.tmForm = { ...row };
    },

    //图片添加成功后调用函数
    handleAvatarSuccess(res, file) {
      console.log(res, file);
      this.tmForm.logoUrl = res.data;
    },

    //上传之前的函数，限制图片大小
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    //点击上传/修改数据
    addOrUpdate() {
      this.$refs.tmForm.validate(async (valid) => {
        console.log(valid);
        if (valid) {
          let trademark = this.tmForm;
          try {
            const re = await this.$API.trademark.addOrUpdate(trademark);

            if (re.code === 20000 || re.code === 200) {
              this.dialogFormVisible = false;
              this.$message.success(
                trademark.id ? "品牌修改成功" : "品牌添加成功"
              );
              this.getTeademarkList(trademark.id ? this.page : 1);
            } else {
              this.$message.error(
                trademark.id ? "品牌修改失败" : "品牌添加失败"
              );
            }
          } catch (error) {
            this.$message.success(
              trademark.id ? "请求品牌修改失败" : "请求品牌添加失败"
            );
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //删除数据
    removeTrademarkList(row) {
      this.$confirm(`你确定删除${row.tmName}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            const re = await this.$API.trademark.remove(row.id);
            if (re.code === 20000 || re.code === 200) {
              this.$message.success("删除数据成功");
              this.getTeademarkList(
                this.trademarkList.length > 1 ? this.page : this.page - 1
              );
            } else {
              this.$message.error("删除数据失败");
            }
          } catch (error) {
            this.$message.error("请求删除数据失败");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style >
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
