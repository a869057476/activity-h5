/*
 * @Descripttion:
 * @version:
 * @Author: 小白
 * @Date: 2020-10-04 19:16:31
 * @LastEditors: 小白
 * @LastEditTime: 2022-02-16 22:43:05
 */
import { memo, useCallback, useState, useEffect } from 'react';
// import LoadingView from '../../components/LoadingView';
import './index.less';
import activityApi from "@/api/activity_api";
import mainTitleImg from '@/assets/images/index/main-title.png';
import { Input, Button, Modal, Toast, Picker } from 'antd-mobile'
import { DownFill } from 'antd-mobile-icons'

interface IState {
  zpname: string;
  value: string;
  mhash: string;
  status: string | boolean;
}
// const firstTypeList = [
//   { 
//     label: '甲·行者令', 
//     value: '甲·行者令' 
//   },
//   { 
//     label: '乙·行者令', 
//     value: '乙·行者令' 
//   }
// ]
// const typeList = [
//   firstTypeList
// ]
const tempTypeValue = window.localStorage.getItem('tempTypeValue') || ''
const Home = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const userId = queryParams.get('userId');
  console.log('userId', userId)

  const [loading, setLoading] = useState(true)
  const [state, setstate] = useState<IState[]>([]);
  const [modalValue, setValue] = useState('')
  const [modalVisible, setVisible] = useState(false)
  const [result, setResult] = useState('')

  const [typeVisible, setTypeVisible] = useState(false)
  const [typeValue, setTypeValue] = useState<(string | null)[]>([])
  const [typeList, setTypeList] = useState([[]])

  // 缓存用户输入的子hash和查询的状态
  useEffect(() => {
    console.log(111)
    if (!loading) {
      console.log(111222)
      const tempState = JSON.parse(window.localStorage.getItem('tempState') || '[]')
      const tempStateCopy = JSON.parse(JSON.stringify(tempState))
      state.forEach(e => {
        const findIndex = tempStateCopy.findIndex((t: { mhash: string; }) => t.mhash === e.mhash)
        if (findIndex > -1) {
          tempStateCopy[findIndex].value = e.value
          tempStateCopy[findIndex].status = e.status
        } else {
          tempStateCopy.push(e)
        }
      })
      window.localStorage.setItem('tempState', JSON.stringify(tempStateCopy))
    }
  }, [state, loading]);

  // 缓存选择的令牌类型
  useEffect(() => {
    console.log(222)
    window.localStorage.setItem('tempTypeValue', typeValue.toString())
  }, [typeValue]);

  // 请求列表数据并加载缓存
  useEffect(() => {
    console.log(333)
    const tempState = JSON.parse(window.localStorage.getItem('tempState') || '[]')
    const getList = () => {
      const params = {
        name: typeValue.toString()
      }
      activityApi.queryZpnameAndMhash(params).then((res: any) => {
        setstate(prevState => {
          prevState = res.map((e: any) => {
            const obj = {
              ...e,
              value: '',
              status: ''
            }
            const node = tempState.find((item: { mhash: any; }) => item.mhash === e.mhash)
            if (node) {
              obj.value = node.value
              obj.status = node.status
            }
            return obj
          })
          return prevState
        })
        setLoading(false)
      })
    };
    if (typeValue.length > 0) {
      getList();
    }
  }, [typeValue]);

  // 获取令牌类型
  useEffect(() => {
    console.log(444)
    const getList = () => {
      activityApi.queryTokenName().then((res: any) => {
        // res = [...res, '333']
        setTypeList([res])
        const tempTypeValueNode = res.find((e: string) => e === tempTypeValue)
        const defaultValue: string = tempTypeValueNode ? tempTypeValue : res[0]
        setTypeValue([defaultValue])
      })
    };
    getList();
  }, []);

  // 单行查询
  const handleClickRow = useCallback(
    (item) => {
      const params = {
        mhash: item.mhash,
        userId: userId,
        zhash: item.value
      }
      activityApi.queryTokens(params).then((res: any) => {
        setstate(prevState => {
          prevState = prevState.map(e => {
            if (e.mhash === item.mhash) {
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
      setstate(prevState => {
        prevState = prevState.map(e => {
          if (e.mhash === item.mhash) {
            e.status = ''
            e.value = value
          }
          return e
        })
        return prevState
      })
    },
    [],
  );
  const handleClearRow = useCallback(
    (item) => {
      setstate(prevState => {
        prevState = prevState.map(e => {
          if (e.mhash === item.mhash) {
            e.status = ''
            e.value = ''
          }
          return e
        })
        return prevState
      })
    },
    [],
  );
  // 资产查询
  const handleSearchResult = useCallback(
    () => {
      const params = {
        zhash: modalValue
      }
      activityApi.exchange(params).then((res: any) => {
        setResult(res?.result)
      })
    },
    [modalValue],
  );
  // 立即兑换
  const handleExchange = useCallback(
    () => {
      const arr = JSON.parse(JSON.stringify(state)).map((item: { mhash: any; value: any; status: any }) => {
        const obj = {
          mhash: item.mhash,
          zhash: item.value
        }
        return obj
      })
      const params = {
        list: arr,
        name: '甲·行者令',
        userId: userId
      }
      activityApi.redeemTokens(params).then((res: any) => {
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
              {typeValue.toString()}<DownFill />
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
                {state?.map((item, index) => (
                  <tr key={item.mhash}>
                    <td className='name'>{item.zpname}</td>
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
