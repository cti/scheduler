Ext.define 'Scheduler.JobEditor',

  extend: 'Ext.panel.Panel'
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

    unless @job.get 'class'

      leftSide = 
        width: 400
        border: false
        layout: 
          type: "vbox"
          pack: "start"
          align: "stretch"
        items:[
          Ext.create 'Scheduler.CommandList', 
            title: @job.get 'name'
            border: false
            flex: 1
        ,
          Ext.create 'Scheduler.ScheduleEditor', 
            border: false
            flex: 1
        ]

    @items = [
      leftSide
    ,
      Ext.create 'Scheduler.ExecutionLog', 
        flex: 1
        border:false
        style: borderLeft:'1px solid silver'
    ]

    @callParent arguments