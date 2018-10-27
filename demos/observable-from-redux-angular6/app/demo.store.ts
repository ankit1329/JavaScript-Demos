
// Import the core angular services.
import { Injectable } from "@angular/core";

// Import the application components and services.
import { AbstractStore } from "./abstract.store";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

// I am a utility base-class for all of the actions that this will be dispatched on
// the abstract store. The only guarantee that this class makes is a read-only Type.
abstract class AbstractAction {

	public readonly type: string;

}


// I am a utility sub-class / base-class for all of the payload-heavy actions that
// will be dispatched on the abstract store. This class guarantees a payload with a
// given interface.
abstract class AbstractActionWithPayload<T> extends AbstractAction {

	public readonly payload: T;

	constructor( payload: T ) {
	
		super();
		this.payload = payload;

	}

}

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
				console.log( ".... A", action );
				return({
					messages: this.reduceMessages( state.messages, action )
				});
			break;
			default:
				console.log( ".... default" );
				return( state );
			break;
		}

	}

	private reduceMessages( messages: Message[], action: ActionTypeA ) : Message[] {
		
		return messages.concat({
			id: Date.now().toString(),
			text: action.payload.foo
		});

	}

}
