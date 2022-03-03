<template>
  <div>
    <el-card>
      <CategorySelector
        @changeGetCategory="changeGetCategory"
        :isShow="isShow"
      />
    </el-card>
    <el-card style="margin-top: 20px">
      <div v-show="!isShowSpuForm && !isShowSkuForm">
        <el-button
          @click="showAddSpuForm"
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          >添加SPU</el-button
        >
        <el-table border :data="spuList" style="width: 100%">
          <el-table-column align="center" type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template v-slot="{ row, $index }">
              <HintButton
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加SKU"
                @click="addSkuList(row)"
              ></HintButton>
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改SPU"
                @click="ShowAddSpuList(row)"
              ></HintButton>
              <HintButton
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看SPU的所有SKU"
              ></HintButton>
              <HintButton
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除SPU"
              ></HintButton>
            </template>
          </el-table-column>
        </el-table>
        <!-- @size-change="handleSizeChange"
        @current-change="handleCurrentChange" -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="getSpuList"
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          :page-count="5"
          layout="  prev, pager, next, jumper,->,total,sizes"
          :total="total"
        >
        </el-pagination>
      </div>
      <SpuForm ref="spu" v-show="isShowSpuForm" :visible.sync="isShowSpuForm" @backSuccess="backSuccess"/>
      <SkuFrom v-show="isShowSkuForm"/>
    </el-card>
  </div>
</template>
<script>
import SpuForm from "@/views/product/Spu/components/SpuForm";
import SkuFrom from '@/views/product/Spu/components/SkuFrom'
export default {
  components: {
    SpuForm,
    SkuFrom,
  },
  name: "Spu",
  data() {
    return {
      isShow: true,
      page: 1,
      limit: 3,
      total: 0,
      spuList: [],
      category1Id: "",
      category2Id: "",
      category3Id: "",
      isShow: true,
      isShowSpuForm: false,
      isShowSkuForm: false,
    };
  },
  methods: {
    //获取选择类别数据
    changeGetCategory({ categoryId, serve }) {
      if (serve === 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
        this.spuList = [];
      } else if (serve === 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
        this.spuList = [];
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },

    //改变limit
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },

    //获取spu列表
    async getSpuList(pager = 1) {
      this.page = pager;
      let { page, limit, category3Id } = this;
      try {
        const re = await this.$API.spu.getList(page, limit, category3Id);

        if (re.code === 20000 || re.code === 200) {
          this.spuList = re.data.records;
          this.total = re.data.total;
        } else {
          this.$message.error("获取spu列表失败");
        }
      } catch {
        this.$message.error("请求获取spu列表失败");
      }
    },

    //修改spu属性
    ShowAddSpuList(row) {
      this.isShowSpuForm = true;
      this.$refs.spu.getInitUpdateSpuFormData(row,this.category3Id);
    },

    //添加spu属性
    showAddSpuForm(){
      this.isShowSpuForm = true;
      this.$refs.spu.getInitAddSpuFormData(this.category3Id);
    },

    //添加sku
    addSkuList(row){
      this.isShowSkuForm = true;
    },

    //判断返回页面属性
    backSuccess(spuId){
      if(spuId){
        this.getSpuList(this.page);
      }else{
        this.getSpuList();
      }
    }
  },
};
</script>

<style scoped>
</style>
