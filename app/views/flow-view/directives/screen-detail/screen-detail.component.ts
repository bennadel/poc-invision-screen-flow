
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
	private renderWidth: number;

	// I initialize the screen-detail component.
	constructor( elementRef: ElementRef ) {

		this.elementRef = elementRef;

		this.displayScale = 1;
		this.previewScreenEvents = new EventEmitter();
		this.renderWidth = 0;
		this.selectHotspotEvents = new EventEmitter();
		this.startFromScreenEvents = new EventEmitter();

	}

	// ---
	// PUBLIC METHODS.
	// ---

	public ngOnChanges() : void {

		this.elementRef.nativeElement.scrollTo( 0, 0 );

		var thumbnail = this.elementRef.nativeElement.querySelector( ".thumbnail" );

		if ( thumbnail ) {

			this.displayScale = ( thumbnail.clientWidth / this.treeNode.screen.width );

		} else {

			this.displayScale = 0;

		}

	}


	public selectHotspot( hotspot: FlowTreeHotspot ) : void {

		this.selectHotspotEvents.emit( hotspot );

	}


	public startFlowFromScreen() : void {

		this.startFromScreenEvents.emit( this.treeNode );

	}


	public viewScreenInPreview() : void {

		this.previewScreenEvents.emit( this.treeNode );

	}

}
