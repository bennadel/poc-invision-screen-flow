
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

			this.router.navigate([ "/app/flow" ]);

		} else {

			this.router.navigate([
				"/app/flow",
				{
					screenID: treeNode.id
				}
			]);

		}

	}


	public handleSelectHotspot( hotspot: FlowTreeHotspot ) : void {

		this.router.navigate([
			"/app/flow",
			{
				screenID: hotspot.targetScreenID 
			}
		]);

	}


	public ngOnDestroy() : void {

		for ( var subscription of this.subscriptions ) {

			subscription.unsubscribe();

		}

	}


	public ngOnInit() : void {

		this.subscriptions.push(
			this.activatedRoute.params.subscribe(
				( params ) => {

					params.screenID
						? this.screenFlowRuntime.selectScreenID( +params.screenID )
						: this.screenFlowRuntime.unselectTreeNode()
					;

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


	public startFlowFromScreen( treeNode: FlowTreeNode ) : void {

		alert( "Re-rendering is not supported in Proof-of-Concept." );

	}


	public viewScreenInPreview( treeNode: FlowTreeNode ) : void {

		alert( "Preview is not supported in Proof-of-Concept." );

	}

	// ---
	// PRIVATE METHODS.
	// ---

	private preloadRelatedScreenImages() : void {

		this.screenPreloaderService.preloadImages( this.screenFlowRuntime.getRelatedScreenImages() );

	}

}
