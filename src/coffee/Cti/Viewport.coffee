Ext.define 'Cti.Viewport'

  extend: 'Ext.Viewport'
  layout:'fit'

  launch: (cls) -> 
    @setContent Ext.create cls, border:false

  setContent: (module) ->
    @removeAll()
    @add module
    @doLayout()