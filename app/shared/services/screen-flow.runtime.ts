
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
	isLoading: boolean;
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

	public async load( version: 1 ) : Promise<void> {

		this.store.setState({
			isLoading: true,
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
						isLoading: false,
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


	public selectScreenID( screenID: number ) : boolean {

		var treeIndex = this.store.getSnapshot().treeIndex;

		if ( ! treeIndex ) {

			return( false );

		}

		var treeNode = treeIndex[ screenID ];

		if ( ! treeNode ) {

			return( false );

		}

		this.selectTreeNode( treeNode );
		return( true );

	}


	public selectTreeNode( treeNode: FlowTreeNode ) : void {

		this.store.setState({
			selectedTreeNode: treeNode
		});

	}


	public unselectTreeNode() : void {

		this.store.setState({
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

	public getIsLoading() : Observable<boolean> {

		return( this.store.select( "isLoading" ) );

	}


	public getProject() : Observable<Project | null> {

		return( this.store.select( "project" ) );

	}


	public getProjectOrientation() : Observable<ProjectOrientation | null> {

		return( this.store.select( "projectOrientation" ) );

	}


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


	public getScreenSize() : Observable<number> {

		return( this.store.select( "screenSize" ) );

	}


	public getSelectedTreeNode(): Observable<FlowTreeNode | null> {

		return( this.store.select( "selectedTreeNode" ) );

	}


	public getTree() : Observable<FlowTree | null> {

		return( this.store.select( "tree" ) );

	}


	public getTreeIndex() : Observable<FlowTreeIndex | null> {

		return( this.store.select( "treeIndex" ) );

	}


	// I return a stream that contains the number of unreachable screen in the screen
	// flow.
	public getUnreachableScreenCount() : Observable<number> {

		var stream = this.store.select( "tree" );

		var reducedStream = stream.pipe(
			map(
				( tree ) => {

					if ( ! tree ) {

						return( 0 );

					}

					return( tree.unreachable.length );

				}
			)
		);

		return( reducedStream );

	}

	// ---
	// PRIVATE METHODS.
	// ---

	private buildTreeIndex( tree: FlowTree ) : FlowTreeIndex {

		var index: FlowTreeIndex = Object.create( null );
		var nodesToVisit = [ tree.root ];

		while ( nodesToVisit.length ) {

			var node = ( nodesToVisit.shift() as FlowTreeNode );

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
			isLoading: true,
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
