sap.ui.define([
	"./BaseController",
	"../model/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/viz/ui5/data/FlattenedDataset",
	"sap/viz/ui5/format/ChartFormatter",
	"sap/viz/ui5/api/env/Format",
	"./InitPage",
	"sap/ui/Device",
	"sap/m/MessageToast"
], function (BaseController, formatter, JSONModel, History, FlattenedDataset, ChartFormatter, Format, InitPageUtil, Device, MessageToast) {
	"use strict";

	return BaseController.extend("sellapp.sellApp.controller.analytic", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf sellapp.sellApp.view.analytic
		 */
		formatter: formatter,
		  //dataPath : "hxehost:4390//helloodata/sd_api.xsjs",
        
        settingsModel : {
            dataset : {
                name: "Dataset",
                defaultSelected : 1,
                values : [{
                    name : "Small",
                    value : "/betterSmall.json"
                },{
                    name : "Medium",
                    value : "/betterMedium.json"
                },{
                    name : "Large",
                    value : "/betterLarge.json"
                }]
            },
            series : {
                name : "Series",
                defaultSelected : 0,
                values : [{
                    name : "1 Series",
                    value : ["Net_value"]
                }, {
                    name : "2 Series",
                    value : ["Net_value", "Description"]
                }]
            },
            dataLabel : {
                name : "Value Label",
                defaultState : true
            },
            axisTitle : {
                name : "Axis Title",
                defaultState : false
            },
            dimensions: {
                Small: [{
                    name: "Description",
                    value: "{Description}"
                }],
                Medium: [{
                    name: "Description",
                    value: "{Description}"
                }],
                Large: [{
                    name: "Description",
                    value: "{Description}"
                }]
            },
            measures: [{
               name: "Net_Value",
               value: "{Net_value}"
            },{
               name: "Net_Value",
               value: "{Net Value}"
            }]
        },
        
        oVizFrame : null,
		onInit: function (evt) {

			var oViewModel = new JSONModel({
				busy: false,
				delay: 0
			}, 
			this.settingsModel,
			Device);
			
// 			var oTabModel = new sap.ui.model.json.JSONModel();
			// var sURL = "//hxehost:4390//helloodata/sd_api.xsjs?$format=json&$callback=?";
// 		  jQuery.ajax({
// 		  	url: sURL,
// 		  	method: "GET",
// 		  	crossDomain: true,
// 		  	dataType: "JSON",
// 		  	jsonpCallback: "callback",
// 		  	async: false,
// 		  		headers: {
//         Authorization: 'Basic ' + btoa('SYSTEM:Olorunfemi007'),
//         "contentType": "application/json; charset=utf-8",
//         "Access-Control-Allow-Origin": "*",
// 		"Access-Control-Allow-Credentials": true,
// 		"Access-Control-Allow-Header":"Accept, Content-type, Origin"
//     },
// 		  	success: this.onSuccessCall,
// // 		  	function(data, textStatus, jqXHR) {
		  		
// // 								oTabModel.setData(data);
// // 							MessageToast.show("success to post");
// // },
// 		  	Error: this.onErrorCall,
		  
//     callback: function(data){
//     		oTabModel.setJSON({
//     			"dest" : data
    			
//     		});
// 		MessageToast.show("success to post");
    	
//     },
//     done: function ( data ) {
// 		  		oTabModel.setJSON({
//     			"dest" : data
//     		});
// 		  }
		  
		  
// 		  });
		  
		  // create a "json" Model
var oModel = new sap.ui.model.json.JSONModel();
var sURL = "//hxehost:4390//helloodata/sd_api.xsjs";
 
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
	// sap.ui.getCore().setModel(oModel, "data");
		  
		
// 		var oBModel = new sap.ui.model.odata.ODataModel({ 
//     serviceUrl: "https://hxehost:4390//helloodata/sd_api.xsjs", 
//     json: "true",
//     headers: {
//     	method: "GET",
//         username: "SYSTEM",
//         password: "Olorunfemi007",
//         json: "true",
//         contentType: "application/json; charset=utf-8",
//         dataType: "jsonp",
//         crossDomain: true,
//         "Access-Control-Allow-Origin": "*",
// 		"Access-Control-Allow-Credentials": true,
// 		"Access-Control-Allow-Header": "Accept, Content-type, Origin"
        
//     }
// });
			
				   Format.numericFormatter(ChartFormatter.getInstance());
            var formatPattern = ChartFormatter.DefaultPattern;
            // set explored app's demo model on this sample
            // var oViewModel = new JSONModel(this.settingsModel);
            oViewModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
            // this.getView().setModel(oViewModel);
            
            var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
            oVizFrame.setVizProperties({
                plotArea: {
                    dataLabel: {
                        formatString:formatPattern.SHORTFLOAT_MFD2,
                        visible: true
                    }
                },
                valueAxis: {
                    label: {
                        formatString: formatPattern.SHORTFLOAT
                    },
                    title: {
                        visible: false
                    }
                },
                categoryAxis: {
                    title: {
                        visible: false
                    }
                },
                title: {
                    visible: false,
                    text: "Revenue by City and Store Name"
                }
            });
             //var dataModel = new JSONModel(oBModel);
             //MessageToast.show(oTabModel);
            oVizFrame.setModel(oModel);
            
            var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString(formatPattern.STANDARDFLOAT);
            
            InitPageUtil.initPageSettings(this.getView());

			this.getRouter().getRoute("analytic").attachPatternMatched(this._onObjectMatched, this);

			this.setModel(oViewModel, "analytic");


			// this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
			
		

		},
		
		// onErrorCall: function  (jqXHR, textStatus, errorThrown) {
		// 	MessageToast.show(jqXHR.responseText, "Error", "Service call Error");
			
		// },
		// onSuccessCall: function (data, oTabModel) {
		// 	// var oTabModel = new sap.ui.model.json.JSONModel();
		// 	var oData = JSON.parse(data);
		// 		oTabModel.setJSON(oData);
		// },

		_onObjectMatched: function (oEvent) {
			 var sObjectId = oEvent.getParameter("arguments").objectId;
			 this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
			 this.getModel().metadataLoaded().then(function () {
			 	var sObjectPath = this.getModel().createKey("Customer_info", {
					Sales_Document: sObjectId
			 	});
			 	this._bindView("/" + sObjectPath);
			 }.bind(this));
			 
			// 		this.getView().bindElement({
			// 	path: "/" + oEvent.getParameter("arguments").objectId,
			// 	model: "invoice"
			// });
		},
		_bindView: function (sObjectPath) {
			// Set busy indicator during view binding
			// var oViewModel = this.getModel("detailView");

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			// oViewModel.setProperty("/busy", false);

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

		_onMetadataLoaded: function () {
			// Store original busy indicator delay for the detail view
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
				oViewModel = this.getModel("");

			// Make sure busy indicator is displayed immediately when
			// detail view is displayed for the first time
			oViewModel.setProperty("/delay", 0);

			// Binding the view will set it to not busy - so the view is always busy if it is not bound
			oViewModel.setProperty("/busy", true);
			// Restore original busy indicator delay for the detail view
			oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
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
        onAfterRendering : function(){
            var datasetRadioGroup = this.getView().byId("datasetRadioGroup");
            datasetRadioGroup.setSelectedIndex(this.settingsModel.dataset.defaultSelected);
            
            var seriesRadioGroup = this.getView().byId("seriesRadioGroup");
            seriesRadioGroup.setSelectedIndex(this.settingsModel.series.defaultSelected);
        },
        onDatasetSelected : function(oEvent){
            var datasetRadio = oEvent.getSource();
            if(this.oVizFrame && datasetRadio.getSelected()){
                var bindValue = datasetRadio.getBindingContext().getObject();
                var dataset = {
                    data: {
                        path: "/data"
                    }
                };
                var dim = this.settingsModel.dimensions[bindValue.name];
                dataset.dimensions = dim;
                dataset.measures = this.settingsModel.measures;
                var oDataset = new FlattenedDataset(dataset);
                this.oVizFrame.setDataset(oDataset);
                var dataModel = new JSONModel(this.oBModel + bindValue.value);
                this.oVizFrame.setModel(dataModel);

                var feedCategoryAxis = this.getView().byId("categoryAxisFeed");
                this.oVizFrame.removeFeed(feedCategoryAxis);
                var feed = [];
                for (var i = 0; i < dim.length; i++) {
                    feed.push(dim[i].name);
                }
                feedCategoryAxis.setValues(feed);
                this.oVizFrame.addFeed(feedCategoryAxis);
            }
        },
        onSeriesSelected : function(oEvent){
            var seriesRadio = oEvent.getSource();
            if(this.oVizFrame && seriesRadio.getSelected()){
                var bindValue = seriesRadio.getBindingContext().getObject();
                
                var feedValueAxis = this.getView().byId("valueAxisFeed");
                this.oVizFrame.removeFeed(feedValueAxis);
                feedValueAxis.setValues(bindValue.value);
                this.oVizFrame.addFeed(feedValueAxis);
            }
        },
        onDataLabelChanged : function(oEvent){
            if(this.oVizFrame){
                this.oVizFrame.setVizProperties({
                    plotArea: {
                        dataLabel: {
                            visible: oEvent.getParameter("state")
                        }
                    }
                });
            }
        },
        onAxisTitleChanged : function(oEvent){
            if(this.oVizFrame){
                var state = oEvent.getParameter("state");
                this.oVizFrame.setVizProperties({
                    valueAxis: {
                        title: {
                            visible: state
                        }
                    },
                    categoryAxis: {
                        title: {
                            visible: state
                        }
                    }
                });
            }
        }

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf sellapp.sellApp.view.analytic
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf sellapp.sellApp.view.analytic
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf sellapp.sellApp.view.analytic
		 */
		//	onExit: function() {
		//
		//	}

	});

});