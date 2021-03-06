<script>
import Scheduler from '@/components/scheduler'

export default {
  props: {
    // scheduler config
    readonly: Boolean,
    editOnCreate: Boolean,
    xmlDate: {
      type: String,
      default: '%Y-%m-%d %H:%i'
    },
    markNow: Boolean,
    dragMove: Boolean,
    dblclickCreate: Boolean,
    // scheduler style
    height: {
      type: String,
      default: '600px'
    },
    navline: {
      type: Boolean,
      default: true
    },
    now: Date,
    // timeline config
    dx: {
      type: Number,
      default: 120
    },
    render: {
      type: String,
      default: 'bar',
      validator(val) {
        return ['bar', 'tree'].indexOf(val) !== -1
      }
    },
    units: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      scheduler: null,
      defaultConfig: {
        name:	'timeline',
        x_unit:	'minute',
        x_date:	'%i',
        x_start: 14,
        x_step:	30,
        x_size: 32,
        // dx: 120,
        // y_unit: this.units,
        y_property:	'section_id',
        event_dy: 'full',
        // render: 'bar',
        second_scale: {
          x_unit: 'hour',
          x_date: '%G点'
        },
        section_autoheight: false,
        folder_dy: 40, // Only valid for tree
        dy: 40
      }
    }
  },
  computed: {
    schedulerCfg() {
      const {
        readonly,
        editOnCreate: edit_on_create,
        xmlDate: xml_date,
        markNow: mark_now,
        dragMove: drag_move,
        dblclickCreate: dblclick_create
      } = this.$props
      return {
        readonly,
        edit_on_create,
        xml_date,
        mark_now,
        drag_move,
        dblclick_create
      }
    },
    timelineCfg() {
      const { dx, render, units: y_unit } = this.$props
      return Object.assign({}, this.defaultConfig, { dx, render, y_unit })
    }
  },
  mounted() {
    Scheduler().then(this.init).then(() => this.$emit('complete'))
  },
  methods: {
    init(scheduler) {
      this.scheduler = scheduler

      Object.assign(this.scheduler._click, {
        // dhtmlxscheduler.js line: 2189-2200
        dhx_cal_prev_button: () => this.handleButtonClick(-1),
        dhx_cal_next_button: () => this.handleButtonClick(1),
        dhx_cal_today_button: () => this.handleButtonClick()
      })

      const d2s = this.scheduler.date.date_to_str('%H:%i')
      Object.assign(this.scheduler.templates, {
        tooltip_text: (start, end, event) => `<b>${event.text}</b>`, // tooltip.js
        event_bar_text: (start, end, event) => {
          const { drag_id } = this.scheduler.getState()
          if (drag_id === event.id) {
            const sm = start.getMinutes()
            sm > 0 && sm < 30 && start.setMinutes(0)
            sm > 30 && sm < 60 && start.setMinutes(30)

            const em = end.getMinutes()
            em > 0 && em < 30 && end.setMinutes(30)
            em > 30 && em < 60 && end.setMinutes(60)

            event.text = `${d2s(start)}-${d2s(end)}`
          }

          return event.text
        }
      })
      Object.assign(this.scheduler.config, this.schedulerCfg)

      // const dd = this.scheduler.config.default_date
      // this.scheduler.config.default_date = `${dd}<span id='dhx_cal_date_icon'></span>`

      this.scheduler.showLightbox = () => {}
      !this.navline && (this.scheduler.xy.nav_height = 5)

      this.scheduler.createTimelineView(this.timelineCfg)
      this.scheduler.init(this.$refs.scheduler, this.now, 'timeline')

      this.handleDatePicker()
      // this.handleDateIcon()
      this.handleMarked()
    },
    async handleDatePicker() {
      const vue = await import('vue').then(({ default: v }) => v)
      const DatePicker = vue.extend({
        render(c) {
          return c('el-date-picker', {
            style: {
              top: 0
            },
            attrs: {
              // type: 'date',
              size: 'mini'
            }
          })
        }
      })
      const tmp = document.createElement('div')
      document.getElementById('dhx_cal_date').appendChild(tmp)
      new DatePicker({ el: tmp })
    },
    // @Deprecated
    handleDateIcon() {
      // <i class='el-icon-date' />
      const icon = document.createElement('i')
      icon.className = 'el-icon-date'
      const styles = icon.style
      styles.marginLeft = '5px'
      styles.fontSize = '22px'
      styles.fontWeight = 600
      styles.cursor = 'pointer'
      icon.onclick = this.handleDate
      document.getElementById('dhx_cal_date_icon').appendChild(icon)
    },
    handleDate() {
      console.debug('handleDate....')
    },
    handleButtonClick(step) {
      let newDate = this.now
      if (step) {
        const { date } = this.scheduler.getState()
        newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + step)
      }
      this.scheduler.setCurrentView(newDate)

      this.handleMarked()
    },
    handleMarked() {
      // clear...
      /*
        1.getEventsByDate
        2.getEventsByRoomIdAndDates
      */
      /* const { date } = this.scheduler.getState()
      const [y, m, d] = [date.getFullYear(), date.getMonth(), date.getDate()]
      this.scheduler.addMarkedTimespan({
        start_date: new Date(y, m, d, 12),
        end_date: new Date(y, m, d, 14),
        type: 'dhx_time_block',
        // css: 'doing',
        sections: { timeline: ['room-4', 'room-5', 'room-8', 'room-13'] }
      })
      this.scheduler.updateView() */
    },
    getEvents() {
      const events = this.scheduler.getEvents()
      const d2s = this.scheduler.date.date_to_str('%H:%i')

      return events.map(e => {
        const { section_id: id, start_date: sd, end_date: ed } = e
        return { start: `${id} ${d2s(sd)}`, end: `${id} ${d2s(ed)}` }
      }).sort((a, b) => new Date(a.start) - new Date(b.start))
    }
  },
  render(h) {
    const tag = 'div'

    const navs = this.navline ? [
      h(tag, { class: 'dhx_cal_prev_button' }),
      h(tag, { class: 'dhx_cal_next_button' }),
      h(tag, { class: 'dhx_cal_today_button' }),
      h(tag, { attrs: { id: 'dhx_cal_date' }, class: 'dhx_cal_date' })
    ] : [h(tag, { class: 'dhx_cal_date', style: { display: 'none' }})]

    return h(tag, {
      ref: 'scheduler',
      class: 'dhx_cal_container',
      style: {
        height: this.height
      }
    }, [
      h(tag, { class: 'dhx_cal_navline' }, navs),
      h(tag, { class: 'dhx_cal_header' }),
      h(tag, { class: 'dhx_cal_data' })
    ])
  }
}
</script>
<style scoped>
@import '/static/dhtmlxScheduler/scheduler.css';

.dhx_cal_container {
  width: 100%;
  /* border: 1px solid red; */
}
::v-deep .dhx_cal_event_line {
  text-align: center;
  font-size: 18px;
  line-height: 36px;
}
.doing {
  background-color: red;
  opacity: 0.5;
}
</style>
