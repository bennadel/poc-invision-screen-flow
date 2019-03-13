
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

		this.tree = null;
		this.subscriptions = [];

	}

	// ---
	// PUBLIC METHODS.
	// ---

	public ngOnDestroy() : void {

		for ( var subscription of this.subscriptions ) {

			subscription.unsubscribe();

		}

	}


	public ngOnInit() : void {

		this.subscriptions.push(
			this.screenFlowRuntime.getTree().subscribe(
				( tree ) => {

					this.tree = tree;

				}
			)
		);

	}


	public startFlowFromScreen( treeNode: FlowTreeNode ) : void {

		alert( "Re-rendering is not supported in Proof-of-Concept." );

	}


	public viewScreenInPreview( treeNode: FlowTreeNode ) : void {

		alert( "Preview is not supported in Proof-of-Concept." );

	}

}
