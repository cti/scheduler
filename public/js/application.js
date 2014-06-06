
Ext.define('Scheduler.Monitor', {
  extend: 'Ext.panel.Panel',
  title: 'Monitoring',
  bodyPadding: 10,
  html: 'List of tasks: 10 last + current + 10 next',
  bbar: [
    {
      text: 'Go to Job List',
      handler: function() {
        return this.up('panel').goBack();
      }
    }
  ]
});


Ext.define('Scheduler.ExecutionLog', {
  extend: 'Ext.grid.Panel',
  title: 'Execution log',
  tbar: {
    height: 40,
    items: [
      {
        fieldLabel: 'Status',
        xtype: 'combobox',
        store: ['All', 'Running', 'Success', 'Fail'],
        editable: false,
        value: 'All'
      }
    ]
  },
  columns: [
    {
      header: 'Date',
      flex: 1
    }, {
      header: 'Result',
      width: 150
    }
  ]
});

var x;

Ext.define('Scheduler.ScheduleEditor', {
  extend: 'Ext.form.Panel',
  title: 'Schedule',
  bodyPadding: 10,
  defaults: {
    xtype: 'combobox',
    editable: false
  },
  items: [
    {
      value: 0,
      store: (function() {
        var _i, _results;
        _results = [];
        for (x = _i = 0; _i <= 12; x = ++_i) {
          _results.push(x);
        }
        return _results;
      })(),
      fieldLabel: 'Month',
      name: 'month'
    }, {
      value: 0,
      store: (function() {
        var _i, _results;
        _results = [];
        for (x = _i = 0; _i <= 7; x = ++_i) {
          _results.push(x);
        }
        return _results;
      })(),
      fieldLabel: 'Week',
      name: 'week_day'
    }, {
      value: 0,
      store: (function() {
        var _i, _results;
        _results = [];
        for (x = _i = 0; _i <= 31; x = ++_i) {
          _results.push(x);
        }
        return _results;
      })(),
      fieldLabel: 'Day',
      name: 'day'
    }, {
      value: 0,
      store: (function() {
        var _i, _results;
        _results = [];
        for (x = _i = 0; _i <= 24; x = ++_i) {
          _results.push(x);
        }
        return _results;
      })(),
      fieldLabel: 'Hour',
      name: 'hour'
    }, {
      value: 0,
      store: (function() {
        var _i, _results;
        _results = [];
        for (x = _i = 0; _i <= 59; x = _i += 10) {
          _results.push(x);
        }
        return _results;
      })(),
      fieldLabel: 'Minute',
      name: 'minute'
    }, {
      value: 0,
      store: [0, 30],
      fieldLabel: 'Second',
      name: 'second'
    }
  ]
});


Ext.define('Scheduler.CommandList', {
  extend: 'Ext.grid.Panel',
  title: 'Commands',
  initComponent: function() {
    this.plugins = [
      Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 1
      })
    ];
    return this.callParent(arguments);
  },
  store: {
    sorters: [
      {
        property: 'priority',
        direction: 'ASC'
      }
    ],
    fields: [
      'command', {
        name: 'priority',
        type: 'integer'
      }
    ]
  },
  columns: [
    {
      header: 'Command',
      editor: 'textfield',
      dataIndex: 'command',
      sortable: false,
      flex: 1
    }
  ],
  listeners: {
    selectionchange: function(sm, sel) {
      var grid, selected, selectionIsEmpty;
      grid = sm.view.grid;
      selectionIsEmpty = !sel.length;
      grid.down('[text=Move up]').setDisabled(selectionIsEmpty);
      grid.down('[text=Move down]').setDisabled(selectionIsEmpty);
      grid.down('[text=Remove selected]').setDisabled(selectionIsEmpty);
      if (!selectionIsEmpty) {
        selected = grid.getSelected();
        grid.down('[text=Move up]').setDisabled(selected.get('priority') === 1);
        return grid.down('[text=Move down]').setDisabled(selected.get('priority') === selected.store.data.length);
      }
    }
  },
  getSelected: function() {
    var sel;
    sel = this.getSelectionModel().getSelection();
    if (sel.length === 1) {
      return sel[0];
    }
  },
  tbar: {
    height: 40,
    items: [
      {
        text: 'Add new',
        handler: function() {
          var rec, store;
          store = this.up('grid').getStore();
          rec = {
            priority: store.getCount() + 1
          };
          return store.add(rec);
        }
      }, {
        text: 'Move up',
        disabled: true,
        handler: function() {
          var previous, selected;
          selected = this.up('grid').getSelected();
          previous = selected.store.findRecord('priority', selected.get('priority') - 1);
          previous.set('priority', selected.get('priority'));
          selected.set('priority', selected.get('priority') - 1);
          return this.up('grid').getSelectionModel().select(selected);
        }
      }, {
        text: 'Move down',
        disabled: true,
        handler: function() {
          var next, selected;
          selected = this.up('grid').getSelected();
          next = selected.store.findRecord('priority', selected.get('priority') + 1);
          next.set('priority', selected.get('priority'));
          selected.set('priority', selected.get('priority') + 1);
          return this.up('grid').getSelectionModel().select(selected);
        }
      }, {
        text: 'Remove selected',
        disabled: true,
        handler: function() {
          var priority, selected, store;
          selected = this.up('grid').getSelected();
          store = selected.store;
          store.remove(selected);
          priority = 1;
          return store.each(function(r) {
            return r.set('priority', priority++);
          });
        }
      }
    ]
  }
});


Ext.define('Scheduler.JobEditor', {
  extend: 'Ext.panel.Panel',
  layout: {
    type: "hbox",
    pack: "start",
    align: "stretch"
  },
  bbar: [
    {
      text: 'Go to Job List',
      handler: function() {
        return this.up('panel').goBack();
      }
    }, '-', {
      text: 'Save configuration',
      handler: function() {
        return this.up('panel').save();
      }
    }, '-', {
      text: 'Delete this job',
      handler: function() {
        return this.up('panel')["delete"]();
      }
    }
  ],
  save: function() {
    return this.goBack();
  },
  "delete": function() {
    var _this = this;
    return Ext.Msg.confirm('Confirm', 'Are you sure to delete this job?', function(btn) {
      if (btn === 'yes') {
        return Scheduler.deleteJob(_this.job.get('id_job'), function() {
          return _this.goBack();
        });
      }
    });
  },
  initComponent: function() {
    var leftSide;
    if (!this.job.get('class')) {
      leftSide = {
        width: 400,
        border: false,
        layout: {
          type: "vbox",
          pack: "start",
          align: "stretch"
        },
        items: [
          Ext.create('Scheduler.CommandList', {
            title: this.job.get('name'),
            border: false,
            flex: 1
          }), Ext.create('Scheduler.ScheduleEditor', {
            border: false,
            flex: 1
          })
        ]
      };
    }
    this.items = [
      leftSide, Ext.create('Scheduler.ExecutionLog', {
        flex: 1,
        border: false,
        style: {
          borderLeft: '1px solid silver'
        }
      })
    ];
    return this.callParent(arguments);
  }
});


Ext.define('Model.Generated.Job', {
  extend: 'Ext.data.Model',
  name: "job",
  idProperty: "id_job",
  fields: [
    {
      "name": "id_job",
      "type": "integer"
    }, {
      "name": "class",
      "type": "string"
    }, {
      "name": "dt_last",
      "type": "date"
    }, {
      "name": "dt_next",
      "type": "date"
    }, {
      "name": "id_schedule",
      "type": "integer"
    }, {
      "name": "name",
      "type": "string"
    }, {
      "name": "status",
      "type": "string"
    }, {
      "name": "system",
      "type": "integer"
    }
  ]
});


Ext.define('Model.Job', {
  extend: 'Model.Generated.Job'
});


Ext.define('Scheduler.JobList', {
  title: 'Job list',
  extend: 'Ext.grid.Panel',
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
        var map;
        map = {
          A: 'Active',
          N: 'New',
          X: 'Canceled'
        };
        return map[v] || 'Unknown';
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
    model: 'Model.Job'
  },
  requires: ['Model.Job'],
  initComponent: function() {
    var _this = this;
    this.updateList();
    this.callParent(arguments);
    return this.on('itemclick', function() {
      return _this.setContent(Ext.create('Scheduler.JobEditor', {
        job: _this.getSelectionModel().getSelection()[0],
        goBack: function() {
          return _this.setContent(Ext.create('Scheduler.JobList', {
            setContent: _this.setContent
          }));
        }
      }));
    });
  },
  updateList: function() {
    var _this = this;
    return Scheduler.getJobList(function(response) {
      return _this.store.loadData(response.data);
    });
  },
  bbar: [
    {
      text: 'Monitoring',
      handler: function() {
        var grid,
          _this = this;
        grid = this.up('grid');
        return grid.setContent(Ext.create('Scheduler.Monitor', {
          job: grid.getSelectionModel().getSelection()[0],
          goBack: function() {
            return grid.setContent(Ext.create('Scheduler.JobList', {
              setContent: grid.setContent
            }));
          }
        }));
      }
    }, '-', {
      text: 'Create new job',
      handler: function() {
        var grid, win;
        grid = this.up('grid');
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
      }
    }
  ]
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

