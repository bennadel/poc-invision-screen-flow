
// Import the core angular services.
import { Component } from "@angular/core";
import { EventEmitter } from "@angular/core";

// Import the application components and services.
import { FlowTreeNode } from "~/app/shared/services/screen-flow.runtime";
import { ProjectOrientation } from "~/app/shared/services/screen-flow.runtime";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

interface IDMap {
	[ id: number ]: "hard" | "soft";
}

@Component({
	selector: "inv-screen-tree",
	inputs: [
		"rootTreeNode",
		"screenOrientation",
		"screenSize",
		"selectedTreeNode"
	],
	outputs: [
		"selectEvents: select"
	],
	styleUrls: [ "./screen-tree.component.less" ],
	templateUrl: "./screen-tree.component.htm"
})
export class ScreenTreeComponent {

	public hintedTreeNodeIds: IDMap | null;
	public rootTreeNode!: FlowTreeNode;
	public screenOrientation!: ProjectOrientation;
	public screenSize!: number;
	public selectedTreeNode!: FlowTreeNode | null;
	public selectEvents: EventEmitter<FlowTreeNode>;

	// I initialize the screen-detail component.
	constructor() {

		this.hintedTreeNodeIds = null;
		this.selectEvents = new EventEmitter();

	}

	// ---
	// PUBLIC METHODS.
	// ---

	public handleHideHints( treeNode: FlowTreeNode ) : void {
		
		this.hintedTreeNodeIds = null;

	}


	public handleSelect( treeNode: FlowTreeNode ) : void {

		this.selectEvents.emit( treeNode );

	}


	public handleShowHints( treeNode: FlowTreeNode ) : void {

		this.hintedTreeNodeIds = {};

		for ( var id of treeNode.hardLinkIDs ) {

			this.hintedTreeNodeIds[ id ] = "hard";

		}

		for ( var id of treeNode.softLinkIDs ) {

			this.hintedTreeNodeIds[ id ] = "soft";

		}

	}

}
