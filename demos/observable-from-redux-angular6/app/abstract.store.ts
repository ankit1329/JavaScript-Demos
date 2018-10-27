
// Import the core angular services.
import { distinctUntilChanged } from "rxjs/operators";
import { ErrorHandler } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { shareReplay } from "rxjs/operators";
import { retry } from "rxjs/operators";
import { scan } from "rxjs/operators";
import { startWith } from "rxjs/operators";
import { Subject } from "rxjs";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

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
console.log( "SCANNNNNN", currentAction );
					// Since the .reduce() function is outside our scope of control, we
					// can't trust it. As such, we have to assume it can throw an error;
					// and, if so, we have to catch that error such that we don't end any
					// active subscriptions to the stateStream.
					try {

						return( this.state = this.reduce( currentState, currentAction ) );

					} catch ( error ) {

						errorHandler.handleError( error );

						return( currentState );
						
					}

				}
			),
			shareReplay( 1 )
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

	protected getInitialState() : StateType {

		throw( new Error( "The abstract method [getInitialState] must be implemented." ) );

	}


	protected reduce( state: StateType, action: ActionTypes ) : StateType {

		throw( new Error( "The abstract method [reduce] must be implemented." ) );

	}

}
