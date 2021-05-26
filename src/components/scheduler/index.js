// ignore IE

const src = name => `/static/dhtmlxScheduler/${name}.js`

async function loadScript(name) {
  await new Promise(resolve => {
    const script = document.createElement('script')
    script.type = 'text\/javascript'
    script.src = src(name)
    script.onload = resolve
    document.body.appendChild(script)
  })
}

/* global scheduler */
function locale() {
  const sr = scheduler

  sr.config.default_date = '%Y年%M月%d日'
  sr.config.day_date = '%M %d日 %D'
  sr.config.month_date = '%Y年%M月'

  sr.locale = {
    date: {
      month_full: [
        '一月',
        '二月',
        '三月',
        '四月',
        '五月',
        '六月',
        '七月',
        '八月',
        '九月',
        '十月',
        '十一月',
        '十二月'
      ],
      month_short: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      day_full: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      day_short: ['日', '一', '二', '三', '四', '五', '六']
    },
    labels: {
      dhx_cal_today_button: '今天',
      day_tab: '日',
      week_tab: '周',
      month_tab: '月',
      new_event: '新建日程',
      icon_save: '保存',
      icon_cancel: '关闭',
      icon_details: '详细',
      icon_edit: '编辑',
      icon_delete: '删除',
      confirm_closing: '请确认是否撤销修改!',
      confirm_deleting: '是否删除日程?',
      section_description: '描述',
      section_time: '时间范围',
      full_day: '整天',
      confirm_recurring: '请确认是否将日程设为重复模式?',
      section_recurring: '重复周期',
      button_recurring: '禁用',
      button_recurring_open: '启用',
      button_edit_series: '编辑系列',
      button_edit_occurrence: '编辑实例',
      agenda_tab: '议程',
      date: '日期',
      description: '说明',
      year_tab: '今年',
      week_agenda_tab: '议程',
      grid_tab: '电网',
      drag_to_create: '拖曳创建',
      drag_to_move: '拖曳移动',
      message_ok: '确定',
      message_cancel: '取消'
    }
  }

  return sr
}

export default async() => {
  return await loadScript('scheduler')
    .then(_ => loadScript('timeline'))
    .then(_ => loadScript('treetimeline'))
    .then(locale)
}

