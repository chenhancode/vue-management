import request from "@/utils/request";
export default {
    //GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
    //获取商品基本属性请求
    getList({category1Id,category2Id,category3Id}){
        return request({
            url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
            method:'get',
        })
    },



    //添加修改商品数据
    addOrUpdate(attr){
        return request({
            url:'/admin/product/saveAttrInfo',
            method:'post',
            data:attr
        })
    },


    //删除数据
    //DELETE /admin/product/deleteAttr/{attrId}
    removeList(attrId){
        return request({
            url:`/admin/product/deleteAttr/${attrId}`,
            method:'delete',
        })
    }
    



}
