import request from '@/utils/request'

// 通过令牌查询包含的作品名称和mhash
export function queryZpnameAndMhash(data) {
	return request({
		url: '/api/h5/assets/queryZpnameAndMhash',
		method: 'post',
		data
	})
}

// 获取兑换信息
export function exchange(data) {
  return request({
    url: '/api/h5/assets/exchange',
    method: 'post',
    data
  })
}

// 查询令牌是否可以兑换
export function queryTokens(data) {
	return request({
		url: '/api/h5/assets/queryTokens',
		method: 'post',
		data
	})
}

// 兑换令牌
export function redeemTokens(data) {
	return request({
		url: '/api/h5/assets/redeemTokens',
		method: 'post',
		data
	})
}

export default {
	queryZpnameAndMhash,
	exchange,
	queryTokens,
	redeemTokens
}

