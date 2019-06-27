sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"../model/formatter",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast"
], function (BaseController, JSONModel, Device, formatter, History, MessageToast) {
	"use strict";

	return BaseController.extend("sellapp.sellApp.controller.map", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf sellapp.sellApp.view.map
		 */
		 formatter: formatter,
		 
		onInit: function () {
			// var oModel = new sap.ui.model.json.JSONModel("test-resources/sap/ui/vbm/demokit/sample/AnalyticMapCircles/Data.json");
						var oModel = new sap.ui.model.json.JSONModel();
var sURL = "//hxehost:4390//helloodata/map_api.xsjs";
 
var oHeaders = {
    "Authorization": 'Basic ' + btoa('SYSTEM:Olorunfemi_007'),
     "Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Credentials": true,
		"Access-Control-Allow-Header":"Accept, Content-type, Origin"
};
// load data from URL
  oModel.loadData(sURL, null, true, "GET", null, false, oHeaders);
  oModel.attachRequestCompleted(function(data) {
      //MessageToast.show("AddressModel: " + oModel.getData());
      oModel.setData(oModel.getData());
  });
			this.getView().setModel(oModel);
			var oViewModel = new JSONModel(Device);
			oViewModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
			// this.getView().setModel(oDeviceModel, "device");
				this.getRouter().getRoute("map").attachPatternMatched(this._onObjectMatched, this);

			this.setModel(oViewModel, "map");
			
			


			// this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
		},
			_onObjectMatched: function (oEvent) {
			var sObjectId = oEvent.getParameter("arguments").objectId;
			this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
			this.getModel().attachRequestCompleted().pSequentialImportCompleted.then(function () {
				// var sObjectPath = this.getModel().createKey("Employeetab", {
				// 	NAME: sObjectId
				// });
				this._bindView("/" + sObjectId);
			}.bind(this));
		},
		_bindView: function (sObjectPath) {
			// Set busy indicator during view binding
			 //var oViewModel = this.getModel("map");

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			 //oViewModel.setProperty("/busy", false);

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						// oViewModel.setProperty("/busy", true);
					},
					dataReceived: function () {
						// oViewModel.setProperty("/busy", false);
					}
				}
			});
		},
			_onBindingChange: function () {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();
			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				// if object could not be found, the selection in the master list
				// does not make sense anymore.
				// this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}
			 //var sPath = oElementBinding.getPath();
			// 	oResourceBundle = this.getResourceBundle(),
			// 	oObject = oView.getModel().getObject(sPath),
			// 	sObjectId = oObject.NAME,
			// 	sObjectName = oObject.JOB_TITLE,
			// 	oViewModel = this.getModel("");
			// this.getOwnerComponent().oListSelector.selectAListItem(sPath);
			// this.getOwnerComponent().setView(sPath);
			// oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("shareSaveTileAppTitle", [sObjectName]));
			// oViewModel.setProperty("/shareOnJamTitle", sObjectName);
			// oViewModel.setProperty("/shareSendEmailSubject", oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			// oViewModel.setProperty("/shareSendEmailMessage", oResourceBundle.getText("shareSendEmailObjectMessage", [
			// 	sObjectName,
			// 	sObjectId,
			// 	location.href
			// ]));
		},
		_onMetadataLoaded: function () {
			// Store original busy indicator delay for the detail view
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
				oViewModel = this.getModel("detailView");

			// Make sure busy indicator is displayed immediately when
			// detail view is displayed for the first time
			oViewModel.setProperty("/delay", 0);

			// Binding the view will set it to not busy - so the view is always busy if it is not bound
			oViewModel.setProperty("/busy", true);
			// Restore original busy indicator delay for the detail view
			oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
		},
		onNavBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("master", {}, true);
			}
		},
				 onPressLegend: function ()	{
			 if(this.byId("vbi").getLegendVisible()===true){
				 this.byId("vbi").setLegendVisible(false);
				 this.byId("btnLegend").setTooltip("Show legend");
			 }
			 else{
				 this.byId("vbi").setLegendVisible(true);
				 this.byId("btnLegend").setTooltip("Hide legend");
			 }
		},

		onPressResize: function ()	{
			if(this.byId("btnResize").getTooltip()==="Minimize"){
				if (sap.ui.Device.system.phone) {
					this.byId("vbi").minimize(132,56,1320,560);//Height: 3,5 rem; Width: 8,25 rem
				} else {
					this.byId("vbi").minimize(168,72,1680,720);//Height: 4,5 rem; Width: 10,5 rem
				}				
				this.byId("btnResize").setTooltip("Maximize");
			}
			else{
				this.byId("vbi").maximize();
				this.byId("btnResize").setTooltip("Minimize");
			}
		},

		onRegionClick: function (e)
		{
			sap.m.MessageToast.show( "Region: " + e.getParameter( "code" ) );
		},

		onRegionContextMenu: function ( e )
		{
			sap.m.MessageToast.show( "onRegionContextMenu " + e.getParameter( "code" ) );
		},
	
		onClickItem: function (evt)	{
			MessageToast.show("onClick");
		},

		onContextMenuItem: function ( evt )	{
			MessageToast.show("onContextMenu");
		},
	
		onClickCircle: function (evt)	{
			MessageToast.show("Circle onClick");
		},

		onContextMenuCircle: function ( evt )	{
			MessageToast.show(evt.getParameter( "code" ));
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf sellapp.sellApp.view.map
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf sellapp.sellApp.view.map
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf sellapp.sellApp.view.map
		 */
		//	onExit: function() {
		//
		//	}

	});

});