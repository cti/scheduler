Ext.define 'Scheduler.Monitor',

  extend: 'Ext.panel.Panel'
  title:'Monitoring'

  bodyPadding:10
  html:'List of tasks: 10 last + current + 10 next'

  bbar:[
    text:'Go to Job List'
    handler: -> @up('panel').goBack()
  ]