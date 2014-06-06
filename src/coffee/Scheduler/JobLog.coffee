Ext.define 'Scheduler.JobLog',

  extend: 'Ext.grid.Panel'

  title: 'Execution log'

  tbar:
    height: 40
    items: [
      fieldLabel: 'Status'
      xtype: 'combobox'
      store: ['All', 'Running', 'Success', 'Fail']
      editable: false
      value: 'All'
    ]

  columns: [
    header: 'Date'
    flex: 1
  ,
    header: 'Result'
    width: 150
  ]    