
// Import the core angular services.
import { Directive } from "@angular/core";
import { ElementRef } from "@angular/core";
import { NgZone } from "@angular/core";

// Import the application components and services.
import { FlowTreeNode } from "~/app/shared/services/screen-flow.runtime";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Directive({
	selector: "[invTreeScroller]",
	inputs: [
		"selectedTreeNode: invTreeScroller"
	]
})
export class TreeScrollerDirective {

	public selectedTreeNode!: FlowTreeNode | null;

	private elementRef: ElementRef;
	private supportsSmoothScrolling: boolean;
	private timer: any;
	private zone: NgZone;

	// I initialize the tree-scroller directive.
	constructor(
		elementRef: ElementRef,
		zone: NgZone
		) {

		this.elementRef = elementRef;
		this.zone = zone;

		// Scrolling the selected element into view only creates a nice user experience
		// if the browser support smooth-scrolling. If not, the scroll action is
		// instantaneous and janky. Better to just not use feature.
		this.supportsSmoothScrolling = this.getBrowserSupportForSmoothScrolling();
		this.timer = null;

	}

	// ---
	// PUBLIC METHODS.
	// ---

	public ngOnChanges() : void {

		if ( this.supportsSmoothScrolling && this.selectedTreeNode ) {

			window.clearTimeout( this.timer );

			// When the input bindings have updated, the View hasn't yet been updated. As
			// such, we have to give the app a few ticks to update.
			// --
			// NOTE: For some reason, trying to do this in ngAfterViewChecked() method
			// wasn't working. The DOM was updated; but, the .scrollIntoView() method
			// didn't seem to actually be updated the browser.
			// --
			// UPDATE: The issue may have been related to a security plug-in that I have
			// installed. Gonna just leave this the way it is.
			this.zone.runOutsideAngular(
				() => {

					this.timer = window.setTimeout( this.handleTick, 50 );

				}
			);

		}

	}


	public ngOnDestroy() : void {

		window.clearTimeout( this.timer );

	}

	// ---
	// PRIVATE METHODS.
	// ---

	private getBrowserSupportForSmoothScrolling() : boolean {

		return( "scrollBehavior" in document.documentElement.style );

	}


	private handleTick = () : void => {

		var selectedElement = this.elementRef.nativeElement.querySelector( ".tree-screen--selected" );

		if ( selectedElement && selectedElement.scrollIntoView ) {

			selectedElement.scrollIntoView({
				behavior: "smooth",
				block: "center",
				inline: "center"
			});

		}

	}

}
