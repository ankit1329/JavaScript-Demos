
// Import the core angular services.
import { Injectable } from "@angular/core";

// Import the application components and services.
import { AbstractAction } from "./abstract.store";
import { AbstractActionWithPayload } from "./abstract.store";
import { AbstractStore } from "./abstract.store";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

export interface ActionTypeAPayload {
	foo: string;
}

export class ActionTypeA extends AbstractActionWithPayload<ActionTypeAPayload> {
	static readonly type = "ActionTypeA";
	public readonly type = ActionTypeA.type;
}

export interface ActionTypeBPayload {
	bar: string;
}

export class ActionTypeB extends AbstractActionWithPayload<ActionTypeBPayload> {
	static readonly type = "ActionTypeB";
	public readonly type = ActionTypeB.type;
}

export type ActionTypes = 
	ActionTypeA |
	ActionTypeB
;

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

export interface DemoState {
	messages: Message[]
}

export interface Message {
	id: string;
	text: string;
}

@Injectable({
	providedIn: "root"
})
export class DemoStore extends AbstractStore<DemoState, ActionTypes> {

	protected getInitialState() : DemoState {

		var s: DemoState = {
			messages: []
		};

		return( s );

	}

	protected reduce( state: DemoState, action: ActionTypes ) : DemoState {

		switch ( action.type ) {
			case ActionTypeA.type:
				return({
					messages: this.reduceMessages( state.messages, action )
				});
			break;
			default:
				return( state );
			break;
		}

	}

	private reduceMessages( messages: Message[], action: ActionTypes ) : Message[] {

		return([
			{
				id: "1",
				text: "cool thing"
			}
		]);

	}

}
