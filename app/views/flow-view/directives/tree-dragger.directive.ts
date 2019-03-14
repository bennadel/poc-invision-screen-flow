
// Import the core angular services.
import { Directive } from "@angular/core";
import { ElementRef } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { NgZone } from "@angular/core";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

interface MousePosition {
	x: number;
	y: number;
}

@Directive({
	selector: "[invTreeDragger]",
	outputs: [
		"draggerStartEvents: draggerStart",
		"draggerStopEvents: draggerStop"
	]
})
export class TreeDraggerDirective {

	public draggerStartEvents: EventEmitter<void>;
	public draggerStopEvents: EventEmitter<void>;

	private elementRef: ElementRef;
	private isDragging: boolean;
	private mousePosition: MousePosition;
	private zone: NgZone;

	// I initialize the tree-dragger directive.
	constructor(
		elementRef: ElementRef,
		zone: NgZone
		) {

		this.elementRef = elementRef;
		this.zone = zone;

		this.draggerStartEvents = new EventEmitter();
		this.draggerStopEvents = new EventEmitter();
		this.isDragging = false;
		this.mousePosition = { x: 0, y: 0 };

	}

	// ---
	// PUBLIC METHODS.
	// ---

	// I get called once when the directive is being destroyed.
	public ngOnDestroy() : void {

		this.elementRef.nativeElement.removeEventListener( "mousedown", this.handleMousedown, false );
		window.removeEventListener( "mousemove", this.handleMousemove, false );
		window.removeEventListener( "mouseup", this.handleMouseup, false );

		if ( this.isDragging ) {

			this.zone.run(
				() => {

					this.draggerStopEvents.emit();
					
				}
			);

		}

	}


	// I get called once when the directive is being created.
	public ngOnInit() : void {

		// Since there's no need for the internal drag-interaction to trigger a change
		// detection digest, we want to bind the mouse-handlers outside of the Angular
		// zone. This will cause the "mousemove" and "mouseup" handlers to also be bound
		// outside of the Angular zone.
		this.zone.runOutsideAngular(
			() => {

				this.elementRef.nativeElement.addEventListener( "mousedown", this.handleMousedown, false );
				
			}
		);

	}

	// ---
	// PRIVATE METHODS.
	// ---

	// I handle the mousedown event that may initiate the drag.
	private handleMousedown = ( event: MouseEvent ) : void => {

		// In order to prevent the drag interaction from selecting parts of the DOM, we
		// need to cancel the default behavior of the event.
		event.preventDefault();

		this.mousePosition = {
			x: event.clientX,
			y: event.clientY
		};

		// When the user clicks, we're not going to start dragging immediately - we want
		// the drag to pass a certain threshold before we start applying it to the
		// scrollable area.
		this.isDragging = false;

		// Attach mousemove and mouseup event handlers on the WINDOW so we are
		// not constrained by the current element.
		window.addEventListener( "mousemove", this.handleMousemove, false );
		window.addEventListener( "mouseup", this.handleMouseup, false );

		this.elementRef.nativeElement.style.cursor = "grabbing";

	}


	// I handle the mousemove event during drag processing.
	private handleMousemove = ( event: MouseEvent ) : void => {

		var deltaX = ( this.mousePosition.x - event.clientX );
		var deltaY = ( this.mousePosition.y - event.clientY );

		// Only move the canvas around if the user has passed a small threshold. This
		// way, we don't get tiny movements when the user does things like click on
		// embedded targets.
		if ( this.isDragging ) {

			this.mousePosition.x = event.clientX;
			this.mousePosition.y = event.clientY;

			this.elementRef.nativeElement.scrollTop += deltaY;
			this.elementRef.nativeElement.scrollLeft += deltaX;

		} else if (
			( Math.abs( deltaX ) > 5 ) ||
			( Math.abs( deltaY ) > 5 )
			) {

			this.zone.run(
				() => {

					this.isDragging = true;
					this.draggerStartEvents.emit();
					
				}
			);

		}

	}


	// I handle the mouseup event that stops the drag processing.
	private handleMouseup = ( event: MouseEvent ) : void => {

		window.removeEventListener( "mousemove", this.handleMousemove, false );
		window.removeEventListener( "mouseup", this.handleMouseup, false );

		this.elementRef.nativeElement.style.cursor = null;

		if ( this.isDragging ) {

			this.zone.run(
				() => {

					this.isDragging = false;
					this.draggerStopEvents.emit();
					
				}
			);
			
		}

	}

}
