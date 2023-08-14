const payTypes = [
  [
    { label: '支付宝', value: 0 },
    { label: '微信', value: 1 },
    { label: '银行卡', value: 2 },
    { label: '白条/花呗', value: 3 }
  ]
];
const billTypes = [
  [
    { label: '支出', value: 1 },
    { label: '收入', value: 0 }
  ]
];

const recordList = [
  {
    title: '账单类型',
    type: 'select',
    bindValue: 'billType'
  },
  {
    title: '支付方式',
    type: 'select',
    bindValue: 'payType'
  },
  {
    title: '金额',
    type: 'input',
    bindValue: 'amount'
  },
  {
    title: '备注信息',
    type: 'input',
    bindValue: 'remark'
  }
];

export {
  payTypes,
  billTypes,
  recordList
};
