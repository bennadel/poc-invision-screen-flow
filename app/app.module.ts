
// Import the core angular services.
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { PreloadAllModules } from "@angular/router";
import { RouterModule } from "@angular/router";
import { Routes } from "@angular/router";

// Import the application components and services.
import { AppViewComponent } from "./views/app-view.component";
import { FlowView } from "./views/flow-view/flow-view.module";
import { UnreachableView } from "./views/unreachable-view/unreachable-view.module";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

// When we included a routable view into the router tree, we have to define the routes
// and, SOMETIMES, import the view modules (when statically loaded). In order to keep
// the routing semantics consistent across our views, I'm pushing both the ROUTE and
// MODULE definitions into the subview. This way, the parent context always SPREADS both
// the modules (into the imports) and the routes (into the RouterModule) into its own
// definition. This allows a module to switch from statically loaded to lazy loaded
// without the parent context having to know about it.
export interface RoutableView {
	modules: any[],
	routes: Routes
}

@NgModule({
	imports: [
		BrowserModule,
		HttpClientModule,
		// Routable modules.
		...FlowView.modules,
		...UnreachableView.modules,
		// --
		RouterModule.forRoot(
			[
				{
					path: "app",
					children: [
						{
							path: "",
							pathMatch: "full",
							redirectTo: "flow"
						},
						...FlowView.routes,
						...UnreachableView.routes
					]
				},
				// Handle root redirect to app.
				{
					path: "",
					pathMatch: "full",
					redirectTo: "app"
				},
				// Handle root not-found redirect.
				{
					path: "**",
					redirectTo: "/app/flow"
				}
			],
			{
				// Tell the router to use the HashLocationStrategy.
				useHash: true,
				enableTracing: false,

				// This will tell Angular to preload the lazy-loaded routes after the
				// application has been bootstrapped. This will extend to both top-level
				// and nested lazy-loaded modules.
				preloadingStrategy: PreloadAllModules
			}
		)
	],
	providers: [
		// CAUTION: We don't need to specify the LocationStrategy because we are setting
		// the "useHash" property in the Router module above (which will be setting the
		// strategy for us).
		// --
		// {
		// 	provide: LocationStrategy,
		// 	useClass: HashLocationStrategy
		// }
	],
	declarations: [
		AppViewComponent
	],
	bootstrap: [
		AppViewComponent
	]
})
export class AppModule {
	// ...
}
