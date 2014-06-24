Ext.onReady -> 

  Ext.direct.Manager.on
    exception: (e) ->
      text = if e.type is 'exception' then e.result else ("#{e.message}\n#{if e.xhr then e.xhr.responseText else ''}")
      alert text
      console.log text

  app = Cti.start defaultClass: 'Scheduler.JobList'
  app.panel.updateToolbar()