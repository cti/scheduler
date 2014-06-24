Ext.define 'Scheduler.Monitor',

  extend: 'Ext.panel.Panel'
  title: 'Monitoring'

  bodyPadding: 10
  html: 'List of tasks: 10 last + current + 10 next'

  token: 'monitor'

  bbar:[
    text: 'Go to Job List'
    handler: -> Cti.launch 'Scheduler.JobList'
  ]