
// Import the core angular services.
import { ActivatedRoute } from "@angular/router";
import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

// Import the application components and services.
import { FlowTree } from "~/app/shared/services/screen-flow.runtime";
import { FlowTreeHotspot } from "~/app/shared/services/screen-flow.runtime";
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
	public reachableScreenCount: number;
	public screenSize: number;
	public selectedTreeNode: FlowTreeNode | null;
	public tree: FlowTree | null;

	private activatedRoute: ActivatedRoute;
	private router: Router;
	private screenFlowRuntime: ScreenFlowRuntime;
	private screenPreloaderService: ScreenPreloaderService;
	private subscriptions: Subscription[];

	// I initialize the flow-view component.
	constructor(
		activeatedRoute: ActivatedRoute,
		router: Router,
		screenFlowRuntime: ScreenFlowRuntime,
		screenPreloaderService: ScreenPreloaderService
		) {

		this.activatedRoute = activeatedRoute;
		this.router = router;
		this.screenFlowRuntime = screenFlowRuntime;
		this.screenPreloaderService = screenPreloaderService;

		this.isProtectingDrag = false;
		this.project = null;
		this.projectOrientation = null;
		this.reachableScreenCount = 0;
		this.screenSize = 1;
		this.selectedTreeNode = null;
		this.subscriptions = [];
		this.tree = null;

	}

	// ---
	// PUBLIC METHODS.
	// ---

	// I handle the selection of the given tree node.
	public handleSelect( treeNode: FlowTreeNode ) : void {

		// The selection process is really more of a "toggle" process that drives URL
		// changes. If the given tree node is the CURRENTLY SELECTED one, then we want to
		// navigate away from any selection (implicitly turning off selection).
		if ( treeNode === this.selectedTreeNode ) {

			this.router.navigate([ "/app/flow" ]);

		// If the given tree node is NOT the currently selected one, then we want to
		// navigate to the given node (implicitly selecting it).
		} else {

			this.router.navigate([
				"/app/flow",
				{
					screenID: treeNode.id
				}
			]);

		}

	}


	// I handle the selection of the given hotspot.
	public handleSelectHotspot( hotspot: FlowTreeHotspot ) : void {

		this.router.navigate([
			"/app/flow",
			{
				screenID: hotspot.targetScreenID 
			}
		]);

	}


	// I get called once when the component is being destroyed.
	public ngOnDestroy() : void {

		for ( var subscription of this.subscriptions ) {

			subscription.unsubscribe();

		}

	}


	// I get called once when the component is being created.
	public ngOnInit() : void {

		this.subscriptions.push(
			this.activatedRoute.params.subscribe(
				( params ) => {

					params.screenID
						? this.screenFlowRuntime.selectScreenID( +params.screenID )
						: this.screenFlowRuntime.unselectTreeNode()
					;

					// NOTE: At this point, it's possible that the route param didn't
					// actually lead to a tree node selection (if the ID is invalid). We
					// could respond by navigating away from the param; however, that
					// just adds complexity for this PoC and represents an edge-case that
					// is very unlikely (and not harmful).

				}
			),
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
			this.screenFlowRuntime.getReachableScreenCount().subscribe(
				( reachableScreenCount ) => {

					this.reachableScreenCount = reachableScreenCount;

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
					this.screenPreloaderService.preloadImages( this.screenFlowRuntime.getRelatedScreenImages() );

				}
			),
			this.screenFlowRuntime.getTree().subscribe(
				( tree ) => {

					this.tree = tree;

				}
			)
		);

	}


	// I toggle the drag protection layer. 
	public setDragProtection( isProtectingDrag: boolean ) : void {

		this.isProtectingDrag = isProtectingDrag;

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
