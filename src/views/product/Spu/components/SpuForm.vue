<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input v-model="spuInfo.spuName"></el-input>
    </el-form-item>
    <el-form-item label="品牌">
      <el-select v-model="spuInfo.tmId" placeholder="请选择品牌">
        <el-option
          v-for="(tm, index) in trademarkList"
          :key="tm.id"
          :label="tm.tmName"
          :value="tm.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        v-model="spuInfo.description"
        type="textarea"
        rows="4"
        placeholder="SPU描述"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <el-upload
        action="/dev-api/admin/product/fileUpload"
        list-type="picture-card"
        :file-list="SpuImage"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-select
        v-model="saleAttrIdName"
        :placeholder="
          unSelectedSaleAttrList.length
            ? `还有${unSelectedSaleAttrList.length}种未选择`
            : '没有了'
        "
      >
        <el-option
          v-for="(unSelectedSaleAttr, index) in unSelectedSaleAttrList"
          :key="unSelectedSaleAttr.id"
          :label="unSelectedSaleAttr.name"
          :value="`${unSelectedSaleAttr.id}:${unSelectedSaleAttr.name}`"
        ></el-option>
      </el-select>
      <el-button
        :disabled="!saleAttrIdName"
        type="primary"
        icon="el-icon-plus"
        @click="addSaleAttr"
        >添加销售属性</el-button
      >
      <el-table border :data="spuInfo.spuSaleAttrList" style="width: 100%">
        <el-table-column align="center" type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="saleAttrName" label="属性名" width="150">
        </el-table-column>
        <el-table-column prop="prop" label="属性值名称列表" width="width">
          <template v-slot="{ row, $index }">
            <el-tag
              @close="row.spuSaleAttrValueList.splice(index, 1)"
              style="margin: 0 5px"
              v-for="(saleAttrValue, index) in row.spuSaleAttrValueList"
              :key="saleAttrValue.id"
              closable
              :disable-transitions="false"
              >{{ saleAttrValue.saleAttrValueName }}</el-tag
            >
            <el-input
              v-model="row.saleAttrValueName"
              ref="saveTagInput"
              class="input-new-tag"
              size="small"
              v-if="row.isEdit"
              @keyup.enter.native="handleInputConfirm(row)"
              @blur="handleInputConfirm(row)"
            ></el-input>
            <el-button
              class="button-new-tag"
              size="small"
              v-else
              @click="showInput(row)"
              >添加</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="150">
          <template>
            <HintButton
              title="删除"
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="spuInfo.spuSaleAttrList.splice($index, 1)"
            ></HintButton>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item style="margin-top: 20px">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancle">取消</el-button>
      </el-form-item>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      saleAttrIdName: "",
      dialogImageUrl: "",
      dialogVisible: false,

      spuInfo: {
        category3Id: "",
        description: "",
        spuName: "",
        tmId: "",
        spuImageList: [], 
        spuSaleAttrList: []
      },
      SpuImage: [],
      baseSaleAttrList: [],
      trademarkList: [],
      category3Id:'',
    };
  },
  methods: {
    //删除图片成功回调
    handleRemove(file, fileList) {
      this.SpuImage = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //添加图片成功回调
    handleSuccess(response, file, fileList) {
      this.SpuImage = fileList;
    },

    //修改spu初始化数据
    async getInitUpdateSpuFormData(row,categoryId) {
      this.category3Id = categoryId;
      const re1 = await this.$API.spu.get(row.id);
      if (re1.code === 20000 || re1.code === 200) {
        this.spuInfo = re1.data;
        console.log("spuInfo", this.spuInfo);
      } else {
        this.$message.error("spuInfo获取失败");
      }

      const re2 = await this.$API.sku.getSpuImageList(row.id);
      if (re2.code === 20000 || re2.code === 200) {
        let SpuImage = re2.data;
        SpuImage.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
          console.log(item.url); 
        });
        this.SpuImage = SpuImage;
      } else {
        this.$message.error("SpuImage获取失败");
      }

      const re3 = await this.$API.spu.getSaleAttrList();
      if (re3.code === 20000 || re3.code === 200) {
        this.baseSaleAttrList = re3.data;
      } else {
        this.$message.error("baseSaleAttrList获取失败");
      }

      const re4 = await this.$API.trademark.getList();
      if (re4.code === 20000 || re4.code === 200) {
        this.trademarkList = re4.data;
        //console.log('trademarkList',this.trademarkList);
      } else {
        this.$message.error("trademarkList获取失败");
      }
    },

    //添加spu数据
    async getInitAddSpuFormData(categoryId) {
      this.category3Id = categoryId;
      const re4 = await this.$API.trademark.getList();
      if (re4.code === 20000 || re4.code === 200) {
        this.trademarkList = re4.data;
      } else {
        this.$message.error("trademarkList获取失败");
      }

      const re3 = await this.$API.spu.getSaleAttrList();
      if (re3.code === 20000 || re3.code === 200) {
        this.baseSaleAttrList = re3.data;
        console.log(this.baseSaleAttrList);
      } else {
        this.$message.error("baseSaleAttrList获取失败");
      }
    },

    //添加销售属性
    addSaleAttr() {
      let [baseSaleAttrId, saleAttrName] = this.saleAttrIdName.split(":");
      this.spuInfo.spuSaleAttrList.push({
        spuSaleAttrValueList: [],
        baseSaleAttrId,
        saleAttrName,
      });
      this.saleAttrIdName = "";
    },

    //添加销售属性值
    showInput(row) {
      this.$set(row, "isEdit", true);
      this.$set(row, "saleAttrValueName", "");
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    },

    //input回车和失去焦点时触发
    handleInputConfirm(row) {
      let { saleAttrValueName, baseSaleAttrId } = row;
      //判断输入是否为空
      if (saleAttrValueName.trim() === "") {
        row.saleAttrValueName = "";
        row.isEdit = false;
        return;
      }

      //判断属性名是否有重复
      let isRepeat = row.spuSaleAttrValueList.some((item) => {
        return item.saleAttrValueName === saleAttrValueName;
      });
      if (isRepeat) {
        this.$message.success("输入的属性名称不能重复！！！");
        row.saleAttrValueName = "";
        row.isEdit = false;
        return;
      }

      let obj = { saleAttrValueName, baseSaleAttrId };
      row.spuSaleAttrValueList.push(obj);
      row.saleAttrValueName = "";
      row.isEdit = false;
    },

    //整理数据
    settleDataList() {
      let { spuInfo, SpuImage , category3Id } = this;
      spuInfo.category3Id = category3Id;
      //整理图片数据
      spuInfo.spuImageList = SpuImage.map((item) => {
        return {
          imgName: item.name,
          imgUrl: item.imgUrl || item.response.data,
        };
      });

      //去除添加的销售属性
      spuInfo.spuSaleAttrList.forEach(item => {
        delete item.isEdit;
        delete item.saleAttrValueName;
      });
    },

    //点击保存
    async save(){
      //整理数据
      this.settleDataList();
      //获取数据
      let {spuInfo} = this;
      //发送请求
      try {
        console.log(spuInfo)
        const re = await this.$API.spu.addUpdate(spuInfo);
        if(re.code === 20000 || re.code === 200){
          this.$message.success('保存成功');
          this.$emit('update:visible', false);
          this.$emit('backSuccess',spuInfo.id);
          this.resetData();
        }else{
          this.$message.error('保存失败');
        }
      } catch (error) {
        this.$message.error('请求保存失败');
      }

    },

    //清除数据
    resetData(){
      Object.assign(this._data,this.$options.data());
    },

    //点击取消
    cancle(){
      this.$emit('update:visible', false);
      this.resetData();
    },
    
  },

  computed: {
    //计算销售属性
    unSelectedSaleAttrList() {
      return this.baseSaleAttrList.filter((item1) => {
        return this.spuInfo.spuSaleAttrList.every((item2) => {
          return item2.saleAttrName !== item1.name;
        });
      });
    },
  },



};
</script>

<style>
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>