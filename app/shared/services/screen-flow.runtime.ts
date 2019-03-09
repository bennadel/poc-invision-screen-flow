
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

export interface FlowTreeNode {
	hardLinkIDs: number[];
	softLinkIDs: number[];
	screen: FlowTreeScreen;
}

export interface FlowTreeScreen {
	clientFilename: string;
	height: number;
	hotspots?: FlowTreeHotspot[];
	id: number;
	imageUrl: string;
	links: FlowTreeNode[];
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
	// PUBLIC METHODS.
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


	public getScreenSize() : Observable<number> {

		return( this.store.select( "screenSize" ) );

	}


	public getSelectedTreeNode(): Observable<FlowTreeNode | null> {

		return( this.store.select( "selectedTreeNode" ) );

	}


	public getTree() : Observable<FlowTree | null> {

		return( this.store.select( "tree" ) );

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


	public async load( version: 1 ) : Promise<void> {

		this.store.setState({
			isLoading: true,
			project: null,
			projectOrientation: null,
			selectedTreeNode: null,
			tree: null
		});

		var promise = this.httpClient
			.get( `./static/${ version }/data.json` )
			.toPromise()
			.then(
				( response: any ) => {

					this.store.setState({
						isLoading: false,
						project: response.project,
						projectOrientation: response.projectOrientation,
						tree: response.tree
					});

				}
			)
		;

		return( promise );

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
	// PRIVATE METHODS.
	// ---

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
			tree: null
		};

		return( initialState );

	}

}
