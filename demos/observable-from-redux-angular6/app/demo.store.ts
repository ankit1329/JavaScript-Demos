
// Import the core angular services.
import { ErrorHandler } from "@angular/core";
import { Injectable } from "@angular/core";

// Import the application components and services.
import { AbstractStore } from "./abstract.store";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

// I am a utility base-class for all of the actions that this will be dispatched on
// the abstract store. The only guarantee that this class makes is a read-only Type.
abstract class Action {

	public readonly type: string;

}


// I am a utility sub-class / base-class for all of the payload-heavy actions that
// will be dispatched on the abstract store. This class guarantees a payload with a
// given interface.
abstract class ActionWithPayload<T> extends Action {

	public readonly payload: T;

	// I initialize the action instance with the given payload.
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

export class ActionTypeA extends ActionWithPayload<ActionTypeAPayload> {
	static readonly type = "ActionTypeA";
	public readonly type = ActionTypeA.type;
}

export interface ActionTypeBPayload {
	bar: string;
}

export class ActionTypeB extends ActionWithPayload<ActionTypeBPayload> {
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
console.log( "reducer.", action.payload );
		switch ( action.type ) {
			case ActionTypeA.type:

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
