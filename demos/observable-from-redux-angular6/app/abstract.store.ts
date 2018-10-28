
// Import the core angular services.
import { BehaviorSubject } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";
import { ErrorHandler } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

export abstract class AbstractStore<StateType = any, ActionTypes = any> {

	private errorHandler: ErrorHandler;
	private stateSubject: BehaviorSubject<StateType>;

	// I initialize the concrete class that extends the Abstract Store.
	constructor( errorHandler: ErrorHandler ) {

		this.errorHandler = errorHandler;

		// I provide an ingress and egress stream for the current state. When a new
		// action is dispatched into the store, the results of the reduction will be
		// emitted into this stream.
		this.stateSubject = new BehaviorSubject( this.getInitialState() );

	}

	// ---
	// PUBLIC METHODS.
	// ---

	// I dispatch the given action to the store reducers.
	public dispatch( action: ActionTypes ) : void {

		// Since the .reduce() function is outside our scope of control, we can't trust
		// it. As such, we have to assume that it can throw an error; and, if so, we have
		// to catch that error such that we don't push the error handling responsibility
		// down onto the calling context.
		try {

			this.stateSubject.next(
				this.reduce( this.getStateSnapshot(), action )
			);

		} catch ( error ) {

			this.errorHandler.handleError( error );

		}

	}


	// I get the current state as a stream (will always emit the current state value as
	// the first item in the stream).
	public getState(): Observable<StateType> {

		return( this.stateSubject.pipe( distinctUntilChanged() ) );

	}


	// I get the current state snapshot.
	public getStateSnapshot() : StateType {

		return( this.stateSubject.getValue() );

	}


	// I return the given top-level state key as a stream (will always emit the current
	// key value as the first item in the stream).
	public select<K extends keyof StateType>( key: K ) : Observable<StateType[K]> {

		var selectStream = this.stateSubject.pipe(
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
