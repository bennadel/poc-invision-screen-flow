
// Import the core angular services.
import { Component } from "@angular/core";
import { Subscription } from "rxjs";

// Import the application components and services.
import { FlowTree } from "~/app/shared/services/screen-flow.runtime";
import { FlowTreeNode } from "~/app/shared/services/screen-flow.runtime";
import { ScreenFlowRuntime } from "~/app/shared/services/screen-flow.runtime";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Component({
	selector: "unreachable-view",
	styleUrls: [ "./unreachable-view.component.less" ],
	templateUrl: "./unreachable-view.component.htm"
})
export class UnreachableViewComponent {
	
	public tree: FlowTree | null;

	private screenFlowRuntime: ScreenFlowRuntime;
	private subscriptions: Subscription[];

	// I initialize the unreachable-view component.
	constructor( screenFlowRuntime: ScreenFlowRuntime ) {

		this.screenFlowRuntime = screenFlowRuntime;

		this.subscriptions = [];
		this.tree = null;

	}

	// ---
	// PUBLIC METHODS.
	// ---

	// I get called once when the component is being destroyed.
	public ngOnDestroy() : void {

		for ( var subscription of this.subscriptions ) {

			subscription.unsubscribe();

		}

	}


	// I get called once when the component is being created.
	public ngOnInit() : void {

		this.subscriptions.push(
			this.screenFlowRuntime.getTree().subscribe(
				( tree ) => {

					this.tree = tree;

				}
			)
		);

	}


	// I handle requests to start the screen-flow from the given node.
	public startFlowFromScreen( treeNode: FlowTreeNode ) : void {

		alert( "Re-rendering is not supported in Proof-of-Concept." );

	}


	// I handle requests to preview the given node in the live-site.
	public viewScreenInPreview( treeNode: FlowTreeNode ) : void {

		alert( "Preview is not supported in Proof-of-Concept." );

	}

}
