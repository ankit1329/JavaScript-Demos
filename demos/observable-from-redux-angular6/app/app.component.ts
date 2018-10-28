
// Import the core angular services.
import { Component } from "@angular/core";

// Import the application components and services.
import { ActionTypeA } from "./demo.store";
import { ActionTypeB } from "./demo.store";
import { DemoStore } from "./demo.store";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Component({
	selector: "my-app",
	styleUrls: [ "./app.component.less" ],
	template:
	`
		test
	`
})
export class AppComponent {

	// I initialize the app component.
	constructor( demoStore: DemoStore ) {

		demoStore.dispatch( new ActionTypeA({ foo: "A" }) );
		demoStore.dispatch( new ActionTypeA({ foo: "B" }) );
		demoStore.dispatch( new ActionTypeA({ foo: "C" }) );


//		console.log( demoStore.getStateSnapshot() );

		demoStore.getState().subscribe(
			( state ) => {
				console.log( "STATE:", state );
			}
		);

	}

}
