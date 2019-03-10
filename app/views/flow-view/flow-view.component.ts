
// Import the core angular services.
import { combineLatest } from "rxjs/operators";
import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { Subscription } from "rxjs";

// Import the application components and services.
import { FlowTree } from "~/app/shared/services/screen-flow.runtime";
import { FlowTreeNode } from "~/app/shared/services/screen-flow.runtime";
import { Project } from "~/app/shared/services/screen-flow.runtime";
import { ProjectOrientation } from "~/app/shared/services/screen-flow.runtime";
import { ScreenFlowRuntime } from "~/app/shared/services/screen-flow.runtime";
import { ScreenPreloaderService } from "~/app/shared/services/screen-preloader.service";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Component({
	selector: "flow-view",
	styleUrls: [ "./flow-view.component.less" ],
	templateUrl: "./flow-view.component.htm"
})
export class FlowViewComponent {

	public isProtectingDrag: boolean;
	public project: Project | null;
	public projectOrientation: ProjectOrientation | null;
	public screenSize: number;
	public selectedTreeNode: FlowTreeNode | null;
	public tree: FlowTree | null;

	private screenFlowRuntime: ScreenFlowRuntime;
	private screenPreloaderService: ScreenPreloaderService;
	private subscriptions: Subscription[];

	// I initialize the flow-view component.
	constructor(
		screenFlowRuntime: ScreenFlowRuntime,
		screenPreloaderService: ScreenPreloaderService
		) {

		this.screenFlowRuntime = screenFlowRuntime;
		this.screenPreloaderService = screenPreloaderService;

		this.isProtectingDrag = false;
		this.project = null;
		this.projectOrientation = null;
		this.screenSize = 1;
		this.selectedTreeNode = null;
		this.subscriptions = [];
		this.tree = null;

	}

	// ---
	// PUBLIC METHODS.
	// ---

	public handleSelect( treeNode: FlowTreeNode ) : void {

		if ( treeNode === this.selectedTreeNode ) {

			this.screenFlowRuntime.unselectTreeNode( treeNode );

		} else {

			this.screenFlowRuntime.selectTreeNode( treeNode );
			
		}

	}


	public ngOnDestroy() : void {

		for ( var subscription of this.subscriptions ) {

			subscription.unsubscribe();

		}

	}


	public ngOnInit() : void {

		this.subscriptions.push(
			this.screenFlowRuntime.getProject().subscribe(
				( project ) => {

					this.project = project;

				}
			),
			this.screenFlowRuntime.getProjectOrientation().subscribe(
				( projectOrientation ) => {

					this.projectOrientation = projectOrientation;

				}
			),
			this.screenFlowRuntime.getScreenSize().subscribe(
				( screenSize ) => {

					this.screenSize = screenSize;

				}
			),
			this.screenFlowRuntime.getSelectedTreeNode().subscribe(
				( selectedTreeNode ) => {

					this.selectedTreeNode = selectedTreeNode;
					this.preloadRelatedScreenImages();

				}
			),
			this.screenFlowRuntime.getTree().subscribe(
				( tree ) => {

					this.tree = tree;

				}
			)
		);

	}


	public setDragProtection( isProtectingDrag: boolean ) : void {

		this.isProtectingDrag = isProtectingDrag;

	}

	// ---
	// PRIVATE METHODS.
	// ---

	private preloadRelatedScreenImages() : void {

		if ( this.selectedTreeNode ) {

			var imageUrls = this.selectedTreeNode.hotspots.map(
				function( hotspot ) {

					return( treeIndex[ hotspot.targetScreenID ].screen.imageUrl );

				}
			);

			screenPreloader.preloadImages( imageUrls );

		}

	}

}
