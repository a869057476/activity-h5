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
import activityApi from "@/api/activity_api";
import {list} from './list';
import mainTitleImg from '@/assets/images/index/main-title.png';
import { Input, Button, Modal, Toast, Picker } from 'antd-mobile'
import { DownFill } from 'antd-mobile-icons'

const typeList = [
  [
    { 
      label: '甲·行者令', 
      value: '甲·行者令' 
    }
  ],
]
const arr = list.map(e => {
  const obj = {
    ...e,
    value: '',
    status: ''
  }
  return obj
})
const Home = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const userId = queryParams.get('userId');
  console.log('userId', userId)
  const [state, setstate] = useState(
    arr,
  );
  const [modalValue, setValue] = useState('')
  const [modalVisible, setVisible] = useState(false)
  const [result, setResult] = useState('')

  const [typeVisible, setTypeVisible] = useState(false)
  const [typeValue, setTypeValue] = useState<(string | null)[]>(['甲·行者令'])
  // 单行查询
  const handleClickRow = useCallback(
    (item) => {
      const params = {
        mhash: item.id,
        userId: userId,
        zhash: item.value
      }
      activityApi.queryTokens(params).then((res: any) => {
        console.log('queryTokens', res)
        setstate(prevState => {
          prevState = prevState.map(e => {
            if (e.id === item.id) {
              e.status = res.error ? '' : res?.result
            }
            return e
          })
          return prevState
        })
      })
    },
    [userId],
  );
  const handleInputRow = useCallback(
    (value, item) => {
      console.log(state)
      setstate(prevState => {
        prevState = prevState.map(e => {
          if (e.id === item.id) {
            e.status = ''
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
            e.status = ''
            e.value = ''
          }
          return e
        })
        return prevState
      })
    },
    [state],
  );
  // 资产查询
  const handleSearchResult = useCallback(
    () => {
      const params = {
        zhash: modalValue
      }
      activityApi.exchange(params).then((res: any) => {
        console.log('exchange', res)
        setResult(res?.result)
      })
    },
    [modalValue],
  );
  // 立即兑换
  const handleExchange = useCallback(
    () => {
      const arr = JSON.parse(JSON.stringify(state)).map((item: { id: any; value: any; status: any }) => {
        const obj = {
          mhash: item.id,
          zhash: item.value
        }
        console.log('status start log', item.status, 'status end log')
        return obj
      })
      const params = {
        list: arr,
        name: '甲·行者令',
        userId: userId
      }
      activityApi.redeemTokens(params).then((res: any) => {
        console.log('redeemTokens', res)
        if (res?.result) {
          Toast.show({
            icon: 'success',
            content: res?.description,
          })
        } else {
          Toast.show({
            icon: 'fail',
            content: res?.description,
          })
        }
      })
    },
    [state, userId],
  );
  console.log('init')
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
              onClick={() => {
                setTypeVisible(true);
              }}
            >
              甲·行者令<DownFill />
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
                    <td className='status'>{item.status === '' ? '' : (item.status ? '未兑换' : '已兑换')}</td>
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
        <Button 
          block 
          shape='rounded' 
          color='primary' 
          className='one'
          onClick={() => {
            handleExchange()
          }}
        >
          立即兑换
        </Button> 
        <Button 
          block 
          shape='rounded' 
          color='primary' 
          className='two'
          onClick={() => {
            setValue('')
            setResult('')
            setVisible(true)
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
      <Modal
        visible={modalVisible}
        title="资产查询"
        bodyClassName="my-modal"
        destroyOnClose
        showCloseButton
        closeOnAction
        onClose={() => {
          setVisible(false)
        }}
        actions={[
          {
            key: 'cancel',
            text: '取消',
          },
        ]}
        content={(
          <>
            <div className='assets-search'>
              <Input 
                placeholder='请输入您要查询的ID'
                value={modalValue} 
                clearable
                onChange={(value) => {
                  setValue(value)
                  setResult('')
                }}
                onClear={() => {
                  setValue('');
                  setResult('')
                }}
              />
              <Button 
                shape='rounded' 
                color='primary' 
                className='search'
                disabled={modalValue === ''} 
                size="mini"
                onClick={() => {
                  handleSearchResult();
                }}
                >
                查询
              </Button> 
            </div>
            <div className='tip'>
              {result === '' ? '' : `-该资产${result ? '未兑换' : '已兑换'}-`}
            </div>
          </>
        )}
      />
      <Picker
        columns={typeList}
        visible={typeVisible}
        onClose={() => {
          setTypeVisible(false)
        }}
        value={typeValue}
        onConfirm={v => {
          setTypeValue(v)
          setTypeVisible(false)
        }}
      />
    </div>
  );
};
export default memo(Home);
