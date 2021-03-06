
// Import the core angular services.
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Routes } from "@angular/router";

// Import the application components and services.
import { FlowViewComponent } from "./flow-view.component";
import { RoutableView } from "~/app/app.module";
import { ScreenDetailComponent } from "./directives/screen-detail/screen-detail.component";
import { ScreenTreeComponent } from "./directives/screen-tree/screen-tree.component";
import { ScreenTreeNodeComponent } from "./directives/screen-tree/screen-tree-node.component";
import { TreeDraggerDirective } from "./directives/tree-dragger.directive";
import { TreeScrollerDirective } from "./directives/tree-scroller.directive";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@NgModule({
	imports: [
		CommonModule
		// NOTE: Since this module is being statically loaded in the app, we don't need
		// to define a .forChild() router definition - these routes are being included
		// directly into the parent module's route definition.
		// --
		// RouterModule // <--- Include if you need router-outlet or routerLink.
	],
	declarations: [
		FlowViewComponent,
		ScreenDetailComponent,
		ScreenTreeComponent,
		ScreenTreeNodeComponent,
		TreeDraggerDirective,
		TreeScrollerDirective
	]
})
export class FlowViewModule {
	// ...
}

export var FlowView: RoutableView = {
	modules: [
		// NOTE: Since this module's routes are being included directly in the parent
		// module's router definition, we need to tell the parent module to import this
		// module. Otherwise, the application won't know about the declared components
		// and services.
		FlowViewModule
	],
	routes: [
		{
			path: "flow",
			component: FlowViewComponent
		}
	]
};
