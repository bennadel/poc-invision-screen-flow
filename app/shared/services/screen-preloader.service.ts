
// Import the core angular services.
import { Injectable } from "@angular/core";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Injectable({
	providedIn: "root"
})
export class ScreenPreloaderService {

	private loadedImages: any;
	private pendingImages: HTMLImageElement[];
	private queuedImages: any[];
	private maxConcurrent: number;
	private asyncTimer: any;

	constructor() {

		this.loadedImages = Object.create( null );
		this.pendingImages = [];
		this.queuedImages = [];
		this.maxConcurrent = 3;
		this.asyncTimer = null;

	}

	// ---
	// PUBLIC METHODS.
	// ---

	public preloadImages( imageUrls: string[] ) : void {

		window.clearTimeout( this.asyncTimer );

		// Reset the queued-up images to reflect the incoming images that have not
		// yet been loaded into the browser cache.
		this.queuedImages = imageUrls.filter(
			( imageUrl ) => {

				return( ! ( imageUrl in this.loadedImages ) );

			}
		);

		if ( this.queuedImages.length ) {

			// Because there is processing overhead associated with the image
			// pre-loading, let's add a little time buffer so as to let the page
			// rendering "settle" before we start loading images over the network.
			this.asyncTimer = window.setTimeout( this.processQueue, 500 );

		}

	}

	// ---
	// PRIVATE MEHTODS.
	// ---

	private handleImageComplete = ( event: Event ) : void => {

		var target = <HTMLImageElement>event.target;

		target.removeEventListener( "load", this.handleImageComplete, false );
		target.removeEventListener( "error",this.handleImageComplete, false );

		this.removeImageFromPending( target );
		// After each image-load completion, check to see if another image from the
		// queue needs to be processed.
		this.processQueue();

	}


	private processQueue = () : void => {

		var image;

		while ( this.queuedImages.length && ( this.pendingImages.length < this.maxConcurrent ) ) {

			var imageUrl = this.queuedImages.shift();

			// Track this image so we never try to load it again.
			this.loadedImages[ imageUrl ] = true;

			// Track this image in the pending collection so we know how many
			// concurrent images are loading.
			this.pendingImages.push( image = new Image() );

			image.addEventListener( "load", this.handleImageComplete, false );
			image.addEventListener( "error", this.handleImageComplete, false );
			image.src = imageUrl

			// If the image was already in the browser cache, it may not actually
			// trigger the load or error events. In that case, just remove it from
			// the pending collection immediately.
			if ( image.complete ) {

				this.removeImageFromPending( image );

			}

		}

	}


	private removeImageFromPending( image: HTMLImageElement ) : void {

		var index = this.pendingImages.indexOf( image );

		if ( index >= 0 ) {

			this.pendingImages.splice( index, 1 );

		}

	}

}
