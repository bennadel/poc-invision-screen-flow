
// Import the core angular services.
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

// Import the application components and services.
import { SimpleStore } from "./simple-store";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

export interface FlowTree {
	root: FlowTreeNode;
	unreachable: FlowTreeNode[];
}

export interface FlowTreeHotspot {
	height: number;
	screenID: number;
	targetScreenID: number;
	width: number;
	x: number;
	y: number;
}

export interface FlowTreeIndex {
	[ id: string ]: FlowTreeNode;
}

export interface FlowTreeNode {
	hardLinkIDs: number[];
	hotspots?: FlowTreeHotspot[];
	id: number;
	links: FlowTreeNode[];
	softLinkIDs: number[];
	screen: FlowTreeScreen;
}

export interface FlowTreeScreen {
	clientFilename: string;
	height: number;
	id: number;
	imageUrl: string;
	name: string;
	thumbnailUrl: string;
	width: number;
}

export interface Project {
	id: number;
	name: string;
}

export type ProjectOrientation = "portrait" | "landscape";

// NOTE: Internal state interface is never needed outside of runtime.
interface ScreenFlowState {
	project: Project | null;
	projectOrientation: ProjectOrientation | null;
	reachableScreenCount: number;
	relatedScreenImages: string[];
	screenSize: number;
	selectedTreeNode: FlowTreeNode | null;
	tree: FlowTree | null;
	treeIndex: FlowTreeIndex | null;
}

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Injectable({
	providedIn: "root"
})
export class ScreenFlowRuntime {

	private httpClient: HttpClient;
	private store: SimpleStore<ScreenFlowState>;

	// I initialize the ScreenFlow runtime.
	constructor( httpClient: HttpClient ) {

		this.httpClient = httpClient;

		// NOTE: For the store instance we are NOT USING DEPENDENCY-INJECTION. That's
		// because the store isn't really a "behavior" that we would ever want to swap -
		// it's just a slightly more complex data structure. In reality, it's just a
		// fancy hash/object that can also emit values.
		this.store = new SimpleStore({
			project: null,
			projectOrientation: null,
			reachableScreenCount: this.deriveReachableScreenCount( null ),
			relatedScreenImages: this.deriveRelatedScreenImages( null, null ),
			screenSize: 1,
			selectedTreeNode: null,
			tree: null,
			treeIndex: this.deriveTreeIndex( null )
		});

	}

	// ---
	// COMMAND METHODS.
	// ---

	// I load the given demo-data into the runtime. Returns a promise of success.
	public async load( version: number ) : Promise<void> {

		this.store.setState({
			project: null,
			projectOrientation: null,
			reachableScreenCount: this.deriveReachableScreenCount( null ),
			relatedScreenImages: this.deriveRelatedScreenImages( null, null ),
			selectedTreeNode: null,
			tree: null,
			treeIndex: this.deriveTreeIndex( null )
		});

		// NOTE: Since this is just a proof-of-concept, having the HTTP call right here
		// in the runtime is OK. However, in production, this logic should be moved into
		// a more formal API Client (that would be called from this point).
		var response = await this.httpClient
			.get<any>( `./static/${ version }/data.json` )
			.toPromise()
		;

		// If the store has already been populated while we were executing the async
		// fetch, let's just return-out - another request has already loaded data into
		// the runtime and taken over.
		if ( this.store.getSnapshot().project ) {

			return;

		}

		var treeIndex = this.deriveTreeIndex( response.tree );
		var reachableScreenCount = this.deriveReachableScreenCount( response.tree );
		var relatedScreenImages = this.deriveRelatedScreenImages( null, treeIndex );

		this.store.setState({
			project: response.project,
			projectOrientation: response.projectOrientation,
			reachableScreenCount: reachableScreenCount,
			relatedScreenImages: relatedScreenImages,
			selectedTreeNode: null,
			tree: response.tree,
			treeIndex: treeIndex
		});

	}


	// I select the tree node that is targeted by the given hotspot. Returns a boolean
	// indicating whether or not the selection was successful.
	public selectHotspot( hotspot: FlowTreeHotspot ) : boolean {

		return( this.selectScreenID( hotspot.targetScreenID ) );

	}


	// I select the tree node with the given ID. Returns a boolean indicating whether or
	// not the selection was successful.
	public selectScreenID( screenID: number ) : boolean {

		var treeIndex = this.store.getSnapshot().treeIndex;

		if ( ! treeIndex ) {

			return( false );

		}

		var treeNode = treeIndex[ screenID ];

		if ( ! treeNode ) {

			return( false );

		}

		this.store.setState({
			relatedScreenImages: this.deriveRelatedScreenImages( treeNode, treeIndex ),
			selectedTreeNode: treeNode
		});

		return( true );

	}


	// I select the given tree node. Returns a boolean indicating whether or not the
	// selection was successful.
	public selectTreeNode( treeNode: FlowTreeNode ) : boolean {

		return( this.selectScreenID( treeNode.id ) );

	}


	// I unselect the currently-selected tree node.
	public unselectTreeNode() : void {

		var selectedTreeNode = this.store.getSnapshot().selectedTreeNode;

		if ( ! selectedTreeNode ) {

			return;

		}

		var treeIndex = this.store.getSnapshot().treeIndex;

		this.store.setState({
			relatedScreenImages: this.deriveRelatedScreenImages( null, treeIndex ),
			selectedTreeNode: null
		});

	}


	// I increase the zoom of the flow-tree.
	public zoomIn() : void {

		var screenSize = this.store.getSnapshot().screenSize;

		if ( screenSize < 5 ) {

			this.store.setState({
				screenSize: ( screenSize + 1 )
			});

		}

	}


	// I decrease the zoom of the flow-tree.
	public zoomOut() : void {

		var screenSize = this.store.getSnapshot().screenSize;

		if ( screenSize > 1 ) {

			this.store.setState({
				screenSize: ( screenSize - 1 )
			});

		}

	}

	// ---
	// QUERY METHODS.
	// ---

	// I return a stream for the project. May emit NULL.
	public getProject() : Observable<Project | null> {

		return( this.store.select( "project" ) );

	}


	// I return a stream for the project orientation. May emit null.
	public getProjectOrientation() : Observable<ProjectOrientation | null> {

		return( this.store.select( "projectOrientation" ) );

	}


	// I return a stream for the number of reachable screens in the flow.
	public getReachableScreenCount() : Observable<number> {

		return( this.store.select( "reachableScreenCount" ) );

	}


	// I return a stream for the array of image URLs that can be linked-to from the
	// currently-selected screen in the flow.
	public getRelatedScreenImages() : Observable<string[]> {

		return( this.store.select( "relatedScreenImages" ) );

	}


	// I return a stream for the screen size.
	public getScreenSize() : Observable<number> {

		return( this.store.select( "screenSize" ) );

	}


	// I return a stream for the selected tree node. May emit null.
	public getSelectedTreeNode(): Observable<FlowTreeNode | null> {

		return( this.store.select( "selectedTreeNode" ) );

	}


	// I return a stream for the tree. May emit null.
	public getTree() : Observable<FlowTree | null> {

		return( this.store.select( "tree" ) );

	}

	// ---
	// PRIVATE METHODS.
	// ---

	// I return the number of screens that are reachable in the given tree.
	private deriveReachableScreenCount( tree: FlowTree | null ) : number {

		// If we have no tree yet, no screens can be reached (obviously).
		if ( ! tree ) {

			return( 0 );

		}

		return( walkTreeNodes( tree.root ) );

		// -- Hoisted functions.

		function walkTreeNodes( node: FlowTreeNode ) : number {

			var count = 1;

			for ( var linkedNode of node.links ) {

				count += walkTreeNodes( linkedNode );

			}

			return( count );

		}

	}


	// I return an array of image URLs that can be linked-to from the currently-selected
	// screen in the flow.
	private deriveRelatedScreenImages(
		selectedTreeNode: FlowTreeNode | null,
		treeIndex: FlowTreeIndex | null
		) : string[] {

		var imageUrls: string[] = [];
		var targetNode;

		if ( selectedTreeNode && selectedTreeNode.hotspots && treeIndex ) {

			for ( var hotspot of selectedTreeNode.hotspots ) {

				if ( targetNode = treeIndex[ hotspot.targetScreenID ] ) {

					imageUrls.push( targetNode.screen.imageUrl );

				}

			}

		}

		return( imageUrls );

	}


	// I return an index of the tree that maps IDs to tree nodes.
	private deriveTreeIndex( tree: FlowTree | null ) : FlowTreeIndex | null {

		// If we have no tree yet, we can't build an index.
		if ( ! tree ) {

			return( null );

		}

		var index: FlowTreeIndex = Object.create( null );
		var nodesToVisit = [ tree.root ];

		while ( nodesToVisit.length ) {

			var node = nodesToVisit.shift() !; // Asserting non-null.

			index[ node.id ] = node;

			nodesToVisit.push( ...node.links );

		}

		return( index );

	}

}
