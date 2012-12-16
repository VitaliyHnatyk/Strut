define(['libs/backbone'],
function(Backbone) {
	return Backbone.Model.extend({
		initialize: function() {
			this._createModeButtons();
			this._createCreateCompButtons();

			this.registry.on('registered:strut.CreateCompButtonProvider',
				this._createCompProviderRegistered, this);
			this.registry.on('registered:strut.EditMode',
				this._modeRegistered, this);
		},

		editorModel: function() { return this._editorModel; },

		_createModeButtons: function() {
			this._disposeObjects(this.get('modeButtons'));
			var buttonEntries = this.registry.get('strut.EditMode');
			var modeButtons = [];
			buttonEntries.forEach(function(buttonEntry) {
				modeButtons.push(buttonEntry.service().createButton(this._editorModel));
			}, this);

			this.set('modeButtons', modeButtons);
		},

		_createCreateCompButtons: function() {
			this._disposeObjects(this.get('createCompButtons'));
			var providers = this.registry.get('strut.CreateCompButtonProvider');

			var createCompButtons = [];
			providers.forEach(function(provider) {
				var buttons = provider.createButtons();
				createCompButtons = createCompButtons.concat(buttons);
			}, this);

			this.set('createCompButtons', createCompButtons);
		},

		_modeRegistered: function(newMode) {
			var newButton = newMode.service().createButton(this._editorModel);
			this.get('modeButtons').push(newButton);
			this.trigger('change:modeButtons.push', this.get('modeButtons'), newButton);
		},

		_createCompProviderRegistered: function(service) {
			var newButtons = service.createButtons();
			this.set('createCompButtons', this.get('createCompButtons').concat(newButtons));
			this.trigger('change:createCompButtons.concat',
				this.get('createCompButtons'), newButtons);
		},

		_disposeObjects: function(objects) {
			if (objects)
				objects.forEach(function(object) {
					object.dispose();
				})
		},

		constructor: function HeaderModel(registry, editorModel) {
			this.registry = registry;
			this._editorModel = editorModel;
			Backbone.Model.prototype.constructor.call(this);
		}
	});
});