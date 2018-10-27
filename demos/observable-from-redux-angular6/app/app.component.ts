
// Import the core angular services.
import { Component } from "@angular/core";

// Import the application components and services.
import { ActionTypeA } from "./demo.store";
import { ActionTypeB } from "./demo.store";
import { DemoStore } from "./demo.store";


import { EventTypeA } from "./message-bus-events";
import { EventTypeB } from "./message-bus-events";
import { EventTypeC } from "./message-bus-events";
import { EventTypeD } from "./message-bus-events";
import { EventTypes } from "./message-bus-events";
import { MessageBusGroup } from "./message-bus";
import { MessageBusService } from "./message-bus";

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

		var s = demoStore.getStateAsStream().subscribe(
			( state ) => {
				console.log( "Initial state", state );
			}
		);

		demoStore.dispatch( new ActionTypeA({ foo: "foopa" }) );

		s.unsubscribe();

		setTimeout(
			() => {

				console.log( "--------" )

				var s2 = demoStore.getStateAsStream().subscribe(
					( state ) => {
						console.log( "Subsequent state", state );
					}
				);

				demoStore.dispatch( new ActionTypeA({ foo: "banana" }) );

				s2.unsubscribe();

				demoStore.dispatch( new ActionTypeA({ foo: "hammock" }) );

			},
			1000
		);



		setTimeout(
			() => {

				console.log( "--------" )

				var s3 = demoStore.getStateAsStream().subscribe(
					( state ) => {
						console.log( "S3 state", state );
					}
				);

			},
			2000
		);

	}

}
