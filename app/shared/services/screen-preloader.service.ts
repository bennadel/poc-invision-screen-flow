
// Import the core angular services.
import { Injectable } from "@angular/core";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

interface LoadedImages {
	[ url: string ]: boolean;
}

@Injectable({
	providedIn: "root"
})
export class ScreenPreloaderService {

	private asyncTimer: any; // NOTE: Using "any" helps timer wonkiness in TypeScript.
	private loadedImages: LoadedImages;
	private maxConcurrent: number;
	private pendingImages: HTMLImageElement[];
	private queuedImages: string[];

	// I initialize the screen-preloader service.
	constructor() {

		this.asyncTimer = null;
		this.loadedImages = Object.create( null );
		this.maxConcurrent = 3;
		this.pendingImages = [];
		this.queuedImages = [];

	}

	// ---
	// PUBLIC METHODS.
	// ---

	// I attempt to preload the given collection of images. Will only load images that
	// have not yet been attempted.
	public preloadImages( imageUrls: string[] ) : void {

		clearTimeout( this.asyncTimer );

		// Reset the queued-up images to reflect the incoming images that have not
		// yet been loaded into the browser cache.
		this.queuedImages = imageUrls.filter(
			( imageUrl ) => {

				return( ! this.loadedImages[ imageUrl ] );

			}
		);

		if ( this.queuedImages.length ) {

			// Because there is processing overhead associated with the image
			// pre-loading, let's add a little time buffer so as to let the page
			// rendering "settle" before we start loading images over the network.
			this.asyncTimer = setTimeout( this.processQueue, 500 );

		}

	}

	// ---
	// PRIVATE MEHTODS.
	// ---

	// I handle image-loading events, removing images from the queue.
	private handleImageComplete = ( event: Event ) : void => {

		var target = ( event.target as HTMLImageElement );

		target.removeEventListener( "load", this.handleImageComplete, false );
		target.removeEventListener( "error",this.handleImageComplete, false );

		this.removeImageFromPending( target );
		// After each image-load completion, check to see if another image from the
		// queue needs to be processed.
		this.processQueue();

	}


	// I process the queue of images, using at most the "maxConcurrent" images.
	private processQueue = () : void => {

		var image;

		while ( this.queuedImages.length && ( this.pendingImages.length < this.maxConcurrent ) ) {

			var imageUrl = this.queuedImages.shift() !; // Asserting non-null.

			// EDGE CASE: If an image was add in-duplicate in a single request, then it
			// may end up in the queue twice. Let's perform one final check to eliminate
			// this duplication.
			if ( this.loadedImages[ imageUrl ] ) {

				continue;

			}

			console.info( "Pre-loading:", imageUrl );

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


	// I remove the given image from the pending queue.
	private removeImageFromPending( image: HTMLImageElement ) : void {

		var index = this.pendingImages.indexOf( image );

		if ( index >= 0 ) {

			this.pendingImages.splice( index, 1 );

		}

	}

}
