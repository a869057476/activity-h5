/*
 * @Descripttion:
 * @version:
 * @Author: 小白
 * @Date: 2020-10-04 19:16:31
 * @LastEditors: 小白
 * @LastEditTime: 2022-02-16 22:43:05
 */
import { memo, useCallback, useState } from 'react';
// import LoadingView from '../../components/LoadingView';
import './index.less';
import {list} from './list';
import mainTitleImg from '@/assets/images/index/main-title.png';
import { Input, Button, Dialog } from 'antd-mobile'
import { DownFill } from 'antd-mobile-icons'

const arr = list.map(e => {
  e.value = ''
  e.status = false
  return e
})
const Home = () => {
  const [state, setstate] = useState(
    arr,
  );
  const handleClickRow = useCallback(
    (item) => {
      console.log(state)
      setstate(prevState => {
        prevState = prevState.map(e => {
          if (e.id === item.id) {
            e.status = true
          }
          return e
        })
        return prevState
      })
    },
    [state],
  );
  const handleInputRow = useCallback(
    (value, item) => {
      console.log(state)
      setstate(prevState => {
        prevState = prevState.map(e => {
          if (e.id === item.id) {
            e.status = false
            e.value = value
          }
          return e
        })
        return prevState
      })
    },
    [state],
  );
  const handleClearRow = useCallback(
    (item) => {
      console.log(state)
      setstate(prevState => {
        prevState = prevState.map(e => {
          if (e.id === item.id) {
            e.value = ''
          }
          return e
        })
        return prevState
      })
    },
    [state],
  );
  return (
    <div className="bg">
      <div className="main-wrap">
        <img className="title" src={mainTitleImg} alt="mainTitleImg" />
        <div className='body'>
          <div className='type-wrap'>
            选择令牌类型
            <Button 
              fill='outline' 
              size="small" 
              shape='rounded'
            >
              行者令<DownFill />
            </Button>
          </div>
          <div className='table-wrap'>
            <table cellPadding={0} cellSpacing={0}>
              <thead>
                <tr>
                  <th className='name'>名称</th>
                  <th className='hash'>/hash值</th>
                  <th className='status'>状态</th>
                  <th className='search'>查询</th>
                </tr>
              </thead>
              <tbody>
                {arr?.map((item, index) => (
                  <tr key={item.id}>
                    <td className='name'>{item.name}</td>
                    <td className='hash'>
                      <Input 
                        placeholder='请输入哈希令' 
                        value={item.value} 
                        clearable
                        onChange={(value) => {
                          handleInputRow(value, item);
                        }}
                        onClear={() => {
                          handleClearRow(item);
                        }}
                      />
                    </td>
                    <td className='status'>{item.status ? '已兑换' : '未兑换'}</td>
                    <td className='search'>
                      <Button 
                        onClick={() => {
                          handleClickRow(item);
                        }}
                        className='search' 
                        disabled={item.value === ''} 
                        size="mini" 
                        shape='rounded' 
                        color='primary'
                      >
                        查询
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> 
      </div> 
      <div className='btn-wrap'>
        <Button block shape='rounded' color='primary' className='one'>
          立即兑换
        </Button> 
        <Button 
          block 
          shape='rounded' 
          color='primary' 
          className='two'
          onClick={() => {
            Dialog.confirm({
              title: '资产查询',
              content: (
                <>
                  <div>请用手机拍摄手持工牌照，注意保持照片清晰</div>
                  <div>
                    详情说明请查阅<a>操作指引</a>
                  </div>
                </>
              )
            })
          }}
        >
          资产查询
        </Button> 
      </div>
      <div className='rule-wrap'>
        <h3>活动规则</h3>
        <div>1、集齐兑换，以指定藏品，每9个作品为一期，以天干计数，首期为甲，次期为乙，以及类推。</div>
        <div>2、发行数量当期9个作品中，已售份数最少的藏品为准，每一份藏品仅可组合一次。</div>
        <div>3、任务类：限量1000份，结合日常平台任务和要求发放。</div>
      </div>
    </div>
  );
};
export default memo(Home);
