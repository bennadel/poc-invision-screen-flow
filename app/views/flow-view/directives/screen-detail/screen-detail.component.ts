
// Import the core angular services.
import { Component } from "@angular/core";
import { ElementRef } from "@angular/core";
import { EventEmitter } from "@angular/core";

// Import the application components and services.
import { FlowTree } from "~/app/shared/services/screen-flow.runtime";
import { FlowTreeHotspot } from "~/app/shared/services/screen-flow.runtime";
import { FlowTreeNode } from "~/app/shared/services/screen-flow.runtime";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Component({
	selector: "inv-screen-detail",
	inputs: [ "treeNode" ],
	outputs: [
		"selectHotspotEvents: selectHotspot",
		"previewScreenEvents: previewScreen",
		"startFromScreenEvents: startFromScreen"
	],
	styleUrls: [ "./screen-detail.component.less" ],
	templateUrl: "./screen-detail.component.htm"
})
export class ScreenDetailComponent {

	public displayScale: number;
	public previewScreenEvents: EventEmitter<FlowTreeNode>;
	public selectHotspotEvents: EventEmitter<FlowTreeHotspot>;
	public startFromScreenEvents: EventEmitter<FlowTreeNode>;
	public treeNode!: FlowTreeNode;

	private elementRef: ElementRef;

	// I initialize the screen-detail component.
	constructor( elementRef: ElementRef ) {

		this.elementRef = elementRef;

		this.displayScale = 1;
		this.previewScreenEvents = new EventEmitter();
		this.selectHotspotEvents = new EventEmitter();
		this.startFromScreenEvents = new EventEmitter();

	}

	// ---
	// PUBLIC METHODS.
	// ---

	// I get called when the input bindings are updated.
	public ngOnChanges() : void {

		// Whenever the tree node changes, we want to make sure the current container is
		// scrolled to the top.
		this.elementRef.nativeElement.scrollTo( 0, 0 );

		// Technically, we only need to calculate the display scale the first time this
		// component renders. However, it's easier to just do it whenever the tree node
		// is updated. This way, we don't have to worry about the timing of the DOM
		// and the view-model change-detection.
		var thumbnail = this.elementRef.nativeElement.querySelector( ".thumbnail" );

		this.displayScale = ( thumbnail )
			? ( thumbnail.clientWidth / this.treeNode.screen.width )
			: 0
		;

	}


	// I emit a hotspot selection event.
	public selectHotspot( hotspot: FlowTreeHotspot ) : void {

		this.selectHotspotEvents.emit( hotspot );

	}


	// I emit a start event for the current screen.
	public startFlowFromScreen() : void {

		this.startFromScreenEvents.emit( this.treeNode );

	}


	// I emit a preview event for the current screen.
	public viewScreenInPreview() : void {

		this.previewScreenEvents.emit( this.treeNode );

	}

}
