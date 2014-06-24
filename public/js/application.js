
Ext.define('Cti.Panel', {
  extend: 'Ext.panel.Panel',
  border: false,
  layout: 'fit',
  initComponent: function() {
    var toolbar;
    this.bbar = toolbar = Ext.create('Ext.toolbar.Toolbar');
    return this.callParent(arguments);
  },
  setContent: function(content) {
    this.removeAll();
    this.add(content);
    return this.doLayout();
  },
  updateToolbar: function(toolbar) {
    var item, _i, _len, _ref, _results;
    this.addDocked(toolbar);
    _ref = this.getDockedItems();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (item !== toolbar) {
        _results.push(this.removeDocked(item));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  }
});


Ext.define('Cti.Viewport', {
  extend: 'Ext.Viewport',
  layout: 'fit',
  initComponent: function() {
    this.items = [this.panel = Ext.create('Cti.Panel')];
    return this.callParent(arguments);
  }
});


Ext.define('Cti.Welcome', {
  extend: 'Ext.panel.Panel',
  bodyPadding: 10,
  border: false,
  title: 'Welcome',
  html: 'Change your Application.defaultClass property'
});


Ext.define('Cti.Application', {
  classTokens: {},
  dynamic: {},
  tokenClasees: {},
  viewportClass: 'Cti.Viewport',
  defaultClass: 'Cti.Welcome',
  constructor: function(config) {
    var cls, name, _ref,
      _this = this;
    _ref = Ext.ClassManager.classes;
    for (name in _ref) {
      cls = _ref[name];
      if (cls.prototype && cls.prototype.token) {
        this.registerToken(cls.prototype.token, name);
      }
    }
    Ext.apply(this, config);
    Ext.History.on('change', function(url) {
      return _this.processToken(url);
    });
    this.viewport = Ext.create(this.viewportClass);
    this.panel = this.viewport.panel;
    if (Ext.History.currentToken) {
      this.processToken(Ext.History.currentToken);
    } else if (this.defaultClass) {
      this.launch(this.defaultClass);
    }
    return this;
  },
  registerToken: function(token, cls) {
    var items, k, v, _i, _len, _results;
    if (token.indexOf(':') !== -1) {
      this.dynamic[cls] = {
        params: [],
        basis: []
      };
      items = token.split('/');
      _results = [];
      for (k = _i = 0, _len = items.length; _i < _len; k = ++_i) {
        v = items[k];
        if (Ext.String.startsWith(v, ':')) {
          _results.push(this.dynamic[cls].params[k] = v.substr(1));
        } else {
          _results.push(this.dynamic[cls].basis[k] = v);
        }
      }
      return _results;
    } else {
      this.tokenClasees[token] = cls;
      return this.classTokens[cls] = token;
    }
  },
  processToken: function(token) {
    var cfg, chain, cls, dynamic, found, k, v, _i, _j, _len, _len1, _ref, _ref1, _ref2;
    if (this.tokenClasees[token]) {
      return this.panel.setContent(Ext.create(this.tokenClasees[token]));
    } else {
      chain = token.split('/');
      _ref = this.dynamic;
      for (cls in _ref) {
        dynamic = _ref[cls];
        found = true;
        _ref1 = dynamic.basis;
        for (k = _i = 0, _len = _ref1.length; _i < _len; k = ++_i) {
          v = _ref1[k];
          if (v && chain[k] !== v) {
            found = false;
          }
        }
        if (found) {
          cfg = {};
          _ref2 = dynamic.params;
          for (k = _j = 0, _len1 = _ref2.length; _j < _len1; k = ++_j) {
            v = _ref2[k];
            if (k) {
              cfg[v] = chain[k];
            }
          }
          return this.panel.setContent(Ext.create(cls, cfg));
        }
      }
      return alert('No token processing: ' + token);
    }
  },
  launch: function(cls, cfg) {
    var chain, k, v, _i, _j, _len, _len1, _ref, _ref1;
    if (this.classTokens[cls]) {
      return Ext.History.add(this.classTokens[cls]);
    } else if (this.dynamic[cls]) {
      chain = [];
      _ref = this.dynamic[cls].params;
      for (k = _i = 0, _len = _ref.length; _i < _len; k = ++_i) {
        v = _ref[k];
        chain[k] = cfg[v];
      }
      _ref1 = this.dynamic[cls].basis;
      for (k = _j = 0, _len1 = _ref1.length; _j < _len1; k = ++_j) {
        v = _ref1[k];
        chain[k] = v;
      }
      return Ext.History.add(chain.join('/'));
    } else {
      return this.panel.setContent(Ext.create(cls, cfg));
    }
  }
});


Ext.define('Cti', {
  statics: {
    start: function(config) {
      return Cti.application = Ext.create('Cti.Application', config);
    },
    launch: function(cls, cfg) {
      return Cti.application.launch(cls, cfg);
    }
  }
});


Ext.define('Scheduler.Monitor', {
  extend: 'Ext.panel.Panel',
  title: 'Monitoring',
  bodyPadding: 10,
  html: 'List of tasks: 10 last + current + 10 next',
  token: 'monitor',
  bbar: [
    {
      text: 'Go to Job List',
      handler: function() {
        return Cti.launch('Scheduler.JobList');
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
        return Cti.launch('Scheduler.JobList');
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
  token: 'job/:id_job',
  save: function() {
    return Cti.launch('Scheduler.JobList');
  },
  "delete": function() {
    var _this = this;
    return Ext.Msg.confirm('Confirm', 'Are you sure to delete this job?', function(btn) {
      return Scheduler.deleteJob(_this.id_job, function() {
        if (btn === 'yes') {
          return Cti.launch('Scheduler.JobList');
        }
      });
    });
  },
  initComponent: function() {
    this.title = 'Job #' + this.id_job;
    this.items = [
      Ext.create('Scheduler.ExecutionLog', {
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


Ext.define('Scheduler.JobList', {
  title: 'Job list',
  extend: 'Ext.grid.Panel',
  token: 'list',
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
    fields: ['name', 'status', 'last', 'next', 'schedule']
  },
  initComponent: function() {
    this.callParent(arguments);
    this.updateList();
    return this.on('itemclick', function() {
      return Cti.launch('Scheduler.JobEditor', {
        id_job: this.getSelectionModel().getSelection()[0].data.id_job
      });
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
        return Cti.launch('Scheduler.Monitor');
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


Ext.onReady(function() {
  var app;
  Ext.direct.Manager.on({
    exception: function(e) {
      var text;
      text = e.type === 'exception' ? e.result : "" + e.message + "\n" + (e.xhr ? e.xhr.responseText : '');
      alert(text);
      return console.log(text);
    }
  });
  app = Cti.start({
    defaultClass: 'Scheduler.JobList'
  });
  return app.panel.updateToolbar();
});

