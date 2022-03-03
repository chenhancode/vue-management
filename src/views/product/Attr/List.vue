<template>
  <div>
    <el-card>
      <CategorySelector @changeGetCategory="changeGetCategory" :isShow="isShow"/>
    </el-card>
    <el-card style="margin-top: 20px">
      <div v-show="isShow">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrFromId.category3Id"
          @click="addAttrList"
          >添加属性</el-button
        >
        <el-table border style="width: 100%" :data="attrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template v-slot="{ row, $index }">
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
              >
                {{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template v-slot="{ row, $index }">
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改"
                @click="updateAttr(row, $index)"
              ></HintButton>
              <HintButton
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除"
                @click="deleteAttr(row)"
              ></HintButton>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-show="!isShow">
        <el-form :inline="true">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrFrom.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addValueList" :disabled="!attrFrom.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShow = true"> 取消 </el-button>
        <el-table
          :data="attrFrom.attrValueList"
          border
          style="width: 100%; margin: 20px 0"
        >
          <el-table-column type="index" align="center" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template v-slot="{ row, $index }">
              <el-input
                :ref="$index"
                v-model="row.valueName"
                v-if="row.isEdit"
                size="mini"
                placeholder="输入属性值名称"
                @blur="toLook(row,$index)"
                @keyup.enter.native="toLook(row)"
              ></el-input>
              <span
                v-else
                style="display: block; width: 100%"
                @click="toEdit(row, $index)"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template v-slot="{ row, $index }">
              <el-popconfirm
                :title="`你确定要删除${row.valueName}吗？`"
                @onConfirm="attrFrom.attrValueList.splice($index, 1)"
              >
                <HintButton
                  slot="reference"
                  title="删除"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="saveAttrLAist" :disabled="!attrFrom.attrValueList.length"> 保存 </el-button>
        <el-button @click="isShow = true"> 取消 </el-button>
      </div>
    </el-card>
  </div>
</template>
<script>

import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      
      attrFromId: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      attrList: [],

      isShow: true,

      attrFrom: {
        attrName: "",
        attrValueList: [
          // {
          //   attrId: 0,
          //   valueName: "string",
          // },
        ],
        categoryId: "",
        categoryLevel: 3,
      },
    };
  },
  

  methods: {
    //获取属性数据
    changeGetCategory(value) {
      let { categoryId, serve } = value;
      if (serve === 1) {
        this.attrFromId.category1Id = categoryId;
        this.attrFromId.category2Id = "";
        this.attrFromId.category3Id = "";
        this.attrList = [];
      } else if (serve === 2) {
        this.attrFromId.category2Id = categoryId;
        this.attrFromId.category3Id = "";
        this.attrList = [];
      } else {
        this.attrFromId.category3Id = categoryId;
        this.getList(this.attrFromId);
      }
    },

    //获取数据
    async getList(attrFromId) {
      try {
        const re = await this.$API.attr.getList(attrFromId);
        if (re.code === 20000 || re.code === 200) {
          this.attrList = re.data;
        } else {
          this.$message.error("获取基础数据失败");
        }
      } catch {
        this.$message.error("请求获取数据失败");
      }
    },

    //添加属性
    addAttrList() {
      this.isShow = false;
      this.attrFrom = {
        attrName: "",
        attrValueList: [],
        categoryId: this.attrFromId.category3Id,
        categoryLevel: 3,
      };
    },

    //修改属性
    updateAttr(row, index) {
      this.isShow = false;
      this.attrFrom = cloneDeep(row);

      this.attrFrom.attrValueList.forEach((item) => {
        this.$set(item, "isEdit", false);
      });
    },

    //添加属性值
    addValueList() {
      this.attrFrom.attrValueList.push({
        attrId: this.attrFrom.id,
        valueName: "",
        isEdit: true,
      });
      this.$nextTick(() => {
        this.$refs[this.attrFrom.attrValueList.length - 1].focus();
      });
    },

    //添加保存/修改数据
    async saveAttrLAist() {
      // 1、属性值名称如果为空串，从属性值列表当中去除
      // 2、属性值当中去除isEdit属性
      // 3、属性值列表如果没有属性值，不发请求

      this.attrFrom.attrValueList.filter((item) => {
        if (item.valueName !== "") {
          delete item.isEdit;
          return true;
        }
      });

      if (!this.attrFrom.attrValueList.length) return;

      try {
        const re = await this.$API.attr.addOrUpdate(this.attrFrom);
        if (re.code === 20000 || re.code === 200) {
          this.$message.success(this.attrFrom.id ? '数据修改成功' : '数据保存成功');
          this.getList(this.attrFromId);
          this.isShow = true;
        } else {
          this.$message.error(
            this.attrFrom.id ? "数据修改失败" : "数据保存失败"
          );
        }
      } catch {
        this.$message.error(
          this.attrFrom.id ? "请求数据修改失败" : "请求数据保存失败"
        );
      }
    },

    //删除数据
    async deleteAttr(row) {
      try {
        const re = await this.$API.attr.removeList(row.id);
        if (re.code === 20000 || re.code === 200) {
          this.$message.success('删除数据成功');
          this.getList(this.attrFromId);
        } else {
          this.$message.error("删除数据失败");
        }
      } catch {
        this.$message.error("请求删除数据失败");
      }
    },

    //改变编辑状态为span
    toLook(row,index) {
      
      //判断input中输入的内容是否为空
      if (row.valueName.trim() === "") {
        this.attrFrom.attrValueList.splice(index,1)
        return;
      }

      //判断是否与其他数据重复
      let isRepeat = this.attrFrom.attrValueList.some((item) => {
        if (item !== row) {
          return item.valueName === row.valueName;
        }
      });

      if (isRepeat) {
        this.$message.error("输入的属性值名称不能重复！！！");
        row.valueName = "";
        return;
      }

      row.isEdit = false;
    },

    //改变编辑状态为input
    toEdit(row, index) {
      
      row.isEdit = true;
      this.$nextTick(() => {
        this.$refs[index].focus();
        this.addPropertyOpinion()
      });
    },

    
  },
};
</script>

<style scoped>
</style>
