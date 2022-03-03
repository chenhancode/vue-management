<template>
  <el-form :inline="true" :disabled="!isShow">
    <el-form-item label="一级分类">
      <el-select
        v-model="cFrom.category1Id"
        placeholder="请选择"
        @change="handlerCategory1"
      >
        <el-option
          :label="c1.name"
          :value="c1.id"
          v-for="(c1, index) in Category1List"
          :key="c1.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="二级分类">
      <el-select
        placeholder="请选择"
        v-model="cFrom.category2Id"
        @change="handlerCategory2"
      >
        <el-option
          :label="c2.name"
          :value="c2.id"
          v-for="(c2, index) in Category2List"
          :key="c2.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="三级分类">
      <el-select
        placeholder="请选择"
        v-model="cFrom.category3Id"
        @change="handlerCategory3"
      >
        <el-option
          :label="c3.name"
          :value="c3.id"
          v-for="(c3, index) in Category3List"
          :key="c3.id"
        ></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props:["isShow"],
  data() {
    return {
      Category1List: [],
      Category2List: [],
      Category3List: [],
      cFrom: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  mounted() {
    this.getCategory1();
  },
  methods: {
    //获取一级分类数据
    async getCategory1() {
      try {
        const re = await this.$API.category.getCategory1();
        if (re.code === 20000 || re.code === 200) {
          this.Category1List = re.data;
        } else {
          this.$message.error("一级分类数据获取失败");
        }
      } catch (error) {
        this.$message.error("请求一级分类数据获取失败");
      }
    },

    //一级数据改变获取二级分类数据
    async handlerCategory1(category1Id) {
      this.Category2List = [];
      this.Category3List = [];
      this.cFrom.category2Id = "";
      this.cFrom.category3Id = "";


      this.$emit('changeGetCategory',{categoryId:category1Id,serve:1})
      try {
        const re = await this.$API.category.getCategory2(category1Id);
        if (re.code === 20000 || re.code === 200) {
          this.Category2List = re.data;
        } else {
          this.$message.error("二级数据获取失败");
        }
      } catch (error) {
        this.$message.error("请求二级数据获取失败");
      }
    },

    //二级数据改变获取三级分类数据
    async handlerCategory2(category2Id) {
      this.$emit('changeGetCategory',{categoryId:category2Id,serve:2})
      this.Category3List = [];
      this.cFrom.category3Id = "";
      try {
        const re = await this.$API.category.getCategory3(category2Id);
        if (re.code === 20000 || re.code === 200) {
          this.Category3List = re.data;
        } else {
          this.$message.error("二级数据获取失败");
        }
      } catch (error) {
        this.$message.error("请求二级数据获取失败");
      }
    },

    handlerCategory3(category3Id) {
      this.$emit('changeGetCategory',{categoryId:category3Id,serve:3})
    },
  },
};
</script>

<style scoped>
</style>