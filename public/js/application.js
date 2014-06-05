
Ext.define('Scheduler.JobEditor', {
  extend: 'Ext.panel.Panel',
  html: 'zzz',
  tools: [
    {
      id: 'back',
      handler: function() {
        return this.up('panel').goBack();
      }
    }
  ],
  initComponent: function() {
    this.title = this.job.get('name');
    return this.callParent(arguments);
  }
});


Ext.define('Scheduler.JobList', {
  title: 'Job list',
  extend: 'Ext.grid.Panel',
  tools: [
    {
      id: 'plus',
      handler: function() {
        return this.up('grid').createNew();
      }
    }, {
      id: 'search',
      hidden: true,
      handler: function() {
        return this.up('grid').editJob();
      }
    }, {
      id: 'minus',
      hidden: true,
      handler: function() {
        return this.up('grid').deleteSelected();
      }
    }
  ],
  columns: [
    {
      header: 'Name',
      dataIndex: 'name',
      flex: 1
    }, {
      header: 'Status',
      dataIndex: 'status',
      width: 120,
      renderer: function(v) {
        if (v === 'A') {
          return 'Active';
        }
      }
    }, {
      header: 'Last run',
      dataIndex: 'last',
      width: 150
    }, {
      header: 'Next run',
      dataIndex: 'next',
      width: 150
    }, {
      header: 'Schedule',
      dataIndex: 'schedule',
      width: 120
    }
  ],
  store: {
    fields: ['name', 'status', 'last', 'next']
  },
  initComponent: function() {
    var _this = this;
    this.updateList();
    this.callParent(arguments);
    this.on('itemdblclick', function() {
      return _this.editJob();
    });
    return this.on('selectionchange', function(sm, sel) {
      if (sel.length === 0) {
        _this.down('[id=search]').hide();
        return _this.down('[id=minus]').hide();
      } else {
        _this.down('[id=search]').show();
        return _this.down('[id=minus]').show();
      }
    });
  },
  editJob: function() {
    var _this = this;
    return this.setContent(Ext.create('Scheduler.JobEditor', {
      job: this.selectedJob(),
      goBack: function() {
        return _this.setContent(Ext.create('Scheduler.JobList', {
          setContent: _this.setContent
        }));
      }
    }));
  },
  updateList: function() {
    var _this = this;
    return Scheduler.getJobList(function(response) {
      return _this.store.loadData(response.data);
    });
  },
  createNew: function() {
    var grid, win;
    grid = this;
    win = Ext.create('Ext.Window', {
      title: 'Create new Job',
      modal: true,
      items: [
        Ext.create('Ext.form.Panel', {
          monitorValid: true,
          padding: 10,
          border: false,
          items: {
            xtype: 'textfield',
            fieldLabel: 'Name',
            allowBlank: false,
            name: 'name'
          },
          bbar: [
            {
              text: 'Cancel',
              handler: function() {
                return win.close();
              }
            }, '->', {
              text: 'Add',
              formBind: true,
              handler: function() {
                return Scheduler.createNew(this.up('form').getValues().name, function() {
                  win.close();
                  return grid.updateList();
                });
              }
            }
          ]
        })
      ]
    });
    return win.show();
  },
  selectedJob: function() {
    return this.getSelectionModel().getSelection()[0];
  },
  deleteSelected: function() {
    var _this = this;
    return Scheduler.deleteJob(this.selectedJob().get('id_job'), function() {
      return _this.updateList();
    });
  }
});


Ext.define('Scheduler.Application', {
  extend: 'Ext.Viewport',
  layout: 'border',
  initComponent: function() {
    var container,
      _this = this;
    this.items = [
      container = Ext.create('Ext.panel.Panel', {
        region: 'center',
        layout: 'fit',
        border: false,
        items: [
          Ext.create('Scheduler.JobList', {
            region: 'center',
            border: false,
            setContent: function(content) {
              container.removeAll();
              container.add(content);
              return container.doLayout();
            }
          })
        ]
      })
    ];
    return this.callParent(arguments);
  }
});


Ext.onReady(function() {
  Ext.direct.Manager.on({
    exception: function(e) {
      var text;
      text = e.type === 'exception' ? e.result : "" + e.message + "\n" + (e.xhr ? e.xhr.responseText : '');
      alert(text);
      return console.log(text);
    }
  });
  return Ext.create('Scheduler.Application');
});

