
// Import the core angular services.
import { distinctUntilChanged } from "rxjs/operators";
import { ErrorHandler } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { retry } from "rxjs/operators";
import { scan } from "rxjs/operators";
import { startWith } from "rxjs/operators";
import { Subject } from "rxjs";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //


// I am a utility base-class for all of the actions that this will be dispatched on
// the abstract store. The only guarantee that this class makes is a read-only Type.
export abstract class AbstractAction {

	public readonly type: string;

}


// I am a utility sub-class / base-class for all of the payload-heavy actions that
// will be dispatched on the abstract store. This class guarantees a payload with a
// given interface.
export abstract class AbstractActionWithPayload<T> extends AbstractAction {

	public readonly payload: T;

	constructor( payload: T ) {
	
		super();
		this.payload = payload;

	}

}


export abstract class AbstractStore<StateType = any, ActionTypes = any> {

	private actionStream: Subject<ActionTypes>;
	private state: StateType;
	private stateStream: Observable<StateType>;

	constructor( errorHandler: ErrorHandler ) {

		this.state = this.getInitialState();

		this.actionStream = new Subject();
		this.stateStream = this.actionStream.pipe(
			startWith( this.state ),
			scan(
				( currentState: StateType, currentAction: ActionTypes ) : StateType => {

					// Since the .reduce() function is outside our scope of control, we
					// can't trust it. As such, we have to assume it can throw an error;
					// and, if so, we have to catch that error such that we don't end any
					// active subscriptions to the stateStream.
					try {

						return( this.reduce( currentState, currentAction ) );

					} catch ( error ) {

						errorHandler.handleError( error );

						return( currentState );
						
					}

				}
			)
		);

	}

	// ---
	// PUBLIC METHODS.
	// ---

	public dispatch( action: ActionTypes ) : void {

		this.actionStream.next( action );

	}


	public getState() : StateType {

		return( this.state );

	}


	public getStateAsStream(): Observable<StateType> {

		return( this.stateStream );

	}


	public select<K extends keyof StateType>( key: K ) : Observable<StateType[K]> {

		var keyStream = this.stateStream.pipe(
			map(
				( state: StateType ) => {

					return( state[ key ] );

				}
			),
			distinctUntilChanged()
		);

		return( keyStream );

	}

	// ---
	// PRIVATE METHODS.
	// ---


	// ---
	// PRIVATE METHODS.
	// ---

	protected getInitialState() : StateType {

		throw( new Error( "The abstract method [getInitialState] must be implemented." ) );

	}


	protected reduce( state: StateType, action: ActionTypes ) : StateType {

		throw( new Error( "The abstract method [reduce] must be implemented." ) );

	}

}
