// START ------ Primo-VE-ZoteroBib-Add-On ------/
function insertActions(actions) {
		app.service('customActionService', function() {
			return {
				actions: [],
				processCustomAction: function(prmActionCtrl, action) {
					action.slug = action.name.replace(/\s+/g, ''); // remove whitespace
					action.iconname = action.slug.toLowerCase();
					action.index = Object.keys(prmActionCtrl.actionListService.actionsToIndex).length - 1 ; // ignore "none" and RISPushTo
					this.actions.push(action);
					return action;
				},
				setCustomAction: function(prmActionCtrl, action) {
						prmActionCtrl.actionLabelNamesMap[action.slug] = action.name;
						prmActionCtrl.actionIconNamesMap[action.slug] = action.iconname;
						prmActionCtrl.actionIcons[action.iconname] = {
							icon: action.icon.name,
							iconSet: action.icon.set,
							type: "svg"
						};
						if (!prmActionCtrl.actionListService.actionsToIndex[action.slug]) { // ensure we aren't duplicating the entry
							prmActionCtrl.actionListService.requiredActionsList[action.index] = action.slug;
							prmActionCtrl.actionListService.actionsToDisplay.unshift(action.slug);
							prmActionCtrl.actionListService.actionsToIndex[action.slug] = action.index;
						}

						var actionurl = "";

						if (action.type === 'urlredirectzotero') {
							var zoterobibq = "0";

							  //check is RISTYPE Exists
							  if (typeof prmActionCtrl.item.pnx.addata.ristype == 'undefined'){
								console.log("format" + prmActionCtrl.item.pnx.addata.format);
							  }else{

								switch(prmActionCtrl.item.pnx.addata.ristype.toString().toLowerCase()) {
								  case "book":
									zoterobibq = getZoterobibq(prmActionCtrl.item.pnx.addata, 0);
									break;
								  case "jour":
									zoterobibq = getZoterobibq(prmActionCtrl.item.pnx.addata, 1);
									break;
								  case "gen":
									zoterobibq = getZoterobibq(prmActionCtrl.item.pnx.addata, 2);
									break;
								  case "thes":
									zoterobibq = getZoterobibq(prmActionCtrl.item.pnx.addata, 3);
									break;

								  default:
									zoterobibq = getZoterobibq(prmActionCtrl.item.pnx.addata, 4);
								}
							  }
						  if (action.hasOwnProperty('templateVar')) {
							  action.action = action.action.replace(/{\d}/g, function(r){return action.templateVar[r.replace(/[^\d]/g,'')]});
							  console.log("templateVar");
						  }
							actionurl = action.action + zoterobibq;
						}
						prmActionCtrl.actionListService.onToggle[action.slug] = function(){
							window.open(actionurl, '_blank'); // opens the url in a new window
						};
				},
				setCustomActionContainer: function(mdTabsCtrl, action) { // for further review...
				},
				getCustomActions: function() {
					return this.actions;
				}
			};
		})
		.component('prmActionListAfter', {
			require: {
				prmActionCtrl: '^prmActionList',
			},
			controller: 'customActionController'
		})
		.controller('customActionController', ['$scope', 'customActionService', function($scope, customActionService) {
			var vm = this;
			vm.$onInit = function() {
				actions.forEach(function(action) {
					var processedAction = customActionService.processCustomAction(vm.prmActionCtrl, action);
					customActionService.setCustomAction(vm.prmActionCtrl, processedAction);

				});
			};
		}])
	}
// END ------ Primo-VE-ZoteroBib-Add-On ------/


	//Replace name and icon with you own
	insertActions([{
		name: "ZoteroBib",
		type: "urlredirectzotero",
		icon: {
			set: 'primo-actions',
			name: 'easybib'
		},
		action: "https://zbib.org/import?q="
	}]);


//Place this function outside the main function
//Function to get ISBN, DOI, PMID,arXiv ID, or title
function getZoterobibq(addata, risformattype)
{
	switch(risformattype) {
	  case 0: // book
		var reg = new RegExp('^\\d+$');
		if(addata.isbn.length > 1){
			for (i = 0; i < addata.isbn.length; i++) {
				if(reg.test(addata.isbn[i])){
					//console.log(addata.isbn[i]);
					break;
				}
			}
			return addata.isbn[i];
		}else
			return addata.isbn;
		break;
	  case 1: //jour
		if (typeof addata.doi !== 'undefined')
			return addata.doi;
		if (typeof addata.pmid !== 'undefined')
			return addata.pmid;
		if (typeof addata.lad21 !== 'undefined')
			return addata.lad21.toString().replace(/\barXiv.org:\b~?/g, '');
		if (typeof addata.atitle !== 'undefined')
			return addata.atitle;
		break;
	  case 2: //gen
		if (typeof addata.doi !== 'undefined')
			return addata.doi;
		if (typeof addata.pmid !== 'undefined')
			return addata.pmid;
		if (typeof addata.lad21 !== 'undefined')
			return addata.lad21.toString().replace(/\barXiv.org:\b~?/g, '');
		if (typeof addata.atitle !== 'undefined')
			return addata.atitle;
		break;
	  case 3: //thesis
		if (typeof addata.doi !== 'undefined')
			return addata.doi;
		if (typeof addata.pmid !== 'undefined')
			return addata.pmid;
		if (typeof addata.lad21 !== 'undefined'){
			return addata.lad21.toString().replace(/\barXiv.org:\b~?/g, '');
		if (typeof addata.atitle !== 'undefined')
			return addata.atitle;
		}
		break;
	  default:// will use the title if no ISBN, DOI, PMID,arXiv ID
		if(typeof addata.atitle !== 'undefined'){
			return addata.atitle;
		}
		if(typeof addata.btitle !== 'undefined'){
			return addata.btitle;
		}
		return "01";
	}
}
