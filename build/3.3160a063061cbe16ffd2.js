(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{"6Teu":function(n,l,e){"use strict";Object.defineProperty(l,"__esModule",{value:!0});var t=e("CcnG"),u=e("upTM"),i=e("pMnS"),o=e("gni9"),r=e("Ip0R"),a=e("ZYCi"),c=e("wxw2"),s=t.ɵcmf(u.UnreachableViewModule,[],function(n){return t.ɵmod([t.ɵmpd(512,t.ComponentFactoryResolver,t.ɵCodegenComponentFactoryResolver,[[8,[i.ɵEmptyOutletComponentNgFactory,o.UnreachableViewComponentNgFactory]],[3,t.ComponentFactoryResolver],t.NgModuleRef]),t.ɵmpd(4608,r.NgLocalization,r.NgLocaleLocalization,[t.LOCALE_ID,[2,r.ɵangular_packages_common_common_a]]),t.ɵmpd(1073742336,r.CommonModule,r.CommonModule,[]),t.ɵmpd(1073742336,a.RouterModule,a.RouterModule,[[2,a.ɵangular_packages_router_router_a],[2,a.Router]]),t.ɵmpd(1073742336,u.UnreachableViewModule,u.UnreachableViewModule,[]),t.ɵmpd(1024,a.ROUTES,function(){return[[{path:"",component:c.UnreachableViewComponent}]]},[])])});l.UnreachableViewModuleNgFactory=s},gni9:function(n,l,e){"use strict";Object.defineProperty(l,"__esModule",{value:!0});var t=e("yRGc"),u=e("CcnG"),i=e("Ip0R"),o=e("wxw2"),r=e("QPJU"),a=[t.styles],c=u.ɵcrt({encapsulation:0,styles:a,data:{}});function s(n){return u.ɵvid(0,[(n()(),u.ɵted(-1,null,[" The following screens are unreachable from the current starting screen. "]))],null,null)}function p(n){return u.ɵvid(0,[(n()(),u.ɵted(-1,null,[" There are "])),(n()(),u.ɵeld(1,0,null,null,1,"strong",[],null,null,null,null,null)),(n()(),u.ɵted(-1,null,["no unreachable screens"])),(n()(),u.ɵted(-1,null,[" in this prototype ( when starting from the selected screen ). "]))],null,null)}function d(n){return u.ɵvid(0,[(n()(),u.ɵeld(0,0,null,null,14,"li",[["class","items__item"]],null,null,null,null,null)),(n()(),u.ɵeld(1,0,null,null,1,"div",[["class","items__thumbnail"]],null,null,null,null,null)),(n()(),u.ɵeld(2,0,null,null,0,"img",[["class","items__image"]],[[8,"src",4]],null,null,null,null)),(n()(),u.ɵeld(3,0,null,null,11,"div",[["class","items__details"]],null,null,null,null,null)),(n()(),u.ɵeld(4,0,null,null,1,"div",[["class","items__name"]],null,null,null,null,null)),(n()(),u.ɵted(5,null,[" "," "])),(n()(),u.ɵeld(6,0,null,null,1,"div",[["class","items__filename"]],null,null,null,null,null)),(n()(),u.ɵted(7,null,[" "," "])),(n()(),u.ɵeld(8,0,null,null,6,"div",[["class","items__actions"]],null,null,null,null,null)),(n()(),u.ɵeld(9,0,null,null,1,"a",[["class","items__action"]],null,[[null,"click"]],function(n,l,e){var t=!0,u=n.component;"click"===l&&(t=!1!==u.startFlowFromScreen(n.context.$implicit)&&t);return t},null,null)),(n()(),u.ɵted(-1,null,[" Start Here "])),(n()(),u.ɵeld(11,0,null,null,1,"span",[["class","items__action-separator"]],null,null,null,null,null)),(n()(),u.ɵeld(12,0,null,null,0,"br",[],null,null,null,null,null)),(n()(),u.ɵeld(13,0,null,null,1,"a",[["class","items__action"]],null,[[null,"click"]],function(n,l,e){var t=!0,u=n.component;"click"===l&&(t=!1!==u.viewScreenInPreview(n.context.$implicit)&&t);return t},null,null)),(n()(),u.ɵted(-1,null,[" Preview Screen "]))],null,function(n,l){n(l,2,0,l.context.$implicit.screen.thumbnailUrl),n(l,5,0,l.context.$implicit.screen.name),n(l,7,0,l.context.$implicit.screen.clientFilename)})}function m(n){return u.ɵvid(0,[(n()(),u.ɵeld(0,0,null,null,2,"ul",[["class","items"]],null,null,null,null,null)),(n()(),u.ɵand(16777216,null,null,1,null,d)),u.ɵdid(2,278528,null,0,i.NgForOf,[u.ViewContainerRef,u.TemplateRef,u.IterableDiffers],{ngForOf:[0,"ngForOf"]},null)],function(n,l){n(l,2,0,l.component.tree.unreachable)},null)}function h(n){return u.ɵvid(0,[(n()(),u.ɵeld(0,0,null,null,7,"header",[["class","header"]],null,null,null,null,null)),(n()(),u.ɵeld(1,0,null,null,1,"h2",[["class","header__title"]],null,null,null,null,null)),(n()(),u.ɵted(-1,null,[" Unreachable Screen "])),(n()(),u.ɵeld(3,0,null,null,4,"div",[["class","header__description"]],null,null,null,null,null)),(n()(),u.ɵand(16777216,null,null,1,null,s)),u.ɵdid(5,16384,null,0,i.NgIf,[u.ViewContainerRef,u.TemplateRef],{ngIf:[0,"ngIf"]},null),(n()(),u.ɵand(16777216,null,null,1,null,p)),u.ɵdid(7,16384,null,0,i.NgIf,[u.ViewContainerRef,u.TemplateRef],{ngIf:[0,"ngIf"]},null),(n()(),u.ɵand(16777216,null,null,1,null,m)),u.ɵdid(9,16384,null,0,i.NgIf,[u.ViewContainerRef,u.TemplateRef],{ngIf:[0,"ngIf"]},null)],function(n,l){var e=l.component;n(l,5,0,e.tree&&e.tree.unreachable.length),n(l,7,0,e.tree&&!e.tree.unreachable.length),n(l,9,0,e.tree&&e.tree.unreachable.length)},null)}function f(n){return u.ɵvid(0,[(n()(),u.ɵeld(0,0,null,null,1,"unreachable-view",[],null,null,null,h,c)),u.ɵdid(1,245760,null,0,o.UnreachableViewComponent,[r.ScreenFlowRuntime],null,null)],function(n,l){n(l,1,0)},null)}l.RenderType_UnreachableViewComponent=c,l.View_UnreachableViewComponent_0=h,l.View_UnreachableViewComponent_Host_0=f;var _=u.ɵccf("unreachable-view",o.UnreachableViewComponent,f,{},{},[]);l.UnreachableViewComponentNgFactory=_},upTM:function(n,l,e){"use strict";Object.defineProperty(l,"__esModule",{value:!0});var t=function(){return function(){}}();l.UnreachableViewModule=t,l.UnreachableView={modules:[],routes:[{path:"unreachable",loadChildren:"app/views/unreachable-view/unreachable-view.module#UnreachableViewModule"}]}},wxw2:function(n,l,e){"use strict";Object.defineProperty(l,"__esModule",{value:!0});e("QPJU");var t=function(){function n(n){this.screenFlowRuntime=n,this.subscriptions=[],this.tree=null}return n.prototype.ngOnDestroy=function(){for(var n=0,l=this.subscriptions;n<l.length;n++){l[n].unsubscribe()}},n.prototype.ngOnInit=function(){var n=this;this.subscriptions.push(this.screenFlowRuntime.getTree().subscribe(function(l){n.tree=l}))},n.prototype.startFlowFromScreen=function(n){alert("Re-rendering is not supported in Proof-of-Concept.")},n.prototype.viewScreenInPreview=function(n){alert("Preview is not supported in Proof-of-Concept.")},n}();l.UnreachableViewComponent=t},yRGc:function(n,l,e){"use strict";Object.defineProperty(l,"__esModule",{value:!0});l.styles=["[_nghost-%COMP%] {\n  display: block ;\n  padding: 22px 40px 30px 40px ;\n}\n.header[_ngcontent-%COMP%] {\n  margin-bottom: 35px ;\n}\n.header__title[_ngcontent-%COMP%] {\n  font-size: 35px ;\n  font-smoothing: antialiased ;\n  -webkit-font-smoothing: antialiased ;\n  font-weight: 300 ;\n  line-height: 40px ;\n  margin: 0px 0px 12px 0px ;\n}\n.header__description[_ngcontent-%COMP%] {\n  color: #7e8890;\n  font-size: 16px ;\n  font-weight: 400 ;\n  line-height: 21px ;\n}\n.items[_ngcontent-%COMP%] {\n  list-style-type: none ;\n  margin: 16px 0px 16px 0px ;\n  padding: 0px 0px 0px 0px ;\n}\n.items__item[_ngcontent-%COMP%] {\n  display: flex ;\n  margin: 16px 0px 30px 0px ;\n}\n.items__thumbnail[_ngcontent-%COMP%] {\n  border: 2px solid #e0e0e0;\n  border-radius: 3px 3px 3px 3px ;\n  flex: 0 0 auto ;\n  height: 120px ;\n  margin-right: 20px ;\n  overflow: hidden ;\n  width: 150px ;\n}\n.items__details[_ngcontent-%COMP%] {\n  flex: 1 1 auto ;\n  padding-top: 7px ;\n}\n.items__image[_ngcontent-%COMP%] {\n  display: block ;\n  width: 100% ;\n}\n.items__name[_ngcontent-%COMP%] {\n  color: #1f2532;\n  font-size: 16px ;\n  font-weight: 400 ;\n  line-height: 21px ;\n  margin-bottom: 4px ;\n}\n.items__filename[_ngcontent-%COMP%] {\n  color: #7e8890;\n  font-size: 14px ;\n  font-weight: 400 ;\n  line-height: 20px ;\n}\n.items__actions[_ngcontent-%COMP%] {\n  align-items: center ;\n  color: #464d5d;\n  display: flex ;\n  font-size: 13px ;\n  font-weight: 600 ;\n  line-height: 18px ;\n  margin-top: 20px ;\n}\n.items__action[_ngcontent-%COMP%] {\n  color: #424956;\n  flex: 0 0 auto ;\n  cursor: pointer ;\n  font-weight: 400 ;\n  text-decoration: underline ;\n}\n.items__action[_ngcontent-%COMP%]:hover {\n  color: #000000;\n}\n.items__action-separator[_ngcontent-%COMP%] {\n  background-color: #cccccc;\n  border-radius: 4px 4px 4px 4px ;\n  flex: 0 0 auto ;\n  height: 4px ;\n  margin: 0px 10px 0px 10px ;\n  width: 4px ;\n}"]}}]);
//# sourceMappingURL=3.3160a063061cbe16ffd2.js.map