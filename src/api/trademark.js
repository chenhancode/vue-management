import request from '@/utils/request';

export default {
  //获取分页列表
  getPageList(page, limit) {
    return request({
      url: `/admin/product/baseTrademark/${page}/${limit}`,
      method: 'get',
    })
  },

  //新增和修改数据
  addOrUpdate(trademark) {

    if (!trademark.id) {
      return request({
        url: "/admin/product/baseTrademark/save",
        method: 'post',
        data: trademark,
      })
    } else {
      return request({
        url: "/admin/product/baseTrademark/update",
        method: "put",
        data: trademark,
      })
    }
  },


  //删除数据
  remove(id) {
    return request({
      url: `/admin/product/baseTrademark/remove/${id}`,
      method: 'delete',
    })
  },

  //所有商品列表
  getList(){
    return request.get('/admin/product/baseTrademark/getTrademarkList')
  }

}
