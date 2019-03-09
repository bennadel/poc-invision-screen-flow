
// Import the core angular services.
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Routes } from "@angular/router";

// Import the application components and services.
import { UnreachableViewComponent } from "./unreachable-view.component";
import { RoutableView } from "~/app/app.module";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild([
			{
				// NOTE: Since this module is being lazy-loaded, the root segment has
				// already been defined (as part of the lazy-load configuration). As
				// such, the root segment here is empty.
				path: "",
				component: UnreachableViewComponent
			}
		])
	],
	declarations: [
		UnreachableViewComponent
	]
})
export class UnreachableViewModule {
	// ...
}

export var UnreachableView: RoutableView = {
	modules: [
		// NOTE: Since this module is being lazy-loaded, the parent module does NOT NEED
		// to import this module. As such, this collection is empty.
	],
	routes: [
		{
			path: "unreachable",
			loadChildren: "app/views/unreachable-view/unreachable-view.module#UnreachableViewModule"
		}
	]
};
