import axios from 'axios'
import { Toast } from 'antd-mobile'

// create an axios instance
const service = axios.create({
  baseURL: '', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// response interceptor
service.interceptors.response.use(
  (response: any) => {
		console.log('response', response)
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res?.errorCode !== 200) {
			Toast.show({
				icon: 'fail',
				content: res.message || 'Error',
			})

      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      if (res?.data?.error){
        Toast.show({
          icon: 'fail',
          content: res?.data?.description || 'Error',
        })
  
        return Promise.reject(new Error(res?.data?.description || 'Error'))
      }
      return res?.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Toast.show({
			icon: 'fail',
			content: error.message,
		})
    return Promise.reject(error)
  }
)

export default service