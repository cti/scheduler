Ext.define 'Scheduler.JobEditor',

  extend: 'Ext.panel.Panel'
  border:false
  layout: 
    type: "hbox"
    pack: "start"
    align: "stretch"

  bbar:[
    text: 'Go to Job List'
    handler: -> @up('panel').goBack()
    '-'    
    text: 'Save configuration'
    handler: -> @up('panel').save()
    '-'    
    text: 'Delete this job'
    handler: -> @up('panel').delete()
  ]

  save: -> 
    @goBack()

  delete: ->
    Ext.Msg.confirm 'Confirm', 'Are you sure to delete this job?', (btn) =>
      Scheduler.deleteJob(@job.get('id_job'), => @goBack()) if btn is 'yes' 

  initComponent:->

    @items = [
      width: 400
      border: false
      layout: 
        type: "vbox"
        pack: "start"
        align: "stretch"
      items:[
        Ext.create 'Scheduler.CommandList', flex:1
      ,
        Ext.create 'Scheduler.JobSchedule', flex: 1
      ]
    ,
      Ext.create 'Scheduler.JobLog', flex: 1
    ]

    @callParent arguments