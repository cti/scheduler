Ext.define 'Scheduler.JobList',

  title: 'Job list'
  extend: 'Ext.grid.Panel'

  columns: [
      header: 'Name'
      dataIndex: 'name'
      flex: 1
    ,
      header: 'Status'
      dataIndex: 'status'
      width: 120
      renderer: (v) -> 
        map = A: 'Active', N: 'New', X: 'Canceled'
        map[v] or 'Unknown'
    ,
      header: 'Last run'
      dataIndex: 'last'
      width: 150
    ,
      header: 'Next run'
      dataIndex: 'next'
      width: 150
    ,
      header: 'Schedule'
      dataIndex: 'schedule'
      width: 120
    ]

  store: 
    fields: ['name', 'status', 'last', 'next']

  initComponent: ->

    @updateList()
    @callParent arguments
    @on 'itemclick', => 
      @setContent Ext.create 'Scheduler.JobEditor',
        job: @getSelectionModel().getSelection()[0]
        goBack: => @setContent Ext.create 'Scheduler.JobList', setContent: @setContent
      
  updateList:->
    Scheduler.getJobList (response) => @store.loadData response.data

  bbar: [
    text:'Monitoring'
    handler: ->
      grid = @up('grid')
      grid.setContent Ext.create 'Scheduler.Monitor',
        job: grid.getSelectionModel().getSelection()[0]
        goBack: => grid.setContent Ext.create 'Scheduler.JobList', setContent: grid.setContent
    '-'
    text: 'Create new job'
    handler: -> 
      grid = @up('grid')
      win = Ext.create 'Ext.Window',
        title: 'Create new Job'
        modal: true
        items: [
          Ext.create 'Ext.form.Panel',
            monitorValid: true
            padding: 10
            border: false
            items:
              xtype: 'textfield'
              fieldLabel: 'Name'
              allowBlank: false
              name: 'name'
            bbar: [
              text: 'Cancel'
              handler: -> win.close()
              '->'
              text: 'Add'
              formBind: true
              handler:-> Scheduler.createNew @up('form').getValues().name, ->
                win.close()
                grid.updateList()
            ]
        ]
      win.show()
  ]

