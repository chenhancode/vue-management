import request from '@/utils/request';
export default {
  // GET /admin/product/getCategory1
  // 获取商品一级分类
  getCategory1() {
    return request({
      url: '/admin/product/getCategory1',
      method: 'get',
    })
  },



  // GET /admin/product/getCategory2/{category1Id}
  // 获取商品二级分类
  getCategory2(category1Id) {
    return request({
      url: `/admin/product/getCategory2/${category1Id}`,
      method: 'get',
    })
  },



  // GET /admin/product/getCategory3/{category2Id}
  // 获取商品三级分类
  getCategory3(category2Id){
    return request({
        url:`/admin/product/getCategory3/${category2Id}`,
        method: 'get',
    })
  },


}
