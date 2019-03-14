
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

export interface ScreenFlowState {
	project: Project | null;
	projectOrientation: ProjectOrientation | null;
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
		this.store = new SimpleStore( this.getInitialState() );

	}

	// ---
	// COMMAND METHODS.
	// ---

	// I load the given demo-data into the runtime. Returns a promise of success.
	public async load( version: number ) : Promise<void> {

		this.store.setState({
			project: null,
			projectOrientation: null,
			selectedTreeNode: null,
			tree: null,
			treeIndex: null
		});

		// NOTE: Since this is just a proof-of-concept, having the HTTP call right here
		// in the runtime is OK. However, in production, this logic should be moved into
		// a more formal API Client.
		var promise = this.httpClient
			.get( `./static/${ version }/data.json` )
			.toPromise()
			.then(
				( response: any ) => {

					this.store.setState({
						project: response.project,
						projectOrientation: response.projectOrientation,
						tree: response.tree,
						treeIndex: this.buildTreeIndex( response.tree )
					});

				}
			)
		;

		return( promise );

	}


	// I select the tree node that is targeted by the given hotspot.
	public selectHotspot( hotspot: FlowTreeHotspot ) : void {

		var treeIndex = this.store.getSnapshot().treeIndex;

		if ( ! treeIndex ) {

			return;

		}

		var treeNode = treeIndex[ hotspot.targetScreenID ];

		if ( ! treeNode ) {

			return;

		}

		this.selectTreeNode( treeNode );

	}


	// I select the tree node with the given ID.
	public selectScreenID( screenID: number ) : void {

		var treeIndex = this.store.getSnapshot().treeIndex;

		if ( ! treeIndex ) {

			return;

		}

		var treeNode = treeIndex[ screenID ];

		if ( ! treeNode ) {

			return;

		}

		this.selectTreeNode( treeNode );

	}


	// I select the given tree node.
	public selectTreeNode( treeNode: FlowTreeNode ) : void {

		this.store.setState({
			selectedTreeNode: treeNode
		});

	}


	// I unselect the currently-selected tree node.
	public unselectTreeNode() : void {

		var selectedTreeNode = this.store.getSnapshot().selectedTreeNode;

		if ( selectedTreeNode ) {

			this.store.setState({
				selectedTreeNode: null
			});

		}

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

		var stream = this.store.select( "tree" );

		var reducedStream = stream.pipe(
			map(
				( tree ) => {

					if ( ! tree ) {

						return( 0 );

					}

					function walkTreeNodes( node: FlowTreeNode ) : number {

						var count = 1;

						for ( var i = 0, length = node.links.length ; i < length ; i++ ) {

							count += walkTreeNodes( node.links[ i ] );

						}

						return( count );

					}

					return( walkTreeNodes( tree.root ) );

				}
			)
		);

		return( reducedStream );

	}


	// I return an array of image URLs that can be linked-to from the currently-selected
	// screen in the flow.
	// --
	// ASIDE: Why not return this as a stream? It seemed more complicated to return this
	// a stream, considering that it depends on several parts of the state. But, I don't
	// feel strongly.
	public getRelatedScreenImages() : string[] {

		var snapshot = this.store.getSnapshot();
		var imageUrls: string[] = [];

		if ( snapshot.selectedTreeNode && snapshot.selectedTreeNode.hotspots && snapshot.treeIndex ) {

			var index = snapshot.treeIndex;

			snapshot.selectedTreeNode.hotspots.forEach(
				( hotspot ) => {

					var targetNode = index[ hotspot.targetScreenID ];

					if ( targetNode ) {

						imageUrls.push( targetNode.screen.imageUrl );

					}

				}
			);

		}

		return( imageUrls );

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

	// I build an index of the tree that maps IDs to tree nodes.
	private buildTreeIndex( tree: FlowTree ) : FlowTreeIndex {

		var index: FlowTreeIndex = Object.create( null );
		var nodesToVisit = [ tree.root ];

		while ( nodesToVisit.length ) {

			var node = nodesToVisit.shift() !; // Asserting non-null.

			index[ node.id ] = node;

			nodesToVisit.push( ...node.links );

		}

		return( index );

	}


	// I return the initial state for the underlying store.
	private getInitialState() : ScreenFlowState {

		// NOTE: Because we are using a string-literal as a "type", we have to help
		// TypeScript by using a type annotation on our initial state. Otherwise, it
		// won't be able to infer that our string is compatible with the type.
		var initialState: ScreenFlowState = {
			project: null,
			projectOrientation: null,
			screenSize: 1,
			selectedTreeNode: null,
			tree: null,
			treeIndex: null
		};

		return( initialState );

	}

}
