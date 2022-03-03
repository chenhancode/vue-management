<template>
  <div>
      <el-form label-width="100px">
         <el-form-item label="SPU名称">
             SPU名称
         </el-form-item> 
         <el-form-item label="SKU名称">
             <el-input placeholder="SKU名称">

             </el-input>
         </el-form-item>
         <el-form-item label="价格(元)">
             <el-input placeholder="价格(元)">
                 
             </el-input>
         </el-form-item>
         <el-form-item label="重量(千克)">
             <el-input placeholder="重量(千克)">
                 
             </el-input>
         </el-form-item>
         <el-form-item label="规格描述">
             <el-input type="textarea" rows="4" placeholder="规格描述">
                 
             </el-input>
         </el-form-item>
         <el-form-item label="平台属性">
             <el-form label-width="100px">
                 <el-form-item label="label">
                     <el-select v-model="model" placeholder="请选择">
                         <el-option label="label" value="value"></el-option>
                     </el-select>
                 </el-form-item>
             </el-form>
         </el-form-item>
         <el-form-item label="销售属性">
             <el-form label-width="100px">
                 <el-form-item label="label">
                     <el-select v-model="model" placeholder="请选择">
                         <el-option label="label" value="value"></el-option>
                     </el-select>
                 </el-form-item>
             </el-form>
         </el-form-item>
         <el-form-item label="图片列表">
             <el-table
                border
                 :data="data"
                 style="width: 100%">
                 <el-table-column
                     type="selection"
                     align="center"
                     label="label"
                     width="55">
                 </el-table-column>
                 <el-table-column
                     prop="prop"
                     label="图片"
                     width="width">
                 </el-table-column>
                 <el-table-column
                     prop="prop"
                     label="名称"
                     width="width">
                 </el-table-column>
                 <el-table-column
                     prop="prop"
                     label="操作"
                     width="width">
                 </el-table-column>
             </el-table>
         </el-form-item>
         <el-form-item>
             <el-button type="primary">保存</el-button>
             <el-button>取消</el-button>
         </el-form-item>
      </el-form>
  </div>
</template>

<script>
export default {
    name:'Sku',
    methods:{
        //获取初始化数据
        getInitUpdateSpuFormData(){

        },
    }

}
</script>

<style>

</style>