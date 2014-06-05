Ext.define 'Scheduler.JobList',

  title:'Job list'
  extend: 'Ext.grid.Panel'

  tools: [
    id:'plus'
    handler: -> @up('grid').createNew()
  ,
    id:'search'
    hidden: true
    handler: -> @up('grid').editJob()
  ,
    id:'minus'
    hidden: true
    handler: -> @up('grid').deleteSelected()
  ]

  columns: [
      header:'Name'
      dataIndex:'name'
      flex:1
    ,
      header:'Status'
      dataIndex:'status'
      width:120
      renderer: (v) -> 'Active' if v is 'A'
    ,
      header:'Last run'
      dataIndex:'last'
      width:150
    ,
      header:'Next run'
      dataIndex:'next'
      width:150
    ,
      header:'Schedule'
      dataIndex:'schedule'
      width:120
    ]

  store: 
    fields:['name', 'status', 'last', 'next']

  initComponent: ->

    @updateList()
    @callParent arguments

    @on 'itemdblclick', => @editJob()
    @on 'selectionchange' , (sm, sel) =>
      if sel.length is 0
        @down('[id=search]').hide()
        @down('[id=minus]').hide()
      else
        @down('[id=search]').show()
        @down('[id=minus]').show()

  editJob: ->
    @setContent Ext.create 'Scheduler.JobEditor',
      job: @selectedJob()
      goBack: => @setContent Ext.create 'Scheduler.JobList', setContent: @setContent
      
  updateList:->
    Scheduler.getJobList (response) => @store.loadData response.data

  createNew: ->
    grid = @
    win = Ext.create 'Ext.Window',
      title:'Create new Job'
      modal:true
      items:[
        Ext.create 'Ext.form.Panel',
        monitorValid:true
        padding:10
        border:false
        items:
          xtype:'textfield'
          fieldLabel:'Name'
          allowBlank:false
          name:'name'
        bbar:[
          text:'Cancel'
          handler: -> win.close()
          '->'
          text:'Add'
          formBind:true
          handler:-> Scheduler.createNew @up('form').getValues().name, ->
            win.close()
            grid.updateList()
        ]
      ]
    win.show()

  selectedJob: -> @getSelectionModel().getSelection()[0]

  deleteSelected: ->
    Scheduler.deleteJob @selectedJob().get('id_job'), => @updateList()
