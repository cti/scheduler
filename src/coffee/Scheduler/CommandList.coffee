Ext.define 'Scheduler.CommandList',

  extend: 'Ext.grid.Panel'
  title: 'Commands'
  
  initComponent: ->
    @plugins = [Ext.create 'Ext.grid.plugin.CellEditing', clicksToEdit: 1]
    @callParent arguments

  store: 
    sorters: [
      property: 'priority'
      direction: 'ASC'
    ]
    fields: [
      'command'
      name: 'priority'
      type: 'integer'
    ]

  columns: [
    header: 'Command'
    editor: 'textfield'
    dataIndex:'command'
    sortable:false
    flex:1
  ]

  listeners: selectionchange: (sm, sel) -> 
    grid = sm.view.grid
    selectionIsEmpty = !sel.length
    grid.down('[text=Move up]').setDisabled selectionIsEmpty
    grid.down('[text=Move down]').setDisabled selectionIsEmpty
    grid.down('[text=Remove selected]').setDisabled selectionIsEmpty

    unless selectionIsEmpty
      selected = grid.getSelected()
      grid.down('[text=Move up]').setDisabled selected.get('priority') == 1
      grid.down('[text=Move down]').setDisabled selected.get('priority') == selected.store.data.length

  getSelected: ->
    sel = @getSelectionModel().getSelection()
    sel[0] if sel.length is 1

  tbar:
    height: 40
    items: [
      text: 'Add new'
      handler: -> 
        store = @up('grid').getStore()
        rec = priority: store.getCount() + 1
        store.add rec
    ,
      text: 'Move up'
      disabled: true
      handler: ->
        selected = @up('grid').getSelected()
        previous = selected.store.findRecord 'priority', selected.get('priority') - 1
        previous.set 'priority', selected.get('priority')
        selected.set 'priority', selected.get('priority') - 1
        @up('grid').getSelectionModel().select selected
    ,
      text: 'Move down'
      disabled: true
      handler: ->
        selected = @up('grid').getSelected()
        next = selected.store.findRecord 'priority', selected.get('priority') + 1
        next.set 'priority', selected.get('priority')
        selected.set 'priority', selected.get('priority') + 1
        @up('grid').getSelectionModel().select selected
    ,
      text: 'Remove selected'
      disabled: true
      handler: ->
        selected = @up('grid').getSelected()
        store = selected.store
        store.remove selected
        priority = 1
        store.each (r) -> 
          r.set 'priority', priority++
    ]
