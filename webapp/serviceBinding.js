function initModel() {
	var sUrl = "/hana_connect/helloodata/hello.xsodata/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}