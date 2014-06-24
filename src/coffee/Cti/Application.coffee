Ext.define 'Cti.Application'

  tokens: {}
  defaultToken: 'home'

  constructor: (config) ->

    Ext.apply(@, config)

    for name, cls of Ext.ClassManager.classes
      if cls.prototype and cls.prototype.token
        @registerToken cls.prototype.token, name

    Ext.History.on 'change', (url) => @processToken url

    window.app = @
    @viewport = Ext.create 'Cti.Viewport'

    if Ext.History.currentToken is ""
      @go @defaultToken
    else 
      @processToken Ext.History.currentToken

  registerToken: (token, cls) ->
    @tokens[token] = cls

  processToken: (token) ->
    console.log @tokens
    if @tokens[token]
      @viewport.launch @tokens[token]
    else
      alert 'No token processing: ' + token

  goBack: -> Ext.History.back()

  go: (url) ->
    Ext.History.add url