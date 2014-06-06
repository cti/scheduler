Ext.define 'Scheduler.Application',

  extend: 'Ext.Viewport'
  layout: 'border'

  initComponent: ->

    @items = [
      container = Ext.create 'Ext.panel.Panel',
        region: 'center'
        layout: 'fit'
        border: false
        items: [
          Ext.create 'Scheduler.JobList',
            region: 'center'
            setContent: (content) => 
              container.removeAll()
              container.add content
              container.doLayout()
        ]
    ]

    @callParent arguments