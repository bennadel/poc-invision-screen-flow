
// Import the core angular services.
import { Component } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { SimpleChanges } from "@angular/core";

// Import the application components and services.
import { FlowTreeNode } from "~/app/shared/services/screen-flow.runtime";
import { ProjectOrientation } from "~/app/shared/services/screen-flow.runtime";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

interface IDMap {
	[ id: number ]: "hard" | "soft";
}

@Component({
	selector: "inv-screen-tree-node",
	inputs: [
		"hintedTreeNodeIds",
		"screenOrientation",
		"screenSize",
		"selectedTreeNode",
		"treeNode"
	],
	outputs: [
		"hideHintsEvents: hideHints",
		"selectEvents: select",
		"showHintsEvents: showHints"
	],
	styleUrls: [ "./screen-tree-node.component.less" ],
	templateUrl: "./screen-tree-node.component.htm"
})
export class ScreenTreeNodeComponent {

	public hideHintsEvents: EventEmitter<FlowTreeNode>;
	public hintedTreeNodeIds!: IDMap | null;
	public isScreenHinted: boolean;
	public isScreenSelected: boolean;
	public screenOrientation!: ProjectOrientation;
	public screenSize!: number;
	public selectedTreeNode!: FlowTreeNode | null;
	public selectEvents: EventEmitter<FlowTreeNode>;
	public showHintsEvents: EventEmitter<FlowTreeNode>;
	public treeNode!: FlowTreeNode;
	

	// I initialize the screen-detail component.
	constructor() {

		this.hideHintsEvents = new EventEmitter();
		this.hintedTreeNodeIds = null;
		this.isScreenHinted = false;
		this.isScreenSelected = false;
		this.selectEvents = new EventEmitter();
		this.showHintsEvents = new EventEmitter();

	}

	// ---
	// PUBLIC METHODS.
	// ---

	public handleHideHints( treeNode: FlowTreeNode ) : void {
		
		this.hideHintsEvents.emit( treeNode );

	}


	public handleSelect( treeNode: FlowTreeNode ) : void {

		this.selectEvents.emit( treeNode );

	}


	public handleShowHints( treeNode: FlowTreeNode ) : void {

		this.showHintsEvents.emit( treeNode );

	}


	public ngOnChanges( changes: SimpleChanges ) : void {

		if ( changes.hintedTreeNodeIds ) {

			this.applyHintedTreeNodeIds();

		}

		if ( changes.selectedTreeNode ) {

			this.applySelectedTreeNode();

		}

	}

	// ---
	// PRIVATE METHODS.
	// ---

	private applyHintedTreeNodeIds() : void {

		if ( ! this.hintedTreeNodeIds ) {

			this.isScreenHinted = false;
			return;

		}

		this.isScreenHinted = ( this.treeNode.id in this.hintedTreeNodeIds );

	}


	private applySelectedTreeNode() : void {

		this.isScreenSelected = ( this.treeNode === this.selectedTreeNode );

	}

}
