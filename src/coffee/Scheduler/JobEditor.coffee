Ext.define 'Scheduler.JobEditor',

  extend: 'Ext.panel.Panel'
  layout: 
    type: "hbox"
    pack: "start"
    align: "stretch"

  bbar:[
    text: 'Go to Job List'
    handler: -> Cti.launch 'Scheduler.JobList'
    '-'
    text: 'Save configuration'
    handler: -> @up('panel').save()
    '-'
    text: 'Delete this job'
    handler: -> @up('panel').delete()
  ]

  token:'job/:id_job'

  save: -> 
    Cti.launch 'Scheduler.JobList'

  delete: ->
    Ext.Msg.confirm 'Confirm', 'Are you sure to delete this job?', (btn) =>
      Scheduler.deleteJob(@id_job, => Cti.launch 'Scheduler.JobList' if btn is 'yes')

  initComponent:->
    @title = 'Job #' + @id_job

    # unless @job.get 'class'

    #   leftSide = 
    #     width: 400
    #     border: false
    #     layout: 
    #       type: "vbox"
    #       pack: "start"
    #       align: "stretch"
    #     items:[
    #       Ext.create 'Scheduler.CommandList', 
    #         title: @job.get 'name'
    #         border: false
    #         flex: 1
    #     ,
    #       Ext.create 'Scheduler.ScheduleEditor', 
    #         border: false
    #         flex: 1
    #     ]

    @items = [
      Ext.create 'Scheduler.ExecutionLog', 
        flex: 1
        border:false
        style: borderLeft:'1px solid silver'
    ]

    @callParent arguments