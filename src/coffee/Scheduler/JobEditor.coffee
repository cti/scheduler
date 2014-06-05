Ext.define 'Scheduler.JobEditor',
  extend:'Ext.panel.Panel'
  html:'zzz'
  tools:[
    id:'back'
    handler: ->
      @up('panel').goBack()
  ]

  initComponent:->
  	
  	@title = @job.get 'name'

  	@callParent arguments

