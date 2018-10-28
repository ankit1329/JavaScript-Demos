
// Import the core angular services.
import { ConnectableObservable } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";
import { ErrorHandler } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { publishReplay } from "rxjs/operators";
import { scan } from "rxjs/operators";
import { startWith } from "rxjs/operators";
import { Subject } from "rxjs";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

export abstract class AbstractStore<StateType = any, ActionTypes = any> {

	private actionStream: Subject<ActionTypes>;
	private errorHandler: ErrorHandler;
	private state: StateType;
	private stateStream: Observable<StateType>;

	// I initialize the concrete class that extends the Abstract Store.
	constructor( errorHandler: ErrorHandler ) {

		this.errorHandler = errorHandler;

		// I keep track of the current state snapshot.
		this.state = this.getInitialState();

		// I provide an ingress stream for dispatched actions.
		this.actionStream = new Subject();

		// I provide an egress stream for the reduced state. As actions are piped into
		// the actionStream, they will be passed through the reduce() method and then
		// stored into the current state snapshot.
		this.stateStream = this.actionStream.pipe(
			startWith( this.state ),
			scan(
				( currentState: StateType, action: ActionTypes ) : StateType => {

					// Since the .reduce() function is outside our scope of control, we
					// can't trust it. As such, we have to assume that it can throw an
					// error; and, if so, we have to catch that error such that we don't
					// push the error handling responsibility down onto the subscribers.
					try {

						return( this.state = this.reduce( currentState, action ) );

					} catch ( error ) {

						this.errorHandler.handleError( error );

						// Since the reduce did not alter the state, just forward the
						// current state aggregation.
						return( currentState );
						
					}

				}
				// this.state
			),
			// I ensure that if the state was not changed by the action, we don't emit a
			// new value down to the subscribers.
			distinctUntilChanged(),
			// Right now, the state stream is a COLD stream which means that it will only
			// process actions if someone has subscribed to it. In order to enable
			// actions to be processed prior to a subscription, we have to convert it
			// from a COLD stream to a HOT stream. To do this, we will publish the
			// COLD stream. This will allow it to be multi-casted.
			// --
			// NOTE: the "replay" part of "publishReplay()" will allow all new stream
			// subscribers to immediately get the last emitted value.
			publishReplay( 1 )
		);

		// Now that we've created a mulit-casting stream, we need to connect the HOT
		// stream to the underlying COLD stream such that events will start flowing.
		// --
		// NOTE: The typing for .pipe() does not understand the connected observable. As
		// such, we have to cast it before we call connect.
		// --
		// READ MORE: https://stackoverflow.com/questions/50371887/rxjs-6-get-connectableobservable-from-observable
		( this.stateStream as ConnectableObservable<StateType> ).connect();

	}

	// ---
	// PUBLIC METHODS.
	// ---

	// I dispatch the given action to the store reducers.
	public dispatch( action: ActionTypes ) : void {

		this.actionStream.next( action );

	}


	// I get the current state snapshot.
	public getState() : StateType {

		return( this.state );

	}


	// I get the current state as a stream (will always emit the current state value as
	// the first item in the stream).
	public getStateAsStream(): Observable<StateType> {

		return( this.stateStream );

	}


	// I return the given top-level state key as a stream (will always emit the current
	// key value as the first item in the stream).
	public select<K extends keyof StateType>( key: K ) : Observable<StateType[K]> {

		var selectStream = this.stateStream.pipe(
			map(
				( state: StateType ) => {

					return( state[ key ] );

				}
			),
			distinctUntilChanged()
		);

		return( selectStream );

	}

	// ---
	// PRIVATE METHODS.
	// ---

	// ABSTRACT METHOD: I return the initial value of the state snapshot.
	protected getInitialState() : StateType {

		throw( new Error( "The abstract method [getInitialState] must be implemented." ) );

	}


	// ABSTRACT METHOD: I return the new state value based on the given action.
	protected reduce( state: StateType, action: ActionTypes ) : StateType {

		throw( new Error( "The abstract method [reduce] must be implemented." ) );

	}

}
