Ext.define 'Scheduler.ScheduleEditor',

  extend: 'Ext.form.Panel'

  title: 'Schedule'
  bodyPadding: 10

  defaults: 
    xtype: 'combobox'
    editable: false
    
  items:[
    value: 0
    store: (x for x in [0 .. 12])
    fieldLabel: 'Month'
    name: 'month'
  ,
    value: 0
    store: (x for x in [0 .. 7])
    fieldLabel: 'Week'
    name: 'week_day'
  ,
    value: 0
    store: (x for x in [0 .. 31])
    fieldLabel: 'Day'
    name: 'day'
  ,
    value: 0
    store: (x for x in [0 .. 24])
    fieldLabel: 'Hour'
    name: 'hour'
  ,
    value: 0
    store: (x for x in [0 .. 59] by 10)
    fieldLabel: 'Minute'
    name: 'minute'
  ,
    value: 0
    store: [0, 30]
    fieldLabel: 'Second'
    name: 'second'
  ]